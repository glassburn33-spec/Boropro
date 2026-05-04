import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle } from "lucide-react";
import { calculateThermalStress, GlassShape, ThermalCalculationResults } from "@/lib/thermalCalculations";

export function CalculatorTab() {
  const [radius, setRadius] = useState<string>("10");
  const [length, setLength] = useState<string>("25");
  const [width, setWidth] = useState<string>("25");
  const [thickness, setThickness] = useState<string>("5");
  const [shape, setShape] = useState<GlassShape>("plate");
  const [results, setResults] = useState<ThermalCalculationResults | null>(null);
  const [error, setError] = useState<string>("");
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    try {
      setError("");
      
      // Validate inputs
      const radiusNum = parseFloat(radius);
      const lengthNum = parseFloat(length);
      const widthNum = parseFloat(width);
      const thicknessNum = parseFloat(thickness);

      if (isNaN(radiusNum) || isNaN(lengthNum) || isNaN(widthNum) || isNaN(thicknessNum)) {
        setError("All dimensions must be valid numbers");
        return;
      }

      if (radiusNum <= 0 || lengthNum <= 0 || widthNum <= 0 || thicknessNum <= 0) {
        setError("All dimensions must be greater than 0");
        return;
      }

      // Perform calculation
      const calculationResults = calculateThermalStress({
        radius: radiusNum,
        length: lengthNum,
        width: widthNum,
        thickness: thicknessNum,
        shape,
      });

      setResults(calculationResults);
      setHasCalculated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation error");
      setResults(null);
    }
  };

  const handleReset = () => {
    setRadius("10");
    setLength("25");
    setWidth("25");
    setThickness("5");
    setShape("plate");
    setResults(null);
    setError("");
    setHasCalculated(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-amber-300">Thermal Stress Calculator</h2>
        <p className="text-sm text-stone-400">
          Calculate how long your glass can remain outside the kiln before reaching the strain point
        </p>
      </div>

      {/* INPUT SECTION */}
      <Card className="bg-stone-800 border-stone-700 p-4 space-y-4">
        <h3 className="font-bold text-amber-300 text-lg">Glass Dimensions</h3>
        <p className="text-xs text-stone-400 mb-4">All dimensions in millimeters (mm)</p>

        {/* SHAPE SELECTION */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-stone-300">Glass Shape</label>
          <div className="grid grid-cols-3 gap-2">
            {(["plate", "cylinder", "sphere"] as const).map((shapeOption) => (
              <button
                key={shapeOption}
                onClick={() => setShape(shapeOption)}
                className={`py-2 px-3 rounded border-2 transition-all text-sm font-semibold capitalize ${
                  shape === shapeOption
                    ? "bg-amber-900/40 border-amber-500 text-amber-300"
                    : "bg-stone-700 border-stone-600 text-stone-300 hover:border-stone-500"
                }`}
              >
                {shapeOption}
              </button>
            ))}
          </div>
        </div>

        {/* DIMENSION INPUTS */}
        <div className="space-y-3">
          {/* Thickness (always used) */}
          <div>
            <label className="block text-sm font-semibold text-stone-300 mb-1">
              Thickness (mm)
            </label>
            <Input
              type="number"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
              placeholder="5"
              min="0.1"
              step="0.1"
              className="bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500"
            />
          </div>

          {/* Radius (for cylinder and sphere) */}
          {(shape === "cylinder" || shape === "sphere") && (
            <div>
              <label className="block text-sm font-semibold text-stone-300 mb-1">
                Radius (mm)
              </label>
              <Input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="10"
                min="0.1"
                step="0.1"
                className="bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500"
              />
            </div>
          )}

          {/* Length (for plate and cylinder) */}
          {(shape === "plate" || shape === "cylinder") && (
            <div>
              <label className="block text-sm font-semibold text-stone-300 mb-1">
                Length (mm)
              </label>
              <Input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="25"
                min="0.1"
                step="0.1"
                className="bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500"
              />
            </div>
          )}

          {/* Width (for plate only) */}
          {shape === "plate" && (
            <div>
              <label className="block text-sm font-semibold text-stone-300 mb-1">
                Width (mm)
              </label>
              <Input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="25"
                min="0.1"
                step="0.1"
                className="bg-stone-700 border-stone-600 text-stone-100 placeholder-stone-500"
              />
            </div>
          )}
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="flex gap-2 p-3 bg-red-900/30 border border-red-700 rounded text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleCalculate}
            className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-bold"
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

      {/* RESULTS SECTION */}
      {hasCalculated && results && (
        <div className="space-y-4">
          {/* WORKING TIME - PROMINENT DISPLAY */}
          <Card className="bg-gradient-to-br from-amber-900/50 to-amber-950/50 border-2 border-amber-500 p-6 text-center">
            <p className="text-sm text-amber-300 font-semibold mb-2">AVAILABLE WORKING TIME</p>
            <div className="text-5xl font-bold text-amber-300 mb-4">
              {results.workingTimeMinutes.toFixed(1)}
            </div>
            <p className="text-lg text-amber-200 font-semibold mb-4">minutes</p>
            
            {/* CRITICAL WARNING */}
            <div className="bg-red-900/40 border border-red-700 rounded p-3 mt-4">
              <p className="text-xs text-red-300 font-semibold">⚠️ CRITICAL REMINDER</p>
              <p className="text-xs text-red-200 mt-2">
                Return glass to kiln and hold at <strong>565°C</strong> (annealing temperature) 
                before this time expires to prevent thermal shock and cracking.
              </p>
            </div>
          </Card>

          {/* DETAILED RESULTS */}
          <Card className="bg-stone-800 border-stone-700 p-4">
            <h4 className="font-bold text-amber-300 text-sm mb-3">Calculation Details</h4>
            <div className="space-y-3">
              {/* Material Constant M */}
              <div className="flex justify-between items-center p-2 bg-stone-700/50 rounded">
                <span className="text-xs text-stone-400">Material Constant (M)</span>
                <span className="text-sm font-mono text-amber-300">
                  {results.M.toFixed(4)} MPa·s·K⁻¹·m⁻²
                </span>
              </div>

              {/* Cooling Rate h */}
              <div className="flex justify-between items-center p-2 bg-stone-700/50 rounded">
                <span className="text-xs text-stone-400">Max Cooling Rate (h)</span>
                <span className="text-sm font-mono text-amber-300">
                  {results.h.toFixed(6)} K/s
                </span>
              </div>

              {/* Thermal Stress */}
              <div className="flex justify-between items-center p-2 bg-stone-700/50 rounded">
                <span className="text-xs text-stone-400">Thermal Stress (σ)</span>
                <span className="text-sm font-mono text-amber-300">
                  {results.sigma.toFixed(2)} MPa
                </span>
              </div>

              {/* Working Time in Seconds */}
              <div className="flex justify-between items-center p-2 bg-stone-700/50 rounded">
                <span className="text-xs text-stone-400">Working Time (seconds)</span>
                <span className="text-sm font-mono text-amber-300">
                  {results.workingTimeSeconds.toFixed(0)} s
                </span>
              </div>
            </div>
          </Card>

          {/* GLASS MATERIAL CONSTANTS */}
          <Card className="bg-stone-800 border-stone-700 p-4">
            <h4 className="font-bold text-amber-300 text-sm mb-3">Glass Material Constants (Pyrex Borosilicate)</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-stone-400">
                <span className="text-stone-500">λ (Thermal Conductivity):</span>
                <span className="text-amber-300 ml-1 font-mono">1.14 W/(m·K)</span>
              </div>
              <div className="text-stone-400">
                <span className="text-stone-500">ρ (Density):</span>
                <span className="text-amber-300 ml-1 font-mono">2230 kg/m³</span>
              </div>
              <div className="text-stone-400">
                <span className="text-stone-500">cp (Specific Heat):</span>
                <span className="text-amber-300 ml-1 font-mono">840 J/(kg·K)</span>
              </div>
              <div className="text-stone-400">
                <span className="text-stone-500">α (Thermal Expansion):</span>
                <span className="text-amber-300 ml-1 font-mono">33×10⁻⁷ K⁻¹</span>
              </div>
              <div className="text-stone-400">
                <span className="text-stone-500">E (Young's Modulus):</span>
                <span className="text-amber-300 ml-1 font-mono">63 GPa</span>
              </div>
              <div className="text-stone-400">
                <span className="text-stone-500">μ (Poisson's Ratio):</span>
                <span className="text-amber-300 ml-1 font-mono">0.20</span>
              </div>
              <div className="text-stone-400">
                <span className="text-stone-500">Tg (Glass Transition):</span>
                <span className="text-amber-300 ml-1 font-mono">565°C</span>
              </div>
              <div className="text-stone-400">
                <span className="text-stone-500">Strain Point:</span>
                <span className="text-amber-300 ml-1 font-mono">510°C</span>
              </div>
            </div>
          </Card>

          {/* CALCULATION NOTES */}
          <Card className="bg-stone-800/50 border-stone-700 p-4">
            <h4 className="font-bold text-amber-300 text-sm mb-2">How This Works</h4>
            <ul className="text-xs text-stone-400 space-y-2">
              <li>• <strong>Working Time</strong> is calculated using Newton's Law of Cooling, determining when your glass cools from the annealing temperature (565°C) to the strain point (510°C)</li>
              <li>• <strong>Shape Factor</strong> (plate, cylinder, sphere) affects heat transfer rate and cooling behavior</li>
              <li>• <strong>Thermal Stress</strong> increases as glass cools; exceeding safe limits causes cracking</li>
              <li>• <strong>All calculations</strong> assume ambient temperature of 25°C and natural convection cooling</li>
            </ul>
          </Card>
        </div>
      )}

      {/* EMPTY STATE */}
      {!hasCalculated && (
        <Card className="bg-stone-800/50 border-stone-700 border-dashed p-8 text-center">
          <CheckCircle className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <p className="text-sm text-stone-400">
            Enter your glass dimensions and select the shape to calculate available working time
          </p>
        </Card>
      )}
    </div>
  );
}
