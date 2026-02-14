import React from "react";


const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <h1 className="about-title">À Propos de Notre Système</h1>
        <p className="about-description">
          Notre solution est une plateforme innovante conçue pour la gestion efficace des ponts, des diagnostics et des interventions. Découvrez ci-dessous les principales fonctionnalités et comment elles transforment votre travail quotidien.
        </p>
        <div className="about-cards">
          {/* Gestion de Pont */}
          <div className="about-card">
            <h2 className="card-title">Gestion de Pont</h2>
            <p className="card-description">
              Simplifiez la gestion des ponts avec un suivi précis de leur état, leurs caractéristiques, et leur localisation. Le système permet :
              <ul>
                <li>Un suivi détaillé de l’infrastructure.</li>
                <li>Une visualisation cartographique des ponts.</li>
                <li>Une organisation centralisée des données pour une gestion efficace.</li>
              </ul>
            </p>
          </div>

          {/* Gestion de Diagnostics */}
          <div className="about-card">
            <h2 className="card-title">Gestion de Diagnostics</h2>
            <p className="card-description">
              Automatisez et structurez vos diagnostics pour garantir la sécurité et la conformité. Fonctionnalités :
              <ul>
                <li>Création de rapports de diagnostic détaillés.</li>
                <li>Évaluation des risques et recommandations.</li>
                <li>Historique complet des inspections.</li>
              </ul>
            </p>
          </div>

          {/* Gestion de Fiche Signalétique */}
          <div className="about-card">
            <h2 className="card-title">Gestion de Fiche Signalétique</h2>
            <p className="card-description">
              Gardez toutes les informations essentielles à portée de main. Notre système offre :
              <ul>
                <li>Une base de données centralisée des fiches signalétiques.</li>
                <li>Une recherche rapide par catégorie ou critère.</li>
                <li>Un accès sécurisé et un archivage fiable.</li>
              </ul>
            </p>
          </div>

          {/* Intervention */}
          <div className="about-card">
            <h2 className="card-title">Intervention</h2>
            <p className="card-description">
              Gérez les interventions de manière proactive avec un système intégré permettant :
              <ul>
                <li>La planification et le suivi des interventions.</li>
                <li>Une communication simplifiée entre les équipes.</li>
                <li>Des rapports détaillés sur les travaux effectués.</li>
              </ul>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
