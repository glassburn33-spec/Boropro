/*
Kiln Log Page - Test-firing log with historical comparison and pattern detection.
Scientific neo-brutalist design with furnace-lab aesthetics.
*/

import { useState } from "react";
import { BookOpenCheck } from "lucide-react";
import AnealingProfileEditor from "@/components/AnealingProfileEditor";

export default function KilnLog() {
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
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-amber-500">
              Kiln Log
            </a>
            <a href="/logs" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Log
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Header Image */}
        <section className="border-b border-white/10">
          <img src="/manus-storage/kilnlogoage_74b1e98f.png" alt="Kiln" className="w-full h-auto object-cover" style={{ maxHeight: '648px' }} />
        </section>

        {/* Hero */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-6">
              Kiln Log
            </h1>
          </div>
        </section>

        {/* Annealing Profile Editor */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Annealing Cycle Profile Editor</h2>
            </div>
            <AnealingProfileEditor />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-stone-950/50 py-8">
        <div className="container max-w-6xl">
          <p className="text-xs text-stone-500 text-center">
            Firing Tracker Tool · Part of the Borosilicate Kiln Research Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
