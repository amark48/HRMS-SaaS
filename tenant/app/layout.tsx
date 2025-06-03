// app/layout.tsx
import "./globals.css";
import "antd/dist/reset.css"; // Use this for Ant Design v5 styling

import { Providers } from "./providers";
import HeaderComponent from "./components/Header";
// Optional: Create a Footer component or remove the import if not needed.
// import FooterComponent from "./components/Footer";

export const metadata = {
  title: "Enterprise HRMS",
  description: "Empower Your Workforce with our Enterprise HRMS solution",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <HeaderComponent />
          {/* Main content container */}
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          {/* Optional Footer — remove this if you don't have one */}
          {/* <FooterComponent /> */}
        </Providers>
      </body>
    </html>
  );
}
