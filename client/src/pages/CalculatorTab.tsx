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

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "wouter";
import { AlertCircle, Download, Menu, X } from "lucide-react";
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
// Expanded table covering -150 °C to 700 °C for comprehensive film
// temperature coverage across all operational ranges. Supports accurate
// interpolation for room temperatures from -50 °C to +50 °C and kiln
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
  { T: -150, cp: 983,  k: 0.01171, nu: 3.013e-6,  Pr: 0.7246 },
  { T: -100, cp: 966,  k: 0.01582, nu: 5.837e-6,  Pr: 0.7263 },
  { T: -50,  cp: 999,  k: 0.01979, nu: 9.319e-6,  Pr: 0.7440 },
  { T: -40,  cp: 1002, k: 0.02057, nu: 1.008e-5,  Pr: 0.7436 },
  { T: -30,  cp: 1004, k: 0.02134, nu: 1.087e-5,  Pr: 0.7425 },
  { T: -20,  cp: 1005, k: 0.02211, nu: 1.169e-5,  Pr: 0.7408 },
  { T: -10,  cp: 1006, k: 0.02288, nu: 1.252e-5,  Pr: 0.7387 },
  { T: 0,    cp: 1006, k: 0.02364, nu: 1.338e-5,  Pr: 0.7362 },
  { T: 5,    cp: 1006, k: 0.02401, nu: 1.382e-5,  Pr: 0.7350 },
  { T: 10,   cp: 1006, k: 0.02439, nu: 1.426e-5,  Pr: 0.7336 },
  { T: 15,   cp: 1007, k: 0.02476, nu: 1.470e-5,  Pr: 0.7323 },
  { T: 20,   cp: 1007, k: 0.02514, nu: 1.516e-5,  Pr: 0.7309 },
  { T: 25,   cp: 1007, k: 0.02551, nu: 1.562e-5,  Pr: 0.7296 },
  { T: 30,   cp: 1007, k: 0.02588, nu: 1.608e-5,  Pr: 0.7282 },
  { T: 35,   cp: 1007, k: 0.02625, nu: 1.655e-5,  Pr: 0.7268 },
  { T: 40,   cp: 1007, k: 0.02662, nu: 1.702e-5,  Pr: 0.7255 },
  { T: 45,   cp: 1007, k: 0.02699, nu: 1.750e-5,  Pr: 0.7241 },
  { T: 50,   cp: 1007, k: 0.02735, nu: 1.798e-5,  Pr: 0.7228 },
  { T: 60,   cp: 1007, k: 0.02808, nu: 1.896e-5,  Pr: 0.7202 },
  { T: 70,   cp: 1007, k: 0.02881, nu: 1.995e-5,  Pr: 0.7177 },
  { T: 80,   cp: 1008, k: 0.02953, nu: 2.097e-5,  Pr: 0.7154 },
  { T: 90,   cp: 1008, k: 0.03024, nu: 2.201e-5,  Pr: 0.7132 },
  { T: 100,  cp: 1009, k: 0.03095, nu: 2.306e-5,  Pr: 0.7111 },
  { T: 120,  cp: 1011, k: 0.03235, nu: 2.522e-5,  Pr: 0.7073 },
  { T: 140,  cp: 1013, k: 0.03374, nu: 2.745e-5,  Pr: 0.7041 },
  { T: 160,  cp: 1016, k: 0.03511, nu: 2.975e-5,  Pr: 0.7014 },
  { T: 180,  cp: 1019, k: 0.03646, nu: 3.212e-5,  Pr: 0.6992 },
  { T: 200,  cp: 1023, k: 0.03779, nu: 3.455e-5,  Pr: 0.6974 },
  { T: 250,  cp: 1033, k: 0.04104, nu: 4.091e-5,  Pr: 0.6946 },
  { T: 300,  cp: 1044, k: 0.04418, nu: 4.765e-5,  Pr: 0.6935 },
  { T: 350,  cp: 1056, k: 0.04721, nu: 5.475e-5,  Pr: 0.6937 },
  { T: 400,  cp: 1069, k: 0.05015, nu: 6.219e-5,  Pr: 0.6948 },
  { T: 450,  cp: 1081, k: 0.05298, nu: 6.997e-5,  Pr: 0.6965 },
  { T: 500,  cp: 1093, k: 0.05572, nu: 7.806e-5,  Pr: 0.6986 },
  { T: 600,  cp: 1115, k: 0.06093, nu: 9.515e-5,  Pr: 0.7037 },
  { T: 700,  cp: 1135, k: 0.06581, nu: 1.133e-4,  Pr: 0.7092 },
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
 *   T_C <= -150 °C  →  returns exact -150 °C row values
 *   T_C >= 700 °C   →  returns exact 700 °C row values
 *   -150 < T_C < 700 →  interpolates between bracketing rows
 *
 * Film temperature range for kiln 565–650 °C with T_room -50 to +50 °C:
 *   T_film = 257.5 °C to 350 °C — fully bracketed by this table.
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
 * Flat plate — Churchill-Chu vertical plate correlation (MATLAB Ra uses cosd(30)):
 *   Ra  = g·cos(30°)·β·ΔT·L³ / ν²  · Pr
 *   Nu  = { 0.825 + 0.387·Ra^(1/6) / [1+(0.492/Pr)^(9/16)]^(8/27) }²
 *   h   = (k_air / L) · Nu
 * L = plate length [m], deltaT = T_work − T_room [°C]
 */
