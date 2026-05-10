import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../../pages/landing/LandingPage";
import LoginPage from "../../pages/auth/LoginPage";
import DashboardPage from "../../pages/dashboard/DashboardPage";
import ModelsPage from "../../pages/models/ModelsPage";
import AuditsPage from "../../pages/audits/AuditsPage";
import InterventionsPage from "../../pages/interventions/InterventionsPage";
import ReportsPage from "../../pages/reports/ReportsPage";
import AlertsPage from "../../pages/alerts/AlertsPage";
import SettingsPage from "../../pages/settings/SettingsPage";

import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/models",
    element: (
      <ProtectedRoute>
        <ModelsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/audits",
    element: (
      <ProtectedRoute>
        <AuditsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/interventions",
    element: (
      <ProtectedRoute>
        <InterventionsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/reports",
    element: (
      <ProtectedRoute>
        <ReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/alerts",
    element: (
      <ProtectedRoute>
        <AlertsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
]);
