import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLycees } from '../hooks/useLycees';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(96, 165, 250, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
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
  max-width: 480px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) { 
    padding: 2rem;
    border-radius: 20px;
  }
`;

const Title = styled.h3`
  font-size: 1.875rem;
  font-weight: 700;
  color: #f9fafb;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #9ca3af;
  margin: 0 0 2rem 0;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: rgba(15, 23, 42, 0.6);
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.$active ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent'};
  color: ${p => p.$active ? '#ffffff' : '#9ca3af'};
  box-shadow: ${p => p.$active ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none'};
  &:hover { 
    background: ${p => p.$active ? 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' : 'rgba(148, 163, 184, 0.25)'}; 
    color: ${p => p.$active ? '#ffffff' : '#e5e7eb'};
  }
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
  width: ${p => p.$full ? '100%' : 'auto'};
  
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
  }
  &::placeholder { color: #6b7280; }
  &:hover:not(:focus) {
    border-color: #6b7280;
  }
`;

const Autocomplete = styled.div`
  position: relative;
`;

const Suggestions = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(2, 6, 23, 0.98);
  border: 1px solid #2563eb;
  border-top: none;
  border-radius: 0 0 10px 10px;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0.25rem 0;
  margin: 0;
  z-index: 1000;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
`;

const Suggestion = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: #e5e7eb;
  transition: all 0.15s ease;
  &:hover { 
    background: rgba(37, 99, 235, 0.2);
    color: #60a5fa;
  }
  &:last-child { border-radius: 0 0 10px 10px; }
`;

const Button = styled.button`
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  &:active { 
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #9ca3af;
`;

const Link = styled.a`
  color: #60a5fa;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
  &:hover { 
    color: #3b82f6;
    text-decoration: underline; 
  }
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
  const { lycees: lyceesDisponibles, loading } = useLycees();
  const navigate = useNavigate();
  const [mode, setMode] = useState('inscription');
  const [data, setData] = useState({ email: '', nom: '', prenom: '', dateNaissance: '', etablissementOrigine: '', motDePasse: '' });
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // check si user déjà connecté
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

  const switchMode = (m) => {
    setMode(m);
    if (m === 'connexion') {
      setData({ email: data.email, motDePasse: data.motDePasse, nom: '', prenom: '', dateNaissance: '', etablissementOrigine: '' });
      setSearch('');
      setShow(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    
    // TODO: ajouter vraie validation côté serveur plus tard
    const userData = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      dateNaissance: data.dateNaissance,
      etablissementOrigine: data.etablissementOrigine,
    };
    
    localStorage.setItem('scoolize_user', JSON.stringify(userData));
    setIsLoggedIn(true);
    
    navigate('/notes');
  };

  const handleLogout = () => {
    localStorage.removeItem('scoolize_user');
    setIsLoggedIn(false);
    setData({ email: '', nom: '', prenom: '', dateNaissance: '', etablissementOrigine: '', motDePasse: '' });
    setSearch('');
    setShow(false);
    setMode('inscription');
  };

  return (
    <PageContainer>
      <NavBar active="accueil" />
      <Main>
        <Card>
          <Title>{mode === 'inscription' ? 'Créer votre compte' : 'Connexion'}</Title>
          <Subtitle>{mode === 'inscription' ? 'Commencez votre parcours vers l\'orientation idéale' : 'Connectez-vous pour accéder à votre profil'}</Subtitle>

          <Tabs>
            <Tab $active={mode === 'inscription'} onClick={() => switchMode('inscription')}>Inscription</Tab>
            <Tab $active={mode === 'connexion'} onClick={() => switchMode('connexion')}>Connexion</Tab>
          </Tabs>

          <Form onSubmit={submit}>
            {mode === 'inscription' && (
              <>
                <Field><Label>Nom</Label><Input name="nom" value={data.nom} onChange={update} placeholder="Dupont" required /></Field>
                <Field><Label>Prénom</Label><Input name="prenom" value={data.prenom} onChange={update} placeholder="Marie" required /></Field>
                <Field><Label>Date de Naissance</Label><Input type="date" name="dateNaissance" value={data.dateNaissance} onChange={update} required /></Field>
                <Field>
                  <Label>Établissement d'origine</Label>
                  <Autocomplete>
                    <Input $full name="etablissementOrigine" value={search} onChange={searchLycee} placeholder={loading ? "Chargement des lycées..." : "Tapez le nom de votre lycée..."} required autoComplete="off" disabled={loading} />
                    {show && filtered.length > 0 && (
                      <Suggestions>{filtered.map((l, i) => <Suggestion key={i} onClick={() => selectLycee(l)}>{l}</Suggestion>)}</Suggestions>
                    )}
                  </Autocomplete>
                </Field>
              </>
            )}
            <Field><Label>Email</Label><Input type="email" name="email" value={data.email} onChange={update} placeholder="marie.dupont@exemple.fr" required /></Field>
            <Field><Label>Mot de passe</Label><Input type="password" name="motDePasse" value={data.motDePasse} onChange={update} placeholder="••••••••" required /></Field>
            <Button type="submit">{mode === 'inscription' ? 'Créer mon compte' : 'Se connecter'}</Button>
          </Form>

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

          <Footer>
            <Link onClick={() => navigate('/resultats')}>Voir la démo compatibilité</Link>
          </Footer>
        </Card>
      </Main>
    </PageContainer>
  );
};

export default AccueilScoolize;
