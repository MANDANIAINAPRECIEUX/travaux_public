import React from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2'; // Assurez-vous d'installer sweetalert2

const Deconnexion = () => {
    const history = useHistory();

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
            history.push('/login'); // Assurez-vous d'avoir une route vers la page de connexion
        });
    };

    return (
        <div className="deconnexion-container">
            <h2>Déconnexion</h2>
            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <button className="logout-button" onClick={handleLogout}>
                Déconnexion
            </button>
        </div>
    );
};

export default Deconnexion;
