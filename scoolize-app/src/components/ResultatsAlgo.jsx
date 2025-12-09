import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  getPredictResultsForStudent,
  buildRankings,
  runDeferredAcceptance,
} from '../domain/scoolizeAlgorithm';
import NavBar from './NavBar';

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  color: #e5e7eb;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 2rem;
`;

const Card = styled.div`
  background: rgba(2, 6, 23, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 20px;
  padding: 1.75rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
`;

const Title = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.6rem;
  color: #f9fafb;
`;

const Subtitle = styled.p`
  margin: 0 0 1rem 0;
  color: #94a3b8;
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin: 0.5rem 0 1.25rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Label = styled.label`
  font-weight: 600;
  color: #cbd5e1;
`;

const NumberInput = styled.input`
  width: 80px;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.7);
  color: #e2e8f0;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  color: #cbd5e1;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  font-weight: 600;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  color: #e2e8f0;
`;

const Pill = styled.span`
  display: inline-block;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.85rem;
  background: ${p => ({
    tres_adapte: 'rgba(16, 185, 129, 0.15)',
    adapte: 'rgba(59, 130, 246, 0.18)',
    limite: 'rgba(234, 179, 8, 0.15)',
    peu_adapte: 'rgba(248, 113, 113, 0.18)',
    non_admissible: 'rgba(148, 163, 184, 0.18)',
  }[p.level] || 'rgba(148, 163, 184, 0.18)')};
  color: ${p => ({
    tres_adapte: '#10b981',
    adapte: '#60a5fa',
    limite: '#eab308',
    peu_adapte: '#f87171',
    non_admissible: '#94a3b8',
  }[p.level] || '#94a3b8')};
  border: 1px solid rgba(148, 163, 184, 0.25);
`;

const Badge = styled.span`
  font-size: 0.85rem;
  color: #94a3b8;
