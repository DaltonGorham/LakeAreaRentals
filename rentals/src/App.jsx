import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import cars from './data/cars.json';
import sxs from './data/sxs.json';
import rv from './data/rv.json';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import CarCard from './components/CarCard';
import SxsCard from './components/SxsCard';
import RvCard from './components/RvCard';
import Header from './components/Header';
import AboutPage from './components/AboutPage'; // Create this component
import './App.css';
import './components/Cards.css';
import './components/Sidebar.css';
import './components/Header.css';

function InventoryPage({ category, setCategory }) {
  const filteredCars = category === 'All'
    ? cars
    : cars.filter(car => car.category.toLowerCase() === category.toLowerCase());

  const filteredSxs = category === 'All'
    ? sxs
    : sxs.filter(sxs => sxs.category.toLowerCase() === category.toLowerCase());

  const filteredRv = category === 'All'
    ? rv
    : rv.filter(rv => rv.category.toLowerCase() === category.toLowerCase());

  return (
    <div className="layout">
      <Sidebar selected={category} onSelect={setCategory} />
      <div className="gallery">
        {filteredCars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
        {filteredSxs.map(sxs => (
          <SxsCard key={sxs.id} sxs={sxs} />
        ))}
        {filteredRv.map(rv => (
          <RvCard key={rv.id} rv={rv} />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [category, setCategory] = useState('All');

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/inventory" element={<InventoryPage category={category} setCategory={setCategory} />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;