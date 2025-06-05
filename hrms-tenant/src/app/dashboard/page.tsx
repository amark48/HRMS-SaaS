"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data for charts
const monthlyTrendData = [
  { month: "Jan", employees: 1025, payroll: 50000 },
  { month: "Feb", employees: 1050, payroll: 52000 },
  { month: "Mar", employees: 1075, payroll: 55000 },
  { month: "Apr", employees: 1100, payroll: 57000 },
  { month: "May", employees: 1125, payroll: 60000 },
  { month: "Jun", employees: 1150, payroll: 62000 },
];

const revenueTrendData = [
  { month: "Jan", revenue: 200000 },
  { month: "Feb", revenue: 220000 },
  { month: "Mar", revenue: 240000 },
  { month: "Apr", revenue: 250000 },
  { month: "May", revenue: 260000 },
  { month: "Jun", revenue: 280000 },
];

const employeeDistributionData = [
  { name: "Engineering", value: 500 },
  { name: "Sales", value: 300 },
  { name: "HR", value: 200 },
  { name: "Finance", value: 150 },
  { name: "Support", value: 100 },
];

export default function Dashboard() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Reduce top bar height for a leaner look
  const topBarHeight = "64px";

  // Example user info
  const userAvatar = ""; // when not provided, initials are used
  const userName = "Audu Mark";
  const userInitials = userName.split(" ").map((n) => n[0]).join("");

  // Logo original size – adjust to your actual logo dimensions
  const logoWidth = 200;
  const logoHeight = 50;

  // Handle notification click to show a toast message
  const handleNotificationClick = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      {/* Fixed Top Bar */}
      <header
        className="fixed inset-x-0 top-0 bg-white shadow z-50"
        style={{ height: topBarHeight }}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <Link href="/">
              <div className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="enterprise HRMS"
                  width={logoWidth}
                  height={logoHeight}
                  className="object-contain"
                />
              </div>
            </Link>
            <span className="text-xl font-bold text-gray-800">
              enterprise HRMS
            </span>
          </div>
          {/* Notifications and Profile */}
          <div className="flex items-center space-x-4 relative">
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              {/* Modern filled notification bell icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-700 hover:text-indigo-600 transition"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a9.931 9.931 0 00-7.071 2.929A9.931 9.931 0 002 12c0 2.209.895 4.21 2.343 5.657L4 21l3.343-1.657C8.79 20.105 10.791 21 13 21c3.309 0 6-2.691 6-6V12a9.93 9.93 0 00-2.929-7.071A9.931 9.931 0 0012 2zm0 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1 text-xs font-bold text-white bg-red-500 rounded-full">
                3
              </span>
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full overflow-hidden focus:outline-none flex items-center justify-center bg-indigo-600"
              >
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-lg">
                    {userInitials}
                  </span>
                )}
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                  <ul className="py-1">
                    <li>
                      <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => router.push("/login")}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 rounded hover:bg-gray-100 transition"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <aside
            className="bg-white w-64 h-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 text-center">
              <Link href="/">
                <div className="flex-shrink-0 inline-block">
                  <Image
                    src="/logo.png"
                    alt="enterprise HRMS"
                    width={logoWidth}
                    height={logoHeight}
                    className="object-contain mx-auto"
                  />
                </div>
              </Link>
              <h1 className="mt-4 text-xl font-bold text-gray-800">
                enterprise HRMS
              </h1>
            </div>
            <nav>
              <ul className="space-y-4">
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/dashboard/employees", label: "Employees" },
                  { href: "/dashboard/leave", label: "Leave Management" },
                  { href: "/dashboard/payroll", label: "Payroll" },
                  { href: "/dashboard/analytics", label: "Analytics" },
                  { href: "/dashboard/settings", label: "Settings" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700"
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1 pt-[64px]">
        {/* Desktop Sidebar */}
        <aside
          className="hidden md:block w-64 border-r border-gray-200 bg-white"
          style={{
            position: "sticky",
            top: topBarHeight,
            height: `calc(100vh - ${topBarHeight})`,
          }}
        >
          <nav className="p-6">
            <ul className="space-y-4">
              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/dashboard/employees", label: "Employees" },
                { href: "/dashboard/leave", label: "Leave Management" },
                { href: "/dashboard/payroll", label: "Payroll" },
                { href: "/dashboard/analytics", label: "Analytics" },
                { href: "/dashboard/settings", label: "Settings" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ maxHeight: `calc(100vh - ${topBarHeight})` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Your Dashboard!
              </h3>
              <p className="text-gray-600">
                Manage every aspect of your tenant's HR systems—from employee
                management and payroll to detailed analytics and reporting.
              </p>
            </section>
            {/* KPI Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Total Employees
                </h4>
                <p className="text-3xl font-bold text-indigo-600">1,250</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Payroll Processed
                </h4>
                <p className="text-3xl font-bold text-indigo-600">$750K</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Leaves Approved
                </h4>
                <p className="text-3xl font-bold text-indigo-600">320</p>
              </div>
            </section>
            {/* Analytics Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Employee Distribution Pie Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Employee Distribution
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={employeeDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Monthly Trends Line Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Monthly Trends
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={monthlyTrendData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="employees"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* Revenue Trends Bar Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Revenue Trends
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={revenueTrendData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="#6366F1"
                      barSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
            {/* Recent Notifications */}
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                Recent Notifications
              </h4>
              <ul className="divide-y divide-gray-200">
                <li className="py-3">
                  <p className="text-gray-800">
                    Employee Jane Doe submitted a leave request.
                  </p>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </li>
                <li className="py-3">
                  <p className="text-gray-800">March payroll processed.</p>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </li>
                <li className="py-3">
                  <p className="text-gray-800">
                    New training session scheduled for next week.
                  </p>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Footer */}
          <footer className="bg-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-700">
              &copy; {new Date().getFullYear()} enterprise HRMS. All rights reserved.
            </div>
          </footer>
        </main>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded shadow p-4 z-50 transition-opacity duration-300">
          <p className="text-gray-800">Notification clicked!</p>
        </div>
      )}
    </div>
  );
}
