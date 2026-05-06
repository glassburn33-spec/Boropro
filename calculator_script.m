% Thermal Stress Calculation for Borosilicate Glass
% Calculator Script for BoroPro
% 
% This script performs thermal stress analysis for determining safe working time
% before glass reaches strain point during annealing.

clear all; close all; clc;

% ============================================================
% GLASS MATERIAL CONSTANTS — Pyrex Borosilicate
% ============================================================

% Glass properties
lambda = 1.14;              % Thermal conductivity [W/(m·K)]
rho = 2230;                 % Density [kg/m³]
cp = 840;                   % Specific heat [J/(kg·K)]
alpha_ex = 33e-7;           % Thermal expansion coefficient [K⁻¹]
E = 63e9;                   % Young's modulus [Pa]
mu = 0.20;                  % Poisson's ratio [-]
Tg = 565;                   % Glass transition temperature [°C]
T_strain = 510;             % Strain point [°C]
T_environment = 25;         % Ambient environment temperature [°C]

% Air properties at mean temperature
g = 9.81;                   % Gravitational acceleration [m/s²]
beta = 1/298;               % Thermal expansion coefficient of air [K⁻¹]
nu_air = 20.92e-6;          % Kinematic viscosity of air [m²/s]
k_air = 0.0263;             % Thermal conductivity of air [W/(m·K)]
Pr_air = 0.707;             % Prandtl number for air [-]

% ============================================================
% USER INPUT SECTION
% ============================================================

% Shape selection: 'plate', 'cylinder', or 'sphere'
shape = 'plate';

% Dimensions [mm]
radius = 25;                % Radius (for cylinder/sphere) [mm]
length = 100;               % Length [mm]
width = 50;                 % Width [mm]
thickness = 3;              % Wall thickness [mm]

% Working temperature [°C]
T_work = 1050;              % Working temperature [°C]

% ============================================================
% SHAPE-SPECIFIC CALCULATIONS
% ============================================================

% Convert dimensions to meters
radius_m = radius / 1000;
length_m = length / 1000;
width_m = width / 1000;
thickness_m = thickness / 1000;

% ============================================================
% FLAT PLATE SECTION
% ============================================================

if strcmp(shape, 'plate')
    fprintf('\n========== FLAT PLATE ANALYSIS ==========\n');
    
    % Shape factor for flat plate
    b_plate = 1.000;
    d_plate = thickness_m;
    
    % Surface area calculation
    % LINE 1 TO EDIT: Replace "perimeter = 2*(length_m+thickness);" with "perimeter = 2*(length_m + width_m);"
    perimeter = 2*(length_m + width_m);
    A_plate = length_m * width_m;
    
    fprintf('Plate Dimensions:\n');
    fprintf('  Length: %.2f mm\n', length);
    fprintf('  Width: %.2f mm\n', width);
    fprintf('  Thickness: %.2f mm\n', thickness);
    fprintf('  Surface Area: %.6f m²\n', A_plate);
    
    % Material constant M
    E_MPa = E / 1e6;
    M = (E_MPa * alpha_ex / (1 - mu)) * (rho * cp / lambda);
    
    fprintf('\nMaterial Constant:\n');
    fprintf('  M = %.4f MPa·s·K⁻¹·m⁻²\n', M);
    
    % Maximum safe cooling rate
    sigma_max = 5.67;  % [MPa] - maximum allowable thermal stress
    h_plate = sigma_max / (M * d_plate^2 * b_plate);
    
    fprintf('\nCooling Rate:\n');
    fprintf('  Max Safe Cooling Rate: %.6f K/s\n', h_plate);
    
    % Thermal stress
    sigma_plate = M * h_plate * d_plate^2 * b_plate;
    
    fprintf('\nThermal Stress:\n');
    fprintf('  Sigma: %.2f MPa\n', sigma_plate);
    
end

% ============================================================
% CYLINDER SECTION
% ============================================================