function calcH_plate(Char_leng: number, T_work: number, T_room: number, beta: number, k: number, nu: number, Pr: number): number {
  const { g, PI: _PI } = GLASS;
  const T_s_K = T_work + 273.15;
  const T_room_K = T_room + 273.15;
  const T_strain_K = GLASS.T_strain + 273.15;
  const deltaT = T_s_K - T_room_K;  // Driving force is surface-to-env
  const cos60  = Math.cos((60 * Math.PI) / 180);   // ≈ 0.5

  // EDIT RAYLEIGH AND NUSSELT:
  const Ra = (g * cos60 * beta * deltaT * Math.pow(Char_leng, 3) / (nu ** 2)) * Pr;
  const Nu = (0.825 + 0.387 * Math.pow(Ra, (1/6)) / 
            Math.pow((1 + Math.pow((0.492 / Pr), (9/16))), (8/27))) ** 2;
  return (k / Char_leng) * Nu;   // [W/(m²·K)]
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
  const T_work_K = T_work + 273.15;
  const T_room_K = T_room + 273.15;
  const deltaT = T_work_K - T_room_K;  // Driving force is surface-to-env
  const r = D / 2;  // radius
  const D_cyl = 2 * r;  // D_cyl = twice the radius

  // EDIT RAYLEIGH AND NUSSELT:
  const Ra = (g * beta * deltaT * Math.pow(D_cyl, 3) / nu ** 2) * Pr;
  const Nu = Math.pow(0.6 + (0.387 * Math.pow(Ra, 1/6)) / 
             Math.pow((1 + Math.pow(0.559/Pr, 9/16)), 8/27), 2);

  return (k / D_cyl) * Nu;   // [W/(m²·K)]
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
  const T_work_K = T_work + 273.15;
  const T_room_K = T_room + 273.15;
  const deltaT = T_work_K - T_room_K;  // Driving force is surface-to-env
  const r = D / 2;  // radius
  const D_sphere = 2 * r;  // Characteristic length

  // EDIT RAYLEIGH AND NUSSELT:
  const Ra = (g * beta * deltaT * Math.pow(D_sphere, 3) / (nu ** 2)) * Pr;
  const Nu = (0.825 + 0.589 * Math.pow(Ra, (1 / 4))) / Math.pow((1 + Math.pow((0.469 / Pr), (9 / 16))), (4 / 9));

  return (k / D_sphere) * Nu;   // [W/(m²·K)]
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
  const T_env_K = T_room + 273.15;  // Environment temperature in Kelvin
  const T_strain_K = GLASS.T_strain + 273.15;

  switch (inputs.shape) {

    // ----------------------------------------------------------
    // FLAT PLATE
    // τ  = ρ·cp·t / h          (MATLAB: tau = rho*cp*thickness / h)
    // t* = −τ · ln((T_strain−T_room)/(T_work−T_room))
    // ----------------------------------------------------------
    case 'plate': {
      // Geometry
      const V          = t * L * W;
      const A_surface  = 2 * L * W + 2*t*L + 2*t*W;
      const A_outer    = A_surface;   // all faces exposed
      const mass       = rho * V;
      const Perimeter  = L + t;
      const Char_leng  = W + L;
      const h_conv     = calcH_plate(Char_leng, T_work, T_room, beta, k, nu, Pr);

      // Lumped time constant — matches MATLAB: tau = rho*cp*thickness / h
      const tau        = (GLASS.rho * GLASS.cp * t) / (h_conv);

      // Radiation heat flux (reporting only)
      const Q_rad      = epsilon * sigma_sb * A_outer * (Math.pow(T_s_K, 4) - Math.pow(T_room_K, 4));
      const Q_conv     = h_conv * A_outer * (T_s_K - T_room_K);
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
    // t* = −τ · ln((T_strain−T_room)/(T_work−T_room))
    // ----------------------------------------------------------
    case 'cylinder': {
      if (t >= r) throw new Error(
        `Wall thickness (${inputs.thickness} mm) must be less than radius (${inputs.radius} mm)`
      );
      const D          = 2 * r;
      const r_inner    = r - t;
      const D_cyl      = 2 * r;  // D_cyl = twice the radius
      const h_conv     = calcH_cylinder(D, T_work, T_room, beta, k, nu, Pr);
      const V_cyl      = (PI / 4) * ((2 * r) ** 2 - (2 * r_inner) ** 2)*L;
      const A_surface  = 2 * PI * (r ** 2 - r_inner ** 2)
                       + 2 * PI * r       * L
                       + 2 * PI * r_inner * L;
      // MATLAB uses only the outer lateral surface for τ
      const A_outer    = 2 * PI * r * L;
      const mass       = rho * V_cyl;

      // Lumped time constant — matches MATLAB: tau = rho*cp*V / (h*A_outer)
      const tau        = (GLASS.rho * GLASS.cp * V_cyl) / (h_conv * A_outer);

      // Radiation
      const Q_rad      = epsilon * sigma_sb * A_outer * (Math.pow(T_s_K, 4) - Math.pow(T_env_K, 4));
      const Q_conv     = h_conv * A_outer * (T_s_K - T_env_K);
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
    // t* = −τ · ln((T_strain−T_room)/(T_work−T_room))
    // ----------------------------------------------------------
    case 'sphere': {
      const D          = 2 * r;
      const h_conv     = calcH_sphere(D, T_work, T_room, beta, k, nu, Pr);

      const V          = (4 / 3) * PI * r ** 3;
      const A_surface  = 4 * PI * r ** 2;
      const A_outer    = PI * D ** 2;   // = 4πr² — matches MATLAB A_outer_sphere
      const mass       = GLASS.rho * V;
      const D_sphere   = D;  // Characteristic length

      // Lumped time constant — matches MATLAB: tau = rho*cp*R / (3*h)
      const tau        = (GLASS.rho * GLASS.cp * r) / (3 * h_conv);

      // Radiation
      const Q_rad      = epsilon * sigma_sb * A_outer * (Math.pow(T_s_K, 4) - Math.pow(T_room_K, 4));
      const Q_conv     = h_conv * A_outer * (T_s_K - T_room_K);
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
//   t* = −τ · ln((T_strain − T_room) / (T_work − T_room)
// τ is shape-dependent and comes from getShapeParameters().
// ============================================================

function calcWorkingTime(tau: number, T_work: number, T_room: number ): number {
  const { T_strain } = GLASS;
  const T_strain_K = T_strain + 273.15;
  const T_room_K = T_room + 273.15;
  const T_s_K = T_work + 273.15;

  // EDIT THIS FORMULA:
  // Current: t* = -τ · ln((T_strain - T_room) / (T_work - T_room))
  return -tau * Math.log((T_strain_K - T_room_K) / (T_s_K - T_room_K));   // [s]
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
  T_room:   number;  // Room temperature, default 25°C
}) {
  // Input validation
  if (inputs.shape !== 'sphere' && (inputs.thickness < 2 || inputs.thickness > 10))
    throw new Error('Thickness must be between 2 and 10 mm.');
  if ((inputs.shape === 'cylinder' || inputs.shape === 'sphere') && (inputs.radius < 10 || inputs.radius > 25))
    throw new Error('Diameter must be between 20 and 50 mm.');
  if (inputs.shape === 'cylinder' && inputs.thickness >= inputs.radius)
    throw new Error('Wall thickness must be less than radius.');
  if (inputs.shape === 'plate' && (inputs.length < 15 || inputs.length > 100))
    throw new Error('Length must be between 15 and 100 mm for plate.');
  if (inputs.shape === 'cylinder' && (inputs.length < 15 || inputs.length > 100))
    throw new Error('Length must be between 15 and 100 mm for cylinder.');


  const { T_work } = inputs;
  const {T_room} = inputs;  // Default to 25°C if not provided
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
// EXPORT UTILITY FUNCTIONS
// ============================================================

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins} min ${secs} sec`;
}

function generateScheduleData(results: ReturnType<typeof runCalculation>, shape: string, thickness: string, radius: string, length: string, kilnTemp: string, roomTemp: string) {
  const timestamp = new Date().toLocaleString();
  const schedule = {
    timestamp,
    geometry: {
      shape,
      thickness_mm: parseFloat(thickness),
      radius_mm: parseFloat(radius),
      length_mm: parseFloat(length),
    },
    conditions: {
      kiln_temp_c: parseFloat(kilnTemp),
      room_temp_c: parseFloat(roomTemp),
      strain_point_c: 515,
      annealing_point_c: 565,
    },
    results: {
      working_time_seconds: results.workingTimeSeconds,
      working_time_formatted: formatTime(results.workingTimeSeconds),
      time_constant_tau_s: results.tau,
      convection_coefficient_h: results.h_conv,
      convection_heat_flux: results.Q_conv,
      radiation_heat_flux: results.Q_rad,
      total_heat_flux: results.Q_total,
      max_cooling_rate_c_per_min: (results.Q_total / (results.mass * GLASS.cp)) * 60,
    },
  };
  return schedule;
}

function exportToCSV(results: ReturnType<typeof runCalculation>, shape: string, thickness: string, radius: string, length: string, kilnTemp: string, roomTemp: string) {
  const schedule = generateScheduleData(results, shape, thickness, radius, length, kilnTemp, roomTemp);
  const lines = [
    'BoroPro Cooling Schedule Export',
    `Generated: ${schedule.timestamp}`,
    '',
    'GEOMETRY',
    `Shape,${schedule.geometry.shape}`,
    `Thickness (mm),${schedule.geometry.thickness_mm}`,
    `Radius (mm),${schedule.geometry.radius_mm}`,
    `Length (mm),${schedule.geometry.length_mm}`,
    '',
    'CONDITIONS',
    `Kiln Temperature (°C),${schedule.conditions.kiln_temp_c}`,
    `Room Temperature (°C),${schedule.conditions.room_temp_c}`,
    `Strain Point (°C),${schedule.conditions.strain_point_c}`,
    `Annealing Point (°C),${schedule.conditions.annealing_point_c}`,
    '',
    'CALCULATED RESULTS',
    `Working Time,${schedule.results.working_time_formatted}`,
    `Working Time (seconds),${schedule.results.working_time_seconds}`,
    `Time Constant τ (s),${schedule.results.time_constant_tau_s.toFixed(2)}`,
    `Convection Coefficient h (W/m²·K),${schedule.results.convection_coefficient_h.toFixed(2)}`,
    `Convection Heat Flux (W/m²),${schedule.results.convection_heat_flux.toFixed(2)}`,
    `Radiation Heat Flux (W/m²),${schedule.results.radiation_heat_flux.toFixed(2)}`,
    `Total Heat Flux (W/m²),${schedule.results.total_heat_flux.toFixed(2)}`,
    `Max Cooling Rate (°C/min),${(schedule.results.max_cooling_rate_c_per_min).toFixed(2)}`,
  ];
  
  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `boropro_schedule_${new Date().getTime()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToPDF(results: ReturnType<typeof runCalculation>, shape: string, thickness: string, radius: string, length: string, kilnTemp: string, roomTemp: string) {
  const schedule = generateScheduleData(results, shape, thickness, radius, length, kilnTemp, roomTemp);
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>BoroPro Cooling Schedule</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        h1 { color: #d97706; border-bottom: 2px solid #d97706; padding-bottom: 10px; }
        h2 { color: #b45309; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f3f4f6; font-weight: bold; }
        .section { margin: 20px 0; }
        .timestamp { color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>BoroPro Cooling Schedule</h1>
      <p class="timestamp">Generated: ${schedule.timestamp}</p>
      
      <div class="section">
        <h2>Geometry</h2>
        <table>
          <tr><th>Parameter</th><th>Value</th></tr>
          <tr><td>Shape</td><td>${schedule.geometry.shape}</td></tr>
          <tr><td>Thickness (mm)</td><td>${schedule.geometry.thickness_mm}</td></tr>
          <tr><td>Radius (mm)</td><td>${schedule.geometry.radius_mm}</td></tr>
          <tr><td>Length (mm)</td><td>${schedule.geometry.length_mm}</td></tr>
        </table>
      </div>
      
      <div class="section">
        <h2>Conditions</h2>
        <table>
          <tr><th>Parameter</th><th>Value</th></tr>
          <tr><td>Kiln Temperature (°C)</td><td>${schedule.conditions.kiln_temp_c}</td></tr>
          <tr><td>Room Temperature (°C)</td><td>${schedule.conditions.room_temp_c}</td></tr>
          <tr><td>Strain Point (°C)</td><td>${schedule.conditions.strain_point_c}</td></tr>
          <tr><td>Annealing Point (°C)</td><td>${schedule.conditions.annealing_point_c}</td></tr>
        </table>
      </div>
      
      <div class="section">
        <h2>Calculated Results</h2>
        <table>
          <tr><th>Parameter</th><th>Value</th></tr>
          <tr><td>Working Time</td><td>${schedule.results.working_time_formatted}</td></tr>
          <tr><td>Working Time (seconds)</td><td>${schedule.results.working_time_seconds}</td></tr>
          <tr><td>Time Constant τ (s)</td><td>${schedule.results.time_constant_tau_s.toFixed(2)}</td></tr>
          <tr><td>Convection Coefficient h (W/m²·K)</td><td>${schedule.results.convection_coefficient_h.toFixed(2)}</td></tr>
          <tr><td>Convection Heat Flux (W/m²)</td><td>${schedule.results.convection_heat_flux.toFixed(2)}</td></tr>
          <tr><td>Radiation Heat Flux (W/m²)</td><td>${schedule.results.radiation_heat_flux.toFixed(2)}</td></tr>
          <tr><td>Total Heat Flux (W/m²)</td><td>${schedule.results.total_heat_flux.toFixed(2)}</td></tr>
          <tr><td>Max Cooling Rate (°C/min)</td><td>${schedule.results.max_cooling_rate_c_per_min.toFixed(2)}</td></tr>
        </table>
      </div>
      
      <div class="section" style="margin-top: 40px; font-size: 12px; color: #666;">
        <p>This schedule was generated by BoroPro, a physics-based borosilicate glass annealing calculator.</p>
        <p>Always verify calculations with your specific kiln and material before production work.</p>
      </div>
    </body>
    </html>
  `;
  
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `boropro_schedule_${new Date().getTime()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================

export function CalculatorTab() {
  const [searchParams] = useSearchParams();
  const kilnTempParam = searchParams.get('kilnTemp');
  const roomTempParam = searchParams.get('roomTemp');
  const shapeParam = searchParams.get('shape');
  const thicknessParam = searchParams.get('thickness');
  const radiusParam = searchParams.get('radius');
  const lengthParam = searchParams.get('length');
  const widthParam = searchParams.get('width');
  
  const [shape,     setShape]     = useState<string>(shapeParam || 'cylinder');
  // Defaults: 4 mm thickness, 25 mm diameter (12.5 mm radius), 25 mm length, 25 mm width (Celsius)
  const [thickness, setThickness] = useState<string>(thicknessParam || '4');  // 4 mm
  const [radius,    setRadius]    = useState<string>(radiusParam || '25');  // Store diameter directly (25 mm diameter)
  const [length,    setLength]    = useState<string>(lengthParam || '25');  // 25 mm
  const [width,     setWidth]     = useState<string>(widthParam || '25');  // 25 mm
  const [kilnTemp,  setKilnTemp]  = useState<string>(kilnTempParam || '565');
  const [roomTemp,  setRoomTemp]  = useState<string>(roomTempParam || '25');
  const [results,   setResults]   = useState<ReturnType<typeof runCalculation> | null>(null);
  const [error,     setError]     = useState<string>('');
  const [hasCalc,   setHasCalc]   = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerRunning,  setTimerRunning]  = useState<boolean>(false);
  const [timerLoop,     setTimerLoop]     = useState<boolean>(false);
  const [tempUnit,      setTempUnit]      = useState<'C' | 'F'>('C');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const originalTimeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isFirstRenderRef = useRef<boolean>(true);

  // Set separate defaults when switching between C and F modes
  useEffect(() => {
    if (!isFirstRenderRef.current) {
      if (tempUnit === 'F') {
        // F-mode defaults: 0.125 in thickness, 1 in diameter, 1 in length, 1 in width
        setThickness('0.125');
        setRadius('1');
        setLength('1');
        setWidth('1');
      } else {
        // C-mode defaults: 4 mm thickness, 25 mm diameter, 25 mm length, 25 mm width
        setThickness('4');
        setRadius('25');
        setLength('25');
        setWidth('25');
      }
    }
    isFirstRenderRef.current = false;
  }, [tempUnit]);

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
        gain.gain.setValueAtTime(0.5, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      }
    });
  }

  // Timer control functions
  function startTimer(): void {
    // Create / resume AudioContext on the user gesture (button press)
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    
    if (timeRemaining === null || timeRemaining <= 0) return;
    setTimerRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          playBeeps(3);
          if (timerLoop) {
            // Restart timer automatically if loop is enabled
            setTimeout(() => {
              startTimer();
            }, 500);
          } else {
            setTimerRunning(false);
          }
          return originalTimeRef.current;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stopTimer(): void {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerRunning(false);
  }

  function resetTimer(): void {
    stopTimer();
    setTimeRemaining(originalTimeRef.current);
  }

  function handleStartStop(): void {
    if (timerRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  }

  function handleCalculate() {
    setError('');
    
    // Check F-mode range validation
    if (tempUnit === 'F') {
      if (thicknessOutOfRange) {
        setError('Wall Thickness must be 0.0625-0.375 inches');
        return;
      }
      if (radiusOutOfRange) {
        setError('Outer Diameter must be 0.75-2.25 inches');
        return;
      }
      if (lengthOutOfRange) {
        setError('Length must be 0.5-4 inches');
        return;
      }
      if (widthOutOfRange) {
        setError('Width must be 0.5-3 inches');
        return;
      }
    }
    
    try {
      const res = runCalculation({
        shape,
        thickness: tempUnit === 'F' ? (parseFloat(thickness) * 25.4) || 0 : parseFloat(thickness) || 0,
        radius:    tempUnit === 'F' ? ((parseFloat(radius) * 25.4) / 2) || 0 : (parseFloat(radius) / 2) || 0,
        length:    tempUnit === 'F' ? (parseFloat(length) * 25.4) || 0 : parseFloat(length) || 0,
        width:     tempUnit === 'F' ? (parseFloat(width) * 25.4) || 0 : parseFloat(width) || 0,
        T_work:    parseFloat(kilnTemp) || 565,
        T_room:    parseFloat(roomTemp) || 25,
      });
      setResults(res);
      setHasCalc(true);
      // Sync timer when a new result arrives
      const secs = Math.floor(res.workingTimeSeconds);
      originalTimeRef.current = secs;
      setTimeRemaining(secs);
      setTimerRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (e: unknown) {
      setError((e as Error).message || 'Calculation error. Check your inputs.');
    }
  }

  function handleReset() {
    // Preserve current shape selection
    setResults(null);
    setError('');
    setHasCalc(false);
    // Cleanup timer
    stopTimer();
    setTimeRemaining(null);
    originalTimeRef.current = 0;
    
    // Reset to appropriate defaults based on current unit
    if (tempUnit === 'F') {
      // Reset to Fahrenheit defaults in inches
      setKilnTemp('565'); // Will be converted to F on display
      setRoomTemp('25'); // Will be converted to F on display
      setThickness('0.125');
      setRadius('1');
      setLength('1');
      setWidth('1');
    } else {
      // Reset to Celsius defaults in mm
      setKilnTemp('565');
      setRoomTemp('25');
      setThickness('4');
      setRadius('25');
      setLength('25');
      setWidth('25');
    }
    
    // Reset all dropdown menus by clearing their values
    const dropdowns = document.querySelectorAll('select');
    dropdowns.forEach((dropdown) => {
      dropdown.value = '';
    });
  }

  // F-mode range validation
  const thicknessValue = parseFloat(thickness);
  const radiusValue = parseFloat(radius);
  const lengthValue = parseFloat(length);
  const widthValue = parseFloat(width);
  
  const thicknessOutOfRange = tempUnit === 'F' && (thicknessValue < 0.0625 || thicknessValue > 0.375);
  const radiusOutOfRange = tempUnit === 'F' && (radiusValue < 0.75 || radiusValue > 2.25);
  const lengthOutOfRange = tempUnit === 'F' && (lengthValue < 0.5 || lengthValue > 4);
  const widthOutOfRange = tempUnit === 'F' && (widthValue < 0.5 || widthValue > 3);

  const thicknessWarn =
    (shape === 'cylinder' && parseFloat(thickness) >= parseFloat(radius)) ||
    thicknessOutOfRange;

  const kilnTempValue  = parseFloat(kilnTemp);
  const kilnTempInvalid = isNaN(kilnTempValue) || kilnTempValue < 565 || kilnTempValue > 700;

  const roomTempValue  = parseFloat(roomTemp);
  const roomTempInvalid = isNaN(roomTempValue) || roomTempValue < 0 || roomTempValue > 40;

  const calcBlocked =
    kilnTempInvalid ||
    roomTempInvalid ||
    (shape === 'cylinder' && parseFloat(thickness) >= parseFloat(radius));

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-3 md:py-4 px-3 md:px-0">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/manus-storage/boroprologoicon_47146e54.png" alt="BoroPrologo" className="h-16 md:h-24 w-16 md:w-24 object-contain" />
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/color-picker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Color
            </a>
            <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Flame Char
            </a>
            <a href="/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=25&length=25&width=25" className="text-xs uppercase tracking-wider text-amber-500">
              Reheat Calc
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Kiln Editor
            </a>
            <a href="/logs" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Log
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-stone-800 rounded transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-amber-400" />
            ) : (
              <Menu className="w-6 h-6 text-amber-400" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-2 px-4 py-3 bg-stone-800 border-t border-amber-700/30 max-h-[calc(100vh-120px)] overflow-y-auto">
            <a
              href="/color-picker"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Color
            </a>
            <a
              href="/flame-simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Flame Char
            </a>
            <a
              href="/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=25&length=25&width=25"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-500/40 hover:bg-amber-500/50 text-amber-300 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Reheat Calc
            </a>
            <a
              href="/firing-tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Kiln Editor
            </a>
            <a
              href="/logs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Log
            </a>
            <a
              href="/references"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              References
            </a>
          </nav>
        )}
      </header>

      <main className="flex-1 space-y-4 pb-8">
        {/* Hero */}
        <section className="border-b border-white/10 py-8 md:py-16 px-4 md:px-0">
          <div className="container">
            <h1 className="text-2xl md:text-5xl font-bold text-yellow-400 mb-2 break-words">Reheat Calculator</h1>
          </div>
        </section>

        {/* Header Image */}
        <section className="border-b border-white/10">
          <img src="/manus-storage/reheatcalculater_6e4e3f5d.png" alt="" className="w-full h-auto object-cover" style={{ maxHeight: '648px' }} />
        </section>

        <div className="container max-w-6xl space-y-4">


      {/* INPUT CARD */}
      <Card className="bg-stone-800 border-stone-700 p-4 space-y-4">

        {/* ROOM TEMPERATURE — Hidden */}
        {/* <div>
          <label className="block text-sm font-semibold text-stone-300 mb-1">
            Room Temperature (°C)
          </label>
          <p className="text-xs text-stone-500 mb-2">
            Ambient air temperature where glass cools. Allowed range: 0 – 40 °C.
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
          {roomTempInvalid && (
            <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
              <AlertCircle size={14} />
              <span>Room temperature must be between 0 and 40 °C</span>
            </div>
          )}
        </div> */}

        {/* TEMPERATURE UNIT TOGGLE */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-semibold text-stone-300">Temperature Unit:</span>
          <button
            onClick={() => {
              setTempUnit(tempUnit === 'C' ? 'F' : 'C');
              stopTimer();
              setTimeRemaining(null);
              originalTimeRef.current = 0;
              setHasCalc(false);
            }}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              tempUnit === 'C'
                ? 'bg-amber-700 border border-amber-500 text-white'
                : 'bg-stone-700 border border-stone-600 text-stone-300 hover:bg-stone-600'
            }`}
          >
            {tempUnit === 'C' ? '°C' : '°F'}
          </button>
        </div>

        {/* KILN TEMPERATURE — global input, applies to all shapes */}
        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-1">
            Kiln Temperature ({tempUnit})
          </label>
          <Input
            type="number"
            value={tempUnit === 'F' ? Math.round((parseFloat(kilnTemp) * 9/5) + 32) : kilnTemp}
            min={tempUnit === 'F' ? '1049' : '565'}
            max={tempUnit === 'F' ? '1292' : '700'}
            step="1"
            onChange={(e) => {
              const raw = e.target.value;
              if (tempUnit === 'F') {
                const celsius = ((parseFloat(raw) - 32) * 5/9).toString();
                setKilnTemp(celsius);
              } else {
                setKilnTemp(raw);
              }
            }}
            placeholder={tempUnit === 'F' ? '1049' : '565'}
            className={`bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500 ${
              kilnTempInvalid
                ? 'border-red-500 ring-1 ring-red-500'
                : ''
            }`}
          />

          {kilnTempInvalid && (
            <p className="text-xs text-red-400 mt-1">
              ⚠ Kiln temperature must be between {tempUnit === 'F' ? '1049 °F and 1292 °F' : '565 °C and 700 °C'}.
            </p>
          )}
          
          {/* QUICK-SELECT TEMPERATURE BUTTONS */}
          <div className="flex gap-2 mt-3">
            {tempUnit === 'C' ? (
              <>
                <button
                  onClick={() => setKilnTemp('565')}
                  className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-all border ${
                    kilnTemp === '565'
                      ? 'bg-amber-700 border-amber-500 text-white'
                      : 'bg-stone-700 border-stone-600 text-stone-300 hover:bg-stone-600'
                  }`}
                >
                  565°C
                </button>
                <button
                  onClick={() => setKilnTemp('700')}
                  className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-all border ${
                    kilnTemp === '700'
                      ? 'bg-amber-700 border-amber-500 text-white'
                      : 'bg-stone-700 border-stone-600 text-stone-300 hover:bg-stone-600'
                  }`}
                >
                  700°C
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setKilnTemp(((1049 - 32) * 5/9).toString())}
                  className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-all border ${
                    Math.round((parseFloat(kilnTemp) * 9/5) + 32) === 1049
                      ? 'bg-amber-700 border-amber-500 text-white'
                      : 'bg-stone-700 border-stone-600 text-stone-300 hover:bg-stone-600'
                  }`}
                >
                  1049°F
                </button>
                <button
                  onClick={() => setKilnTemp(((1292 - 32) * 5/9).toString())}
                  className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-all border ${
                    Math.round((parseFloat(kilnTemp) * 9/5) + 32) === 1292
                      ? 'bg-amber-700 border-amber-500 text-white'
                      : 'bg-stone-700 border-stone-600 text-stone-300 hover:bg-stone-600'
                  }`}
                >
                  1292°F
                </button>
              </>
            )}
          </div>
        </div>

        {/* SHAPE SELECTOR */}
        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-2">
            Glass Shape
          </label>
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
                Wall Thickness ({tempUnit === 'F' ? 'in' : 'mm'})
              </label>
              <div className="flex gap-2">
                <Input
                  type="text" 
                  value={thickness} 
                  onChange={(e) => {
                    setThickness(e.target.value);
                  }}
                  placeholder={tempUnit === 'F' ? '0.0625' : '4'}
                  className={`flex-1 bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500 ${
                    thicknessWarn ? 'border-red-500 ring-1 ring-red-500' : ''
                  }`}
                />
                {tempUnit === 'F' && (
                  <select
                    onChange={(e) => setThickness(e.target.value.replace(/\.?0+$/, ''))}
                    className="bg-stone-700 border border-stone-600 text-stone-100 rounded px-2 py-1 text-xs"
                    defaultValue=""
                  >
                    <option value="">Select</option>
                    {[
                      { n: 1, label: '1/16' },
                      { n: 2, label: '1/8' },
                      { n: 3, label: '3/16' },
                      { n: 4, label: '1/4' },
                      { n: 5, label: '5/16' },
                      { n: 6, label: '3/8' }
                    ].map((item) => (
                      <option key={item.n} value={(item.n / 16).toFixed(4)}>
                        {item.label}"
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {thicknessWarn && (
                <p className="text-xs text-red-400 mt-1">
                  {thicknessOutOfRange ? '⚠ Wall Thickness must be 0.0625-0.375 in' : `⚠ Thickness must be less than radius (${tempUnit === 'F' ? (parseFloat(radius) / 2 / 25.4).toFixed(3) : parseFloat(radius) / 2} ${tempUnit === 'F' ? 'in' : 'mm'})`}
                </p>
              )}
            </div>
          )}

          {/* Outer Diameter — cylinder and sphere */}
          {(shape === 'cylinder' || shape === 'sphere') && (
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Outer Diameter ({tempUnit === 'F' ? 'in' : 'mm'})
              </label>
              <div className="flex gap-2">
                <Input
                  type="text" 
                  value={radius} 
                  onChange={(e) => {
                    setRadius(e.target.value);
                  }}
                  placeholder={tempUnit === 'F' ? '1' : '25'}
                  className={`flex-1 bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500 ${
                    radiusOutOfRange ? 'border-red-500 ring-1 ring-red-500' : ''
                  }`}
                />
                {tempUnit === 'F' && (
                  <select
                    onChange={(e) => setRadius(e.target.value.replace(/\.?0+$/, ''))}
                    className="bg-stone-700 border border-stone-600 text-stone-100 rounded px-2 py-1 text-xs"
                    defaultValue=""
                  >
                    <option value="">Select</option>
                    {[
                      { n: 12, label: '3/4' },
                      { n: 14, label: '7/8' },
                      { n: 16, label: '1' },
                      { n: 18, label: '1 1/8' },
                      { n: 20, label: '1 1/4' },
                      { n: 22, label: '1 3/8' },
                      { n: 24, label: '1 1/2' },
                      { n: 26, label: '1 5/8' },
                      { n: 28, label: '1 3/4' },
                      { n: 30, label: '1 7/8' },
                      { n: 32, label: '2' },
                      { n: 34, label: '2 1/8' },
                      { n: 36, label: '2 1/4' }
                    ].map((item) => (
                      <option key={item.n} value={(item.n / 16).toFixed(4)}>
                        {item.label}"
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {radiusOutOfRange && (
                <p className="text-xs text-red-400 mt-1">
                  ⚠ Outer Diameter must be 0.75-2.25 in
                </p>
              )}
            </div>
          )}

          {/* Length — plate and cylinder */}
          {(shape === 'plate' || shape === 'cylinder') && (
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Length ({tempUnit === 'F' ? 'in' : 'mm'})
              </label>
              <div className="flex gap-2">
                <Input
                  type="text" 
                  value={length} 
                  onChange={(e) => {
                    setLength(e.target.value);
                  }}
                  placeholder={tempUnit === 'F' ? '1' : '25'}
                  className={`flex-1 bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500 ${
                    lengthOutOfRange ? 'border-red-500 ring-1 ring-red-500' : ''
                  }`}
                />
                {tempUnit === 'F' && (
                  <select
                    onChange={(e) => setLength(e.target.value.replace(/\.?0+$/, ''))}
                    className="bg-stone-700 border border-stone-600 text-stone-100 rounded px-2 py-1 text-xs"
                    defaultValue=""
                  >
                    <option value="">Select</option>
                    {[
                      { n: 8, label: '1/2' },
                      { n: 10, label: '5/8' },
                      { n: 12, label: '3/4' },
                      { n: 14, label: '7/8' },
                      { n: 16, label: '1' },
                      { n: 18, label: '1 1/8' },
                      { n: 20, label: '1 1/4' },
                      { n: 22, label: '1 3/8' },
                      { n: 24, label: '1 1/2' },
                      { n: 26, label: '1 5/8' },
                      { n: 28, label: '1 3/4' },
                      { n: 30, label: '1 7/8' },
                      { n: 32, label: '2' },
                      { n: 34, label: '2 1/8' },
                      { n: 36, label: '2 1/4' },
                      { n: 38, label: '2 3/8' },
                      { n: 40, label: '2 1/2' },
                      { n: 42, label: '2 5/8' },
                      { n: 44, label: '2 3/4' },
                      { n: 46, label: '2 7/8' },
                      { n: 48, label: '3' },
                      { n: 50, label: '3 1/8' },
                      { n: 52, label: '3 1/4' },
                      { n: 54, label: '3 3/8' },
                      { n: 56, label: '3 1/2' },
                      { n: 58, label: '3 5/8' },
                      { n: 60, label: '3 3/4' },
                      { n: 62, label: '3 7/8' },
                      { n: 64, label: '4' }
                    ].map((item) => (
                      <option key={item.n} value={(item.n / 16).toFixed(4)}>
                        {item.label}"
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {lengthOutOfRange && (
                <p className="text-xs text-red-400 mt-1">
                  ⚠ Length must be 0.5-4 in
                </p>
              )}
            </div>
          )}

          {/* Width — plate only */}
          {shape === 'plate' && (
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Width ({tempUnit === 'F' ? 'in' : 'mm'})
              </label>
              <div className="flex gap-2">
                <Input
                  type="text" 
                  value={width} 
                  onChange={(e) => {
                    setWidth(e.target.value);
                  }}
                  placeholder={tempUnit === 'F' ? '1' : '25'}
                  className={`flex-1 bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500 ${
                    widthOutOfRange ? 'border-red-500 ring-1 ring-red-500' : ''
                  }`}
                />
                {tempUnit === 'F' && (
                  <select
                    onChange={(e) => setWidth(e.target.value.replace(/\.?0+$/, ''))}
                    className="bg-stone-700 border border-stone-600 text-stone-100 rounded px-2 py-1 text-xs"
                    defaultValue=""
                  >
                    <option value="">Select</option>
                    {[
                      { n: 8, label: '1/2' },
                      { n: 10, label: '5/8' },
                      { n: 12, label: '3/4' },
                      { n: 14, label: '7/8' },
                      { n: 16, label: '1' },
                      { n: 18, label: '1 1/8' },
                      { n: 20, label: '1 1/4' },
                      { n: 22, label: '1 3/8' },
                      { n: 24, label: '1 1/2' },
                      { n: 26, label: '1 5/8' },
                      { n: 28, label: '1 3/4' },
                      { n: 30, label: '1 7/8' },
                      { n: 32, label: '2' },
                      { n: 34, label: '2 1/8' },
                      { n: 36, label: '2 1/4' },
                      { n: 38, label: '2 3/8' },
                      { n: 40, label: '2 1/2' },
                      { n: 42, label: '2 5/8' },
                      { n: 44, label: '2 3/4' },
                      { n: 46, label: '2 7/8' },
                      { n: 48, label: '3' }
                    ].map((item) => (
                      <option key={item.n} value={(item.n / 16).toFixed(4)}>
                        {item.label}"
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {widthOutOfRange && (
                <p className="text-xs text-red-400 mt-1">
                  ⚠ Width must be 0.5-3 in
                </p>
              )}
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
          <Button
            onClick={handleCalculate}
            disabled={calcBlocked}
            className={`flex-1 text-white font-bold transition-opacity ${
              calcBlocked
                ? 'bg-amber-900 opacity-40 cursor-not-allowed'
                : 'bg-amber-700 hover:bg-amber-600'
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
      </Card>

      {/* RESULTS */}
      {hasCalc && results && (
        <div className="space-y-4">

          {/* WORKING TIME — primary output */}
          <Card className="bg-gradient-to-br from-amber-900/50 to-amber-950/50 border-2 border-amber-500 p-6 text-center">
            <p className="text-sm text-amber-300 font-semibold mb-1">
              TIME TO REHEAT
            </p>
            <p className="text-xs text-stone-400 mb-3">{results.shapeLabel}</p>
            <div className="text-4xl font-bold text-amber-300 mb-1">
              {formatTime(results.workingTimeSeconds)}
            </div>
          </Card>

          {/* REHEAT REMINDER */}
          {timeRemaining !== null && (
            <Card className="bg-stone-800 border-stone-700 p-4">
              <p className="text-sm font-semibold text-stone-300 mb-3">REHEAT REMINDER</p>

              {/* Timer display */}
              <div className={`text-5xl font-bold text-center mb-4 font-mono tracking-widest ${
                timerRunning ? 'text-amber-300' : 'text-stone-200'
              }`}>
                {formatTime(timeRemaining)}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-700 rounded-full h-2 mb-4">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: originalTimeRef.current > 0
                      ? `${(timeRemaining / originalTimeRef.current) * 100}%`
                      : '0%',
                  }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mb-2">
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

              {/* Loop toggle button */}
              <Button
                onClick={() => {
                  const newLoopState = !timerLoop;
                  setTimerLoop(newLoopState);
                  // If turning off loop while timer is running, stop the timer
                  if (timerLoop && timerRunning) {
                    stopTimer();
                  }
                }}
                className={`w-full font-bold text-white ${
                  timerLoop
                    ? 'bg-amber-700 hover:bg-amber-600'
                    : 'bg-stone-700 hover:bg-stone-600'
                }`}
              >
                {timerLoop ? '🔁 Loop: ON' : '🔁 Loop: OFF'}
              </Button>


            </Card>
          )}


          {/* HEAT TRANSFER DETAILS */}
          <Card className="bg-stone-800 border-stone-700 p-4">
            <p className="text-sm font-semibold text-stone-300 mb-3">
              CONVECTION DETAILS
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-stone-900/60 rounded p-2 flex justify-between items-center">
                <p className="text-stone-400">Convective heat transfer coefficient</p>
                <p className="text-stone-200 font-bold">
                  {tempUnit === 'F' 
                    ? `${(results.h_conv * 0.176228).toFixed(2)} Btu/hr·ft²·°F`
                    : `${results.h_conv.toFixed(2)} W/m²·K`
                  }
                </p>
              </div>
              <div className="bg-stone-900/60 rounded p-2 flex justify-between items-center">
                <p className="text-stone-400">Convection rate of heat transfer</p>
                <p className="text-stone-200 font-bold">
                  {tempUnit === 'F' 
                    ? `${(results.Q_conv * 3.41214).toFixed(1)} Btu/hr`
                    : `${results.Q_conv.toFixed(1)} W`
                  }
                </p>
              </div>
              <div className="bg-stone-900/60 rounded p-2 flex justify-between items-center">
                <p className="text-stone-400">Radiation rate of heat transfer</p>
                <p className="text-stone-200 font-bold">
                  {tempUnit === 'F' 
                    ? `${(results.Q_rad * 3.41214).toFixed(1)} Btu/hr`
                    : `${results.Q_rad.toFixed(1)} W`
                  }
                </p>
              </div>
              <div className="bg-stone-900/60 rounded p-2 flex justify-between items-center border-t border-stone-600 pt-2 mt-2">
                <p className="text-stone-400">Total rate of heat transfer</p>
                <p className="text-stone-200 font-bold">
                  {tempUnit === 'F' 
                    ? `${(results.Q_total * 3.41214).toFixed(1)} Btu/hr`
                    : `${results.Q_total.toFixed(1)} W`
                  }
                </p>
              </div>
            </div>
          </Card>





        </div>
      )}
        </div>
      </main>
    </div>
  );
}
