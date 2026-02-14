// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const NeptuneSide = () => {
  return (
    <div className="sidebar-Nep">
      <h2 className="sidebar-title">Menu</h2>
      <ul className="sidebar-menu">
        <li>
          <Link to="/" className="sidebar-link">Accueil</Link>
        </li>
        <li>
          <Link to="/table" className="sidebar-link">Gestion des Ponts</Link>
        </li>
        {/* Ajoutez d'autres liens si nécessaire */}
        <li>
          <Link to="/autres" className="sidebar-link">Autres</Link>
        </li>
      </ul>
    </div>
  );
};

export default NeptuneSide;
