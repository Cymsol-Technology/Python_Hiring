
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage"; 
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const token = useSelector((state) => state.auth.token);

  return (
    <Routes>
 
      <Route
        path="/"
        element={
          token ? <Navigate to="/dashboard" /> : <LoginPage />
        }
      />

      {/* Register Page */}
      <Route path="/register" element={<RegisterPage />} />

   
      <Route
        path="/dashboard"
        element={
          token ? <Dashboard /> : <Navigate to="/" />
        }
      />

     
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}


