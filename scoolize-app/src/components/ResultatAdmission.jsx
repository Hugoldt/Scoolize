import React from 'react';
import calculerProbabiliteAdmission from '../utils/probabilityCalculator';

function ResultatAdmission() {
    const studentData = {
        nom: 'Alex Dupont',
        moyenneGenerale: 15.2,
        filiere: 'S',
    };

    const formationData = {
        nom: 'Licence Informatique',
        moyenneAdmis: 14.5,
        ecartTypeAdmis: 1.2,
        filiereRecherchee: 'S',
    };

    const poidsPrio = studentData.filiere === formationData.filiereRecherchee ? 0.8 : 0.4;

    const resultat = calculerProbabiliteAdmission(
        studentData.moyenneGenerale,
        formationData.moyenneAdmis,
        formationData.ecartTypeAdmis,
        poidsPrio
    );

    return (
        <section style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginTop: '1rem' }}>
            <h2>Estimation de Probabilité d'Admission</h2>
            <p><strong>Étudiant :</strong> {studentData.nom} — Moyenne : {studentData.moyenneGenerale}</p>
            <p><strong>Formation :</strong> {formationData.nom} (Moyenne admis: {formationData.moyenneAdmis}, σ: {formationData.ecartTypeAdmis})</p>
            <h3>Probabilité estimée : {resultat.pourcentage}%</h3>
            <p><strong>Interprétation :</strong> {resultat.interpretation}</p>
        </section>
    );
}

export default ResultatAdmission;

