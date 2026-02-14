import React, { useState } from "react";
import './LoginForm.css'; // Utiliser le même fichier CSS pour garder le même style
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLock, FaEnvelope } from "react-icons/fa";
import mtpi from './Assets/mtpi.jpg';

function LoginAdmin() {
    const [values, setValues] = useState({
        email: '',
        motdepasse: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("http://localhost:8081/admins", { email: values.email, motdepasse: values.motdepasse })
        .then((res) => {
            console.log(res.data);
            // Vérifiez le rôle de l'utilisateur et redirigez en conséquence
            if (res.data.email === 'admin@gmail.com') {
                navigate("/dashboardadmin"); // Redirigez l'admin vers la page des utilisateurs
            } else {
                navigate("/dashboardadmin"); // Autres utilisateurs redirigés vers le tableau de bord
            }
        })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    setErrors({ motdepasse: 'Mot de passe incorrect' });
                } else {
                    console.error(err);
                    setErrors({ motdepasse: 'Erreur de connexion. Veuillez réessayer.' });
                }
            });
    };

    const handleForgotPassword = () => {
        navigate("/ForgotPassword");
    };

    const handleGoToDashboardAdmin = () => {
        navigate("/"); // Redirige vers la page DashboardAdmin
    };

    return (
        <div className='global'>
                        {/* Bouton en haut à droite */}
            <div className="go-to-admin">
                <button className="admin-dashboard-btn" onClick={handleGoToDashboardAdmin}>
                    Accéder compte utilisateur
                </button>
            </div>
            <div className='wrapper'>
                <div className='form-box login'>
                    <center>
                        <img 
                            src={mtpi} 
                            alt="Profile" 
                            className="img-fluid rounded-circle mb-3"
                            style={{ width: '150px', height: '150px', margin: '0 auto' }}
                        />
                    </center>
                    <h2 className="h">Se Connecter (Admin)</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='input-box'>
                            <input
                                type="email"
                                placeholder="Entrer votre email"
                                name="email"
                                onChange={handleInput}  
                                required
                            />
                            <FaEnvelope className='icon'/>
                        </div>
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                        <div className='input-box'>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Entrer votre mot de passe"
                                name="motdepasse"
                                onChange={handleInput}  
                                required
                            />
                            <FaLock className='icon'/>
                        </div>
                        <div className='remember-forgot'>
                            <label htmlFor="showPassword">
                                <input 
                                    type="checkbox" 
                                    id="showPassword" 
                                    checked={showPassword} 
                                    onChange={() => setShowPassword(!showPassword)}
                                /> Afficher le mot de passe
                            </label>
                            {errors.motdepasse && <span className="text-danger">{errors.motdepasse}</span>}
                        </div>
                        <button type="submit">Se connecter</button>
                        <p className="phraseMot" onClick={handleForgotPassword} style={{ cursor: 'pointer', textAlign: 'center' }} >
                            Mot de passe oublié ?
                        </p>
                        <div className='register-link'>
                            <p>Vous n'avez pas de compte? <a href="/SignAdmin" > Créer un compte</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginAdmin;
