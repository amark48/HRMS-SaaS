'use client';

import Head from 'next/head';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Enterprise HRMS - Empower Your Enterprise</title>
        <meta
          name="description"
          content="Transform your enterprise with our comprehensive HR management solution that streamlines processes and drives success."
        />
      </Head>
      <div className="dashboard-container">
        <h1>Welcome to Your Dashboard</h1>
        <p>
          Your corporate email has been verified and your workspace is now ready. We’re currently preparing your personalized onboarding
          wizard. Please be patient as we complete the set‑up.
        </p>
        <p>
          When you’re ready, click the button below to start your onboarding process.
        </p>
        <Link href="/dashboard/onboarding">
          {/* Using a span here (instead of an anchor) avoids nested <a> elements if Link already renders one */}
          <span className="btn">Start Onboarding Wizard</span>
        </Link>
      </div>
      <style jsx>{`
        .dashboard-container {
          padding: 2rem;
          text-align: center;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #0a2342;
        }
        p {
          font-size: 1.125rem;
          margin-bottom: 1rem;
          color: #333;
        }
        .btn {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          background-color: #0073e6;
          color: #fff;
          font-size: 1rem;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .btn:hover {
          background-color: #005bb5;
        }
      `}</style>
    </>
  );
}
