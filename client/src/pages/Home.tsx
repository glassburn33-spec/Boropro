/*
BoroPro - Practical Glass Blower Reference Tool
Design: Studio-focused, minimal reading, maximum usability
Dark theme for studio environment, large touch targets for gloved hands
*/

import { useState } from "react";
import { Search, Zap, Palette, Settings, BookOpen, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"equipment" | "schedules" | "colors" | "tools">("equipment");

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-stone-900 border-b border-amber-700/30 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full border-2 border-amber-500 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-500">◆</span>
            </div>
            <h1 className="text-lg font-bold text-white">BoroPro</h1>
            <span className="text-xs text-stone-400 ml-auto">Studio Reference</span>
          </div>
          <Input
            placeholder="Search equipment, schedules, colors..."
            className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 h-9"
          />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <QuickActionCard
            icon={<Zap className="w-5 h-5" />}
            label="Equipment"
            description="Kilns & Torches"
            onClick={() => setActiveTab("equipment")}
          />
          <QuickActionCard
            icon={<Settings className="w-5 h-5" />}
            label="Schedules"
            description="Quick Lookup"
            onClick={() => setActiveTab("schedules")}
          />
          <QuickActionCard
            icon={<Palette className="w-5 h-5" />}
            label="Colors"
            description="Specs & Compat"
            onClick={() => setActiveTab("colors")}
          />
          <QuickActionCard
            icon={<Calculator className="w-5 h-5" />}
            label="Tools"
            description="Calculators"
            onClick={() => setActiveTab("tools")}
          />
        </div>

        {/* EQUIPMENT REFERENCE */}
        {activeTab === "equipment" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-400">Equipment Reference</h2>

            {/* KILNS */}
            <div>
              <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider mb-3">Kilns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <EquipmentCard
                  name="Skutt KilnMaster 1227"
                  specs={["Max: 2300°F", "27 cu in", "3 zone", "Digital"]}
                  notes="Popular for boro. Excellent control."
                />
                <EquipmentCard
                  name="Paragon Pro"
                  specs={["Max: 2300°F", "Large", "4 zone", "Digital"]}
                  notes="Professional grade. Best for production."
                />
                <EquipmentCard
                  name="Paragon Xpress"
                  specs={["Max: 2300°F", "Compact", "2 zone", "Digital"]}
                  notes="Fast heating. Quick cycles."
                />
                <EquipmentCard
                  name="Evenheat Studio Pro"
                  specs={["Max: 2300°F", "Medium", "3 zone", "Digital"]}
                  notes="Reliable. Good consistency."
                />
              </div>
            </div>

            {/* TORCHES */}
            <div>
              <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider mb-3">Torches</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <EquipmentCard
                  name="Minor Torch"
                  specs={["Single fuel", "~2000°F", "Oxidizing", "Detail work"]}
                  notes="Good for initial heating and detail work."
                />
                <EquipmentCard
                  name="Major Torch"
                  specs={["Dual fuel", "~2800°F", "Neutral/Reducing", "Production"]}
                  notes="Essential for production work."
                />
                <EquipmentCard
                  name="Reduction Torch"
                  specs={["High fuel", "~2500°F", "Reducing", "Color striking"]}
                  notes="For color development and striking effects."
                />
                <EquipmentCard
                  name="Neutral Flame"
                  specs={["Balanced", "~2600°F", "Neutral", "General work"]}
                  notes="Preserves colors without striking."
                />
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULES */}
        {activeTab === "schedules" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-400">Annealing Schedules</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ScheduleCard
                name="Boro 1mm Hollow"
                temps="1020°F anneal"
                time="2-3 hrs"
                details={["15 min hold", "Anneal: 5°F/hr", "Cool: 2°F/hr", "Thin wall"]}
              />
              <ScheduleCard
                name="Boro 2mm Solid"
                temps="1035°F anneal"
                time="3-4 hrs"
                details={["25 min hold", "Anneal: 3°F/hr", "Cool: 2°F/hr", "Standard"]}
              />
              <ScheduleCard
                name="Boro 3mm Solid"
                temps="1050°F anneal"
                time="4-5 hrs"
                details={["30 min hold", "Anneal: 3°F/hr", "Cool: 2°F/hr", "Thick"]}
              />
              <ScheduleCard
                name="Boro 4mm+ Solid"
                temps="1050°F anneal"
                time="6-8 hrs"
                details={["45 min hold", "Anneal: 2°F/hr", "Cool: 1°F/hr", "Very thick"]}
              />
              <ScheduleCard
                name="Slump 2mm"
                temps="1150°F slump"
                time="3-4 hrs"
                details={["15 min hold", "Heat: 4°F/hr", "Anneal: 1035°F", "Watch closely"]}
              />
              <ScheduleCard
                name="Heat-Sensitive"
                temps="1000°F anneal"
                time="3-4 hrs"
                details={["20 min hold", "Lower temp", "Prevents color shift", "Opaque colors"]}
              />
            </div>

            <div className="bg-stone-800 border border-stone-700 rounded p-4">
              <p className="text-sm text-stone-300">
                💡 <strong>Tip:</strong> Tap any schedule to copy all steps to clipboard. Use these as starting points and adjust based on your kiln's performance.
              </p>
            </div>
          </div>
        )}

        {/* COLORS */}
        {activeTab === "colors" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-400">Color Reference</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ColorCard
                name="Cobalt Blue"
                manufacturer="Northstar"
                composition="Cobalt Oxide (CoO)"
                anneal="1020-1050°F"
                properties={["Stable", "Reduction-compatible"]}
              />
              <ColorCard
                name="Copper Ruby"
                manufacturer="Northstar"
                composition="Copper Oxide (CuO)"
                anneal="1020-1050°F"
                properties={["Striking", "Reduction-sensitive"]}
              />
              <ColorCard
                name="Amber Purple"
                manufacturer="Northstar"
                composition="Gold compounds"
                anneal="1000-1040°F"
                properties={["Heat-sensitive", "Striking"]}
              />
              <ColorCard
                name="Yellow"
                manufacturer="Northstar"
                composition="Cadmium compounds"
                anneal="1000-1040°F"
                properties={["Heat-sensitive", "Use lower temp"]}
              />
              <ColorCard
                name="Silver Exotic"
                manufacturer="Northstar"
                composition="Silver compounds"
                anneal="1020-1050°F"
                properties={["Striking", "Iridescent in reduction"]}
              />
              <ColorCard
                name="Heat-Sensitive Opaque"
                manufacturer="Northstar"
                composition="Various"
                anneal="990-1020°F"
                properties={["Very heat-sensitive", "Avoid with striking colors"]}
              />
            </div>

            <div className="bg-stone-800 border border-stone-700 rounded p-4">
              <p className="text-sm text-stone-300">
                ⚠️ <strong>Compatibility:</strong> Avoid mixing heat-sensitive opaques with striking colors (Copper Ruby, Amber Purple, Silver Exotics). Use lower anneal temps for heat-sensitive colors.
              </p>
            </div>
          </div>
        )}

        {/* TOOLS */}
        {activeTab === "tools" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-400">Quick Tools</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToolCard title="Annealing Time Calculator">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-stone-400">Glass Thickness</label>
                    <select className="w-full bg-stone-800 border border-stone-700 rounded p-2 text-sm text-white">
                      <option>1mm (thin wall)</option>
                      <option>2mm (standard)</option>
                      <option>3mm (thick)</option>
                      <option>4mm+ (very thick)</option>
                    </select>
                  </div>
                  <div className="bg-amber-900/20 border border-amber-700/30 rounded p-3">
                    <p className="text-xs text-stone-400">Estimated time:</p>
                    <p className="text-lg font-bold text-amber-400">3-4 hours</p>
                  </div>
                </div>
              </ToolCard>

              <ToolCard title="Temperature Converter">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-stone-400">Fahrenheit</label>
                    <input type="number" placeholder="1050" className="w-full bg-stone-800 border border-stone-700 rounded p-2 text-sm text-white" />
                  </div>
                  <div className="bg-amber-900/20 border border-amber-700/30 rounded p-3">
                    <p className="text-xs text-stone-400">Celsius:</p>
                    <p className="text-lg font-bold text-amber-400">566°C</p>
                  </div>
                </div>
              </ToolCard>

              <ToolCard title="Effective Thickness">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-stone-400">Form Type</label>
                    <select className="w-full bg-stone-800 border border-stone-700 rounded p-2 text-sm text-white">
                      <option>Solid (full thickness)</option>
                      <option>Hollow (wall thickness only)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-stone-400">Wall Thickness</label>
                    <input type="number" placeholder="2mm" className="w-full bg-stone-800 border border-stone-700 rounded p-2 text-sm text-white" />
                  </div>
                  <div className="bg-amber-900/20 border border-amber-700/30 rounded p-3">
                    <p className="text-xs text-stone-400">Effective thickness:</p>
                    <p className="text-lg font-bold text-amber-400">2mm</p>
                  </div>
                </div>
              </ToolCard>

              <ToolCard title="Cooling Rate Guide">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-400">1mm thin wall:</span>
                    <span className="text-amber-400 font-bold">1°F/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">2mm standard:</span>
                    <span className="text-amber-400 font-bold">2°F/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">3mm thick:</span>
                    <span className="text-amber-400 font-bold">2°F/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">4mm+ very thick:</span>
                    <span className="text-amber-400 font-bold">0.5°F/hr</span>
                  </div>
                </div>
              </ToolCard>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-stone-800 px-4 py-2">
        <div className="max-w-6xl mx-auto flex justify-around">
          <NavButton
            icon={<Zap className="w-5 h-5" />}
            label="Equipment"
            active={activeTab === "equipment"}
            onClick={() => setActiveTab("equipment")}
          />
          <NavButton
            icon={<Settings className="w-5 h-5" />}
            label="Schedules"
            active={activeTab === "schedules"}
            onClick={() => setActiveTab("schedules")}
          />
          <NavButton
            icon={<Palette className="w-5 h-5" />}
            label="Colors"
            active={activeTab === "colors"}
            onClick={() => setActiveTab("colors")}
          />
          <NavButton
            icon={<Calculator className="w-5 h-5" />}
            label="Tools"
            active={activeTab === "tools"}
            onClick={() => setActiveTab("tools")}
          />
        </div>
      </nav>

      {/* BOTTOM PADDING */}
      <div className="h-20" />
    </div>
  );
}

