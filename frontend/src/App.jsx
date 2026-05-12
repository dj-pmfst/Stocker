import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome/Welcome";
import Login from "./pages/auth/auth";
import Pricing from "./pages/pricing/Pricing";
import Home from "./pages/Home/Home";
import Storage from "./pages/Storage/Storage";
import Scan from "./pages/Scan/Scan";
import Order from "./pages/Order/Order";
import Profile from "./pages/Profile/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/auth" element={<Login />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/storage" element={<Storage />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/order" element={<Order />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
