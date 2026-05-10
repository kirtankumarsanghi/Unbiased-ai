import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-background text-text">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
