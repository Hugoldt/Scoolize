const matieresParFormation = {
  "mathématiques": ["Mathématiques", "Physique-Chimie"],
  "math": ["Mathématiques", "Physique-Chimie"],
  "physique": ["Mathématiques", "Physique-Chimie"],
  "informatique": ["Mathématiques", "Physique-Chimie"],
  "ingénieur": ["Mathématiques", "Physique-Chimie"],
  "ingénierie": ["Mathématiques", "Physique-Chimie"],
  "sciences": ["Mathématiques", "Physique-Chimie", "SVT"],
  "économie": ["SES", "Mathématiques"],
  "gestion": ["SES", "Mathématiques"],
  "commerce": ["SES", "Mathématiques"],
  "svt": ["SVT", "Physique-Chimie"],
  "biologie": ["SVT", "Physique-Chimie"],
  "chimie": ["Physique-Chimie", "Mathématiques"],
  "histoire": ["Histoire-Géographie", "Français"],
  "géographie": ["Histoire-Géographie"],
  "lettres": ["Français", "Philosophie"],
  "littéraire": ["Français", "Philosophie", "Histoire-Géographie"],
  "philosophie": ["Philosophie", "Français"],
  "langues": ["Anglais", "Espagnol"],
  "anglais": ["Anglais"],
  "espagnol": ["Espagnol"],
};

function detecterSelectivite(nomEcole) {
  if (!nomEcole) return "moyen";
  
  const nomLower = nomEcole.toLowerCase();
  
  if (nomLower.includes("polytechnique") || 
      nomLower.includes("henri iv") ||
      nomLower.includes("henri-iv") ||
      nomLower.includes("henry iv") ||
      nomLower.includes("henry-iv") ||
      nomLower.includes("henri 4") ||
      nomLower.includes("henri-4") ||
      nomLower.includes("hec") ||
      nomLower.includes("sciences po") ||
      nomLower.includes("normale sup") ||
      nomLower.includes("ens ") ||
      nomLower.includes("centrale") ||
      nomLower.includes("essec") ||
      nomLower.includes("escp") ||
      nomLower.includes("louis le grand") ||
      nomLower.includes("louis-le-grand") ||
      nomLower.includes("saint-louis") ||
      nomLower.includes("saint louis") ||
      nomLower.includes("mines") ||
      nomLower.includes("ponts") ||
      nomLower.includes("supaéro") ||
      nomLower.includes("supaero") ||
      nomLower.includes("psl") ||
      nomLower.includes("sorbonne") && nomLower.includes("licence sélective")) {
    return "tres_selectif";
  }
  
  if (nomLower.includes("epita") ||
      nomLower.includes("insa") ||
      nomLower.includes("utc") ||
      nomLower.includes("ecole centrale") ||
      nomLower.includes("école d'ingénieur") ||
      nomLower.includes("ecole d'ingenieur")) {
    return "selectif";
  }
  
  if (nomLower.includes("epitech") ||
      nomLower.includes("epsi") ||
      nomLower.includes("supinfo") ||
      nomLower.includes("42")) {
    return "moyen";
  }
  
  if (nomLower.includes("bts") || 
      nomLower.includes("iut") ||
      nomLower.includes("lycée professionnel") ||
      nomLower.includes("lycee professionnel")) {
    return "peu_selectif";
  }
  
  return "moyen";
}

function calculerMoyenne(notes) {
  if (!notes || notes.length === 0) return 0;
  const somme = notes.reduce((acc, note) => acc + parseFloat(note.note || 0), 0);
  return somme / notes.length;
}

function calculerMoyenneMatiere(notes, matieres) {
  if (!matieres || matieres.length === 0) return 0;
  
  const notesFiltrees = notes.filter(note => 
    matieres.some(m => 
      note.matiere.toLowerCase().includes(m.toLowerCase())
    )
  );
  
  if (notesFiltrees.length === 0) return 0;
  
  const somme = notesFiltrees.reduce((acc, note) => acc + parseFloat(note.note || 0), 0);
  return somme / notesFiltrees.length;
}

