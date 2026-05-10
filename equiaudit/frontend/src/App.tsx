import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";

import AppProviders from "./app/providers/AppProviders";
import LoadingScreen from "./components/common/LoadingScreen";
import ErrorBoundary from "./components/common/ErrorBoundary";

import { router } from "./app/router";

export default function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </AppProviders>
  );
}
