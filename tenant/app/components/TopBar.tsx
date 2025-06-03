import Link from "next/link";
import { FaBell } from "react-icons/fa";

interface TopBarProps {
  user?: {
    name: string;
    avatarUrl?: string;
  };
  notificationsCount?: number;
}

export default function TopBar({ user, notificationsCount = 0 }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        {/* Branding: Logo and name */}
        <Link href="/dashboard" className="brand">
          <img src="/logo.png" alt="Enterprise HRMS Logo" className="brand__logo" />
          <span className="brand__name">Enterprise HRMS</span>
        </Link>
      </div>
      <div className="topbar__center">
        {/* Navigation links */}
        <nav className="topbar__nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      </div>
      <div className="topbar__right">
        {/* Notification bell */}
        <div className="notification">
          <FaBell size={20} />
          {notificationsCount > 0 && (
            <span className="notification__badge">{notificationsCount}</span>
          )}
        </div>
        {/* User Profile */}
        <div className="user-profile">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="user-profile__avatar" />
          ) : (
            <div className="user-profile__avatar user-profile__avatar--placeholder">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <span className="user-profile__name">{user?.name || "User"}</span>
        </div>
      </div>

      <style jsx>{`
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          background: #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .topbar__left {
          display: flex;
          align-items: center;
        }
        .brand {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .brand__logo {
          height: 40px;
          width: 40px;
          object-fit: contain;
          margin-right: 0.5rem;
        }
        .brand__name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #283e4a;
        }
        .topbar__center {
          flex: 1;
          text-align: center;
        }
        .topbar__nav a {
          margin: 0 1rem;
          font-size: 1rem;
          font-weight: 500;
          color: #005bb5;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .topbar__nav a:hover {
          color: #003f7f;
        }
        .topbar__right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .notification {
          position: relative;
          cursor: pointer;
          color: #283e4a;
        }
        .notification__badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ff4757;
          color: #fff;
          border-radius: 50%;
          padding: 2px 6px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .user-profile__avatar {
          height: 36px;
          width: 36px;
          border-radius: 50%;
          object-fit: cover;
        }
        .user-profile__avatar--placeholder {
          background: #0073e6;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 600;
        }
        .user-profile__name {
          font-size: 1rem;
          font-weight: 500;
          color: #283e4a;
        }
      `}</style>
    </header>
  );
}