function trouverMatieresPertinentes(formationNom) {
  if (!formationNom) return [];
  
  const formationLower = formationNom.toLowerCase();
  
  for (const [motCle, matieres] of Object.entries(matieresParFormation)) {
    if (formationLower.includes(motCle)) {
      return matieres;
    }
  }
  
  return [];
}

function convertirEnPourcentage(score, selectivite) {
  if (selectivite === "tres_selectif") {
    if (score >= 18) return 70;
    if (score >= 17) return 55;
    if (score >= 16) return 40;
    if (score >= 15) return 25;
    if (score >= 14) return 15;
    if (score >= 13) return 8;
    if (score >= 12) return 5;
    return 2;
  }
  
  if (selectivite === "selectif") {
    if (score >= 17) return 80;
    if (score >= 16) return 70;
    if (score >= 15) return 60;
    if (score >= 14) return 50;
    if (score >= 13) return 40;
    if (score >= 12) return 30;
    if (score >= 11) return 20;
    return 10;
  }
  
  if (selectivite === "moyen") {
    if (score >= 16) return 85;
    if (score >= 15) return 75;
    if (score >= 14) return 65;
    if (score >= 13) return 55;
    if (score >= 12) return 45;
    if (score >= 11) return 35;
    if (score >= 10) return 25;
    return 10;
  }
  
  if (selectivite === "peu_selectif") {
    if (score >= 14) return 90;
    if (score >= 13) return 85;
    if (score >= 12) return 75;
    if (score >= 11) return 65;
    if (score >= 10) return 55;
    if (score >= 9) return 45;
    if (score >= 8) return 35;
    return 20;
  }
  
  return 50;
}

export function calculerChanceAdmission(notes, voeu, ecole) {
  if (!notes || notes.length === 0) {
    return { pourcentage: 0, message: "Aucune note enregistrée" };
  }
  
  const moyenneGenerale = calculerMoyenne(notes);
  
  if (moyenneGenerale === 0) {
    return { pourcentage: 0, message: "Notes invalides" };
  }
  
  const selectivite = detecterSelectivite(ecole?.nom_ecole || "");
  const matieresPertinentes = trouverMatieresPertinentes(voeu?.formation_nom || "");
  
  let score = 0;
  
  if (selectivite === "tres_selectif") {
    const moyenneMatiere = matieresPertinentes.length > 0 
      ? calculerMoyenneMatiere(notes, matieresPertinentes)
      : moyenneGenerale;
    
    if (moyenneMatiere > 0) {
      score = (moyenneGenerale * 0.35) + (moyenneMatiere * 0.65);
    } else {
      score = moyenneGenerale * 0.65;
    }
  } else if (selectivite === "selectif") {
    const moyenneMatiere = matieresPertinentes.length > 0 
      ? calculerMoyenneMatiere(notes, matieresPertinentes)
      : moyenneGenerale;
    
    if (moyenneMatiere > 0) {
      score = (moyenneGenerale * 0.5) + (moyenneMatiere * 0.5);
    } else {
      score = moyenneGenerale * 0.85;
    }
  } else if (selectivite === "moyen") {
    const moyenneMatiere = matieresPertinentes.length > 0 
      ? calculerMoyenneMatiere(notes, matieresPertinentes)
      : moyenneGenerale;
    
    if (moyenneMatiere > 0) {
      score = (moyenneGenerale * 0.6) + (moyenneMatiere * 0.4);
    } else {
      score = moyenneGenerale;
    }
  } else {
    score = moyenneGenerale;
  }
  
  const pourcentage = convertirEnPourcentage(score, selectivite);
  
  let message = "";
  if (pourcentage >= 70) {
    message = "Très bonne chance";
  } else if (pourcentage >= 50) {
    message = "Bonne chance";
  } else if (pourcentage >= 30) {
    message = "Chance modérée";
  } else {
    message = "Chance faible";
  }
  
  return {
    pourcentage: Math.round(pourcentage),
    message,
    moyenneGenerale: moyenneGenerale.toFixed(1),
    selectivite
  };
}

