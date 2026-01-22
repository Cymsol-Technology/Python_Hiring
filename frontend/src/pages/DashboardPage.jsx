import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";
import PageLayout from "../components/layout/PageLayout";
import Filters from "../components/dashboardLayout/Filters";
import VesselChart from "../components/dashboardLayout/VesselChart";
import DataTable from "../components/dashboardLayout/DataTable";
import EmptyState from "../components/dashboardLayout/EmptyState";
import TabNavigation from "../components/dashboardLayout/TabNavigation";
import CreateVesselData from "../components/dashboardLayout/CreateVesselData";

import {
  useGetVesselsQuery,
  useGetDataQuery,
  useGetAggregateQuery,
  useCreateDataMutation,
  useUpdateDataMutation,

} from "../features/apiSlice";
import { persistor } from "../app/store";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "aggregate", label: "Aggregate" },
];

const INITIAL_FORM_STATE = {
  date: "",
  hire_rate: "",
  market_rate: "",
  code: "",
};

const ALLOWED_HS_CODES = ["HS1", "HS2", "HS3", "HS4", "HS5", "HS6", "HS7"];

// Form and Process IDs
const FORM_ID = "F_dashboard_001";
const PROCESS_IDS = {
  P_panel_001: "P_panel_001",
  P_panel_002: "P_panel_002",
  P_panel_003: "P_panel_003",
  P_panel_004: "P_panel_004",
  P_panel_005: "P_panel_005",
  P_panel_006: "P_panel_006",
  P_panel_007: "P_panel_007",
  P_panel_008: "P_panel_008",
};

