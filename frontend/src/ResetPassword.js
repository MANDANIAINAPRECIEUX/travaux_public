import React, { useState } from "react";
import './LoginForm.css';
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import mtpi from './Assets/mtpi.jpg';

function ResetPassword() {
    const { token } = useParams();  // Vous recevez ici le token, qui pourrait être un OTP ou un JWT.
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Si vous utilisez un OTP, vous pourriez envoyer { otp, newPassword }
        axios.post("http://localhost:8081/reset-password", { token, newPassword })
            .then((res) => {
                setMessage(res.data.message);
                setError('');
            })
            .catch((err) => {
                if (err.response) {
                    setError(err.response.data);  // Affiche l'erreur retournée par le backend
                } else {
                    setError("Erreur du serveur");
                }
                setMessage('');
            });
    };

    return (
        <div className='global'>
            <div className='wrapper'>
                <div className='form-box login'>
                    <center>
                        <img 
                            src={mtpi} 
                            alt="Profile" 
                            className="img-fluid rounded-circle mb-3"
                            style={{ width: '100px', height: '100px', margin: '0 auto' }}
                        />
                    </center>
                    <h2>Réinitialiser le mot de passe</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='input-box'>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nouveau mot de passe"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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
                        </div>
                        <button type="submit">Réinitialiser le mot de passe</button>
                    </form>
                    {message && <p>{message}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
