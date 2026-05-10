import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/auth";
import Pricing from "./pages/pricing/pricing"
// import Home from './pages/Home';
// import Storage from './pages/Storage';
// import Scan from './pages/Scan/Scan';
// import Order from './pages/Order';
// import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Login />} />
      <Route path="/pricing" element={<Pricing/>} />
      {/* <Route path="/home" element={<Home />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/order" element={<Order />} />
        <Route path="/profile" element={<Profile />} /> */}
    </Routes>
  );
}
