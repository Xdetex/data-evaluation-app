// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/user/login";
import WelcomeBack from "./pages/user/welcome";
import MainLogin from "./pages/common/login";
import AdminDashboard from "./pages/admin/dashboard";
import ExpertDashboard from "./pages/expert/dashboard";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRole: string;
};

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const user = JSON.parse(localStorage.getItem("user") || "null") as {
    role?: string;
  } | null;
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== allowedRole) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLogin />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/welcome" element={<WelcomeBack />} />
        {/* Admin-only route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Expert-only route */}
        <Route
          path="/expert/dashboard"
          element={
            <ProtectedRoute allowedRole="expert">
              <ExpertDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
