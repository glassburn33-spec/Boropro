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
  sigma_sb:      5.67037e-8,  // Stefan-Boltzmann constant     [W/m²·K⁴]
  epsilon:       0.85,        // Emissivity of borosilicate    [-]
  tensile_limit: 50,          // Borosilicate tensile limit    [MPa]
  g:             9.81,        // Gravitational acceleration    [m/s²]
  PI:            Math.PI,
};

// ============================================================
// PART 2: AIR PROPERTIES LOOKUP TABLE — Cengel Table A-15, 1 atm
//
// Expanded table covering 250 °C to 700 °C for comprehensive film
// temperature coverage across all operational ranges. Supports accurate
// interpolation for room temperatures from 0°C to +40 °C and kiln
// temperatures from 565 °C to 650 °C.
//
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
  { T: 400, cp: 1069, k: 0.05015, nu: 6.219e-5, Pr: 0.6948 },
  { T: 450, cp: 1081, k: 0.05298, nu: 6.997e-5, Pr: 0.6965 },
  { T: 500, cp: 1093, k: 0.05572, nu: 7.806e-5, Pr: 0.6986 },
  { T: 600, cp: 1115, k: 0.06093, nu: 9.515e-5, Pr: 0.7037 },
  { T: 700, cp: 1135, k: 0.06581, nu: 1.133e-4, Pr: 0.7092 },
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
 *   T_C <= 250 °C  →  returns exact 250 °C row values (lower clamp)
 *   T_C >= 700 °C  →  returns exact 700 °C row values (upper clamp)
 *   250 < T_C < 700 →  linearly interpolates between bracketing rows
 *
 * Film temperature range for kiln 565–650 °C with T_room 0 to +40 °C:
 *   T_film = 282.5 °C to 345 °C — fully bracketed by this table.
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

  // Clamp below lower bound (250 °C)
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
 * Flat plate — horizontal plate, hot surface facing UP
 *   L_char = A_surface / perimeter  (hydraulic characteristic length)
 *   Ra  = g · β · ΔT · L_char³ / ν²  · Pr
 *   Nu  = 0.54 · Ra^(1/4)   for Ra < 1e7
 *   Nu  = 0.15 · Ra^(1/3)   for Ra >= 1e7
 *   h   = (k / L_char) · Nu
 */
function calcH_plate(
  L: number,
  T_work: number,
  T_room: number,
  beta: number,
  k: number,
  nu: number,
  Pr: number
): number {
  const { g } = GLASS;
  const deltaT = T_work - T_room;

  const Ra = (g * beta * deltaT * L ** 3 / nu ** 2) * Pr;

  const Nu = Ra < 1e7
    ? 0.54 * Ra ** (1 / 4)
    : 0.15 * Ra ** (1 / 3);

  return (k / L) * Nu;
}

/**
 * Hollow cylinder — Churchill-Chu horizontal cylinder correlation:
 *   D   = outer diameter [m]
 *   Ra  = g·β·ΔT·(D/2)³ / ν²  · Pr  (note: characteristic length is radius, not diameter)
 *   Nu  = { 0.6 + 0.387·Ra^(1/6) / [1+(0.559/Pr)^(9/16)]^(8/27) }²
 *   h   = (k_air / (D/2)) · Nu
 */
function calcH_cylinder(D: number, T_work: number, T_room: number, beta: number, k: number, nu: number, Pr: number): number {
  const { g, PI: _PI } = GLASS;
  const deltaT = T_work - T_room;  // Driving force is surface-to-ambient
  const r = D / 2;  // Characteristic length is radius, not diameter

  // Churchill-Chu horizontal cylinder correlation
  const Ra = (g * beta * deltaT * r ** 3 / nu ** 2) * Pr;
  const Nu = (0.6 + (0.387 * Ra ** (1 / 6)) /
    (1 + (0.559 / Pr) ** (9 / 16)) ** (8 / 27)) ** 2;

  return (k / r) * Nu;   // [W/(m²·K)]
}

