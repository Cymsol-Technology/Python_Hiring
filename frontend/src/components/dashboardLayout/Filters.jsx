import React from "react";

export default function Filters({
  vessels,
  vessel,
  setVessel,
  start,
  setStart,
  end,
  setEnd,
  loadData,
}) {
  return (
    <div className="bg-white p-4 rounded shadow mb-6 max-w-3xl">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vessel
          </label>
          <select
            value={vessel}
            onChange={(e) => setVessel(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">-- Select Vessel --</option>
            {vessels.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={loadData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors h-[42px]"
        >
          Load
        </button>
      </div>
    </div>
  );
}