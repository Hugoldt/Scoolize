import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Page = styled.div`
  min-height: 100vh;
  background: #0b1224;
  color: #e5e7eb;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.9);
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
`;

const Sub = styled.p`
  margin: 0.35rem 0 0 0;
  color: #94a3b8;
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
`;

const Card = styled.div`
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.1fr 0.8fr 0.9fr;
  gap: 1rem;
  align-items: center;
  padding: 0.9rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
`;

const HeaderRow = styled(Row)`
  color: #94a3b8;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
`;

const Name = styled.div`
  font-weight: 600;
  color: #f8fafc;
`;

const Meta = styled.div`
  color: #cbd5e1;
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0b1224;
  background: ${p =>
    p.$state === 'Accepté'
      ? '#22c55e'
      : p.$state === 'Refusé'
      ? '#ef4444'
      : '#94a3b8'};
`;

const Actions = styled.div`
  display: inline-flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionBtn = styled.button`
  border: none;
  border-radius: 10px;
  padding: 0.55rem 0.95rem;
  font-weight: 600;
  cursor: pointer;
  color: #0b1224;
  background: ${p => (p.$danger ? '#f87171' : '#34d399')};
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Empty = styled.div`
  padding: 1.5rem;
  color: #94a3b8;
  text-align: center;
`;

const LogoutButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
  }
