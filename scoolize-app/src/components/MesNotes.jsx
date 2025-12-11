import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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
  gap: 0.75rem;
  align-items: center;
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
  grid-template-columns: 1.2fr 1.5fr 1.2fr 0.7fr 0.5fr;
  padding: 0.85rem 1.2rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(15, 23, 42, 0.95);
  color: #9ca3af;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 1.2fr 0.7fr 0.5fr;
  padding: 0.85rem 1.2rem;
  font-size: 0.9rem;
  border-top: 1px solid rgba(31, 41, 55, 0.8);
  align-items: center;
  &:nth-child(even) {
    background: rgba(15, 23, 42, 0.7);
  }
`;

const DeleteButton = styled.button`
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
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

const ProfileButton = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: rgba(148, 163, 184, 0.1);
  color: #e5e7eb;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 52px;
  right: 0;
  background: #0b1224;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  min-width: 180px;
  z-index: 20;
`;

const DropItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: #e5e7eb;
  cursor: pointer;
  &:hover {
    background: rgba(148, 163, 184, 0.1);
  }
`;

const MesNotes = () => {
  const navigate = useNavigate();
  const [lycees, setLycees] = useState([]);
  const [form, setForm] = useState({
    niveau: 'terminale',
    matiere: '',
    note: '',
    annee: new Date().getFullYear().toString(),
  });
  const [notes, setNotes] = useState([]);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const sessionRes = await supabase.auth.getSession();
      setHasSession(!!sessionRes.data.session);

      try {
        const res = await fetch('/data/lycees.csv');
        const txt = await res.text();
        const lignes = txt.split('\n')
          .map(l => l.trim())
          .filter(l => l && !l.startsWith('#'));

        const uniques = [...new Set(lignes)].sort((a, b) =>
          a.localeCompare(b, 'fr')
        );
        setLycees(uniques);
      } catch (err) {
      }

      if (!sessionRes.data?.session) {
        return;
      }

      const userId = sessionRes.data.session.user.id;

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('etudiant_id', userId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setNotes(data);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.matiere || !form.note) {
      return;
    }

    const noteValue = Number(form.note.replace(',', '.'));
    if (isNaN(noteValue) || noteValue < 0 || noteValue > 20) {
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      alert("Vous devez être connecté pour ajouter une note (inscris-toi ou reconnecte-toi sur la page d'accueil).");
      return;
    }

    const userId = sessionData.session.user.id;

    const newNote = {
      etudiant_id: userId,
      niveau_scolaire: form.niveau,
      matiere: form.matiere,
      note: noteValue,
      annee_scolaire: parseInt(form.annee, 10) || null,
    };

    const { data, error } = await supabase
      .from('notes')
      .insert([newNote])
      .select();

    if (error) {
      alert(`Erreur lors de l'ajout de la note: ${error.message}`);
      return;
    }

    if (data && data.length > 0) {
      setNotes(prev => [...prev, data[0]]);
      setForm(prev => ({ ...prev, matiere: '', note: '' }));
    }
  };

  const getNoteStatus = (note) => {
    const n = parseFloat(note);
    if (n >= 14) return { good: true, medium: false };
    if (n >= 10) return { good: false, medium: true };
    return { good: false, medium: false };
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Es-tu sûr de vouloir supprimer cette note ?')) {
      return;
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (!error) {
      setNotes(prev => prev.filter(n => n.id !== noteId));
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
    }
    navigate('/');
  };

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(p => !p);
  const closeMenu = () => setShowMenu(false);

  return (
    <PageContainer>
      <Header>
        <Logo>Scool<span>ize</span></Logo>
        <Nav>
          <NavButton $active>Mes notes</NavButton>
          <NavButton as="a" href="/voeux">Mes vœux</NavButton>
          <NavButton as="a" href="/profil">Profil</NavButton>
          {hasSession && (
            <div style={{ position: 'relative' }}>
              <ProfileButton onClick={toggleMenu}>P</ProfileButton>
              {showMenu && (
                <Dropdown>
                  <DropItem onClick={handleLogout}>Se déconnecter</DropItem>
                </Dropdown>
              )}
            </div>
          )}
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
              <Label>Année scolaire</Label>
              <Input
                type="number"
                name="annee"
                value={form.annee}
                onChange={handleChange}
                min="2000"
                max="2100"
              />
              <Small>Année scolaire associée à cette note (ex : {new Date().getFullYear()}).</Small>
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
                  <span>Année</span>
                  <span>Matière</span>
                  <span>Note</span>
                  <span></span>
                </TableHeader>
                {notes.map((n, i) => {
                  const status = getNoteStatus(n.note);
                  return (
                    <TableRow key={n.id || i}>
                      <span>
                        <Pill>{n.niveau_scolaire || 'Terminale'}</Pill>
                      </span>
                      <span>{n.annee_scolaire || '-'}</span>
                      <span>{n.matiere}</span>
                      <span>
                        <NotePill $good={status.good} $medium={status.medium}>
                          {n.note}
                        </NotePill>
                      </span>
                      <span>
                        <DeleteButton onClick={() => handleDeleteNote(n.id)}>
                          Supprimer
                        </DeleteButton>
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


