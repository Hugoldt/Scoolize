import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLycees } from '../hooks/useLycees';
import { useEtablissements } from '../hooks/useEtablissements';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #1e293b;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const Header = styled.header`
  padding: 2rem 4rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
`;

const HeroSubtitle = styled.p`
  margin: 0.4rem 0 0 0;
  color: #475569;
  font-size: 1rem;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  @media (max-width: 768px) { padding: 2rem; }
`;

const Title = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #718096;
  margin: 0 0 2rem 0;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: #f7fafc;
  padding: 0.5rem;
  border-radius: 12px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${p => p.$active ? '#2563eb' : 'transparent'};
  color: ${p => p.$active ? '#ffffff' : '#4a5568'};
  &:hover { background: ${p => p.$active ? '#1d4ed8' : '#edf2f7'}; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  width: ${p => p.$full ? '100%' : 'auto'};
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  &::placeholder { color: #a0aec0; }
`;

const Autocomplete = styled.div`
  position: relative;
`;

const Suggestions = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Suggestion = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: #2d3748;
  &:hover { background: #f7fafc; }
  &:last-child { border-radius: 0 0 8px 8px; }
`;

const Button = styled.button`
  padding: 1rem;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  &:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
  }
  &:active { transform: translateY(0); }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #718096;
`;

const Link = styled.a`
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const LogoutButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
  }
