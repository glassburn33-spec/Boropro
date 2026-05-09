/**
 * Logo-Only Home Page
 * Displays the app logo centered on the page with header
 */

import { useState } from "react";
import { Menu } from "lucide-react";
import { useLocation } from "wouter";

export default function LogoHome() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [headerImage, setHeaderImage] = useState<string>("/manus-storage/Gemini_Generated_Image_xdojvrxdojvrxdoj_491ab419.png");
  const [, setLocation] = useLocation();

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
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-stone-900 border-b border-amber-700/30 shadow-lg">
        {/* ROW 1: Hamburger Menu and Logo */}
        <div className="flex items-center h-28 px-4 gap-2 relative">
          {/* Hamburger Menu Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDrawer(!showDrawer)}
              className="p-2 hover:bg-stone-800 rounded transition flex-shrink-0 w-12 h-12 flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6 text-stone-300" />
            </button>
            
            {/* Dropdown Menu */}
            {showDrawer && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-stone-800 border border-amber-700/50 rounded shadow-lg z-1000">
                <button
                  onClick={() => { handleTabChange("studio"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Glass-Science
                </button>
                <button
                  onClick={() => { handleTabChange("scieequip"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Scie-Equip
                </button>
                <button
                  onClick={() => { handleTabChange("calculator"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Calculator
                </button>
                <button
                  onClick={() => { handleTabChange("colorscience"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Color-Scie
                </button>
                <a
                  href="/references"
                  onClick={() => setShowDrawer(false)}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition block"
                >
                  References
                </a>
              </div>
            )}
          </div>
          
          {/* Logo on left */}
          <img src="/manus-storage/ChatGPTImageMay5,2026,10_33_46PM_dee2f726.png" alt="BoroPro Logo" className="h-28 w-28 flex-shrink-0 object-contain" />
          
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
      </header>
      
      {/* Close dropdown when clicking outside */}
      {showDrawer && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowDrawer(false)}
        />
      )}

      {/* MAIN CONTENT - Centered Logo */}
      <main className="min-h-screen flex items-center justify-center px-4" style={{ marginTop: '120px' }}>
        <img
          src="/manus-storage/ChatGPTImageMay5,2026,10_33_46PM_dee2f726.png"
          alt="BoroPro Logo"
          className="w-96 h-96 sm:w-[28rem] sm:h-[28rem] md:w-[32rem] md:h-[32rem] lg:w-[40rem] lg:h-[40rem] xl:w-[48rem] xl:h-[48rem] object-contain max-w-[95vw] max-h-[80vh]"
        />
      </main>
    </div>
  );
}