if strcmp(shape, 'cylinder')
    fprintf('\n========== CYLINDER ANALYSIS ==========\n');
    
    % Shape factor for hollow cylinder (radial cooling)
    b_cyl = 0.500;
    d_cyl = 2 * thickness_m;  % Characteristic dimension
    
    % Surface area: two circular ends + lateral surface
    A_cyl = 2 * pi * radius_m^2 + 2 * pi * radius_m * length_m;
    
    fprintf('Cylinder Dimensions:\n');
    fprintf('  Outer Radius: %.2f mm\n', radius);
    fprintf('  Length: %.2f mm\n', length);
    fprintf('  Wall Thickness: %.2f mm\n', thickness);
    fprintf('  Surface Area: %.6f m²\n', A_cyl);
    
    % Material constant M
    E_MPa = E / 1e6;
    M = (E_MPa * alpha_ex / (1 - mu)) * (rho * cp / lambda);
    
    fprintf('\nMaterial Constant:\n');
    fprintf('  M = %.4f MPa·s·K⁻¹·m⁻²\n', M);
    
    % Rayleigh number for natural convection
    % LINE 2 TO EDIT: Replace "Ra_cyl  = (g * beta * (T_work - T_strain) * (D_cyl/4)^3 / nu_air^2) * Pr_air;" with "Ra_cyl  = (g * beta * (T_work - T_strain) * D_cyl^3 / nu_air^2) * Pr_air;"
    Ra_cyl  = (g * beta * (T_work - T_strain) * d_cyl^3 / nu_air^2) * Pr_air;
    
    fprintf('\nNatural Convection Analysis:\n');
    fprintf('  Rayleigh Number: %.2e\n', Ra_cyl);
    
    % Nusselt number correlation (for cylinders)
    Nu_cyl = 0.54 * Ra_cyl^0.25;
    
    fprintf('  Nusselt Number: %.2f\n', Nu_cyl);
    
    % Heat transfer coefficient
    % LINE 3 TO EDIT: Replace "h_cyl = (k_air / (D_cyl/4)) * Nu_cyl;" with "h_cyl = (k_air / D_cyl) * Nu_cyl;"
    h_cyl = (k_air / d_cyl) * Nu_cyl;
    
    fprintf('  Heat Transfer Coefficient: %.4f W/(m²·K)\n', h_cyl);
    
    % Maximum safe cooling rate
    sigma_max = 5.67;  % [MPa]
    h_cool = sigma_max / (M * d_cyl^2 * b_cyl);
    
    fprintf('\nCooling Rate:\n');
    fprintf('  Max Safe Cooling Rate: %.6f K/s\n', h_cool);
    
    % Thermal stress
    sigma_cyl = M * h_cool * d_cyl^2 * b_cyl;
    
    fprintf('\nThermal Stress:\n');
    fprintf('  Sigma: %.2f MPa\n', sigma_cyl);
    
end

% ============================================================
% SPHERE SECTION
% ============================================================

if strcmp(shape, 'sphere')
    fprintf('\n========== SPHERE ANALYSIS ==========\n');
    
    % Shape factor for solid sphere (radial cooling)
    b_sphere = 0.333;
    d_sphere = radius_m;
    
    % Surface area
    A_sphere = 4 * pi * radius_m^2;
    
    fprintf('Sphere Dimensions:\n');
    fprintf('  Radius: %.2f mm\n', radius);
    fprintf('  Surface Area: %.6f m²\n', A_sphere);
    
    % Material constant M
    E_MPa = E / 1e6;
    M = (E_MPa * alpha_ex / (1 - mu)) * (rho * cp / lambda);
    
    fprintf('\nMaterial Constant:\n');
    fprintf('  M = %.4f MPa·s·K⁻¹·m⁻²\n', M);
    
    % Maximum safe cooling rate
    sigma_max = 5.67;  % [MPa]
    h_sphere = sigma_max / (M * d_sphere^2 * b_sphere);
    
    fprintf('\nCooling Rate:\n');
    fprintf('  Max Safe Cooling Rate: %.6f K/s\n', h_sphere);
    
    % Thermal stress
    sigma_sphere = M * h_sphere * d_sphere^2 * b_sphere;
    
    fprintf('\nThermal Stress:\n');
    fprintf('  Sigma: %.2f MPa\n', sigma_sphere);
    
end

fprintf('\n========== END OF CALCULATION ==========\n\n');
