import styled from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${p => p.$dark ? '#0f172a' : '#1e293b'};
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: ${p => p.$dark ? '#e5e7eb' : '#ffffff'};
`;

export const Header = styled.header`
  padding: ${p => p.$compact ? '1.5rem 3rem' : '2rem 4rem'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${p => p.$dark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.1)'};
  border-bottom: 1px solid ${p => p.$dark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
  backdrop-filter: blur(10px);
`;

export const Logo = styled.h1`
  font-size: ${p => p.$small ? '1.5rem' : '2rem'};
  font-weight: 700;
  color: ${p => p.$dark ? '#f9fafb' : '#ffffff'};
  margin: 0;
  span { color: #60a5fa; }
`;

export const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const NavButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: none;
  background: ${p => p.$active ? '#2563eb' : 'transparent'};
  color: ${p => p.$active ? '#f9fafb' : p.$dark ? '#e5e7eb' : '#ffffff'};
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

export const Main = styled.main`
  flex: 1;
  padding: ${p => p.$compact ? '2rem 3rem 3rem' : '2rem'};
  display: flex;
  justify-content: center;
  align-items: ${p => p.$centered ? 'center' : 'flex-start'};
`;

export const Card = styled.div`
  background: ${p => p.$dark ? '#020617' : '#ffffff'};
  border-radius: 20px;
  padding: ${p => p.$compact ? '2rem 2.5rem' : '3rem'};
  box-shadow: 0 20px 60px rgba(0, 0, 0, ${p => p.$dark ? '0.5' : '0.3'});
  width: 100%;
  max-width: ${p => p.$wide ? '900px' : p.$medium ? '700px' : '450px'};
  border: ${p => p.$dark ? '1px solid rgba(148, 163, 184, 0.4)' : 'none'};
  @media (max-width: 768px) { padding: 2rem; }
`;

export const Title = styled.h2`
  font-size: ${p => p.$small ? '1.6rem' : '1.75rem'};
  font-weight: 700;
  color: ${p => p.$dark ? '#f9fafb' : '#1a202c'};
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Subtitle = styled.p`
  font-size: 0.95rem;
  color: ${p => p.$dark ? '#9ca3af' : '#718096'};
  margin: 0 0 2rem 0;
`;

export const Form = styled.form`
  display: ${p => p.$grid ? 'grid' : 'flex'};
  ${p => p.$grid ? `grid-template-columns: repeat(2, minmax(0, 1fr));` : 'flex-direction: column;'}
  gap: ${p => p.$grid ? '1.25rem 1.75rem' : '1.25rem'};
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    ${p => p.$grid ? 'grid-template-columns: 1fr;' : ''}
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const Label = styled.label`
  font-size: ${p => p.$small ? '0.85rem' : '0.9rem'};
  font-weight: ${p => p.$small ? '500' : '600'};
  color: ${p => p.$dark ? '#e5e7eb' : '#2d3748'};
`;

export const Input = styled.input`
  padding: ${p => p.$small ? '0.7rem 0.9rem' : '0.875rem 1rem'};
  border-radius: ${p => p.$small ? '0.6rem' : '8px'};
  border: ${p => p.$small ? '1px solid #4b5563' : '2px solid #e2e8f0'};
  background: ${p => p.$dark ? '#020617' : '#ffffff'};
  color: ${p => p.$dark ? '#e5e7eb' : '#1a202c'};
  font-size: 0.95rem;
  outline: none;
  transition: all 0.15s ease;
  width: ${p => p.$full ? '100%' : 'auto'};
  &::placeholder { color: ${p => p.$dark ? '#6b7280' : '#a0aec0'}; }
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 ${p => p.$small ? '2px' : '3px'} rgba(37, 99, 235, 0.3);
  }
`;

export const Select = styled.select`
  padding: 0.7rem 0.9rem;
  border-radius: 0.6rem;
  border: 1px solid ${p => p.$dark ? '#4b5563' : '#e2e8f0'};
  background: ${p => p.$dark ? '#020617' : '#ffffff'};
  color: ${p => p.$dark ? '#e5e7eb' : '#1a202c'};
  font-size: 0.95rem;
  outline: none;
  transition: all 0.15s ease;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
  }
`;

export const Button = styled.button`
  padding: ${p => p.$small ? '0.8rem 1.4rem' : '1rem'};
  border-radius: ${p => p.$small ? '0.75rem' : '8px'};
  border: none;
  background: #2563eb;
  color: #ffffff;
  font-weight: ${p => p.$small ? '600' : '700'};
  font-size: ${p => p.$small ? '0.95rem' : '1.1rem'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: ${p => p.$small ? '0' : '0.5rem'};
  &:hover {
    background: #1d4ed8;
    transform: translateY(-${p => p.$small ? '1px' : '2px'});
    box-shadow: 0 ${p => p.$small ? '8px' : '10px'} ${p => p.$small ? '20px' : '20px'} rgba(37, 99, 235, 0.3);
  }
  &:active { transform: translateY(0); }
`;

export const Small = styled.p`
  font-size: 0.8rem;
  color: ${p => p.$dark ? '#9ca3af' : '#718096'};
  margin: 0.2rem 0 0 0;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

export const TableWrapper = styled.div`
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  overflow: hidden;
  background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.15), transparent),
              #020617;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$cols || '1.2fr 1.5fr 1.2fr 0.7fr'};
  padding: 0.85rem 1.2rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(15, 23, 42, 0.95);
  color: #9ca3af;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$cols || '1.2fr 1.5fr 1.2fr 0.7fr'};
  padding: 0.85rem 1.2rem;
  font-size: 0.9rem;
  border-top: 1px solid rgba(31, 41, 55, 0.8);
  &:nth-child(even) {
    background: rgba(15, 23, 42, 0.7);
  }
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background: rgba(37, 99, 235, 0.15);
  color: #bfdbfe;
`;

export const EmptyState = styled.div`
  padding: 1.2rem 1.2rem 1.4rem;
  font-size: 0.9rem;
  color: #9ca3af;
`;
