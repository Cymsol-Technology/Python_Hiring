import React from 'react';

export default function CreateVesselDataPopup({
  vessel,
  form,
  setForm,
  onSubmit,
  onClose,
  isLoading,
  isEditMode = false,
   hsCodes = [],
 loadingHSCodes = false,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEditMode ? 'Edit Vessel Data' : 'Add New Vessel Data'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vessel Name
            </label>
            <input
              type="text"
              value={vessel}
              disabled
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hire Rate *
            </label>
            <input
              type="number"
              step="0.01"
              value={form.hire_rate}
              onChange={(e) => setForm({ ...form, hire_rate: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Market Rate *
            </label>
            <input
              type="number"
              step="0.01"
              value={form.market_rate}
              onChange={(e) => setForm({ ...form, market_rate: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HS Code *
            </label>
          {loadingHSCodes ? (
            <div className="p-2 text-gray-500 text-sm">Loading HS Codes...</div>
          ) : (
            <select
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading || loadingHSCodes}
            >
              <option value="">Select HS Code</option>
              {hsCodes.map((code) => (
                <option key={code} value={code}>    {code}   </option>               ))}             </select>           )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border bg-red-500 rounded hover:bg-gray-100"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}