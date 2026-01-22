import React from "react";

export default function EmptyState({ vessel, start, end }) {
  return (
    <div className="bg-white p-8 rounded shadow text-center">
      <svg 
        className="mx-auto h-12 w-12 text-gray-400 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
        />
      </svg>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Found</h3>
      <p className="text-gray-500 mb-4">
        No data available for <strong>{vessel}</strong> between <strong>{start}</strong> and <strong>{end}</strong>
      </p>
      <p className="text-sm text-gray-400">
        Try selecting a different date range or vessel
      </p>
    </div>
  );
}