`;

// -------- logique pour adapter aux données utilisateur --------
const competenceMap = {
  Mathématiques: 'math',
  'Physique-Chimie': 'phys',
  SVT: 'svt',
  SES: 'ses',
  'Histoire-Géographie': 'hg',
  Français: 'francais',
  Philosophie: 'philo',
  Anglais: 'anglais',
  Espagnol: 'espagnol',
};

// Mapping des formations vers requirements
const formationRequirements = {
  // Formations scientifiques et techniques
  'Prépa MPSI': { math: 16, phys: 14, info: 14, weights: { math: 2, phys: 1.5, info: 1 } },
  'Classe prépa MPSI': { math: 16, phys: 14, info: 14, weights: { math: 2, phys: 1.5, info: 1 } },
  'Classe prépa MP': { math: 17, phys: 15, weights: { math: 2.5, phys: 2 } },
  'Classe prépa PC': { math: 15, phys: 16, weights: { math: 2, phys: 2.5 } },
  'Classe prépa PSI': { math: 15, phys: 14, weights: { math: 2, phys: 1.5 } },
  'Licence Mathématiques': { math: 14, francais: 10, weights: { math: 3, francais: 1 } },
  'Licence Mathématiques-Informatique': { math: 13, info: 12, francais: 10, weights: { math: 2, info: 2, francais: 1 } },
  'Licence Informatique': { math: 12, info: 12, francais: 10, weights: { info: 2, math: 1.5, francais: 1 } },
  'Licence Physique': { math: 13, phys: 13, francais: 10, weights: { math: 2, phys: 2, francais: 1 } },
  'Licence Chimie': { math: 12, phys: 12, francais: 10, weights: { math: 1.5, phys: 2, francais: 1 } },
  'BUT Informatique': { math: 11, info: 11, francais: 10, weights: { info: 2, math: 1.5 } },
  'BUT GMP': { math: 11, phys: 11, weights: { math: 1.5, phys: 1.5 } },
  'BUT Génie Civil': { math: 11, phys: 10, weights: { math: 2, phys: 1 } },
  'BUT Mesures Physiques': { math: 12, phys: 12, weights: { math: 1.5, phys: 2 } },
  'École d\'ingénieur post-bac': { math: 14, phys: 13, info: 12, weights: { math: 2, phys: 1.5, info: 1 } },
  
  // Formations économiques et commerciales
  'Classe prépa ECS': { math: 14, ses: 13, francais: 13, weights: { math: 1.5, ses: 2, francais: 1.5 } },
  'Classe prépa ECE': { math: 13, ses: 14, francais: 13, weights: { math: 1.5, ses: 2.5, francais: 1.5 } },
  'Licence Économie': { math: 12, ses: 12, francais: 11, weights: { math: 2, ses: 2, francais: 1 } },
  'Licence Économie-Gestion': { math: 11, ses: 13, francais: 11, weights: { ses: 2, math: 1.5, francais: 1 } },
  'Licence Gestion': { math: 11, ses: 12, francais: 11, weights: { ses: 2, math: 1.5, francais: 1 } },
  'BUT GEA': { math: 10, ses: 12, francais: 11, weights: { ses: 2, math: 1, francais: 1 } },
  'École de commerce post-bac': { math: 12, ses: 13, francais: 12, anglais: 12, weights: { ses: 2, math: 1, francais: 1, anglais: 1 } },
  
  // Formations littéraires et juridiques
  'Classe prépa Lettres': { francais: 15, hg: 14, philo: 12, weights: { francais: 2.5, hg: 2, philo: 1.5 } },
  'Classe prépa BL': { math: 13, francais: 14, ses: 12, weights: { math: 1.5, francais: 2, ses: 1.5 } },
  'Licence Droit': { francais: 14, hg: 12, philo: 11, weights: { francais: 2, hg: 1.5, philo: 1 } },
  'Licence Histoire': { francais: 13, hg: 14, philo: 11, weights: { francais: 1.5, hg: 2.5, philo: 1 } },
  'Licence Lettres': { francais: 15, hg: 12, philo: 12, weights: { francais: 3, hg: 1, philo: 1.5 } },
  'Licence Philosophie': { francais: 14, philo: 14, hg: 11, weights: { francais: 2, philo: 2.5, hg: 1 } },
  'BUT TC': { francais: 12, hg: 11, anglais: 11, weights: { francais: 1.5, hg: 1, anglais: 1 } },
  
  // Formations sciences humaines et sociales
  'Licence Psychologie': { francais: 12, ses: 12, svt: 10, weights: { ses: 1.5, francais: 1.5, svt: 1 } },
  'Licence Sociologie': { francais: 12, ses: 13, hg: 11, weights: { ses: 2.5, francais: 1.5, hg: 1 } },
  'Licence Sciences de l\'éducation': { francais: 12, ses: 11, svt: 10, weights: { francais: 2, ses: 1.5, svt: 1 } },
  
  // Formations sciences de la vie
  'Licence Biologie': { svt: 13, math: 11, phys: 10, weights: { svt: 2.5, math: 1.5, phys: 1 } },
  'Licence Sciences de la vie': { svt: 13, math: 11, phys: 10, weights: { svt: 2.5, math: 1.5, phys: 1 } },
  'BUT Génie Biologique': { svt: 12, math: 11, phys: 10, weights: { svt: 2, math: 1.5, phys: 1 } },
  
  // Formations langues
  'Licence Langues Étrangères Appliquées': { anglais: 14, francais: 13, espagnol: 12, weights: { anglais: 2, francais: 1.5, espagnol: 1.5 } },
  'Licence LLCE Anglais': { anglais: 15, francais: 13, weights: { anglais: 3, francais: 1.5 } },
  
  // Formations artistiques et communication
  'Licence Arts': { francais: 12, hg: 11, weights: { francais: 2, hg: 1.5 } },
  'BUT Information-Communication': { francais: 13, hg: 11, anglais: 11, weights: { francais: 2, hg: 1, anglais: 1 } },
};

const EmptyState = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: #9ca3af;
`;

const EmptyTitle = styled.h3`
  font-size: 1.3rem;
  color: #e5e7eb;
  margin: 0 0 1rem 0;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin: 0.5rem 0;
`;

const EmptyLink = styled.a`
  color: #60a5fa;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StatCard = styled.div`
  padding: 1rem;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f9fafb;
  margin-bottom: 0.25rem;
`;

const StatSubtext = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
`;

const RecommendationCard = styled.div`
  padding: 1.25rem;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  &:hover {
    border-color: rgba(59, 130, 246, 0.5);
    background: rgba(15, 23, 42, 0.8);
  }
`;

