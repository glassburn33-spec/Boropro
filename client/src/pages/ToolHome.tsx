/*
Tools Home Page
Displays available tools and utilities for glass blowing
*/

import { useState } from "react";

export default function ToolHome() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100 overflow-hidden">
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
            <a href="/logs" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Log
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Hero */}
        <section className="border-b border-white/10 py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Tools</h1>
          </div>
        </section>

        <div className="container py-12 overflow-hidden h-full flex items-center justify-center">
          {/* Hero Image */}
          <div className="w-full h-full flex justify-center items-center">
            <img 
              src="/manus-storage/toolhome_9983abc7.png" 
              alt="Tools and utilities overview" 
              className="w-full max-w-2xl h-full object-contain rounded-lg shadow-lg"
            />
          </div>




        </div>
      </main>
    </div>
  );
}
