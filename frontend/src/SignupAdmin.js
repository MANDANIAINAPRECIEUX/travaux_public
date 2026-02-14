import React, { useState } from "react";
import './LoginForm.css';
import { useNavigate } from "react-router-dom";
import Validation from "./SignupValidation";
import axios from "axios";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { BsPersonPlusFill } from "react-icons/bs";
import mtpi from './Assets/mtpi.jpg'; // Remplacez par le chemin de votre image
import Swal from 'sweetalert2'; // Import de SweetAlert2

function SignupAdmin() {
    const [values, setValues] = useState({
        nom: '',
        role: '',
        email: '',
        motdepasse: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            console.log(values);
            axios.post('http://localhost:8081/admin', values)
                .then(res => {
                    console.log(res.data);
                    Swal.fire({ // Sweet Alert pour succès
                        icon: 'success',
                        title: 'Inscription réussie',
                        text: 'Vous avez été inscrit avec succès!',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/admin'); // Redirection après la confirmation de l'alerte
                    });
                })
                .catch(err => {
                    console.log(err);
                    Swal.fire({ // Sweet Alert pour erreur
                        icon: 'error',
                        title: 'Erreur d\'inscription',
                        text: 'Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.',
                        confirmButtonText: 'OK'
                    });
                });
        }
    };

    return (
        <div className='global'>
            <div className='wrapper' style={{ width: '420px', height: '600px' }}>
                <div className='form-box login'>
                    <center>
                        <img
                            src={mtpi} // Utilisez le chemin vers votre image ici
                            alt="Profile"
                            className="img-fluid rounded-circle mb-3"
                            style={{ width: '120px', height: '120px', margin: '0 auto' }}
                        />
                    </center>
                    <h2 className="hi">S'inscrire(Admin)</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='input-box'>
                            <input
                                type="text"
                                placeholder="Entrer votre nom"
                                name="nom"
                                onChange={handleInput}
                            />
                            <FaUser className='icon' />
                        </div>
                        {errors.nom && <span className="text-danger">{errors.nom}</span>}
                        <div className='input-box'>
                <input type="text" placeholder="Entrer votre rôle" name="role" onChange={handleInput} required />
                            <BsPersonPlusFill className='icon' />
                        </div>
                        {errors.role && <span className="text-danger">{errors.role}</span>}
                        <div className='input-box'>
                            <input
                                type="email"
                                placeholder="Entrer votre email"
                                name="email"
                                onChange={handleInput}
                                required
                            />
                            <FaEnvelope className='icon' />
                        </div>
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                        <div className='input-box'>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Entrer votre mot de passe"
                                name="motdepasse"
                                onChange={handleInput}
                            />
                            <FaLock className='icon' />
                        </div>
                        <div className='remember-forgot'>
                            <label htmlFor="showPassword">
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                Afficher le mot de passe
                            </label>
                            {errors.motdepasse && <span className="text-danger">{errors.motdepasse}</span>}
                        </div>
                        <button type="submit"> S'inscrire </button>
                        <div className='register-link'>
                            <p>Avez-vous déjà un compte? <a href="/admin"> Se connecter</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignupAdmin;
