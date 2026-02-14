import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBridge, faStethoscope, faTools, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const DashboardAdmin = () => {
  const [totals, setTotals] = useState({
    totalPonts: 0,
    totalDiagnostics: 0,
    totalInterventions: 0,
    totalUtilisateurs: 0
  });
  const navigate = useNavigate();
  const [interventionsParAnnee, setInterventionsParAnnee] = useState([]);

  useEffect(() => {
    fetchData();
    fetchInterventionsParAnnee();
  }, []);
  
  const fetchData = async () => {
    try {
      const pontsResponse = await fetch('http://localhost:8081/pontis');
      const diagnosticsResponse = await fetch('http://localhost:8081/dio');
      const interventionsResponse = await fetch('http://localhost:8081/ino');
      const utilisateursResponse = await fetch('http://localhost:8081/utilisateursCount'); // Pour le total des utilisateurs

      if (pontsResponse.ok && diagnosticsResponse.ok && interventionsResponse.ok && utilisateursResponse.ok) {
        const pontsData = await pontsResponse.json();
        const diagnosticsData = await diagnosticsResponse.json();
        const interventionsData = await interventionsResponse.json();
        const utilisateursData = await utilisateursResponse.json();

        setTotals({
          totalPonts: pontsData[0]['COUNT(*)'],
          totalDiagnostics: diagnosticsData[0]['COUNT(*)'],
          totalInterventions: interventionsData[0]['COUNT(*)'],
          totalUtilisateurs: utilisateursData[0]['COUNT(*)'] // Total des utilisateurs
        });
      } else {
        throw new Error('Erreur lors de la récupération des données');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  const fetchInterventionsParAnnee = async () => {
    try {
      const response = await fetch('http://localhost:8081/interventions/par-annee');
      if (response.ok) {
        const data = await response.json();
        setInterventionsParAnnee(data);
      } else {
        throw new Error('Erreur lors de la récupération des interventions par année');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCardClick = (card) => {
    if (card === 'ponts') {
      navigate('/table');  // Redirige vers la page des ponts
    }
    if (card === 'diagnostics') {
      navigate('/diagno');
    }
    if (card === 'interventions') {
      navigate('/intervention');
    }
    if (card === 'utilisateurs') {
      navigate('/utilisateur');  // Redirige vers la page des utilisateurs
    }
  };

  // Préparation des données pour le graphique
  const chartData = {
    labels: interventionsParAnnee.map(item => item.annee),
    datasets: [
      {
        label: 'Nombre d\'interventions',
        data: interventionsParAnnee.map(item => item.total_interventions),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre d’interventions'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Année'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Nombre d\'interventions par année'
      }
    }
  };
  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.statsContainer}>
        <div style={styles.card} onClick={() => handleCardClick('ponts')}>
          <FontAwesomeIcon icon={faBridge} size="3x" style={styles.icon} />
          <div style={styles.cardContent}>
            <h3>Ponts</h3>
            <p className="sizeText">{totals.totalPonts}</p>
          </div>
        </div>
        <div style={styles.card} onClick={() => handleCardClick('diagnostics')}>
          <FontAwesomeIcon icon={faStethoscope} size="3x" style={styles.icon} />
          <div style={styles.cardContent}>
            <h3>Diagnostiques</h3>
            <p className="sizeText">{totals.totalDiagnostics}</p>
          </div>
        </div>
        <div style={styles.card} onClick={() => handleCardClick('interventions')}>
          <FontAwesomeIcon icon={faTools} size="3x" style={styles.icon} />
          <div style={styles.cardContent}>
            <h3>Interventions</h3>
            <p className="sizeText">{totals.totalInterventions}</p>
          </div>
        </div>
        <div style={styles.card} onClick={() => handleCardClick('utilisateurs')}>
          <FontAwesomeIcon icon={faUserCog} size="3x" style={styles.icon} />
          <div style={styles.cardContent}>
            <h3>Utilisateurs</h3>
            <p className="sizeText">{totals.totalUtilisateurs}</p>
          </div>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <h2>Nombre total d'interventions</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

// Styles inchangés
const styles = {
  dashboardContainer: {
    padding: '20px',
    backgroundColor: 'white',
    minHeight: '100vh'
  },
  dashboardHeader: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2rem'
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 6px darkred',
    padding: '20px',
    width: '250px',
    textAlign: 'center',
    margin: '10px',
    cursor: 'pointer'
  },
  icon: {
    color: '#4CAF50'
  },
  cardContent: {
    marginTop: '10px',
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '30px',
    boxShadow: '0 2px 8px darkred'
  }
};

export default DashboardAdmin;
