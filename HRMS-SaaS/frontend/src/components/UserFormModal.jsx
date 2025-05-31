import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  VStack,
  Select,
  Switch,
  Avatar,
  Box,
  Spinner,
  useToast,
  CheckboxGroup,
  Checkbox,
  VStack as CheckboxVStack
} from "@chakra-ui/react";

// Base API URL
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Helper function to generate a strong password.
function generateStrongPassword(length = 12) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

const UserFormModal = ({
  isOpen,
  onClose,
  mode, // either "add" or "edit"
  initialData,
  onSubmit,
  tenants,
  onUserUpdated = () => {}
}) => {
  const toast = useToast();

  // Retrieve current user (assumes stored in localStorage under "user")
  const currentUser = useMemo(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }, []);

  // Determine if current user is SuperAdmin
  const userIsSuperAdmin = currentUser?.role?.name === "SuperAdmin";

  // States for form fields
  const [tenantId, setTenantId] = useState("");
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [localEmail, setLocalEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaType, setMfaType] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null); // holds file (object) or uploaded URL (string)
  const [preview, setPreview] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [formDisabled, setFormDisabled] = useState(true);
  const [password, setPassword] = useState("");

  // Fetch available roles from the server.
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE}/api/roles`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch roles");
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error("[ERROR] Fetch roles:", err);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  // Initialization effect for "edit" vs "add" modes.
  useEffect(() => {
    if (mode === "edit" && initialData) {
      console.log("[DEBUG] Initializing form (edit mode) with data:", initialData);
      setTenantId(initialData.tenant ? initialData.tenant.id : "");
      setFirstName(initialData.firstName || "");
      setLastName(initialData.lastName || "");
      setEmail(initialData.email || "");
      setMfaEnabled(initialData.mfaEnabled || false);
      
      if (initialData.mfaType) {
        setMfaType(Array.isArray(initialData.mfaType)
          ? initialData.mfaType
          : [initialData.mfaType]);
      } else {
        setMfaType([]);
      }
      
      // In edit mode, profilePicture is normally a URL.
      // If initialData.avatar contains a fallback placeholder URL (e.g. from via.placeholder.com or similar),
      // then set profilePicture to null so that Avatar falls back to initials.
      const avatarUrl =
        initialData.avatar &&
        (initialData.avatar.includes("placeholder") ||
         initialData.avatar.includes("via.placeholder.com"))
          ? null
          : initialData.avatar;
      setProfilePicture(avatarUrl);
      
      setRoleId(initialData.role ? initialData.role.id : "");
      setIsActive(currentUser?.role?.name === "SuperAdmin" ? true : (initialData.isActive ?? true));
      setFormDisabled(false);
    } else if (mode === "add") {
      console.log("[DEBUG] Initializing form (add mode)");
      if (currentUser && !userIsSuperAdmin) {
        setTenantId(currentUser.tenantId);
        setFormDisabled(false);
      } else {
        setTenantId("");
        setFormDisabled(true);
      }
      setFirstName("");
      setLastName("");
      setEmail("");
      setLocalEmail("");
      setMfaEnabled(false);
      setMfaType([]);
      setProfilePicture(null);
      setRoleId("");
      setIsActive(true);
      setPreview(null);
      setPassword(generateStrongPassword());
    }
  }, [initialData, mode, currentUser, userIsSuperAdmin]);

  // Tenant selection handler.
  const handleTenantChange = (selectedTenantId) => {
    console.log("[DEBUG] Tenant selected:", selectedTenantId);
    setTenantId(selectedTenantId);
    setFormDisabled(false);
  };

  // Handler for avatar file input.
  const handleProfileUpload = (event) => {
    const file = event.target.files[0];
    console.log("[DEBUG] Selected avatar file:", file);
    if (file) {
      setProfilePicture(file); // Save the file object for later upload.
      setPreview(URL.createObjectURL(file)); // Generate a preview URL.
    }
  };

  // Upload avatar via dedicated endpoint.
  const handleAvatarUpload = async () => {
    if (!profilePicture || !tenantId) return null;
    const formData = new FormData();
    formData.append("avatar", profilePicture);
    try {
      const response = await fetch(`${API_BASE}/upload-avatar/${tenantId}/avatar`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Avatar upload failed");
      console.log("[DEBUG] Avatar uploaded. URL:", data.avatarUrl);
      return data.avatarUrl;
    } catch (error) {
      console.error("[ERROR] Avatar upload error:", error);
      toast({
        title: "Avatar Upload Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }
  };

  // Form submission handler.
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[DEBUG] Submitting form with tenantId:", tenantId);
    if (mode === "add" && !tenantId) {
      toast({
        title: "Tenant not selected",
        description: "Please select a tenant before saving the user.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const token = localStorage.getItem("authToken");
    const formData = new FormData();

    // Upload the avatar first, if one is selected.
    let avatarUrl = null;
    if (profilePicture) {
      avatarUrl = await handleAvatarUpload();
    }

    formData.append("tenantId", tenantId);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("roleId", roleId);
    formData.append("mfaEnabled", mfaEnabled);
    // Send MFA types as a JSON string.
    formData.append("mfaType", JSON.stringify(mfaType));
    formData.append("isActive", isActive);

    if (mode === "add") {
      const currentTenant = tenants.find((t) => t.id === tenantId);
      const domain = currentTenant ? currentTenant.domain : "";
      const fullEmail = localEmail.trim() + "@" + domain;
      formData.append("email", fullEmail);
      formData.append("password", password);
    } else {
      formData.append("email", email);
    }

    if (avatarUrl) {
      formData.append("avatar", avatarUrl);
    }

    try {
      const url =
        mode === "edit"
          ? `${API_BASE}/api/users/${initialData.id}`
          : `${API_BASE}/api/users`;
      const res = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || "Save failed");
      toast({
        title: "User Saved",
        description: "User updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      console.log("[DEBUG] User created/updated:", payload.user);
      onSubmit(payload.user);
      onClose();
    } catch (err) {
      console.error("[ERROR] Failed to save user:", err);
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // For the email field's InputRightAddon, find the tenant's domain.
  const currentTenantForAddon = tenants.find((tenant) => tenant.id === tenantId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>{mode === "edit" ? "Edit User" : "Create New User"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {/* Tenant Selection */}
            <FormControl id="tenant" isRequired>
              <FormLabel>Select Tenant</FormLabel>
              <Select
                placeholder="Select Tenant"
                value={tenantId}
                onChange={(e) => handleTenantChange(e.target.value)}
                isDisabled={!userIsSuperAdmin || mode === "edit"}
              >
                {tenants
                  .filter((t) => t.isActive)
                  .map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
              </Select>
            </FormControl>

            {/* First Name */}
            <FormControl id="firstName" isRequired isDisabled={formDisabled}>
              <FormLabel>First Name</FormLabel>
              <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </FormControl>

            {/* Last Name */}
            <FormControl id="lastName" isRequired isDisabled={formDisabled}>
              <FormLabel>Last Name</FormLabel>
              <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </FormControl>

            {/* Email Field */}
            {mode === "add" && tenantId ? (
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <Input
                    type="text"
                    value={localEmail}
                    onChange={(e) => setLocalEmail(e.target.value)}
                    placeholder="Enter username"
                    isDisabled={formDisabled}
                  />
                  <InputRightAddon children={`@${currentTenantForAddon?.domain || ""}`} />
                </InputGroup>
              </FormControl>
            ) : (
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} readOnly={mode === "edit"} onChange={(e) => mode !== "edit" && setEmail(e.target.value)} />
              </FormControl>
            )}

            {/* Password Field (only in add mode) */}
            {mode === "add" && (
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="text" value={password} isReadOnly />
              </FormControl>
            )}

            {/* Role Selection */}
            <FormControl id="role" isRequired isDisabled={formDisabled || (!userIsSuperAdmin && mode === "add")}>
              <FormLabel>Role</FormLabel>
              {loadingRoles ? (
                <Spinner size="sm" />
              ) : (
                <Select placeholder="Select Role" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Select>
              )}
            </FormControl>

            {/* MFA Enable Toggle */}
            <FormControl id="mfaEnabled" isDisabled={formDisabled}>
              <FormLabel>Enable MFA</FormLabel>
              <Switch isChecked={mfaEnabled} onChange={(e) => setMfaEnabled(e.target.checked)} />
            </FormControl>

            {/* MFA Type Selection */}
            {mfaEnabled && (
              <FormControl id="mfaType" isDisabled={formDisabled}>
                <FormLabel>Select MFA Type(s)</FormLabel>
                <CheckboxGroup value={mfaType} onChange={setMfaType}>
                  <CheckboxVStack align="start">
                    {["TOTP", "EMAIL", "SMS"].map((type) => (
                      <Checkbox key={type} value={type}>
                        {type}
                      </Checkbox>
                    ))}
                  </CheckboxVStack>
                </CheckboxGroup>
              </FormControl>
            )}

            {/* Profile Picture / Avatar Upload */}
            <FormControl id="profilePicture" isDisabled={formDisabled}>
              <FormLabel>Profile Picture</FormLabel>
              <Box display="flex" alignItems="center" gap={4}>
                <Avatar
                  size="md"
                  // Use the preview if available, or an existing avatar URL if stored.
                  // If neither is provided, no src is passed so that the component displays initials.
                  src={
                    preview ||
                    (typeof profilePicture === "string" ? profilePicture : undefined)
                  }
                  name={`${firstName} ${lastName}`}
                />
                <Input type="file" accept="image/*" onChange={handleProfileUpload} disabled={formDisabled} p={1} />
              </Box>
            </FormControl>

            {/* User Active Toggle */}
            <FormControl id="isActive" isDisabled={formDisabled || (!userIsSuperAdmin && mode === "add")}>
              <FormLabel>User Active</FormLabel>
              <Switch isChecked={userIsSuperAdmin ? true : isActive} onChange={(e) => setIsActive(e.target.checked)} />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" type="submit">
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserFormModal;