// COMPONENTS

function QuickActionCard({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-stone-800 border border-stone-700 hover:border-amber-600 rounded p-4 text-left transition-colors"
    >
      <div className="text-amber-500 mb-2">{icon}</div>
      <p className="text-sm font-bold text-white">{label}</p>
      <p className="text-xs text-stone-400">{description}</p>
    </button>
  );
}

function EquipmentCard({
  name,
  specs,
  notes,
}: {
  name: string;
  specs: string[];
  notes: string;
}) {
  return (
    <Card className="bg-stone-800 border-stone-700 p-4">
      <h4 className="font-bold text-white mb-2">{name}</h4>
      <div className="space-y-1 mb-3">
        {specs.map((spec, i) => (
          <p key={i} className="text-xs text-stone-300">
            • {spec}
          </p>
        ))}
      </div>
      <p className="text-xs text-amber-400">{notes}</p>
      <Button
        size="sm"
        variant="outline"
        className="mt-3 w-full h-8 text-xs"
        onClick={() => navigator.clipboard.writeText(`${name}\n${specs.join("\n")}`)}
      >
        Copy Specs
      </Button>
    </Card>
  );
}

function ScheduleCard({
  name,
  temps,
  time,
  details,
}: {
  name: string;
  temps: string;
  time: string;
  details: string[];
}) {
  return (
    <Card className="bg-stone-800 border-stone-700 p-4">
      <h4 className="font-bold text-white mb-1">{name}</h4>
      <p className="text-sm text-amber-400 font-bold mb-1">{temps}</p>
      <p className="text-xs text-stone-400 mb-3">{time}</p>
      <div className="space-y-1 mb-3">
        {details.map((detail, i) => (
          <p key={i} className="text-xs text-stone-300">
            • {detail}
          </p>
        ))}
      </div>
      <Button
        size="sm"
        variant="outline"
        className="w-full h-8 text-xs"
        onClick={() => navigator.clipboard.writeText(`${name}\n${temps}\n${details.join("\n")}`)}
      >
        Copy Schedule
      </Button>
    </Card>
  );
}

