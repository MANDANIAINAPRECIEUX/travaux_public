import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal'; // Réutilisation du modal que vous avez utilisé pour les interventions
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const FicheDiagnostique = () => {
    const [fichesDiagnostiques, setFichesDiagnostiques] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFiche, setCurrentFiche] = useState(null);
    
    // Références des inputs
    const idPontRef = useRef(null);
    const dateDiagnosticRef = useRef(null);
    const etatGeneralRef = useRef(null);
    const observationsRef = useRef(null);
    const recommandationsRef = useRef(null);

    // Fetch fiches diagnostiques depuis l'API
    useEffect(() => {
        const fetchFichesDiagnostiques = async () => {
            try {
                const response = await fetch('http://localhost:8081/diagnostics');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des fiches, statut : ' + response.status);
                }
                const data = await response.json();
                setFichesDiagnostiques(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des fiches diagnostiques :', error);
            }
        };

        fetchFichesDiagnostiques();
    }, []);

    const openModal = () => {
        setCurrentFiche(null); // Pour ajouter une nouvelle fiche
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        idPontRef.current.value = '';
        dateDiagnosticRef.current.value = '';
        etatGeneralRef.current.value = '';
        observationsRef.current.value = '';
        recommandationsRef.current.value = '';
    };

    // Fonction pour soumettre et ajouter ou modifier une fiche
    const handleSubmit = async (event) => {
        event.preventDefault();

        const ficheData = {
            id_pont: idPontRef.current.value,
            date_diagnostic: dateDiagnosticRef.current.value,
            etat_general: etatGeneralRef.current.value,
            observations: observationsRef.current.value,
            recommandations: recommandationsRef.current.value,
        };

        if (!ficheData.id_pont || !ficheData.date_diagnostic || !ficheData.etat_general) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/diagnostics${currentFiche ? `/${currentFiche.id}` : ''}`, {
                method: currentFiche ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ficheData),
            });

            if (response.ok) {
                const createdFiche = await response.json();
                setFichesDiagnostiques(currentFiche
                    ? fichesDiagnostiques.map(f => f.id === currentFiche.id ? createdFiche : f)
                    : [...fichesDiagnostiques, createdFiche]
                );
                closeModal();
            } else {
                console.error('Erreur lors de l\'ajout ou de la modification de la fiche diagnostique');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleEdit = (fiche) => {
        setCurrentFiche(fiche);
        setIsModalOpen(true);
        if (fiche) {
            idPontRef.current.value = fiche.id_pont;
            dateDiagnosticRef.current.value = fiche.date_diagnostic;
            etatGeneralRef.current.value = fiche.etat_general;
            observationsRef.current.value = fiche.observations;
            recommandationsRef.current.value = fiche.recommandations;
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8081/diagnostics/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setFichesDiagnostiques(fichesDiagnostiques.filter(f => f.id !== id));
            } else {
                console.error('Erreur lors de la suppression de la fiche diagnostique');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return (
        <div className="table-container">
            <h2>Gestion des Fiches Diagnostiques</h2>

            <div className="table-actions">
                <button className="small-button" onClick={openModal}>
                    <FontAwesomeIcon icon={faPlus} /> Ajouter
                </button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Pont</th>
                            <th>Date du Diagnostic</th>
                            <th>État Général</th>
                            <th>Observations</th>
                            <th>Recommandations</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(fichesDiagnostiques) && fichesDiagnostiques.map(fiche => (
                            <tr key={fiche.id}>
                                <td>{fiche.id}</td>
                                <td>{fiche.id_pont}</td>
                                <td>{fiche.date_diagnostic}</td>
                                <td>{fiche.etat_general}</td>
                                <td>{fiche.observations}</td>
                                <td>{fiche.recommandations}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleEdit(fiche)} className="icon-button">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button onClick={() => handleDelete(fiche.id)} className="icon-button">
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
                        <h2>{currentFiche ? 'Modifier la fiche diagnostique' : 'Ajouter une fiche diagnostique'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="id_pont">ID Pont</label>
                                <input type="number" id="id_pont" ref={idPontRef} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date_diagnostic">Date du Diagnostic</label>
                                <input type="date" id="date_diagnostic" ref={dateDiagnosticRef} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="etat_general">État Général</label>
                                <input type="text" id="etat_general" ref={etatGeneralRef} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="observations">Observations</label>
                                <textarea id="observations" ref={observationsRef} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="recommandations">Recommandations</label>
                                <textarea id="recommandations" ref={recommandationsRef} />
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

export default FicheDiagnostique;
