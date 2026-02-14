import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const TableUtilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUtilisateur, setCurrentUtilisateur] = useState(null);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const [searchNom, setSearchNom] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const response = await fetch('http://localhost:8081/utilisateurs');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }
      const data = await response.json();
      setUtilisateurs(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUtilisateur(null);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const utilisateurData = { nom, email, role };

    try {
      if (currentUtilisateur) {
        const response = await fetch(`http://localhost:8081/utilisateurs/${currentUtilisateur.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(utilisateurData),
        });
        if (response.ok) {
          await fetchUtilisateurs();
          closeModal();
          Swal.fire('Succès', 'Utilisateur modifié avec succès.', 'success');
        } else {
          throw new Error('Erreur lors de la modification');
        }
      } else {
        const response = await fetch('http://localhost:8081/utilisateurs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(utilisateurData),
        });
        if (response.ok) {
          await fetchUtilisateurs();
          closeModal();
          Swal.fire('Succès', 'Utilisateur ajouté avec succès.', 'success');
        } else {
          throw new Error('Erreur lors de l\'ajout');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire('Erreur', 'Une erreur est survenue.', 'error');
    }
  };

  const handleEdit = (utilisateur) => {
    setCurrentUtilisateur(utilisateur);
    setNom(utilisateur.nom);
    setEmail(utilisateur.email);
    setRole(utilisateur.role);
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
          const response = await fetch(`http://localhost:8081/utilisateurs/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            await fetchUtilisateurs();
            Swal.fire('Supprimé!', 'L’utilisateur a été supprimé avec succès.', 'success');
          } else {
            throw new Error('Erreur lors de la suppression');
          }
        } catch (error) {
          Swal.fire('Erreur', 'Erreur lors de la suppression.', 'error');
        }
      }
    });
  };

  const filteredUtilisateurs = utilisateurs.filter((utilisateur) => {
    const matchesNom = searchNom === '' || utilisateur.nom.toLowerCase().includes(searchNom.toLowerCase());
    const matchesEmail = searchEmail === '' || utilisateur.email.toLowerCase().includes(searchEmail.toLowerCase());
    return matchesNom && matchesEmail;
  });

  const indexOfLastUtilisateur = currentPage * itemsPerPage;
  const indexOfFirstUtilisateur = indexOfLastUtilisateur - itemsPerPage;
  const currentUtilisateurs = filteredUtilisateurs.slice(indexOfFirstUtilisateur, indexOfLastUtilisateur);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <header className="header">
        <div className="header-title">Gestion des Utilisateurs</div>
        <div className="user-menu">
          <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
        </div>
      </header>
      <br />
      <div className="table-container">
        <div className="table-actions">
        </div>
        <div className="search-container">
        <label className='abel'>
            Rechercher par Nom :
            <input
             className='put'
              type="text"
              value={searchNom}
              onChange={(e) => setSearchNom(e.target.value)}
              placeholder="Nom"
            />
          </label>
          <label className='abel'>
            Rechercher par Email :
            <input
            className='put'
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Email"
            />
          </label>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUtilisateurs.map((utilisateur) => (
                <tr key={utilisateur.id}>
                  <td>{utilisateur.id}</td>
                  <td>{utilisateur.nom}</td>
                  <td>{utilisateur.email}</td>
                  <td>{utilisateur.role}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleEdit(utilisateur)} className="icon-button">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => handleDelete(utilisateur.id)} className="icon-button">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Précédent
          </button>
          {Array.from({ length: Math.ceil(filteredUtilisateurs.length / itemsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredUtilisateurs.length / itemsPerPage)}
          >
            Suivant
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="form-container">
          <h2>{currentUtilisateur ? 'Modifier un Utilisateur' : 'Ajouter un Utilisateur'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom</label>
              <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Rôle</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required />
            </div>
            <div className="form-buttons">
            <button type="submit" className="submit-button">Envoyer</button>
            <button onClick={closeModal} className="cancel-button">Annuler</button>
            </div>
          </form>
        </div>
      </Modal>
      
      {/* Footer */}
<footer className="footer">
  <p>Ministère des Travaux Publics</p>
</footer>
    </div>
  );
};

export default TableUtilisateurs;
