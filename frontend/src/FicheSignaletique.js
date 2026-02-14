import React, { useState, useEffect } from 'react';
import Modal from './Modal'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Fiches = () => {
    const [fiches, setFiches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFiche, setCurrentFiche] = useState(null);
    const [formData, setFormData] = useState({
        id_pont: '',
        longueur: '',
        largeur: '',
        hauteur: '',
        materiau: '',
        description: '',
        image: null
    });

    // Fetch fiches depuis l'API
    useEffect(() => {
        const fetchFiches = async () => {
            try {
                const response = await fetch('http://localhost:8081/fiches');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des fiches, statut : ' + response.status);
                }
                const data = await response.json();
                console.log(data);
                if (Array.isArray(data)) {
                    setFiches(data);
                } else {
                    console.error('La réponse n\'est pas un tableau');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des fiches :', error);
            }
        };
        fetchFiches();
    }, []);

    const openModal = () => {
        setCurrentFiche(null); 
        setIsModalOpen(true);
        setFormData({
            id_pont: '',
            longueur: '',
            largeur: '',
            hauteur: '',
            materiau: '',
            description: '',
            image: null
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0],
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { id_pont, longueur, largeur, hauteur, materiau, description, image } = formData;
        if (!id_pont || !longueur || !largeur || !hauteur || !materiau || !description) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('id_pont', id_pont);
        formDataToSend.append('longueur', longueur);
        formDataToSend.append('largeur', largeur);
        formDataToSend.append('hauteur', hauteur);
        formDataToSend.append('materiau', materiau);
        formDataToSend.append('description', description);
        if (image) {
            formDataToSend.append('image', image);
        }

        try {
            const response = await fetch('http://localhost:8081/fiches', {
                method: currentFiche ? 'PUT' : 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                const createdFiche = await response.json();
                setFiches(currentFiche
                    ? fiches.map(f => f.id === currentFiche.id ? createdFiche : f)
                    : [...fiches, createdFiche]
                );
                closeModal();
            } else {
                console.error('Erreur lors de l\'ajout ou de la modification de la fiche');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleEdit = (fiche) => {
        setCurrentFiche(fiche);
        setFormData(fiche);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8081/fiches/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setFiches(fiches.filter(f => f.id !== id));
            } else {
                console.error('Erreur lors de la suppression de la fiche');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return (
        <div>
      <header>Gestion des fiches signalétiques</header>
        <div className="table-container">
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
                            <th>Longueur</th>
                            <th>Largeur</th>
                            <th>Hauteur</th>
                            <th>Matériau</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(fiches) && fiches.map(fiche => (
                            <tr key={fiche.id}>
                                <td>{fiche.id}</td>
                                <td>{fiche.id_pont}</td>
                                <td>{fiche.longueur}</td>
                                <td>{fiche.largeur}</td>
                                <td>{fiche.hauteur}</td>
                                <td>{fiche.materiau}</td>
                                <td>{fiche.description}</td>
                                <td>
                                    {fiche.image && (
                                        <img src={`http://localhost:8081/uploads/${fiche.image}`} alt="Fiche" style={{ width: '50px', height: '50px' }} />
                                    )}
                                </td>
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
                        <h2>{currentFiche ? 'Modifier la fiche' : 'Ajouter une fiche'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="id_pont">ID Pont</label>
                                <input type="number" id="id_pont" value={formData.id_pont} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="longueur">Longueur (m)</label>
                                <input type="number" id="longueur" value={formData.longueur} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="largeur">Largeur (m)</label>
                                <input type="number" id="largeur" value={formData.largeur} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="hauteur">Hauteur (m)</label>
                                <input type="number" id="hauteur" value={formData.hauteur} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="materiau">Matériau</label>
                                <input type="text" id="materiau" value={formData.materiau} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" value={formData.description} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Image</label>
                                <input type="file" id="image" onChange={handleFileChange} />
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
        </div>
    );
};

export default Fiches;
