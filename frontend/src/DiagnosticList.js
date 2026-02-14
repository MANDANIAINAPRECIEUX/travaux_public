import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const DiagnosticList = () => {
  const [diagnostics, setDiagnostics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDiagnostic, setCurrentDiagnostic] = useState(null);
  const [diagnosticData, setDiagnosticData] = useState({
    id_pont: '',
    date_diagnostic: '',
    partie_ouvrage: '',
    degradation: '',
    intervention_a_faire: '',
    Priorisation: '',
    etat_general: '',
    photos: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiagnosticData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDiagnosticData((prevData) => ({ ...prevData, photos: file }));
    }
  };

  const openModal = () => {
    setCurrentDiagnostic(null);
    setDiagnosticData({
      id_pont: '',
      date_diagnostic: '',
      partie_ouvrage: '',
      degradation: '',
      intervention_a_faire: '',
      Priorisation: '',
      etat_general: '',
      photos: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDiagnostic(null);
  };

  // Fonction pour récupérer les diagnostics
  const fetchDiagnostics = async () => {
    try {
      const response = await axios.get('http://localhost:8081/diagnostics');
      setDiagnostics(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des diagnostics:', error);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  // Ajouter ou modifier un diagnostic
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(diagnosticData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      if (currentDiagnostic) {
        await axios.put(`http://localhost:8081/diagnostics/${currentDiagnostic.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire('Modification réussie!', 'Le diagnostic a été modifié avec succès.', 'success');
      } else {
        await axios.post('http://localhost:8081/diagnostics', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire('Ajout réussi!', 'Le diagnostic a été ajouté avec succès.', 'success');
      }
      fetchDiagnostics();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la soumission du diagnostic:', error.response ? error.response.data : error.message);
      Swal.fire('Erreur', error.response ? error.response.data.message : 'Erreur lors de la soumission du diagnostic.', 'error');
    }
  };

  // Fonction pour éditer un diagnostic
  const handleEdit = (diagnostic) => {
    setCurrentDiagnostic(diagnostic);
    setDiagnosticData({
      id_pont: diagnostic.id_pont,
      date_diagnostic: diagnostic.date_diagnostic,
      partie_ouvrage: diagnostic.partie_ouvrage,
      degradation: diagnostic.degradation,
      intervention_a_faire: diagnostic.intervention_a_faire,
      Priorisation: diagnostic.Priorisation,
      etat_general: diagnostic.etat_general,
      photos: diagnostic.photos,
    });
    setIsModalOpen(true);
  };

  // Fonction pour supprimer un diagnostic
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas revenir en arrière!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8081/diagnostics/${id}`);
          Swal.fire('Supprimé!', 'Le diagnostic a été supprimé avec succès.', 'success');
          fetchDiagnostics();
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          Swal.fire('Erreur', 'Erreur lors de la suppression du diagnostic.', 'error');
        }
      }
    });
  };

  return (
    <div className="table-container">
      <h2>Gestion des Diagnostics</h2>
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
              <th>Id Pont</th>
              <th>Date</th>
              <th>Partie</th>
              <th>Dégradation</th>
              <th>Intervention</th>
              <th>Photos</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {diagnostics.map((diagnostic) => (
              <tr key={diagnostic.id}>
                <td>{diagnostic.id}</td>
                <td>{diagnostic.id_pont}</td>
                <td>{diagnostic.date_diagnostic}</td>
                <td>{diagnostic.partie_ouvrage}</td>
                <td>{diagnostic.degradation}</td>
                <td>{diagnostic.intervention_a_faire}</td>
                <td><img src={`http://localhost:8081/images/` + diagnostic.photos} alt=''/></td>
                <td>{diagnostic.etat_general}</td>
                <td>
                  <button onClick={() => handleEdit(diagnostic)} className="icon-button">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(diagnostic.id)} className="icon-button">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal pour ajouter/modifier un diagnostic */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>{currentDiagnostic ? 'Modifier un Diagnostic' : 'Ajouter un Diagnostic'}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="id_pont" placeholder="Id du Pont" value={diagnosticData.id_pont} onChange={handleInputChange} required />
          <input type="date" name="date_diagnostic" placeholder="Date de Diagnostic" value={diagnosticData.date_diagnostic} onChange={handleInputChange} required />
          <input type="text" name="partie_ouvrage" placeholder="Partie Ouvrage" value={diagnosticData.partie_ouvrage} onChange={handleInputChange} required />
          <input type="text" name="degradation" placeholder="Dégradation" value={diagnosticData.degradation} onChange={handleInputChange} required />
          <input type="text" name="intervention_a_faire" placeholder="Intervention à Faire" value={diagnosticData.intervention_a_faire} onChange={handleInputChange} required />
          <input type="text" name="Priorisation" placeholder="Priorisation" value={diagnosticData.Priorisation} onChange={handleInputChange} required />
          <input type="text" name="etat_general" placeholder="État Général" value={diagnosticData.etat_general} onChange={handleInputChange} required />
          <input type="file" name="photos" onChange={handleFileChange} />
          <button type="submit">{currentDiagnostic ? 'Modifier' : 'Ajouter'}</button>
          <button type="button" onClick={closeModal}>Annuler</button>
        </form>
      </Modal>
    </div>
  );
};

export default DiagnosticList;
