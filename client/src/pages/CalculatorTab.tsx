/**
 * BOROPRO THERMAL STRESS CALCULATOR — DEBUGGED VERSION
 *
 * BUGS FIXED FROM PREVIOUS VERSION:
 * 1. Plate cross-sectional area: changed from (t * W) to (L * W)
 *    - Heat flows perpendicular through thickness; cross-section is the face area
 * 2. Cylinder cross-sectional area: changed from (r² - r_inner²)² / 4 to π(r² - r_inner²)
 *    - Radial heat flow uses annular ring area, not squared
 * 3. Working time formula: changed denominator from (U * crossArea) to (U * surfaceArea)
 *    - U is the heat transfer coefficient [W/m²·K], must multiply by surface area for convection
 */

import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// ============================================================
// PART 1: GLASS MATERIAL CONSTANTS — Pyrex Borosilicate
// ============================================================

const GLASS = {
  lambda:      1.14,        // Thermal conductivity          [W/(m·K)]
  rho:         2230,        // Density                       [kg/m³]
  cp:          840,         // Specific heat                 [J/(kg·K)]
  alpha_ex:    33e-7,       // Thermal expansion coefficient [K⁻¹]
  E:           63e9,        // Young's modulus               [Pa]
  mu:          0.20,        // Poisson's ratio               [-]
  Tg:          565,         // Glass transition temperature  [°C]
  T_strain:    510,         // NIST strain point             [°C]
  T_work:      565,         // Annealing hold temperature    [°C]
  T_env:       25,          // Ambient room temperature      [°C]
  sigma_sb:    5.67037e-8,  // Stefan-Boltzmann constant     [W/m²·K⁴]
  epsilon:     0.85,        // Emissivity of borosilicate    [-]
  h_c_ext:     10.0,        // External air convection coeff [W/m²·K]
  h_c_int:     5.0,         // Internal air convection coeff [W/m²·K]
  tensile_limit: 50,        // Borosilicate tensile limit    [MPa]
  PI:          3.14159265359,
};

// ============================================================
// PART 2: RADIATIVE HEAT TRANSFER COEFFICIENT
// ============================================================

function calcRadiativeCoeff(): number {
  const T_s   = GLASS.T_work + 273.15;   // Glass surface [K]
  const T_env = GLASS.T_env  + 273.15;   // Ambient room [K]
  return GLASS.epsilon * GLASS.sigma_sb *
    (T_s * T_s + T_env * T_env) * (T_s + T_env);
}

// ============================================================
// PART 3: SHAPE PARAMETERS — CORRECTED CROSS-SECTIONAL AREAS
// ============================================================

function getShapeParameters(inputs: {
  shape: string;
  thickness: number;  // mm
  radius: number;     // mm
  length: number;     // mm
  width: number;      // mm
}) {
  const t  = inputs.thickness / 1000;   // [m]
  const r  = inputs.radius    / 1000;   // [m]
  const L  = inputs.length    / 1000;   // [m]
  const W  = inputs.width     / 1000;   // [m]
  const { rho, lambda, h_c_ext, h_c_int, PI } = GLASS;

  const h_r = calcRadiativeCoeff();

  switch (inputs.shape) {

    case 'plate': {
      // ---- FLAT PLATE — one-sided cooling ----
      const b           = 1.000;
      const d           = t;
      const surfaceArea = L * W;
      // BUG FIX: Cross-sectional area for heat flow through plate = face area (L * W)
      // NOT (t * W) — the thickness is the distance heat travels, not part of the cross-section
      const crossArea   = L * W;                     // [m²] CORRECTED
      const mass        = rho * t * surfaceArea;
      const U = 1 / ((t / (2 * lambda)) + (1 / (h_c_ext + h_r)));
      return { b, d, surfaceArea, crossArea, mass, U, label: 'Flat Plate' };
    }

    case 'cylinder': {
      // ---- HOLLOW CYLINDER — radial cooling ----
      if (t >= r) throw new Error(
        `Wall thickness (${inputs.thickness} mm) must be less than radius (${inputs.radius} mm).`
      );
      const b           = 0.500;
      const d           = t;
      const r_inner     = r - t;
      const surfaceArea = (2 * PI * (r * r - r_inner * r_inner)) + (2 * PI * r * L);
      // BUG FIX: Cross-sectional area for radial heat flow = annular ring area π(r² - r_inner²)
      // NOT (r² - r_inner²)² / 4 — that was incorrectly squaring the annular area
      const crossArea   = PI * (r * r - r_inner * r_inner);  // [m²] CORRECTED
      const mass        = rho * PI * (r * r - r_inner * r_inner) * L;
      const U = 1 / ((1 / h_c_int) + (t / lambda) + (1 / (h_c_ext + h_r)));
      return { b, d, surfaceArea, crossArea, mass, U, label: 'Hollow Cylinder' };
    }

    case 'sphere': {
      // ---- SOLID SPHERE — radius only input ----
      const b           = 0.333;
      const d           = r;
      const surfaceArea = 4 * PI * r * r;
      // Cross-sectional area for radial heat flow through sphere = π * r²
      const crossArea   = PI * r * r;                // [m²]
      const mass        = rho * (4 / 3) * PI * r * r * r;
      const U = 1 / ((r / (3 * lambda)) + (1 / (h_c_ext + h_r)));
      return { b, d, surfaceArea, crossArea, mass, U, label: 'Solid Sphere' };
    }

    default:
      throw new Error(`Invalid shape: ${inputs.shape}`);
  }
}