const RecommendationTitle = styled.h3`
  font-size: 1.1rem;
  color: #f9fafb;
  margin: 0 0 0.5rem 0;
`;

const RecommendationScore = styled.div`
  display: inline-block;
  padding: 0.35rem 0.7rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-right: 0.5rem;
`;

const MatiereDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  &:last-child {
    border-bottom: none;
  }
`;

const MatiereName = styled.span`
  color: #e5e7eb;
  font-size: 0.9rem;
`;

const MatiereStatus = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
`;

const ResultatsAlgo = () => {
  const [margin, setMargin] = useState(0);
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [voeux, setVoeux] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('scoolize_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }
    const savedNotes = localStorage.getItem('scoolize_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        setNotes([]);
      }
    }
    const savedVoeux = localStorage.getItem('scoolize_voeux');
    if (savedVoeux) {
      try {
        setVoeux(JSON.parse(savedVoeux));
      } catch (e) {
        setVoeux([]);
      }
    }
  }, []);

  const students = useMemo(() => {
    // Pas de notes = pas de profil
    if (!notes || notes.length === 0) return null;

    const grouped = {};
    notes.forEach((n) => {
      const comp = competenceMap[n.matiere] || 'autre';
      const val = parseFloat(n.note);
      if (!Number.isFinite(val)) return;
      if (!grouped[comp]) grouped[comp] = [];
      grouped[comp].push(val);
    });

    const scores = Object.entries(grouped).reduce((acc, [comp, arr]) => {
      const avg = arr.reduce((s, v) => s + v, 0) / arr.length;
      acc[comp] = Number(avg.toFixed(2));
      return acc;
    }, {});

    // Ne pas remplir automatiquement les compétences manquantes
    // L'algorithme utilisera uniquement les notes réelles de l'utilisateur
    // Si une compétence n'est pas présente, elle sera considérée comme 0 dans l'algorithme

    // Créer les préférences basées sur les vœux (triées par priorité)
    const preferences = voeux
      .sort((a, b) => Number(a.priorite) - Number(b.priorite))
      .map((v, idx) => `f${idx + 1}`);

    return [
      {
        id: 'user',
        name: user?.prenom ? `${user.prenom} ${user.nom || ''}`.trim() : 'Ton profil',
        scores,
        preferences: preferences.length > 0 ? preferences : [],
      },
    ];
  }, [notes, user, voeux]);

  const formations = useMemo(() => {
    // Uniquement basé sur les vœux de l'utilisateur
    if (!voeux || voeux.length === 0) return null;

    return voeux
      .sort((a, b) => Number(a.priorite) - Number(b.priorite))
      .map((v, idx) => {
        const formationName = v.formation;
        const reqData = formationRequirements[formationName] || {
          math: 12,
          francais: 12,
          weights: { math: 1, francais: 1 },
        };
        const { weights, ...requirements } = reqData;
        return {
          id: `f${idx + 1}`,
          name: `${formationName} - ${v.etablissement}${v.ville ? ` (${v.ville})` : ''}`,
          capacity: 1,
          requirements,
          weights: weights || {},
        };
      });
  }, [voeux]);

  const predict = useMemo(() => {
    if (!students || !students[0] || !formations || formations.length === 0) return null;
    return getPredictResultsForStudent(students[0], formations, margin);
  }, [students, formations, margin]);

  const rankings = useMemo(() => {
    if (!students || !formations || formations.length === 0) return null;
    return buildRankings(students, formations, margin);
  }, [students, formations, margin]);

  const allocation = useMemo(() => {
    if (!students || !formations || formations.length === 0 || !rankings) return null;
    return runDeferredAcceptance(students, formations, rankings);
  }, [students, formations, rankings]);

  // Calculer les moyennes par matière avec potentiel d'admission
  const matiereStats = useMemo(() => {
    if (!students || !students[0]) return [];
    
    const student = students[0];
    const matiereLabels = {
      math: 'Mathématiques',
      francais: 'Français',
      phys: 'Physique-Chimie',
      svt: 'SVT',
      ses: 'SES',
      hg: 'Histoire-Géographie',
      philo: 'Philosophie',
      anglais: 'Anglais',
      espagnol: 'Espagnol',
      info: 'Informatique',
    };

    return Object.entries(student.scores).map(([comp, score]) => {
      // Trouver les formations qui nécessitent cette compétence
      const formationsNecessitant = Object.entries(formationRequirements)
        .filter(([_, req]) => req[comp] !== undefined)
        .map(([name, req]) => ({
          name,
          required: req[comp],
          weight: req.weights?.[comp] || 1,
        }));

      // Calculer le potentiel d'admission (combien de formations sont accessibles)
      const accessible = formationsNecessitant.filter(f => score >= f.required).length;
      const total = formationsNecessitant.length;
      const potentiel = total > 0 ? Math.round((accessible / total) * 100) : 0;

      return {
        matiere: matiereLabels[comp] || comp,
        moyenne: score,
        formationsNecessitant: total,
        formationsAccessibles: accessible,
        potentiel,
      };
    }).sort((a, b) => b.moyenne - a.moyenne);
  }, [students]);

  // Analyser le profil du lycée de l'utilisateur
  const lyceeProfile = useMemo(() => {
    if (!notes || notes.length === 0) return null;
    
    // Trouver le lycée le plus fréquent dans les notes
    const lyceesCount = {};
    notes.forEach(n => {
      if (n.etablissement) {
        lyceesCount[n.etablissement] = (lyceesCount[n.etablissement] || 0) + 1;
      }
    });
    
    const principalLycee = Object.entries(lyceesCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0];
    
    if (!principalLycee) return null;
    
    // Calculer la moyenne générale dans ce lycée
    const notesLycee = notes.filter(n => n.etablissement === principalLycee);
    const moyenneLycee = notesLycee.reduce((sum, n) => sum + parseFloat(n.note), 0) / notesLycee.length;
    
    // Classer le lycée selon la moyenne (excellent > 16, très bon > 14, bon > 12, moyen > 10)
    let niveauLycee = 'Moyen';
    let niveauScore = 1;
    if (moyenneLycee >= 16) {
      niveauLycee = 'Excellent';
      niveauScore = 4;
    } else if (moyenneLycee >= 14) {
      niveauLycee = 'Très bon';
      niveauScore = 3;
    } else if (moyenneLycee >= 12) {
      niveauLycee = 'Bon';
      niveauScore = 2;
    }
    
    return {
      nom: principalLycee,
      moyenne: moyenneLycee,
      niveau: niveauLycee,
      niveauScore,
      nombreNotes: notesLycee.length,
    };
  }, [notes]);

  // Générer des recommandations pour toutes les formations disponibles
  const recommendations = useMemo(() => {
    if (!students || !students[0]) return [];
    
    const student = students[0];
    const allFormations = Object.keys(formationRequirements).map((name, idx) => {
      const reqData = formationRequirements[name];
      const { weights, ...requirements } = reqData;
      return {
        id: `rec_${idx}`,
        name,
        capacity: 1,
        requirements,
        weights: weights || {},
      };
    });

    const results = allFormations.map(formation => {
      const result = getPredictResultsForStudent(student, [formation], margin)[0];
      
      // Ajuster le score selon le niveau du lycée
      let adjustedScore = result.score;
      let adjustedAdmissibility = result.admissibilityPercent;
      
      if (lyceeProfile) {
        // Bonus pour les lycées excellents/très bons
        const bonus = lyceeProfile.niveauScore >= 3 ? 5 : lyceeProfile.niveauScore >= 2 ? 2 : 0;
        adjustedScore = Math.min(100, result.score + bonus);
        if (result.admissible) {
          adjustedAdmissibility = 100;
        } else {
          adjustedAdmissibility = Math.min(100, result.admissibilityPercent + bonus);
        }
      }
      
      // Calculer un score de recommandation global
      const recommendationScore = result.admissible 
        ? adjustedScore * 1.2 // Bonus pour les formations admissibles
        : adjustedScore;
      
      return {
        ...result,
        formationName: formation.name,
        adjustedScore,
        adjustedAdmissibility,
        recommendationScore,
        lyceeInfo: lyceeProfile,
      };
    });

    // Trier par score de recommandation décroissant
    return results
      .sort((a, b) => {
        // D'abord les admissibles
        if (a.admissible !== b.admissible) {
          return b.admissible ? 1 : -1;
        }
        // Puis par score de recommandation
        return b.recommendationScore - a.recommendationScore;
      })
      .slice(0, 15); // Top 15 recommandations
  }, [students, margin, lyceeProfile]);

  // Cas : pas de notes
  if (!notes || notes.length === 0) {
    return (
      <Page>
        <NavBar active="resultats" />
        <Card>
          <EmptyState>
            <EmptyTitle>Pas encore de notes enregistrées</EmptyTitle>
            <EmptyText>
              Pour voir tes résultats de compatibilité, tu dois d'abord ajouter tes notes.
            </EmptyText>
            <EmptyText>
              <EmptyLink href="/notes">→ Ajouter mes notes</EmptyLink>
            </EmptyText>
          </EmptyState>
        </Card>
      </Page>
    );
  }

  // Cas : pas de vœux
  if (!voeux || voeux.length === 0) {
    return (
      <Page>
        <NavBar active="resultats" />
        <Card>
          <EmptyState>
            <EmptyTitle>Pas encore de vœux enregistrés</EmptyTitle>
            <EmptyText>
              Pour voir tes résultats de compatibilité, tu dois d'abord ajouter tes vœux de formations.
            </EmptyText>
            <EmptyText>
              <EmptyLink href="/voeux">→ Ajouter mes vœux</EmptyLink>
            </EmptyText>
          </EmptyState>
        </Card>
      </Page>
    );
  }

  // Cas : tout est OK
  return (
    <Page>
      <NavBar active="resultats" />

      <Card>
        <Title>Mes résultats de compatibilité</Title>
        <Subtitle>
          Analyse de ta compatibilité avec tes formations préférées basée sur tes notes.
        </Subtitle>
        <InputRow>
          <Label>Marge de tolérance (points)</Label>
          <NumberInput
            type="number"
            value={margin}
            min={0}
            max={5}
            step={0.5}
            onChange={(e) => setMargin(Number(e.target.value))}
          />
          <Badge>
            Profil : {students?.[0]?.name || 'Ton profil'} • {notes.length} note{notes.length > 1 ? 's' : ''} • {voeux.length} vœu{voeux.length > 1 ? 'x' : ''}
          </Badge>
        </InputRow>
      </Card>

      {lyceeProfile && (
        <Card>
          <Title>📊 Profil de mon lycée</Title>
          <Subtitle>Analyse de ton établissement et de ton niveau</Subtitle>
          <StatsGrid>
            <StatCard>
              <StatLabel>Lycée</StatLabel>
              <StatValue style={{ fontSize: '1.1rem' }}>{lyceeProfile.nom}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Moyenne générale</StatLabel>
              <StatValue>{lyceeProfile.moyenne.toFixed(2)}/20</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Niveau du lycée</StatLabel>
              <StatValue style={{ 
                fontSize: '1.1rem',
                color: lyceeProfile.niveauScore >= 3 ? '#10b981' : 
                       lyceeProfile.niveauScore >= 2 ? '#60a5fa' : 
                       lyceeProfile.niveauScore >= 1 ? '#eab308' : '#f87171'
              }}>
                {lyceeProfile.niveau}
              </StatValue>
              <StatSubtext>{lyceeProfile.nombreNotes} note{lyceeProfile.nombreNotes > 1 ? 's' : ''} enregistrée{lyceeProfile.nombreNotes > 1 ? 's' : ''}</StatSubtext>
            </StatCard>
            <StatCard>
              <StatLabel>Impact sur les recommandations</StatLabel>
              <StatValue style={{ fontSize: '1rem' }}>
                {lyceeProfile.niveauScore >= 3 ? '+5% bonus' : 
                 lyceeProfile.niveauScore >= 2 ? '+2% bonus' : 
                 'Aucun bonus'}
              </StatValue>
              <StatSubtext>
                {lyceeProfile.niveauScore >= 3 ? 'Ton lycée excellent te donne un avantage' :
                 lyceeProfile.niveauScore >= 2 ? 'Ton bon lycée améliore tes chances' :
                 'Continue tes efforts pour améliorer tes chances'}
              </StatSubtext>
            </StatCard>
          </StatsGrid>
        </Card>
      )}

      {matiereStats && matiereStats.length > 0 && (
        <Card>
          <Title>Mes moyennes par matière</Title>
          <Subtitle>Analyse de tes notes avec le potentiel d'admission pour chaque matière</Subtitle>
          <StatsGrid>
            {matiereStats.map((stat) => {
              const getPotentielColor = (potentiel) => {
                if (potentiel >= 80) return '#10b981';
                if (potentiel >= 50) return '#60a5fa';
                if (potentiel >= 30) return '#eab308';
                return '#f87171';
              };
              
              const getPotentielLabel = (potentiel) => {
                if (potentiel >= 80) return 'Excellent';
                if (potentiel >= 50) return 'Bon';
                if (potentiel >= 30) return 'Moyen';
                return 'Faible';
              };

              return (
                <StatCard key={stat.matiere}>
                  <StatLabel>{stat.matiere}</StatLabel>
                  <StatValue>{stat.moyenne.toFixed(2)}/20</StatValue>
                  <StatSubtext>
                    <div style={{ marginBottom: '0.25rem' }}>
                      Potentiel: <span style={{ color: getPotentielColor(stat.potentiel), fontWeight: 600 }}>
                        {getPotentielLabel(stat.potentiel)} ({stat.potentiel}%)
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      {stat.formationsAccessibles}/{stat.formationsNecessitant} formations accessibles
                    </div>
                  </StatSubtext>
                </StatCard>
              );
            })}
          </StatsGrid>
        </Card>
      )}

      {predict && predict.length > 0 && (
        <Card>
          <Title>Compatibilité avec tes formations</Title>
          <Subtitle>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Admissibilité</strong> : Pourcentage de satisfaction des requirements minimum (100% = admissible, &lt;100% = non admissible)
            </div>
            <div>
              <strong>Score de compatibilité</strong> : Performance globale par rapport aux requirements (0-100%)
            </div>
          </Subtitle>
          <Table>
            <thead>
              <tr>
                <Th>Formation</Th>
                <Th>Admissibilité</Th>
                <Th>Score de compatibilité</Th>
                <Th>Niveau</Th>
              </tr>
            </thead>
            <tbody>
              {predict.map((r) => {
                const getScoreColor = (score) => {
                  if (score >= 90) return '#10b981';
                  if (score >= 75) return '#60a5fa';
                  if (score >= 60) return '#eab308';
                  return '#f87171';
                };
                
                // Trouver les matières nécessaires pour cette formation
                const formation = formations?.find(f => f.id === r.formationId);
                const matieresNecessaires = formation ? Object.keys(formation.requirements) : [];
                const student = students?.[0];
                
                return (
                  <tr key={r.formationId}>
                    <Td>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{r.formationName}</div>
                        {matieresNecessaires.length > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                            Matières: {matieresNecessaires.map((comp, idx) => {
                              const compLabels = {
                                math: 'Math',
                                francais: 'Français',
                                phys: 'Physique',
                                svt: 'SVT',
                                ses: 'SES',
                                hg: 'Histoire-Géo',
                                philo: 'Philo',
                                anglais: 'Anglais',
                                espagnol: 'Espagnol',
                                info: 'Info',
                              };
                              const required = formation.requirements[comp];
                              const studentScore = student?.scores[comp] ?? 0;
                              const status = studentScore >= required ? '✓' : '✗';
                              const color = studentScore >= required ? '#10b981' : '#f87171';
                              return (
                                <span key={comp} style={{ marginRight: '0.5rem' }}>
                                  <span style={{ color }}>{status}</span> {compLabels[comp] || comp} ({required})
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ 
                          color: r.admissible ? '#10b981' : getScoreColor(r.admissibilityPercent),
                          fontWeight: 600,
                          fontSize: '1rem'
                        }}>
                          {r.admissible ? '100%' : `${r.admissibilityPercent.toFixed(1)}%`}
                        </span>
                        <span style={{ 
                          color: r.admissible ? '#10b981' : '#f87171',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          {r.admissible ? '✓ Admissible' : '✗ Non admissible'}
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <span style={{ 
                        color: getScoreColor(r.score),
                        fontWeight: 600 
                      }}>
                        {r.score.toFixed(2)}%
                      </span>
                    </Td>
                    <Td><Pill level={r.level}>{r.level}</Pill></Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}

      {recommendations && recommendations.length > 0 && (
        <Card>
          <Title>🎯 Recommandations personnalisées</Title>
          <Subtitle>
            Les meilleures formations selon ton profil, ton lycée et tes notes. 
            {lyceeProfile && ` Classement basé sur ton lycée ${lyceeProfile.niveau.toLowerCase()}.`}
          </Subtitle>
          {recommendations.map((rec, idx) => {
            // Trouver les requirements de cette formation
            const reqData = formationRequirements[rec.formationName];
            const matieresNecessaires = reqData ? Object.keys(reqData).filter(k => k !== 'weights') : [];
            const student = students?.[0];

            return (
              <RecommendationCard key={rec.formationId || idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: idx < 3 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'rgba(148, 163, 184, 0.2)',
                        color: idx < 3 ? '#fff' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        border: idx < 3 ? '2px solid #f59e0b' : '1px solid rgba(148, 163, 184, 0.3)'
                      }}>
                        {idx + 1}
                      </span>
                      <RecommendationTitle style={{ margin: 0 }}>{rec.formationName}</RecommendationTitle>
                    </div>
                    {rec.lyceeInfo && rec.lyceeInfo.niveauScore >= 2 && (
                      <div style={{ 
                        display: 'inline-block',
                        marginTop: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: '#10b981'
                      }}>
                        ⭐ Recommandé grâce à ton lycée {rec.lyceeInfo.niveau}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <RecommendationScore style={{ 
                      background: rec.admissible ? 'rgba(16, 185, 129, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                      color: rec.admissible ? '#10b981' : '#f87171',
                      border: `1px solid ${rec.admissible ? 'rgba(16, 185, 129, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`
                    }}>
                      {rec.adjustedScore.toFixed(1)}% {rec.admissible ? '✓' : '✗'}
                    </RecommendationScore>
                    {rec.adjustedScore !== rec.score && (
                      <div style={{ 
                        fontSize: '0.7rem',
                        color: '#60a5fa'
                      }}>
                        +{(rec.adjustedScore - rec.score).toFixed(1)}% bonus lycée
                      </div>
                    )}
                  </div>
                </div>
                {matieresNecessaires.length > 0 && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    {matieresNecessaires.map((comp) => {
                      const compLabels = {
                        math: 'Mathématiques',
                        francais: 'Français',
                        phys: 'Physique-Chimie',
                        svt: 'SVT',
                        ses: 'SES',
                        hg: 'Histoire-Géographie',
                        philo: 'Philosophie',
                        anglais: 'Anglais',
                        espagnol: 'Espagnol',
                        info: 'Informatique',
                      };
                      const required = reqData[comp];
                      const studentScore = student?.scores[comp] ?? 0;
                      const status = studentScore >= required;
                      const diff = studentScore - required;
                      return (
                        <MatiereDetail key={comp}>
                          <MatiereName>{compLabels[comp] || comp}</MatiereName>
                          <MatiereStatus style={{ color: status ? '#10b981' : '#f87171' }}>
                            {studentScore.toFixed(1)}/20 {status ? '✓' : '✗'} (requis: {required}/20)
                            {!status && diff < 0 && (
                              <span style={{ marginLeft: '0.5rem', color: '#f87171' }}>
                                (-{Math.abs(diff).toFixed(1)})
                              </span>
                            )}
                          </MatiereStatus>
                        </MatiereDetail>
                      );
                    })}
                  </div>
                )}
              </RecommendationCard>
            );
          })}
        </Card>
      )}

      {allocation && (
        <Card>
          <Title>Résultat de l'affectation</Title>
          <Subtitle>Formation qui t'a été attribuée selon l'algorithme d'acceptation différée.</Subtitle>
          {allocation['user'] ? (
            <EmptyText style={{ textAlign: 'left', color: '#e5e7eb', fontSize: '1.1rem' }}>
              ✓ Tu es affecté(e) à : <strong>{formations.find(f => f.id === allocation['user'])?.name || allocation['user']}</strong>
            </EmptyText>
          ) : (
            <EmptyText style={{ textAlign: 'left', color: '#f87171' }}>
              ✗ Aucune affectation pour le moment. Tu n'es pas admissible aux formations de tes vœux avec la marge actuelle.
            </EmptyText>
          )}
        </Card>
      )}
    </Page>
  );
};

export default ResultatsAlgo;

