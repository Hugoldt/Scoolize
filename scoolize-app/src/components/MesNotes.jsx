import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #e5e7eb;
`;

const Header = styled.header`
  padding: 1.5rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.9);
  border-bottom: 1px solid rgba(148, 163, 184, 0.4);
  backdrop-filter: blur(10px);
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f9fafb;
  margin: 0;
  span { color: #60a5fa; }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: none;
  background: ${p => p.$active ? '#2563eb' : 'transparent'};
  color: ${p => p.$active ? '#f9fafb' : '#e5e7eb'};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: ${p => p.$active ? '#1d4ed8' : 'rgba(148, 163, 184, 0.25)'};
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem 3rem 3rem;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  background: #020617;
  border-radius: 20px;
  padding: 2rem 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 900px;
  border: 1px solid rgba(148, 163, 184, 0.4);
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
  padding: 0.8rem 1.4rem;
  border-radius: 0.75rem;
  border: none;
  background: #2563eb;
  color: #f9fafb;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
  }
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const TableWrapper = styled.div`
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  overflow: hidden;
  background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.15), transparent),
              #020617;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 1.2fr 0.7fr;
  padding: 0.85rem 1.2rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(15, 23, 42, 0.95);
  color: #9ca3af;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 1.2fr 0.7fr;
  padding: 0.85rem 1.2rem;
  font-size: 0.9rem;
  border-top: 1px solid rgba(31, 41, 55, 0.8);
  &:nth-child(even) {
    background: rgba(15, 23, 42, 0.7);
  }
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

const MesNotes = () => {
  const navigate = useNavigate();
  const [lycees, setLycees] = useState([]);
  const [form, setForm] = useState({
    niveau: 'terminale',
    etablissement: '',
    matiere: '',
    note: '',
  });
  const [notes, setNotes] = useState([]);

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
    if (!form.matiere || !form.note || !form.etablissement) {
      return; // champs manquants
    }
    
    // gérer virgule ou point pour la note
    const noteValue = Number(form.note.replace(',', '.'));
    if (isNaN(noteValue) || noteValue < 0 || noteValue > 20) {
      return; // note invalide
    }

    setNotes(prev => [...prev, { ...form, note: noteValue.toFixed(2) }]);
    // reset seulement matière et note
    setForm(prev => ({ ...prev, matiere: '', note: '' }));
  };

  const getNoteStatus = (note) => {
    const n = parseFloat(note);
    if (n >= 14) return { good: true, medium: false };
    if (n >= 10) return { good: false, medium: true };
    return { good: false, medium: false };
  };

  const handleLogout = () => {
    localStorage.removeItem('scoolize_user');
    navigate('/');
  };

  return (
    <PageContainer>
      <Header>
        <Logo>Scool<span>ize</span></Logo>
        <Nav>
          <NavButton onClick={handleLogout}>Déconnexion</NavButton>
          <NavButton $active>Mes notes</NavButton>
          <NavButton as="a" href="/voeux">Mes vœux</NavButton>
          <NavButton as="a" href="/profil">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="6" r="3" fill="currentColor"/>
              <path d="M2 14c0-2.5 2.5-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            Profil
          </NavButton>
        </Nav>
      </Header>

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
                disabled
              >
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
                + Ajouter la note
              </Button>
            </ButtonRow>
          </Form>

          <TableWrapper>
            {notes.length === 0 ? (
              <EmptyState>
                Aucune note enregistrée pour l’instant. Ajoute au moins une note pour commencer à construire ton profil.
              </EmptyState>
            ) : (
              <>
                <TableHeader>
                  <span>Niveau</span>
                  <span>Établissement</span>
                  <span>Matière</span>
                  <span>Note</span>
                </TableHeader>
                {notes.map((n, i) => {
                  const status = getNoteStatus(n.note);
                  return (
                    <TableRow key={i}>
                      <span>
                        <Pill>Terminale</Pill>
                      </span>
                      <span>{n.etablissement}</span>
                      <span>{n.matiere}</span>
                      <span>
                        <NotePill $good={status.good} $medium={status.medium}>
                          {n.note}
                        </NotePill>
                      </span>
                    </TableRow>
                  );
                })}
              </>
            )}
          </TableWrapper>
        </Card>
      </Main>
    </PageContainer>
  );
};

export default MesNotes;