function ColorCard({
  name,
  manufacturer,
  composition,
  anneal,
  properties,
}: {
  name: string;
  manufacturer: string;
  composition: string;
  anneal: string;
  properties: string[];
}) {
  return (
    <Card className="bg-stone-800 border-stone-700 p-4">
      <h4 className="font-bold text-white mb-1">{name}</h4>
      <p className="text-xs text-stone-400 mb-2">{manufacturer}</p>
      <p className="text-xs text-stone-300 mb-2">
        <strong>Composition:</strong> {composition}
      </p>
      <p className="text-xs text-amber-400 font-bold mb-2">{anneal}</p>
      <div className="space-y-1">
        {properties.map((prop, i) => (
          <p key={i} className="text-xs text-stone-300">
            • {prop}
          </p>
        ))}
      </div>
      <Button
        size="sm"
        variant="outline"
        className="mt-3 w-full h-8 text-xs"
        onClick={() => navigator.clipboard.writeText(`${name}\n${composition}\n${anneal}`)}
      >
        Copy Specs
      </Button>
    </Card>
  );
}

function ToolCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="bg-stone-800 border-stone-700 p-4">
      <h4 className="font-bold text-white mb-4">{title}</h4>
      {children}
    </Card>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-2 px-3 rounded transition-colors ${
        active
          ? "text-amber-500 bg-stone-800/50"
          : "text-stone-500 hover:text-stone-300"
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}
