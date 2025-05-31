import { useState, useEffect } from "react";
import { Box, Button, Input, VStack, Text, Checkbox, Image } from "@chakra-ui/react";
import axios from "axios";

const Login = () => {
  const [tenant, setTenant] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tenants/current"); // API call
        setTenant(response.data);
      } catch (error) {
        console.error("Failed to fetch tenant data:", error);
      }
    };

    fetchTenant();
  }, []);

  const handleLogin = () => {
    // Simulate API call response with MFA enabled
    setMfaEnabled(true);
  };

  return (
    <Box w="400px" p="4" borderRadius="md" boxShadow="md" mx="auto" mt="10">
      <VStack spacing="4">
        {tenant && <Image src={tenant.logoUrl} alt={`${tenant.name} Logo`} boxSize="100px" />}
        <Text fontSize="2xl" fontWeight="bold">{tenant ? `${tenant.name} Login` : "Login"}</Text>
        
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Checkbox defaultChecked>Remember Me</Checkbox>

        {mfaEnabled && (
          <Input placeholder="MFA Code" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} />
        )}

        <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
      </VStack>
    </Box>
  );
};

export default Login;