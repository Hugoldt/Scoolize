const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../src/data/fr-esr-cartographie_formations_parcoursup - fr-esr-cartographie_formations_parcoursup.csv');
const outputFile = path.join(__dirname, '../public/data/etablissements-superieur.csv');

console.log('Lecture du fichier source...');
const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n');

const etablissements = new Set();
let count = 0;

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

console.log('Extraction des établissements...');
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const columns = parseCSVLine(line);
  if (columns.length >= 3) {
    const nomEtablissement = columns[2].trim().replace(/^"|"$/g, '');
    if (nomEtablissement && nomEtablissement !== 'Nom de l\'établissement' && nomEtablissement.length > 2) {
      etablissements.add(nomEtablissement);
      count++;
    }
  }
}

const etablissementsArray = Array.from(etablissements).sort((a, b) => 
  a.localeCompare(b, 'fr', { sensitivity: 'base' })
);

console.log(`Total de lignes traitées: ${count}`);
console.log(`Établissements uniques trouvés: ${etablissementsArray.length}`);

const csvContent = 'Nom de l\'établissement\n' + etablissementsArray.map(e => `"${e}"`).join('\n');

fs.writeFileSync(outputFile, csvContent, 'utf-8');
console.log(`Fichier créé: ${outputFile}`);

