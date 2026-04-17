import React from 'react';
import Sidebar from './Sidebar';
import CarCard from './CarCard';
import SxsCard from './SxsCard';
import RvCard from './RvCard';
import TrailerCard from './TrailerCard';
import cars from '../data/cars.json';
import sxs from '../data/sxs.json';
import rv from '../data/rv.json';
import trailers from '../data/trailers.json';
import './InventoryPage.css'; 

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

  const filteredTrailers = category === 'All'
    ? trailers
    : trailers.filter(trailer => trailer.category.toLowerCase() === category.toLowerCase());

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
        {filteredTrailers.map(trailer => (
          <TrailerCard key={trailer.id} trailer={trailer} />
        ))}
      </div>
    </div>
  );
}

export default InventoryPage;