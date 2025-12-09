import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #e5e7eb;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(96, 165, 250, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem 3rem 3rem;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const Card = styled.div`
  background: rgba(2, 6, 23, 0.95);
  border-radius: 24px;
  padding: 2.5rem 3rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(148, 163, 184, 0.2);
  width: 100%;
  max-width: 900px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
  }
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: #f9fafb;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #9ca3af;
  margin: 0 0 2rem 0;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem 1.75rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: #e5e7eb;
`;

const Select = styled.select`
  padding: 0.7rem 0.9rem;
  border-radius: 0.6rem;
  border: 1px solid #4b5563;
  background: #020617;
  color: #e5e7eb;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.15s ease;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
  }
`;

const Input = styled.input`
  padding: 0.7rem 0.9rem;
  border-radius: 0.6rem;
  border: 1px solid #4b5563;
  background: #020617;
  color: #e5e7eb;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.15s ease;
  &::placeholder { color: #6b7280; }
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
  }
`;

const Small = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0.2rem 0 0 0;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.6rem;
  border-radius: 0.75rem;
  border: none;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #f9fafb;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NoteCard = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 1.25rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${p => p.$good ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 
                        p.$medium ? 'linear-gradient(90deg, #f97316, #fb923c)' : 
                        'linear-gradient(90deg, #ef4444, #f87171)'};
  }
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(148, 163, 184, 0.4);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
`;

const NoteCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const NoteCardTitle = styled.div`
  flex: 1;
`;

const NoteMatiere = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #f9fafb;
  margin: 0 0 0.25rem 0;
`;

const NoteNiveau = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
  font-size: 0.75rem;
  color: #93c5fd;
  font-weight: 500;
  margin-top: 0.25rem;
`;

const NoteScore = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: ${p => p.$good ? 'rgba(22, 163, 74, 0.15)' : 
                      p.$medium ? 'rgba(249, 115, 22, 0.15)' : 
                      'rgba(239, 68, 68, 0.15)'};
  border: 1px solid ${p => p.$good ? 'rgba(22, 163, 74, 0.3)' : 
                            p.$medium ? 'rgba(249, 115, 22, 0.3)' : 
                            'rgba(239, 68, 68, 0.3)'};
  border-radius: 8px;
  min-width: 70px;
`;

const NoteScoreValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${p => p.$good ? '#22c55e' : 
                p.$medium ? '#fb923c' : 
                '#f87171'};
  line-height: 1;
`;

const NoteScoreLabel = styled.div`
  font-size: 0.7rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

const NoteCardBody = styled.div`
  margin-bottom: 1rem;
`;

const NoteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #cbd5e1;
`;

const NoteInfoIcon = styled.span`
  color: #64748b;
  font-size: 0.9rem;
`;

const NoteCardFooter = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
`;

const DeleteButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  color: #fca5a5;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
  }
`;

const EditButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
  color: #93c5fd;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 0.5rem;
  &:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TableWrapper = styled.div`
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.3);
  overflow: hidden;
  background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent),
              rgba(2, 6, 23, 0.8);
  box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.1);
  margin-top: 2rem;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.5fr 0.8fr 1fr 1fr 1.2fr;
  padding: 0.85rem 1.2rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(15, 23, 42, 0.95);
  color: #9ca3af;
  gap: 1rem;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.5fr 0.8fr 1fr 1fr 1.2fr;
  padding: 0.85rem 1.2rem;
  font-size: 0.9rem;
  border-top: 1px solid rgba(31, 41, 55, 0.8);
  gap: 1rem;
  align-items: center;
  &:nth-child(even) {
    background: rgba(15, 23, 42, 0.7);
  }
  &:hover {
    background: rgba(15, 23, 42, 0.9);
  }
`;

const DashboardSection = styled.div`
  margin: 2rem 0;
`;

