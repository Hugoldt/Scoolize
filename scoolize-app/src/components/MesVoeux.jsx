import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useLycees } from '../hooks/useLycees';
import { useEtablissements } from '../hooks/useEtablissements';
import { calculerChanceAdmission } from '../utils/calculAdmission';

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
  grid-template-columns: 1.2fr 1.3fr 0.9fr 0.9fr 1fr auto;
  gap: 1rem;
  padding: 0.85rem 1.2rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(15, 23, 42, 0.95);
  color: #9ca3af;
  align-items: center;
`;

const RefreshButton = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid rgba(37, 99, 235, 0.3);
  background: rgba(37, 99, 235, 0.1);
  color: #60a5fa;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(37, 99, 235, 0.2);
    border-color: rgba(37, 99, 235, 0.5);
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${p => 
    p.$status === 'Accepté' ? 'rgba(34, 197, 94, 0.2)' :
    p.$status === 'Refusé' ? 'rgba(239, 68, 68, 0.2)' :
    'rgba(148, 163, 184, 0.2)'};
  color: ${p => 
    p.$status === 'Accepté' ? '#22c55e' :
    p.$status === 'Refusé' ? '#ef4444' :
    '#94a3b8'};
`;

const ChanceBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${p => 
    p.$pourcentage >= 70 ? 'rgba(34, 197, 94, 0.2)' :
    p.$pourcentage >= 50 ? 'rgba(251, 191, 36, 0.2)' :
    p.$pourcentage >= 30 ? 'rgba(249, 115, 22, 0.2)' :
    'rgba(239, 68, 68, 0.2)'};
  color: ${p => 
    p.$pourcentage >= 70 ? '#22c55e' :
    p.$pourcentage >= 50 ? '#fbbf24' :
    p.$pourcentage >= 30 ? '#f97316' :
    '#ef4444'};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.3fr 0.9fr 0.9fr 1fr auto;
  gap: 1rem;
  padding: 0.85rem 1.2rem;
  font-size: 0.9rem;
  border-top: 1px solid rgba(31, 41, 55, 0.8);
  align-items: center;
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

const AutocompleteWrapper = styled.div`
  position: relative;
`;

const AutocompleteList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
  background: #0b1224;
  border: 1px solid #4b5563;
  border-radius: 0.6rem;
  z-index: 10;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
`;

const AutocompleteItem = styled.div`
  padding: 0.7rem 0.9rem;
  cursor: pointer;
  color: #e5e7eb;
  font-size: 0.95rem;
  transition: background 0.15s ease;
  &:hover {
    background: rgba(37, 99, 235, 0.2);
  }
  &:first-child {
    border-top-left-radius: 0.6rem;
    border-top-right-radius: 0.6rem;
  }
  &:last-child {
    border-bottom-left-radius: 0.6rem;
    border-bottom-right-radius: 0.6rem;
  }
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

