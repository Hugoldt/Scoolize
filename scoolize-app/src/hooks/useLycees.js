import { useState, useEffect } from 'react';

export const useLycees = () => {
    const [lycees, setLycees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLycees = async () => {
            try {
                const response = await fetch('/data/lycees.csv');
                const text = await response.text();

                const lines = text.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);

                console.log(`✅ ${lines.length} lycées chargés depuis le CSV`);
                setLycees(lines);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement des lycées:', error);
                setLoading(false);
            }
        };

        loadLycees();
    }, []);

    return { lycees, loading };
};
