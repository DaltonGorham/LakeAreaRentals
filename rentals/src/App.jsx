import { useState } from 'react';
import cars from './data/cars.json';
import sxs from './data/sxs.json';
import rv from './data/rv.json';
import Sidebar from './components/Sidebar';
import CarCard from './components/CarCard';
import SxsCard from './components/SxsCard';
import RvCard from './components/RvCard';
import Header from './components/Header';
import './App.css';
import './components/Cards.css';
import './components/Sidebar.css';
import './components/Header.css';


function App() {
  const [category, setCategory] = useState('All');

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
    <>
      <Header />
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
    </>
  );
}

export default App;
