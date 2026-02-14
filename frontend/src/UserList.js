import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';  // L'icône utilisateur
import Modal from './Modal';  // Votre modal pour afficher les informations

const TablePont = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulez les données de l'utilisateur
  const user = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'Administrateur',
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <header className="header">
        <div className="user-info" onClick={openModal}>
          <FontAwesomeIcon icon={faUserCircle} size="2x" className="user-icon" />
        </div>
      </header>

      {/* Modal pour afficher les informations utilisateur */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div>
            <h2>Informations de l'utilisateur</h2>
            <p>Nom: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Rôle: {user.role}</p>
          </div>
        </Modal>
      )}

      <div className="table-container">
        {/* Votre table de données ici */}
      </div>
    </div>
  );
};

export default TablePont;