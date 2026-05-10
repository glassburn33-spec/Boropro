import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CSVData {
  temperature: number;
  time: number;
}

interface CSVViewerProps {
  fileBase64: string;
  filename: string;
}

export function CSVViewer({ fileBase64, filename }: CSVViewerProps) {
  const parsedData = useMemo(() => {
    try {
      // Decode base64 to string
      const csvString = atob(fileBase64);
      const lines = csvString.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) return { rows: [], chartData: [], temperatures: [], times: [] };
      
      // Parse header to identify columns
      const headers = lines[0].split(',').map(h => h.trim());
      const tempIndex = headers.findIndex(h => h.toLowerCase().includes('temperature'));
      const timeIndex = headers.findIndex(h => h.toLowerCase().includes('time'));
      
      if (tempIndex === -1 || timeIndex === -1) {
        console.error('CSV missing required columns. Headers:', headers);
        return { rows: [], chartData: [], temperatures: [], times: [] };
      }
      
      // Parse data rows
      const rows: CSVData[] = [];
      const chartData: any[] = [];
      const temperatures: number[] = [];
      const times: number[] = [];
      let cumulativeTime = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        const temperature = parseFloat(parts[tempIndex]);
        const time = parseFloat(parts[timeIndex]);
        
        if (!isNaN(temperature)) {
          rows.push({ temperature, time: isNaN(time) ? 0 : time });
          temperatures.push(temperature);
          times.push(isNaN(time) ? 0 : time);
          
          // Build chart data with cumulative time
          chartData.push({
            time: cumulativeTime,
            temperature: temperature,
          });
          
          if (!isNaN(time) && time > 0) {
            cumulativeTime += time;
            // Add endpoint for this segment
            chartData.push({
              time: cumulativeTime,
              temperature: temperature,
            });
          }
        }
      }
      
      return { rows, chartData, temperatures, times };
    } catch (error) {
      console.error('Error parsing CSV:', error);
      return { rows: [], chartData: [], temperatures: [], times: [] };
    }
  }, [fileBase64]);

  if (!fileBase64) {
    return (
      <div className="text-center py-8 text-stone-400">
        No schedule data found in csv file.
      </div>
    );
  }

  if (parsedData.rows.length === 0) {
    return (
      <div className="text-center py-8 text-stone-400">
        No schedule data found in csv file.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-stone-950 rounded-lg">
      {/* Filename Header */}
      <div>
        <h2 className="text-xl font-bold text-amber-400 mb-2">{filename}</h2>
        <p className="text-stone-400 text-sm">Schedule Data Viewer</p>
      </div>

      {/* Temperature Profile Chart - Matching Kiln Log Format */}
      <div>
        <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-4">
          Temperature Profile
        </span>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={parsedData.chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                label={{ value: "Time (hours)", position: "insideBottomRight", offset: -5 }} 
                stroke="rgba(255,255,255,0.5)" 
              />
              <YAxis 
                label={{ value: "Temperature (°F)", angle: -90, position: "insideLeft" }} 
                stroke="rgba(255,255,255,0.5)" 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} 
                labelStyle={{ color: "#fff" }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#d97706" 
                dot={false}
                name="Temperature (°F)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Tables - Matching Kiln Log Format */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Temperatures Table */}
        <div>
          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-3">
            Temperatures (°F)
          </span>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-h-48 overflow-y-auto">
            <div className="space-y-1">
              {parsedData.temperatures.length > 0 ? (
                parsedData.temperatures.map((temp, idx) => (
                  <div key={idx} className="text-sm text-stone-300">
                    {idx + 1}. {temp}°F
                  </div>
                ))
              ) : (
                <p className="text-stone-400">No temperatures recorded</p>
              )}
            </div>
          </div>
        </div>

        {/* Times Table */}
        <div>
          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-3">
            Times (hours)
          </span>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-h-48 overflow-y-auto">
            <div className="space-y-1">
              {parsedData.times.length > 0 ? (
                parsedData.times.map((time, idx) => (
                  <div key={idx} className="text-sm text-stone-300">
                    {idx + 1}. {time} hrs
                  </div>
                ))
              ) : (
                <p className="text-stone-400">No times recorded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Data Table */}
      <div>
        <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-3">
          Schedule Data
        </span>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 text-amber-400">Index</th>
                <th className="text-left py-2 px-3 text-amber-400">Temperature (°F)</th>
                <th className="text-left py-2 px-3 text-amber-400">Time (hours)</th>
              </tr>
            </thead>
            <tbody>
              {parsedData.rows.map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 px-3 text-stone-300">{idx + 1}</td>
                  <td className="py-2 px-3 text-stone-300">{row.temperature}</td>
                  <td className="py-2 px-3 text-stone-300">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
