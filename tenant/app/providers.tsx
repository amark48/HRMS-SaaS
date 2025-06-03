// app/providers.tsx
"use client";

import { ConfigProvider } from "antd";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Global tokens
          colorPrimary: "#1D39C4", // Enterprise primary blue
          colorText: "#333333",
          colorBgBase: "#f7f8fa", // Light background for body
          fontFamily: "'Segoe UI', 'Roboto', sans-serif",
          borderRadius: 8,
          controlOutline: "#1D39C4",
        },
        components: {
          // Layout-specific tokens
          Layout: {
            colorBgHeader: "#001529", // Dark header background
          },
          // Menu-specific tokens
          Menu: {
            // The new Menu uses an items array for items,
            // but these tokens help refine its visuals.
            colorItemBg: "#ffffff",
            colorItemBgSelected: "#e6f7ff",
            itemTextColor: "#333333",
            itemTextColorSelected: "#1D39C4",
          },
          // Button style overrides
          Button: {
            controlHeight: 46,
            fontSize: 16,
          },
          // Card tokens for a polished look in feature/demo sections
          Card: {
            colorBgContainer: "#ffffff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: 8,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}