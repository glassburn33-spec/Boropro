/*
Kiln Log Page - Test-firing log with historical comparison and pattern detection.
Scientific neo-brutalist design with furnace-lab aesthetics.
*/

import { useState, useEffect } from "react";
import { BookOpenCheck, Menu, X } from "lucide-react";
import AnealingProfileEditor from "@/components/AnealingProfileEditor";

export default function KilnLog() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Handle unsaved changes warning when navigating away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleNavigationClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      setPendingNavigation(href);
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmLeave = () => {
    setShowConfirmDialog(false);
    if (pendingNavigation) {
      window.location.href = pendingNavigation;
    }
  };

  const handleStayOnPage = () => {
    setShowConfirmDialog(false);
    setPendingNavigation(null);
  };
  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/manus-storage/boroprologoicon_47146e54.png" alt="BoroPrologo" className="h-24 w-24 object-contain" />
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/color-picker" onClick={(e) => handleNavigationClick(e, '/color-picker')} className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Color
            </a>
            <a href="/flame-simulator" onClick={(e) => handleNavigationClick(e, '/flame-simulator')} className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Flame Char
            </a>
            <a href="/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=12.5&length=25&width=25" onClick={(e) => handleNavigationClick(e, '/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=12.5&length=25&width=25')} className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Reheat Calc
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-amber-500">
              Kiln Log
            </a>
            <a href="/logs" onClick={(e) => handleNavigationClick(e, '/logs')} className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Log
            </a>
            <a href="/references" onClick={(e) => handleNavigationClick(e, '/references')} className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
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
              onClick={(e) => { handleNavigationClick(e, '/color-picker'); setMobileMenuOpen(false); }}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Color
            </a>
            <a
              href="/flame-simulator"
              onClick={(e) => { handleNavigationClick(e, '/flame-simulator'); setMobileMenuOpen(false); }}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Flame Char
            </a>
            <a
              href="/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=12.5&length=25&width=25"
              onClick={(e) => { handleNavigationClick(e, '/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=12.5&length=25&width=25'); setMobileMenuOpen(false); }}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Reheat Calc
            </a>
            <a
              href="/firing-tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-500/40 hover:bg-amber-500/50 text-amber-300 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Kiln Log
            </a>
            <a
              href="/logs"
              onClick={(e) => { handleNavigationClick(e, '/logs'); setMobileMenuOpen(false); }}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Log
            </a>
            <a
              href="/references"
              onClick={(e) => { handleNavigationClick(e, '/references'); setMobileMenuOpen(false); }}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              References
            </a>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* Page Title */}
        <section className="py-8">
          <div className="container max-w-6xl">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">Firing Tracker</h1>
            </div>

            {/* Header Image */}
            <div className="w-full flex flex-col items-center mb-6">
              <img
                src="/manus-storage/kilnlogoage_74b1e98f.png"
                alt="Kiln"
                className="w-full max-w-4xl rounded-xl border border-stone-700 shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Annealing Profile Editor */}
        <section className="py-16">
          <div className="container max-w-6xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-amber-400 mb-2">Annealing Cycle</h2>
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

      {/* Unsaved Changes Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-stone-800 border border-amber-700/50 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Unsaved Changes</h3>
              <p className="text-stone-300">You have unsaved changes to your annealing schedule. Log your schedules by selecting logs button before leaving the page?</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleStayOnPage}
                className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded transition font-medium"
              >
                Stay on Page
              </button>
              <button
                onClick={handleConfirmLeave}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded transition font-medium"
              >
                Leave Without Saving
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
