import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faFilePdf, faFileExcel, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Assure-toi que cette bibliothèque est installée
import * as XLSX from "xlsx";

const Signaletique = () => {
    const [signaletiques, setSignaletiques] = useState([]);
    const [ponts, setPonts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSignaletique, setCurrentSignaletique] = useState(null);
    const [viewSignaletique, setViewSignaletique] = useState(null); // État pour afficher les données
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);  // Modal de visualisation
    const [idPont, setIdPont] = useState('');
    const [pkReference, setPkReference] = useState('');
    const [pkOuvrage, setPkOuvrage] = useState('');
    const [origine, setOrigine] = useState('');
    const [extremite, setExtremite] = useState('');
    const [dateEtablissement, setDateEtablissement] = useState('');
    const [conditionMeteo, setConditionMeteo] = useState('');
    const [typeSurveillance, setTypeSurveillance] = useState('');
    const [dispositifsVisite,setDispositifsVisite] = useState('');
    const [longueurTablier,setLongueurTablier] = useState('');
    const [nombreTravees,setNombreTravees] = useState('');
    const [distributionPortee,setDistributionPortee] = useState('');
    const [largeurUtile,setLargeurUtile] = useState('');
    const [largeurRoulable,setLargeurRoulable] = useState('');
    const [largeurTrottoirs,setLargeurTrottoirs] = useState('');
    const [penteLongitudinale,setPenteLongitudinale] = useState('');
    const [gardeCorps,setGardeCorps] = useState('');
    const [biaisOuvrage,setBiaisOuvrage] = useState('');
    const [nombreVoies,setNombreVoies] = useState('');
    const [revetementOuvrage,setRevetementOuvrage] = useState('');
    const [tirantAir,setTirantAir] = useState('');
    const [typeRouteAcces,setTypeRouteAcces] = useState('');
    const [signalisation,setSignalisation] = useState('');
    const [autresCaracteristiques,setAutresCaracteristiques] = useState(''); 
    const [appuis,setAppuis] = useState('');
    const [typePiles,setTypePiles] = useState('');
    const [typeCulees,setTypeCulees] = useState('');
    const [fondations,setFondations] = useState('');
    const [typeProtection,setTypeProtection] = useState('');
    const [affouillabilite,setAffouillabilite] = useState('');
    const [natureMateriauxFranchissement,setNatureMateriauxFranchissement] = useState(''); 
    const [typeTablier,setTypeTablier] = useState('');
    const [typePoutre,setTypePoutre] = useState('');
    const [materiauxTablier,setMateriauxTablier] = useState('');
    const [typeDalle,setTypeDalle] = useState('');
    const [amenagementsPosterieurs,setAmenagementsPosterieurs] = useState('');
    const [particularitesOuvrage,setParticularitesOuvrage] = useState('');
    const [noteEvaluation,setNoteEvaluation] = useState('');
    const [commentaires,setCommentaires] = useState('');
    const [image, setImage] = useState(null);

    const [searchIdPont, setSearchIdPont] = useState('');
    const [searchDateEtablissement, setSearchDateEtablissement] = useState('');

    // Pagination
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage] = useState(2); // Nombre d'éléments par page

    // Fonction pour formater la date au format 'YYYY-MM-DD'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

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

  
    // Récupérer les données des signalétiques
    useEffect(() => {
        fetchSignaletiques();
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
  

    const fetchSignaletiques = async () => {
        try {
            const response = await axios.get('http://localhost:8081/signaletique'); // Remplacez par l'URL de votre API
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
        setOrigine('');
        setExtremite('');
        setDateEtablissement('');
        setConditionMeteo('');
        setTypeSurveillance('');
        setDispositifsVisite('');
        setLongueurTablier('');
        setNombreTravees('');
        setDistributionPortee('');
        setLargeurUtile('');
        setLargeurRoulable('');
        setLargeurTrottoirs('');
        setPenteLongitudinale('');
        setGardeCorps('');
        setBiaisOuvrage('');
        setNombreVoies('');
        setRevetementOuvrage('');
        setTirantAir('');
        setTypeRouteAcces('');
        setSignalisation('');
        setAutresCaracteristiques('');
        setAppuis('');
        setTypePiles('');
        setTypeCulees('');
        setFondations('');
        setTypeProtection('');
        setAffouillabilite('');
        setNatureMateriauxFranchissement('');
        setTypeTablier('');
        setTypePoutre('');
        setMateriauxTablier('');
        setTypeDalle('');
        setAmenagementsPosterieurs('');
        setParticularitesOuvrage('');
        setNoteEvaluation('');
        setCommentaires('');
        setImage(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentSignaletique(null);
        setViewSignaletique(null); // Ferme la modal de visualisation
        setIsViewModalOpen(false);
    };

    const handleView = (signaletique) => {
      setViewSignaletique(signaletique);
      setIsViewModalOpen(true);  // Ouvre le modal de visualisation
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('idPont', idPont);
        formData.append('pkReference', pkReference);
        formData.append('pkOuvrage', pkOuvrage);
        formData.append('origine', origine);
        formData.append('extremite', extremite);
        formData.append('dateEtablissement', dateEtablissement);
        formData.append('conditionMeteo', conditionMeteo);
        formData.append('typeSurveillance', typeSurveillance);
        formData.append('dispositifsVisite', dispositifsVisite);
        formData.append('longueurTablier', longueurTablier);
        formData.append('nombreTravees', nombreTravees);
        formData.append('distributionPortee', distributionPortee);
        formData.append('largeurUtile', largeurUtile);
        formData.append('largeurRoulable', largeurRoulable);
        formData.append('largeurTrottoirs', largeurTrottoirs);
        formData.append('penteLongitudinale', penteLongitudinale);
        formData.append('gardeCorps', gardeCorps);
        formData.append('biaisOuvrage', biaisOuvrage);
        formData.append('nombreVoies', nombreVoies);
        formData.append('revetementOuvrage', revetementOuvrage);
        formData.append('tirantAir', tirantAir);
        formData.append('typeRouteAcces', typeRouteAcces);
        formData.append('signalisation', signalisation);
        formData.append('autresCaracteristiques', autresCaracteristiques);
        formData.append('appuis', appuis);
        formData.append('typePiles', typePiles);
        formData.append('typeCulees', typeCulees);
        formData.append('fondations', fondations);
        formData.append('typeProtection', typeProtection);
        formData.append('affouillabilite', affouillabilite);
        formData.append('natureMateriauxFranchissement', natureMateriauxFranchissement);
        formData.append('typeTablier', typeTablier);
        formData.append('typePoutre', typePoutre);
        formData.append('materiauxTablier', materiauxTablier);
        formData.append('typeDalle', typeDalle);
        formData.append('amenagementsPosterieurs', amenagementsPosterieurs);
        formData.append('particularitesOuvrage', particularitesOuvrage);
        formData.append('noteEvaluation', noteEvaluation);
        formData.append('commentaires', commentaires);
        if (image) {
            formData.append('image', image);
        }

        try {
            if (currentSignaletique) {
                // Modification d'une signalétique existante
                const response = await axios.put(`http://localhost:8081/signaletique/${currentSignaletique.id}`, formData, {
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
                const response = await axios.post('http://localhost:8081/signaletique', formData, {
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
        setOrigine(signaletique.origine);
        setExtremite(signaletique.extremite);
        setDateEtablissement(formatDate(signaletique.dateEtablissement));
        setConditionMeteo(signaletique.conditionMeteo);
        setTypeSurveillance(signaletique.typeSurveillance);
        setDispositifsVisite(signaletique.dispositifsVisite);
        setLongueurTablier(signaletique.longueurTablier);
        setNombreTravees(signaletique.nombreTravees);
        setDistributionPortee(signaletique.distributionPortee);
        setLargeurUtile(signaletique.largeurUtile);
        setLargeurRoulable(signaletique.largeurRoulable);
        setLargeurTrottoirs(signaletique.largeurTrottoirs);
        setPenteLongitudinale(signaletique.penteLongitudinale);
        setGardeCorps(signaletique.gardeCorps);
        setBiaisOuvrage(signaletique.biaisOuvrage);
        setNombreVoies(signaletique.nombreVoies);
        setRevetementOuvrage(signaletique.revetementOuvrage);
        setTirantAir(signaletique.tirantAir);
        setTypeRouteAcces(signaletique.typeRouteAcces);
        setSignalisation(signaletique.signalisation);
        setAutresCaracteristiques(signaletique.autresCaracteristiques);
        setAppuis(signaletique.appuis);
        setTypePiles(signaletique.typePiles);
        setTypeCulees(signaletique.typeCulees);
        setFondations(signaletique.fondations);
        setTypeProtection(signaletique.typeProtection);
        setAffouillabilite(signaletique.affouillabilite);
        setNatureMateriauxFranchissement(signaletique.natureMateriauxFranchissement);
        setTypeTablier(signaletique.typeTablier);
        setTypePoutre(signaletique.typePoutre);
        setMateriauxTablier(signaletique.materiauxTablier);
        setTypeDalle(signaletique.typeDalle);
        setAmenagementsPosterieurs(signaletique.amenagementsPosterieurs);
        setParticularitesOuvrage(signaletique.particularitesOuvrage);
        setNoteEvaluation(signaletique.noteEvaluation);
        setCommentaires(signaletique.commentaires);
        setImage(signaletique.image);
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
            const response = await fetch(`http://localhost:8081/signaletique/${id}`, {
              method: 'DELETE',
            });
  
            if (response.ok) {
              // Recharger les ponts après suppression
              await fetchSignaletiques(); // Mettez à jour l'état local avec les données récupérées de l'API
              Swal.fire('Supprimé!', 'Le pont a été supprimé avec succès.', 'success');
            } else {
              throw new Error('Erreur lors de la suppression du fiche signaletique');
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

    const generatePDF = (signaletique) => {
      const doc = new jsPDF();
      let currentY = 20; // Position verticale
  
      // Fonction pour gérer les sauts de page
      const checkPageOverflow = () => {
          if (currentY > 250) { // La limite avant d'atteindre le bas de la page
              doc.addPage(); // Ajouter une nouvelle page
              currentY = 30; // Réinitialiser la position verticale à la première ligne
          }
      };
  
      // En-tête
      doc.setFontSize(14);
      doc.setTextColor("darkRed");
      doc.text("MINISTERE DES TRAVAUX PUBLICS", 14, currentY);
      doc.text("INVENTAIRE DES PONTS", 140, currentY, { align: "left" });
      currentY += 10;
      doc.text("GESTION DES OUVRAGES D'ART", 14, currentY);
      doc.text("FICHE SIGNALETIQUE", 140, currentY, { align: "left" });
  
      // Ligne de séparation
      currentY += 10;
      doc.line(14, currentY, 190, currentY);
      currentY += 10;
  
      // Section 1 : Désignation de la Route
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor("darkGreen");
      doc.text(`DESIGNATION DE LA ROUTE : ${signaletique.localisation}`, 14, currentY);
      currentY += 10;
      doc.setFont("helvetica", "normal");
      doc.setTextColor("black");
      doc.text(`PK référence : ${signaletique.pkReference}`, 70, currentY, { align: "right" });
      doc.text(`PK ouvrage : ${signaletique.pkOuvrage}`, 140, currentY, { align: "center" });
      doc.text(`Date de l'établissement : ${formatDateEnLettres(signaletique.dateEtablissement)}`,210, currentY, { align: "left" });
      
  
      currentY += 10; // Espacement
      checkPageOverflow(); // Vérifier si un saut de page est nécessaire
  
      // Section 2 : Partie Administrative
      doc.setFont("helvetica", "bold");
      doc.setTextColor("darkGreen");
      doc.text("A. PARTIE ADMINISTRATIVE", 14, currentY);
      currentY += 10;
      doc.setFont("helvetica", "normal");
      doc.setTextColor("black");
      doc.text(` Date de construction de l'ouvrage : ${formatDateEnLettres(signaletique.date)}`, 14, currentY);
      currentY += 10;
      doc.text(` Type de surveillance de l'ouvrage : ${signaletique.typeSurveillance}`, 14, currentY);
      currentY += 10;
      doc.text(` Dispositifs nécessaires pour la visite : ${signaletique.dispositifsVisite}`, 14, currentY);
      currentY += 10;
  
      currentY += 10; // Espacement
      checkPageOverflow(); // Vérifier si un saut de page est nécessaire
  
      // Section 3 : Caractéristiques Fonctionnelles
      doc.setFont("helvetica", "bold");
      doc.setTextColor("darkGreen");
      doc.text("B. CARACTERISTIQUES FONCTIONNELLES", 14, currentY);
      currentY += 10;
      doc.setFont("helvetica", "normal");
      doc.setTextColor("black");
      doc.text(` Type d'ouvrage (nature) : ${signaletique.typeOuvrage}`, 14, currentY);
      currentY += 10;
      doc.text(` Longueur totale de tablier : ${signaletique.longueurTablier}`, 14, currentY);
      currentY += 10;
      doc.text(` Nombre de travées ou arches : ${signaletique.nombreTravees}`, 14, currentY);
      currentY += 10;
      doc.text(` Distribution des portées (ml) : ${signaletique.distributionPortee}`, 14, currentY);
      currentY += 10;
      doc.text(` Largeur utile : ${signaletique.largeurUtile}`, 14, currentY);
      currentY += 10;
      doc.text(` Largeur roulable : ${signaletique.largeurRoulable}`, 14, currentY);
      currentY += 10;
      doc.text(` Largeur des trottoirs (ml) : ${signaletique.largeurTrottoirs}`, 14, currentY);
      currentY += 10;
      doc.text(` Pente longitudinale maximale (gr) : ${signaletique.penteLongitudinale}`, 14, currentY);
      currentY += 10;
      doc.text(` Garde-corps ou barrières : ${signaletique.gardeCorps}`, 14, currentY);
  
      currentY += 10; // Espacement
      checkPageOverflow(); // Vérifier si un saut de page est nécessaire
  
      // Section 4 : Caractéristiques Techniques Générales
      doc.setFont("helvetica", "bold");
      doc.setTextColor("darkGreen");
      doc.text("C. CARACTERISTIQUES TECHNIQUES GENERALES", 14, currentY);
      currentY += 10;
      doc.setFont("helvetica", "normal");
      doc.setTextColor("black");
      doc.text(` Appareils d'appui : ${signaletique.appuis}`, 14, currentY);
      currentY += 10;
      doc.text(` Type et nature des piles : ${signaletique.typePiles}`, 14, currentY);
      currentY += 10;
      doc.text(` Type et nature des culées : ${signaletique.typeCulees}`, 14, currentY);
      currentY += 10;
      doc.text(` Fondations : ${signaletique.fondations}`, 14, currentY);
      currentY += 10;
      doc.text(` Type de protection : ${signaletique.typeProtection}`, 14, currentY);
  
      currentY += 10; // Espacement
      checkPageOverflow(); // Vérifier si un saut de page est nécessaire
  
      // Section 5 : Note d'Évaluation
      doc.setFont("helvetica", "bold");
      doc.setTextColor("darkGreen");
      doc.text("D. NOTE D'ÉVALUATION RELATIVE À L'ÉTAT DE L'OUVRAGE", 14, currentY);
      currentY += 10;
      doc.setFont("helvetica", "normal");
      doc.setTextColor("black");
      doc.text(`Appuis : ${signaletique.appuis}`, 14, currentY);
      currentY += 10;;
      doc.text(`Commentaires : ${signaletique.commentaires}`, 14, currentY);
      currentY +=10;
      doc.text("Photo:",14,currentY);
      currentY +=10;
  
      // Ajout d'une image si elle existe
      if (signaletique.image) {
          doc.addImage(`http://localhost:8081/signaletique/${signaletique.image}`, 'JPEG', 14, currentY, 80, 80);
      }

      // Sauvegarder le PDF
      doc.save(`signaletique-${signaletique.id}.pdf`);
  };

  
  const handleGenerateExcel = (signaletique) => {
    const data = [
        ["MINISTERE DES TRAVAUX PUBLICS", "", "INVENTAIRE DES PONTS"],
        ["GESTION DES OUVRAGES D'ART", "", "FICHE SIGNALETIQUE"],
        [],
        ["", "PK référence", signaletique.pkReference],
        ["", "PK ouvrage", signaletique.pkOuvrage],
        ["", "Date de l'établissement :", formatDateEnLettres(signaletique.dateEtablissement)],
        [],
        ["A. PARTIE ADMINISTRATIVE"],
        [],
        ["Date de construction de l'ouvrage", formatDateEnLettres(signaletique.date)],
        [],
        ["Type de surveillance de l'ouvrage", signaletique.typeSurveillance],
        [],
        ["Dispositifs nécessaires pour la visite", signaletique.dispositifsVisite],
        [],
        ["B. CARACTERISTIQUES FONCTIONNELLES"],
        [],
        ["Type d'ouvrage (nature)", signaletique.typeOuvrage],
        [],
        ["Longueur totale de tablier", signaletique.longueurTablier],
        [],
        ["Nombre de travées ou arches", signaletique.nombreTravees],
        [],
        ["Distribution des portées (ml)", signaletique.distributionPortee],
        [],
        ["Largeur utile", signaletique.largeurUtile],
        [],
        ["Largeur roulable", signaletique.largeurRoulable],
        [],
        ["Largeur des trottoirs (ml)", signaletique.largeurTrottoirs],
        [],
        ["Pente longitudinale maximale (gr)", signaletique.penteLongitudinale],
        [],
        ["Garde-corps ou barrières", signaletique.gardeCorps],
        [],
        ["C. CARACTERISTIQUES TECHNIQUES GENERALES"],
        [],
        ["Type et nature des piles", signaletique.typePiles],
        [],
        ["Type et nature des culées", signaletique.typeCulees],
        [],
        ["Fondations", signaletique.fondations],
        [],
        ["Type de protection", signaletique.typeProtection],
        [],
        ["D. NOTE D'ÉVALUATION RELATIVE À L'ÉTAT DE L'OUVRAGE"],
        [],
        ["Appuis", signaletique.appuis],
        [],
        ["Commentaires", signaletique.commentaires],
        [],
        ["image", `http://localhost:8081/signaletique/${signaletique.image}`],
    ];

    // Créer une feuille Excel
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Ajuster les largeurs des colonnes (élargies davantage)
    const columnWidths = [
        { wch: 50 }, // Colonne A : plus large pour les titres courts
        { wch: 40 }, // Colonne B : assez large pour les descriptions des propriétés
        { wch: 60 }, // Colonne C : très large pour les valeurs longues ou les URLs
    ];
    ws['!cols'] = columnWidths;

    // Créer un classeur
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Signalétique");

    // Générer et sauvegarder le fichier Excel
    XLSX.writeFile(wb, `signaletique-${signaletique.id}.xlsx`);
};



  

    // Filtrer les ponts selon les critères de recherche
  const filteredSignaletiques = signaletiques.filter((signaletique) => {
    const matchesIdPont = searchIdPont === '' ||signaletique.idPont.toString().startsWith(searchIdPont);
    const matchesDateEtablissement = searchDateEtablissement === '' || signaletique.dateEtablissement.startsWith(searchDateEtablissement);
    return matchesIdPont && matchesDateEtablissement
  });

   // Calculer les éléments à afficher pour la page actuelle
   const indexOfLastSignaletique = currentPage * itemsPerPage;
   const indexOfFirstSignaletique = indexOfLastSignaletique - itemsPerPage;
   const currentSignaletiques = filteredSignaletiques.slice(indexOfFirstSignaletique, indexOfLastSignaletique);
 
   // Gérer la navigation entre les pages
   const paginate = (pageNumber) => setCurrentPage(pageNumber);
 

    return (
        <div>
            <header className="header">
    <div className="header-title">Gestion des fiches signaletiques</div>
    <div className="user-menu">
      <FontAwesomeIcon
        icon={faUserCircle}
        className="user-icon"
      />
    </div>
  </header>
            <br></br>
            <div class="table-container" style={{ paddingTop: '0' }}>
                <div class="table-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button class="small-button" onClick={openModal}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter
                    </button>
                </div>

               {/* Champs de recherche */}
      <div class="search-container">
        <label class='abel'>
          Rechercher par Identification du pont :
          <input
            class='put'
            type="text"
            value={searchIdPont}
            onChange={(e) => setSearchIdPont(e.target.value)}
            placeholder="id de pont"
          />
        </label>
        <label class='abel'>
          Rechercher par Date de l'établissement :
          <input
            class='put'
            type="date"
            value={searchDateEtablissement}
            onChange={(e) => setSearchDateEtablissement(e.target.value)}
          />
        </label>
      </div>

                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>N° de pont</th>
                                <th>PK Référence</th>
                                <th>PK Ouvrage</th>
                                <th>Date de l'établissement</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSignaletiques.map((signaletique) => (
                                <tr key={signaletique.id}>
                                    <td>{signaletique.idPont}</td>
                                    <td>{signaletique.pkReference}</td>
                                    <td>{signaletique.pkOuvrage}</td>
                                    <td>{formatDateEnLettres(signaletique.dateEtablissement)}</td>
                                    <td><a href={`http://localhost:8081/signaletique/${signaletique.image}`}>
                                        {signaletique.image && (
                <img
                src={`http://localhost:8081/signaletique/${signaletique.image}`}
                alt="Signalétique"
                style={{ width: '90px',height: '90px',borderRadius: '15px',  maxWidth: '100%' }}
              />
                                        )}
                                        </a>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleView(signaletique)} className="icon-button">
                        <FontAwesomeIcon icon={faEye} /> {/* Icône pour le bouton "Voir" */}
                      </button>
                                            <button onClick={() => handleEdit(signaletique)} class="icon-button">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button onClick={() => handleDelete(signaletique.id)} class="icon-button">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                            <button onClick={() => generatePDF(signaletique)} className="icon-button">
                      <FontAwesomeIcon icon={faFilePdf} />
                    </button>
                    <button onClick={() => handleGenerateExcel(signaletique)}
                                                className="icon-button"
                                            >
                                                <FontAwesomeIcon icon={faFileExcel} />
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
          {Array.from({ length: Math.ceil(filteredSignaletiques.length / itemsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredSignaletiques.length / itemsPerPage)}>
            Suivant
          </button>
        </div>


                {/* Modal pour ajouter ou modifier une signalétique */}
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div class="form-containerExemple">
                        <h2>{currentSignaletique ? 'Modifier une signalétique' : 'Ajouter une signalétique'}</h2>
                        <form onSubmit={handleSubmit}>
                        <div class='left'>
                        <div className="form-group">
                <label htmlFor="idPont">Identification de Pont</label>
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
                            <div class="form-group">
                                <label htmlFor="pkReference">PK Référence</label>
                                <input
                                    type="text"
                                    id="pkReference"
                                    value={pkReference}
                                    onChange={(e) => setPkReference(e.target.value)}
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label htmlFor="pkOuvrage">PK Ouvrage</label>
                                <input
                                    type="text"
                                    id="pkOuvrage"
                                    value={pkOuvrage}
                                    onChange={(e) => setPkOuvrage(e.target.value)}
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label htmlFor="origine">Origine</label>
                                <input
                                    type="text"
                                    id="origine"
                                    value={origine}
                                    onChange={(e) => setOrigine(e.target.value)}
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label htmlFor="extremite">Extremite</label>
                                <input
                                    type="text"
                                    id="extremite"
                                    value={extremite}
                                    onChange={(e) => setExtremite(e.target.value)}
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label htmlFor="dateEtablissement">Date de l'établissement</label>
                                <input
                                    type="date"
                                    id="etablissement"
                                    value={dateEtablissement}
                                    onChange={(e) => setDateEtablissement(e.target.value)}
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label htmlFor="conditionMeteo">condition de Météo</label>
                                <input
                                    type="text"
                                    id="conditionMeteo"
                                    value={conditionMeteo}
                                    onChange={(e) => setConditionMeteo(e.target.value)}
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label htmlFor="typeSurveillance">Type de surveillance</label>
                                <input
                                    type="text"
                                    id="typeSurveillance"
                                    value={typeSurveillance}
                                    onChange={(e) => setTypeSurveillance(e.target.value)}
                                    required
                                />
                            </div>
                        <div class="form-group">
                            <label htmlFor="dispositifsVisite">Dispositifs de Visite</label>
                            <input type="text" id="dispositifsVisite" 
                            value={dispositifsVisite} onChange={(e) => setDispositifsVisite(e.target.value)} required />
                                    </div>
                                    
                            <div class='form-group'>
            <label htmlFor="longueurTablier">Longueur du Tablier (m)</label>
            <input type="number" id="longueurTablier"  value={longueurTablier} 
            onChange={(e) => setLongueurTablier(e.target.value)} required step="0.01" />
                    </div>
<div class='form-group'>
            <label htmlFor="nombreTravees">Nombre de Travées</label>
            <input type="number" id="nombreTravees"  value={nombreTravees} 
            onChange={(e) => setNombreTravees(e.target.value)}  required />
          </div>
         <div class='form-group'>
            <label htmlFor="distributionPortee">Distribution des Portées</label>
            <input type="text" id="distributionPortee"  value={distributionPortee} 
            onChange={(e) => setDistributionPortee(e.target.value)} required />
          </div>
<div class='form-group'>
            <label htmlFor="largeurUtile">Largeur Utile (m)</label>
            <input type="number" id="largeurUtile"  value={largeurUtile} 
            onChange={(e) => setLargeurUtile(e.target.value)} required step="0.01" />
          </div>
          <div class='form-group'>
            <label htmlFor="largeurRoulable">Largeur Roulable (m)</label>
            <input type="number" id="largeurRoulable"  value={largeurRoulable} onChange={(e) => setLargeurRoulable(e.target.value)} required step="0.01" />
          </div>
          <div class='form-group'>
            <label htmlFor="largeurTrottoirs">Largeur des Trottoirs (m)</label>
            <input type="number" id="largeurTrottoirs"  value={largeurTrottoirs} onChange={(e) => setLargeurTrottoirs(e.target.value)} required step="0.01" />
          </div>
          <div class='form-group'>
            <label htmlFor="penteLongitudinale">Pente Longitudinale (%)</label>
            <input type="number" id="penteLongitudinale"  value={penteLongitudinale} onChange={(e) => setPenteLongitudinale(e.target.value)} required step="0.1" />
          </div>
          <div class='form-group'>
            <label htmlFor="gardeCorps">Garde-corps</label>
            <input type="text" id="gardeCorps"  value={gardeCorps} onChange={(e) => setGardeCorps(e.target.value)} required />
          </div>
          <div class='form-group'>
            <label htmlFor="biaisOuvrage">Biais de l'Ouvrage</label>
            <input type="text" id="biaisOuvrage"  value={biaisOuvrage} onChange={(e) => setBiaisOuvrage(e.target.value)} required />
          </div>
          <div class='form-group'>
            <label htmlFor="nombreVoies">Nombre de Voies</label>
            <input type="number" id="nombreVoies"  value={nombreVoies} onChange={(e) => setNombreVoies(e.target.value)} required />
          </div>
          <div class='form-group'>
            <label htmlFor="revetementOuvrage">Revêtement de l'Ouvrage</label>
            <input type="text" id="revetementOuvrage"  value={revetementOuvrage} onChange={(e) => setRevetementOuvrage(e.target.value)} required />
          </div>
          <div class='form-group'>
            <label htmlFor="tirantAir">Tirant d'Air (m)</label>
            <input type="number" id="tirantAir"  value={tirantAir} onChange={(e) => setTirantAir(e.target.value)} required step="0.01" />
          </div>
          <div className="form-group">
            <label htmlFor="typeRouteAcces">Type de Route d'Accès</label>
            <input type="text" id="typeRouteAcces"  value={typeRouteAcces} onChange={(e) => setTypeRouteAcces(e.target.value)} required />
          </div>
          </div>
          <div class='right'>
          <div class='form-group'>
            <label htmlFor="signalisation">Signalisation</label>
            <input type="text" id="signalisation"  value={signalisation} onChange={(e) => setSignalisation(e.target.value)} required />
          </div>

          {/* Caractéristiques structurelles */}
          <div class='form-group'>
            <label htmlFor="Appuis">Appuis</label>
            <input type="text" id="appuis"  value={appuis} onChange={(e) => setAppuis(e.target.value)} required />
          </div>
         <div class='form-group'>
            <label htmlFor="typePiles">Type de Piles</label>
            <input type="text" id="typePiles" value={typePiles} onChange={(e) => setTypePiles(e.target.value)} required />
          </div>
          <div class='form-group'>
            <label htmlFor="typeCulees">Type de Culées</label>
            <input type="text" id="typeCulees"  value={typeCulees} onChange={(e) => setTypeCulees(e.target.value)} required />
          </div>
          <div class='form-group'>
            <label htmlFor="fondations">Fondations</label>
            <input type="text" id="fondations" value={fondations} onChange={(e) => setFondations(e.target.value)} required />
          </div>
          <div class='form-group'>
            <label htmlFor="typeProtection">Type de Protection</label>
            <input type="text" id="typeProtection"  value={typeProtection} onChange={(e) => setTypeProtection(e.target.value)} required />
          </div>
          <div class='form-group'>
            <label htmlFor="affouillabilite">Affouillabilité</label>
            <input type="text" id="affouillabilite"  value={affouillabilite} onChange={(e) => setAffouillabilite(e.target.value)} required />
          </div>
         <div class='form-group'>
            <label htmlFor="natureMateriauxFranchissement">Nature des Matériaux de Franchissement</label>
            <input type="text" id="natureMateriauxFranchissement"  value={natureMateriauxFranchissement} onChange={(e) => setNatureMateriauxFranchissement(e.target.value)} required />
          </div>
          <div class='form-group'>
            <label htmlFor="typeTablier">Type de Tablier</label>
            <input type="text" id="typeTablier"  value={typeTablier} onChange={(e) => setTypeTablier(e.target.value)} required />
          </div>
         <div class='form-group'>
            <label htmlFor="typePoutre">Type de Poutre</label>
            <input type="text" id="typePoutre"  value={typePoutre} onChange={(e) => setTypePoutre(e.target.value)} required />
          </div>
         <div class='form-group'>
            <label htmlFor="materiauxTablier">Matériaux du Tablier</label>
            <input type="text" id="materiauxTablier"  value={materiauxTablier} onChange={(e) => setMateriauxTablier(e.target.value)} required />
          </div>
          <div class='form-group'>
            <label htmlFor="typeDalle">Type de Dalle</label>
            <input type="text" id="typeDalle"  value={typeDalle} onChange={(e) => setTypeDalle(e.target.value)} required />
          </div>

        <div class='form-group'>
          <label htmlFor="autresCaracteristiques">Autres Caractéristiques</label>
          <textarea id="autresCaracteristiques"  value={autresCaracteristiques} onChange={(e) => setAutresCaracteristiques(e.target.value)} rows={3} />
        </div>
        <div class='form-group'>
          <label htmlFor="amenagementsPosterieurs">Aménagements Postérieurs</label>
          <textarea id="amenagementsPosterieurs"  value={amenagementsPosterieurs} onChange={(e) => setAmenagementsPosterieurs(e.target.value)} rows={3} />
        </div>
        <div class='form-group'>
          <label htmlFor="particularitesOuvrage">Particularités de l'Ouvrage</label>
          <textarea id="particularitesOuvrage"  value={particularitesOuvrage} onChange={(e) => setParticularitesOuvrage(e.target.value)} rows={3} />
        </div>
       <div class='form-group'>
          <label htmlFor="noteEvaluation">Note d'Évaluation</label>
          <input type="text" id="noteEvaluation"  value={noteEvaluation} onChange={(e) => setNoteEvaluation(e.target.value)} required />
        </div>
       <div class='form-group'>
          <label htmlFor="commentaires">Commentaires</label>
          <textarea id="commentaires"  value={commentaires} onChange={(e) => setCommentaires(e.target.value)} rows={4} />
        </div>
                            <div class="form-group">
                                <label htmlFor="image">Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    required
                                />
                            </div>

                            <div class="form-buttons">
                                <button type="submit" class="submit-button">Envoyer</button>
                                <button type="button" class="cancel-button" onClick={closeModal}>Annuler</button>
                            </div>
                            </div>
                        </form>
                    </div>
                </Modal>

                  {/* Modal de visualisation des données */}
     {viewSignaletique && (
          <Modal isOpen={isViewModalOpen} onClose={closeModal}>
            <div className="form-container">
              <h2>Détails du fiche signaletique</h2>
              <p><strong>Identification de Pont:</strong> {viewSignaletique.idPont}</p>
              <p><strong>pkReference:</strong> {viewSignaletique.pkReference}</p>
              <p><strong>pkOuvrage:</strong> {viewSignaletique.pkOuvrage}</p>
              <p><strong>Origine :</strong> {viewSignaletique.origine}</p>
              <p><strong>Extremite:</strong> {viewSignaletique.extremite}</p>
              <p><strong>Date de l'établissement:</strong> {formatDateEnLettres(viewSignaletique.dateEtablissement)}</p>
              <p><strong>Condition de météo:</strong> {viewSignaletique.conditionMeteo}</p>
              <p><strong>Type de surveillance:</strong> {viewSignaletique.typeSurveillance}</p>
              <p><strong>Distribution des Portées:</strong> {viewSignaletique.distributionPortee}</p>
              <p><strong>Longueur du Tablier (m):</strong> {viewSignaletique.longueurTablier}</p>
              <p><strong>Nombre de Travées:</strong> {viewSignaletique.nombreTravees}</p>
              <p><strong>Largeur Utile (m):</strong> {viewSignaletique.largeurUtile}</p>
              <p><strong>Largeur Roulable (m):</strong> {viewSignaletique.largeurRoulable}</p>
              <p><strong>Largeur des Trottoirs (m):</strong> {viewSignaletique.largeurTrottoirs}</p>
              <p><strong>Pente Longitudinale (%):</strong> {viewSignaletique.penteLongitudinale}</p>
              <p><strong>Garde-corps:</strong> {viewSignaletique.gardeCorps}</p>
              <p><strong>Biais de l'Ouvrage:</strong> {viewSignaletique.biaisOuvrage}</p>
              <p><strong>Nombre de Voies:</strong> {viewSignaletique.nombreVoies}</p>
              <p><strong>Revêtement de l'Ouvrage:</strong> {viewSignaletique.revetementOuvrage}</p>
              <p><strong>Tirant d'Air (m):</strong> {viewSignaletique.tirantAir}</p>
              <p><strong>Type de Route d'Accès:</strong> {viewSignaletique.typeRouteAcces}</p>
              <p><strong>Signalisation:</strong> {viewSignaletique.signalisation}</p>
              <p><strong>Appuis:</strong> {viewSignaletique.appuis}</p>
              <p><strong>Type de Piles:</strong> {viewSignaletique.typePiles}</p>
              <p><strong>Type de Culées:</strong> {viewSignaletique.typeCulees}</p>
              <p><strong>Fondations:</strong> {viewSignaletique.fondations}</p>
              <p><strong>Type de Protection:</strong> {viewSignaletique.typeProtection}</p>
              <p><strong>Affouillabilité:</strong> {viewSignaletique.affouillabilite}</p>
              <p><strong>Nature des Matériaux de Franchissement:</strong> {viewSignaletique.natureMateriauxFranchissement}</p>
              <p><strong>Type de Tablier:</strong> {viewSignaletique.typeTablier}</p>
              <p><strong>Type de Poutre:</strong> {viewSignaletique.typePoutre}</p>
              <p><strong>Matériaux du Tablier:</strong> {viewSignaletique.materiauxTablier}</p>
              <p><strong>Type de Dalle:</strong> {viewSignaletique.typeDalle}</p>
              <p><strong>Autres Caractéristiques:</strong> {viewSignaletique.autresCaracteristiques}</p>
              <p><strong>Aménagements Postérieurs:</strong> {viewSignaletique.amenagementsPosterieurs}</p>
              <p><strong>Particularités de l'Ouvrage:</strong> {viewSignaletique.particularitesOuvrage}</p>
              <p><strong>Note d'Évaluation:</strong> {viewSignaletique.noteEvaluation}</p>
              <p><strong>Commentaires:</strong> {viewSignaletique.commentaires}</p>
                        {viewSignaletique.image && (
              <div>
                <strong>Image :</strong>
                <img
                  src={`http://localhost:8081/signaletique/${viewSignaletique.image}`}
                  alt="Signalétique"
                  style={{ width: '200px', height: 'auto', borderRadius: '10px', maxWidth: '100%' }}
                />
              </div>
            )}
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

export default Signaletique;




