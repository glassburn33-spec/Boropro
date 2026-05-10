/*
Reheat Calculator Page - Borosilicate glass cooling schedule calculator
with physics-based calculations for working time and thermal stress analysis.
*/

import { CalculatorTab } from "./CalculatorTab";

export default function Calculator() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/manus-storage/boroprologoicon_47146e54.png" alt="BoroPrologo" className="h-24 w-24 object-contain" />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/color-picker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Color Database
            </a>
            <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Flame Char
            </a>
            <a href="/calculator" className="text-xs uppercase tracking-wider text-amber-500">
              Reheat Calc
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Kiln Log
            </a>
            <a href="/pdf-library" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Log Library
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-4">
              Reheat Calculator
            </h1>
          </div>
        </section>

        {/* Calculator Content */}
        <section className="py-12">
          <div className="container max-w-6xl">
            <CalculatorTab />
          </div>
        </section>
      </main>
    </div>
  );
}
