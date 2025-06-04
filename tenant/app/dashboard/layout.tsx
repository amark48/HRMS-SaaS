// app/dashboard/layout.tsx
'use client';

import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-layout">
      <main>{children}</main>
      <style jsx>{`
        .dashboard-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        main {
          flex: 1;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}
