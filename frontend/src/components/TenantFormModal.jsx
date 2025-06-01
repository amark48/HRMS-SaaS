// src/components/TenantFormModal.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Switch,
  CheckboxGroup,
  Stack,
  Checkbox,
  FormHelperText,
  Heading,
  Image,
} from "@chakra-ui/react";

// Example constant for US states.
const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
];

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const TenantFormModal = ({
  isOpen,
  onClose,
  mode = "add", // either "add" or "edit"
  initialData = {},
  onSubmit, // Callback that receives the final tenant record for further processing.
}) => {
  // Local state for tenant information.
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [industry, setIndustry] = useState("");
  const [industryOther, setIndustryOther] = useState("");
  const [subscriptionTier, setSubscriptionTier] = useState("");
  // Logo file state.
  const [logo, setLogo] = useState(null);
  // For display purposes (preview URL).
  const [logoPreview, setLogoPreview] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  // Local state for billing information.
  const [billingStreet, setBillingStreet] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("Virginia");
  const [billingZip, setBillingZip] = useState("");
  const [billingCountry, setBillingCountry] = useState("US");
  const [billingPhone, setBillingPhone] = useState("");

  // Local state for MFA settings.
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [allowedMfa, setAllowedMfa] = useState([]);

  // Local state for active status.
  const [isActive, setIsActive] = useState(true);

  // Submitting state.
  const [submitting, setSubmitting] = useState(false);

  // useRef used to ensure the form is initialized only once per modal open.
  const initializedRef = useRef(false);

  // Effect to initialize form fields when the modal opens.
  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      if (mode === "edit" && initialData && Object.keys(initialData).length) {
        // Pre-fill fields for edit mode.
        setName(initialData.name || "");
        setDomain(initialData.domain || "");
        setIndustry(initialData.industry || "");
        setSubscriptionTier(initialData.subscriptionTier || "");
        setCompanyWebsite(initialData.companyWebsite || "");
        setBillingStreet(initialData.billingStreet || "");
        setBillingCity(initialData.billingCity || "");
        setBillingState(initialData.billingState || "Virginia");
        setBillingZip(initialData.billingZip || "");
        setBillingCountry(initialData.billingCountry || "US");
        setBillingPhone(initialData.billingPhone || "");
        setMfaEnabled(initialData.mfaEnabled === true || initialData.mfaEnabled === "true");
        setAllowedMfa(
          Array.isArray(initialData.allowedMfa) ? initialData.allowedMfa : []
        );
        // For the logo, if a logo file is not updated, use existing logo URL as preview.
        setLogo(null);
        setLogoPreview(initialData.logoUrl || "");
        setIsActive(
          typeof initialData.isActive === "boolean" ? initialData.isActive : true
        );
      } else {
        // Reset fields for add mode.
        setName("");
        setDomain("");
        setIndustry("");
        setIndustryOther("");
        setSubscriptionTier("");
        setLogo(null);
        setLogoPreview("");
        setCompanyWebsite("");
        setBillingStreet("");
        setBillingCity("");
        setBillingState("Virginia");
        setBillingZip("");
        setBillingCountry("US");
        setBillingPhone("");
        setMfaEnabled(false);
        setAllowedMfa([]);
        setIsActive(true);
      }
      initializedRef.current = true;
    }
    if (!isOpen) {
      initializedRef.current = false;
    }
  }, [isOpen, mode, initialData]);

  // Handler for logo file selection. Generates a preview.
  const handleLogoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogo(null);
      setLogoPreview("");
    }
  };

  // --- Updated: Logo Upload Using Existing Endpoint ---  
  // Note: We update the URL so that it matches our backend route, which is mounted at "/api/upload" and defined as "/upload/:tenantId/logo"
  // The full URL becomes: /api/upload/upload/:tenantId/logo
  const handleLogoUpload = async (tenantId) => {
    if (!logo) return null;
    const formData = new FormData();
    formData.append("logo", logo);
    try {
      const response = await fetch(
        `${API_BASE}/api/upload/${tenantId}/logo`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Logo upload failed");
      console.log("[DEBUG] Logo uploaded. URL:", data.logoUrl);
      return data.logoUrl;
    } catch (error) {
      console.error("[ERROR] Logo upload error:", error);
      alert("Logo update failed: " + error.message);
      return null;
    }
  };

  // Submission handler.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    // Build the payload object.
    const normalizedName = name.trim();
    const normalizedDomain = domain.trim();
    const finalIndustry = industry === "Other" ? industryOther.trim() : industry.trim();
    const payload = {
      name: normalizedName,
      domain: normalizedDomain,
      industry: finalIndustry,
      subscriptionTier: subscriptionTier.trim(),
      companyWebsite: companyWebsite.trim(),
      billingStreet: billingStreet.trim(),
      billingCity: billingCity.trim(),
      billingState: billingState.trim(),
      billingZip: billingZip.trim(),
      billingCountry: billingCountry.trim(),
      billingPhone: billingPhone.trim(),
      mfaEnabled,
      allowedMfa,
      isActive,
    };

    console.log("DEBUG: Mode:", mode, " Payload:", payload);
    const url = mode === "add" ? "/api/tenants" : `/api/tenants/${initialData.id}`;

    try {
      const response = await fetch(url, {
        method: mode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data from server:", errorData);
        throw new Error(
          errorData.detail || errorData.error || "Error creating/updating tenant"
        );
      }
      let tenantRecord = await response.json();

      // If a new logo file was selected, upload it using the updated endpoint.
      if (logo) {
        const uploadedLogoUrl = await handleLogoUpload(tenantRecord.id);
        if (uploadedLogoUrl) {
          tenantRecord.logoUrl = uploadedLogoUrl;
        }
      }

      onSubmit(tenantRecord);
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      if (error.message.includes("duplicate key")) {
        alert(
          "A tenant with this name already exists. Please choose a different name or edit the existing tenant."
        );
      } else {
        alert(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{mode === "add" ? "Add Tenant" : "Edit Tenant"}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <SimpleGrid columns={2} spacing={6}>
              {/* Left Column: Tenant Information */}
              <Box>
                <FormControl isRequired>
                  <FormLabel>Tenant Name</FormLabel>
                  <Input
                    name="name"
                    placeholder="Enter tenant name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Domain</FormLabel>
                  <Input
                    name="domain"
                    placeholder="e.g., democorp.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Industry</FormLabel>
                  <Select
                    name="industry"
                    placeholder="Select industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Retail">Retail</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                {industry === "Other" && (
                  <FormControl isRequired mt={4}>
                    <FormLabel>Specify Industry</FormLabel>
                    <Input
                      name="industryOther"
                      placeholder="Enter industry"
                      value={industryOther}
                      onChange={(e) => setIndustryOther(e.target.value)}
                    />
                  </FormControl>
                )}
                <FormControl isRequired mt={4}>
                  <FormLabel>Subscription Tier</FormLabel>
                  <Select
                    name="subscriptionTier"
                    placeholder="Select tier"
                    value={subscriptionTier}
                    onChange={(e) => setSubscriptionTier(e.target.value)}
                  >
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </Select>
                </FormControl>
                {/* Logo Upload and Preview */}
                <FormControl mt={4}>
                  <FormLabel>Logo Upload</FormLabel>
                  <Input
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                  {logoPreview && (
                    <Box mt={2}>
                      <Image
                        src={logoPreview}
                        alt="Logo Preview"
                        maxH="150px"
                        borderRadius="md"
                      />
                      <FormHelperText>Preview of selected logo.</FormHelperText>
                    </Box>
                  )}
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Company Website</FormLabel>
                  <Input
                    name="companyWebsite"
                    placeholder="https://www.example.com"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />
                </FormControl>
              </Box>

              {/* Right Column: Billing Information */}
              <Box>
                <FormControl isRequired>
                  <FormLabel>Billing Street</FormLabel>
                  <Input
                    name="billingStreet"
                    placeholder="Street address"
                    value={billingStreet}
                    onChange={(e) => setBillingStreet(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Billing City</FormLabel>
                  <Input
                    name="billingCity"
                    placeholder="City"
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Billing State</FormLabel>
                  <Select
                    name="billingState"
                    value={billingState}
                    onChange={(e) => setBillingState(e.target.value)}
                  >
                    {US_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Billing Zip</FormLabel>
                  <Input
                    name="billingZip"
                    placeholder="Zip Code"
                    value={billingZip}
                    onChange={(e) => setBillingZip(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Billing Country</FormLabel>
                  <Input
                    name="billingCountry"
                    placeholder="Country"
                    value={billingCountry}
                    onChange={(e) => setBillingCountry(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Billing Phone</FormLabel>
                  <Input
                    name="billingPhone"
                    placeholder="Phone number"
                    value={billingPhone}
                    onChange={(e) => setBillingPhone(e.target.value)}
                  />
                </FormControl>
                {/* Active Tenant Toggle */}
                <FormControl display="flex" alignItems="center" mt={4}>
                  <FormLabel mb="0">Active Tenant?</FormLabel>
                  <Switch
                    isChecked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    colorScheme="blue"
                    ml={3}
                  />
                </FormControl>
              </Box>
            </SimpleGrid>

            {/* MFA Settings Section */}
            <Box p={4} borderWidth="1px" borderColor="gray.200" borderRadius="md" mt={6}>
              <Heading size="sm" mb={3}>
                MFA Settings
              </Heading>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Enable MFA?</FormLabel>
                <Switch
                  isChecked={mfaEnabled}
                  onChange={(e) => setMfaEnabled(e.target.checked)}
                  colorScheme="blue"
                  ml={3}
                />
              </FormControl>
              {mfaEnabled && (
                <FormControl mt={4}>
                  <FormLabel>Select Allowed MFA</FormLabel>
                  <CheckboxGroup colorScheme="blue" value={allowedMfa} onChange={setAllowedMfa}>
                    <Stack direction="row">
                      <Checkbox value="EMAIL">EMAIL</Checkbox>
                      <Checkbox value="SMS">SMS</Checkbox>
                      <Checkbox value="TOTP">TOTP</Checkbox>
                    </Stack>
                  </CheckboxGroup>
                  <FormHelperText>Select one or more methods.</FormHelperText>
                </FormControl>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue">
              {mode === "add" ? "Add Tenant" : "Update Tenant"}
            </Button>
            <Button ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default TenantFormModal;
