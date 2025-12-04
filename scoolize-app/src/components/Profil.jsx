import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { getLocalUser } from '../utils/etudiant';

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
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  &:hover {
    background: ${p => p.$active ? '#1d4ed8' : 'rgba(148, 163, 184, 0.25)'};
  }
`;

const ProfileIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${p => p.$active ? '#ffffff' : '#e5e7eb'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${p => p.$active ? '#2563eb' : '#9ca3af'};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 6px;
    border-radius: 0 0 12px 12px;
    background: ${p => p.$active ? '#2563eb' : '#9ca3af'};
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
  max-width: 700px;
  border: 1px solid rgba(148, 163, 184, 0.4);
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

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.95rem;
`;

const LogoutButton = styled.button`
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
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

const Profil = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      const user = getLocalUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('etudiants')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!error && data) {
        setUserData({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email || user.email,
          dateNaissance: data.date_naissance,
          etablissementOrigine: data.lycee_origine,
        });
      }
    };

    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!userData) {
    return (
      <PageContainer>
        <Header>
          <Logo>Scool<span>ize</span></Logo>
          <Nav>
            <NavButton onClick={handleLogout}>Déconnexion</NavButton>
            <NavButton as="a" href="/notes">Mes notes</NavButton>
            <NavButton as="a" href="/voeux">Mes vœux</NavButton>
            <NavButton $active>
              <ProfileIcon $active />
              Profil
            </NavButton>
          </Nav>
        </Header>
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
      <Header>
        <Logo>Scool<span>ize</span></Logo>
        <Nav>
          <NavButton as="a" href="/">Accueil</NavButton>
          <NavButton as="a" href="/notes">Mes notes</NavButton>
          <NavButton as="a" href="/voeux">Mes vœux</NavButton>
          <NavButton $active>
            <ProfileIcon $active />
            Profil
          </NavButton>
        </Nav>
      </Header>

      <Main>
        <Card>
          <Title>
            <TitleIcon />
            Mon profil
          </Title>
          <Subtitle>
            Consulte et gère les informations de ton compte Scoolize.
          </Subtitle>

          <InfoGrid>
            <InfoCard>
              <InfoLabel>Nom</InfoLabel>
              <InfoValue>{userData.nom || 'Non renseigné'}</InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoLabel>Prénom</InfoLabel>
              <InfoValue>{userData.prenom || 'Non renseigné'}</InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{userData.email || 'Non renseigné'}</InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoLabel>Date de naissance</InfoLabel>
              <InfoValue>
                {userData.dateNaissance
                  ? new Date(userData.dateNaissance + 'T00:00:00').toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                  : 'Non renseigné'}
              </InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoLabel>Établissement d'origine</InfoLabel>
              <InfoValue>{userData.etablissementOrigine || 'Non renseigné'}</InfoValue>
            </InfoCard>
          </InfoGrid>

          <LogoutButton onClick={handleLogout}>
            Se déconnecter
          </LogoutButton>
        </Card>
      </Main>
    </PageContainer>
  );
};

export default Profil;

