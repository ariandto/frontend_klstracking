import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login.tsx";
import Navbar from "./components/Navbar.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.tsx";
import About from "./components/About.jsx";
import Profile from "./components/Profile.jsx";
import DeliveryTracking from "./components/DeliveryTracking.jsx";
import OrderKeyParsing from "./components/OrderKeyParsing.tsx";
import OnDelivery from "./components/OnDelivery.tsx";
import MsContact from "./components/MsContact.tsx";
import AutoRefresh from "./components/AutoRefresh.tsx";

function App() {
  const location = useLocation();
  
  return (
    <>
      {location.pathname !== "/" && location.pathname !== "/register" && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contactms" element={<MsContact />} />
        <Route path="/myprofile" element={<Profile />} />
        <Route path="/setting" element={<AutoRefresh />} />
        <Route path="/ondelivery" element={<OnDelivery />} />
        <Route path="/trackingdelivery" element={<DeliveryTracking />} />
        <Route path="/orderkeyparsing" element={<OrderKeyParsing />} />
      </Routes>
    </>
  );
}

function MainApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default MainApp;
