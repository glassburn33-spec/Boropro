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
  T_environment: 25,      // Ambient environment temperature [°C]
  h_c_ext: 0.0255,        // External air convection [W/m-K]
  h_c_int: 0.0580,        // Internal air convection [W/m-K]
  PI: 3.14159265359,      // Pi constant
};

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
}

export interface ThermalCalculationResults {
  M: number;              // Material constant [MPa·s·K⁻¹·m⁻²]
  h: number;              // Maximum safe cooling rate [K/s]
  sigma: number;          // Thermal stress [MPa]
  workingTimeMinutes: number; // Available working time [minutes]
  workingTimeSeconds: number; // Available working time [seconds]
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
  const { rho, cp, h_c_ext, h_c_int, lambda, T_strain, T_environment, Tg } = GLASS_CONSTANTS;
  
  const thicknessM = inputs.thickness / 1000; // Convert mm to m
  
  // Effective heat transfer coefficient (combined convection)
  // U = 1 / ((1/h_c_int) + (thickness/lambda) + (1/h_c_ext))
  const h_eff = 1 / ((1 / h_c_int) + (thicknessM / lambda) + (1 / h_c_ext));
  
  // Mass per unit area [kg/m²]
  const massPerArea = rho * thicknessM;
  
  // Temperature differences
  const T_work_K = Tg + 273.15;           // Working temperature in Kelvin
  const T_strain_K = T_strain + 273.15;   // Strain point in Kelvin
  const T_env_K = T_environment + 273.15; // Environment in Kelvin
  
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
} {
  return {
    M: `${results.M.toFixed(4)} MPa·s·K⁻¹·m⁻²`,
    h: `${results.h.toFixed(6)} K/s`,
    sigma: `${results.sigma.toFixed(2)} MPa`,
    workingTime: `${results.workingTimeMinutes.toFixed(1)} minutes`,
  };
}
