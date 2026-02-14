import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faFilePdf, faEye } from '@fortawesome/free-solid-svg-icons'; // Import de l'icône "Voir"
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Diagnostics = () => {
  const [diagnostics, setDiagnostics] = useState([]);
  const [ponts, setPonts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDiagnostic, setCurrentDiagnostic] = useState(null);
  const [viewDiagnostic, setViewDiagnostic] = useState(null); // État pour afficher les données
  const [idPont, setIdPont] = useState('');
  const [dateDiagnostic, setDateDiagnostic] = useState('');
  const [partieOuvrage, setPartieOuvrage] = useState('');
  const [degradation, setDegradation] = useState('');
  const [unite, setUnite] = useState('');
  const [quantite, setQuantite] = useState('');
  const [priorisation, setPriorisation] = useState('');

  const [searchPriorisation, setSearchPriorisation] = useState('');
  const [searchDateDiagnostic, setSearchDateDiagnostic] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchDiagnostics();
    fetchPonts();
  }, []);

  const fetchPonts = async () => {
    try {
      const response = await fetch('http://localhost:8081/pontes');
      if (!response.ok) throw new Error('Erreur lors de la récupération des ponts');
      const data = await response.json();
      setPonts(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des ponts:', error);
    }
  };

  const fetchDiagnostics = async () => {
    try {
      const response = await fetch('http://localhost:8081/diagnostic');
      if (!response.ok) throw new Error('Erreur lors de la récupération des fiches des diagnostics');
      const data = await response.json();
      setDiagnostics(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des fiches des diagnostics:', error);
    }
  };

  const openModal = () => {
    setCurrentDiagnostic(null);
    setIdPont('');
    setDateDiagnostic('');
    setPartieOuvrage('');
    setDegradation('');
    setUnite('');
    setQuantite('');
    setPriorisation('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDiagnostic(null);
    setViewDiagnostic(null); // Ferme la modal de visualisation
  };

  const handleView = (diagnostic) => {
    setViewDiagnostic(diagnostic);
    setIsModalOpen(true); // Ouvre la modal avec les détails du diagnostic sélectionné
  };

  const handleEdit = (diagnostic) => {
    setCurrentDiagnostic(diagnostic);
    setIdPont(diagnostic.idPont);
    setDateDiagnostic(formatDate(diagnostic.dateDiagnostic));
    setPartieOuvrage(diagnostic.partieOuvrage);
    setDegradation(diagnostic.degradation);
    setUnite(diagnostic.unite);
    setQuantite(diagnostic.quantite);
    setPriorisation(diagnostic.priorisation);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#297bc7',
      cancelButtonColor: 'rgb(154, 22, 22)',
      confirmButtonText: 'Oui, supprimer!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8081/diagnostic/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            await fetchDiagnostics();
            Swal.fire('Supprimé!', 'Le pont a été supprimé avec succès.', 'success');
          } else {
            throw new Error('Erreur lors de la suppression du pont');
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la suppression du pont.',
          });
        }
      }
    });
  };

  const filteredDiagnostics = diagnostics.filter((diagnostic) => {
    const matchesPriorisation = searchPriorisation === '' || diagnostic.priorisation.toLowerCase().includes(searchPriorisation.toLowerCase());
    const matchesDateDiagnostic = searchDateDiagnostic === '' || diagnostic.dateDiagnostic.startsWith(searchDateDiagnostic);
    return matchesPriorisation && matchesDateDiagnostic;
  });

  return (
    <div>
      <header>Gestion des Diagnostics</header>
      <div className="table-container">
        <div className="table-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="small-button" onClick={openModal}>
            <FontAwesomeIcon icon={faPlus} /> Ajouter
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Identification</th>
                <th>identication de Pont</th>
                <th>Date de diagnostic</th>
                <th>Partie d'ouvrage</th>
                <th>Dégradation</th>
                <th>Unite</th>
                <th>Quantité</th>
                <th>Priorisation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiagnostics.map((diagnostic) => (
                <tr key={diagnostic.id}>
                  <td>{diagnostic.id}</td>
                  <td>{diagnostic.idPont}</td>
                  <td>{formatDate(diagnostic.dateDiagnostic)}</td>
                  <td>{diagnostic.partieOuvrage}</td>
                  <td>{diagnostic.degradation}</td>
                  <td>{diagnostic.unite}</td>
                  <td>{diagnostic.quantite}</td>
                  <td>{diagnostic.priorisation}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleView(diagnostic)} className="icon-button">
                        <FontAwesomeIcon icon={faEye} /> {/* Icône pour le bouton "Voir" */}
                      </button>
                      <button onClick={() => handleEdit(diagnostic)} className="icon-button">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => handleDelete(diagnostic.id)} className="icon-button">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de visualisation des données */}
        {viewDiagnostic && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="form-container">
              <h2>Détails du Diagnostic</h2>
              <p><strong>Identification:</strong> {viewDiagnostic.id}</p>
              <p><strong>ID Pont:</strong> {viewDiagnostic.idPont}</p>
              <p><strong>Date de Diagnostic:</strong> {formatDate(viewDiagnostic.dateDiagnostic)}</p>
              <p><strong>Partie d'Ouvrage:</strong> {viewDiagnostic.partieOuvrage}</p>
              <p><strong>Dégradation:</strong> {viewDiagnostic.degradation}</p>
              <p><strong>Unité:</strong> {viewDiagnostic.unite}</p>
              <p><strong>Quantité:</strong> {viewDiagnostic.quantite}</p>
              <p><strong>Priorisation:</strong> {viewDiagnostic.priorisation}</p>
              <button onClick={closeModal} className="close-button">Fermer</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Diagnostics;