`;

const ClickableName = styled.div`
  cursor: pointer;
  transition: color 0.2s ease;
  &:hover {
    color: #60a5fa;
    text-decoration: underline;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  transition: color 0.2s ease;
  &:hover {
    color: #fff;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.85rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: #e5e7eb;
  font-weight: 500;
`;

const NotesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const NotesTableHeader = styled.thead`
  background: rgba(15, 23, 42, 0.8);
`;

const NotesTableRow = styled.tr`
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  &:hover {
    background: rgba(148, 163, 184, 0.05);
  }
`;

const NotesTableCell = styled.td`
  padding: 0.75rem;
  color: #e5e7eb;
  font-size: 0.9rem;
`;

const NotesTableHeaderCell = styled.th`
  padding: 0.75rem;
  text-align: left;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const NoNotes = styled.div`
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
  font-style: italic;
`;

const LoadingText = styled.div`
  padding: 1rem;
  text-align: center;
  color: #94a3b8;
`;

const EspaceEcole = () => {
  const navigate = useNavigate();
  const [candidats, setCandidats] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);
  const [ecoleInfo, setEcoleInfo] = useState(null);
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [etudiantNotes, setEtudiantNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) return;

      const userId = sessionData.session.user.id;

      const { data: ecoleData } = await supabase
        .from('ecoles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!ecoleData) return;

      setEcoleInfo(ecoleData);

      const { data: voeuxData, error: voeuxError } = await supabase
        .from('voeux')
        .select('*')
        .eq('ecole_id', userId)
        .order('id', { ascending: true });

      if (voeuxError) {
        return;
      }

      if (!voeuxData || voeuxData.length === 0) {
        setCandidats([]);
        return;
      }

      const etudiantIds = voeuxData.map(v => v.etudiant_id).filter(Boolean);
      
      if (etudiantIds.length > 0) {
        const { data: etudiantsData, error: etudiantsError } = await supabase
          .from('etudiants')
          .select('id, nom, prenom, lycee_origine, email, date_naissance')
          .in('id', etudiantIds);

        if (etudiantsError) {
          setCandidats(voeuxData.map(v => ({ ...v, etudiants: null })));
          return;
        }

        const candidatsWithEtudiants = voeuxData.map(voeu => {
          const etudiant = etudiantsData?.find(e => e.id === voeu.etudiant_id);
          return {
            ...voeu,
            etudiants: etudiant || null
          };
        });

        setCandidats(candidatsWithEtudiants);
      } else {
        setCandidats(voeuxData.map(v => ({ ...v, etudiants: null })));
      }
    };

    fetchData();
  }, []);

  const updateStatut = async (id, statut) => {
    setLoadingIds(prev => [...prev, id]);
    
    const { data, error } = await supabase
      .from('voeux')
      .update({ statut })
      .eq('id', id)
      .select();

    if (error) {
      alert(`Erreur lors de la mise à jour: ${error.message}`);
    } else {
      setCandidats(prev =>
        prev.map(item =>
          item.id === id ? { ...item, statut } : item
        )
      );
    }
    setLoadingIds(prev => prev.filter(v => v !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('scoolize_user');
    navigate('/');
  };

  const openEtudiantDetail = async (candidat) => {
    if (!candidat.etudiants) return;
    
    setSelectedEtudiant(candidat.etudiants);
    setLoadingNotes(true);
    setEtudiantNotes([]);

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('etudiant_id', candidat.etudiant_id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEtudiantNotes(data);
    }
    setLoadingNotes(false);
  };

  const closeModal = () => {
    setSelectedEtudiant(null);
    setEtudiantNotes([]);
  };

  return (
    <Page>
      <Header>
        <div>
          <Title>Tableau de bord - {ecoleInfo?.nom_ecole || 'Chargement...'}</Title>
          <Sub>{ecoleInfo?.formation ? `Formation : ${ecoleInfo.formation}` : 'Gestion des candidatures'}</Sub>
        </div>
        <LogoutButton onClick={handleLogout}>
          Se déconnecter
        </LogoutButton>
      </Header>

      <Content>
        <Card>
          <HeaderRow>
            <div>Étudiant</div>
            <div>Lycée d'origine</div>
            <div>Statut</div>
            <div>Actions</div>
          </HeaderRow>

          {candidats.length === 0 ? (
            <Empty>Aucune candidature pour le moment.</Empty>
          ) : (
            candidats.map(c => (
              <Row key={c.id}>
                <div>
                  <ClickableName onClick={() => openEtudiantDetail(c)}>
                    <Name>{c.etudiants?.nom || '—'} {c.etudiants?.prenom || ''}</Name>
                  </ClickableName>
                  <Meta>{c.etudiants?.email || '—'}</Meta>
                </div>
                <Meta>{c.etudiants?.lycee_origine || '—'}</Meta>
                <Status $state={c.statut || 'En attente'}>
                  {c.statut || 'En attente'}
                </Status>
                <Actions>
                  <ActionBtn
                    onClick={() => updateStatut(c.id, 'Accepté')}
                    disabled={loadingIds.includes(c.id)}
                  >
                    Accepter
                  </ActionBtn>
                  <ActionBtn
                    $danger
                    onClick={() => updateStatut(c.id, 'Refusé')}
                    disabled={loadingIds.includes(c.id)}
                  >
                    Refuser
                  </ActionBtn>
                </Actions>
              </Row>
            ))
          )}
        </Card>
      </Content>

      {selectedEtudiant && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                Profil de {selectedEtudiant.prenom} {selectedEtudiant.nom}
              </ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <Section>
                <SectionTitle>Informations personnelles</SectionTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Nom</InfoLabel>
                    <InfoValue>{selectedEtudiant.nom || '—'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Prénom</InfoLabel>
                    <InfoValue>{selectedEtudiant.prenom || '—'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{selectedEtudiant.email || '—'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Date de naissance</InfoLabel>
                    <InfoValue>
                      {selectedEtudiant.date_naissance 
                        ? new Date(selectedEtudiant.date_naissance).toLocaleDateString('fr-FR')
                        : '—'}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Lycée d'origine</InfoLabel>
                    <InfoValue>{selectedEtudiant.lycee_origine || '—'}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </Section>

              <Section>
                <SectionTitle>Notes académiques</SectionTitle>
                {loadingNotes ? (
                  <LoadingText>Chargement des notes...</LoadingText>
                ) : etudiantNotes.length === 0 ? (
                  <NoNotes>Aucune note enregistrée pour cet étudiant.</NoNotes>
                ) : (
                  <NotesTable>
                    <NotesTableHeader>
                      <NotesTableRow>
                        <NotesTableHeaderCell>Niveau</NotesTableHeaderCell>
                        <NotesTableHeaderCell>Matière</NotesTableHeaderCell>
                        <NotesTableHeaderCell>Note</NotesTableHeaderCell>
                        <NotesTableHeaderCell>Année</NotesTableHeaderCell>
                      </NotesTableRow>
                    </NotesTableHeader>
                    <tbody>
                      {etudiantNotes.map((note) => (
                        <NotesTableRow key={note.id}>
                          <NotesTableCell>{note.niveau_scolaire || note.niveau || '—'}</NotesTableCell>
                          <NotesTableCell>{note.matiere || '—'}</NotesTableCell>
                          <NotesTableCell>
                            <strong>{note.note || '—'}</strong> / 20
                          </NotesTableCell>
                          <NotesTableCell>{note.annee_scolaire || note.annee || '—'}</NotesTableCell>
                        </NotesTableRow>
                      ))}
                    </tbody>
                  </NotesTable>
                )}
              </Section>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Page>
  );
};

export default EspaceEcole;

