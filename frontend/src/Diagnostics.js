import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faFilePdf,  faEye, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Assure-toi que cette bibliothèque est installée
import mtpi from './Assets/mtpi.jpg';

const Diagnostics = () => {
  const [diagnostics, setDiagnostics] = useState([]);
  const [ponts, setPonts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDiagnostic, setCurrentDiagnostic] = useState(null);
  const [viewDiagnostic, setViewDiagnostic] = useState(null); // État pour afficher les données
  const [idPont, setIdPont] = useState('');
  const [dateDiagnostic, setDateDiagnostic] = useState('');
  const [partieOuvrage, setPartieOuvrage] = useState('');
  const [degradation, setDegradation] = useState('');
  const [unite, setUnite] = useState('');
  const [quantite, setQuantite] = useState('');
  const [priorisation, setPriorisation] = useState('');

  const [searchPriorisation, setSearchPriorisation] = useState('');
  const [searchDateDiagnostic, setSearchDateDiagnostic] = useState('');

   // Pagination
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage] = useState(4); // Nombre d'éléments par page

  // Fonction pour formater la date au format 'YYYY-MM-DD'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  

  useEffect(() => {
    fetchDiagnostics(); // Appel à la fonction pour charger les ponts depuis la base de données
    fetchPonts();
  }, []);

  const fetchPonts = async () => {
    try {
      const response = await fetch('http://localhost:8081/pontes');
      if (!response.ok) throw new Error('Erreur lors de la récupération des ponts');
      const data = await response.json();
      setPonts(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des ponts:', error);
    }
  };

  const fetchDiagnostics = async () => {
    try {
      const response = await fetch('http://localhost:8081/diagnostic');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des fiches des diagnostics');
      }
      const data = await response.json();
      setDiagnostics(data); // Mise à jour de l'état local avec les données récupérées de l'API
    } catch (error) {
      console.error('Erreur lors de la récupération des fiches des diagnostics:', error);
    }
  };

  const openModal = () => {
    setCurrentDiagnostic(null);
    setIdPont('');
    setDateDiagnostic('');
    setPartieOuvrage('');
    setDegradation('');
    setUnite('');
    setQuantite('');
    setPriorisation('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDiagnostic(null);
    setViewDiagnostic(null); // Ferme la modal de visualisation
  };

  const handleView = (diagnostic) => {
    setViewDiagnostic(diagnostic);
    setIsModalOpen(true); // Ouvre la modal avec les détails du diagnostic sélectionné
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newDiagnostic = {
      idPont,
      dateDiagnostic,
      partieOuvrage,
      degradation,
      unite,
      quantite,
      priorisation,
    };

    try {
      if (currentDiagnostic) {
        // Modification d'un pont existant
        const response = await fetch(`http://localhost:8081/diagnostic/${currentDiagnostic.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDiagnostic),
        });

        if (response.ok) {
          // Recharger les ponts après modification
          await fetchDiagnostics(); // Mettez à jour l'état local avec les données récupérées de l'API
          closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Modification réussie!',
            text: `Le Fiche de diagnostic a été modifié avec succès.`,
          });
        } else {
          throw new Error('Erreur lors de la mise à jour du pont');
        }
      } else {
        // Ajout d'un nouveau pont
        const response = await fetch('http://localhost:8081/diagnostic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDiagnostic),
        });

        if (response.ok) {
          await fetchDiagnostics(); // Mettez à jour l'état local avec les données récupérées de l'API
          closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Ajout réussi!',
            text: `Le Fiche de diagnostique a été ajouté avec succès.`,
          });
        } else {
          throw new Error('Erreur lors de l\'ajout du pont');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la soumission du pont.',
      });
    }
  };

  const handleEdit = (diagnostic) => {
    setCurrentDiagnostic(diagnostic);
    setIdPont(diagnostic.idPont);
    setDateDiagnostic(formatDate(diagnostic.dateDiagnostic));
    setPartieOuvrage(diagnostic.partieOuvrage);
    setDegradation(diagnostic.degradation);
    setUnite(diagnostic.unite);
    setQuantite(diagnostic.quantite);
    setPriorisation(diagnostic.priorisation);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8081/diagnostic/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            // Recharger les ponts après suppression
            await fetchDiagnostics(); // Mettez à jour l'état local avec les données récupérées de l'API
            Swal.fire('Supprimé!', 'Le pont a été supprimé avec succès.', 'success');
          } else {
            throw new Error('Erreur lors de la suppression du pont');
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la suppression du pont.',
          });
        }
      }
    });
  };

  // Filtrer les diagnostics selon les critères de recherche
  const filteredDiagnostics = diagnostics.filter((diagnostic) => {
    const matchesPriorisation = searchPriorisation === '' || diagnostic.priorisation.toLowerCase().includes(searchPriorisation.toLowerCase());
    const matchesDateDiagnostic = searchDateDiagnostic === '' || diagnostic.dateDiagnostic.startsWith(searchDateDiagnostic);
    return matchesPriorisation && matchesDateDiagnostic;
  });

  // Calculer les éléments à afficher pour la page actuelle
  const indexOfLastDiagnostic = currentPage * itemsPerPage;
  const indexOfFirstDiagnostic = indexOfLastDiagnostic - itemsPerPage;
  const currentDiagnostics = filteredDiagnostics.slice(indexOfFirstDiagnostic, indexOfLastDiagnostic);

  // Gérer la navigation entre les pages
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const formatDateEnLettres = (dateStr) => {
    const moisEnLettres = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
  
    const date = new Date(dateStr);
    const jour = date.getDate();
    const mois = moisEnLettres[date.getMonth()];
    const annee = date.getFullYear();
  
    return `${jour} ${mois} ${annee}`;
  };
  
// Fonction pour générer le PDF du diagnostic spécifique
const generatePDF = (diagnostic) => {
  const doc = new jsPDF();

  // Charger l'image MTPI et ajouter un cercle autour
  
  const imageX = 80; // Position X (centré pour une page A4)
  const imageY = 10; // Position Y
  const imageSize = 50; // Taille de l'image en pixels

  // Ajout de l'image et du cercle
  doc.addImage(mtpi, 'JPEG', imageX, imageY, imageSize, imageSize);
  doc.setDrawColor(0); // Noir pour la bordure
  doc.setLineWidth(1); // Épaisseur de la bordure
  doc.circle(imageX + imageSize / 2, imageY + imageSize / 2, imageSize / 2, 'S'); // Cercle autour de l'image

  // Titre
  doc.setFontSize(20);
  doc.setTextColor("darkRed");
  doc.text("Fiche diagnostique", 14, 20);

  // Titre du PDF
  const titleStartY = 70; // Position dynamique en fonction de l'image
  doc.setFontSize(12);
  doc.setTextColor("black");
  doc.text(`Localisation du Pont : ${diagnostic.pontLocalisation}`, 14, titleStartY);
  doc.setFontSize(12);
  doc.text(`Date de Diagnostic : ${formatDateEnLettres(diagnostic.dateDiagnostic)}`, 14, titleStartY + 10);
  doc.text(`Nom de Franchissement : PONT`, 14, titleStartY + 20);

  // Tableau des diagnostics
  const columns = [
    { header: 'Partie d\'ouvrage', dataKey: 'partieOuvrage' },
    { header: 'Dégradation', dataKey: 'degradation' }, 
    { header: 'Unité', dataKey: 'unite' },
    { header: 'Quantité', dataKey: 'quantite' },
    { header: 'Priorisation', dataKey: 'priorisation' },
  ];

  const rows = [
    {
      partieOuvrage: diagnostic.partieOuvrage,
      degradation: diagnostic.degradation,
      unite: diagnostic.unite,
      quantite: diagnostic.quantite,
      priorisation: diagnostic.priorisation,
    },
  ];

  // Ajouter le tableau
  autoTable(doc, {
    startY: titleStartY + 30, // Position de départ après le titre
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => row[col.dataKey] || '')),
    styles: { fontSize: 10, cellPadding: 5 },
    headStyles: { fillColor: [0, 100, 0], textColor: [255, 255, 255] }, // Dark green header
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    theme: 'striped',
  });

  // Sauvegarder le PDF
  const fileName = `diagnostic_pont_${diagnostic.pontLocalisation.replace(/\s/g, '_')}.pdf`;
  doc.save(fileName);
};



  return (
    <div>
    <header className="header">
    <div className="header-title">Gesion des Fiches diagnostiques</div>
    <div className="user-menu">
      <FontAwesomeIcon
        icon={faUserCircle}
        className="user-icon"
      />
    </div>
  </header>
    <br></br>
  <div className="table-container" style={{ paddingTop: '0' }}>
    
    <div className="table-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button className="small-button" onClick={openModal}>
        <FontAwesomeIcon icon={faPlus} /> Ajouter
      </button>
    </div>

    {/* Champs de recherche */}
    <div className="search-container">
      <label className='abel'>
        Rechercher par Priorisation :
         <select className='elu'
              id="priorisation"
              value={searchPriorisation}
              onChange={(e) => setSearchPriorisation(e.target.value)}
              required
            >
              <option value="">Tous les types</option>
              <option value="ECI">ECI</option>
              <option value="ECP">ECP</option>
              <option value="R/r">R/r</option>
            </select>
      </label>
      <label className='abel'>
        Rechercher par Date de diagnostic :
        <input
          className='put'
          type="date"
          value={searchDateDiagnostic}
          onChange={(e) => setSearchDateDiagnostic(e.target.value)}
        />
      </label>
    </div>

    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>N° de pont</th>
            <th>Date de diagnostique</th>
            <th>Partie d'ouvrage</th>
            <th>Dégradation</th>
            <th>Quantité</th>
            <th>Priorisation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDiagnostics.map((diagnostic) => (
            <tr key={diagnostic.id}>
              <td>{diagnostic.idPont}</td>
              <td>{formatDateEnLettres(diagnostic.dateDiagnostic)}</td>
              <td>{diagnostic.partieOuvrage}</td>
              <td>{diagnostic.degradation}</td>
              <td>{diagnostic.quantite}</td>
              <td>{diagnostic.priorisation}</td>
              <td>
                <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleView(diagnostic)} className="icon-button">
                        <FontAwesomeIcon icon={faEye} /> {/* Icône pour le bouton "Voir" */}
                      </button>
                  <button onClick={() => handleEdit(diagnostic)} className="icon-button">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(diagnostic.id)} className="icon-button">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button onClick={() => generatePDF(diagnostic)} className="icon-button">
                      <FontAwesomeIcon icon={faFilePdf} />
                    </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      {/* Pagination */}
      <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Précédent
          </button>
          {Array.from({ length: Math.ceil(filteredDiagnostics.length / itemsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredDiagnostics.length / itemsPerPage)}>
            Suivant
          </button>
        </div>

    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div className="form-container">
        <h2>{currentDiagnostic ? 'Modifier un fiche de diagnostic' : 'Ajouter un fiche de diagnostic'}</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
              <label htmlFor="idPont">identication du Pont</label>
              <select
                id="idPont"
                value={idPont}
                onChange={(e) => setIdPont(e.target.value)}
                required
              >
                <option value="">Sélectionnez un pont</option>
                {ponts.map((pont) => (
                  <option key={pont.id} value={pont.id}>
                    {pont.id}
                  </option>
                ))}
              </select>
            </div>
          <div className="form-group">
            <label htmlFor="date de diagnostic">Date de diagnostic</label>
            <input
              type="date"
              id="dateDiagnostic"
              value={dateDiagnostic}
              onChange={(e) => setDateDiagnostic(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="partie ouvrage">Partie d'Ouvrage</label>
            <select id="partieOuvrage" value={partieOuvrage} onChange={(e) => setPartieOuvrage(e.target.value)} required>
                <option value="">Sélectionnez une partie d'ouvrage</option>
                <option value="Visibilité">Visibilité</option>
                <option value="Dispositifs de sécurité">Dispositifs de sécurité</option>
                <option value="Chaussée et Abords du Pont">Chaussée et Abords du Pont </option>
                <option value="Accotements et trottoirs">Accotements et trottoirs (sur accès)</option>
                <option value="Evacuation des eaux">Evacuation des eaux </option>
                <option value="Protections des remblais">Protections des remblais </option>
                <option value="Ouvrages annexes">Ouvrages annexes</option>
                <option value="Signalisation">Signalisation</option>
                <option value="Appareils d'appui">Appareils d’appui</option>
                <option value="Gargouilles">Gargouilles</option>
                <option value="Chape d'étanchéité">Chape d’étanchéité </option>
                <option value="Chaussée et revêtement">Chaussée et revêtement </option>
                <option value="Trottoirs">Trottoirs</option>
                <option value="Bordures de trottoirs">Bordures de trottoirs</option>
                <option value="Joints de chaussée">Joints de chaussée</option>
                <option value="Joints de trottoir">Joints de trottoir</option>
                <option value="Corniches">Corniches</option>
                <option value="Garde-corps">Garde-corps </option>
                <option value="Dispositfs de sécurité">Dispositifs de sécurité</option>
                <option value="Butte - roues">Butte - roues</option>
                <option value="Bornes de guidage">Bornes de guidage</option>
                <option value="Ouvrage accessoires et divers">Ouvrages accessoires et divers(réservations, réseaux, éclairage)</option>
                <option value="Continuité de l'étanchéité">Continuité de l’étanchéité au droit des joints de chaussée </option>
                <option value="Poutres">Poutres</option>
                <option value="Entrtoises d'about">Entretoises d’about</option>
                <option value="Entretoises intermédiaires">Entretoises intermédiaires</option>
                <option value="Dalle ou hourdis">Dalle ou hourdis</option>
                <option value="Cachetage">Cachetage (about poutre et dalle)</option>
                <option value="Voûtes">Voûtes</option>
                <option value="Piédroit">Piédroit</option>
                <option value="Bandeaux">Bandeaux</option>
                <option value="Tympans">Tympans</option>
                <option value="Murs garde-grève">Murs garde-grève (pont console)</option>
                <option value="Voussoirs">Voussoirs</option>
                <option value="Culées">Culées (ou Piles - culées) Piédroits</option>
                <option value="Barbacanes">Barbacanes</option>
                <option value="Murs">Murs (en aile ou en retour)</option>
                <option value="Perrés et talus">Perrés et talus</option>
                <option value="Piles">Piles (fût, voile, colonne, palées)</option>
                <option value="Sommier et chevêtre des appuis">Sommier et chevêtre des appuis</option>
                <option value="Enrochements, gabions">Enrochements, gabions,</option>
                <option value="Garde - grève des culées">Garde - grève des culées</option>
                <option value="Autres">Autres</option>
                <option value="Etat du lit">Etat du lit</option>
                <option value="Berges">Berges</option>
                <option value="Ouvrages de protection des berges">Ouvrages de protection des berges</option>
                <option value="Fondations des culées">Fondations des culées </option>
                <option value="Fondations des piles">Fondations des piles</option>
                <option value="Affouillements éventuels">Affouillements éventuels</option>
                <option value="Circulation lourde et inhabituelle">Circulation lourde et inhabituelle</option>
                <option value="Travaux divers au voisinage de l’OA">Travaux divers au voisinage de l’OA</option>
                </select>
          </div>
          <div className="form-group">
            <label htmlFor="dégradation">Dégradation</label>
            <input
              type="text"
              id="dégradation"
              value={degradation}
              onChange={(e) => setDegradation(e.target.value)}
              required
            />
            <div className="form-group">
            <label htmlFor="unite">Unité</label>
            <input
              type="text"
              id="unite"
              value={unite}
              onChange={(e) => setUnite(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="qunatite">Quantité</label>
            <input
              type="text"
              id="quantite"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="priorisation">Priorisation</label>
            <select
              id="priorisation"
              value={priorisation}
              onChange={(e) => setPriorisation(e.target.value)}
              required
            >
              <option value="ECI">ECI</option>
              <option value="ECP">ECP</option>
              <option value="R/r">R/r</option>
            </select>
          </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button">Envoyer</button>
            <button type="button" className="cancel-button" onClick={closeModal}>Annuler</button>
          </div>
        </form>
      </div>
    </Modal>

     {/* Modal de visualisation des données */}
     {viewDiagnostic && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="form-container">
              <h2>Détails du Diagnostic</h2>
              <p><strong>identication de Pont:</strong> {viewDiagnostic.idPont}</p>
              <p><strong>Date de Diagnostic:</strong> {formatDateEnLettres(viewDiagnostic.dateDiagnostic)}</p>
              <p><strong>Partie d'Ouvrage:</strong> {viewDiagnostic.partieOuvrage}</p>
              <p><strong>Dégradation:</strong> {viewDiagnostic.degradation}</p>
              <p><strong>Unité:</strong> {viewDiagnostic.unite}</p>
              <p><strong>Quantité:</strong> {viewDiagnostic.quantite}</p>
              <p><strong>Priorisation:</strong> {viewDiagnostic.priorisation}</p>
              <div className="form-buttons">
              <button onClick={closeModal} className="cancel-button">Fermer</button>
              </div>
            </div>
          </Modal>
        )}
  </div>
    {/* Footer */}
<footer className="footer">
  <p>Ministère des Travaux Publics</p>
</footer>
  </div>
  );
};

export default Diagnostics;
