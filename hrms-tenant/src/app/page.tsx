"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";

export default function Home() {
  // Router for redirection:
  const router = useRouter();

  // Mobile navigation state:
  const [menuOpen, setMenuOpen] = useState(false);

  // OTP modal state:
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");

  // Clear OTP whenever the modal is shown.
  useEffect(() => {
    if (showOTPModal) {
      setOtp("");
    }
  }, [showOTPModal]);

  // State to store user id from registration response:
  const [userId, setUserId] = useState("");

  // Form state:
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Refs for sequential error focusing
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const employeeCountRef = useRef<HTMLSelectElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  // Set API endpoint:
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Basic email validation:
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!company.trim()) newErrors.company = "Company name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!employeeCount.trim())
      newErrors.employeeCount = "Employee count is required";
    if (!country.trim()) newErrors.country = "Country is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";

    setErrors(newErrors);

    // Sequentially focus on the first error field:
    const order: [string, React.RefObject<HTMLInputElement | HTMLSelectElement>][] = [
      ["firstName", firstNameRef],
      ["lastName", lastNameRef],
      ["company", companyRef],
      ["email", emailRef],
      ["employeeCount", employeeCountRef],
      ["country", countryRef],
      ["phone", phoneRef],
    ];
    for (const [field, ref] of order) {
      if (newErrors[field] && ref.current) {
        ref.current.focus();
        break;
      }
    }

    if (Object.keys(newErrors).length === 0) {
      // Extract the domain from the email:
      const domain = email.split("@")[1];

      // Prepare payload with additional fields:
      const payload = {
        firstName,
        lastName,
        company,
        email,
        employeeCount,
        country,
        phoneNumber: phone,
        domain,
        industry: "others",
        isTenantAdmin: true,
        role: "Admin",
      };

      try {
        const response = await fetch(`${API_URL}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const data = await response.json();
          setUserId(data.user.id);
          toast.success("Thank you for signing up! Please verify OTP.", {
            duration: 5000,
            style: {
              border: "1px solid #4F46E5",
              padding: "16px",
              color: "#4F46E5",
            },
          });
          // Show OTP modal without resetting form values
          setShowOTPModal(true);
        } else {
          const errorMessage = await response.text();
          toast.error(`Submission failed: ${errorMessage}`, {
            duration: 5000,
            style: {
              border: "1px solid #DC2626",
              padding: "16px",
              color: "#DC2626",
            },
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Submission failed. Please try again later.", {
          duration: 5000,
          style: {
            border: "1px solid #DC2626",
            padding: "16px",
            color: "#DC2626",
          },
        });
      }
    }
  };

  // Handler for verifying the OTP:
  const handleOTPVerify = async () => {
    try {
      const response = await fetch(`${API_URL}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send userId and otp:
        body: JSON.stringify({ userId, otp }),
      });
      if (response.ok) {
        toast.success("OTP verified successfully!", {
          duration: 3000,
          style: {
            border: "1px solid #4F46E5",
            padding: "16px",
            color: "#4F46E5",
          },
        });
        setShowOTPModal(false);
        // Redirect to the dashboard after a brief delay:
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        const errMsg = await response.text();
        toast.error(`OTP verification failed: ${errMsg}`, {
          duration: 5000,
          style: {
            border: "1px solid #DC2626",
            padding: "16px",
            color: "#DC2626",
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("OTP verification failed. Please try again.", {
        duration: 5000,
        style: {
          border: "1px solid #DC2626",
          padding: "16px",
          color: "#DC2626",
        },
      });
    }
  };

  // Helper for input styling with dynamic validation:
  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-md border transition duration-200 ${
      touched[field]
        ? errors[field]
          ? "border-red-500 focus:ring-2 focus:ring-red-200"
          : "border-green-300 focus:ring-2 focus:ring-green-200"
        : "border-gray-300 focus:ring-2 focus:ring-blue-200"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* HEADER */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Clickable Logo & Branding */}
          <a href="/" className="flex items-center">
            <div className="relative mr-6">
              <Image src="/logo.png" alt="enterprise HRMS" width={200} height={200} priority />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">enterprise HRMS</h1>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-lg">
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Solutions
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Pricing
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Contact
            </a>
          </nav>

          <div className="hidden md:block">
            <button className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition">
              Sign In
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 focus:outline-none" aria-label="Toggle menu">
              {menuOpen ? (
                <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white shadow">
            <ul className="px-6 py-4 space-y-4">
              <li>
                <a href="#" className="block text-gray-700 hover:text-indigo-600">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="block text-gray-700 hover:text-indigo-600">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="block text-gray-700 hover:text-indigo-600">
                  Solutions
                </a>
              </li>
              <li>
                <a href="#" className="block text-gray-700 hover:text-indigo-600">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="block text-gray-700 hover:text-indigo-600">
                  Contact
                </a>
              </li>
              <li>
                <button className="w-full px-4 py-2 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition">
                  Sign In
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* HERO & SIGN-UP */}
      <main className="flex-grow container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-8">
        {/* Hero Text Section */}
        <div className="flex-1">
          <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6">
            Modern. Powerful. HR.
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-xl leading-relaxed">
            Our enterprise HRMS provides a seamless experience for managing your workforce. Empower your business with smart, agile HR solutions.
          </p>
          <a
            href="#features"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition transform hover:scale-105"
          >
            Explore Our Solution
          </a>
        </div>

        {/* Sign-Up Form Card – Nudged upward */}
        <div id="signup" className="flex-1 w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 -mt-10">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up Now</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First & Last Name */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  ref={firstNameRef}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  placeholder="First Name"
                  className={inputClass("firstName")}
                />
                {touched.firstName && errors.firstName && (
                  <div className="mt-1 flex items-center text-sm text-red-500 transition-all">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                    </svg>
                    <span>{errors.firstName}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={lastNameRef}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  placeholder="Last Name"
                  className={inputClass("lastName")}
                />
                {touched.lastName && errors.lastName && (
                  <div className="mt-1 flex items-center text-sm text-red-500 transition-all">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                    </svg>
                    <span>{errors.lastName}</span>
                  </div>
                )}
              </div>
            </div>
            {/* Company / Corporate Name */}
            <div>
              <input
                ref={companyRef}
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                onBlur={() => handleBlur("company")}
                placeholder="Company / Corporate Name"
                className={inputClass("company")}
              />
              {touched.company && errors.company && (
                <div className="mt-1 flex items-center text-sm text-red-500 transition-all">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                  </svg>
                  <span>{errors.company}</span>
                </div>
              )}
            </div>
            {/* Corporate Email */}
            <div>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="Corporate Email"
                className={inputClass("email")}
              />
              {touched.email && errors.email && (
                <div className="mt-1 flex items-center text-sm text-red-500 transition-all">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                  </svg>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>
            {/* Employee Count */}
            <div>
              <select
                ref={employeeCountRef}
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                onBlur={() => handleBlur("employeeCount")}
                className={inputClass("employeeCount")}
              >
                <option value="" disabled>
                  Select Employee Count
                </option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="500+">500+</option>
              </select>
              {touched.employeeCount && errors.employeeCount && (
                <div className="mt-1 flex items-center text-sm text-red-500 transition-all">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                  </svg>
                  <span>{errors.employeeCount}</span>
                </div>
              )}
            </div>
            {/* Country Dropdown */}
            <div>
              <select
                ref={countryRef}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                onBlur={() => handleBlur("country")}
                className={inputClass("country")}
              >
                <option value="" disabled>
                  Select Country
                </option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
              </select>
              {touched.country && errors.country && (
                <div className="mt-1 flex items-center text-sm text-red-500 transition-all">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                  </svg>
                  <span>{errors.country}</span>
                </div>
              )}
            </div>
            {/* Phone Number */}
            <div>
              <input
                ref={phoneRef}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="Phone Number"
                className={inputClass("phone")}
              />
              {touched.phone && errors.phone && (
                <div className="mt-1 flex items-center text-sm text-red-500 transition-all">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                  </svg>
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold text-lg transition transform hover:scale-105"
            >
              Get Started
            </button>
          </form>
        </div>
      </main>

      {/* OTP Verification Modal (Popup in the Middle, without blacking out the page) */}
      {showOTPModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm">
            <h2 className="text-2xl font-semibold mb-4 text-center">Verify OTP</h2>
            <p className="text-gray-600 text-center mb-4">
              Please enter the one-time password sent to your email.
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setShowOTPModal(false)} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleOTPVerify} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-gray-100">
        <div className="container mx-auto px-6 py-4 text-center text-gray-600">
          © {new Date().getFullYear()} enterprise HRMS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
