import React from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import NotificationCenter from "../../components/common/NotificationCenter";
import ToastCenter from "../../components/common/ToastCenter";

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <NotificationCenter />
          <ToastCenter />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default AppProviders;
