import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Welcome to the HRMS SaaS</h1>} />
      </Routes>
    </Router>
  );
}
console.log("App component is mounting...");
export default App;