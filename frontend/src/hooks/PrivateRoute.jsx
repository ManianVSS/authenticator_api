import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const accessToken = window.localStorage.getItem("accessToken");
  return accessToken ? <Outlet /> : <Navigate to="/login" />;
};