const MesVoeux = () => {
  const navigate = useNavigate();
  const { lycees: etablissementsDisponibles } = useLycees();
  const { etablissements: etablissementsSuperieur, loading: loadingEtablissements } = useEtablissements();
  const [form, setForm] = useState({
    formation: '',
    ecole_id: '',
    ecole_nom: '',
    priorite: '1',
  });
  const [voeux, setVoeux] = useState([]);
  const [ecoles, setEcoles] = useState([]);
  const [notes, setNotes] = useState([]);
  const [hasSession, setHasSession] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchEcole, setSearchEcole] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredEtablissements, setFilteredEtablissements] = useState([]);
  const toggleMenu = () => setShowMenu(p => !p);
  const closeMenu = () => setShowMenu(false);

  const loadVoeux = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      return;
    }

    const userId = sessionData.session.user.id;
    
    const { data, error } = await supabase
      .from('voeux')
      .select('*, ecoles(nom_ecole, formation)')
      .eq('etudiant_id', userId)
      .order('id', { ascending: true });

    if (!error && data) {
      setVoeux(data);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const sessionRes = await supabase.auth.getSession();
      setHasSession(!!sessionRes.data.session);

      const userId = sessionRes.data?.session?.user?.id;
      if (userId) {
        const { data: notesData } = await supabase
          .from('notes')
          .select('*')
          .eq('etudiant_id', userId)
          .order('created_at', { ascending: true });
        
        if (notesData) {
          setNotes(notesData);
        }
      }

      const { data: ecolesData, error: ecolesError } = await supabase
        .from('ecoles')
        .select('id, nom_ecole, formation')
        .order('nom_ecole', { ascending: true });

      if (!ecolesError && ecolesData) {
        setEcoles(ecolesData);
      }

      await loadVoeux();
    };
    loadData();

    const interval = setInterval(() => {
      loadVoeux();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showAutocomplete && !e.target.closest('.autocomplete-wrapper')) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showAutocomplete]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const searchEtablissement = (e) => {
    const val = e.target.value;
    setSearchEcole(val);
    setForm(prev => ({ ...prev, ecole_nom: val, ecole_id: '' }));
    
    if (val.length > 0) {
      const filtered = etablissementsSuperieur.filter(etab => 
        etab.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 10);
      setFilteredEtablissements(filtered);
      setShowAutocomplete(true);
    } else {
      setFilteredEtablissements([]);
      setShowAutocomplete(false);
    }
  };

  const selectEtablissement = async (nomEtablissement) => {
    setSearchEcole(nomEtablissement);
    setForm(prev => ({ ...prev, ecole_nom: nomEtablissement }));
    setShowAutocomplete(false);

      const nomEtablissementLower = nomEtablissement.toLowerCase().trim();
      const ecoleExistante = ecoles.find(e => {
        if (!e.nom_ecole) return false;
        const nomEcoleLower = e.nom_ecole.toLowerCase().trim();
        
        if (nomEcoleLower === nomEtablissementLower) return true;
        
        if (nomEcoleLower.includes(nomEtablissementLower) || 
            nomEtablissementLower.includes(nomEcoleLower)) return true;
        
        const motsEcole = nomEcoleLower.split(/\s+/).filter(m => m.length > 2);
        const motsEtablissement = nomEtablissementLower.split(/\s+/).filter(m => m.length > 2);
        
        const motsCommuns = motsEcole.filter(m => motsEtablissement.includes(m));
        if (motsCommuns.length >= 2) return true;
        
        return false;
      });

      if (ecoleExistante) {
        setForm(prev => ({ ...prev, ecole_id: ecoleExistante.id }));
      } else {
        setForm(prev => ({ ...prev, ecole_id: '' }));
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.formation || !form.ecole_nom) {
      alert("Veuillez remplir tous les champs requis.");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData?.session) {
      alert("Vous devez être connecté pour ajouter un vœu (inscris-toi ou reconnecte-toi sur la page d'accueil).");
      return;
    }

    const userId = sessionData.session.user.id;
    const etudiantId = userId;

    let ecoleId = form.ecole_id;
    
    if (!ecoleId) {
      const nomFormLower = form.ecole_nom.toLowerCase().trim();
      const ecoleExistante = ecoles.find(e => {
        if (!e.nom_ecole) return false;
        const nomEcoleLower = e.nom_ecole.toLowerCase().trim();
        
        if (nomEcoleLower === nomFormLower) return true;
        
        if (nomEcoleLower.includes(nomFormLower) || 
            nomFormLower.includes(nomEcoleLower)) return true;
        
        const motsEcole = nomEcoleLower.split(/\s+/).filter(m => m.length > 2);
        const motsForm = nomFormLower.split(/\s+/).filter(m => m.length > 2);
        
        const motsCommuns = motsEcole.filter(m => motsForm.includes(m));
        if (motsCommuns.length >= 2) return true;
        
        return false;
      });
      
      if (ecoleExistante) {
        ecoleId = ecoleExistante.id;
      } else {
        alert("Cette école n'est pas encore inscrite sur la plateforme. Veuillez sélectionner une école inscrite.");
        return;
      }
    }

    const newVoeu = {
      etudiant_id: etudiantId,
      ecole_id: ecoleId,
      formation_nom: form.formation,
      classement_voeux: parseInt(form.priorite, 10),
    };

    const { data, error } = await supabase
      .from('voeux')
      .insert([newVoeu])
      .select('*, ecoles(nom_ecole, formation)');

    if (!error && data) {
      setVoeux(prev => [...prev, data[0]]);
      setForm({
        formation: '',
        ecole_id: '',
        ecole_nom: '',
        priorite: '1',
      });
      setSearchEcole('');
      setShowAutocomplete(false);
    } else {
      alert("Erreur lors de l'ajout du vœu. Vérifie que l'école est bien inscrite.");
    }
    
    await loadVoeux();
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
          <NavButton as="a" href="/notes">Mes notes</NavButton>
          <NavButton $active>Mes vœux</NavButton>
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
          <Title>Mes vœux</Title>
          <Subtitle>
            Ajoute les formations que tu vises et leur priorité. Ces données sont synchronisées avec ta table Supabase `voeux`.
          </Subtitle>

          <Form onSubmit={handleSubmit}>
            <Field>
              <Label>École</Label>
              <AutocompleteWrapper className="autocomplete-wrapper">
                <Input
                  type="text"
                  value={searchEcole}
                  onChange={searchEtablissement}
                  onFocus={() => {
                    if (searchEcole.length > 0 && filteredEtablissements.length > 0) {
                      setShowAutocomplete(true);
                    }
                  }}
                  placeholder={loadingEtablissements ? "Chargement des établissements..." : "Tapez le nom de l'établissement..."}
                  required
                  disabled={loadingEtablissements}
                />
                {showAutocomplete && filteredEtablissements.length > 0 && (
                  <AutocompleteList>
                    {filteredEtablissements.map((etab, idx) => (
                      <AutocompleteItem
                        key={idx}
                        onClick={() => selectEtablissement(etab)}
                      >
                        {etab}
                      </AutocompleteItem>
                    ))}
                  </AutocompleteList>
                )}
              </AutocompleteWrapper>
              <Small>
                Sélectionne l'école à laquelle tu souhaites postuler.
                {form.ecole_nom && (
                  ecoles.find(e => e.nom_ecole.toLowerCase() === form.ecole_nom.toLowerCase()) 
                    ? ' École inscrite' 
                    : ' Cette école doit être inscrite sur la plateforme'
                )}
              </Small>
            </Field>

            <Field>
              <Label>Nom de la formation</Label>
              <Input
                name="formation"
                value={form.formation}
                onChange={handleChange}
                placeholder="Ex : Licence Économie-Gestion"
                required
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
                  <span>École</span>
                  <span>Formation</span>
                  <span>Priorité</span>
                  <span>Statut</span>
                  <span>Chance</span>
                  <RefreshButton onClick={loadVoeux} title="Rafraîchir">
                    ↻
                  </RefreshButton>
                </TableHeader>
                {voeux.map((v, i) => {
                  const chance = calculerChanceAdmission(notes, v, v.ecoles);
                  return (
                    <TableRow key={i}>
                      <span>{v.ecoles?.nom_ecole || '-'}</span>
                      <span>{v.formation_nom}</span>
                      <span>
                        <Pill>#{v.classement_voeux}</Pill>
                      </span>
                      <span>
                        <StatusBadge $status={v.statut || 'En attente'}>
                          {v.statut || 'En attente'}
                        </StatusBadge>
                      </span>
                      <span>
                        {notes.length > 0 ? (
                          <ChanceBadge $pourcentage={chance.pourcentage}>
                            {chance.pourcentage}%
                          </ChanceBadge>
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                            Pas de notes
                          </span>
                        )}
                      </span>
                      <span></span>
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

export default MesVoeux;


