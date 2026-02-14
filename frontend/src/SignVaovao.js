import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';

const Signaletique = () => {
    const [signaletiques, setSignaletiques] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSignaletique, setCurrentSignaletique] = useState(null);
    const [idPont, setIdPont] = useState('');
    const [pkReference, setPkReference] = useState('');
    const [pkOuvrage, setPkOuvrage] = useState('');
    const [image, setImage] = useState(null);
    const [searchPkReference, setSearchPkReference] = useState('');

    // Récupérer les données des signalétiques
    useEffect(() => {
        fetchSignaletiques();
    }, []);

    const fetchSignaletiques = async () => {
        try {
            const response = await axios.get('/api/signaletique'); // Remplacez par l'URL de votre API
            setSignaletiques(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };

    const openModal = () => {
        setCurrentSignaletique(null);
        setIdPont('');
        setPkReference('');
        setPkOuvrage('');
        setImage(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentSignaletique(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('idPont', idPont);
        formData.append('pkReference', pkReference);
        formData.append('pkOuvrage', pkOuvrage);
        if (image) {
            formData.append('image', image);
        }

        try {
            if (currentSignaletique) {
                // Modification d'une signalétique existante
                const response = await axios.put(`/api/signaletique/${currentSignaletique.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    fetchSignaletiques();
                    closeModal();
                    Swal.fire('Succès!', 'La signalétique a été mise à jour avec succès.', 'success');
                }
            } else {
                // Ajout d'une nouvelle signalétique
                const response = await axios.post('/api/signaletique', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 201) {
                    fetchSignaletiques();
                    closeModal();
                    Swal.fire('Succès!', 'La signalétique a été ajoutée avec succès.', 'success');
                }
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout/modification:', error);
            Swal.fire('Erreur', 'Une erreur est survenue lors de la soumission.', 'error');
        }
    };

    const handleEdit = (signaletique) => {
        setCurrentSignaletique(signaletique);
        setIdPont(signaletique.idPont);
        setPkReference(signaletique.pkReference);
        setPkOuvrage(signaletique.pkOuvrage);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Cette action est irréversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`/api/signaletique/${id}`);
                    if (response.status === 200) {
                        fetchSignaletiques();
                        Swal.fire('Supprimé!', 'La signalétique a été supprimée.', 'success');
                    }
                } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                    Swal.fire('Erreur', 'Erreur lors de la suppression.', 'error');
                }
            }
        });
    };

    // Filtrer les signalétiques selon les critères de recherche
    const filteredSignaletiques = signaletiques.filter((signaletique) => {
        return (
            searchPkReference === '' || signaletique.pkReference.toLowerCase().includes(searchPkReference.toLowerCase())
        );
    });

    return (
        <div>
            <header>Gestion des Signalétiques</header>
            <div className="table-container" style={{ paddingTop: '0' }}>
                <div className="table-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="small-button" onClick={openModal}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter
                    </button>
                </div>

                {/* Champs de recherche */}
                <div className="search-container">
                    <label>
                        Rechercher par PK Référence :
                        <input
                            type="text"
                            value={searchPkReference}
                            onChange={(e) => setSearchPkReference(e.target.value)}
                            placeholder="PK Référence"
                        />
                    </label>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ID Pont</th>
                                <th>PK Référence</th>
                                <th>PK Ouvrage</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSignaletiques.map((signaletique) => (
                                <tr key={signaletique.id}>
                                    <td>{signaletique.id}</td>
                                    <td>{signaletique.idPont}</td>
                                    <td>{signaletique.pkReference}</td>
                                    <td>{signaletique.pkOuvrage}</td>
                                    <td>
                                        {signaletique.image && (
                                            <img src={signaletique.image} alt="Signalétique" style={{ width: '100px' }} />
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleEdit(signaletique)} className="icon-button">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button onClick={() => handleDelete(signaletique.id)} className="icon-button">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal pour ajouter ou modifier une signalétique */}
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className="form-container">
                        <h2>{currentSignaletique ? 'Modifier une signalétique' : 'Ajouter une signalétique'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="idPont">ID Pont</label>
                                <input
                                    type="text"
                                    id="idPont"
                                    value={idPont}
                                    onChange={(e) => setIdPont(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pkReference">PK Référence</label>
                                <input
                                    type="text"
                                    id="pkReference"
                                    value={pkReference}
                                    onChange={(e) => setPkReference(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pkOuvrage">PK Ouvrage</label>
                                <input
                                    type="text"
                                    id="pkOuvrage"
                                    value={pkOuvrage}
                                    onChange={(e) => setPkOuvrage(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    required
                                />
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="submit-button">Envoyer</button>
                                <button type="button" className="cancel-button" onClick={closeModal}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Signaletique;