const YearCard = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const YearTitle = styled.h3`
  font-size: 1.3rem;
  color: #f9fafb;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const YearStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const YearStat = styled.div`
  padding: 0.75rem;
  background: rgba(2, 6, 23, 0.8);
  border-radius: 8px;
  text-align: center;
`;

const YearStatLabel = styled.div`
  font-size: 0.7rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
`;

const YearStatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #f9fafb;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background: rgba(37, 99, 235, 0.15);
  color: #bfdbfe;
`;

const NotePill = styled.span`
  display: inline-flex;
  min-width: 2.5rem;
  justify-content: center;
  padding: 0.2rem 0.55rem;
  border-radius: 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #f9fafb;
  background: ${p => p.$good ? '#16a34a' : p.$medium ? '#f97316' : '#ef4444'};
`;

const EmptyState = styled.div`
  padding: 1.2rem 1.2rem 1.4rem;
  font-size: 0.9rem;
  color: #9ca3af;
`;

const StatsSection = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
`;

const StatsTitle = styled.h3`
  font-size: 1.2rem;
  color: #f9fafb;
  margin: 0 0 1rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  padding: 1rem;
  background: rgba(2, 6, 23, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.15);
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f9fafb;
`;

const MatiereStats = styled.div`
  margin-top: 1rem;
`;

const MatiereRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  &:last-child {
    border-bottom: none;
  }
`;

const MatiereName = styled.span`
  color: #e5e7eb;
  font-size: 0.9rem;
`;

const MatiereAvg = styled.span`
  color: #60a5fa;
  font-weight: 600;
  font-size: 0.95rem;
`;

const levelLabels = {
  seconde: 'Seconde',
  premiere: 'Première',
  terminale: 'Terminale',
};

