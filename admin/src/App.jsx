import React from "react";
import { useAdmin } from "./context/AdminContext";
import { AdminAuthGate } from "./components/AdminAuthGate";
import { AdminDashboard } from "./views/AdminDashboard";

export const App = () => {
  const { isAdminAuthenticated } = useAdmin();

  if (!isAdminAuthenticated) {
    return <AdminAuthGate />;
  }

  return <AdminDashboard />;
};

export default App;
