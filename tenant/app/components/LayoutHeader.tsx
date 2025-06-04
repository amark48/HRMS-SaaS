// app/components/LayoutHeader.tsx
'use client';

import { usePathname } from "next/navigation";
import HeaderComponent from "./Header"; // Public header with navigation links
import DashboardHeader from "./DashboardHeader"; // Dashboard header (internal)

export default function LayoutHeader() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  return isDashboard ? <DashboardHeader /> : <HeaderComponent />;
}