`;

const AccueilScoolize = () => {
  const { lycees: lyceesDisponibles, loading: loadingLycees } = useLycees();
  const { etablissements: etablissementsDisponibles, loading: loadingEtablissements } = useEtablissements();
  const navigate = useNavigate();
  const [mode, setMode] = useState('inscription');
  const [typeCompte, setTypeCompte] = useState('etudiant');
  const [data, setData] = useState({ email: '', nom: '', prenom: '', dateNaissance: '', etablissementOrigine: '', motDePasse: '', nomEcole: '', formation: '' });
  const [search, setSearch] = useState('');
  const [searchEcole, setSearchEcole] = useState('');
  const [show, setShow] = useState(false);
  const [showEcole, setShowEcole] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [filteredEcoles, setFilteredEcoles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('scoolize_user');
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);

  const update = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const searchLycee = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (val.length > 0) {
      setFiltered(lyceesDisponibles.filter(l => l.toLowerCase().includes(val.toLowerCase())));
      setShow(true);
    } else {
      setFiltered([]);
      setShow(false);
    }
  };

  const selectLycee = (lycee) => {
    setSearch(lycee);
    setData({ ...data, etablissementOrigine: lycee });
    setShow(false);
  };

  const searchEtablissement = (e) => {
    const val = e.target.value;
    setSearchEcole(val);
    setData({ ...data, nomEcole: val });
    if (val.length > 0) {
      setFilteredEcoles(etablissementsDisponibles.filter(e => e.toLowerCase().includes(val.toLowerCase())));
      setShowEcole(true);
    } else {
      setFilteredEcoles([]);
      setShowEcole(false);
    }
  };

  const selectEtablissement = (etab) => {
    setSearchEcole(etab);
    setData({ ...data, nomEcole: etab });
    setShowEcole(false);
  };

  const switchMode = (m) => {
    setMode(m);
    if (m === 'connexion') {
      setData({ email: data.email, motDePasse: data.motDePasse, nom: '', prenom: '', dateNaissance: '', etablissementOrigine: '', nomEcole: '', formation: '' });
      setSearch('');
      setSearchEcole('');
      setShow(false);
      setShowEcole(false);
    }
  };

  const switchTypeCompte = (type) => {
    setTypeCompte(type);
    setData({ email: '', nom: '', prenom: '', dateNaissance: '', etablissementOrigine: '', motDePasse: '', nomEcole: '', formation: '' });
    setSearch('');
    setSearchEcole('');
    setShow(false);
    setShowEcole(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoadingSubmit(true);

    try {
      if (mode === 'inscription') {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.motDePasse,
          options: {
            emailRedirectTo: undefined,
            data: {
              skip_email_confirmation: true
            }
          }
        });

        if (signUpError) {
          setErrorMessage(signUpError.message || "Impossible de créer le compte.");
          setLoadingSubmit(false);
          return;
        }

        const user = signUpData.user;
        if (!user) {
          setErrorMessage("Compte créé, mais utilisateur non disponible. Vérifie ton email de confirmation.");
          setLoadingSubmit(false);
          return;
        }

        if (typeCompte === 'ecole') {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.motDePasse,
          });

          if (signInError) {
            if (signInError.message && (signInError.message.includes('email') || signInError.message.includes('confirm'))) {
              setErrorMessage("Compte créé ! Vérifie ton email pour confirmer, puis connecte-toi.");
            } else {
              setErrorMessage("Compte créé mais impossible de se connecter. Réessaye de te connecter.");
            }
            setLoadingSubmit(false);
            return;
          }

          const session = signInData.session;
          if (!session) {
            setErrorMessage("Session non disponible. Réessaye de te connecter.");
            setLoadingSubmit(false);
            return;
          }

          const { error: insertError } = await supabase
            .from('ecoles')
            .insert([{
              id: user.id,
              email: data.email,
              nom_ecole: data.nomEcole,
              formation: data.formation || null,
            }]);

          if (insertError) {
            const { error: rpcError } = await supabase.rpc('insert_ecole_profile', {
              p_id: user.id,
              p_email: data.email,
              p_nom_ecole: data.nomEcole,
              p_formation: data.formation || null,
            });
            
            if (rpcError) {
              setErrorMessage("Compte créé mais le profil école n'a pas pu être enregistré. Erreur: " + rpcError.message);
              setLoadingSubmit(false);
              return;
            }
          }

          localStorage.setItem('scoolize_user', JSON.stringify({
            email: data.email,
            type: 'ecole',
          }));

          setIsLoggedIn(true);
          
          await new Promise(resolve => setTimeout(resolve, 100));
          window.location.href = '/ecole/dashboard';
        } else {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.motDePasse,
          });

          if (signInError) {
            setErrorMessage("Compte créé mais impossible de se connecter. Réessaye de te connecter.");
            setLoadingSubmit(false);
            return;
          }

          const session = signInData.session;
          if (!session) {
            setErrorMessage("Session non disponible. Réessaye de te connecter.");
            setLoadingSubmit(false);
            return;
          }

          const { error: insertError } = await supabase
            .from('etudiants')
            .insert([{
              id: user.id,
              email: data.email,
              nom: data.nom,
              prenom: data.prenom,
              date_naissance: data.dateNaissance || null,
              lycee_origine: data.etablissementOrigine || null,
            }]);

          if (insertError) {
            const { error: rpcError } = await supabase.rpc('insert_etudiant_profile', {
              p_id: user.id,
              p_email: data.email,
              p_nom: data.nom,
              p_prenom: data.prenom,
              p_date_naissance: data.dateNaissance || null,
              p_lycee_origine: data.etablissementOrigine || null,
            });
            
            if (rpcError) {
              setErrorMessage("Compte créé mais le profil n'a pas pu être enregistré. Erreur: " + rpcError.message);
              setLoadingSubmit(false);
              return;
            }
          }

          localStorage.setItem('scoolize_user', JSON.stringify({
            email: data.email,
            nom: data.nom,
            prenom: data.prenom,
          }));

          setIsLoggedIn(true);
          
          await new Promise(resolve => setTimeout(resolve, 100));
          window.location.href = '/notes';
        }
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.motDePasse,
        });

        if (signInError) {
          setErrorMessage(signInError.message || "Email ou mot de passe invalide.");
          setLoadingSubmit(false);
          return;
        }

        const userId = signInData.user?.id;
        if (userId) {
          const { data: ecoleData } = await supabase
            .from('ecoles')
            .select('id')
            .eq('id', userId)
            .single();

          if (ecoleData) {
            localStorage.setItem('scoolize_user', JSON.stringify({
              email: data.email,
              type: 'ecole',
            }));
            setIsLoggedIn(true);
            navigate('/ecole/dashboard');
          } else {
            localStorage.setItem('scoolize_user', JSON.stringify({
              email: data.email,
            }));
            setIsLoggedIn(true);
            navigate('/notes');
          }
        }
      }
    } catch (err) {
      setErrorMessage("Une erreur inattendue est survenue. Réessaie plus tard.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('scoolize_user');
    setIsLoggedIn(false);
    setData({ email: '', nom: '', prenom: '', dateNaissance: '', etablissementOrigine: '', motDePasse: '' });
    setSearch('');
    setShow(false);
    setMode('inscription');
  };

  return (
    <PageContainer>
      <Header />
      <Main>
        <Card>
          <Hero>
            <HeroTitle>Scoolize</HeroTitle>
            <HeroSubtitle>Connectez-vous pour accéder à votre espace</HeroSubtitle>
          </Hero>
          <Title>{mode === 'inscription' ? 'Créer votre compte' : 'Connexion'}</Title>
          <Subtitle>{mode === 'inscription' ? 'Commencez votre parcours vers l\'orientation idéale' : 'Connectez-vous pour accéder à votre profil'}</Subtitle>

          <Tabs>
            <Tab $active={mode === 'inscription'} onClick={() => switchMode('inscription')}>Inscription</Tab>
            <Tab $active={mode === 'connexion'} onClick={() => switchMode('connexion')}>Connexion</Tab>
          </Tabs>

          {mode === 'inscription' && (
            <Tabs style={{ marginBottom: '1.5rem' }}>
              <Tab $active={typeCompte === 'etudiant'} onClick={() => switchTypeCompte('etudiant')}>Étudiant</Tab>
              <Tab $active={typeCompte === 'ecole'} onClick={() => switchTypeCompte('ecole')}>École</Tab>
            </Tabs>
          )}

          <Form onSubmit={submit}>
            {mode === 'inscription' && typeCompte === 'etudiant' && (
              <>
                <Field><Label>Nom</Label><Input name="nom" value={data.nom} onChange={update} placeholder="Dupont" required /></Field>
                <Field><Label>Prénom</Label><Input name="prenom" value={data.prenom} onChange={update} placeholder="Marie" required /></Field>
                <Field><Label>Date de Naissance</Label><Input type="date" name="dateNaissance" value={data.dateNaissance} onChange={update} required /></Field>
                <Field>
                  <Label>Établissement d'origine</Label>
                  <Autocomplete>
                    <Input $full name="etablissementOrigine" value={search} onChange={searchLycee} placeholder={loadingLycees ? "Chargement des lycées..." : "Tapez le nom de votre lycée..."} required autoComplete="off" disabled={loadingLycees} />
                    {show && filtered.length > 0 && (
                      <Suggestions>{filtered.map((l, i) => <Suggestion key={i} onClick={() => selectLycee(l)}>{l}</Suggestion>)}</Suggestions>
                    )}
                  </Autocomplete>
                </Field>
              </>
            )}
            {mode === 'inscription' && typeCompte === 'ecole' && (
              <>
                <Field>
                  <Label>Nom de l'établissement</Label>
                  <Autocomplete>
                    <Input $full name="nomEcole" value={searchEcole} onChange={searchEtablissement} placeholder={loadingEtablissements ? "Chargement des établissements..." : "Tapez le nom de votre établissement..."} required autoComplete="off" disabled={loadingEtablissements} />
                    {showEcole && filteredEcoles.length > 0 && (
                      <Suggestions>{filteredEcoles.slice(0, 10).map((e, i) => <Suggestion key={i} onClick={() => selectEtablissement(e)}>{e}</Suggestion>)}</Suggestions>
                    )}
                  </Autocomplete>
                </Field>
                <Field><Label>Formation concernée</Label><Input name="formation" value={data.formation} onChange={update} placeholder="Licence Mathématiques" /></Field>
              </>
            )}
            <Field><Label>Email</Label><Input type="email" name="email" value={data.email} onChange={update} placeholder={typeCompte === 'ecole' ? "contact@ecole.fr" : "marie.dupont@exemple.fr"} required /></Field>
            <Field><Label>Mot de passe</Label><Input type="password" name="motDePasse" value={data.motDePasse} onChange={update} placeholder="••••••••" required /></Field>
            <Button type="submit" disabled={loadingSubmit}>
              {loadingSubmit
                ? (mode === 'inscription' ? 'Création en cours...' : 'Connexion en cours...')
                : (mode === 'inscription' ? 'Créer mon compte' : 'Se connecter')}
            </Button>
          </Form>

          {errorMessage && (
            <Footer style={{ color: '#e11d48' }}>
              {errorMessage}
            </Footer>
          )}

          <Footer>
            {mode === 'inscription' ? (
              <>Vous avez déjà un compte ? <Link onClick={() => switchMode('connexion')}>Connectez-vous</Link></>
            ) : (
              <>Pas encore de compte ? <Link onClick={() => switchMode('inscription')}>Inscrivez-vous</Link></>
            )}
          </Footer>

          {isLoggedIn && (
            <LogoutButton onClick={handleLogout}>
              Se déconnecter
            </LogoutButton>
          )}
        </Card>
      </Main>
    </PageContainer>
  );
};

export default AccueilScoolize;
