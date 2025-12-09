import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const useLycees = () => {
    const [lycees, setLycees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLycees = async () => {
            try {
                const res = await fetch('/data/parcoursup.csv');
                const csvText = await res.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const etabs = new Set();
                        results.data.forEach(row => {
                            const nom = row["Nom de l'établissement"];
                            if (nom && nom.trim() && nom.length > 3) {
                                // nettoyer les guillemets et virgules bizarres
                                const cleaned = nom.trim().replace(/^"|"$/g, '');
                                if (cleaned && !cleaned.startsWith(',')) {
                                    etabs.add(cleaned);
                                }
                            }
                        });
                        const lyceesList = Array.from(etabs).sort();
                        console.log(`${lyceesList.length} établissements chargés`);
                        setLycees(lyceesList);
                        setLoading(false);
                    }
                });
            } catch (err) {
                console.error('erreur chargement CSV', err);
                setLoading(false);
            }
        };

        loadLycees();
    }, []);

    return { lycees, loading };
};
