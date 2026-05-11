/*
Kiln Log Page - Track and manage actual kiln runs
Persistent database storage for complete history
*/

import { useState } from "react";
import { Plus, Trash2, Download, Clock, Thermometer, Save } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { generateKilnLogPDF, pdfToBase64 } from "@/lib/pdfUtils";
import type { KilnLogPDFData } from "@/lib/pdfUtils";
import { SaveScheduleModal } from "@/components/SaveScheduleModal";

interface KilnLogEntry {
  id: number;
  name: string;
  description?: string;
  temperatures: number[];
  times: number[];
  startTime: Date;
  endTime?: Date;
  notes?: string;
  createdAt: Date;
}

export default function KilnLog() {
  const [showForm, setShowForm] = useState(false);
  const [selectedLog, setSelectedLog] = useState<KilnLogEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "recent" | "oldest">("all");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedKilnLog, setSavedKilnLog] = useState<KilnLogEntry | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    temperatures: "1050, 1100, 1150, 1100, 950",
    times: "0, 1, 2, 3, 4",
    startTime: new Date().toISOString().slice(0, 16),
    endTime: "",
    notes: "",
  });

  // Fetch kiln logs from backend
  const { data: logs = [], refetch, isLoading } = trpc.kilnLog.list.useQuery();
  const createMutation = trpc.kilnLog.create.useMutation();
  const deleteMutation = trpc.kilnLog.delete.useMutation();
  const saveGeneratedMutation = trpc.pdfLibrary.saveGenerated.useMutation();

  // Convert database records to display format
  let displayLogs: KilnLogEntry[] = logs.map((log: any) => ({
    id: log.id,
    name: log.name,
    description: log.description,
    temperatures: JSON.parse(log.temperatures),
    times: JSON.parse(log.times),
    startTime: new Date(log.startTime),
    endTime: log.endTime ? new Date(log.endTime) : undefined,
    notes: log.notes,
    createdAt: new Date(log.createdAt),
  }));

  // Apply search filter
  if (searchQuery.trim()) {
    displayLogs = displayLogs.filter(
      (log) =>
        log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply sort filter
  if (filterBy === "recent") {
    displayLogs = [...displayLogs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (filterBy === "oldest") {
    displayLogs = [...displayLogs].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const temps = formData.temperatures
        .split(",")
        .map((t) => parseFloat(t.trim()))
        .filter((t) => !isNaN(t));
      const times = formData.times
        .split(",")
        .map((t) => parseFloat(t.trim()))
        .filter((t) => !isNaN(t));

      if (temps.length === 0 || times.length === 0) {
        toast.error("Please enter valid temperatures and times");
        return;
      }

      const result = await createMutation.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        temperatures: temps,
        times: times,
        startTime: new Date(formData.startTime),
        endTime: formData.endTime ? new Date(formData.endTime) : undefined,
        notes: formData.notes || undefined,
      });

      // Show save modal with the newly created log
      if (result) {
        setSavedKilnLog({
          id: result.id,
          name: result.name,
          description: result.description || undefined,
          temperatures: Array.isArray(result.temperatures) ? result.temperatures : [],
          times: Array.isArray(result.times) ? result.times : [],
          startTime: new Date(result.startTime),
          endTime: result.endTime ? new Date(result.endTime) : undefined,
          notes: result.notes || undefined,
          createdAt: new Date(result.createdAt),
        });
        setShowSaveModal(true);
      }

      toast.success("Kiln log created successfully!");
      setFormData({
        name: "",
        description: "",
        temperatures: "",
        times: "",
        startTime: new Date().toISOString().slice(0, 16),
        endTime: "",
        notes: "",
      });
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error("Failed to create kiln log:", error);
      toast.error("Failed to create kiln log");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this kiln log? This action cannot be undone.');
    if (!confirmed) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Kiln log deleted successfully!");
      if (selectedLog?.id === id) {
        setSelectedLog(null);
      }
      refetch();
    } catch (error) {
      console.error("Failed to delete kiln log:", error);
      toast.error("Failed to delete kiln log");
    }
  };

  const handleExportCSV = () => {
    if (!selectedLog) return;

    const headers = ["Temperature (°F)", "Time (hours)"];
    const rows: string[][] = [];

    const maxLength = Math.max(selectedLog.temperatures.length, selectedLog.times.length);

    for (let i = 0; i < maxLength; i++) {
      const temp = selectedLog.temperatures[i] ?? "";
      const time = selectedLog.times[i] ?? "";
      rows.push([temp.toString(), time.toString()]);
    }

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedLog.name}_log.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exported successfully!");
  };


  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="border-b border-white/10 bg-stone-900/50 backdrop-blur-sm">
        <div className="container max-w-6xl py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">BoroPro</h1>
            <p className="text-xs text-stone-400 font-mono uppercase tracking-widest">Kiln Log</p>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="/"
              className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors"
            >
              Home
            </a>
            <a
              href="/calculator"
              className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors"
            >
              Calculator
            </a>
            <a
              href="/logs"
              className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors"
            >
              Log Library
            </a>
            <a
              href="/firing-tracker"
              className="text-xs uppercase tracking-wider text-amber-500"
            >
              Kiln Log
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <div className="mb-5 flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">
                Tracking tool
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-6">
              Kiln Run History
            </h1>
            <p className="text-lg leading-8 text-stone-300 max-w-3xl">
              Log your kiln runs with temperature and time data. Build a complete history of your annealing schedules. All data persists in your account - access it anytime you log in.
            </p>
          </div>
        </section>

        {/* New Log Button */}
        <section className="border-b border-white/10 py-8">
          <div className="container max-w-6xl flex justify-end">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              New Log Entry
            </button>
          </div>
        </section>

        {/* Entry Form */}
        {showForm && (
          <section className="border-b border-white/10 py-16">
            <div className="container max-w-6xl">
              <h2 className="text-2xl font-bold text-white mb-8">Create New Kiln Log</h2>
              <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-amber-500 mb-2">
                      Log Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Borosilicate Annealing Run 1"
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-amber-500 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g., 2mm solid boro pieces"
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-amber-500 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-amber-500 mb-2">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-amber-500 mb-2">
                      Temperatures (°F) - Comma separated *
                    </label>
                    <textarea
                      value={formData.temperatures}
                      onChange={(e) => setFormData({ ...formData, temperatures: e.target.value })}
                      placeholder="e.g., 1050, 1100, 1150, 1100, 950"
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none min-h-24"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-amber-500 mb-2">
                      Times (hours) - Comma separated *
                    </label>
                    <textarea
                      value={formData.times}
                      onChange={(e) => setFormData({ ...formData, times: e.target.value })}
                      placeholder="e.g., 0, 1, 2, 3, 4"
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none min-h-24"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-amber-500 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any observations or notes about this kiln run..."
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none min-h-24"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 text-white font-mono text-xs font-bold uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase transition-colors"
                  >
                    Save Log
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Logs List */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Your Kiln Logs</h2>
              <div className="text-sm text-stone-400">
                {displayLogs.length} {displayLogs.length === 1 ? "log" : "logs"}
              </div>
            </div>

            {/* Search and Filter Controls */}
            {logs.length > 0 && (
              <div className="mb-8 space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search by name, description, or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFilterBy("all")}
                    className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-colors ${
                      filterBy === "all"
                        ? "bg-amber-600 text-white"
                        : "border border-white/20 text-stone-400 hover:border-amber-500"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterBy("recent")}
                    className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-colors ${
                      filterBy === "recent"
                        ? "bg-amber-600 text-white"
                        : "border border-white/20 text-stone-400 hover:border-amber-500"
                    }`}
                  >
                    Recent
                  </button>
                  <button
                    onClick={() => setFilterBy("oldest")}
                    className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-colors ${
                      filterBy === "oldest"
                        ? "bg-amber-600 text-white"
                        : "border border-white/20 text-stone-400 hover:border-amber-500"
                    }`}
                  >
                    Oldest
                  </button>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
                <p className="text-stone-400">Loading your logs...</p>
              </div>
            ) : displayLogs.length === 0 ? (
              <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
                <Clock size={32} className="text-stone-500 mx-auto mb-4" />
                <p className="text-stone-400">No kiln logs yet. Create your first log entry!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {displayLogs.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`rounded-2xl border p-6 backdrop-blur-sm text-left transition-all ${
                      selectedLog?.id === log.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-white/10 bg-white/5 hover:border-amber-500/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Thermometer size={20} className="text-amber-500" />
                        <div>
                          <p className="font-mono text-xs font-bold uppercase text-amber-500">
                            Kiln Run
                          </p>
                          <p className="font-bold text-white truncate">{log.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSavedKilnLog(log);
                            setShowSaveModal(true);
                          }}
                          className="p-2 rounded-lg border border-white/20 hover:border-green-500 text-stone-400 hover:text-green-500 transition-colors"
                          title="Save this kiln log as a file"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            try {
                              const logData = {
                                id: Date.now().toString(),
                                name: log.name,
                                timestamp: log.timestamp,
                                data: log,
                                createdAt: new Date().toISOString(),
                              };
                              const existingLogs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
                              existingLogs.push(logData);
                              localStorage.setItem('kilnLogs', JSON.stringify(existingLogs));
                              window.dispatchEvent(new CustomEvent('logsUpdated', { detail: existingLogs }));
                              toast.success('Log saved to localStorage');
                            } catch (error) {
                              console.error('Error saving log:', error);
                              toast.error('Failed to save log');
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
                          title="Save to Logs section"
                        >
                          <Download className="w-4 h-4" />
                          Save Log
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(log.id);
                          }}
                          className="p-2 rounded-lg border border-white/20 hover:border-red-500 text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-1">
                          Started
                        </span>
                        <span className="text-stone-300">
                          {log.startTime.toLocaleDateString()} {log.startTime.toLocaleTimeString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-1">
                          Data Points
                        </span>
                        <span className="text-stone-300">
                          {log.temperatures.length} temps, {log.times.length} times
                        </span>
                      </div>
                      {log.description && (
                        <div>
                          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-1">
                            Description
                          </span>
                          <span className="text-stone-300 truncate">{log.description}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Selected Log Details */}
        {selectedLog && (
          <section className="border-b border-white/10 py-16">
            <div className="container max-w-6xl">
              <h2 className="text-2xl font-bold text-white mb-8">Log Details</h2>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="mb-6">
                  <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">
                    Name
                  </span>
                  <p className="text-lg text-white font-bold">{selectedLog.name}</p>
                </div>

                {selectedLog.description && (
                  <div className="mb-6">
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">
                      Description
                    </span>
                    <p className="text-stone-300">{selectedLog.description}</p>
                  </div>
                )}

                {/* Temperature Chart */}
                {selectedLog.temperatures.length > 0 && (
                  <div className="mb-8">
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-4">
                      Temperature Profile
                    </span>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          data={selectedLog.temperatures.map((temp, idx) => ({
                            time: selectedLog.times[idx] || idx,
                            temperature: temp,
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="time" label={{ value: "Time (hours)", position: "insideBottomRight", offset: -5 }} stroke="rgba(255,255,255,0.5)" />
                          <YAxis label={{ value: "Temperature (°F)", angle: -90, position: "insideLeft" }} stroke="rgba(255,255,255,0.5)" />
                          <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} labelStyle={{ color: "#fff" }} />
                          <Line type="monotone" dataKey="temperature" stroke="#d97706" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Data Tables */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-3">
                      Temperatures (°F)
                    </span>
                    {selectedLog.temperatures.length > 0 ? (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-h-48 overflow-y-auto">
                        <div className="space-y-1">
                          {selectedLog.temperatures.map((temp, idx) => (
                            <div key={idx} className="text-sm text-stone-300">
                              {idx + 1}. {temp}°F
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-stone-400">No temperatures recorded</p>
                    )}
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-3">
                      Times (hours)
                    </span>
                    {selectedLog.times.length > 0 ? (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-h-48 overflow-y-auto">
                        <div className="space-y-1">
                          {selectedLog.times.map((time, idx) => (
                            <div key={idx} className="text-sm text-stone-300">
                              {idx + 1}. {time}h
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-stone-400">No times recorded</p>
                    )}
                  </div>
                </div>

                {selectedLog.notes && (
                  <div className="mb-8">
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">
                      Notes
                    </span>
                    <p className="text-stone-300 whitespace-pre-wrap">{selectedLog.notes}</p>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">

                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Save Schedule Modal */}
        {savedKilnLog && (
          <SaveScheduleModal
            isOpen={showSaveModal}
            kilnLog={savedKilnLog}
            onClose={() => setShowSaveModal(false)}
            onAddToLibrary={async (base64, filename) => {
              await saveGeneratedMutation.mutateAsync({
                filename,
                fileBase64: base64,
                temperatures: savedKilnLog.temperatures,
                times: savedKilnLog.times,
              });
            }}
            isAddingToLibrary={saveGeneratedMutation.isPending}
          />
        )}
      </main>
    </div>
  );
}
