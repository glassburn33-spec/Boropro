/**
 * Logo-Only Home Page
 * Displays the app logo centered on the page with header
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";

export default function LogoHome() {
  const [headerImage, setHeaderImage] = useState<string>("/manus-storage/Gemini_Generated_Image_xdojvrxdojvrxdoj_491ab419.png");
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHeaderImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setHeaderImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTabChange = (tab: string) => {
    // Navigate to explore page when a tab is clicked
    setLocation("/explore");
  };
  return (
    <div className="space-y-6 overflow-hidden bg-stone-950 text-stone-100" style={{ height: '100vh' }}>
      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-stone-900 border-b border-amber-700/30 shadow-lg">
        {/* ROW 1: Logo */}
        <div className="flex items-center h-20 px-4 gap-2 relative">
          {/* Logo */}
          <img src="/manus-storage/ChatGPTImageMay5,2026,10_33_46PM_dee2f726.png" alt="BoroPro Logo" className="h-20 w-20 flex-shrink-0 object-contain" />
          
          {/* Header image placeholder on right */}
          <div className="flex-1 h-full flex items-center justify-center bg-stone-800 border border-dashed border-amber-700/50 ml-4 relative overflow-hidden">
            {headerImage ? (
              <img src={headerImage} alt="Header" className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full hover:bg-stone-700/50 transition">
                <span className="text-stone-400 text-sm">Click to add header image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderImageUpload}
                  className="hidden"
                />
              </label>
            )}
            {headerImage && (
              <button
                onClick={() => setHeaderImage("")}
                className="absolute top-2 right-2 bg-stone-900/80 hover:bg-stone-900 text-stone-300 px-2 py-1 text-xs rounded"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        
        {/* ROW 2: Navigation Buttons - Desktop */}
        <nav className="hidden sm:flex justify-center gap-2 md:gap-4 px-4 py-4 border-t border-amber-700/30 flex-wrap">
          <a
            href="/explore?tab=studio"
            className="px-3 md:px-6 py-2 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-sm md:text-base"
          >
            Glass-Science
          </a>
          <a
            href="/explore?tab=scieequip"
            className="px-3 md:px-6 py-2 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-sm md:text-base"
          >
            Scie-Equip
          </a>
          <a
            href="/explore?tab=colorscience"
            className="px-3 md:px-6 py-2 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-sm md:text-base"
          >
            Color-Scie
          </a>
          <a
            href="/tools"
            className="px-3 md:px-6 py-2 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-sm md:text-base"
          >
            Tools
          </a>
        </nav>
        
        {/* ROW 2: Mobile Hamburger Menu */}
        <div className="sm:hidden flex items-center justify-center px-4 py-4 border-t border-amber-700/30">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-stone-800 rounded transition"
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
          <nav className="sm:hidden flex flex-col gap-2 px-4 py-3 bg-stone-800 border-t border-amber-700/30">
            <a
              href="/explore?tab=studio"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium"
            >
              Glass-Science
            </a>
            <a
              href="/explore?tab=scieequip"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium"
            >
              Scie-Equip
            </a>
            <a
              href="/explore?tab=colorscience"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium"
            >
              Color-Scie
            </a>
            <a
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium"
            >
              Tools
            </a>
          </nav>
        )}
      </header>
      


      {/* MAIN CONTENT - Centered Logo */}
      <main className="fixed inset-0 top-[88px] flex items-center justify-center px-4 overflow-hidden" style={{ height: 'calc(100vh - 88px)' }}>
        <img
          src="/manus-storage/ChatGPTImageMay5,2026,10_33_46PM_dee2f726.png"
          alt="BoroPro Logo"
          className="w-[48rem] h-[48rem] sm:w-[56rem] sm:h-[56rem] md:w-[64rem] md:h-[64rem] lg:w-[80rem] lg:h-[80rem] xl:w-[96rem] xl:h-[96rem] object-contain max-w-[98vw] max-h-[calc(100vh-140px)]"
        />
      </main>
    </div>
  );
}
