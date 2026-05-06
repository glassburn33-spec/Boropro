/**
 * BOROPRO THERMAL STRESS CALCULATOR — EDITABLE VERSION
 *
 * EDIT THE FORMULAS AND CONSTANTS IN THIS FILE
 * Then upload it back to replace the current CalculatorTab.tsx
 *
 * STRUCTURE:
 * PART 1: Glass Material Constants (edit values here)
 * PART 2: Air Properties at Film Temperature (edit values here)
 * PART 3: Natural Convection h via Churchill-Chu correlations (edit formulas)
 * PART 4: Shape Parameters (edit cross-sectional area formulas)
 * PART 5: Working Time (edit formula)
 * PART 6: Thermal Stress & Max Cooling Rate (edit formulas)
 * PART 7: Main Calculation Function (orchestrates all calculations)
 * PART 8: React Component (UI — no formulas here)
 *
 * PHYSICS BASIS:
 * Working-time calculation uses Newton's Law of Cooling with h derived from
 * Churchill-Chu natural-convection correlations (same approach as the
 * reference MATLAB script).  Radiation is included in reported heat-flux
 * values but the lumped-capacitance time constant uses convective h only,
 * consistent with the MATLAB formulation.
 */

import { useState, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// ============================================================
// PART 1: GLASS MATERIAL CONSTANTS — Pyrex Borosilicate
// EDIT THESE VALUES TO CHANGE MATERIAL PROPERTIES
// ============================================================

const GLASS = {
  lambda:        1.14,        // Thermal conductivity          [W/(m·K)]
  rho:           2230,        // Density                       [kg/m³]
  cp:            840,         // Specific heat                 [J/(kg·K)]
  alpha_ex:      33e-7,       // Thermal expansion coefficient [K⁻¹]
  E:             63e9,        // Young's modulus               [Pa]
  mu:            0.20,        // Poisson's ratio               [-]
  T_strain:      515,         // NIST strain-point target      [°C]  ← MATLAB uses 515
  T_env:         25,          // Ambient room temperature      [°C]
  sigma_sb:      5.67037e-8,  // Stefan-Boltzmann constant     [W/m²·K⁴]
  epsilon:       0.85,        // Emissivity of borosilicate    [-]
  tensile_limit: 50,          // Borosilicate tensile limit    [MPa]
  g:             9.81,        // Gravitational acceleration    [m/s²]
  PI:            Math.PI,
};

// ============================================================
// PART 2: AIR PROPERTIES LOOKUP TABLE — Cengel Table A-15, 1 atm
//
// The film temperature for kiln inputs 565–650 °C with room temperature inputs 0 -40 °C
// ranging the film temperature to interpolate though the tables
//

// use uploaded tables to complete the regoinds to be interpolated through with changing room temp 
// IMPORTANT: These values are the sole source for all air properties
// used in every calculation. Do not duplicate or hardcode these
// values anywhere else in the file.
// ============================================================

const AIR_TABLE: {
  T:  number;
  cp: number;
  k:  number;
  nu: number;
  Pr: number;
}[] = [
  { T: 250, cp: 1033, k: 0.04104, nu: 4.091e-5, Pr: 0.6946 },
  { T: 300, cp: 1044, k: 0.04418, nu: 4.765e-5, Pr: 0.6935 },
  { T: 350, cp: 1056, k: 0.04721, nu: 5.475e-5, Pr: 0.6937 },
];

/**
 * interpolateAirProps
 * Linearly interpolates cp, k, nu, and Pr from AIR_TABLE at the
 * given film temperature T_C [°C].
 *
 * THIS FUNCTION MUST BE CALLED ON EVERY CALCULATION RUN.
 * Its output is the sole source of k, nu, and Pr for all Ra, Nu,
 * and h computations across all three shapes (plate, cylinder, sphere).
 *
 * Clamping behavior:
 *   T_C <= 250 °C  →  returns exact 250 °C row values
 *   T_C >= 350 °C  →  returns exact 350 °C row values
 *   250 < T_C < 300 →  interpolates between 250 and 300 °C rows
 *   300 < T_C < 350 →  interpolates between 300 and 350 °C rows
 *
 * Film temperature range for kiln 565–650 °C with T_env 25 °C:
 *   T_film = 295 °C to 337.5 °C — fully bracketed by this table.
 *
 * Interpolation formula for each property P:
 *   f = (T_C - T_lo) / (T_hi - T_lo)
 *   P = P_lo + f * (P_hi - P_lo)
 */
function interpolateAirProps(T_C: number): {
  cp: number;
  k:  number;
  nu: number;
  Pr: number;
} {
  const table = AIR_TABLE;

  // Clamp below lower bound (500 °C)
  if (T_C <= table[0].T) {
    return {
      cp: table[0].cp,
      k:  table[0].k,
      nu: table[0].nu,
      Pr: table[0].Pr,
    };
  }

  // Clamp above upper bound (700 °C)
  if (T_C >= table[table.length - 1].T) {
    const last = table[table.length - 1];
    return { cp: last.cp, k: last.k, nu: last.nu, Pr: last.Pr };
  }

  // Find the two rows that bracket T_C
  let lo = table[0];
  let hi = table[1];
  for (let i = 0; i < table.length - 1; i++) {
    if (table[i].T <= T_C && T_C <= table[i + 1].T) {
      lo = table[i];
      hi = table[i + 1];
      break;
    }
  }

  // Linear interpolation factor
  const f = (T_C - lo.T) / (hi.T - lo.T);

  return {
    cp: lo.cp + f * (hi.cp - lo.cp),
    k:  lo.k  + f * (hi.k  - lo.k),
    nu: lo.nu + f * (hi.nu - lo.nu),
    Pr: lo.Pr + f * (hi.Pr - lo.Pr),
  };
}

// ============================================================
// PART 3: NATURAL CONVECTION h — Churchill-Chu Correlations
//
// All three functions return h [W/(m²·K)] for the outer surface.
// Characteristic lengths and correlation forms match the MATLAB script.
// ============================================================

/**
 * Flat plate — Churchill-Chu vertical plate correlation (MATLAB Ra uses cosd(60)):
 *   Ra  = g·cos(60°)·β·ΔT·L³ / ν²  · Pr
 *   Nu  = { 0.825 + 0.387·Ra^(1/6) / [1+(0.492/Pr)^(9/16)]^(8/27) }²
 *   h   = (k_air / L) · Nu
 * L = plate length [m], deltaT = T_work − T_strain [°C]
 */
function calcH_plate(L: number, T_work: number, beta: number, k: number, nu: number, Pr: number): number {
  const { g, PI: _PI } = GLASS;
  const deltaT = T_work - GLASS.T_strain;
  const cos60  = Math.cos((60 * Math.PI) / 180);   // = 0.5

  // EDIT RAYLEIGH AND NUSSELT:
  const Ra = (g * cos60 * beta * deltaT * L ** 3 / nu ** 2) * Pr;
  const Nu = (0.825 + (0.387 * Ra ** (1 / 6)) /
    (1 + (0.492 / Pr) ** (9 / 16)) ** (8 / 27)) ** 2;

  return (k / L) * Nu;   // [W/(m²·K)]
}

/**
 * Hollow cylinder — Churchill-Chu horizontal cylinder correlation:
 *   D   = outer diameter [m]
 *   Ra  = g·β·ΔT·D³ / ν²  · Pr
 *   Nu  = { 0.6 + 0.387·Ra^(1/6) / [1+(0.559/Pr)^(9/16)]^(8/27) }²
 *   h   = (k_air / D) · Nu
 */
function calcH_cylinder(D: number, T_work: number, beta: number, k: number, nu: number, Pr: number): number {
  const { g, PI: _PI } = GLASS;
  const deltaT = T_work - GLASS.T_strain;

  // EDIT RAYLEIGH AND NUSSELT:
  const Ra = (g * beta * deltaT * (D/2) ** 3 / nu ** 2) * Pr;
  const Nu = (0.6 + (0.387 * Ra ** (1 / 6)) /
    (1 + (0.559 / Pr) ** (9 / 16)) ** (8 / 27)) ** 2;

  return (k / (D/2)) * Nu;   // [W/(m²·K)]
}

/**
 * Solid sphere — Churchill-Chu sphere correlation:
 *   D   = sphere diameter [m]
 *   Ra  = g·β·ΔT·D³ / ν²  · Pr
 *   Nu  = 2 + 0.589·Ra^(1/4) / [1+(0.469/Pr)^(9/16)]^(4/9)
 *   h   = (k_air / D) · Nu
 */
function calcH_sphere(D: number, T_work: number, beta: number, k: number, nu: number, Pr: number): number {
  const { g, PI: _PI } = GLASS;
  const deltaT = T_work - GLASS.T_strain;

  // EDIT RAYLEIGH AND NUSSELT:
  const Ra = (g * beta * deltaT * D ** 3 / nu ** 2) * Pr;
  const Nu = 2 + (0.589 * Ra ** (1 / 4)) /
    (1 + (0.469 / Pr) ** (9 / 16)) ** (4 / 9);

  return (k / D) * Nu;   // [W/(m²·K)]
}

// ============================================================
// PART 4: SHAPE PARAMETERS
// Returns geometry + lumped-capacitance time constant τ = ρ·cp·V / (h·A)
// Radiation heat flux is computed separately for reporting only.
// ============================================================

function getShapeParameters(inputs: {
  shape:     string;
  thickness: number;   // mm
  radius:    number;   // mm
  length:    number;   // mm
  width:     number;   // mm
  T_work:    number;   // °C
  beta:      number;   // [1/K]
  k:         number;
  nu:        number;
  Pr:        number;
}) {
  const t  = inputs.thickness / 1000;   // [m]
  const r  = inputs.radius    / 1000;   // [m]
  const L  = inputs.length    / 1000;   // [m]
  const W  = inputs.width     / 1000;   // [m]
  const { T_work, beta, k, nu, Pr } = inputs;
  const { rho, cp, epsilon, sigma_sb, T_env, PI } = GLASS;

  const T_s_K   = T_work + 273.15;
  const T_env_K = T_env  + 273.15;

  switch (inputs.shape) {

    // ----------------------------------------------------------
    // FLAT PLATE
    // τ  = ρ·cp·t / h          (MATLAB: tau = rho*cp*thickness / h)
    // t* = −τ · ln((T_strain−T_env)/(T_work−T_env))
    // ----------------------------------------------------------
    case 'plate': {
      const h_conv     = calcH_plate(L, T_work, beta, k, nu, Pr);

      // Geometry
      const V          = t * L * W;
      const A_surface  = 2 * (L * W) + 2 * (L * t) + 2 * (W * t);
      const A_outer    = A_surface;   // all faces exposed
      const mass       = rho * V;

      // Lumped time constant — matches MATLAB: tau = rho*cp*thickness / h
      const tau        = (rho * cp * t) / h_conv;

      // Radiation heat flux (reporting only)
      const Q_rad      = epsilon * sigma_sb * A_outer * (T_s_K ** 4 - T_env_K ** 4);
      const Q_conv     = h_conv * A_outer * (T_work - T_env);
      const Q_total    = Q_conv + Q_rad;

      // Stress shape factors — flat plate
      const b = 1.000;
      const d = t;
      const U = h_conv;   // kept for stress calc compatibility

      return {
        label: 'Flat Plate',
        b, d, mass, surfaceArea: A_surface, A_outer,
        U, tau, h_conv, Q_conv, Q_rad, Q_total,
      };
    }

    // ----------------------------------------------------------
    // HOLLOW CYLINDER
    // τ  = ρ·cp·V / (h·A_outer_lateral)   (MATLAB: tau = rho*cp*V/(h*A_outer))
    // t* = −τ · ln((T_strain−T_env)/(T_work−T_env))
    // ----------------------------------------------------------
    case 'cylinder': {
      if (t >= r) throw new Error(
        `Wall thickness (${inputs.thickness} mm) must be less than radius (${inputs.radius} mm)`
      );
      const D          = 2 * r;
      const h_conv     = calcH_cylinder(D, T_work, beta, k, nu, Pr);

      const r_inner    = r - t;
      const V          = PI * (r ** 2 - r_inner ** 2) * L;
      const A_surface  = 2 * PI * (r ** 2 - r_inner ** 2)
                       + 2 * PI * r       * L
                       + 2 * PI * r_inner * L;
      // MATLAB uses only the outer lateral surface for τ
      const A_outer    = 2 * PI * r * L;
      const mass       = rho * V;

      // Lumped time constant — matches MATLAB: tau = rho*cp*V / (h*A_outer)
      const tau        = (rho * cp * V) / (h_conv * A_outer);

      // Radiation
      const Q_rad      = epsilon * sigma_sb * A_outer * (T_s_K ** 4 - T_env_K ** 4);
      const Q_conv     = h_conv * A_outer * (T_work - T_env);
      const Q_total    = Q_conv + Q_rad;

      const b = 0.500;
      const d = t;
      const U = h_conv;

      return {
        label: 'Hollow Cylinder',
        b, d, mass, surfaceArea: A_surface, A_outer,
        U, tau, h_conv, Q_conv, Q_rad, Q_total,
      };
    }

    // ----------------------------------------------------------
    // SOLID SPHERE
    // τ  = ρ·cp·R / (3·h)      (MATLAB: tau = rho*cp*R / (3*h))
    // t* = −τ · ln((T_strain−T_env)/(T_work−T_env))
    // ----------------------------------------------------------
    case 'sphere': {
      const D          = 2 * r;
      const h_conv     = calcH_sphere(D, T_work, beta, k, nu, Pr);

      const V          = (4 / 3) * PI * r ** 3;
      const A_surface  = 4 * PI * r ** 2;
      const A_outer    = PI * D ** 2;   // = 4πr² — matches MATLAB A_outer_sphere
      const mass       = GLASS.rho * V;

      // Lumped time constant — matches MATLAB: tau = rho*cp*R / (3*h)
      const tau        = (rho * cp * r) / (3 * h_conv);

      // Radiation
      const Q_rad      = epsilon * sigma_sb * A_outer * (T_s_K ** 4 - T_env_K ** 4);
      const Q_conv     = h_conv * A_outer * (T_work - T_env);
      const Q_total    = Q_conv + Q_rad;

      const b = 0.333;
      const d = r;
      const U = h_conv;

      return {
        label: 'Solid Sphere',
        b, d, mass, surfaceArea: A_surface, A_outer,
        U, tau, h_conv, Q_conv, Q_rad, Q_total,
      };
    }

    default:
      throw new Error(`Invalid shape: ${inputs.shape}`);
  }
}

// ============================================================
// PART 5: WORKING TIME
// Newton's Law of Cooling (lumped capacitance):
//   t* = −τ · ln((T_strain − T_env) / (T_work − T_env))
// τ is shape-dependent and comes from getShapeParameters().
// ============================================================

function calcWorkingTime(tau: number, T_work: number, T_room: number = 25): number {
  const { T_strain } = GLASS;
  const T_env = T_room;  // Use room temperature as environment temperature

  // EDIT THIS FORMULA:
  // Current: t* = -τ · ln((T_strain - T_env) / (T_work - T_env))
  return -tau * Math.log((T_strain - T_env) / (T_work - T_env));   // [s]
}

// ============================================================
// PART 6: MATERIAL CONSTANT M
// M = (E · α / (1 − ν)) · (ρ · cp / λ) / 1e6
// ============================================================

function calcMaterialConstant(): number {
  const { E, alpha_ex, mu, rho, cp, lambda } = GLASS;

  // EDIT THIS FORMULA:
  const term1 = (E * alpha_ex) / (1 - mu);
  const term2 = (rho * cp) / lambda;
  return (term1 * term2) / 1e6;
}

// ============================================================
// PART 7: THERMAL STRESS & MAX COOLING RATE
// h_cool  = U · A_outer / (mass · cp)   [°C/s]   effective cooling rate
// h_max   = tensile_limit / (M · d² · b)          max safe rate
// sigma   = M · h_cool · d² · b                   induced stress [MPa]
// ============================================================

function calcStressAndCooling(
  M: number, d: number, b: number,
  mass: number, U: number, A_outer: number,
) {
  const { cp, tensile_limit } = GLASS;

  // EDIT THESE FORMULAS:
  const h_cool = (U * A_outer) / (mass * cp);
  const h_max  = tensile_limit / (M * d ** 2 * b);
  const sigma  = M * h_cool * d ** 2 * b;

  return { h_cool, h_max, sigma };
}

// ============================================================
// PART 8: MAIN CALCULATION FUNCTION
// ============================================================

function runCalculation(inputs: {
  shape:     string;
  thickness: number;
  radius:    number;
  length:    number;
  width:     number;
  T_work:    number;
  T_room?:   number;  // Room temperature, default 25°C
}) {
  // Input validation
  if (inputs.shape !== 'sphere' && inputs.thickness <= 0)
    throw new Error('Thickness must be greater than zero.');
  if ((inputs.shape === 'cylinder' || inputs.shape === 'sphere') && inputs.radius <= 0)
    throw new Error('Radius must be greater than zero.');
  if (inputs.shape === 'cylinder' && inputs.thickness >= inputs.radius)
    throw new Error('Wall thickness must be less than radius.');
  if (inputs.shape === 'plate' && (inputs.length <= 0 || inputs.width <= 0))
    throw new Error('Length and width must be greater than zero for plate.');
  if (inputs.shape === 'cylinder' && inputs.length <= 0)
    throw new Error('Length must be greater than zero for cylinder.');

  const { T_work } = inputs;
  const T_room = inputs.T_room ?? 25;  // Default to 25°C if not provided
  const T_film_C = (T_work + T_room) / 2;
  const T_film_K = T_film_C + 273.15;
  const beta     = 1 / T_film_K;

  // Interpolate air properties at film temperature
  const airProps = interpolateAirProps(T_film_C);
  const { cp: cp_air, k, nu, Pr } = airProps;

  const shape  = getShapeParameters({ ...inputs, T_work, beta, k, nu, Pr });
  const M      = calcMaterialConstant();
  const t_sec  = calcWorkingTime(shape.tau, T_work, T_room);
  const { h_cool, h_max, sigma } = calcStressAndCooling(
    M, shape.d, shape.b, shape.mass, shape.U, shape.A_outer,
  );

  return {
    shapeLabel:          shape.label,
    workingTimeSeconds:  t_sec,
    workingTimeMinutes:  t_sec / 60,
    M,
    h_cool,
    h_max,
    sigma,
    h_conv:              shape.h_conv,
    Q_conv:              shape.Q_conv,
    Q_rad:               shape.Q_rad,
    Q_total:             shape.Q_total,
    tau:                 shape.tau,
    mass:                shape.mass,
    surfaceArea:         shape.surfaceArea,
    A_outer:             shape.A_outer,
    U:                   shape.U,
    isSafe:              sigma < GLASS.tensile_limit,
    // expose temperatures & air props for diagnostics panel
    T_work,
    T_room,
    T_film_C,
    airProps:            { cp: cp_air, k, nu, Pr },
  };
}

// ============================================================
// PART 9: REACT COMPONENT — CalculatorTab
// NO FORMULAS HERE — THIS IS JUST THE UI
// ============================================================

export function CalculatorTab() {
  const [shape,     setShape]     = useState<string>('cylinder');
  const [thickness, setThickness] = useState<string>('2');
  const [radius,    setRadius]    = useState<string>('25');
  const [length,    setLength]    = useState<string>('50');
  const [width,     setWidth]     = useState<string>('25');
  const [kilnTemp,  setKilnTemp]  = useState<string>('565');
  const [roomTemp,  setRoomTemp]  = useState<string>('25');
  const [results,   setResults]   = useState<ReturnType<typeof runCalculation> | null>(null);
  const [error,     setError]     = useState<string>('');
  const [hasCalc,   setHasCalc]   = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerRunning,  setTimerRunning]  = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const originalTimeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Helper function to format working time as "X min Y sec"
  function formatTime(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins} min ${secs} sec`;
  }

  // Web Audio API beep function using persistent AudioContext
  function playBeeps(count: number = 3): void {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const resume = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();

    resume.then(() => {
      for (let i = 0; i < count; i++) {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type            = 'sine';
        osc.frequency.value = 880;

        const startTime = ctx.currentTime + i * 0.5;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

        osc.start(startTime);
        osc.stop(startTime + 0.1);
      }
    });
  }

  // Initialize AudioContext on first user interaction
  function initAudioContext(): void {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // Start the countdown timer
  function startTimer(seconds: number): void {
    if (intervalRef.current) clearInterval(intervalRef.current);

    originalTimeRef.current = seconds;
    setTimeRemaining(seconds);
    setTimerRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimerRunning(false);
          playBeeps(5);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // Stop the timer
  function stopTimer(): void {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerRunning(false);
    setTimeRemaining(null);
  }

  // Run the calculation
  function handleCalculate(): void {
    initAudioContext();
    setError('');
    try {
      const res = runCalculation({
        shape,
        thickness: parseFloat(thickness),
        radius: parseFloat(radius),
        length: parseFloat(length),
        width: parseFloat(width),
        T_work: parseFloat(kilnTemp),
        T_room: parseFloat(roomTemp),
      });
      setResults(res);
      setHasCalc(true);
      startTimer(res.workingTimeSeconds);
    } catch (err: any) {
      setError(err.message);
      setHasCalc(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-bold text-gold-400 mb-4">Thermal Stress Calculator</h2>

        {/* Input Section */}
        <Card className="bg-stone-900 border-stone-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shape Selection */}
            <div>
              <label className="block text-sm font-semibold text-gold-400 mb-2">Shape</label>
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                className="w-full px-4 py-2 bg-stone-800 border border-stone-600 rounded text-white"
              >
                <option value="plate">Flat Plate</option>
                <option value="cylinder">Hollow Cylinder</option>
                <option value="sphere">Solid Sphere</option>
              </select>
            </div>

            {/* Kiln Temperature */}
            <div>
              <label className="block text-sm font-semibold text-gold-400 mb-2">
                Kiln Temperature (°C)
              </label>
              <Input
                type="number"
                value={kilnTemp}
                onChange={(e) => setKilnTemp(e.target.value)}
                className="bg-stone-800 border-stone-600 text-white"
                placeholder="565"
              />
            </div>

            {/* Room Temperature */}
            <div>
              <label className="block text-sm font-semibold text-gold-400 mb-2">
                Room Temperature (°C)
              </label>
              <Input
                type="number"
                value={roomTemp}
                onChange={(e) => setRoomTemp(e.target.value)}
                className="bg-stone-800 border-stone-600 text-white"
                placeholder="25"
                min="0"
                max="40"
              />
            </div>

            {/* Thickness */}
            {shape !== 'sphere' && (
              <div>
                <label className="block text-sm font-semibold text-gold-400 mb-2">
                  Thickness (mm)
                </label>
                <Input
                  type="number"
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  className="bg-stone-800 border-stone-600 text-white"
                  placeholder="2"
                />
              </div>
            )}

            {/* Radius */}
            {(shape === 'cylinder' || shape === 'sphere') && (
              <div>
                <label className="block text-sm font-semibold text-gold-400 mb-2">
                  Radius (mm)
                </label>
                <Input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="bg-stone-800 border-stone-600 text-white"
                  placeholder="25"
                />
              </div>
            )}

            {/* Length */}
            {(shape === 'plate' || shape === 'cylinder') && (
              <div>
                <label className="block text-sm font-semibold text-gold-400 mb-2">
                  Length (mm)
                </label>
                <Input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="bg-stone-800 border-stone-600 text-white"
                  placeholder="50"
                />
              </div>
            )}

            {/* Width */}
            {shape === 'plate' && (
              <div>
                <label className="block text-sm font-semibold text-gold-400 mb-2">
                  Width (mm)
                </label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="bg-stone-800 border-stone-600 text-white"
                  placeholder="25"
                />
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded"
          >
            Calculate
          </Button>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-200">{error}</span>
            </div>
          )}
        </Card>

        {/* Results Section */}
        {hasCalc && results && (
          <Card className="bg-stone-900 border-stone-700 p-6">
            <h3 className="text-xl font-bold text-gold-400 mb-4">{results.shapeLabel} Results</h3>

            {/* Timer Display */}
            {timerRunning && timeRemaining !== null && (
              <div className="mb-6 p-4 bg-orange-900/30 border border-orange-700 rounded text-center">
                <div className="text-4xl font-bold text-orange-400 font-mono">
                  {formatTime(timeRemaining)}
                </div>
                <Button
                  onClick={stopTimer}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Stop Timer
                </Button>
              </div>
            )}

            {/* Key Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-stone-800 p-4 rounded">
                <div className="text-sm text-gold-300">Working Time</div>
                <div className="text-2xl font-bold text-white">
                  {formatTime(results.workingTimeSeconds)}
                </div>
              </div>

              <div className="bg-stone-800 p-4 rounded">
                <div className="text-sm text-gold-300">Thermal Stress</div>
                <div className={`text-2xl font-bold ${results.isSafe ? 'text-green-400' : 'text-red-400'}`}>
                  {results.sigma.toFixed(2)} MPa
                </div>
              </div>

              <div className="bg-stone-800 p-4 rounded">
                <div className="text-sm text-gold-300">Max Safe Cooling Rate</div>
                <div className="text-2xl font-bold text-white">
                  {results.h_max.toFixed(4)} °C/s
                </div>
              </div>

              <div className="bg-stone-800 p-4 rounded">
                <div className="text-sm text-gold-300">Actual Cooling Rate</div>
                <div className="text-2xl font-bold text-white">
                  {results.h_cool.toFixed(4)} °C/s
                </div>
              </div>
            </div>

            {/* Safety Status */}
            <div className={`p-4 rounded mb-6 ${results.isSafe ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
              <div className={`font-bold ${results.isSafe ? 'text-green-400' : 'text-red-400'}`}>
                {results.isSafe ? '✓ Safe to cool' : '⚠ Cooling too fast — risk of thermal shock'}
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-3 text-sm text-gray-300">
              <div className="grid grid-cols-2 gap-2">
                <div>Material Constant M:</div>
                <div className="text-right font-mono">{results.M.toFixed(4)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Convection Coefficient h:</div>
                <div className="text-right font-mono">{results.h_conv.toFixed(2)} W/(m²·K)</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Convective Heat Flux:</div>
                <div className="text-right font-mono">{results.Q_conv.toFixed(0)} W</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Radiative Heat Flux:</div>
                <div className="text-right font-mono">{results.Q_rad.toFixed(0)} W</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Total Heat Flux:</div>
                <div className="text-right font-mono">{results.Q_total.toFixed(0)} W</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Time Constant τ:</div>
                <div className="text-right font-mono">{results.tau.toFixed(2)} s</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Mass:</div>
                <div className="text-right font-mono">{results.mass.toFixed(4)} kg</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Surface Area:</div>
                <div className="text-right font-mono">{results.surfaceArea.toFixed(6)} m²</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Film Temperature:</div>
                <div className="text-right font-mono">{results.T_film_C.toFixed(1)} °C</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Air Property k:</div>
                <div className="text-right font-mono">{results.airProps.k.toFixed(5)} W/(m·K)</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