const MesNotes = () => {
  const navigate = useNavigate();
  const [lycees, setLycees] = useState([]);
  const [form, setForm] = useState({
    niveau: '',
    etablissement: '',
    matiere: '',
    note: '',
  });
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('scoolize_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const notesArray = Array.isArray(parsed) ? parsed : [];
        // Ajouter un ID aux notes qui n'en ont pas (rétrocompatibilité)
        const notesWithId = notesArray.map(note => {
          if (!note.id) {
            return {
              ...note,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            };
          }
          return note;
        });
        setNotes(notesWithId);
        // Sauvegarder avec les IDs si on a modifié
        if (notesWithId.length !== notesArray.length || notesArray.some(n => !n.id)) {
          localStorage.setItem('scoolize_notes', JSON.stringify(notesWithId));
        }
      } catch (e) {
        console.error('pb parse notes', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Ne sauvegarder que si les notes ont déjà été chargées depuis localStorage
    if (isLoaded) {
      localStorage.setItem('scoolize_notes', JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  useEffect(() => {
    // charge la liste des lycées depuis le CSV
    const loadLycees = async () => {
      try {
        const res = await fetch('/data/lycees.csv');
        const txt = await res.text();
        const lignes = txt.split('\n')
          .map(l => l.trim())
          .filter(l => l && !l.startsWith('#'));
        
        // enlever les doublons et trier
        const uniques = [...new Set(lignes)].sort((a, b) => 
          a.localeCompare(b, 'fr')
        );
        setLycees(uniques);
      } catch (err) {
        console.error('pb chargement lycées', err);
      }
    };
    loadLycees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.matiere || !form.note || !form.etablissement || !form.niveau) {
      return; // champs manquants
    }
    
    // gérer virgule ou point pour la note
    const noteValue = Number(form.note.replace(',', '.'));
    if (isNaN(noteValue) || noteValue < 0 || noteValue > 20) {
      return; // note invalide
    }

    if (editingId) {
      // Mode édition
      const updatedNotes = notes.map(n => 
        n.id === editingId 
          ? { ...form, note: noteValue.toFixed(2), id: editingId }
          : n
      );
      setNotes(updatedNotes);
      localStorage.setItem('scoolize_notes', JSON.stringify(updatedNotes));
      setEditingId(null);
    } else {
      // Mode ajout
      const newNote = {
        ...form,
        note: noteValue.toFixed(2),
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      localStorage.setItem('scoolize_notes', JSON.stringify(updatedNotes));
    }
    
    // reset form
    setForm({ niveau: '', etablissement: '', matiere: '', note: '' });
  };

  const getNoteStatus = (note) => {
    const n = parseFloat(note);
    if (n >= 14) return { good: true, medium: false };
    if (n >= 10) return { good: false, medium: true };
    return { good: false, medium: false };
  };

  const handleDelete = (id) => {
    if (window.confirm('Es-tu sûr de vouloir supprimer cette note ?')) {
      const updatedNotes = notes.filter(n => n.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem('scoolize_notes', JSON.stringify(updatedNotes));
    }
  };

  const handleEdit = (note) => {
    setForm({
      niveau: note.niveau,
      etablissement: note.etablissement,
      matiere: note.matiere,
      note: note.note,
    });
    setEditingId(note.id);
    // Scroll vers le formulaire
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ niveau: '', etablissement: '', matiere: '', note: '' });
  };

  // Calcul des statistiques
  const stats = useMemo(() => {
    if (notes.length === 0) return null;

    const allNotes = notes.map(n => parseFloat(n.note)).filter(n => !isNaN(n));
    const moyenneGenerale = allNotes.length > 0
      ? (allNotes.reduce((s, v) => s + v, 0) / allNotes.length).toFixed(2)
      : 0;

    // Moyennes par matière
    const parMatiere = {};
    notes.forEach(n => {
      const mat = n.matiere;
      const val = parseFloat(n.note);
      if (!isNaN(val)) {
        if (!parMatiere[mat]) parMatiere[mat] = [];
        parMatiere[mat].push(val);
      }
    });

    const moyennesMatiere = Object.entries(parMatiere).map(([mat, vals]) => ({
      matiere: mat,
      moyenne: (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2),
      count: vals.length,
    })).sort((a, b) => parseFloat(b.moyenne) - parseFloat(a.moyenne));

    // Répartition par niveau
    const parNiveau = {};
    notes.forEach(n => {
      const niv = n.niveau;
      if (!parNiveau[niv]) parNiveau[niv] = 0;
      parNiveau[niv]++;
    });

    return {
      total: notes.length,
      moyenneGenerale,
      moyennesMatiere,
      parNiveau,
    };
  }, [notes]);

  const handleLogout = () => {
    localStorage.removeItem('scoolize_user');
    navigate('/');
  };

  return (
    <PageContainer>
      <NavBar active="notes" />

      <Main>
        <Card>
          <Title>Mes notes</Title>
          <Subtitle>
            Ajoute tes notes par niveau, matière et établissement pour que Scoolize puisse mieux te proposer des formations adaptées.
          </Subtitle>

          <Form onSubmit={handleSubmit}>
            <Field>
              <Label>Niveau</Label>
              <Select
                name="niveau"
                value={form.niveau}
                onChange={handleChange}
              >
                <option value="">Choisir un niveau</option>
                <option value="seconde">Seconde</option>
                <option value="premiere">Première</option>
                <option value="terminale">Terminale</option>
              </Select>
            </Field>

            <Field>
              <Label>Établissement</Label>
              <Select
                name="etablissement"
                value={form.etablissement}
                onChange={handleChange}
              >
                <option value="">Choisir ton lycée</option>
                {lycees.slice(0, 200).map((l, i) => (
                  <option key={i} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
              <Small>Sélectionne ton lycée dans la liste (liste limitée aux premiers résultats).</Small>
            </Field>

            <Field>
              <Label>Matière</Label>
              <Select
                name="matiere"
                value={form.matiere}
                onChange={handleChange}
              >
                <option value="">Choisir une matière</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Français">Français</option>
                <option value="Histoire-Géographie">Histoire-Géographie</option>
                <option value="SES">Sciences Économiques et Sociales</option>
                <option value="Physique-Chimie">Physique-Chimie</option>
                <option value="SVT">SVT</option>
                <option value="Anglais">Anglais</option>
                <option value="Espagnol">Espagnol</option>
                <option value="Philosophie">Philosophie</option>
              </Select>
            </Field>

            <Field>
              <Label>Note (/20)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="20"
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Ex : 14.5"
              />
              <Small>Entre une note entre 0 et 20, avec éventuellement une décimale.</Small>
            </Field>

            <ButtonRow>
              <Button type="submit">
                {editingId ? '✓ Modifier la note' : '+ Ajouter la note'}
              </Button>
              {editingId && (
                <Button 
                  type="button" 
                  onClick={handleCancelEdit}
                  style={{ 
                    background: 'rgba(148, 163, 184, 0.1)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    color: '#9ca3af'
                  }}
                >
                  Annuler
                </Button>
              )}
            </ButtonRow>
          </Form>

          {notes.length === 0 ? (
            <EmptyState style={{ padding: '3rem', textAlign: 'center' }}>
              Aucune note enregistrée pour l'instant. Ajoute au moins une note pour commencer à construire ton profil.
            </EmptyState>
          ) : (
            <TableWrapper>
              <TableHeader>
                <span>Niveau</span>
                <span>Matière</span>
                <span>Établissement</span>
                <span>Note</span>
                <span>Moy. matière</span>
                <span>Moy. niveau</span>
                <span>Actions</span>
              </TableHeader>
              {['seconde', 'premiere', 'terminale'].map(niveau => {
                const notesNiveau = notes.filter(n => n.niveau === niveau);
                if (notesNiveau.length === 0) return null;

                const moyenneNiveau = notesNiveau.reduce((sum, n) => sum + parseFloat(n.note), 0) / notesNiveau.length;
                const matieresNiveau = {};
                notesNiveau.forEach(n => {
                  if (!matieresNiveau[n.matiere]) {
                    matieresNiveau[n.matiere] = [];
                  }
                  matieresNiveau[n.matiere].push(parseFloat(n.note));
                });

                return notesNiveau.map((n, idx) => {
                  const status = getNoteStatus(n.note);
                  const moyenneMatiere = matieresNiveau[n.matiere].reduce((s, v) => s + v, 0) / matieresNiveau[n.matiere].length;
                  const isFirstInNiveau = idx === 0;
                  
                  return (
                    <TableRow key={n.id}>
                      <span>
                        {isFirstInNiveau && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <Pill>{levelLabels[niveau] || niveau}</Pill>
                            <span style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                              Moy: {moyenneNiveau.toFixed(2)}/20
                            </span>
                          </div>
                        )}
                      </span>
                      <span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span style={{ fontWeight: 500 }}>{n.matiere}</span>
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            Moy: {moyenneMatiere.toFixed(2)}/20 ({matieresNiveau[n.matiere].length} note{matieresNiveau[n.matiere].length > 1 ? 's' : ''})
                          </span>
                        </div>
                      </span>
                      <span>{n.etablissement}</span>
                      <span>
                        <NotePill $good={status.good} $medium={status.medium}>
                          {n.note}
                        </NotePill>
                      </span>
                      <span style={{ color: '#60a5fa', fontWeight: 500 }}>
                        {moyenneMatiere.toFixed(2)}/20
                      </span>
                      <span style={{ color: '#93c5fd', fontWeight: 500 }}>
                        {moyenneNiveau.toFixed(2)}/20
                      </span>
                      <span>
                        <ActionButtons>
                          <EditButton onClick={() => handleEdit(n)}>
                            Modifier
                          </EditButton>
                          <DeleteButton onClick={() => handleDelete(n.id)}>
                            Supprimer
                          </DeleteButton>
                        </ActionButtons>
                      </span>
                    </TableRow>
                  );
                });
              })}
            </TableWrapper>
          )}
        </Card>
      </Main>
    </PageContainer>
  );
};

export default MesNotes;


