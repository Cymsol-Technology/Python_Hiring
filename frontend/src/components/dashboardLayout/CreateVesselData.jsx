import React from 'react';

const ALLOWED_HS_CODES = ["HS1", "HS2", "HS3", "HS4", "HS5", "HS6", "HS7"];

export default function CreateVesselData({ 
  vessel,
  form,
  setForm,
  onSubmit,
  isLoading = false
}) {
  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Add Vessel Data</h3>
      {vessel ? (
        <div className="mb-2 text-sm text-gray-600">
          Adding data for: <strong>{vessel}</strong>
        </div>
      ) : (
        <div className="mb-2 text-sm text-red-600">
          Please select a vessel from the filter above
        </div>
      )}
      <div className="grid grid-cols-5 gap-2">
        <input
          type="date"
          value={form.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Hire Rate"
          value={form.hire_rate}
          onChange={(e) => handleInputChange('hire_rate', e.target.value ? parseInt(e.target.value) : '')}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Market Rate"
          value={form.market_rate}
          onChange={(e) => handleInputChange('market_rate', e.target.value ? parseInt(e.target.value) : '')}
          className="border p-2 rounded"
        />
        <input
          placeholder="HS Code (HS1-HS7)"
          value={form.code}
          onChange={(e) => handleInputChange('code', e.target.value)}
          className="border p-2 rounded"
          list="hs-codes"
        />
        <datalist id="hs-codes">
          {ALLOWED_HS_CODES.map(code => (
            <option key={code} value={code} />
          ))}
        </datalist>
        <button
          onClick={onSubmit}
          className="bg-green-600 text-white px-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoading || !vessel}
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}