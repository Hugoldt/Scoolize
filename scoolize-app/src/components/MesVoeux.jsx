import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLycees } from '../hooks/useLycees';
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

const TableWrapper = styled.div`
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.3);
  overflow: hidden;
  background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent),
              rgba(2, 6, 23, 0.8);
  box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1.4fr 1.2fr 0.7fr 1fr;
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
  grid-template-columns: 1.4fr 1.4fr 1.2fr 0.7fr 1fr;
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

const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 0.85rem;
  margin-bottom: 1rem;
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

const EmptyState = styled.div`
  padding: 1.2rem 1.2rem 1.4rem;
  font-size: 0.9rem;
  color: #9ca3af;
`;

const formationSuggestions = [
  // Formations scientifiques et techniques
  'Licence Mathématiques',
  'Licence Mathématiques-Informatique',
  'Licence Informatique',
  'Licence Physique',
  'Licence Chimie',
  'Licence Biologie',
  'Licence Sciences de la vie',
  'BUT Informatique',
  'BUT GMP',
  'BUT Génie Civil',
  'BUT Mesures Physiques',
  'BUT Génie Biologique',
  'Prépa MPSI',
  'Classe prépa MPSI',
  'Classe prépa MP',
  'Classe prépa PC',
  'Classe prépa PSI',
  'École d\'ingénieur post-bac',
  // Formations économiques et commerciales
  'Licence Économie',
  'Licence Économie-Gestion',
  'Licence Gestion',
  'BUT GEA',
  'Classe prépa ECS',
  'Classe prépa ECE',
  'École de commerce post-bac',
  // Formations littéraires et juridiques
  'Licence Droit',
  'Licence Histoire',
  'Licence Lettres',
  'Licence Philosophie',
  'BUT TC',
  'Classe prépa Lettres',
  'Classe prépa BL',
  // Formations sciences humaines et sociales
  'Licence Psychologie',
  'Licence Sociologie',
  'Licence Sciences de l\'éducation',
  // Formations langues
  'Licence Langues Étrangères Appliquées',
  'Licence LLCE Anglais',
  // Formations artistiques et communication
  'Licence Arts',
  'BUT Information-Communication',
];

const MesVoeux = () => {
  const { lycees: etablissementsDisponibles } = useLycees();
  const [form, setForm] = useState({
    formation: '',
    etablissement: '',
    ville: '',
    priorite: '1',
  });
  const [voeux, setVoeux] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur quand l'utilisateur modifie le formulaire
    if (error) {
      setError('');
    }
  };

  useEffect(() => {
    // Charger les vœux sauvegardés
    const saved = localStorage.getItem('scoolize_voeux');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const voeuxArray = Array.isArray(parsed) ? parsed : [];
        // Ajouter un ID aux vœux qui n'en ont pas (rétrocompatibilité)
        const voeuxWithId = voeuxArray.map(voeu => {
          if (!voeu.id) {
            return {
              ...voeu,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            };
          }
          return voeu;
        });
        setVoeux(voeuxWithId);
        // Sauvegarder avec les IDs si on a modifié
        if (voeuxWithId.length !== voeuxArray.length || voeuxArray.some(v => !v.id)) {
          localStorage.setItem('scoolize_voeux', JSON.stringify(voeuxWithId));
        }
      } catch (e) {
        setVoeux([]);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.formation || !form.etablissement) {
      setError('Veuillez remplir au moins la formation et l\'établissement.');
      return;
    }
    
    // Vérifier si la priorité est déjà utilisée
    const prioriteExistante = voeux.find(v => v.priorite === form.priorite);
    if (prioriteExistante) {
      setError(`La priorité ${form.priorite} est déjà utilisée par "${prioriteExistante.formation}". Choisis une autre priorité.`);
      return;
    }
    
    const newVoeu = {
      ...form,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    const newVoeux = [...voeux, newVoeu];
    setVoeux(newVoeux);
    // Sauvegarder dans localStorage
    localStorage.setItem('scoolize_voeux', JSON.stringify(newVoeux));
    // reset form
    setForm({
      formation: '',
      etablissement: '',
      ville: '',
      priorite: '1',
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Es-tu sûr de vouloir supprimer ce vœu ?')) {
      const newVoeux = voeux.filter(v => v.id !== id);
      setVoeux(newVoeux);
      localStorage.setItem('scoolize_voeux', JSON.stringify(newVoeux));
    }
  };

  return (
    <PageContainer>
      <NavBar active="voeux" />

      <Main>
        <Card>
          <Title>Mes vœux</Title>
          <Subtitle>
            Ajoute les formations que tu vises, avec l’établissement et la ville. Tu pourras ensuite les relier à ton profil de notes.
          </Subtitle>

          <Form onSubmit={handleSubmit}>
            <Field>
              <Label>Nom de la formation</Label>
              <Input
                name="formation"
                value={form.formation}
                onChange={handleChange}
                placeholder="Ex : Licence Économie-Gestion"
                list="formation-options"
              />
              <datalist id="formation-options">
                {formationSuggestions.map((f, i) => (
                  <option key={i} value={f} />
                ))}
              </datalist>
              <Small>Tu peux saisir librement ou choisir dans la liste (datalist).</Small>
            </Field>

            <Field>
              <Label>Établissement</Label>
              <Select
                name="etablissement"
                value={form.etablissement}
                onChange={handleChange}
              >
                <option value="">Choisir un établissement</option>
                {etablissementsDisponibles.slice(0, 300).map((e, i) => (
                  <option key={i} value={e}>
                    {e}
                  </option>
                ))}
              </Select>
              <Small>
                Liste issue des établissements Parcoursup (limitée aux premiers résultats pour rester lisible).
              </Small>
            </Field>

            <Field>
              <Label>Ville</Label>
              <Input
                name="ville"
                value={form.ville}
                onChange={handleChange}
                placeholder="Ex : Lyon"
              />
              <Small>Optionnel mais utile pour filtrer tes vœux par localisation.</Small>
            </Field>

            <Field>
              <Label>Priorité</Label>
              <Select
                name="priorite"
                value={form.priorite}
                onChange={handleChange}
              >
                <option value="1">Priorité 1 (top choix)</option>
                <option value="2">Priorité 2</option>
                <option value="3">Priorité 3</option>
                <option value="4">Priorité 4</option>
                <option value="5">Priorité 5</option>
              </Select>
              <Small>Tu peux classer tes vœux pour voir rapidement ceux qui comptent le plus pour toi.</Small>
            </Field>

            <ButtonRow>
              <Button type="submit">
                + Ajouter le vœu
              </Button>
            </ButtonRow>
          </Form>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <TableWrapper>
            {voeux.length === 0 ? (
              <EmptyState>
                Aucun vœu enregistré pour l'instant. Ajoute au moins une formation que tu vises.
              </EmptyState>
            ) : (
              <>
                <TableHeader>
                  <span>Formation</span>
                  <span>Établissement</span>
                  <span>Ville</span>
                  <span>Priorité</span>
                  <span>Actions</span>
                </TableHeader>
                {voeux
                  .sort((a, b) => Number(a.priorite) - Number(b.priorite))
                  .map((v) => (
                    <TableRow key={v.id}>
                      <span>{v.formation}</span>
                      <span>{v.etablissement}</span>
                      <span>{v.ville || '-'}</span>
                      <span>
                        <Pill>#{v.priorite}</Pill>
                      </span>
                      <span>
                        <DeleteButton onClick={() => handleDelete(v.id)}>
                          🗑️ Supprimer
                        </DeleteButton>
                      </span>
                    </TableRow>
                  ))}
              </>
            )}
          </TableWrapper>
        </Card>
      </Main>
    </PageContainer>
  );
};

export default MesVoeux;