export default function Dashboard() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [activeTab, setActiveTab] = useState("overview");
  const [vessel, setVessel] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [aggStart, setAggStart] = useState("");
  const [aggEnd, setAggEnd] = useState("");
  const [queryParams, setQueryParams] = useState({
    vessel: "",
    start: "",
    end: "",
  });
  const [showChart, setShowChart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const username = useSelector((s) => s.auth.username);
  const role = useSelector((s) => s.auth.role);

  const formIds = useSelector((s) => s.auth.form_ids) || [];
  const processIds = useSelector((s) => s.auth.process_ids) || [];

  const hasAccess = useMemo(() => {
    return (formId, processId) => {
      return formIds.includes(formId) && processIds.includes(processId);
    };
  }, [formIds, processIds]);

  const canAccessFilter = hasAccess(FORM_ID, PROCESS_IDS.P_panel_001);
  const canViewChart = hasAccess(FORM_ID, PROCESS_IDS.P_panel_002);
  const canViewAggregate = hasAccess(FORM_ID, PROCESS_IDS.P_panel_003);
  const canAccessAggregateFilter = hasAccess(
    FORM_ID,
    PROCESS_IDS.P_panel_004
  );
  const canCreateVesselData = hasAccess(
    FORM_ID,
    PROCESS_IDS.P_panel_005
  );
  const canUpdateVesselData = hasAccess(
    FORM_ID,
    PROCESS_IDS.P_panel_006
  );
  const canAccessTabNavigation = hasAccess(FORM_ID, PROCESS_IDS.P_panel_007);
  const canViewTable = hasAccess(FORM_ID, PROCESS_IDS.P_panel_008);

  const isAdmin = role === "admin";

  const { data: vesselsRes } = useGetVesselsQuery();
  const vessels = vesselsRes?.vessels || [];
  const vessel_names = vessels.map((v) => v.vessel_name);
  

  const { data: dataRes } = useGetDataQuery(queryParams, {
    skip: !queryParams.vessel || !queryParams.start || !queryParams.end,
  });

  const chartData = dataRes?.data || [];

  console.log("ChartData", chartData)

  

  const chartDataWithKeys = chartData.map((d) => ({
    ...d,
    uniqueKey: `${d.date}`,
  }));

  const { data: aggregateRes } = useGetAggregateQuery(
    { start: aggStart, end: aggEnd },
    { skip: !canViewAggregate }
  );
  const aggregate = aggregateRes?.data || [];

  console.log("Aggregate Data:", aggregate);

  const [createData, { isLoading: creating }] = useCreateDataMutation();
  const [updateData, { isLoading: updating }] = useUpdateDataMutation();

  useEffect(() => {
    setShowChart(false);
  }, [vessel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [vessel, start, end]);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    if (!canAccessTabNavigation && activeTab === "aggregate") {
      setActiveTab("overview");
    }
  }, [canAccessTabNavigation, activeTab]);

  const getVesselDetails = (vesselName) => {
    const vesselData = vessels.find((v) => v.vessel_name === vesselName);
    return {
       dataId : vesselData?.id || "",
      vessel_code: vesselData?.vessel_code || "",
      imo_no: vesselData?.imo_number || "",
    };
  };

  const getHSCodeDescription = (code) => {
    const codeData = chartData.find((d) => d.code === code);
    return codeData?.description || "";
  };

  const handleLoadData = () => {
    if (vessel && start && end) {
      setQueryParams({ vessel, start, end });
      setShowChart(true);
    } else {
      alert("Please select vessel and date range");
    }
  };

  const handleCreateVesselData = async () => {
    if (!canCreateVesselData) {
      alert("You don't have permission to create vessel data");
      return;
    }

    if (
      !vessel ||
      !form.code ||
      !form.date ||
      !form.hire_rate ||
      !form.market_rate
    ) {
      alert(
        !vessel
          ? "Please select a vessel from the filter first"
          : "Please fill in all fields"
      );
      return;
    }

    if (!ALLOWED_HS_CODES.includes(form.code)) {
      alert("Invalid HS Code! Allowed values: HS1–HS7");
      return;
    }

    try {
      const vesselDetails = getVesselDetails(vessel);
      const hsDescription = getHSCodeDescription(form.code);

      const payload = {
        vessel_name: vessel,
        vessel_code: vesselDetails.vessel_code,
        imo_no: vesselDetails.imo_no,
        date: form.date,
        hire_rate: parseFloat(form.hire_rate),
        market_rate: parseFloat(form.market_rate) * (32 / 38),
        code: form.code,
        description: hsDescription,
      };

      await createData(payload).unwrap();
      setForm(INITIAL_FORM_STATE);
      alert("Data added successfully!");

      if (showChart) {
        handleLoadData();
      }
    } catch (err) {
      console.error("Create failed", err);
      alert("Failed to add data. Please try again.");
    }
  };

  const handleUpdateVesselData = async (dataId) => {

    console.log("dataId", dataId)
    if (!canUpdateVesselData) {
      alert("You don't have permission to update vessel data");
      return;
    }

    if (
      !vessel ||
      !form.code ||
      !form.date ||
      !form.hire_rate ||
      !form.market_rate
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (!ALLOWED_HS_CODES.includes(form.code)) {
      alert("Invalid HS Code! Allowed values: HS1–HS7");
      return;
    }

    try {
      const vesselDetails = getVesselDetails(vessel);
      console.log("Vessel for Update",vesselDetails)
      const hsDescription = getHSCodeDescription(form.code);

      const payload = {
        id: dataId,
        vessel_name: vessel,
        vessel_code: vesselDetails.vessel_code,
        imo_no: vesselDetails.imo_no,
        date: form.date,
        hire_rate: parseFloat(form.hire_rate),
        market_rate: parseFloat(form.market_rate) * (32 / 38),
        code: form.code,
        description: hsDescription,
      };

      await updateData(payload).unwrap();
      setForm(INITIAL_FORM_STATE);
      alert("Data updated successfully!");

      if (showChart) {
        handleLoadData();
      }
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update data. Please try again.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/login");
  };

  const user = { name: username || "User", isAdmin };
  const menuItems = [];

  const vesselChartLines = [
    { dataKey: "hire_rate", stroke: "#facc15", name: "Hire Rate" },
    { dataKey: "market_rate", stroke: "#3b82f6", name: "Market Rate" },
    { dataKey: "code", stroke: "#00bfa5", name: "HS Code" },
  ];

  const aggregateChartLines = [
    { dataKey: "total_hire", stroke: "#facc15", name: "Total Hire" },
    { dataKey: "total_market", stroke: "#3b82f6", name: "Total Market" },
  ];

  return (
    <PageLayout
      navbarTitle={isAdmin ? "Eastmen" : "Dashboard"}
      menuItems={menuItems}
      user={user}
      onLogout={handleLogout}
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: isAdmin ? "Admin" : "Dashboard" },
      ]}
      contentTitle={isAdmin ? "Admin Dashboard" : "Dashboard"}
      defaultSidebarOpen={false}
    >
      {canAccessTabNavigation && (
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={TABS}
        />
      )}

      {(!canAccessTabNavigation || activeTab === "overview") && (
        <div className={!isAdmin ? "min-h-screen bg-gray-100 p-6" : ""}>
          {canAccessFilter && (
            <Filters
              vessels={vessel_names}
              vessel={vessel}
              setVessel={setVessel}
              start={start}
              setStart={setStart}
              end={end}
              setEnd={setEnd}
              loadData={handleLoadData}
            />
          )}

          {canViewChart &&
            showChart &&
            (chartDataWithKeys.length > 0 ? (
              <>
                <VesselChart
                  data={chartDataWithKeys}
                  title="Chart"
                  lines={vesselChartLines}
                  isAggregate={false}
                />

                {canViewTable && (
                  <div className="mt-6">
                    <DataTable
                      data={chartData}
                      currentPage={currentPage}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                      vessel={vessel}
                      start={start}
                      end={end}
                      showChart={showChart}
                      form={form}
                      setForm={setForm}
                      onCreateVessel={handleCreateVesselData}
                      onUpdateVessel={handleUpdateVesselData}
                      isCreating={creating}
                      isUpdating={updating}
                      canCreateVesselData={canCreateVesselData}
                      canUpdateVesselData={canUpdateVesselData}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState vessel={vessel} start={start} end={end} />
            ))}

          {!canAccessFilter && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
              <p className="text-yellow-800">
                You don't have access to view dashboard filters.
              </p>
            </div>
          )}
        </div>
      )}

      {canAccessTabNavigation && activeTab === "aggregate" && (
        <div className="bg-white p-4 rounded shadow mb-6">
          {canViewAggregate ? (
            <>
              <h3 className="text-lg mb-2 font-semibold">Aggregate Chart</h3>

              {canAccessAggregateFilter && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="date"
                    value={aggStart}
                    onChange={(e) => setAggStart(e.target.value)}
                    className="border p-2 rounded"
                  />
                  <input
                    type="date"
                    value={aggEnd}
                    onChange={(e) => setAggEnd(e.target.value)}
                    className="border p-2 rounded"
                  />
                </div>
              )}
              {aggregate.length === 0 ? (
                <div className="text-gray-500 text-center p-4">
                  {aggStart && aggEnd
                    ? "No data available for selected date range"
                    : canAccessAggregateFilter
                    ? "Please select a date range to view aggregate data"
                    : "No data available"}
                </div>
              ) : (
                <VesselChart
                  data={aggregate}
                  title="Aggregate Data"
                  lines={aggregateChartLines}
                  xAxisKey="date"
                  formatXAxis={false}
                  isAggregate={true}
                />
              )}
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
              <p className="text-yellow-800">
                You don't have access to view aggregate data.
              </p>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
