'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HeaderComponent() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Branding */}
        <Link href="/" className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="Enterprise HRMS Logo" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-gray-800">Enterprise HRMS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/features" className="text-gray-700 hover:text-gray-900">
            
          </Link>
          <Link href="/pricing" className="text-gray-700 hover:text-gray-900">
            
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-gray-900">
            
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-gray-900">
            
          </Link>
        </nav>

        {/* Action Buttons for Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center text-gray-800"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow">
          <nav className="px-4 pt-2 pb-4 space-y-2">
          
            <Link href="/pricing" className="block text-gray-700 hover:text-gray-900">
              
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-gray-900">
             
            </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-gray-900">
              
            </Link>
            <div className="mt-2 border-t border-gray-200 pt-2">
              <Link
                href="/login"
                className="block px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
