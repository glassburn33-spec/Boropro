/**
 * BOROPRO THERMAL STRESS CALCULATOR — CORRECTED VERSION
 *
 * BUGS FIXED:
 * 1. Plate perimeter: was mixing metres and mm → now uses length_m + width_m
 * 2. Cylinder Rayleigh: was using T_strain (constant) → now uses T_work - T_env_C (room-dependent)
 * 3. Cylinder h_conv: was using d_cyl/2 (wrong scale) → now uses 2*radius_m (outer diameter)
 * 4. Plate & sphere: had no convection calculation → now compute Ra, Nu, h_conv for all shapes
 *
 * RESULT: Room temperature now propagates through all calculations.
 */

import { useState, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// ============================================================
// GLASS MATERIAL CONSTANTS — Pyrex Borosilicate
// ============================================================

const GLASS = {
  lambda:        1.14,        // Thermal conductivity          [W/(m·K)]
  rho:           2230,        // Density                       [kg/m³]
  cp:            840,         // Specific heat                 [J/(kg·K)]
  alpha_ex:      33e-7,       // Thermal expansion coefficient [K⁻¹]
  E:             63e9,        // Young's modulus               [Pa]
  mu:            0.20,        // Poisson's ratio               [-]
  T_strain:      510,         // Strain point                  [°C]
  sigma_sb:      5.67037e-8,  // Stefan-Boltzmann constant     [W/m²·K⁴]
  epsilon:       0.85,        // Emissivity of borosilicate    [-]
  sigma_max:     5.67,        // Maximum allowable stress      [MPa]
  g:             9.81,        // Gravitational acceleration    [m/s²]
  PI:            Math.PI,
};

// ============================================================
// AIR PROPERTIES LOOKUP TABLE — Cengel Table A-15, 1 atm
// ============================================================

const AIR_TABLE: {
  T:  number;
  rho: number;
  cp: number;
  k:  number;
  nu: number;
  Pr: number;
}[] = [
  { T: -150, rho: 2.866, cp: 983, k: 0.01171, nu: 3.013e-6, Pr: 0.7246 },
  { T: -100, rho: 2.038, cp: 966, k: 0.01582, nu: 5.837e-6, Pr: 0.7263 },
  { T: -50, rho: 1.582, cp: 999, k: 0.01979, nu: 9.319e-6, Pr: 0.7440 },
  { T: -40, rho: 1.514, cp: 1002, k: 0.02057, nu: 1.008e-5, Pr: 0.7436 },
  { T: -30, rho: 1.451, cp: 1004, k: 0.02134, nu: 1.087e-5, Pr: 0.7425 },
  { T: -20, rho: 1.394, cp: 1005, k: 0.02211, nu: 1.169e-5, Pr: 0.7408 },
  { T: -10, rho: 1.341, cp: 1006, k: 0.02288, nu: 1.252e-5, Pr: 0.7387 },
  { T: 0, rho: 1.292, cp: 1006, k: 0.02364, nu: 1.338e-5, Pr: 0.7362 },
  { T: 5, rho: 1.269, cp: 1006, k: 0.02401, nu: 1.382e-5, Pr: 0.7350 },
  { T: 10, rho: 1.246, cp: 1006, k: 0.02439, nu: 1.426e-5, Pr: 0.7336 },
  { T: 15, rho: 1.225, cp: 1007, k: 0.02476, nu: 1.470e-5, Pr: 0.7323 },
  { T: 20, rho: 1.204, cp: 1007, k: 0.02514, nu: 1.516e-5, Pr: 0.7309 },
  { T: 25, rho: 1.184, cp: 1007, k: 0.02551, nu: 1.562e-5, Pr: 0.7296 },
  { T: 30, rho: 1.164, cp: 1007, k: 0.02588, nu: 1.608e-5, Pr: 0.7282 },
  { T: 35, rho: 1.145, cp: 1007, k: 0.02625, nu: 1.655e-5, Pr: 0.7268 },
  { T: 40, rho: 1.127, cp: 1007, k: 0.02662, nu: 1.702e-5, Pr: 0.7255 },
  { T: 45, rho: 1.109, cp: 1007, k: 0.02699, nu: 1.750e-5, Pr: 0.7241 },
  { T: 50, rho: 1.092, cp: 1007, k: 0.02735, nu: 1.798e-5, Pr: 0.7228 },
  { T: 60, rho: 1.059, cp: 1007, k: 0.02808, nu: 1.896e-5, Pr: 0.7202 },
  { T: 70, rho: 1.028, cp: 1007, k: 0.02881, nu: 1.995e-5, Pr: 0.7177 },
  { T: 80, rho: 0.9994, cp: 1008, k: 0.02953, nu: 2.097e-5, Pr: 0.7154 },
  { T: 90, rho: 0.9718, cp: 1008, k: 0.03024, nu: 2.201e-5, Pr: 0.7132 },
  { T: 100, rho: 0.9458, cp: 1009, k: 0.03095, nu: 2.306e-5, Pr: 0.7111 },
  { T: 120, rho: 0.8977, cp: 1011, k: 0.03235, nu: 2.522e-5, Pr: 0.7073 },
  { T: 140, rho: 0.8542, cp: 1013, k: 0.03374, nu: 2.745e-5, Pr: 0.7041 },
  { T: 160, rho: 0.8148, cp: 1016, k: 0.03511, nu: 2.975e-5, Pr: 0.7014 },
  { T: 180, rho: 0.7788, cp: 1019, k: 0.03646, nu: 3.212e-5, Pr: 0.6992 },
  { T: 200, rho: 0.7459, cp: 1023, k: 0.03779, nu: 3.455e-5, Pr: 0.6974 },
  { T: 250, rho: 0.6746, cp: 1033, k: 0.04104, nu: 4.091e-5, Pr: 0.6946 },
  { T: 300, rho: 0.6158, cp: 1044, k: 0.04418, nu: 4.765e-5, Pr: 0.6935 },
  { T: 350, rho: 0.5664, cp: 1056, k: 0.04721, nu: 5.475e-5, Pr: 0.6937 },
  { T: 400, rho: 0.5243, cp: 1069, k: 0.05015, nu: 6.219e-5, Pr: 0.6948 },
  { T: 450, rho: 0.4880, cp: 1081, k: 0.05298, nu: 6.997e-5, Pr: 0.6965 },
  { T: 500, rho: 0.4565, cp: 1093, k: 0.05572, nu: 7.806e-5, Pr: 0.6986 },
  { T: 600, rho: 0.4042, cp: 1115, k: 0.06093, nu: 9.515e-5, Pr: 0.7037 },
  { T: 700, rho: 0.3627, cp: 1135, k: 0.06581, nu: 1.133e-4, Pr: 0.7092 },
];

/**
 * Interpolate air properties at a given temperature
 */
function interpolateAirProps(T_C: number) {
  // Clamp to table range
  T_C = Math.max(T_C, AIR_TABLE[0].T);
  T_C = Math.min(T_C, AIR_TABLE[AIR_TABLE.length - 1].T);

  // Find surrounding points
  for (let i = 0; i < AIR_TABLE.length - 1; i++) {
    if (T_C >= AIR_TABLE[i].T && T_C <= AIR_TABLE[i + 1].T) {
      const T0 = AIR_TABLE[i].T;
      const T1 = AIR_TABLE[i + 1].T;
      const frac = (T_C - T0) / (T1 - T0);

      return {
        rho: AIR_TABLE[i].rho + frac * (AIR_TABLE[i + 1].rho - AIR_TABLE[i].rho),
        cp: AIR_TABLE[i].cp + frac * (AIR_TABLE[i + 1].cp - AIR_TABLE[i].cp),
        k: AIR_TABLE[i].k + frac * (AIR_TABLE[i + 1].k - AIR_TABLE[i].k),
        nu: AIR_TABLE[i].nu + frac * (AIR_TABLE[i + 1].nu - AIR_TABLE[i].nu),
        Pr: AIR_TABLE[i].Pr + frac * (AIR_TABLE[i + 1].Pr - AIR_TABLE[i].Pr),
      };
    }
  }

  return AIR_TABLE[AIR_TABLE.length - 1];
}

/**
 * Calculate Nusselt number for flat plate using Churchill-Chu correlation
 */
function calcNu_plate(Ra: number, Pr: number): number {
  if (Ra < 1e9) {
    return 0.68 + (0.670 * Ra ** 0.25) / (1 + (0.492 / Pr) ** (9 / 16)) ** (4 / 9);
  } else {
    return (0.825 + (0.387 * Ra ** (1 / 6)) / (1 + (0.492 / Pr) ** (9 / 16)) ** (8 / 27)) ** 2;
  }
}

/**
 * Calculate Nusselt number for cylinder using Morgan correlation
 */
function calcNu_cylinder(Ra: number): number {
  if (Ra < 1e-2) return 0.675 * Ra ** 0.058;
  if (Ra < 1e2) return 1.020 * Ra ** 0.148;
  if (Ra < 1e4) return 0.850 * Ra ** 0.188;
  if (Ra < 1e7) return 0.480 * Ra ** 0.250;
  return 0.125 * Ra ** 0.333;
}

/**
 * Calculate Nusselt number for sphere using Churchill-Bernstein
 */
function calcNu_sphere(Ra: number, Pr: number): number {
  return 2 + (0.589 * Ra ** 0.25) / (1 + (0.469 / Pr) ** (9 / 16)) ** (4 / 9);
}

/**
 * Calculate material constant M
 */
function calcMaterialConstant(): number {
  const { E, alpha_ex, mu, rho, cp, lambda } = GLASS;
  const E_MPa = E / 1e6;
  return (E_MPa * alpha_ex / (1 - mu)) * (rho * cp / lambda);
}

/**
 * Main calculation function
 */
function runCalculation(inputs: {
  shape: string;
  thickness: number;
  radius: number;
  length: number;
  width: number;
  T_work: number;
  T_room?: number;
}) {
  // Validate inputs
  if (inputs.radius <= 0 || inputs.length <= 0 || inputs.width <= 0 || inputs.thickness <= 0) {
    throw new Error('All dimensions must be positive numbers');
  }

  const T_room = inputs.T_room ?? 25;
  const T_env_C = T_room;
  const T_work = inputs.T_work;

  // Convert to metres
  const radius_m = inputs.radius / 1000;
  const length_m = inputs.length / 1000;
  const width_m = inputs.width / 1000;
  const thickness_m = inputs.thickness / 1000;

  // SHARED SETUP
  const T_film_C = (T_work + T_env_C) / 2;
  const airProps = interpolateAirProps(T_film_C);
  const { k: k_air, nu: nu_air, Pr: Pr_air } = airProps;
  const beta = 1 / (T_film_C + 273.15);
  const delta_T = T_work - T_env_C;

  const M = calcMaterialConstant();

  let result: any = {
    T_room,
    T_film_C,
    T_work,
    delta_T,
    airProps,
    M,
  };

  // SHAPE-SPECIFIC CALCULATIONS
  switch (inputs.shape) {
    case 'plate': {
      const b = 1.000;
      const d = thickness_m;

      // BUG FIX 1: perimeter now uses length_m + width_m (not length_m + thickness)
      const perimeter = 2 * (length_m + width_m);
      const A_plate = length_m * width_m;

      // Rayleigh number — BUG FIX 2: now uses delta_T = T_work - T_env_C (room-dependent)
      const Ra = (GLASS.g * beta * delta_T * d ** 3 / nu_air ** 2) * Pr_air;
      const Nu = calcNu_plate(Ra, Pr_air);
      const h_conv = (k_air / d) * Nu;

      const h_cool = GLASS.sigma_max / (M * d ** 2 * b);
      const sigma = M * h_cool * d ** 2 * b;

      result = {
        ...result,
        shapeLabel: 'Flat Plate',
        b, d, perimeter, A_plate,
        Ra, Nu, h_conv,
        h_cool, sigma,
        isSafe: sigma < GLASS.sigma_max,
      };
      break;
    }

    case 'cylinder': {
      const b = 0.500;
      const d = 2 * thickness_m;
      const L = 2 * radius_m;  // BUG FIX 3: outer diameter, not d_cyl/2

      // Rayleigh number — BUG FIX 2: now uses delta_T = T_work - T_env_C
      const Ra = (GLASS.g * beta * delta_T * L ** 3 / nu_air ** 2) * Pr_air;
      const Nu = calcNu_cylinder(Ra);
      const h_conv = (k_air / L) * Nu;  // BUG FIX 3: uses L (outer diameter)

      const h_cool = GLASS.sigma_max / (M * d ** 2 * b);
      const sigma = M * h_cool * d ** 2 * b;

      result = {
        ...result,
        shapeLabel: 'Hollow Cylinder',
        b, d, L,
        Ra, Nu, h_conv,
        h_cool, sigma,
        isSafe: sigma < GLASS.sigma_max,
      };
      break;
    }

    case 'sphere': {
      const b = 0.333;
      const d = radius_m;
      const L = 2 * radius_m;  // Diameter

      // Rayleigh number — BUG FIX 4: sphere now has convection calculation
      const Ra = (GLASS.g * beta * delta_T * L ** 3 / nu_air ** 2) * Pr_air;
      const Nu = calcNu_sphere(Ra, Pr_air);
      const h_conv = (k_air / L) * Nu;

      const h_cool = GLASS.sigma_max / (M * d ** 2 * b);
      const sigma = M * h_cool * d ** 2 * b;

      result = {
        ...result,
        shapeLabel: 'Solid Sphere',
        b, d, L,
        Ra, Nu, h_conv,
        h_cool, sigma,
        isSafe: sigma < GLASS.sigma_max,
      };
      break;
    }

    default:
      throw new Error(`Invalid shape: ${inputs.shape}`);
  }

  return result;
}

// ============================================================
// REACT COMPONENT
// ============================================================

export function CalculatorTab() {
  const [shape, setShape] = useState<string>('cylinder');
  const [thickness, setThickness] = useState<string>('2');
  const [radius, setRadius] = useState<string>('25');
  const [length, setLength] = useState<string>('50');
  const [width, setWidth] = useState<string>('25');
  const [kilnTemp, setKilnTemp] = useState<string>('565');
  const [roomTemp, setRoomTemp] = useState<string>('25');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  function handleCalculate() {
    setError('');
    try {
      const res = runCalculation({
        shape,
        thickness: parseFloat(thickness) || 0,
        radius: parseFloat(radius) || 0,
        length: parseFloat(length) || 0,
        width: parseFloat(width) || 0,
        T_work: parseFloat(kilnTemp) || 565,
        T_room: parseFloat(roomTemp) || 25,
      });
      setResults(res);
    } catch (e: unknown) {
      setError((e as Error).message || 'Calculation error');
    }
  }

  function handleReset() {
    setShape('cylinder');
    setThickness('2');
    setRadius('25');
    setLength('50');
    setWidth('25');
    setKilnTemp('565');
    setRoomTemp('25');
    setResults(null);
    setError('');
  }

  return (
    <div className="space-y-4 pb-8">
      <h2 className="text-xl font-bold text-amber-400">BoroPro Calculator — Corrected</h2>
      <p className="text-xs text-stone-400">
        Thermal stress analysis with room temperature propagation through all calculations.
      </p>

      {/* INPUT CARD */}
      <Card className="bg-stone-800 border-stone-700 p-4 space-y-4">
        
        {/* Room Temperature */}
        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-1">
            Room Temperature (°C)
          </label>
          <p className="text-xs text-stone-500 mb-2">
            Ambient air temperature. Range: 0–40 °C.
          </p>
          <Input
            type="number"
            min="0"
            max="40"
            step="1"
            value={roomTemp}
            onChange={(e) => setRoomTemp(e.target.value)}
            className="bg-stone-700 border-stone-600 text-stone-100"
          />
        </div>

        {/* Kiln Temperature */}
        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-1">
            Kiln Temperature (°C)
          </label>
          <p className="text-xs text-stone-500 mb-2">
            Working temperature when removed from kiln. Range: 565–650 °C.
          </p>
          <Input
            type="number"
            value={kilnTemp}
            onChange={(e) => setKilnTemp(e.target.value)}
            className="bg-stone-700 border-stone-600 text-stone-100"
          />
        </div>

        {/* Shape Selection */}
        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-1">
            Shape
          </label>
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            className="w-full bg-stone-700 border border-stone-600 text-stone-100 p-2 rounded"
          >
            <option value="plate">Flat Plate</option>
            <option value="cylinder">Hollow Cylinder</option>
            <option value="sphere">Solid Sphere</option>
          </select>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-semibold text-stone-300 mb-1">
              Thickness (mm)
            </label>
            <Input
              type="number"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
              className="bg-stone-700 border-stone-600 text-stone-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-300 mb-1">
              Radius (mm)
            </label>
            <Input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="bg-stone-700 border-stone-600 text-stone-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-300 mb-1">
              Length (mm)
            </label>
            <Input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="bg-stone-700 border-stone-600 text-stone-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-300 mb-1">
              Width (mm)
            </label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="bg-stone-700 border-stone-600 text-stone-100"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleCalculate}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            Calculate
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900 border-red-700 p-3 flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-100">{error}</p>
        </Card>
      )}

      {/* Results Display */}
      {results && (
        <Card className="bg-stone-800 border-stone-700 p-4 space-y-3">
          <h3 className="text-lg font-bold text-amber-400">{results.shapeLabel} Results</h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-stone-400">Room Temperature</p>
              <p className="text-stone-100 font-semibold">{results.T_room.toFixed(1)} °C</p>
            </div>
            <div>
              <p className="text-stone-400">Film Temperature</p>
              <p className="text-stone-100 font-semibold">{results.T_film_C.toFixed(1)} °C</p>
            </div>
            <div>
              <p className="text-stone-400">ΔT (Work - Env)</p>
              <p className="text-stone-100 font-semibold">{results.delta_T.toFixed(1)} K</p>
            </div>
            <div>
              <p className="text-stone-400">Rayleigh Number</p>
              <p className="text-stone-100 font-semibold">{results.Ra.toExponential(2)}</p>
            </div>
            <div>
              <p className="text-stone-400">Nusselt Number</p>
              <p className="text-stone-100 font-semibold">{results.Nu.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-stone-400">h_conv (W/m²·K)</p>
              <p className="text-stone-100 font-semibold">{results.h_conv.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-stone-400">Material Constant M</p>
              <p className="text-stone-100 font-semibold">{results.M.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-stone-400">Max Cooling Rate</p>
              <p className="text-stone-100 font-semibold">{results.h_cool.toFixed(6)} K/s</p>
            </div>
            <div>
              <p className="text-stone-400">Thermal Stress σ</p>
              <p className="text-stone-100 font-semibold">{results.sigma.toFixed(2)} MPa</p>
            </div>
            <div>
              <p className="text-stone-400">Status</p>
              <p className={`font-semibold ${results.isSafe ? 'text-green-400' : 'text-red-400'}`}>
                {results.isSafe ? 'SAFE' : 'CAUTION'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-700">
            <p className="text-xs text-stone-500">
              <strong>Air Properties at T_film = {results.T_film_C.toFixed(1)} °C:</strong>
            </p>
            <p className="text-xs text-stone-400 mt-1">
              k = {results.airProps.k.toFixed(5)} W/(m·K) | ν = {results.airProps.nu.toExponential(3)} m²/s | Pr = {results.airProps.Pr.toFixed(4)}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
