/*
Firing Tracker Page - Test-firing log with historical comparison and pattern detection.
Scientific neo-brutalist design with furnace-lab aesthetics.
*/

import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BookOpenCheck, Plus, Trash2, TrendingUp, Calendar } from "lucide-react";
import AnealingProfileEditor from "@/components/AnealingProfileEditor";

interface TestFiringRecord {
  id: string;
  date: string;
  colorsUsed: string[];
  schedule: {
    annealTemp: number;
    annealTime: number;
    flameType: "neutral" | "oxidizing" | "reducing";
  };
  kiln: {
    model: string;
    calibration: string;
  };
  outcome: {
    colorAccuracy: "excellent" | "good" | "fair" | "poor";
    notes: string;
  };
  metadata: {
    glassThickness: number;
    formType: "solid" | "hollow-open" | "hollow-closed";
    strikeMethod: "kiln" | "flame" | "none";
  };
}

const STORAGE_KEY = "boro_kiln_firing_records";

export default function FiringTracker() {
  const [records, setRecords] = useState<TestFiringRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<TestFiringRecord>>({
    date: new Date().toISOString().split("T")[0],
    colorsUsed: [],
    schedule: { annealTemp: 1050, annealTime: 2, flameType: "neutral" },
    kiln: { model: "", calibration: "" },
    outcome: { colorAccuracy: "good", notes: "" },
    metadata: { glassThickness: 0.5, formType: "solid", strikeMethod: "none" },
  });

  // Load records from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecords(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load records:", e);
      }
    }
  }, []);

  // Save records to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const handleAddRecord = () => {
    if (!formData.date || !formData.schedule?.annealTemp) {
      alert("Please fill in required fields");
      return;
    }

    const newRecord: TestFiringRecord = {
      id: Date.now().toString(),
      date: formData.date || "",
      colorsUsed: formData.colorsUsed || [],
      schedule: formData.schedule as TestFiringRecord["schedule"],
      kiln: formData.kiln || { model: "", calibration: "" },
      outcome: formData.outcome || { colorAccuracy: "good", notes: "" },
      metadata: formData.metadata || { glassThickness: 0.5, formType: "solid", strikeMethod: "none" },
    };

    setRecords([...records, newRecord]);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      colorsUsed: [],
      schedule: { annealTemp: 1050, annealTime: 2, flameType: "neutral" },
      kiln: { model: "", calibration: "" },
      outcome: { colorAccuracy: "good", notes: "" },
      metadata: { glassThickness: 0.5, formType: "solid", strikeMethod: "none" },
    });
    setShowForm(false);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  // Chart data
  const chartData = useMemo(() => {
    return records
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((record) => ({
        date: new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        temp: record.schedule.annealTemp,
        time: record.schedule.annealTime,
        accuracy:
          record.outcome.colorAccuracy === "excellent"
            ? 4
            : record.outcome.colorAccuracy === "good"
              ? 3
              : record.outcome.colorAccuracy === "fair"
                ? 2
                : 1,
      }));
  }, [records]);

  // Statistics
  const stats = useMemo(() => {
    if (records.length === 0) return null;

    const avgTemp = Math.round(records.reduce((sum, r) => sum + r.schedule.annealTemp, 0) / records.length);
    const avgTime = (records.reduce((sum, r) => sum + r.schedule.annealTime, 0) / records.length).toFixed(1);
    const excellentCount = records.filter((r) => r.outcome.colorAccuracy === "excellent").length;
    const successRate = Math.round((excellentCount / records.length) * 100);

    return { avgTemp, avgTime, excellentCount, successRate };
  }, [records]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/manus-storage/boroprologoicon_47146e54.png" alt="BoroPrologo" className="h-24 w-24 object-contain" />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Flame Char
            </a>
            <a href="/color-picker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Color Picker
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-amber-500">
              Kiln Log
            </a>
            <a href="/pdf-library" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              PDF Library
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <div className="mb-5 flex items-center gap-2">
              <BookOpenCheck size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Interactive tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-6">
              Test Firing Tracker
            </h1>
            <p className="text-lg leading-8 text-stone-300 max-w-3xl">
              Log your test firings, track color outcomes over time, and identify patterns in your kiln behavior. Build a personal database of successful schedules and techniques.
            </p>
          </div>
        </section>

        {/* Statistics */}
        {stats && (
          <section className="border-b border-white/10 py-16">
            <div className="container max-w-6xl">
              <h2 className="text-2xl font-bold text-white mb-8">Your Firing Statistics</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Total Firings</span>
                  <span className="text-3xl font-bold text-white">{records.length}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Avg Anneal Temp</span>
                  <span className="text-3xl font-bold text-white">{stats.avgTemp}°F</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Avg Anneal Time</span>
                  <span className="text-3xl font-bold text-white">{stats.avgTime}h</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Success Rate</span>
                  <span className="text-3xl font-bold text-white">{stats.successRate}%</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
          <section className="border-b border-white/10 py-16">
            <div className="container max-w-6xl">
              <h2 className="text-2xl font-bold text-white mb-8">Temperature & Outcome Trends</h2>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Line type="monotone" dataKey="temp" stroke="#f59e0b" name="Anneal Temp (°F)" strokeWidth={2} />
                    <Line type="monotone" dataKey="accuracy" stroke="#10b981" name="Outcome Quality" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {/* Annealing Profile Editor */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs font-bold text-amber-500">◆</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Annealing Cycle Profile Editor</h2>
                <p className="text-stone-400 text-lg">
                  Create custom borosilicate glass heat treatment profiles with interactive 4-stage temperature curves. Design your perfect annealing schedule before firing.
                </p>
              </div>
            </div>
            <AnealingProfileEditor />
          </div>
        </section>

        {/* Add Record Button */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase transition-colors"
            >
              <Plus size={16} /> Add Firing Record
            </button>
          </div>
        </section>

        {/* Add Record Form */}
        {showForm && (
          <section className="border-b border-white/10 py-16">
            <div className="container max-w-6xl">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-6">New Firing Record</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-amber-500 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date || ""}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-amber-500 mb-2">Kiln Model</label>
                    <input
                      type="text"
                      placeholder="e.g., Paragon XL"
                      value={formData.kiln?.model || ""}
                      onChange={(e) => setFormData({ ...formData, kiln: { model: e.target.value, calibration: formData.kiln?.calibration || "" } })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-stone-500"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-amber-500 mb-2">Anneal Temperature (°F)</label>
                    <input
                      type="number"
                      value={formData.schedule?.annealTemp || 1050}
                      onChange={(e) => setFormData({ ...formData, schedule: { annealTemp: parseInt(e.target.value), annealTime: formData.schedule?.annealTime || 2, flameType: formData.schedule?.flameType || "neutral" } })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-amber-500 mb-2">Anneal Time (hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.schedule?.annealTime || 2}
                      onChange={(e) => setFormData({ ...formData, schedule: { annealTemp: formData.schedule?.annealTemp || 1050, annealTime: parseFloat(e.target.value), flameType: formData.schedule?.flameType || "neutral" } })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-amber-500 mb-2">Glass Thickness (inches)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={formData.metadata?.glassThickness || 0.5}
                      onChange={(e) => setFormData({ ...formData, metadata: { glassThickness: parseFloat(e.target.value), formType: formData.metadata?.formType || "solid", strikeMethod: formData.metadata?.strikeMethod || "none" } })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-amber-500 mb-2">Color Accuracy</label>
                    <select
                      value={formData.outcome?.colorAccuracy || "good"}
                      onChange={(e) => setFormData({ ...formData, outcome: { colorAccuracy: e.target.value as "excellent" | "good" | "fair" | "poor", notes: formData.outcome?.notes || "" } })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-mono text-xs font-bold uppercase text-amber-500 mb-2">Notes</label>
                    <textarea
                      value={formData.outcome?.notes || ""}
                      onChange={(e) => setFormData({ ...formData, outcome: { colorAccuracy: formData.outcome?.colorAccuracy || "good", notes: e.target.value } })}
                      placeholder="Observations, issues, successes..."
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-stone-500 h-24"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleAddRecord}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase transition-colors"
                  >
                    Save Record
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-lg border border-white/20 hover:border-amber-500 text-stone-400 hover:text-amber-500 font-mono text-xs font-bold uppercase transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Records List */}
        <section className="py-16">
          <div className="container max-w-6xl">
            <h2 className="text-2xl font-bold text-white mb-8">Firing History</h2>
            {records.length === 0 ? (
              <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
                <Calendar size={32} className="text-stone-500 mx-auto mb-4" />
                <p className="text-stone-400">No firing records yet. Add one to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {records
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record) => (
                    <div key={record.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-1">Date</span>
                          <span className="text-lg font-bold text-white">{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-2 rounded-lg border border-white/20 hover:border-red-500 text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-1">Anneal Temp</span>
                          <span className="text-white">{record.schedule.annealTemp}°F</span>
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-1">Time</span>
                          <span className="text-white">{record.schedule.annealTime}h</span>
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-1">Thickness</span>
                          <span className="text-white">{record.metadata.glassThickness}"</span>
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-1">Outcome</span>
                          <span className="text-white capitalize">{record.outcome.colorAccuracy}</span>
                        </div>
                      </div>
                      {record.outcome.notes && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Notes</span>
                          <p className="text-sm text-stone-300">{record.outcome.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
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