// ============================================================
// PART 4: MATERIAL CONSTANT M
// ============================================================

function calcMaterialConstant(): number {
  const { E, alpha_ex, mu, rho, cp, lambda } = GLASS;
  const term1 = (E * alpha_ex) / (1 - mu);
  const term2 = (rho * cp) / lambda;
  return (term1 * term2) / 1e6;
}

// ============================================================
// PART 5: WORKING TIME — CORRECTED FORMULA
// Newton's Law of Cooling:
// t = (m * cp / (U * A_surface)) * ln((T_work - T_env) / (T_strain - T_env))
// ============================================================

function calcWorkingTime(mass: number, U: number, surfaceArea: number): number {
  // BUG FIX: Use surfaceArea (not crossArea) in denominator
  // U [W/m²·K] × surfaceArea [m²] = [W/K] which matches units of (mass × cp) [J/K]
  const { cp, T_work, T_strain, T_env } = GLASS;
  const tempRatio = (T_work - T_env) / (T_strain - T_env);
  return (mass * cp / (U * surfaceArea)) * Math.log(tempRatio);  // [s] CORRECTED
}

// ============================================================
// PART 6: THERMAL STRESS & MAX COOLING RATE
// ============================================================

function calcStressAndCooling(M: number, d: number, b: number,
  mass: number, U: number, surfaceArea: number) {
  const h_cool  = (U * surfaceArea) / (mass * GLASS.cp);
  const h_max   = GLASS.tensile_limit / (M * d ** 2 * b);
  const sigma   = M * h_cool * d ** 2 * b;
  return { h_cool, h_max, sigma };
}

// ============================================================
// PART 7: MAIN CALCULATION FUNCTION
// ============================================================

function runCalculation(inputs: {
  shape: string;
  thickness: number;
  radius: number;
  length: number;
  width: number;
}) {
  if (inputs.shape !== 'sphere' && inputs.thickness <= 0)
    throw new Error('Thickness must be greater than zero.');
  if ((inputs.shape === 'cylinder' || inputs.shape === 'sphere') && inputs.radius <= 0)
    throw new Error('Radius must be greater than zero.');
  if (inputs.shape === 'cylinder' && inputs.thickness >= inputs.radius)
    throw new Error(`Wall thickness must be less than radius.`);
  if (inputs.shape === 'plate' && (inputs.length <= 0 || inputs.width <= 0))
    throw new Error('Length and width must be greater than zero for plate.');
  if (inputs.shape === 'cylinder' && inputs.length <= 0)
    throw new Error('Length must be greater than zero for cylinder.');

  const shape  = getShapeParameters(inputs);
  const M      = calcMaterialConstant();
  const t_sec  = calcWorkingTime(shape.mass, shape.U, shape.surfaceArea);
  const { h_cool, h_max, sigma } = calcStressAndCooling(
    M, shape.d, shape.b, shape.mass, shape.U, shape.surfaceArea
  );
  const h_r    = calcRadiativeCoeff();

  return {
    shapeLabel:           shape.label,
    workingTimeSeconds:   t_sec,
    workingTimeMinutes:   t_sec / 60,
    M,
    h_cool,
    h_max,
    sigma,
    h_r,
    mass:                 shape.mass,
    surfaceArea:          shape.surfaceArea,
    U:                    shape.U,
    isSafe:               sigma < GLASS.tensile_limit,
  };
}

// ============================================================
// PART 8: REACT COMPONENT — CalculatorTab
// ============================================================

