/*
Reheat Calculator Page - Borosilicate glass cooling schedule calculator
with physics-based calculations for working time and thermal stress analysis.
*/

import { CalculatorTab } from "./CalculatorTab";

export default function Calculator() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      <CalculatorTab />
    </div>
  );
}
