// app/otp-verification/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [newUserId, setNewUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedId = localStorage.getItem('newUserId');
    if (storedId) {
      setNewUserId(storedId);
    } else {
      toast.error("User ID not found. Please re-register.");
      router.push("/register");
    }
  }, [router]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newUserId) {
      toast.error("User ID not found. Please re-register.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/verify-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: newUserId, otp }),
        }
      );
      const data = await res.json();
      console.log("OTP verification response:", data); // Debug log
      if (res.ok) {
        toast.success(data.message || "OTP verified successfully!");
        if (data.user && data.user.onboardingCompleted === false) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(data.message || "OTP verification failed. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '2rem auto' }}>
      <h2>OTP Verification</h2>
      <p>Please check your corporate email for the OTP and enter it below.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleOtpChange}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            marginBottom: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: '#0073e6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Verify OTP
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
