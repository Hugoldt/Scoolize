import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
  max-width: 700px;
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
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TitleIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 12px;
    border-radius: 0 0 24px 24px;
    background: #ffffff;
  }
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #9ca3af;
  margin: 0 0 2rem 0;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  padding: 1.25rem;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #f9fafb;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.5);
  color: #f9fafb;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
  &::placeholder {
    color: #64748b;
  }
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.95rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin: 1.5rem 0 1rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  border: none;
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  color: #f9fafb;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 30px rgba(37, 99, 235, 0.25);
  }
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.6);
  color: #e5e7eb;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
  &:hover {
    border-color: rgba(59, 130, 246, 0.6);
    background: rgba(15, 23, 42, 0.8);
  }
`;

const LogoutButton = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
  }
`;

const Profil = () => {
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    etablissementOrigine: '',
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // récupère les données user depuis localStorage
    const savedData = localStorage.getItem('scoolize_user');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUserData(parsed);
        setForm({
          nom: parsed.nom || '',
          prenom: parsed.prenom || '',
          email: parsed.email || '',
          dateNaissance: parsed.dateNaissance || '',
          etablissementOrigine: parsed.etablissementOrigine || '',
        });
      } catch (err) {
        console.error('erreur parse user data', err);
        // fallback si pb de parse
        const fallback = {
          nom: '',
          prenom: '',
          email: '',
          dateNaissance: '',
          etablissementOrigine: '',
        };
        setUserData(fallback);
        setForm(fallback);
      }
    } else {
      const empty = {
        nom: '',
        prenom: '',
        email: '',
        dateNaissance: '',
        etablissementOrigine: '',
      };
      setUserData(empty);
      setForm(empty);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...userData, ...form };
    localStorage.setItem('scoolize_user', JSON.stringify(updated));
    setUserData(updated);
    setEditMode(false);
  };

  const handleCancel = () => {
    setForm({
      nom: userData?.nom || '',
      prenom: userData?.prenom || '',
      email: userData?.email || '',
      dateNaissance: userData?.dateNaissance || '',
      etablissementOrigine: userData?.etablissementOrigine || '',
    });
    setEditMode(false);
  };

  if (!userData) {
    return (
      <PageContainer>
        <NavBar active="profil" />
        <Main>
          <Card>
            <EmptyState>Chargement de vos informations...</EmptyState>
          </Card>
        </Main>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <NavBar active="profil" />

      <Main>
        <Card>
          <Title>
            <TitleIcon />
            Mon profil
          </Title>
          <Subtitle>
            Consulte et gère les informations de ton compte Scoolize.
          </Subtitle>

          <Actions>
            {editMode ? (
              <>
                <PrimaryButton onClick={handleSave}>Enregistrer</PrimaryButton>
                <SecondaryButton type="button" onClick={handleCancel}>Annuler</SecondaryButton>
              </>
            ) : (
              <SecondaryButton type="button" onClick={() => setEditMode(true)}>
                Modifier mes informations
              </SecondaryButton>
            )}
          </Actions>

          <form onSubmit={handleSave}>
            <InfoGrid>
              <InfoCard>
                <InfoLabel>Nom</InfoLabel>
                {editMode ? (
                  <Input
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Ton nom"
                  />
                ) : (
                  <InfoValue>{userData.nom || 'Non renseigné'}</InfoValue>
                )}
              </InfoCard>

              <InfoCard>
                <InfoLabel>Prénom</InfoLabel>
                {editMode ? (
                  <Input
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    placeholder="Ton prénom"
                  />
                ) : (
                  <InfoValue>{userData.prenom || 'Non renseigné'}</InfoValue>
                )}
              </InfoCard>

              <InfoCard>
                <InfoLabel>Email</InfoLabel>
                {editMode ? (
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="mon.email@example.com"
                  />
                ) : (
                  <InfoValue>{userData.email || 'Non renseigné'}</InfoValue>
                )}
              </InfoCard>

              <InfoCard>
                <InfoLabel>Date de naissance</InfoLabel>
                {editMode ? (
                  <Input
                    type="date"
                    name="dateNaissance"
                    value={form.dateNaissance}
                    onChange={handleChange}
                  />
                ) : (
                  <InfoValue>
                    {userData.dateNaissance
                      ? new Date(userData.dateNaissance + 'T00:00:00').toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Non renseigné'}
                  </InfoValue>
                )}
              </InfoCard>

              <InfoCard>
                <InfoLabel>Établissement d'origine</InfoLabel>
                {editMode ? (
                  <Input
                    name="etablissementOrigine"
                    value={form.etablissementOrigine}
                    onChange={handleChange}
                    placeholder="Ton lycée ou établissement"
                  />
                ) : (
                  <InfoValue>{userData.etablissementOrigine || 'Non renseigné'}</InfoValue>
                )}
              </InfoCard>
            </InfoGrid>
          </form>

          <LogoutButton
            onClick={() => {
              localStorage.removeItem('scoolize_user');
              window.location.href = '/';
            }}
          >
            Déconnexion
          </LogoutButton>

        </Card>
      </Main>
    </PageContainer>
  );
};

export default Profil;

