import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RBACRoute from "./RBACRoute";

const LandingPage = lazy(
  () => import("../../pages/landing/LandingPage")
);
const LoginPage = lazy(
  () => import("../../pages/auth/LoginPage")
);
const SignupPage = lazy(
  () => import("../../pages/auth/SignupPage")
);
const DashboardPage = lazy(
  () => import("../../pages/dashboard/DashboardPage")
);
const ModelsPage = lazy(
  () => import("../../pages/models/ModelsPage")
);
const AuditsPage = lazy(
  () => import("../../pages/audits/AuditsPage")
);
const InterventionsPage = lazy(
  () => import("../../pages/interventions/InterventionsPage")
);
const ReportsPage = lazy(
  () => import("../../pages/reports/ReportsPage")
);
const AlertsPage = lazy(
  () => import("../../pages/alerts/AlertsPage")
);
const ExplainabilityPage = lazy(
  () => import("../../pages/explainability/ExplainabilityPage")
);
const SettingsPage = lazy(
  () => import("../../pages/settings/SettingsPage")
);
const PublicIntelligencePage = lazy(
  () => import("../../pages/public-intelligence/PublicIntelligencePage")
);

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
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <RBACRoute route="/dashboard">
          <DashboardPage />
        </RBACRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/models",
    element: (
      <ProtectedRoute>
        <RBACRoute route="/dashboard/models">
          <ModelsPage />
        </RBACRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/audits",
    element: (
      <ProtectedRoute>
        <RBACRoute route="/dashboard/audits">
          <AuditsPage />
        </RBACRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/interventions",
    element: (
      <ProtectedRoute>
        <RBACRoute route="/dashboard/interventions">
          <InterventionsPage />
        </RBACRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/reports",
    element: (
      <ProtectedRoute>
        <RBACRoute route="/dashboard/reports">
          <ReportsPage />
        </RBACRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/alerts",
    element: (
      <ProtectedRoute>
        <RBACRoute route="/dashboard/alerts">
          <AlertsPage />
        </RBACRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/explainability",
    element: (
      <ProtectedRoute>
        <RBACRoute route="/dashboard/explainability">
          <ExplainabilityPage />
        </RBACRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/public-intelligence",
    element: (
      <ProtectedRoute>
        <RBACRoute route="/dashboard/public-intelligence">
          <PublicIntelligencePage />
        </RBACRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/settings",
    element: (
      <ProtectedRoute>
        <RBACRoute route="/dashboard/settings">
          <SettingsPage />
        </RBACRoute>
      </ProtectedRoute>
    ),
  },
]);
