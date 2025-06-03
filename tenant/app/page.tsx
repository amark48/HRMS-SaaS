// app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function HomePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [newUserId, setNewUserId] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    // Extract first name and last name from fullName
    const nameParts = formData.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Extract the domain from email.
    const emailParts = formData.email.trim().split('@');
    const domain = emailParts.length > 1 ? emailParts[1] : '';

    // Prepare the payload for registration.
    const payload = {
      firstName,
      lastName,
      company: formData.companyName,
      email: formData.email,
      password: formData.password,
      domain,
      industry: 'other',
      role: 'Admin', // backend determines role via lookup
    };

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Registration successful! OTP sent to your email.");
        // Store the new user's ID for OTP verification and show the OTP modal
        setNewUserId(data.user.id);
        setShowOtpModal(true);
      } else {
        toast.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newUserId) {
      toast.error("User ID not found. Please re-register.");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: newUserId, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "OTP verified successfully!");
        setShowOtpModal(false);
        // Redirect to dashboard or login after OTP verification
        router.push('/dashboard');
      } else {
        toast.error(data.message || "OTP verification failed. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="landing-container">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Enterprise HRMS</h1>
            <p>
              Empower your organization with cutting-edge human resource solutions built
              for modern enterprises.
            </p>
            <div className="hero-cta">
              <Link href="/features">Discover Features</Link>
              <Link href="/contact">Contact Us</Link>
            </div>
          </div>
          <div className="cta-form">
            <div className="form-card">
              <h2>Create Your Account</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Corporate Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </form>
              <p className="login-prompt">
                Already have an account? <Link href="/login">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>OTP Verification</h2>
            <p>Please check your corporate email for the OTP and enter it below:</p>
            <form onSubmit={handleOtpSubmit}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                required
              />
              <button type="submit">Verify OTP</button>
            </form>
            <button className="cancel-btn" onClick={() => setShowOtpModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <ToastContainer />

      <style jsx>{`
        .landing-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f0f2f5;
          overflow-x: hidden;
        }
        a {
          text-decoration: none;
        }
        .hero {
          background: linear-gradient(135deg, #283e4a, #2d5f73);
          color: #fff;
          padding: 3rem 2rem;
        }
        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }
        .hero-text {
          flex: 1;
        }
        .hero-text h1 {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }
        .hero-text p {
          font-size: 1.25rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
        .hero-cta a {
          margin-right: 1rem;
          padding: 0.75rem 1.5rem;
          background-color: #0073e6;
          color: #fff;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        .hero-cta a:hover {
          background-color: #005bb5;
        }
        .cta-form {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        .form-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          color: #333;
        }
        .form-card h2 {
          text-align: center;
          margin-bottom: 1rem;
          color: #283e4a;
        }
        .form-card form {
          display: flex;
          flex-direction: column;
        }
        .form-card form input {
          margin: 0.5rem 0;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        .form-card form button {
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: #0073e6;
          border: none;
          border-radius: 4px;
          color: #fff;
          font-size: 1.125rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .form-card form button:hover {
          background-color: #005bb5;
        }
        .form-card form button:disabled {
          background-color: #005bb5;
          opacity: 0.7;
          cursor: not-allowed;
        }
        .login-prompt {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
        }
        .login-prompt a {
          color: #0073e6;
          font-weight: 500;
        }
        .login-prompt a:hover {
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
          }
          .hero-text h1 {
            font-size: 2.5rem;
          }
          .hero-text p {
            font-size: 1rem;
          }
        }
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-content {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          width: 90%;
          max-width: 400px;
          text-align: center;
        }
        .modal-content input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .modal-content button {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #0073e6;
          border: none;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
        }
        .cancel-btn {
          background-color: #aaa;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
