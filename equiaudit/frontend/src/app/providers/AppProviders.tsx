import React, { useEffect } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { useAuthStore } from "../store/auth.store";
import NotificationCenter from "../../components/common/NotificationCenter";
import ToastCenter from "../../components/common/ToastCenter";

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const { restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <NotificationCenter />
        <ToastCenter />
      </ThemeProvider>
    </QueryProvider>
  );
};

export default AppProviders;
