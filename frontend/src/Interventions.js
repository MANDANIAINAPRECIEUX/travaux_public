import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const Interventions = () => {
  const [interventions, setInterventions] = useState([]);
  const [ponts, setPonts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentIntervention, setCurrentIntervention] = useState(null);
  const [viewIntervention, setViewIntervention] = useState(null); // État pour afficher les données
  const [idPont, setIdPont] = useState('');
  const [dateIntervention, setDateIntervention] = useState('');
  const [typeIntervention, setTypeIntervention] = useState('');
  const [description, setDescription] = useState('');
  const [cout, setCout] = useState('');
  

  const [searchDateIntervention, setSearchDateIntervention] = useState('');
  const [searchTypeIntervention, setSearchTypeIntervention] = useState('');

   // Pagination
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage] = useState(4); // Nombre d'éléments par page

  // Fonction pour formater la date au format 'YYYY-MM-DD'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatDateEnLettres = (dateStr) => {
    const moisEnLettres = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
  
    const date = new Date(dateStr);
    const jour = date.getDate();
    const mois = moisEnLettres[date.getMonth()];
    const annee = date.getFullYear();
  
    return `${jour} ${mois} ${annee}`;
  };

  // Fonction pour récupérer les ponts depuis l'API
  useEffect(() => {
    fetchInterventions(); // Appel à la fonction pour charger les ponts depuis la base de données
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


  const fetchInterventions = async () => {
    try {
      const response = await fetch('http://localhost:8081/intervention');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des fiches des diagnostics');
      }
      const data = await response.json();
      setInterventions(data); // Mise à jour de l'état local avec les données récupérées de l'API
    } catch (error) {
      console.error('Erreur lors de la récupération des interventions:', error);
    }
  };

  // Fonction pour ouvrir le modal pour ajouter un pont
  const openModal = () => {
    setCurrentIntervention(null);
    setIdPont('');
    setDateIntervention('');
    setTypeIntervention('');
    setDescription('');
    setCout('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentIntervention(null);
    setViewIntervention(null); // Ferme la modal de visualisation
    setIsViewModalOpen(false);
  };

  const handleView = (intervention) => {
    setViewIntervention(intervention);
    setIsViewModalOpen(true);  // Ouvre le modal de visualisation
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newIntervention = {
      idPont,
      dateIntervention,
      typeIntervention,
      description,
      cout,
    };

    try {
      if (currentIntervention) {
        // Modification d'un pont existant
        const response = await fetch(`http://localhost:8081/intervention/${currentIntervention.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newIntervention),
        });

        if (response.ok) {
          // Recharger les ponts après modification
          await fetchInterventions(); // Mettez à jour l'état local avec les données récupérées de l'API
          closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Modification réussie!',
            text: `L'intervention a été modifié avec succès.`,
          });
        } else {
          throw new Error('Erreur lors de la mise à jour de l\'interventions');
        }
      } else {
        // Ajout d'un nouveau pont
        const response = await fetch('http://localhost:8081/intervention', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newIntervention),
        });

        if (response.ok) {
          await fetchInterventions(); // Mettez à jour l'état local avec les données récupérées de l'API
          closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Ajout réussi!',
            text: `L'intervention a été ajouté avec succès.`,
          });
        } else {
          throw new Error('Erreur lors de l\'ajout d\'intervention');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la soumission d\'intervention.',
      });
    }
  };

  const handleEdit = (intervention) => {
    setCurrentIntervention(intervention);
    setIdPont(intervention.idPont);
    setDateIntervention(formatDate(intervention.dateIntervention));
    setTypeIntervention(intervention.typeIntervention);
    setDescription(intervention.description);
    setCout(intervention.cout);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8081/intervention/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            // Recharger les ponts après suppression
            await fetchInterventions(); // Mettez à jour l'état local avec les données récupérées de l'API
            Swal.fire('Supprimé!', 'L\'intervention a été supprimé avec succès.', 'success');
          } else {
            throw new Error('Erreur lors de la suppression d\'intervention');
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la suppression d\'intervention.',
          });
        }
      }
    });
  };

  // Filtrer les ponts selon les critères de recherche
  const filteredInterventions = interventions.filter((intervention) => {
    const matchesDateIntervention = searchDateIntervention === '' || intervention.dateIntervention.toLowerCase().includes(searchDateIntervention.toLowerCase());
    const matchesTypeIntervention = searchTypeIntervention === '' || intervention.typeIntervention.startsWith(searchTypeIntervention);
    return matchesDateIntervention && matchesTypeIntervention
  });

   // Calculer les éléments à afficher pour la page actuelle
   const indexOfLastIntervention = currentPage * itemsPerPage;
   const indexOfFirstIntervention = indexOfLastIntervention - itemsPerPage;
   const currentInterventions = filteredInterventions.slice(indexOfFirstIntervention, indexOfLastIntervention);
 
   // Gérer la navigation entre les pages
   const paginate = (pageNumber) => setCurrentPage(pageNumber);
 

  return (
    <div>
      <header className="header">
    <div className="header-title">Gestion des interventions</div>
    <div className="user-menu">
      <FontAwesomeIcon
        icon={faUserCircle}
        className="user-icon"
      />
    </div>
  </header>
      <br></br>
    <div className="table-container" style={{ paddingTop: '0' }}>
      
      <div className="table-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="small-button" onClick={openModal}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter
        </button>
      </div>

      {/* Champs de recherche */}
      <div className="search-container">
        <label className='abel'>
          Rechercher par Date d'intervention :
          <input
            className='put'
            type="Date"
            value={searchDateIntervention}
            onChange={(e) => setSearchDateIntervention(e.target.value)}
            placeholder="Date d'intervention"
          />
        </label>
        <label className='abel'>
          Rechercher par type d'intervention :
           <select className='elu'
                id="intervention"
                value={searchTypeIntervention}
                onChange={(e) => setSearchTypeIntervention(e.target.value)}
                required
              >
                <option value="">Tous les types</option>
                <option value="maintenance">Maintenance</option>
                <option value="réparation">Réparation</option>
              </select>
        </label>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>N° de pont</th>
              <th>Date d'intervention</th>
              <th>Type d'intervention</th>
              <th>Déscription</th>
              <th>Coût(Ar)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentInterventions.map((intervention) => (
              <tr key={intervention.id}>
                <td>{intervention.idPont}</td>
                <td>{formatDateEnLettres(intervention.dateIntervention)}</td>
                <td>{intervention.typeIntervention}</td>
                <td>{intervention.description}</td>
                <td>{intervention.cout} Ar</td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleView(intervention)} className="icon-button">
                        <FontAwesomeIcon icon={faEye} /> {/* Icône pour le bouton "Voir" */}
                      </button>
                    <button onClick={() => handleEdit(intervention)} className="icon-button">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDelete(intervention.id)} className="icon-button">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

 {/* Pagination */}
 <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Précédent
          </button>
          {Array.from({ length: Math.ceil(filteredInterventions.length / itemsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredInterventions.length / itemsPerPage)}>
            Suivant
          </button>
        </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="form-container">
          <h2>{currentIntervention ? 'Modifier un intervention' : 'Ajouter un intervention'}</h2>
          <form onSubmit={handleSubmit}>
          <div className="form-group">
                <label htmlFor="idPont">Identification de Pont</label>
                <select
                  id="idPont"
                  value={idPont}
                  onChange={(e) => setIdPont(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez un pont</option>
                  {ponts.map((pont) => (
                    <option key={pont.id} value={pont.id}>
                      {pont.id}
                    </option>
                  ))}
                </select>
              </div>
            <div className="form-group">
              <label htmlFor="date d'intervention">Date d'intervention</label>
              <input
                type="date"
                id="dateIntervention"
                value={dateIntervention}
                onChange={(e) => setDateIntervention(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="intervention">Type d'intervention</label>
              <select
                id="typeIntervention"
                value={typeIntervention}
                onChange={(e) => setTypeIntervention(e.target.value)}
                required
              >
                <option value="maintenance">Maintenance</option>
                <option value="réparation">Réparation</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="description">Déscription</label>
              <textarea
                type="text"
                id="déscription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div className="form-group">
              <label htmlFor="cout">Coût(Ar)</label>
              <input
                type="text"
                id="cout"
                value={cout}
                onChange={(e) => setCout(e.target.value)}
                required
              />
            </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-button">Envoyer</button>
              <button type="button" className="cancel-button" onClick={closeModal}>Annuler</button>
            </div>
          </form>
        </div>
      </Modal>

       {/* Modal de visualisation des données */}
     {viewIntervention && (
          <Modal isOpen={isViewModalOpen} onClose={closeModal}>
            <div className="form-container">
              <h2>Détails de l'intervention</h2>
              <p><strong>Identification de pont:</strong> {viewIntervention.idPont}</p>
              <p><strong>Date de l'intervention:</strong> {formatDateEnLettres(viewIntervention.dateIntervention)}</p>
              <p><strong>Type de l'intervention:</strong> {viewIntervention.typeIntervention}</p>
              <p><strong>Description:</strong> {viewIntervention.description}</p>
              <p><strong>Coût de l'intervention:</strong> {viewIntervention.cout} Ar</p>
              <div className="form-buttons">
              <button onClick={closeModal} className="cancel-button">Fermer</button>
              </div>
            </div>
          </Modal>
        )}
    </div>
      {/* Footer */}
<footer className="footer">
  <p>Ministère des Travaux Publics</p>
</footer>
    </div>
  );
};

export default Interventions;



