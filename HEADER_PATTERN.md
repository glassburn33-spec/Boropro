# References Tab Header Pattern

## Structure Overview

The References tab uses a **sticky header with navigation** that should be replicated across all tabs.

### Header Component Structure

```tsx
<header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
  <div className="container flex items-center justify-between py-3 md:py-4 px-3 md:px-0">
    {/* Logo */}
    <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <img src="/manus-storage/boroprologoicon_47146e54.png" alt="BoroPrologo" className="h-16 md:h-24 w-16 md:w-24 object-contain" />
    </a>
    
    {/* Desktop Navigation */}
    <nav className="hidden md:flex items-center gap-8">
      <a href="/color-picker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">Color</a>
      <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">Flame Char</a>
      <a href="/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=12.5&length=25&width=25" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">Reheat Calc</a>
      <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">Kiln Editor</a>
      <a href="/logs" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">Log</a>
      <a href="/references" className="text-xs uppercase tracking-wider text-amber-500">References</a>
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
      <a href="/color-picker" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider">Color</a>
      <a href="/flame-simulator" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider">Flame Char</a>
      <a href="/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=12.5&length=25&width=25" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider">Reheat Calc</a>
      <a href="/firing-tracker" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider">Kiln Editor</a>
      <a href="/logs" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider">Log</a>
      <a href="/references" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-amber-500/40 hover:bg-amber-500/50 text-amber-300 rounded transition text-center font-medium uppercase text-xs tracking-wider">References</a>
    </nav>
  )}
</header>
```

## Key Features

1. **Sticky positioning**: `sticky top-0 z-50` keeps header visible while scrolling
2. **Backdrop blur**: `bg-stone-950/95 backdrop-blur-sm` creates frosted glass effect
3. **Logo**: Responsive sizing (h-16 md:h-24)
4. **Desktop Navigation**: Hidden on mobile, visible on md+ breakpoint
5. **Mobile Menu**: Hamburger toggle with dropdown navigation
6. **Active State**: Current page link uses `text-amber-500` (highlighted)
7. **Hover States**: `hover:text-amber-500 transition-colors`
8. **Navigation Links**:
   - Color → /color-picker
   - Flame Char → /flame-simulator
   - Reheat Calc → /calculator
   - Kiln Editor → /firing-tracker
   - Log → /logs
   - References → /references

## Implementation Notes

- State: `const [mobileMenuOpen, setMobileMenuOpen] = useState(false);`
- Imports: `Menu`, `X` from lucide-react
- Container class handles responsive padding
- All navigation links use uppercase, small font size, and tracking