/**
 * Solid sphere — Churchill-Chu sphere correlation:
 *   D   = sphere diameter [m]
 *   Ra  = g·β·ΔT·D³ / ν²  · Pr  (note: characteristic length is full diameter, not radius)
 *   Nu  = 2 + 0.589·Ra^(1/4) / [1+(0.469/Pr)^(9/16)]^(4/9)
 *   h   = (k_air / D) · Nu
 */
function calcH_sphere(D: number, T_work: number, T_room: number, beta: number, k: number, nu: number, Pr: number): number {
  const { g, PI: _PI } = GLASS;
  const deltaT = T_work - T_room;  // Driving force is surface-to-ambient

  // Churchill-Chu sphere correlation
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
  T_room:    number;   // °C — user-entered room temperature
  beta:      number;   // [1/K]
  k:         number;
  nu:        number;
  Pr:        number;
}) {
  const t  = inputs.thickness / 1000;   // [m]
  const r  = inputs.radius    / 1000;   // [m]
  const L  = inputs.length    / 1000;   // [m]
  const W  = inputs.width     / 1000;   // [m]
  const { T_work, T_room, beta, k, nu, Pr } = inputs;
  const { rho, cp, epsilon, sigma_sb, PI } = GLASS;

  const T_s_K   = T_work + 273.15;
  const T_room_K = T_room + 273.15;

  switch (inputs.shape) {

    // ----------------------------------------------------------
    // FLAT PLATE
    // τ  = ρ·cp·t / h          (MATLAB: tau = rho*cp*thickness / h)
    // t* = −τ · ln((T_strain−T_env)/(T_work−T_env))
    // ----------------------------------------------------------
    case 'plate': {
      const A_surface_flat = 2 * ((L * W) + (L * t) + (W * t));
      const perimeter      = 2 * (L + W);
      const L_char         = A_surface_flat / perimeter;
      const h_conv         = calcH_plate(L_char, T_work, T_room, beta, k, nu, Pr);
      const T_env_K        = T_room + 273.15;

      // Geometry
      const V          = t * L * W;
      const A_surface  = 2 * (L * W) + 2 * (L * t) + 2 * (W * t);
      const A_outer    = A_surface;   // all faces exposed
      const mass       = rho * V;

      // Lumped time constant — matches MATLAB: tau = rho*cp*thickness / h
      const tau        = (rho * cp * t) / h_conv;

      // Radiation heat flux (reporting only)
      const Q_rad      = epsilon * sigma_sb * A_outer * (T_s_K ** 4 - T_env_K ** 4);
      const Q_conv     = h_conv * A_outer * (T_work - T_room);
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
      const h_conv     = calcH_cylinder(D, T_work, T_room, beta, k, nu, Pr);
      const T_env_K    = T_room + 273.15;

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
      const Q_conv     = h_conv * A_outer * (T_work - T_room);
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
      const h_conv     = calcH_sphere(D, T_work, T_room, beta, k, nu, Pr);
      const T_env_K    = T_room + 273.15;

      const V          = (4 / 3) * PI * r ** 3;
      const A_surface  = 4 * PI * r ** 2;
      const A_outer    = PI * D ** 2;   // = 4πr² — matches MATLAB A_outer_sphere
      const mass       = GLASS.rho * V;

      // Lumped time constant — matches MATLAB: tau = rho*cp*R / (3*h)
      const tau        = (rho * cp * r) / (3 * h_conv);

      // Radiation
      const Q_rad      = epsilon * sigma_sb * A_outer * (T_s_K ** 4 - T_env_K ** 4);
      const Q_conv     = h_conv * A_outer * (T_work - T_room);
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
  
  // Validate room temperature
  if (T_room < 0 || T_room > 40) {
    throw new Error('Room temperature must be between 0 and 40 °C');
  }
  
  const T_film_C = (T_work + T_room) / 2;
  const T_film_K = T_film_C + 273.15;
  const beta     = 1 / T_film_K;

  // Interpolate air properties at film temperature
  const airProps = interpolateAirProps(T_film_C);
  const { cp: cp_air, k, nu, Pr } = airProps;

  const shape  = getShapeParameters({ ...inputs, T_work, T_room, beta, k, nu, Pr });
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
  
  // Validation helpers
  const kilnTempValue   = parseFloat(kilnTemp);
  const kilnTempInvalid = isNaN(kilnTempValue) || kilnTempValue < 565 || kilnTempValue > 650;
  const roomTempValue   = parseFloat(roomTemp);
  const roomTempInvalid = isNaN(roomTempValue) || roomTempValue < 0 || roomTempValue > 40;
  const [hasCalc,   setHasCalc]   = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerRunning,  setTimerRunning]  = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const originalTimeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Helper function to format working time as "X min Y sec"
  function formatTime(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.round(totalSeconds % 60);
    return `${mins} min ${secs} sec`;
  }

  // Validate inputs
  function validateInputs(): string | null {
    const roomTempNum = parseFloat(roomTemp);
    if (isNaN(roomTempNum) || roomTempNum < 0 || roomTempNum > 40) {
      return 'Room temperature must be between 0 and 40 °C';
    }
    return null;
  }

  // Handle Calculate button click
  function handleCalculate() {
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
      setTimeRemaining(res.workingTimeSeconds);
    } catch (err) {
      setError((err as Error).message);
      setHasCalc(false);
    }
  }

  // Timer functions
  function handleStartStop() {
    if (timerRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
      originalTimeRef.current = timeRemaining || 0;
      const startTime = Date.now();
      const startValue = timeRemaining || 0;

      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, startValue - elapsed);
        setTimeRemaining(remaining);

        if (remaining <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimerRunning(false);
          playBeep();
        }
      }, 100);
    }
  }

  function resetTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerRunning(false);
    setTimeRemaining(results?.workingTimeSeconds || 0);
  }

  function playBeep() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, now + i * 0.15);
      gain.gain.setValueAtTime(0, now + i * 0.15 + 0.1);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.1);
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
    setHasCalc(false);
    setTimeRemaining(null);
    setTimerRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  const calcBlocked =
    kilnTempInvalid ||
    roomTempInvalid ||
    (shape === 'cylinder' && parseFloat(thickness) >= parseFloat(radius));

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-amber-400 mb-2">BoroPro Calculator</h1>
        <p className="text-sm text-stone-400">
          Calculate available working time before borosilicate glass reaches its strain point (515 °C) after removal from kiln at 565 °C, in 25 °C ambient air.
        </p>
        <p className="text-xs text-stone-500 mt-2 italic">
          Uses Churchill-Chu natural-convection correlations with air properties evaluated at T_film = 286 °C.
        </p>
      </div>

      {/* INPUT SECTION */}
      <Card className="bg-stone-800 border-stone-700 p-4 mb-4">
        {/* Room Temperature */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-stone-300 mb-2">
            Room Temperature (°C)
            <span className="text-xs text-stone-500 ml-2">
              (ambient air temperature where glass cools. Allowed range: 0 – 40 °C)
            </span>
          </label>
          <Input
            type="number"
            placeholder="25"
            value={roomTemp}
            onChange={(e) => setRoomTemp(e.target.value)}
            className="bg-stone-900 border-stone-600 text-stone-100"
          />
          {error && error.includes('Room temperature') && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {error}
            </p>
          )}
        </div>

        {/* Kiln Temperature */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-stone-300 mb-2">
            Kiln Temperature (°C)
            <span className="text-xs text-stone-500 ml-2">
              (working temperature of the glass when removed from the kiln. Allowed range: 565 – 650 °C)
            </span>
          </label>
          <Input
            type="number"
            placeholder="565"
            value={kilnTemp}
            onChange={(e) => setKilnTemp(e.target.value)}
            className="bg-stone-900 border-stone-600 text-stone-100"
          />
        </div>

        {/* Glass Shape */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-stone-300 mb-2">Glass Shape</label>
          <div className="flex gap-2">
            {['plate', 'cylinder', 'sphere'].map((s) => (
              <Button
                key={s}
                onClick={() => setShape(s)}
                variant={shape === s ? 'default' : 'outline'}
                className={`flex-1 capitalize ${
                  shape === s
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-stone-700 hover:bg-stone-600 border-stone-600 text-stone-300'
                }`}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Geometry Inputs */}
        {shape === 'plate' && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Length (mm)</label>
              <Input
                type="number"
                placeholder="50"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="bg-stone-900 border-stone-600 text-stone-100"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Width (mm)</label>
              <Input
                type="number"
                placeholder="25"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="bg-stone-900 border-stone-600 text-stone-100"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Thickness (mm)</label>
              <Input
                type="number"
                placeholder="2"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="bg-stone-900 border-stone-600 text-stone-100"
              />
            </div>
          </div>
        )}

        {shape === 'cylinder' && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Wall Thickness (mm)</label>
              <Input
                type="number"
                placeholder="2"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="bg-stone-900 border-stone-600 text-stone-100"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Outer Radius (mm)</label>
              <Input
                type="number"
                placeholder="25"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="bg-stone-900 border-stone-600 text-stone-100"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Length (mm)</label>
              <Input
                type="number"
                placeholder="50"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="bg-stone-900 border-stone-600 text-stone-100"
              />
            </div>
          </div>
        )}

        {shape === 'sphere' && (
          <div className="grid grid-cols-1 gap-2 mb-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Outer Radius (mm)</label>
              <Input
                type="number"
                placeholder="25"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="bg-stone-900 border-stone-600 text-stone-100"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleCalculate}
            disabled={calcBlocked}
            className={`flex-1 font-bold text-white ${
              calcBlocked
                ? 'bg-stone-600 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500'
            }`}
          >
            Calculate
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 bg-stone-700 hover:bg-stone-600 border-stone-600 text-stone-300"
          >
            Reset
          </Button>
        </div>

        {/* Room Temperature Validation */}
        {roomTempInvalid && (
          <p className="text-xs text-red-400 mt-2">
            ⚠ Room temperature must be between 0 °C and 40 °C.
          </p>
        )}
        
        {/* Kiln Temperature Validation */}
        {kilnTempInvalid && (
          <p className="text-xs text-red-400 mt-2">
            ⚠ Kiln temperature must be between 565 °C and 650 °C.
          </p>
        )}

        {error && !roomTempInvalid && !kilnTempInvalid && (
          <p className="text-xs text-red-400 mt-3 flex items-center gap-1">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </Card>

      {/* RESULTS SECTION */}
      {hasCalc && results && (
        <div className="space-y-4">
          {/* WORKING TIME DISPLAY */}
          <Card className="bg-stone-900 border-amber-600/50 p-6 text-center">
            <p className="text-sm font-semibold text-amber-400 mb-2">AVAILABLE WORKING TIME</p>
            <p className="text-xs text-stone-400 mb-4">{results.shapeLabel}</p>
            <p className="text-4xl font-bold text-amber-300 mb-4">
              {formatTime(results.workingTimeSeconds)}
            </p>

            {/* Timer */}
            <div className="bg-stone-800 rounded p-3 mb-3">
              <p className="text-xs text-stone-400 mb-2">Working Time Timer</p>
              <div className="text-2xl font-bold text-amber-300 mb-2">
                {timeRemaining !== null ? formatTime(timeRemaining) : '0 min 0 sec'}
              </div>
              <div className="w-full bg-stone-700 rounded-full h-2 mb-3">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all"
                  style={{
                    width:
                      timeRemaining !== null && results.workingTimeSeconds > 0
                        ? `${(timeRemaining / results.workingTimeSeconds) * 100}%`
                        : '0%',
                  }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleStartStop}
                  className={`flex-1 font-bold text-white ${
                    timerRunning
                      ? 'bg-red-700 hover:bg-red-600'
                      : 'bg-green-700 hover:bg-green-600'
                  }`}
                >
                  {timerRunning ? '⏸ Stop' : '▶ Start'}
                </Button>
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  className="flex-1 bg-stone-700 hover:bg-stone-600 border-stone-600 text-stone-300"
                >
                  ↺ Reset
                </Button>
              </div>

              <p className="text-xs text-stone-500 mt-3 text-center">
                Timer beeps 3× and resets automatically when it reaches zero.
              </p>
            </div>
          </Card>



          {/* HEAT TRANSFER DETAILS */}
          <Card className="bg-stone-800 border-stone-700 p-4">
            <p className="text-sm font-semibold text-stone-300 mb-3">
              CONVECTION DETAILS
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-stone-900/60 rounded p-2">
                <p className="text-stone-400">h (natural conv.)</p>
                <p className="text-stone-200 font-bold">
                  {results.h_conv.toFixed(2)} W/m²·K
                </p>
              </div>
              <div className="bg-stone-900/60 rounded p-2">
                <p className="text-stone-400">Time constant τ</p>
                <p className="text-stone-200 font-bold">
                  {results.tau.toFixed(1)} s
                </p>
              </div>
              <div className="bg-stone-900/60 rounded p-2">
                <p className="text-stone-400">Q conv.</p>
                <p className="text-stone-200 font-bold">
                  {results.Q_conv.toFixed(1)} W
                </p>
              </div>
              <div className="bg-stone-900/60 rounded p-2">
                <p className="text-stone-400">Q rad.</p>
                <p className="text-stone-200 font-bold">
                  {results.Q_rad.toFixed(1)} W
                </p>
              </div>
              <div className="bg-stone-900/60 rounded p-2 col-span-2">
                <p className="text-stone-400">Q total</p>
                <p className="text-stone-200 font-bold">
                  {results.Q_total.toFixed(1)} W
                </p>
              </div>
            </div>
          </Card>

          {/* KILN TEMPERATURE & FILM TEMPERATURE */}
          <Card className="bg-stone-800 border-stone-700 p-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-stone-900/60 rounded p-2">
                <p className="text-stone-400">Kiln temp used</p>
                <p className="text-stone-200 font-bold">{results.T_work} °C</p>
              </div>
              <div className="bg-stone-900/60 rounded p-2">
                <p className="text-stone-400">T&#8209;film</p>
                <p className="text-stone-200 font-bold">{results.T_film_C.toFixed(0)} °C</p>
              </div>
            </div>
          </Card>

          {/* AIR PROPERTIES — interpolated at T_film */}
          <Card className="bg-stone-800 border-stone-700 p-4">
            <p className="text-sm font-semibold text-stone-300 mb-1">
              AIR PROPERTIES @ T-film ≈ {results.T_film_C.toFixed(0)} °C
            </p>
            <p className="text-xs text-stone-500 mb-3 italic">
              Linearly interpolated from Cengel Table A-15 (1 atm)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-stone-900/60 rounded p-2">
                <p className="text-stone-400">k (thermal cond.)</p>
                <p className="text-stone-200 font-bold">
                  {results.airProps.k.toFixed(5)} W/(m·K)
                </p>
              </div>
              <div className="bg-stone-900/60 rounded p-2">
                <p className="text-stone-400">ν (kinematic visc.)</p>
                <p className="text-stone-200 font-bold">
                  {results.airProps.nu.toExponential(4)} m²/s
                </p>
              </div>
              <div className="bg-stone-900/60 rounded p-2">
                <p className="text-stone-400">Pr (Prandtl)</p>
                <p className="text-stone-200 font-bold">
                  {results.airProps.Pr.toFixed(4)}
                </p>
              </div>

              <div className="bg-stone-900/60 rounded p-2">
                <p className="text-stone-400">β (exp. coeff.)</p>
                <p className="text-stone-200 font-bold">
                  {(1 / (results.T_film_C + 273.15)).toExponential(4)} 1/K
                </p>
              </div>
              <div className="bg-stone-900/60 rounded p-2">
                <p className="text-stone-400">Room temp used</p>
                <p className="text-stone-200 font-bold">{results.T_room} °C</p>
              </div>
            </div>
          </Card>

        </div>
      )}
    </div>
  );
}
