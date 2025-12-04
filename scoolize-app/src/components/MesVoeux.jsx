import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useLycees } from '../hooks/useLycees';
import { getEtudiantFromLocal } from '../utils/etudiant';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #020617;
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
  background: rgba(15, 23, 42, 0.95);
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
  grid-template-columns: 1.4fr 1.4fr 1.2fr 0.7fr;
  padding: 0.85rem 1.2rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(15, 23, 42, 0.95);
  color: #9ca3af;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1.4fr 1.2fr 0.7fr;
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

const EmptyState = styled.div`
  padding: 1.2rem 1.2rem 1.4rem;
  font-size: 0.9rem;
  color: #9ca3af;
`;

const MesVoeux = () => {
  const navigate = useNavigate();
  const { lycees: etablissementsDisponibles } = useLycees();
  const [form, setForm] = useState({
    formation: '',
    priorite: '1',
  });
  const [voeux, setVoeux] = useState([]);

  useEffect(() => {
    const loadVoeux = async () => {
      const etudiant = await getEtudiantFromLocal();
      if (!etudiant) {
        return;
      }

      const { data, error } = await supabase
        .from('voeux')
        .select('*')
        .eq('etudiant_id', etudiant.id)
        .order('id', { ascending: true });

      if (!error && data) setVoeux(data);
    };
    loadVoeux();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.formation) {
      return;
    }

    const etudiant = await getEtudiantFromLocal();
    if (!etudiant) {
      alert("Vous devez être connecté pour ajouter un vœu (inscris-toi ou reconnecte-toi sur la page d'accueil).");
      return;
    }

    const newVoeu = {
      etudiant_id: etudiant.id,
      formation_nom: form.formation,
      classement_voeux: parseInt(form.priorite, 10),
    };

    const { data, error } = await supabase
      .from('voeux')
      .insert([newVoeu])
      .select();

    if (!error && data) {
      setVoeux(prev => [...prev, data[0]]);
      setForm({
        formation: '',
        priorite: '1',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
    }
    navigate('/');
  };

  return (
    <PageContainer>
      <Header>
        <Logo>Scool<span>ize</span></Logo>
        <Nav>
          <NavButton onClick={handleLogout}>Déconnexion</NavButton>
          <NavButton as="a" href="/notes">Mes notes</NavButton>
          <NavButton $active>Mes vœux</NavButton>
          <NavButton as="a" href="/profil">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="6" r="3" fill="currentColor" />
              <path d="M2 14c0-2.5 2.5-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            Profil
          </NavButton>
        </Nav>
      </Header>

      <Main>
        <Card>
          <Title>Mes vœux</Title>
          <Subtitle>
            Ajoute les formations que tu vises et leur priorité. Ces données sont synchronisées avec ta table Supabase `voeux`.
          </Subtitle>

          <Form onSubmit={handleSubmit}>
            <Field>
              <Label>Nom de la formation</Label>
              <Input
                name="formation"
                value={form.formation}
                onChange={handleChange}
                placeholder="Ex : Licence Économie-Gestion"
              />
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

          <TableWrapper>
            {voeux.length === 0 ? (
              <EmptyState>
                Aucun vœu enregistré pour l'instant. Ajoute au moins une formation que tu vises.
              </EmptyState>
            ) : (
              <>
                <TableHeader>
                  <span>Formation</span>
                  <span>Priorité</span>
                  <span>Match Parcoursup ?</span>
                  <span>ID formation</span>
                </TableHeader>
                {voeux.map((v, i) => (
                  <TableRow key={i}>
                    <span>{v.formation_nom}</span>
                    <span>
                      <Pill>#{v.classement_voeux}</Pill>
                    </span>
                    <span>{v.is_match ? 'Oui' : 'Non'}</span>
                    <span>{v.formation_id || '-'}</span>
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