export function CalculatorTab() {
  const [shape,     setShape]     = useState<string>('cylinder');
  const [thickness, setThickness] = useState<string>('5');
  const [radius,    setRadius]    = useState<string>('10');
  const [length,    setLength]    = useState<string>('25');
  const [width,     setWidth]     = useState<string>('25');
  const [results,   setResults]   = useState<ReturnType<typeof runCalculation> | null>(null);
  const [error,     setError]     = useState<string>('');
  const [hasCalc,   setHasCalc]   = useState<boolean>(false);

  function handleCalculate() {
    setError('');
    try {
      const res = runCalculation({
        shape,
        thickness: parseFloat(thickness) || 0,
        radius:    parseFloat(radius)    || 0,
        length:    parseFloat(length)    || 0,
        width:     parseFloat(width)     || 0,
      });
      setResults(res);
      setHasCalc(true);
    } catch (e: any) {
      setError(e.message || 'Calculation error. Check your inputs.');
    }
  }

  function handleReset() {
    setShape('cylinder');
    setThickness('5');
    setRadius('10');
    setLength('25');
    setWidth('25');
    setResults(null);
    setError('');
    setHasCalc(false);
  }

  return (
    <div className="space-y-4 pb-8">
      <h2 className="text-xl font-bold text-amber-400">BoroPro Calculator</h2>
      <p className="text-xs text-stone-400">
        Calculate available working time before borosilicate glass reaches its strain point outside the kiln.
      </p>

      {/* INPUT CARD */}
      <Card className="bg-stone-800 border-stone-700 p-4 space-y-4">

        {/* SHAPE SELECTOR */}
        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-2">Glass Shape</label>
          <div className="flex gap-2">
            {['plate', 'cylinder', 'sphere'].map((s) => (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={`flex-1 py-2 px-3 rounded text-sm font-semibold capitalize transition-all border
                  ${shape === s
                    ? 'bg-amber-700 border-amber-500 text-white'
                    : 'bg-stone-700 border-stone-600 text-stone-300 hover:bg-stone-600'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* DIMENSION INPUTS */}
        <div className="grid grid-cols-2 gap-3">

          {/* Thickness — plate and cylinder only */}
          {shape !== 'sphere' && (
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Wall Thickness (mm)
            </label>
            <Input
              type="number" value={thickness} min="0.1" step="0.1"
              onChange={(e) => setThickness(e.target.value)}
              placeholder="5"
              className={`bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500 ${
                shape === 'cylinder' && parseFloat(thickness) >= parseFloat(radius)
                  ? 'border-red-500 ring-1 ring-red-500'
                  : ''
              }`}
            />
            {shape === 'cylinder' && parseFloat(thickness) >= parseFloat(radius) && (
              <p className="text-xs text-red-400 mt-1">
                ⚠ Thickness must be less than radius ({radius} mm)
              </p>
            )}
          </div>
          )}

          {/* Radius — cylinder and sphere */}
          {(shape === 'cylinder' || shape === 'sphere') && (
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Radius (mm)
              </label>
              <Input
                type="number" value={radius} min="0.1" step="0.1"
                onChange={(e) => setRadius(e.target.value)}
                placeholder="10"
                className="bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500"
              />
            </div>
          )}

          {/* Length — plate and cylinder */}
          {(shape === 'plate' || shape === 'cylinder') && (
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Length (mm)
              </label>
              <Input
                type="number" value={length} min="0.1" step="0.1"
                onChange={(e) => setLength(e.target.value)}
                placeholder="25"
                className="bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500"
              />
            </div>
          )}

          {/* Width — plate only */}
          {shape === 'plate' && (
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Width (mm)
              </label>
              <Input
                type="number" value={width} min="0.1" step="0.1"
                onChange={(e) => setWidth(e.target.value)}
                placeholder="25"
                className="bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500"
              />
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex gap-2 p-3 bg-red-900/30 border border-red-700 rounded text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-2 pt-1">
          <Button onClick={handleCalculate}
            className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-bold">
            Calculate
          </Button>
          <Button onClick={handleReset} variant="outline"
            className="flex-1 bg-stone-700 hover:bg-stone-600 border-stone-600 text-stone-300">
            Reset
          </Button>
        </div>
      </Card>

      {/* RESULTS */}
      {hasCalc && results && (
        <div className="space-y-4">

          {/* WORKING TIME — primary output */}
          <Card className="bg-gradient-to-br from-amber-900/50 to-amber-950/50 border-2 border-amber-500 p-6 text-center">
            <p className="text-sm text-amber-300 font-semibold mb-1">AVAILABLE WORKING TIME</p>
            <p className="text-xs text-stone-400 mb-3">{results.shapeLabel}</p>
            <div className="text-6xl font-bold text-amber-300 mb-1">
              {results.workingTimeMinutes.toFixed(1)}
            </div>
            <p className="text-lg text-amber-200 font-semibold mb-4">minutes</p>

            {/* Stress safety indicator */}
            <div className={`rounded p-2 mb-3 text-xs font-semibold ${
              results.isSafe
                ? 'bg-green-900/40 border border-green-700 text-green-300'
                : 'bg-red-900/40 border border-red-700 text-red-300'}`}>
              {results.isSafe
                ? `✓ Thermal stress (${results.sigma.toFixed(3)} MPa) is within safe limits`
                : `⚠ Thermal stress (${results.sigma.toFixed(3)} MPa) EXCEEDS safe limit (50 MPa)`}
            </div>

            {/* Critical warning */}
            <div className="bg-red-900/40 border border-red-700 rounded p-3">
              <p className="text-xs text-red-300 font-semibold">⚠️ CRITICAL REMINDER</p>
              <p className="text-xs text-red-200 mt-1">
                Return glass to kiln and hold at <strong>565°C</strong> (annealing temp)
                before this time expires to prevent thermal shock and cracking.
              </p>
            </div>
          </Card>

          {/* DETAILED RESULTS */}
          <Card className="bg-stone-800 border-stone-700 p-4">
            <h4 className="font-bold text-amber-300 text-sm mb-3">Calculation Details</h4>
            <div className="space-y-2">
              {[
                { label: 'Working Time',              value: `${results.workingTimeSeconds.toFixed(0)} s  /  ${results.workingTimeMinutes.toFixed(2)} min` },
                { label: 'Material Constant M',       value: `${results.M.toFixed(6)} MPa·s·K⁻¹·m⁻²` },
                { label: 'Effective Cooling Rate',    value: `${results.h_cool.toFixed(6)} K/s` },
                { label: 'Max Safe Cooling Rate',     value: `${results.h_max.toFixed(4)} K/s` },
                { label: 'Thermal Stress (σ)',        value: `${results.sigma.toFixed(4)} MPa` },
                { label: 'Radiative Coeff (h_r)',     value: `${results.h_r.toFixed(4)} W/m²·K` },
                { label: 'Overall Heat Transfer U',   value: `${results.U.toFixed(4)} W/m²·K` },
                { label: 'Mass',                      value: `${results.mass.toFixed(6)} kg` },
                { label: 'Surface Area',              value: `${results.surfaceArea.toFixed(6)} m²` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center p-2 bg-stone-700/50 rounded">
                  <span className="text-xs text-stone-400">{label}</span>
                  <span className="text-xs font-mono text-amber-300">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* GLASS CONSTANTS REFERENCE */}
          <Card className="bg-stone-800 border-stone-700 p-4">
            <h4 className="font-bold text-amber-300 text-sm mb-3">Glass Constants — Pyrex Borosilicate</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ['λ (Thermal Conductivity)',  '1.14 W/(m·K)'],
                ['ρ (Density)',               '2230 kg/m³'],
                ['cp (Specific Heat)',        '840 J/(kg·K)'],
                ['α (Thermal Expansion)',     '33×10⁻⁷ K⁻¹'],
                ['E (Young\'s Modulus)',      '63 GPa'],
                ['μ (Poisson\'s Ratio)',      '0.20'],
                ['ε (Emissivity)',            '0.85'],
                ['Tg (Glass Transition)',     '565°C'],
                ['Strain Point',             '510°C'],
                ['Tensile Limit',            '50 MPa'],
              ].map(([label, val]) => (
                <div key={label} className="text-stone-400">
                  <span className="text-stone-500">{label}:</span>
                  <span className="text-amber-300 ml-1 font-mono">{val}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* HOW IT WORKS */}
          <Card className="bg-stone-800/50 border-stone-700 p-4">
            <h4 className="font-bold text-amber-300 text-sm mb-2">How This Works</h4>
            <ul className="text-xs text-stone-400 space-y-2">
              <li>• <strong>Working Time</strong> uses Newton's Law of Cooling: t = (m·cp / U·A) × ln((T_work − T_env) / (T_strain − T_env))</li>
              <li>• <strong>Heat Transfer U</strong> accounts for internal convection, conduction through the wall, external convection, and radiation</li>
              <li>• <strong>Thermal Stress</strong> σ = M·h·d²·b where M is the material constant, h is the cooling rate, d is the characteristic dimension, and b is the shape factor</li>
              <li>• <strong>Annealing Temp:</strong> 565°C — hold glass here before and after working</li>
              <li>• <strong>Strain Point:</strong> 510°C — glass must not reach this outside the kiln</li>
            </ul>
          </Card>
        </div>
      )}

      {/* EMPTY STATE */}
      {!hasCalc && (
        <Card className="bg-stone-800/50 border-stone-700 border-dashed p-8 text-center">
          <CheckCircle className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <p className="text-sm text-stone-400">
            Enter your glass dimensions above and tap Calculate to see your available working time.
          </p>
        </Card>
      )}
    </div>
  );
}
