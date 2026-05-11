/*
Tools Home Page
Displays available tools and utilities for glass blowing
*/

import { useState } from "react";

export default function ToolHome() {
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
              Color
            </a>
            <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Flame Char
            </a>
            <a href="/calculator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Reheat Calc
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Kiln Log
            </a>
            <a href="/pdf-library" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Log
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-amber-400 mb-4">Tools & Utilities</h1>
            <p className="text-stone-300 text-lg">
              Practical tools and calculators for glass blowing and kiln management.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Flame Simulator */}
            <a
              href="/flame-simulator"
              className="group p-6 bg-stone-900/50 border border-amber-700/30 rounded-lg hover:border-amber-500/50 hover:bg-stone-900/70 transition-all"
            >
              <h3 className="text-xl font-semibold text-amber-400 mb-2 group-hover:text-orange-400">
                Flame Characterization
              </h3>
              <p className="text-stone-400 text-sm">
                Understand reducing, neutral, and oxidizing flames and how they affect color families in borosilicate glass.
              </p>
            </a>

            {/* Color Picker */}
            <a
              href="/color-picker"
              className="group p-6 bg-stone-900/50 border border-amber-700/30 rounded-lg hover:border-amber-500/50 hover:bg-stone-900/70 transition-all"
            >
              <h3 className="text-xl font-semibold text-amber-400 mb-2 group-hover:text-orange-400">
                Color Database
              </h3>
              <p className="text-stone-400 text-sm">
                Browse and reference all available borosilicate glass colors with chemical composition and properties.
              </p>
            </a>

            {/* Calculator */}
            <a
              href="/calculator"
              className="group p-6 bg-stone-900/50 border border-amber-700/30 rounded-lg hover:border-amber-500/50 hover:bg-stone-900/70 transition-all"
            >
              <h3 className="text-xl font-semibold text-amber-400 mb-2 group-hover:text-orange-400">
                Reheat Calculator
              </h3>
              <p className="text-stone-400 text-sm">
                Calculate optimal reheat times based on glass geometry, kiln temperature, and room conditions.
              </p>
            </a>

            {/* Kiln Log */}
            <a
              href="/firing-tracker"
              className="group p-6 bg-stone-900/50 border border-amber-700/30 rounded-lg hover:border-amber-500/50 hover:bg-stone-900/70 transition-all"
            >
              <h3 className="text-xl font-semibold text-amber-400 mb-2 group-hover:text-orange-400">
                Kiln Log
              </h3>
              <p className="text-stone-400 text-sm">
                Track and log kiln firing sessions with detailed records and annealing schedules.
              </p>
            </a>

            {/* PDF Library */}
            <a
              href="/pdf-library"
              className="group p-6 bg-stone-900/50 border border-amber-700/30 rounded-lg hover:border-amber-500/50 hover:bg-stone-900/70 transition-all"
            >
              <h3 className="text-xl font-semibold text-amber-400 mb-2 group-hover:text-orange-400">
                PDF Library
              </h3>
              <p className="text-stone-400 text-sm">
                Store and reference technical documents, guides, and reference materials.
              </p>
            </a>

            {/* Color Science */}
            <a
              href="/color-science"
              className="group p-6 bg-stone-900/50 border border-amber-700/30 rounded-lg hover:border-amber-500/50 hover:bg-stone-900/70 transition-all"
            >
              <h3 className="text-xl font-semibold text-amber-400 mb-2 group-hover:text-orange-400">
                Color Science
              </h3>
              <p className="text-stone-400 text-sm">
                Explore the scientific principles behind glass coloration and metal ion behavior.
              </p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
