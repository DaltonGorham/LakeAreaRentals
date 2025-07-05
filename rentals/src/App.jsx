import { use, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import AboutPage from './components/AboutPage';
import RentalAgreement from './components/RentalAgreement';
import InventoryPage from './components/InventoryPage';
import Footer from './components/Footer';
import './App.css';
import './components/Cards.css';
import './components/Sidebar.css';
import './components/Header.css';

function App() {
  const [category, setCategory] = useState('All');
  const location = useLocation();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/inventory" element={<InventoryPage category={category} setCategory={setCategory} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/rental-agreement" element={<RentalAgreement />} />
      </Routes>
      {location.pathname !== '/inventory' && <Footer />}
    </>
  );
}

export default App;