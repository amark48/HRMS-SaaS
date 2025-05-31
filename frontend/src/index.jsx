import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider> {/* ✅ No theme config—use default */}
      <App />
    </ChakraProvider>
  </React.StrictMode>
);