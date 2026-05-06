/**
 * Thermal Stress Calculation for Borosilicate Glass
 * Converts MATLAB script to TypeScript for BoroPro app
 * 
 * Based on Newton's Law of Cooling and thermal stress analysis
 * for determining safe working time before glass reaches strain point
 */

// ============================================================
// GLASS MATERIAL CONSTANTS — Pyrex Borosilicate
// ============================================================

const GLASS_CONSTANTS = {
  lambda: 1.14,           // Thermal conductivity [W/(m·K)]
  rho: 2230,              // Density [kg/m³]
  cp: 840,                // Specific heat [J/(kg·K)]
  alpha_ex: 33e-7,        // Thermal expansion coefficient [K⁻¹]
  E: 63e9,                // Young's modulus [Pa]
  mu: 0.20,               // Poisson's ratio [-]
  Tg: 565,                // Glass transition temperature [°C]
  sigma: 5.67037e-8,      // Stefan-Boltzmann constant [W/m²K⁴]
  epsilon: 0.85,          // Emissivity of borosilicate [-]
  T_strain: 510,          // Strain point (residual stress point) [°C]
  h_c_ext: 0.0255,        // External air convection [W/m-K]
  h_c_int: 0.0580,        // Internal air convection [W/m-K]
  PI: 3.14159265359,      // Pi constant
  g: 9.81,                // Gravitational acceleration [m/s²]
};

// ============================================================
// AIR PROPERTIES LOOKUP TABLE — Table A-15 at 1 atm
// [T_C, rho, cp, k, nu, Pr]
// ============================================================

const AIR_PROPERTIES_TABLE = [
  [-150, 2.866, 983, 0.01171, 3.013e-6, 0.7246],
  [-100, 2.038, 966, 0.01582, 5.837e-6, 0.7263],
  [-50, 1.582, 999, 0.01979, 9.319e-6, 0.7440],
  [-40, 1.514, 1002, 0.02057, 1.008e-5, 0.7436],
  [-30, 1.451, 1004, 0.02134, 1.087e-5, 0.7425],
  [-20, 1.394, 1005, 0.02211, 1.169e-5, 0.7408],
  [-10, 1.341, 1006, 0.02288, 1.252e-5, 0.7387],
  [0, 1.292, 1006, 0.02364, 1.338e-5, 0.7362],
  [5, 1.269, 1006, 0.02401, 1.382e-5, 0.7350],
  [10, 1.246, 1006, 0.02439, 1.426e-5, 0.7336],
  [15, 1.225, 1007, 0.02476, 1.470e-5, 0.7323],
  [20, 1.204, 1007, 0.02514, 1.516e-5, 0.7309],
  [25, 1.184, 1007, 0.02551, 1.562e-5, 0.7296],
  [30, 1.164, 1007, 0.02588, 1.608e-5, 0.7282],
  [35, 1.145, 1007, 0.02625, 1.655e-5, 0.7268],
  [40, 1.127, 1007, 0.02662, 1.702e-5, 0.7255],
  [45, 1.109, 1007, 0.02699, 1.750e-5, 0.7241],
  [50, 1.092, 1007, 0.02735, 1.798e-5, 0.7228],
  [60, 1.059, 1007, 0.02808, 1.896e-5, 0.7202],
  [70, 1.028, 1007, 0.02881, 1.995e-5, 0.7177],
  [80, 0.9994, 1008, 0.02953, 2.097e-5, 0.7154],
  [90, 0.9718, 1008, 0.03024, 2.201e-5, 0.7132],
  [100, 0.9458, 1009, 0.03095, 2.306e-5, 0.7111],
  [120, 0.8977, 1011, 0.03235, 2.522e-5, 0.7073],
  [140, 0.8542, 1013, 0.03374, 2.745e-5, 0.7041],
  [160, 0.8148, 1016, 0.03511, 2.975e-5, 0.7014],
  [180, 0.7788, 1019, 0.03646, 3.212e-5, 0.6992],
  [200, 0.7459, 1023, 0.03779, 3.455e-5, 0.6974],
  [250, 0.6746, 1033, 0.04104, 4.091e-5, 0.6946],
  [300, 0.6158, 1044, 0.04418, 4.765e-5, 0.6935],
  [350, 0.5664, 1056, 0.04721, 5.475e-5, 0.6937],
  [400, 0.5243, 1069, 0.05015, 6.219e-5, 0.6948],
  [450, 0.4880, 1081, 0.05298, 6.997e-5, 0.6965],
  [500, 0.4565, 1093, 0.05572, 7.806e-5, 0.6986],
  [600, 0.4042, 1115, 0.06093, 9.515e-5, 0.7037],
  [700, 0.3627, 1135, 0.06581, 1.133e-4, 0.7092],
];

export type GlassShape = 'plate' | 'cylinder' | 'sphere';

interface ShapeParameters {
  b: number;              // Shape factor
  d: number;              // Characteristic dimension [m]
  surfaceArea: number;    // Surface area [m²]
}

