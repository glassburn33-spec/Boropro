import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CSVData {
  stage: string;
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
      
      if (lines.length < 2) return { rows: [], chartData: [] };
      
      // Skip header row and parse data
      const rows: CSVData[] = [];
      const chartData: any[] = [];
      let cumulativeTime = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const [stage, tempStr, timeStr] = lines[i].split(',').map(s => s.trim());
        const temperature = parseFloat(tempStr);
        const time = timeStr ? parseFloat(timeStr) : 0;
        
        if (!isNaN(temperature)) {
          rows.push({ stage, temperature, time });
          
          // Build chart data with cumulative time
          chartData.push({
            time: cumulativeTime,
            temperature: temperature,
            stage: stage
          });
          
          if (time > 0) {
            cumulativeTime += time;
            chartData.push({
              time: cumulativeTime,
              temperature: temperature,
              stage: stage
            });
          }
        }
      }
      
      return { rows, chartData };
    } catch (error) {
      console.error('Error parsing CSV:', error);
      return { rows: [], chartData: [] };
    }
  }, [fileBase64]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="border-b border-stone-700 pb-4">
        <h3 className="text-lg font-semibold text-amber-400">{filename}</h3>
        <p className="text-sm text-stone-400">Schedule Data Viewer</p>
      </div>

      {/* Chart */}
      {parsedData.chartData.length > 0 && (
        <div className="bg-stone-800 rounded-lg p-4 border border-stone-700">
          <h4 className="text-sm font-semibold text-stone-300 mb-4">Temperature Profile</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={parsedData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis 
                dataKey="time" 
                label={{ value: 'Time (min)', position: 'insideBottomRight', offset: -5 }}
                stroke="#888"
              />
              <YAxis 
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                stroke="#888"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                labelStyle={{ color: '#fbbf24' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#fbbf24" 
                dot={false}
                name="Temperature (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Data Table */}
      {parsedData.rows.length > 0 && (
        <div className="bg-stone-800 rounded-lg p-4 border border-stone-700">
          <h4 className="text-sm font-semibold text-stone-300 mb-4">Schedule Details</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-600">
                  <th className="text-left px-3 py-2 text-amber-400">Stage</th>
                  <th className="text-right px-3 py-2 text-amber-400">Temperature (°C)</th>
                  <th className="text-right px-3 py-2 text-amber-400">Time (min)</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-stone-700 hover:bg-stone-700/50">
                    <td className="px-3 py-2 text-stone-300">{row.stage}</td>
                    <td className="text-right px-3 py-2 text-stone-300">{row.temperature}</td>
                    <td className="text-right px-3 py-2 text-stone-300">{row.time || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {parsedData.rows.length === 0 && (
        <div className="bg-stone-800 rounded-lg p-8 border border-stone-700 text-center">
          <p className="text-stone-400">No schedule data found in CSV file</p>
        </div>
      )}
    </div>
  );
}
