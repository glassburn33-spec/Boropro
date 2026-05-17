/*
Tools Home Page
Displays available tools and utilities for glass blowing
*/

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function ToolHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100 overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-3 md:py-4 px-3 md:px-0">
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
            <a href="/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=12.5&length=25&width=25" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
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
              href="/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=12.5&length=25&width=25"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
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

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Hero */}
        <section className="border-b border-white/10 py-8 md:py-16 px-4 md:px-0">
          <div className="container">
            <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 break-words">Tools</h1>
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
