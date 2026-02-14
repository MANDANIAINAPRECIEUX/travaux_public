import React, { useState } from "react";
import './LoginForm.css';
import axios from "axios";
import { FaEnvelope } from "react-icons/fa"
import mtpi from './Assets/mtpi.jpg';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);  // Contrôle les étapes: 1 = envoi OTP, 2 = validation OTP

    // Soumettre la demande d'OTP
    const handleSubmitEmail = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8081/forgot-password", { email })
            .then((res) => {
                setMessage(res.data.message);
                setError('');
                setStep(2);  // Passe à l'étape de saisie de l'OTP
            })
            .catch((err) => {
                if (err.response) {
                    setError(err.response.data);
                } else {
                    setError("Erreur du serveur");
                }
                setMessage('');
            });
    };

    // Soumettre le formulaire de réinitialisation du mot de passe
    const handleSubmitReset = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8081/reset-password", { email, otp, newPassword })
            .then((res) => {
                setMessage(res.data.message);
                setError('');
                // Vous pouvez rediriger l'utilisateur ou le laisser se reconnecter ici
            })
            .catch((err) => {
                if (err.response) {
                    setError(err.response.data);
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
                    <h2>Mot de passe oublié</h2>

                    {/* Étape 1 : Demande d'OTP */}
                    {step === 1 && (
                        <form onSubmit={handleSubmitEmail}>
                            <div className='input-box'>
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <FaEnvelope className='icon'/>
                            </div>
                            <button type="submit">Envoyer OTP</button>
                        </form>
                    )}

                    {/* Étape 2 : Validation de l'OTP et réinitialisation du mot de passe */}
                    {step === 2 && (
                        <form onSubmit={handleSubmitReset}>
                            <div className='input-box'>
                                <input
                                    type="text"
                                    placeholder="Entrez l'OTP reçu"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='input-box'>
                                <input
                                    type="password"
                                    placeholder="Nouveau mot de passe"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Réinitialiser le mot de passe</button>
                        </form>
                    )}

                    {message && <p>{message}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
