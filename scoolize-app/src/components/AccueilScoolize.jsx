import React, { useState } from 'react';
import styled from 'styled-components';
import { useLycees } from '../hooks/useLycees';

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

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  span { color: #60a5fa; }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
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

const AccueilScoolize = ({ onAuthenticated = () => {} }) => {
  const { lycees: lyceesDisponibles, loading } = useLycees();
  const [mode, setMode] = useState('inscription');
  const [data, setData] = useState({ email: '', nom: '', prenom: '', dateNaissance: '', etablissementOrigine: '', motDePasse: '' });
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [filtered, setFiltered] = useState([]);

  const update = (e) => setData({ ...data, [e.target.name]: e.target.value });

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
    console.log(mode === 'inscription' ? '📝 Inscription:' : '🔐 Connexion:', data);
    if (mode === 'connexion') {
      onAuthenticated(); // simule une connexion réussie pour afficher les fonctionnalités réservées
    }
  };

  return (
    <PageContainer>
      <Header><Logo>Scool<span>ize</span></Logo></Header>
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
        </Card>
      </Main>
    </PageContainer>
  );
};

export default AccueilScoolize;
