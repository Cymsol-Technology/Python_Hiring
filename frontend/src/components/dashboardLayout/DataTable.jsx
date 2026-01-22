// import React from 'react';

// export default function DataTable({ 
//   data, 
//   currentPage, 
//   itemsPerPage, 
//   onPageChange,
//   vessel,
//   start,
//   end,
//   showChart
// }) {
//   const totalPages = Math.ceil(data.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedData = data.slice(startIndex, endIndex);

//   return (
//     <div className="bg-white p-4 rounded shadow">
//       <div className="flex justify-between items-center mb-2">
//         <h3 className="text-lg font-semibold">
//           Vessel Data {vessel && `- ${vessel}`}
//           {start && end && ` (${start} to ${end})`}
//         </h3>
//         <div className="text-sm text-gray-600">
//           Total: {data.length} records
//         </div>
//       </div>
      
//       <table className="w-full border">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="p-2">Sr. No.</th>
//             <th className="p-2">Name</th>
//             <th className="p-2">IMO No.</th>
//             <th className="p-2">Date</th>
//             <th className="p-2">Hire rate</th>
//             <th className="p-2">Market rate</th>
//             <th className="p-2">HS Code</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedData.length === 0 ? (
//             <tr>
//               <td colSpan="7" className="text-center p-4 text-gray-500">
//                 {showChart 
//                   ? "No data available for the selected filters" 
//                   : "Please select filters and click 'Load' to view data"}
//               </td>
//             </tr>
//           ) : (
//             paginatedData.map((d, index) => (
//               <tr key={d.id || `${d.date}-${index}`} className="border-b text-center">
//                 <td className="p-2">{startIndex + index + 1}</td>
//                 <td className="p-2">{d.vessel_name}</td>
//                 <td className="p-2">{d.imo_no}</td>
//                 <td className="p-2">{d.date}</td>
//                 <td className="p-2">{d.hire_rate}</td>
//                 <td className="p-2">{d.market_rate}</td>
//                 <td className="p-2">{d.code}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mt-4">
//           <button
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//           >
//             Previous
//           </button>
          
//           <div className="flex gap-1">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => onPageChange(page)}
//                 className={`px-3 py-1 border rounded ${
//                   currentPage === page
//                     ? "bg-blue-600 text-white"
//                     : "hover:bg-gray-100"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
//           </div>

//           <button
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }








import React, { useState } from 'react';
import CreateVesselDataPopup from './CreateVesselDataPopUp';
import { useGetHscodeListQuery } from '../../features/apiSlice';

export default function DataTable({ 
  data, 
  currentPage, 
  itemsPerPage, 
  onPageChange,
  vessel,
  start,
  end,
  showChart,
  form,
  setForm,
  onCreateVessel,
  onUpdateVessel,
  isCreating = false,
  isUpdating = false,
  canCreateVesselData = false,
  canUpdateVesselData = false
}) {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);


const { data: hsCodeRes, isFetching: loadingHSCodes } = useGetHscodeListQuery(undefined, {
   skip: !showCreatePopup && !showEditPopup,
 });


 const hsCodes = hsCodeRes?.hscodes.map(h => h.code) || [];
 console.log("HSCODES",hsCodes)




  const handleEditClick = (rowData) => {
    setEditingData(rowData);
    setForm({
      date: rowData.date,
      hire_rate: rowData.hire_rate,
      market_rate: rowData.market_rate,
      code: rowData.code,
    });
    setShowEditPopup(true);
  };

  const handleCloseEdit = () => {
    setShowEditPopup(false);
    setEditingData(null);
    setForm({
      date: "",
      hire_rate: "",
      market_rate: "",
      code: "",
    });
  };

  const handleCloseCreate = () => {
    setShowCreatePopup(false);
    setForm({
      date: "",
      hire_rate: "",
      market_rate: "",
      code: "",
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          Vessel Data {vessel && `- ${vessel}`}
          {start && end && ` (${start} to ${end})`}
        </h3>
        {canCreateVesselData && (
          <button
            onClick={() => setShowCreatePopup(true)}
            className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 text-xl font-bold"
            title="Add new vessel data"
          >
            +
          </button>
        )}
      </div>
      
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Sr. No.</th>
            <th className="p-2">Name</th>
            <th className="p-2">IMO No.</th>
            <th className="p-2">Date</th>
            <th className="p-2">Hire rate</th>
            <th className="p-2">Market rate</th>
            <th className="p-2">HS Code</th>
            {canUpdateVesselData && <th className="p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={canUpdateVesselData ? "8" : "7"} className="text-center p-4 text-gray-500">
                {showChart 
                  ? "No data available for the selected filters" 
                  : "Please select filters and click 'Load' to view data"}
              </td>
            </tr>
          ) : (
            paginatedData.map((d, index) => (
              <tr key={d.id || `${d.date}-${index}`} className="border-b text-center">
                <td className="p-2">{startIndex + index + 1}</td>
                <td className="p-2">{d.vessel_name}</td>
                <td className="p-2">{d.imo_no}</td>
                <td className="p-2">{d.date}</td>
                <td className="p-2">{d.hire_rate}</td>
                <td className="p-2">{d.market_rate}</td>
                <td className="p-2">{d.code}</td>
                {canUpdateVesselData && (
                  <td className="p-2">
                    <button
                      onClick={() => handleEditClick(d)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      <p className="p-2 text-right text-sm text-gray-600 bg-gray-50">
        Total: {data.length} records
      </p>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Vessel Data Popup */}
      {canCreateVesselData && showCreatePopup && (
        <CreateVesselDataPopup
          vessel={vessel}
          form={form}
          setForm={setForm}
          onSubmit={onCreateVessel}
          onClose={handleCloseCreate}
          isLoading={isCreating}
          isEditMode={false}
         hsCodes={hsCodes}
        loadingHSCodes={loadingHSCodes}
        />
      )}

      {/* Edit Vessel Data Popup */}
      {canUpdateVesselData && showEditPopup && editingData && (
        <CreateVesselDataPopup
          vessel={vessel}
          form={form}
          setForm={setForm}
          onSubmit={() => onUpdateVessel(editingData.id)}
          onClose={handleCloseEdit}
          isLoading={isUpdating}
          isEditMode={true}
           hsCodes={hsCodes}
        loadingHSCodes={loadingHSCodes}
        />
      )}
    </div>
  );
}