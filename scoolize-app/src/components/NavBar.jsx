import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const Bar = styled.header`
  padding: 1.5rem 3rem;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Logo = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  span {
    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

const NavButton = styled.button`
  padding: 0.6rem 1.05rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: ${p => (p.$active ? 'rgba(59, 130, 246, 0.18)' : 'transparent')};
  color: #e5e7eb;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  &:hover {
    border-color: rgba(59, 130, 246, 0.6);
    background: rgba(59, 130, 246, 0.12);
  }
`;

const navItems = [
  { key: 'accueil', label: 'Accueil', path: '/' },
  { key: 'notes', label: 'Mes notes', path: '/notes' },
  { key: 'voeux', label: 'Mes vœux', path: '/voeux' },
  { key: 'resultats', label: 'Résultats', path: '/resultats' },
  { key: 'profil', label: 'Profil', path: '/profil' },
];

const NavBar = ({ active }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const current = active || location.pathname;

  return (
    <Bar>
      <Row>
        <Logo>Scool<span>ize</span></Logo>
        <Nav>
          {navItems.map(item => (
            <NavButton
              key={item.key}
              $active={
                current === item.key ||
                current === item.path ||
                location.pathname === item.path
              }
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </NavButton>
          ))}
        </Nav>
      </Row>
    </Bar>
  );
};

export default NavBar;

