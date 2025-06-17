import { React } from 'react';


const Sidebar = ({ selected, onSelect }) => {
  const categories = ['All', 'Cars', 'SXS', 'Motor Home'];

  return (
    <aside className="sidebar">
      {categories.map(cat => (
        <button
          key={cat}
          className={selected === cat ? 'active' : ''}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;