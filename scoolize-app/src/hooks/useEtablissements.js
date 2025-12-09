import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const useEtablissements = () => {
  const [etablissements, setEtablissements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEtablissements = async () => {
      try {
        const res = await fetch('/data/etablissements-superieur.csv');
        const csvText = await res.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const etabs = new Set();
            results.data.forEach(row => {
              const nom = row["Nom de l'établissement"];
              if (nom && nom.trim() && nom.length > 3) {
                const cleaned = nom.trim().replace(/^"|"$/g, '');
                if (cleaned) {
                  etabs.add(cleaned);
                }
              }
            });
            const etabsList = Array.from(etabs).sort((a, b) =>
              a.localeCompare(b, 'fr', { sensitivity: 'base' })
            );
            setEtablissements(etabsList);
            setLoading(false);
          },
          error: (err) => {
            console.error('Erreur parsing CSV établissements', err);
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('Erreur chargement établissements', err);
        setLoading(false);
      }
    };

    loadEtablissements();
  }, []);

  return { etablissements, loading };
};

