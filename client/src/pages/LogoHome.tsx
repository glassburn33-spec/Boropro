/**
 * Logo-Only Home Page
 * Displays only the app logo centered on the page
 * No navigation, no header, no footer, no decorative elements
 */

export default function LogoHome() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <img
        src="/manus-storage/ChatGPTImageMay5,2026,10_33_46PM_dee2f726.png"
        alt="BoroPro Logo"
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain max-w-[80vw] max-h-[80vh]"
      />
    </div>
  );
}
