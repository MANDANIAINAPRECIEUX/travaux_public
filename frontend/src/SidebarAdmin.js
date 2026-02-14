import React, { useState } from "react";
import { FaTh, FaBars, FaUsers, FaSignOutAlt, FaFileAlt } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBridge } from '@fortawesome/free-solid-svg-icons';
import mtpi from './Assets/mtpi.jpg'; // Chemin vers votre image de logo

const SideAdmin = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  const menuItem = [
    { path: "/dashboardadmin", name: "Tableaux de bord", icon: <FaTh /> },
    { path: "/utilisateur", name: "Utilisateurs", icon: <FaUsers /> },
    { path: "/pontAdmin", name: "Ponts", icon:<FontAwesomeIcon icon={faBridge} />},
    { path: "/signalAdmin", name: "Signaletiques", icon: <FaFileAlt /> },
    { path: "/deconnectAdmin", name: "Déconnexion", icon: <FaSignOutAlt /> },
  ];

  return (
    <div className="container">
      <div className={`sidebar ${isOpen ? "" : "collapsed"}`}>
        <div className="top_section">
          <div className="logo-container" style={{ display: isOpen ? "block" : "none" }}>
            <img src={mtpi} alt="Logo" className="logo" />
          </div>
          <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {
          menuItem.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className="link"
              activeClassName="active"
            >
              <div className="icon">{item.icon}</div>
              <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
            </NavLink>
          ))
        }
      </div>
      <main className={`main-content ${isOpen ? "" : "collapsed"}`}>
        {children}
      </main>
    </div>
  );
};

export default SideAdmin;
