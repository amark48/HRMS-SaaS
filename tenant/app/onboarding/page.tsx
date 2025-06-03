'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import "react-toastify/dist/ReactToastify.css";

type OnboardingData = {
  systemSettings: {
    companyName: string;
    companyWebsite: string;
    billingInfo: string;
  };
  logo: File | null;
  theme: string;
  additionalAdmins: string[]; // List of email addresses
};

const ONBOARDING_STORAGE_KEY = "onboardingProgress";

export default function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    systemSettings: {
      companyName: "",
      companyWebsite: "",
      billingInfo: "",
    },
    logo: null,
    theme: "default",
    additionalAdmins: [],
  });
  const [tempAdminEmail, setTempAdminEmail] = useState("");
  const [logoPreview, setLogoPreview] = useState<string>("");

  // On mount, restore saved progress and prepopulate with signup data if available.
  useEffect(() => {
    const savedProgress = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        if (parsed) {
          setCurrentStep(parsed.currentStep || 0);
          setOnboardingData(parsed.onboardingData || onboardingData);
          toast.info("Saved progress restored.");
        }
      } catch (error) {
        console.error("Failed to parse saved progress:", error);
      }
    } else {
      // Optionally, load signup data from localStorage. Adjust key as needed.
      const signupData = localStorage.getItem("signupData");
      if (signupData) {
        try {
          const parsedSignup = JSON.parse(signupData);
          setOnboardingData((prev) => ({
            ...prev,
            systemSettings: {
              ...prev.systemSettings,
              companyName: parsedSignup.companyName || "",
              companyWebsite: parsedSignup.domain
                ? `https://www.${parsedSignup.domain}`
                : "",
            },
          }));
        } catch (error) {
          console.error("Failed to parse signup data:", error);
        }
      }
    }
  }, []);

  // When a new logo is selected, update the preview URL.
  useEffect(() => {
    if (onboardingData.logo) {
      const previewUrl = URL.createObjectURL(onboardingData.logo);
      setLogoPreview(previewUrl);

      // Cleanup the generated URL when the component unmounts or when a new file is set.
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setLogoPreview("");
    }
  }, [onboardingData.logo]);

  // Validate on Step 0.
  const validateCurrentStep = (): boolean => {
    if (currentStep === 0) {
      if (!onboardingData.systemSettings.companyName.trim()) {
        toast.error("Company name is required.");
        return false;
      }
      if (!onboardingData.systemSettings.companyWebsite.trim()) {
        toast.error("Company website is required.");
        return false;
      }
      if (!onboardingData.systemSettings.companyWebsite.startsWith("https://")) {
        toast.error("Company website must start with 'https://'.");
        return false;
      }
      if (!onboardingData.systemSettings.billingInfo.trim()) {
        toast.error("Billing info is required.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSaveProgress = () => {
    try {
      localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({ currentStep, onboardingData })
      );
      toast.success("Progress saved successfully!");
    } catch (error) {
      console.error("Failed to save progress:", error);
      toast.error("Error saving progress.");
    }
  };

  const handleFinish = async () => {
    // Optionally, send the onboardingData to your server here.
    console.log("Onboarding data:", onboardingData);
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    toast.success("Onboarding completed!");
    router.push("/dashboard");
  };

  const addAdminEmail = () => {
    if (tempAdminEmail.trim()) {
      setOnboardingData((prev) => ({
        ...prev,
        additionalAdmins: [...prev.additionalAdmins, tempAdminEmail.trim()],
      }));
      setTempAdminEmail("");
    }
  };

  // Create a dropzone for the company logo upload.
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      setOnboardingData((prev) => ({
        ...prev,
        logo: acceptedFiles[0],
      }));
      toast.success("Company logo selected.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  // Total of 5 steps in the wizard.
  const progressPercent = ((currentStep + 1) / 5) * 100;

  return (
    <div className="onboarding-page">
      <div className="wizard-container">
        <h1>Onboarding Wizard</h1>
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="step-container">
          {currentStep === 0 && (
            <div className="step">
              <h2>Step 1: Basic System Settings</h2>
              <div className="form-group">
                <label>Company Name:</label>
                <input
                  type="text"
                  value={onboardingData.systemSettings.companyName}
                  onChange={(e) =>
                    setOnboardingData((prev) => ({
                      ...prev,
                      systemSettings: {
                        ...prev.systemSettings,
                        companyName: e.target.value,
                      },
                    }))
                  }
                  placeholder="Company Name"
                />
              </div>
              <div className="form-group">
                <label>Company Website:</label>
                <input
                  type="text"
                  value={onboardingData.systemSettings.companyWebsite}
                  onChange={(e) =>
                    setOnboardingData((prev) => ({
                      ...prev,
                      systemSettings: {
                        ...prev.systemSettings,
                        companyWebsite: e.target.value,
                      },
                    }))
                  }
                  placeholder="https://www.yourdomain.com"
                />
              </div>
              <div className="form-group">
                <label>Billing Info:</label>
                <input
                  type="text"
                  value={onboardingData.systemSettings.billingInfo}
                  onChange={(e) =>
                    setOnboardingData((prev) => ({
                      ...prev,
                      systemSettings: {
                        ...prev.systemSettings,
                        billingInfo: e.target.value,
                      },
                    }))
                  }
                  placeholder="Billing Address, Contact Details, etc."
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="step">
              <h2>Step 2: Upload Company Logo</h2>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the logo here ...</p>
                ) : (
                  <p>Drag & drop an image here, or click to select one</p>
                )}
              </div>
              {/* Preview of uploaded logo */}
              {onboardingData.logo && logoPreview && (
                <div className="logo-preview">
                  <img src={logoPreview} alt="Logo Preview" />
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="step">
              <h2>Step 3: Theme & Branding Preferences</h2>
              <div className="form-group">
                <label>Choose Theme:</label>
                <select
                  value={onboardingData.theme}
                  onChange={(e) =>
                    setOnboardingData((prev) => ({ ...prev, theme: e.target.value }))
                  }
                >
                  <option value="default">Default</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step">
              <h2>Step 4: Invite Additional Admins / Employees</h2>
              <div className="form-group">
                <label>Enter Email to Invite:</label>
                <input
                  type="email"
                  value={tempAdminEmail}
                  onChange={(e) => setTempAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
                <button onClick={addAdminEmail} className="add-btn">
                  Add Email
                </button>
              </div>
              <div className="invited-list">
                <h3>Invited Emails:</h3>
                <ul>
                  {onboardingData.additionalAdmins.map((email, index) => (
                    <li key={index}>{email}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step">
              <h2>Step 5: Review & Finish</h2>
              <pre>{JSON.stringify(onboardingData, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="nav-btns">
          {currentStep > 0 && (
            <button onClick={prevStep} className="nav-btn">
              Back
            </button>
          )}
          <button onClick={handleSaveProgress} className="nav-btn save-btn">
            Save Progress
          </button>
          {currentStep < 4 ? (
            <button onClick={nextStep} className="nav-btn">
              Next
            </button>
          ) : (
            <button onClick={handleFinish} className="nav-btn finish-btn">
              Finish
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
      <style jsx>{`
        .onboarding-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
          padding: 2rem;
        }
        .wizard-container {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 600px;
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        h1 {
          text-align: center;
          color: #283e4a;
          margin-bottom: 1rem;
          font-size: 2.5rem;
        }
        .progress-bar {
          background: #e0e0e0;
          height: 10px;
          border-radius: 5px;
          margin-bottom: 1.5rem;
          overflow: hidden;
        }
        .progress {
          height: 100%;
          background: #0073e6;
          transition: width 0.3s ease;
        }
        .step-container {
          margin-bottom: 1.5rem;
        }
        .step {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        label {
          font-size: 1rem;
          color: #333;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        input[type="text"],
        input[type="email"],
        select {
          padding: 0.65rem;
          font-size: 1rem;
          margin-bottom: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          transition: border-color 0.3s;
        }
        input[type="text"]:focus,
        input[type="email"]:focus,
        select:focus {
          outline: none;
          border-color: #0073e6;
        }
        input[type="file"] {
          font-size: 1rem;
          margin: 0.75rem 0;
        }
        /* Dropzone styling */
        .dropzone {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          border: 2px dashed #0073e6;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          color: #0073e6;
        }
        .dropzone:hover {
          background-color: #eef6ff;
        }
        /* Logo Preview styling */
        .logo-preview {
          margin-top: 1rem;
          text-align: center;
        }
        .logo-preview img {
          max-width: 200px;
          max-height: 200px;
          border-radius: 8px;
          object-fit: contain;
          border: 1px solid #ccc;
          padding: 4px;
          background: #fff;
        }
        .invited-list ul {
          list-style: inside;
          padding: 0;
          margin: 0.5rem 0;
        }
        .nav-btns {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        .nav-btn {
          flex: 1;
          background: #0073e6;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }
        .nav-btn:hover {
          background: #005bb5;
        }
        .finish-btn {
          background: #28a745;
        }
        .finish-btn:hover {
          background: #218838;
        }
        .save-btn {
          background: #ffc107;
        }
        .save-btn:hover {
          background: #e0a800;
        }
        .add-btn {
          margin-top: 0.5rem;
          background: #28a745;
          color: #fff;
          padding: 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          align-self: flex-start;
          transition: background-color 0.3s;
        }
        .add-btn:hover {
          background: #218838;
        }
      `}</style>
    </div>
  );
}
