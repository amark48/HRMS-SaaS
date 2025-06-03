// app/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    // Basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');

    try {
      // Replace '/api/signup' with your actual endpoint
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push('/onboarding'); // Navigate after a successful signup
      } else {
        const data = await res.json();
        setError(data.error || 'Signup failed, please try again.');
      }
    } catch (err) {
      setError('An error occurred, please try again later.');
    }
  };

  return (
    <div className="signup-page">
      <div className="form-card">
        <h1>Create Your Account</h1>
        {error && <p className="error">{error}</p>}
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
          <button type="submit">Sign Up</button>
        </form>
        <p className="login-link">
          Already have an account?{' '}
          <Link href="/login">Login here</Link>
        </p>
      </div>
      <style jsx>{`
        .signup-page {
          min-height: 80vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #283e4a, #2d5f73);
          padding: 2rem;
          color: #333;
        }
        .form-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 2.5rem;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        h1 {
          margin-bottom: 1.5rem;
          color: #283e4a;
          font-size: 1.75rem;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        input {
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        button {
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          background-color: #0073e6;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #005bb5;
        }
        .error {
          color: #d93025;
          margin-bottom: 0.75rem;
        }
        .login-link {
          margin-top: 1rem;
          font-size: 0.95rem;
        }
        .login-link a {
          color: #0073e6;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
