import React from "react";
import { useApp } from "../context/AppContext";
import { AdminAuthGate } from "../components/AdminAuthGate";
import { AdminDashboard } from "./AdminDashboard";

export const AdminView = () => {
  const { isAdminAuthenticated } = useApp();

  if (!isAdminAuthenticated) {
    return <AdminAuthGate />;
  }

  return <AdminDashboard />;
};

export default AdminView;
