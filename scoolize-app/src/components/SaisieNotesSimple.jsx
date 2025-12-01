import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const SaisieNotesSimple = () => {
    const [matiere, setMatiere] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from('notes')
            .insert([
                { matiere: matiere, note: parseFloat(note) }
            ]);

        if (error) {
            alert('Erreur !');
            console.error('Erreur Supabase:', error);
        } else {
            alert('Note enregistrée !');
            setMatiere('');
            setNote('');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Saisie de Notes</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Matière :</label>
                    <input
                        type="text"
                        value={matiere}
                        onChange={(e) => setMatiere(e.target.value)}
                        required
                        style={{ marginLeft: '10px', padding: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Note :</label>
                    <input
                        type="number"
                        step="0.01"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        required
                        style={{ marginLeft: '10px', padding: '5px' }}
                    />
                </div>

                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Enregistrer
                </button>
            </form>
        </div>
    );
};

export default SaisieNotesSimple;
