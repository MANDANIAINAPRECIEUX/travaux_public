import React, { useState, useEffect } from 'react';
import Modal from './Modal';  // Réutilisation du modal que vous avez utilisé pour les ponts
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'; // Import de SweetAlert2

const GestionIntervention = () => {
    const [interventions, setInterventions] = useState([]);
    const [filteredInterventions, setFilteredInterventions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIntervention, setCurrentIntervention] = useState(null);
    
    const [dateIntervention, setDateIntervention] = useState('');
    const [typeIntervention, setTypeIntervention] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        fetch('http://localhost:8081/interventions')
            .then(response => response.json())
            .then(data => {
                setInterventions(data);
                setFilteredInterventions(data);
            })
            .catch(error => console.error('Erreur lors de la récupération des interventions :', error));
    }, []);

    const handleSearch = () => {
        const filtered = interventions.filter(intervention => {
            const matchesDate = dateIntervention ? formatDate(intervention.date_intervention) === dateIntervention : true;
            const matchesType = typeIntervention ? intervention.type_intervention === typeIntervention : true;
            return matchesDate && matchesType;
        });
        setFilteredInterventions(filtered);
    };

    const openModal = () => {
        setCurrentIntervention(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const idPont = document.getElementById('id_pont').value;
        const dateIntervention = document.getElementById('date_intervention').value;
        const typeIntervention = document.getElementById('type_intervention').value;
        const description = document.getElementById('description').value;
        const cout = document.getElementById('coût').value;

        if (!idPont || !dateIntervention || !typeIntervention || !cout) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error'); // Alerte SweetAlert pour les champs vides
            return;
        }

        const newIntervention = {
            id: currentIntervention ? currentIntervention.id : undefined, // Inclure l'ID lors de la modification
            id_pont: idPont,
            date_intervention: dateIntervention,
            type_intervention: typeIntervention,
            description: description,
            cout: parseFloat(cout)
        };

        try {
            const response = await fetch(`http://localhost:8081/interventions${currentIntervention ? `/${currentIntervention.id}` : ''}`, {
                method: currentIntervention ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newIntervention),
            });

            if (response.ok) {
                const createdIntervention = await response.json();
                setInterventions(currentIntervention
                    ? interventions.map(i => i.id === currentIntervention.id ? createdIntervention : i)
                    : [...interventions, createdIntervention]
                );
                setFilteredInterventions(currentIntervention
                    ? filteredInterventions.map(i => i.id === currentIntervention.id ? createdIntervention : i)
                    : [...filteredInterventions, createdIntervention]
                );
                closeModal();

                // Alerte SweetAlert pour succès
                Swal.fire('Succès', currentIntervention ? 'L\'intervention a été modifiée avec succès!' : 'L\'intervention a été ajoutée avec succès!', 'success');
            } else {
                const errorText = await response.text(); // Pour obtenir le message d'erreur du serveur
                console.error('Erreur lors de l\'ajout ou de la modification de l\'intervention:', errorText);
                Swal.fire('Erreur', 'Une erreur est survenue lors de l\'ajout ou de la modification: ' + errorText, 'error'); // Alerte SweetAlert pour erreur
            }
        } catch (error) {
            console.error('Erreur:', error);
            Swal.fire('Erreur', 'Une erreur est survenue.', 'error'); // Alerte SweetAlert pour erreur
        }
    };

    const handleEdit = (intervention) => {
        setCurrentIntervention(intervention);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Cette action est irréversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer!',
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:8081/interventions/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setInterventions(interventions.filter(i => i.id !== id));
                    setFilteredInterventions(filteredInterventions.filter(i => i.id !== id));

                    // Alerte SweetAlert pour succès de suppression
                    Swal.fire('Supprimé!', 'L\'intervention a été supprimée avec succès.', 'success');
                } else {
                    console.error('Erreur lors de la suppression de l\'intervention');
                    Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error'); // Alerte SweetAlert pour erreur
                }
            } catch (error) {
                console.error('Erreur:', error);
                Swal.fire('Erreur', 'Une erreur est survenue.', 'error'); // Alerte SweetAlert pour erreur
            }
        }
    };

    return (
        <div>
            <header>Gestion des Diagnostics</header>
        <div className="table-container">
            
            <div className="table-actions">
                <button className="small-button" onClick={openModal}>
                    <FontAwesomeIcon icon={faPlus} /> Ajouter
                </button>
            </div>
            {/* Champs de recherche */}
            <div className="search-container" style={{ display: 'flex', gap: '10px' }}>
                <input className='iput'
                    type="date"
                    value={dateIntervention}
                    onChange={(e) => setDateIntervention(e.target.value)}
                />
                <select className='elu'
                    value={typeIntervention}
                    onChange={(e) => setTypeIntervention(e.target.value)}
                >
                    <option value="">Tous les types</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="réparation">Réparation</option>
                </select>
                <button style={{ height: "40px", width: "60px", marginTop: "10px" }} className="small-button" onClick={handleSearch}><FontAwesomeIcon icon={faSearch} /></button>
            </div>
            
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Pont</th>
                            <th>Date Intervention</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Coût</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInterventions.map(intervention => (
                            <tr key={intervention.id}>
                                <td>{intervention.id}</td>
                                <td>{intervention.id_pont}</td>
                                <td>{formatDate(intervention.date_intervention)}</td>
                                <td>{intervention.type_intervention}</td>
                                <td>{intervention.description}</td>
                                <td>{intervention.cout} Ar</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
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

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className="form-containerExemple">
                        <h2>{currentIntervention ? 'Modifier l\'intervention' : 'Ajouter une intervention'}</h2>
                        <form onSubmit={handleSubmit}>
                        <div className='left'>
                            <div className="form-group">
                                <label htmlFor="id_pont">ID Pont</label>
                                <input type="number" id="id_pont" defaultValue={currentIntervention ? currentIntervention.id_pont : ''} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date_intervention">Date Intervention</label>
                                <input type="date" id="date_intervention" defaultValue={currentIntervention ? formatDate(currentIntervention.date_intervention) : ''} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="type_intervention">Type d'Intervention</label>
                                <select id="type_intervention" defaultValue={currentIntervention ? currentIntervention.type_intervention : ''} required>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="réparation">Réparation</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" defaultValue={currentIntervention ? currentIntervention.description : ''} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="coût">Coût</label>
                                <input type="number" id="coût" defaultValue={currentIntervention ? currentIntervention.cout : ''} required />
                            </div>
                            </div>
                            <div className='right'>
                            <div className="form-group">
                                <label htmlFor="id_pont">ID Pont</label>
                                <input type="number" id="id_pont" defaultValue={currentIntervention ? currentIntervention.id_pont : ''} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date_intervention">Date Intervention</label>
                                <input type="date" id="date_intervention" defaultValue={currentIntervention ? formatDate(currentIntervention.date_intervention) : ''} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="type_intervention">Type d'Intervention</label>
                                <select id="type_intervention" defaultValue={currentIntervention ? currentIntervention.type_intervention : ''} required>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="réparation">Réparation</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" defaultValue={currentIntervention ? currentIntervention.description : ''} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="coût">Coût</label>
                                <input type="number" id="coût" defaultValue={currentIntervention ? currentIntervention.cout : ''} required />
                            </div>
                            <div className="form-buttons">
                                <button type="submit" className="submit-button">Enregistrer</button>
                                <button type="button" className="cancel-button" onClick={closeModal}>Annuler</button> {/* Bouton Annuler */}
                            </div>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
        </div>
    );
};

export default GestionIntervention;
