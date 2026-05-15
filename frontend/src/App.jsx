import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome/Welcome";
import Login from "./pages/Auth/Auth";
import Pricing from "./pages/Pricing/Pricing";
import Home from "./pages/Home/Home";
import Storage from "./pages/Storage/Storage";
import Scan from "./pages/Scan/Scan";
import Order from "./pages/Order/Order";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/Error/Error";

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
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}