interface ThermalCalculationInputs {
  radius: number;         // Radius [mm]
  length: number;         // Length [mm]
  width: number;          // Width [mm]
  thickness: number;      // Thickness [mm]
  shape: GlassShape;      // Shape type
  T_room?: number;        // Room temperature [°C], default 25
}

interface AirProperties {
  rho: number;            // Density [kg/m³]
  cp: number;             // Specific heat [J/(kg·K)]
  k: number;              // Thermal conductivity [W/(m·K)]
  nu: number;             // Kinematic viscosity [m²/s]
  Pr: number;             // Prandtl number [-]
  beta: number;           // Thermal expansion coefficient [1/K]
}

export interface ThermalCalculationResults {
  M: number;              // Material constant [MPa·s·K⁻¹·m⁻²]
  h: number;              // Maximum safe cooling rate [K/s]
  sigma: number;          // Thermal stress [MPa]
  workingTimeMinutes: number; // Available working time [minutes]
  workingTimeSeconds: number; // Available working time [seconds]
  T_room: number;         // Room temperature used [°C]
  T_film: number;         // Film temperature for air properties [°C]
}

/**
 * Linear interpolation helper function
 */
function linearInterpolate(x: number, x_values: number[], y_values: number[]): number {
  // Clamp x to table range
  x = Math.max(x, x_values[0]);
  x = Math.min(x, x_values[x_values.length - 1]);

  // Find surrounding points
  for (let i = 0; i < x_values.length - 1; i++) {
    if (x >= x_values[i] && x <= x_values[i + 1]) {
      const x0 = x_values[i];
      const x1 = x_values[i + 1];
      const y0 = y_values[i];
      const y1 = y_values[i + 1];
      return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
  }

  // Fallback (shouldn't reach here if clamping works)
  return y_values[0];
}

/**
 * Interpolate air properties from lookup table based on film temperature
 */
function getAirProperties(T_film_C: number): AirProperties {
  const T_values = AIR_PROPERTIES_TABLE.map(row => row[0]);
  const rho_values = AIR_PROPERTIES_TABLE.map(row => row[1]);
  const cp_values = AIR_PROPERTIES_TABLE.map(row => row[2]);
  const k_values = AIR_PROPERTIES_TABLE.map(row => row[3]);
  const nu_values = AIR_PROPERTIES_TABLE.map(row => row[4]);
  const Pr_values = AIR_PROPERTIES_TABLE.map(row => row[5]);

  const rho = linearInterpolate(T_film_C, T_values, rho_values);
  const cp = linearInterpolate(T_film_C, T_values, cp_values);
  const k = linearInterpolate(T_film_C, T_values, k_values);
  const nu = linearInterpolate(T_film_C, T_values, nu_values);
  const Pr = linearInterpolate(T_film_C, T_values, Pr_values);
  const beta = 1 / (T_film_C + 273.15); // Ideal gas approximation [1/K]

  return { rho, cp, k, nu, Pr, beta };
}

/**
 * Determine shape parameters based on geometry selection
 * Implements shape factor b, characteristic dimension d, and surface area
 */
function getShapeParameters(inputs: ThermalCalculationInputs): ShapeParameters {
  const radiusM = inputs.radius / 1000;      // Convert mm to m
  const lengthM = inputs.length / 1000;      // Convert mm to m
  const widthM = inputs.width / 1000;        // Convert mm to m
  const thicknessM = inputs.thickness / 1000; // Convert mm to m

  switch (inputs.shape) {
    case 'plate': {
      // Flat plate: one-sided cooling
      const b = 1.000;
      const d = thicknessM;
      const surfaceArea = lengthM * widthM;
      return { b, d, surfaceArea };
    }

    case 'cylinder': {
      // Hollow cylinder: radial cooling
      const b = 0.500;
      const d = 2 * thicknessM; // Characteristic dimension for cylinder
      const surfaceArea = GLASS_CONSTANTS.PI * 2 * radiusM ** 2 + 
                         2 * GLASS_CONSTANTS.PI * radiusM * lengthM;
      return { b, d, surfaceArea };
    }

    case 'sphere': {
      // Solid sphere: radial cooling
      const b = 0.333;
      const d = radiusM; // Characteristic dimension for sphere
      const surfaceArea = 4 * GLASS_CONSTANTS.PI * radiusM ** 2;
      return { b, d, surfaceArea };
    }

    default:
      throw new Error(`Invalid shape: ${inputs.shape}`);
  }
}

/**
 * Calculate material constant M
 * M = (E * alpha_ex / (1 - mu)) * (rho * cp / lambda)
 * Units: [MPa·s·K⁻¹·m⁻²]
 */
function calculateMaterialConstant(): number {
  const { E, alpha_ex, mu, rho, cp, lambda } = GLASS_CONSTANTS;
  
  // Convert E from Pa to MPa (divide by 1e6)
  const E_MPa = E / 1e6;
  
  const M = (E_MPa * alpha_ex / (1 - mu)) * (rho * cp / lambda);
  return M;
}

/**
 * Calculate maximum safe cooling rate h
 * h = sigma / (M * d² * b)
 * Units: [K/s]
 * 
 * Note: This uses the Stefan-Boltzmann constant to determine
 * the maximum allowable cooling rate based on thermal stress limits
 */
function calculateMaxCoolingRate(M: number, d: number, b: number): number {
  const { sigma: stefanBoltzmann } = GLASS_CONSTANTS;
  
  // Maximum allowable thermal stress for borosilicate
  const maxStress = stefanBoltzmann; // [MPa] - simplified model
  
  const h = maxStress / (M * d ** 2 * b);
  return h;
}

/**
 * Calculate thermal stress sigma
 * sigma = M * h * d² * b
 * Units: [MPa]
 */
function calculateThermalStressValue(M: number, h: number, d: number, b: number): number {
  const sigma = M * h * d ** 2 * b;
  return sigma;
}

/**
 * Calculate working time using Newton's Law of Cooling
 * Rearranged formula: t = (m * cp / (U * A)) * ln((T_work - T_env) / (T_strain - T_env))
 * 
 * Simplified approach using effective heat transfer coefficient:
 * t = (rho * thickness * cp / h_eff) * ln((T_work - T_env) / (T_strain - T_env))
 */
function calculateWorkingTime(inputs: ThermalCalculationInputs): number {
  const { rho, cp, h_c_ext, h_c_int, lambda, T_strain, Tg } = GLASS_CONSTANTS;
  
  const thicknessM = inputs.thickness / 1000; // Convert mm to m
  const T_room = inputs.T_room ?? 25; // Default 25°C if not provided
  
  // Effective heat transfer coefficient (combined convection)
  // U = 1 / ((1/h_c_int) + (thickness/lambda) + (1/h_c_ext))
  const h_eff = 1 / ((1 / h_c_int) + (thicknessM / lambda) + (1 / h_c_ext));
  
  // Mass per unit area [kg/m²]
  const massPerArea = rho * thicknessM;
  
  // Temperature differences
  const T_work_K = Tg + 273.15;           // Working temperature in Kelvin
  const T_strain_K = T_strain + 273.15;   // Strain point in Kelvin
  const T_env_K = T_room + 273.15;        // Environment in Kelvin
  
  // Newton's Law of Cooling: t = (m*cp / (h*A)) * ln((T_initial - T_env) / (T_final - T_env))
  // Simplified for per-unit-area: t = (rho*d*cp / h_eff) * ln((T_work - T_env) / (T_strain - T_env))
  
  const numerator = massPerArea * cp;
  const temperatureRatio = (T_work_K - T_env_K) / (T_strain_K - T_env_K);
  const timeSeconds = (numerator / h_eff) * Math.log(temperatureRatio);
  
  return timeSeconds;
}

/**
 * Main calculation function: Performs complete thermal analysis
 */
export function calculateThermalStress(inputs: ThermalCalculationInputs): ThermalCalculationResults {
  // Validate inputs
  if (inputs.radius <= 0 || inputs.length <= 0 || inputs.width <= 0 || inputs.thickness <= 0) {
    throw new Error('All dimensions must be positive numbers');
  }

  const T_room = inputs.T_room ?? 25; // Default 25°C
  const T_env_C = T_room;
  const T_film_C = (GLASS_CONSTANTS.Tg + T_env_C) / 2;

  // Get shape-specific parameters
  const shapeParams = getShapeParameters(inputs);

  // Calculate material constant M
  const M = calculateMaterialConstant();

  // Calculate maximum safe cooling rate h
  const h = calculateMaxCoolingRate(M, shapeParams.d, shapeParams.b);

  // Calculate thermal stress sigma
  const sigma = calculateThermalStressValue(M, h, shapeParams.d, shapeParams.b);

  // Calculate working time in seconds
  const workingTimeSeconds = calculateWorkingTime(inputs);

  // Convert to minutes
  const workingTimeMinutes = workingTimeSeconds / 60;

  return {
    M,
    h,
    sigma,
    workingTimeMinutes: Math.max(0, workingTimeMinutes), // Ensure non-negative
    workingTimeSeconds: Math.max(0, workingTimeSeconds),
    T_room,
    T_film: T_film_C,
  };
}

/**
 * Format results for display
 */
export function formatThermalResults(results: ThermalCalculationResults): {
  M: string;
  h: string;
  sigma: string;
  workingTime: string;
  T_room: string;
  T_film: string;
} {
  return {
    M: `${results.M.toFixed(4)} MPa·s·K⁻¹·m⁻²`,
    h: `${results.h.toFixed(6)} K/s`,
    sigma: `${results.sigma.toFixed(2)} MPa`,
    workingTime: `${results.workingTimeMinutes.toFixed(1)} minutes`,
    T_room: `${results.T_room.toFixed(1)}°C`,
    T_film: `${results.T_film.toFixed(1)}°C`,
  };
}
