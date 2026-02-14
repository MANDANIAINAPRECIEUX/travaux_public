import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Réutilisation du modal que vous avez utilisé pour les interventions
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Action = () => {
    const [actions, setActions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);

    // États pour la recherche
    const [searchUserId, setSearchUserId] = useState('');
    const [searchDate, setSearchDate] = useState('');

    // Fetch actions depuis l'API
    useEffect(() => {
        fetch('http://localhost:8081/actions')
            .then(response => response.json())
            .then(data => setActions(data))
            .catch(error => console.error('Erreur lors de la récupération des actions :', error));
    }, []);

    const openModal = () => {
        setCurrentAction(null); // On commence avec un formulaire vide pour une nouvelle action
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Fonction pour soumettre et ajouter une action
    const handleSubmit = async (event) => {
        event.preventDefault();

        const idUtilisateur = document.getElementById('id_utilisateur').value;
        const idPont = document.getElementById('id_pont').value;
        const actionDescription = document.getElementById('action').value;
        const dateAction = document.getElementById('date_action').value;

        if (!idUtilisateur || !idPont || !actionDescription || !dateAction) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        const newAction = {
            id_utilisateur: idUtilisateur,
            id_pont: idPont,
            action: actionDescription,
            date_action: dateAction
        };

        try {
            const response = await fetch('http://localhost:8081/actions', {
                method: currentAction ? 'PUT' : 'POST', // 'POST' pour créer et 'PUT' pour modifier
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAction),
            });

            if (response.ok) {
                const createdAction = await response.json();
                setActions(currentAction
                    ? actions.map(a => a.id === currentAction.id ? createdAction : a)
                    : [...actions, createdAction]
                );
                closeModal();
            } else {
                console.error('Erreur lors de l\'ajout ou de la modification de l\'action');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleEdit = (action) => {
        setCurrentAction(action);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8081/actions/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setActions(actions.filter(a => a.id !== id));
            } else {
                console.error('Erreur lors de la suppression de l\'action');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Filtrer les actions selon les critères de recherche
    const filteredActions = actions.filter(action => {
        const matchesUserId = searchUserId === '' || action.id_utilisateur.toString().includes(searchUserId);
        const matchesDate = searchDate === '' || action.date_action.startsWith(searchDate);
        return matchesUserId && matchesDate;
    });

    return (
        <div className="table-container">
            <h2>Gestion des Actions</h2>

           
            <div className="table-actions">
                <button className="small-button" onClick={openModal}>
                    <FontAwesomeIcon icon={faPlus} /> Ajouter
                </button>
            </div>
             {/* Champs de recherche */}
             <div className="search-container">
                <label className='abel'>
                    Rechercher par ID Utilisateur :
                    <input className='put'
                        type="text"
                        value={searchUserId}
                        onChange={(e) => setSearchUserId(e.target.value)}
                        placeholder="Numéro utilisateur"
                    />
                </label>
                <label className='abel'>
                    Rechercher par Date :
                    <input className='put'
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
                            <th>ID</th>
                            <th>ID Utilisateur</th>
                            <th>ID Pont</th>
                            <th>Action</th>
                            <th>Date Action</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredActions.map(action => (
                            <tr key={action.id}>
                                <td>{action.id}</td>
                                <td>{action.id_utilisateur}</td>
                                <td>{action.id_pont}</td>
                                <td>{action.action}</td>
                                <td>{action.date_action}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleEdit(action)} className="icon-button">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button onClick={() => handleDelete(action.id)} className="icon-button">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className="form-container">
                        <h2>{currentAction ? 'Modifier l\'action' : 'Ajouter une action'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label id='lab' htmlFor="id_utilisateur">ID Utilisateur</label>
                                <input type="number" id="id_utilisateur" defaultValue={currentAction ? currentAction.id_utilisateur : ''} required />
                            </div>
                            <div  className="form-group">
                                <label id='lab' htmlFor="id_pont">ID Pont</label>
                                <input type="number" id="id_pont" defaultValue={currentAction ? currentAction.id_pont : ''} required />
                            </div>
                            <div className="form-group">
                                <label id='lab' htmlFor="action">Action</label>
                                <input type="text" id="action" defaultValue={currentAction ? currentAction.action : ''} required />
                            </div>
                            <div className="form-group">
                                <label id='lab' htmlFor="date_action">Date d'Action</label>
                                <input type="datetime-local" id="date_action" defaultValue={currentAction ? currentAction.date_action : ''} required />
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="submit-button">Envoyer</button>
                                <button type="button" className="cancel-button" onClick={closeModal}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Action;
