// app/components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HeaderComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link href="/">Enterprise HRMS</Link>
        </div>
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <Link href="/features">Features</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <span>&times;</span> : <span>&#9776;</span>}
        </button>
      </div>

      <style jsx>{`
        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #eaeaea;
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo a {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0073e6;
          text-decoration: none;
        }
        nav {
          display: flex;
        }
        nav ul {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        nav ul li a {
          font-size: 1rem;
          color: #333;
          padding: 0.5rem 0;
          position: relative;
          transition: color 0.3s ease;
          text-decoration: none;
        }
        /* Animated underline on hover */
        nav ul li a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 0%;
          height: 2px;
          background: #0073e6;
          transition: width 0.3s ease;
        }
        nav ul li a:hover {
          color: #0073e6;
        }
        nav ul li a:hover::after {
          width: 100%;
        }
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 2rem;
          color: #0073e6;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          nav {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            flex-direction: column;
            align-items: center;
            max-height: ${isMenuOpen ? '300px' : '0'};
            overflow: hidden;
            transition: max-height 0.3s ease-in-out;
          }
          nav ul {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 0;
          }
          .menu-toggle {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}
