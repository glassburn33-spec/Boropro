import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import LogoHome from "./pages/LogoHome";
import Home from "./pages/Home";
import FlameChemistryCharacterization from "./pages/FlameSimulator";
import ColorDatabase from "./pages/ColorPicker";
import KilnLog from "./pages/FiringTracker";
import Calculator from "./pages/Calculator";
import LogLibrary from "./pages/PDFLibrary";
import References from "./pages/References";
import ColorScience from "./pages/ColorScience";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={LogoHome} />
      <Route path={"/explore"} component={Home} />
      <Route path={"/flame-simulator"} component={FlameChemistryCharacterization} />
      <Route path={"/color-picker"} component={ColorDatabase} />
      <Route path={"/firing-tracker"} component={KilnLog} />
      <Route path={"/calculator"} component={Calculator} />
      <Route path={"/pdf-library"} component={LogLibrary} />
      <Route path={"/kiln-log"} component={KilnLog} />
      <Route path={"/references"} component={References} />
      <Route path={"/color-science"} component={ColorScience} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
