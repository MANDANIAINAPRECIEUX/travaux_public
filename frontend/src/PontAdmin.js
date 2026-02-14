import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './TablePont.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const TablePont = () => {
  const [ponts, setPonts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPont, setCurrentPont] = useState(null);
  const [viewPont, setViewPont] = useState(null); // État pour afficher les données
  const [nom, setNom] = useState('');
  const [viewUser, setViewUser] = useState(null); // État pour afficher les données
  const [user, setUser] = useState(null);
  const [localisation, setLocalisation] = useState('');
  const [type, setType] = useState('');
  const [dateConstruction, setDateConstruction] = useState('');

  const [searchNom, setSearchNom] = useState('');
  const [searchDate, setSearchDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Nombre d'éléments par page

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

  const toggleModal = () => {
    setViewUser(user); // Affecte les données utilisateur au modal
    setIsViewModalOpen(true); // Ouvre le modal
  };
  const handleLogout = () => {
    // Logique de déconnexion, par exemple supprimer les infos utilisateur du localStorage
    localStorage.removeItem("user"); // Si tu utilises localStorage pour stocker l'authentification
    window.location.reload(); // Recharger la page après la déconnexion
  };

  // Fonction pour formater la date au format 'YYYY-MM-DD'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Fonction pour récupérer les ponts depuis l'API
  useEffect(() => {
    fetchPonts(); // Appel à la fonction pour charger les ponts depuis la base de données
    fetchUserInfo();
  }, []);

  const fetchPonts = async () => {
    try {
      const response = await fetch('http://localhost:8081/ponts');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des ponts');
      }
      const data = await response.json();
      setPonts(data); 
    } catch (error) {
      console.error('Erreur lors de la récupération des ponts:', error);
    }
  };

  

  const fetchUserInfo = async () => {
    try {
        const userId = localStorage.getItem('userId'); // Stockez l'ID utilisateur dans localStorage après connexion
        const response = await fetch('http://localhost:8081/user', {
            headers: {
                'user-id': userId, // Passez l'ID utilisateur dans les en-têtes
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des informations utilisateur');
        }

        const data = await response.json();
        setUser(data); // Met à jour l'état avec les informations utilisateur
    } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
    }
};

  // Fonction pour ouvrir le modal pour ajouter un pont
  const openModal = () => {
    setCurrentPont(null);
    setNom('');
    setLocalisation('');
    setType('');
    setDateConstruction('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPont(null);
    setViewPont(null); // Ferme la modal de visualisation
    setIsViewModalOpen(false);

  };

  const handleView = (pont) => {
    setViewPont(pont);
    setIsModalOpen(true); // Ouvre la modal avec les détails du Pont sélectionné
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newPont = {
      nom,
      localisation,
      type,
      dateConstruction,
    };

    try {
      if (currentPont) {
        // Modification d'un pont existant
        const response = await fetch(`http://localhost:8081/ponts/${currentPont.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPont),
        });

        if (response.ok) {
          // Recharger les ponts après modification
          await fetchPonts(); // Mettez à jour l'état local avec les données récupérées de l'API
          closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Modification réussie!',
            text: `Le pont ${nom} a été modifié avec succès.`,
          });
        } else {
          throw new Error('Erreur lors de la mise à jour du pont');
        }
      } else {
        // Ajout d'un nouveau pont
        const response = await fetch('http://localhost:8081/ponts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPont),
        });

        if (response.ok) {
          await fetchPonts(); // Mettez à jour l'état local avec les données récupérées de l'API
          closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Ajout réussi!',
            text: `Le pont ${nom} a été ajouté avec succès.`,
          });
        } else {
          throw new Error('Erreur lors de l\'ajout du pont');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la soumission du pont.',
      });
    }
  };

  const handleEdit = (pont) => {
    setCurrentPont(pont);
    setNom(pont.nom);
    setLocalisation(pont.localisation);
    setType(pont.type);
    setDateConstruction(formatDate(pont.dateConstruction));
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
          const response = await fetch(`http://localhost:8081/ponts/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            // Recharger les ponts après suppression
            await fetchPonts(); // Mettez à jour l'état local avec les données récupérées de l'API
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

  // Filtrer les ponts selon les critères de recherche
  const filteredTablePont = ponts.filter((pont) => {
    const matchesNom = searchNom === '' || pont.nom.toLowerCase().includes(searchNom.toLowerCase());
    const matchesDate = searchDate === '' || pont.dateConstruction.startsWith(searchDate);
    return matchesNom && matchesDate;
  });

  // Calculer les éléments à afficher pour la page actuelle
  const indexOfLastPont = currentPage * itemsPerPage;
  const indexOfFirstPont = indexOfLastPont - itemsPerPage;
  const currentPonts = filteredTablePont.slice(indexOfFirstPont, indexOfLastPont);

  // Gérer la navigation entre les pages
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
    <header className="header">
    <div className="header-title">Gestion des Ponts</div>
    <div className="user-menu">
      <FontAwesomeIcon
        icon={faUserCircle}
        className="user-icon"
        onClick={toggleModal}
      />
         {isViewModalOpen && viewUser && (
  <Modal isOpen={isViewModalOpen} onClose={closeModal}>
    <div className="form-container">
      <h2>Informations de l'utilisateur</h2>
      <p><strong>Nom:</strong> {viewUser.name}</p>
      <p><strong>Email:</strong> {viewUser.email}</p>
      <p><strong>Rôle:</strong> {viewUser.role || 'Utilisateur standard'}</p>
      <div className="form-buttons">
        <button onClick={closeModal} className="cancel-button">Fermer</button>
        <button onClick={handleLogout} className="submit-button">Se déconnecter</button>
      </div>
    </div>
  </Modal>
)}
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
            Rechercher par Nom de Pont :
            <input
              className='put'
              type="text"
              value={searchNom}
              onChange={(e) => setSearchNom(e.target.value)}
              placeholder="Nom de Pont"
            />
          </label>
          <label className='abel'>
            Rechercher par Date :
            <input
              className='put'
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </label>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Identification</th>
                <th>Nom</th>
                <th>Localisation</th>
                <th>Type</th>
                <th>Date de Construction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPonts.map((pont) => (
                <tr key={pont.id}>
                  <td>{pont.id}</td>
                  <td>{pont.nom}</td>
                  <td>{pont.localisation}</td>
                  <td>{pont.type}</td>
                  <td>{formatDateEnLettres(pont.dateConstruction)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleView(pont)} className="icon-button">
                        <FontAwesomeIcon icon={faEye} /> {/* Icône pour le bouton "Voir" */}
                      </button>
                      <button onClick={() => handleEdit(pont)} className="icon-button">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => handleDelete(pont.id)} className="icon-button">
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
          {Array.from({ length: Math.ceil(filteredTablePont.length / itemsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredTablePont.length / itemsPerPage)}>
            Suivant
          </button>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="form-container">
            <h2>{currentPont ? 'Modifier un Pont' : 'Ajouter un Pont'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nom">Nom du Pont</label>
                <input type="text" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="localisation">Localisation</label>
                <input type="text" id="localisation" value={localisation} onChange={(e) => setLocalisation(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="type">Type de Pont</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value)} required >
                  <option value="béton armé">Béton Armé</option>
                  <option value="métallique">Métallique</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="dateConstruction">Date de Construction</label>
                <input type="date" id="dateConstruction" value={dateConstruction} onChange={(e) => setDateConstruction(e.target.value)} required />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">Envoyer</button>
                <button type="button" className="cancel-button" onClick={closeModal}>Annuler</button>
              </div>
            </form>
          </div>
        </Modal>
     {viewPont && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="form-container">
              <h2>Détails du Pont</h2>
              <p><strong>Identification:</strong> {viewPont.id}</p>
              <p><strong>Nom de pont:</strong> {viewPont.nom}</p>
              <p><strong>Localisation:</strong> {viewPont.localisation}</p>
              <p><strong>Type:</strong> {viewPont.type}</p>
              <p><strong>Date de construction:</strong> {formatDateEnLettres(viewPont.dateConstruction)}</p>
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

export default TablePont;
