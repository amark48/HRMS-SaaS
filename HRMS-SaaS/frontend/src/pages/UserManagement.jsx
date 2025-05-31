import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Heading, Text, Flex, Spacer, Button, Input, Table, TableContainer, Thead, Tbody, Tr, Th, Td,
  IconButton, Spinner, Tooltip, Tabs, TabList, TabPanels, Tab, TabPanel, useDisclosure
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, LockIcon, UnlockIcon } from "@chakra-ui/icons";
import AdminLayout from "../components/AdminLayout";
import UserFormModal from "../components/UserFormModal";
import RoleFormModal from "../components/RoleFormModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  const { isOpen: isUserModalOpen, onOpen: onUserModalOpen, onClose: onUserModalClose } = useDisclosure();
  const { isOpen: isRoleModalOpen, onOpen: onRoleModalOpen, onClose: onRoleModalClose } = useDisclosure();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchTenants();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found, cannot fetch users.");

      const response = await fetch("/api/users?includeTenants=true", { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(`Failed to fetch users: ${response.statusText}`);

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("[ERROR] Fetching users failed:", error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("[DEBUG] Fetching roles with token:", token);
      
      const response = await fetch("/api/roles", { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(`Failed to fetch roles: ${response.statusText}`);

      const data = await response.json();
      console.log("[DEBUG] Roles fetched successfully:", data);
      setRoles(data);
    } catch (error) {
      console.error("[ERROR] Fetching roles failed:", error.message);
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/tenants", { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(`Failed to fetch tenants: ${response.statusText}`);

      const data = await response.json();
      setTenants(data);
    } catch (error) {
      console.error("[ERROR] Fetching tenants failed:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [tenants]);

  const handleAddOrEditUser = (userData) => {
    if (editingUser && editingUser.id) {
      setUsers(users.map((u) => u.id === editingUser.id ? { ...editingUser, tenant: userData.tenant, ...userData } : u));
    } else {
      setUsers([...users, { id: Date.now().toString(), ...userData }]);
    }
    setEditingUser(null);
    onUserModalClose();
    fetchTenants();
  };

  const handleToggleStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update user status");

      fetchUsers();
    } catch (error) {
      console.error("[ERROR] Failed to toggle user status:", error);
    }
  };

  return (
    <AdminLayout>
      <Box p={6}>
        <Heading size="xl" mb={4}>User Management</Heading>
        <Tabs variant="enclosed">
          <TabList>
            <Tab>User Accounts</Tab>
            <Tab>Manage Roles</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Flex mb={4} alignItems="center">
                <Input placeholder="Search users..." value={userSearchTerm} onChange={(e) => setUserSearchTerm(e.target.value)} />
                <Spacer />
                <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => { setEditingUser(null); onUserModalOpen(); }}>
                  Create New User
                </Button>
              </Flex>
              {loadingUsers ? (
                <Flex justify="center" align="center" minH="200px"><Spinner size="xl" /></Flex>
              ) : (
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Avatar</Th><Th>Name</Th><Th>Email</Th><Th>Tenant</Th><Th>Role</Th><Th>Status</Th><Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.length === 0 ? (
                        <Tr><Td colSpan={7} textAlign="center">No users found.</Td></Tr>
                      ) : (
                        users.map((user) => {
                          const isSuperAdmin = user.role?.name === "SuperAdmin";
                          return (
                            <Tr key={user.id} _hover={{ bg: "gray.100" }}>
                              <Td>
                                <img src={user.avatar || "https://via.placeholder.com/32"} 
                                     alt="Avatar" width="32" height="32" 
                                     style={{ borderRadius: "50%" }} />
                              </Td>
                              <Td>{user.firstName} {user.lastName}</Td>
                              <Td>{user.email}</Td>
                              <Td>{user.tenant?.name || "N/A"}</Td>
                              <Td>{user.role?.name || "N/A"}</Td>
                              <Td><Text color={user.isActive ? "green.600" : "gray.500"}>{user.isActive ? "Active" : "Inactive"}</Text></Td>
                              <Td>
                                <Tooltip label="Edit User">
                                  <IconButton aria-label="Edit user" icon={<EditIcon />} size="sm" mr={2} 
                                    onClick={() => {
                                      console.log("[DEBUG] Editing user:", user);
                                      setEditingUser(user);
                                      onUserModalOpen();
                                    }} />
                                </Tooltip>
                              </Td>
                            </Tr>
                          );
                        })
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </AdminLayout>
  );
};

export default UserManagement;