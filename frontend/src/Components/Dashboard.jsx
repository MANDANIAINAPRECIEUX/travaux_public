import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrement des composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Overview() {
    // États pour stocker les données du backend
    const [totalPonts, setTotalPonts] = useState(0);
    //const [diagnosticsRecents, setDiagnosticsRecents] = useState(null);
    //const [interventionsAVenir, setInterventionsAVenir] = useState(null);
    const [error, setError] = useState(null);
    // Fonction pour récupérer les statistiques

        const fetchTotalPont = async () => {
            try {
                // Appel pour le nombre total de ponts
                const pontsResponse = await axios.get('http://localhost:8081/totalPont');
                setTotalPonts(pontsResponse.data.totalPonts);

            } catch (error) {
                console.error("Erreur lors de la récupération des Ponts :", error);
            }
        };

useEffect(() =>{
    fetchTotalPont();
}, []);

    // Données pour le graphique en barres
    const data = {
        labels: ['Total Ponts', 'Diagnostics Récents', 'Interventions à Venir'],
        datasets: [
            {
                label: 'Statistiques des Ponts',
                data: [
                    
                    
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <Grid container spacing={3}>
            {error && (
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: '16px', backgroundColor: '#f8d7da' }}>
                        <Typography variant="h6" color="error">{error}</Typography>
                    </Paper>
                </Grid>
            )}
            <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ padding: '16px' }}>
                    <Typography variant="h5">Total Ponts</Typography>
                    <Typography variant="h2">
                        {totalPonts} 4
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ padding: '16px' }}>
                    <Typography variant="h5">Diagnostics récents</Typography>
                    <Typography variant="h2">
                        10
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ padding: '16px' }}>
                    <Typography variant="h5">Interventions à venir</Typography>
                    <Typography variant="h2">
                        12
                    </Typography>
                </Paper>
            </Grid>
            {/* Graphique en barres pour visualiser les données */}
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: '16px' }}>
                    <Typography variant="h5" gutterBottom>Statistiques des Ponts</Typography>
                    <Bar data={data} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Nombre'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Catégories'
                                }
                            }
                        }
                    }} />
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Overview;
