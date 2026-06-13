import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import AboutPage from './components/AboutPage';
import RentalAgreement from './components/RentalAgreement';
import PolicyPage from './components/PolicyPage';
import InventoryPage from './components/InventoryPage';
import VehicleDetailPage from './components/VehicleDetailPage';
import AdminPage from './components/AdminPage';
import Footer from './components/Footer';
import './App.css';
import './components/Cards.css';
import './components/Header.css';

function App() {
  const [category, setCategory] = useState('all');
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <>
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/inventory" element={<InventoryPage category={category} setCategory={setCategory} />} />
        <Route path="/inventory/:type/:id" element={<VehicleDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/rental-agreement" element={<RentalAgreement />} />
        <Route path="/privacy-policy" element={<PolicyPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {!isAdmin && location.pathname !== '/inventory' && <Footer />}
    </>
  );
}

export default App;
