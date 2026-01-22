// import React from 'react'
// import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'



// export default function VesselChart({ data }) {
//   if (!data || data.length === 0) return <div>No data available</div>

//   // Add a custom tick formatter to show only the date part
//   const formatXAxis = (value) => {
//     // If value contains '-' followed by a number at the end (our index), remove it
//     if (typeof value === 'string' && value.includes('-')) {
//       const parts = value.split('-');
//       // Check if last part is a number (our index)
//       if (parts.length >= 4 && !isNaN(parts[parts.length - 1])) {
//         return parts.slice(0, -1).join('-');
//       }
//     }
//     return value;
//   };

//   return (
//     <div className="bg-white p-4 rounded shadow">
//       <h2 className="font-semibold mb-2">Chart</h2>
//       <ResponsiveContainer width="100%" height={400}>
//         <LineChart data={data}>
//           <XAxis 
//             dataKey="uniqueKey" 
//             tickFormatter={formatXAxis}
//           />
//           <YAxis />
//           <Tooltip 
//             labelFormatter={formatXAxis}
//           />
//           <Legend />
//           <Line type="monotone" dataKey="hire_rate" stroke="#facc15" dot={false} name="Hire Rate" />
//           <Line type="monotone" dataKey="market_rate" stroke="#3b82f6" dot={false} name="Market Rate" />
//           <Line type="monotone" dataKey="code" stroke="#00bfa5" dot={false} name="HS Code" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }







import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  
} from "recharts";

export default function VesselChart({ 
  data, 
  lines = [
    { dataKey: "hire_rate", stroke: "#facc15", name: "Hire Rate" },
    { dataKey: "market_rate", stroke: "#3b82f6", name: "Market Rate" }
  ],
  height = 400,
  title = "",
  isAggregate = false,
}) {

  const xAxisKey = isAggregate ? "date" : "uniqueKey";

  

  if (!data || data.length === 0) {
    return null;
  }

  const formatXAxis = (value) => {
    // If value contains '-' followed by a number at the end (our index), remove it
    if (typeof value === 'string' && value.includes('-')) {
      const parts = value.split('-');
      // Check if last part is a number (our index)
      if (parts.length >= 4 && !isNaN(parts[parts.length - 1])) {
        return parts.slice(0, -1).join('-');
      }
    }
    return value;
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      {title && <h3 className="text-lg mb-2 font-semibold">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <XAxis 
            dataKey={xAxisKey} 
            tickFormatter={formatXAxis}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={formatXAxis}
          />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              name={line.name}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
