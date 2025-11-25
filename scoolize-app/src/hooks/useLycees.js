import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const useLycees = () => {
    const [lycees, setLycees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLycees = async () => {
            try {
                const response = await fetch('/data/parcoursup.csv');
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const etablissements = new Set();
                        results.data.forEach(row => {
                            const nom = row["Nom de l'établissement"];
                            if (nom && nom.trim() && nom.length > 3) {
                                const cleaned = nom.trim().replace(/^"|"$/g, '');
                                if (cleaned && !cleaned.startsWith(',')) {
                                    etablissements.add(cleaned);
                                }
                            }
                        });
                        const lyceesArray = Array.from(etablissements).sort();
                        console.log(`✅ ${lyceesArray.length} établissements chargés depuis le CSV`);
                        setLycees(lyceesArray);
                        setLoading(false);
                    }
                });
            } catch (error) {
                console.error('Erreur lors du chargement des lycées:', error);
                setLoading(false);
            }
        };

        loadLycees();
    }, []);

    return { lycees, loading };
};
