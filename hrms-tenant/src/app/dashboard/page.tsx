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

// Sample data for the Monthly Trends line chart
const monthlyTrendData = [
  { month: "Jan", employees: 1025, payroll: 50000 },
  { month: "Feb", employees: 1050, payroll: 52000 },
  { month: "Mar", employees: 1075, payroll: 55000 },
  { month: "Apr", employees: 1100, payroll: 57000 },
  { month: "May", employees: 1125, payroll: 60000 },
  { month: "Jun", employees: 1150, payroll: 62000 },
];

// Sample data for the Revenue Trends bar chart
const revenueTrendData = [
  { month: "Jan", revenue: 200000 },
  { month: "Feb", revenue: 220000 },
  { month: "Mar", revenue: 240000 },
  { month: "Apr", revenue: 250000 },
  { month: "May", revenue: 260000 },
  { month: "Jun", revenue: 280000 },
];

// Sample data for the Employee Distribution (Pie Chart)
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

  // Reduced top bar height
  const topBarHeight = "120px";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed Full-Width Top Bar */}
      <header
        className="fixed inset-x-0 top-0 bg-white shadow z-50"
        style={{ height: topBarHeight }}
      >
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo and Title (Logo remains at its full size) */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="enterprise HRMS"
                width={250}
                height={250}
                className="object-contain"
              />
            </Link>
            <span className="text-2xl font-bold text-gray-800">enterprise HRMS</span>
          </div>
          {/* Right Section: Notification Bell and Profile Dropdown */}
          <div className="flex items-center space-x-4 relative">
            <button className="relative p-2">
              <svg
                className="w-6 h-6 text-gray-600 hover:text-indigo-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5.197M9 17H4l1.405-1.405A2.032 2.032 0 016 14.158V11a6 6 0 019.33-5.197"
                />
              </svg>
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1 text-xs font-bold text-white bg-red-600 rounded-full">
                3
              </span>
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full overflow-hidden focus:outline-none"
              >
                <Image
                  src="/avatar.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
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
            {/* Mobile Hamburger Button */}
            <button className="lg:hidden" onClick={() => setMobileSidebarOpen(true)}>
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Layout beneath the Top Bar */}
      <div className="flex flex-1 pt-[120px]">
        {/* Static Side Menu (Desktop) */}
        <aside
          className="hidden md:block w-64 border-r border-gray-200 bg-white"
          style={{ position: "sticky", top: topBarHeight, height: `calc(100vh - ${topBarHeight})` }}
        >
          <nav className="p-6">
            <ul className="space-y-4">
              <li>
                <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/employees" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700">
                  Employees
                </Link>
              </li>
              <li>
                <Link href="/dashboard/leave" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700">
                  Leave Management
                </Link>
              </li>
              <li>
                <Link href="/dashboard/payroll" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700">
                  Payroll
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex md:hidden"
            onClick={() => set Logo and Title MobileSidebarOpen(false)}
          >
            <aside
              className="bg-white w-64 h-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 text-center">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt="enterprise HRMS"
                    width={250}
                    height={250}
                    priority
                    className="mx-auto"
                  />
                </Link>
                <h1 className="mt-4 text-xl font-bold text-gray-800">enterprise HRMS</h1>
              </div>
              <nav>
                <ul className="space-y-4">
                  <li>
                    <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => setMobileSidebarOpen(false)}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/employees" class(Logo remains at its full size) */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="enterprise HRMS"
                width={250}
                height={250}
                className="object-contain"
              />
            </Link>
            <span className="text-2xl font-bold text-gray-800">enterprise HRMS</span>
          </div>
          {/* Right Section: Notification Bell and Profile Dropdown */}
          <div className="flex items-center space-x-4 relative">
            <button className="relative p-2">
              <svg
                className="w-6 h-6 text-gray-600 hover:text-indigo-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5.197M9 17H4l1.405-1.405A2.032 2.032 0 016 14.158V11a6 6 0 019.33-5.197"
                />
              </svg>
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1 text-xs font-bold text-white bg-red-600 rounded-full">
                3
              </span>
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full overflow-hidden focus:outline-none"
              >
                <Image
                  src="/avatar.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
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
            {/* Mobile Hamburger Button */}
            <button className="lg:hidden" onClick={() => setMobileSidebarOpen(true)}>
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Layout beneath the Top Bar */}
      <div className="flex flex-1 pt-[120px]">
        {/* Static Side Menu (Desktop) */}
        <aside
          className="hidden md:block w-64 border-r border-gray-200 bg-white"
          style={{ position: "sticky", top: topBarHeight, height: `calc(100vh - ${topBarHeight})` }}
        >
          <nav className="p-6">
            <ul className="space-y-4">
              <li>
                <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/employees" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700">
                  Employees
                </Link>
              </li>
              <li>
                <Link href="/dashboard/leave" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700">
                  Leave Management
                </Link>
              </li>
              <li>
                <Link href="/dashboard/payroll" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700">
                  Payroll
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

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
                  <Image
                    src="/logo.png"
                    alt="enterprise HRMS"
                    width={250}
                    height={250}
                    priority
                    className="mx-auto"
                  />
                </Link>
                <h1 className="mt-4 text-xl font-bold text-gray-800">enterprise HRMS</h1>
              </div>
              <nav>
                <ul className="space-y-4">
                  <li>
                    <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => setMobileSidebarOpen(false)}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/employees" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => setMobileName="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => setMobileSidebarOpen(false)}>
                      Employees
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/leave" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => setMobileSidebarOpen(false)}>
                      Leave Management
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/payroll" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => setMobileSidebarOpen(false)}>
                      Payroll
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/analytics" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => setMobileSidebarOpen(false)}>
                      Analytics
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/settings" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => setMobileSidebarOpen(false)}>
                      Settings
                    </Link>
                  </li>
                </ul>
             SidebarOpen(false)}>
                      Employees
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/leave" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => setMobileSidebarOpen(false)}>
                      Leave Management
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/payroll" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => setMobileSidebarOpen(false)}>
                      Payroll
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/analytics" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => setMobileSidebarOpen(false)}>
                      Analytics
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/settings" className="block px-4 py-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => setMobileSidebarOpen(false)}>
                      Settings
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>
          </div>
        )}

 </nav>
            </aside>
          </div>
        )}

        {/* Scrollable Main Content Area */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ maxHeight: `calc(100vh - ${topBarHeight})` }}
        >
          <div className="container mx-auto px-6 py-8">
            {/* Welcome Section */}
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Your Dashboard!
              </h3>
              <p className="text-gray-600">
                Manage all aspects of your tenant’s HR systems—from employee management and payroll to detailed analytics and reporting.
              </p>
            </section>

            {/* KPI Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Employees</h4>
                <p className="text-3xl font-bold text        {/* Scrollable Main Content Area */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ maxHeight: `calc(100vh - ${topBarHeight})` }}
        >
          <div className="container mx-auto px-6 py-8">
            {/* Welcome Section */}
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Your Dashboard!
              </h3>
              <p className="text-gray-600">
                Manage all aspects of your tenant’s HR systems—from employee management and payroll to detailed analytics and reporting.
              </p>
            </section>

            {/* KPI Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Employees</h4>
                <p className="text-3xl font-bold text-indigo-600">1,250</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Payroll Processed</h4>
                <p className="text-3xl font-bold text-indigo-600">$750K</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Leaves Approved</h4>
                <p className="text-3xl font-bold text-indigo-600">320</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Projects</h4>
                <p className="text-3xl font-bold text-indigo-600">45</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Active Contracts</h4>
                <p className="text-3xl font-bold text-indigo-600">1,250</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Payroll Processed</h4>
                <p className="text-3xl font-bold text-indigo-600">$750K</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Leaves Approved</h4>
                <p className="text-3xl font-bold text-indigo-600">320</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Projects</h4>
                <p className="text-3xl font-bold text-indigo-600">45</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Active Contracts</h4>
                <p className="text-3xl font-bold text-indigo-600">12</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Revenue</h4>
                <p className="text-3xl font-bold text-indigo-600">$2.5M</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Satisfaction Rate</h4>
                <p className="text-3xl font-bold text-indigo-600">98%</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <-indigo-600">12</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Revenue</h4>
                <p className="text-3xl font-bold text-indigo-600">$2.5M</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Satisfaction Rate</h4>
                <p className="text-3xl font-bold text-indigo-600">98%</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">New Hires</h4>
                <p className="text-3xl font-bold text-indigo-600">65</p>
              </div>
            </section>

            {/* Analytics Section with Multiple Chart Representations */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Employee Distribution Pie Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Employee Distribution</h4>
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
                </ResponsiveContainerh4 className="text-lg font-semibold text-gray-800 mb-2">New Hires</h4>
                <p className="text-3xl font-bold text-indigo-600">65</p>
              </div>
            </section>

            {/* Analytics Section with Multiple Chart Representations */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Employee Distribution Pie Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Employee Distribution</h4>
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
              </>
              </div>
              {/* Monthly Trends Line Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Monthly Trends</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="employees" stroke="#4F46E5" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* Revenue Trends Bar Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Revenue Trends</h4>
               div>
              {/* Monthly Trends Line Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Monthly Trends</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="employees" stroke="#4F46E5" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* Revenue Trends Bar Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Revenue Trends</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#6366F1" barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Recent Notifications */}
            <section className="bg-white rounded-lg shadow p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Recent Notifications</h4>
              <ul className="divide-y divide-gray-200">
                <li className="py-3">
                  <p className="text-gray-800">Employee Jane Doe submitted a leave request.</p>
                  <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#6366F1" barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Recent Notifications */}
            <section className="bg-white rounded-lg shadow p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Recent Notifications</h4>
              <ul className="divide-y divide-gray-200">
                <li className="py-3">
                  <p className="text-gray-800">Employee Jane Doe submitted a leave request.</p>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </li>
                <li className="py-3">
                  <p className="text-gray-800">March payroll processed.</p>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </li>
                <li className="py-3">
                  <p className="text-gray-800">New training session scheduled for next week.</p>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Footer */}
          <footer className="bg-gray-200">
            <div className="container mx-auto px-6 py-4 text-center text-gray-700">
              © {new Date().getFullYear()} enterprise HRMS. All rights reserved.
            </div>
          </footer>
        </main>
      </ <span className="text-sm text-gray-500">2 hours ago</span>
                </li>
                <li className="py-3">
                  <p className="text-gray-800">March payroll processed.</p>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </li>
                <li className="py-3">
                  <p className="text-gray-800">New training session scheduled for next week.</p>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Footer */}
          <footer className="bg-gray-200">
            <div className="container mx-auto px-6 py-4 text-center text-gray-700">
              © {new Date().getFullYear()} enterprise HRMS. All rights reserved.
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
