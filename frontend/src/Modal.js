import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Ne rien afficher si le modal n'est pas ouvert

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Clic en dehors du modal pour fermer */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Empêche la fermeture lors du clic à l'intérieur */}
        {children} {/* Contenu du modal */}
      </div>
    </div>
  );
};

export default Modal;
