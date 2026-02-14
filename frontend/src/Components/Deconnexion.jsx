import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Assurez-vous d'installer sweetalert2

const Deconnexion = () => {
    const navigate = useNavigate(); // Utilisez useNavigate à la place de useHistory

    const handleLogout = () => {
        // Effacez les informations de session, cookies, ou tout autre mécanisme de stockage utilisé
        localStorage.removeItem('user'); // Remplacez 'user' par la clé appropriée
        sessionStorage.clear(); // Efface toutes les données de session

        // Affichez une alerte de confirmation
        Swal.fire({
            title: 'Déconnexion réussie!',
            text: 'Vous avez été déconnecté avec succès.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Redirigez vers la page de connexion ou la page d'accueil
            navigate('/'); // Utilisez navigate pour rediriger
        });
    };

    return (
        <div className="deconnexion-container">
            <div className="deconnexion-card">
                <h2 className="deconnexion-title">Déconnexion</h2>
                <p className="deconnexion-message">
                    Êtes-vous sûr de vouloir vous déconnecter ?
                </p>
                <button className="logout-button" onClick={handleLogout}>
                    Oui, me déconnecter
                </button>
            </div>
        </div>
    );
};

export default Deconnexion;
