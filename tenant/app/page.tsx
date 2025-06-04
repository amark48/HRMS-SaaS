'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini (fmr. 'Swaziland')",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

export default function HomePage() {
  const router = useRouter();

  // Registration form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    corporateEmail: '',
    phoneNumber: '',
    country: 'United States',
    employeeCount: '1 - 10'
  });

  // State for OTP modal, OTP input value, and the registered user details
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  // Update form state on input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Registration function: sends data, then shows OTP modal on success
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.corporateEmail.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.companyName.trim()
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    // Extract domain from the email address
    const email = formData.corporateEmail;
    const domain = email.substring(email.lastIndexOf('@') + 1);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.companyName,
      email: formData.corporateEmail,
      phoneNumber: formData.phoneNumber,
      country: formData.country,
      employeeCount: formData.employeeCount,
      domain: domain,
      role: "Admin",
      industry: "other",
      isTenantAdmin: true
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Registration successful!');
        // Save the registered user's details and show the OTP modal  
        setRegisteredUser(data.user);
        setShowOtpModal(true);
      } else {
        toast.error(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  // OTP verification function: submits the OTP and, on success, redirects to the dashboard
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!registeredUser) {
      toast.error('User not found for OTP verification.');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: registeredUser.id, otp: otpValue })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'OTP verified successfully!');
        setShowOtpModal(false);
        toast.info("Please be patient as we complete your onboarding process...");
        router.push("/dashboard");
      } else {
        toast.error(data.message || 'OTP verification failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred during OTP verification.');
    }
  };

  return (
    <>
      <Head>
        <title>Enterprise HRMS - Empower Your Enterprise</title>
        <meta
          name="description"
          content="Transform your enterprise with our comprehensive HR management solution that streamlines processes and drives success."
        />
      </Head>
      <div className="landing-page">
        <div className="hero-card">
          <div className="hero-content">
            {/* Left Column – Enterprise Messaging */}
            <div className="enterprise-info">
              <h1>Empower Your Enterprise</h1>
              <p>
                Revolutionize the way you manage human resources with our state-of-the-art platform engineered for forward-thinking organizations.
                Streamline operations, enhance productivity, and drive sustainable growth.
              </p>
              <div className="cta-buttons">
                <Link href="/features" className="btn btn-primary">
                  Discover Features
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  Talk to Sales
                </Link>
              </div>
            </div>
            {/* Right Column – Registration Form */}
            <div className="signup-form">
              <h2>Start Your Free Trial</h2>
              <p>Experience enterprise-grade HR management today.</p>
              <form onSubmit={handleSubmit}>
                <div className="name-fields">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
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
                  name="corporateEmail"
                  placeholder="Corporate Email"
                  value={formData.corporateEmail}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                <select name="country" value={formData.country} onChange={handleChange} required>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <div className="form-field">
                  <label htmlFor="employeeCount">Employee Count</label>
                  <select
                    id="employeeCount"
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    required
                  >
                    <option value="1 - 10">1 - 10 employees</option>
                    <option value="11 - 50">11 - 50 employees</option>
                    <option value="51 - 100">51 - 100 employees</option>
                    <option value="101 - 500">101 - 500 employees</option>
                    <option value="More than 500">More than 500 employees</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="features-card">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">Employee Onboarding</div>
            <div className="feature-item">Timesheet Management</div>
            <div className="feature-item">Leave Balance</div>
            <div className="feature-item">Employee Chat</div>
            <div className="feature-item">Performance Tracking</div>
            <div className="feature-item">Analytics &amp; Reporting</div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="otp-modal">
            <img src="/images/logo.png" alt="Enterprise HRMS Logo" className="modal-logo" />
            <h2 className="modal-title">OTP Verification</h2>
            <p className="modal-note">We've sent an OTP to your corporate email. Please enter it below to continue.</p>
            <form onSubmit={handleOtpSubmit}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="otp-input"
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">
                  Verify OTP
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowOtpModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />

      <style jsx>{`
        .landing-page {
          background: linear-gradient(to bottom, #ffffff, #e6f7ff);
          min-height: 100vh;
          padding: 2rem;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #333;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 1600px;
          margin-bottom: 3rem;
          overflow: hidden;
          transition: transform 0.5s ease;
        }
        .hero-card:hover {
          transform: translateY(-5px);
        }
        .hero-content {
          display: grid;
          grid-template-columns: 60% 40%;
          min-height: 500px;
        }
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
          }
        }
        .enterprise-info {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: linear-gradient(135deg, #e3edf9, #ffffff);
        }
        .enterprise-info h1 {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          color: #0a2342;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
        }
        .enterprise-info p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          line-height: 1.6;
          color: #333;
        }
        .cta-buttons {
          display: flex;
          gap: 1rem;
        }
        .signup-form {
          padding: 3rem 2rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          border-left: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .signup-form h2 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #0a2342;
        }
        .signup-form p {
          font-size: 1rem;
          margin-bottom: 1.5rem;
          color: #555;
        }
        .signup-form form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .name-fields {
          display: flex;
          gap: 1rem;
        }
        .name-fields input {
          flex: 1;
          padding: 1rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        .signup-form form input,
        .signup-form form select {
          padding: 1rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        .signup-form label {
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 0.25rem;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .btn {
          padding: 1rem 1.75rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
          text-decoration: none;
          text-align: center;
          border: none;
        }
        .btn-primary {
          background-color: #0073e6;
          color: #fff;
        }
        .btn-primary:hover {
          background-color: #005bb5;
        }
        .btn-secondary {
          background-color: transparent;
          border: 2px solid #0073e6;
          color: #0073e6;
        }
        .btn-secondary:hover {
          background-color: rgba(0, 115, 230, 0.1);
        }
        .features-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          width: 100%;
          max-width: 1600px;
          text-align: center;
        }
        .features-card h2 {
          font-size: 2.5rem;
          color: #0a2342;
          margin-bottom: 2rem;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        .feature-item {
          background: #e9ecef;
          padding: 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          color: #0a2342;
        }
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .otp-modal {
          background: linear-gradient(135deg, #ffffff, #f7f7f7);
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          padding: 2rem;
          max-width: 400px;
          width: 90%;
          text-align: center;
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .modal-logo {
          width: 80px;
          margin-bottom: 1rem;
        }
        .modal-title {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: #0a2342;
        }
        .modal-note {
          font-size: 1rem;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .otp-input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1.1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-bottom: 1.5rem;
        }
        .modal-buttons {
          display: flex;
          justify-content: space-between;
        }
        .modal-buttons button {
          flex: 1;
          padding: 0.75rem;
          margin: 0 0.25rem;
        }
      `}</style>
    </>
  );
}
