'use client';

import TopBar from "../components/TopBar";
import { useState } from "react";

export default function Dashboard() {
  const [currentUser] = useState({
    name: "John Doe",
    avatarUrl: "/user-avatar.jpg",
  });

  return (
    <div>
      <TopBar user={currentUser} notificationsCount={3} />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>
        <main className="dashboard-main">
          <p>
            Welcome to your dashboard! This is your workspace where you can manage your
            organization's HR operations, view analytics, and navigate your modules.
          </p>
          <p>More features coming soon...</p>
        </main>
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 1rem;
          font-family: Arial, sans-serif;
        }
        .dashboard-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .dashboard-main {
          text-align: center;
          font-size: 1.2rem;
          color: #333;
        }
      `}</style>
    </div>
  );
}
