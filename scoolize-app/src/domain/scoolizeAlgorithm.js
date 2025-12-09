// Version JavaScript (ESM/CJS compatible via CRA) du module métier Scoolize.
// Logique identique à la version TypeScript pour usage direct dans le front.

// Types (indicatifs via JSDoc)
/**
 * @typedef {string} StudentId
 * @typedef {string} FormationId
 * @typedef {string} CompetenceId
 *
 * @typedef {{ id: StudentId, name: string, scores: Record<CompetenceId, number>, preferences: FormationId[] }} Student
 * @typedef {{ id: FormationId, name: string, capacity: number, requirements: Record<CompetenceId, number>, weights?: Record<CompetenceId, number> }} Formation
 * @typedef {{ formationId: FormationId, formationName: string, admissible: boolean, score: number, level: 'tres_adapte' | 'adapte' | 'limite' | 'peu_adapte' | 'non_admissible' }} MatchResult
 * @typedef {Record<StudentId, FormationId | null>} AllocationResult
 */

// ---------- Fonctions de matching ----------

/** @param {Student} student @param {Formation} formation @param {number} [margin=0] */
export const isAdmissible = (student, formation, margin = 0) => {
  for (const [comp, required] of Object.entries(formation.requirements)) {
    const level = student.scores[comp] ?? 0;
    if (level < required - margin) return false;
  }
  return true;
};

/** 
 * Calcule le score de compatibilité (0-100%)
 * Basé sur la performance de l'élève par rapport aux requirements
 */
export const computeMatchScore = (student, formation) => {
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const [comp, required] of Object.entries(formation.requirements)) {
    const weight = formation.weights?.[comp] ?? 1;
    const studentLevel = student.scores[comp] ?? 0;
    
    // Pourcentage atteint pour cette compétence (max 100%)
    const compScore = Math.min(100, (studentLevel / required) * 100);
    
    totalScore += weight * compScore;
    totalWeight += weight;
  }
  
  if (totalWeight === 0) return 0;
  return Number(Math.min(100, (totalScore / totalWeight)).toFixed(2));
};

/** 
 * Calcule le pourcentage d'admissibilité (0-100%)
 * Si admissible = 100%, sinon = pourcentage moyen de satisfaction des requirements
 */
export const computeAdmissibilityPercent = (student, formation, margin = 0) => {
  // Vérifier d'abord si admissible
  const admissible = isAdmissible(student, formation, margin);
  
  if (admissible) {
    return 100.0;
  }
  
  // Si non admissible, calculer le pourcentage moyen de ce qui est atteint
  let totalPercent = 0;
  let totalWeight = 0;
  
  for (const [comp, required] of Object.entries(formation.requirements)) {
    const weight = formation.weights?.[comp] ?? 1;
    const studentLevel = student.scores[comp] ?? 0;
    const threshold = required - margin;
    
    // Pourcentage atteint pour cette compétence (peut dépasser 100% si on dépasse le threshold)
    const compPercent = (studentLevel / threshold) * 100;
    
    totalPercent += weight * compPercent;
    totalWeight += weight;
  }
  
  if (totalWeight === 0) return 0;
  
  // Retourner le pourcentage moyen, limité à 100%
  return Number(Math.min(100, (totalPercent / totalWeight)).toFixed(2));
};

/** @param {boolean} admissible @param {number} score */
export const classifyMatch = (admissible, score) => {
  // Si non admissible, toujours "non_admissible"
  if (!admissible) {
    return 'non_admissible';
  }
  
  // Si admissible, classifier selon le score de compatibilité
  if (score >= 90) return 'tres_adapte';
  if (score >= 75) return 'adapte';
  if (score >= 60) return 'limite';
  return 'peu_adapte';
};

// ---------- PREDICT ----------

/** @param {Student} student @param {Formation[]} formations @param {number} [margin=0] */
export const getPredictResultsForStudent = (student, formations, margin = 0) => {
  const results = formations.map((formation) => {
    const admissible = isAdmissible(student, formation, margin);
    const score = computeMatchScore(student, formation);
    const admissibilityPercent = computeAdmissibilityPercent(student, formation, margin);
    const level = classifyMatch(admissible, score);
    return {
      formationId: formation.id,
      formationName: formation.name,
      admissible,
      score,
      admissibilityPercent,
      level,
    };
  });
  // Trier : d'abord les admissibles (par score décroissant), puis les non-admissibles (par pourcentage d'admissibilité décroissant)
  return results.sort((a, b) => {
    if (a.admissible !== b.admissible) {
      return b.admissible ? 1 : -1; // Admissibles en premier
    }
    if (a.admissible) {
      return b.score - a.score; // Pour les admissibles, trier par score
    }
    return b.admissibilityPercent - a.admissibilityPercent; // Pour les non-admissibles, trier par pourcentage d'admissibilité
  });
};

// ---------- Ranking local ----------

/** @param {Student[]} students @param {Formation[]} formations @param {number} [margin=0] */
export const buildRankings = (students, formations, margin = 0) => {
  const rankings = {};
  formations.forEach((formation) => {
    const candidates = students
      .filter((s) => isAdmissible(s, formation, margin))
      .map((s) => ({
        id: s.id,
        score: computeMatchScore(s, formation),
        tie: Math.random(),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.tie - b.tie;
      })
      .map((c) => c.id);
    rankings[formation.id] = candidates;
  });
  return rankings;
};

// ---------- Acceptation différée ----------

/** @param {Student[]} students @param {Formation[]} formations @param {Record<FormationId, StudentId[]>} rankings */
export const runDeferredAcceptance = (students, formations, rankings) => {
  const allocation = {};
  const nextChoiceIndex = {};
  const capacities = {};
  const rankIndex = {};

  students.forEach((s) => {
    allocation[s.id] = null;
    nextChoiceIndex[s.id] = 0;
  });
  formations.forEach((f) => {
    capacities[f.id] = f.capacity;
    rankIndex[f.id] = {};
    (rankings[f.id] || []).forEach((sId, idx) => {
      rankIndex[f.id][sId] = idx;
    });
  });

  let changed = true;
  while (changed) {
    changed = false;
    const proposals = {};

    students.forEach((s) => {
      if (allocation[s.id] !== null) return;
      const prefIdx = nextChoiceIndex[s.id];
      if (prefIdx >= s.preferences.length) return;
      const fId = s.preferences[prefIdx];
      nextChoiceIndex[s.id] += 1;
      if (!proposals[fId]) proposals[fId] = [];
      proposals[fId].push(s.id);
    });

    formations.forEach((f) => {
      const fId = f.id;
      const currentAccepted = students
        .filter((s) => allocation[s.id] === fId)
        .map((s) => s.id);
      const incoming = proposals[fId] || [];
      if (currentAccepted.length === 0 && incoming.length === 0) return;

      const allCandidates = [...currentAccepted, ...incoming];
      const uniqueCandidates = Array.from(new Set(allCandidates));

      uniqueCandidates.sort((a, b) => {
        const rankA = rankIndex[fId][a] ?? Number.POSITIVE_INFINITY;
        const rankB = rankIndex[fId][b] ?? Number.POSITIVE_INFINITY;
        return rankA - rankB;
      });

      const accepted = uniqueCandidates.slice(0, capacities[fId]);
      const acceptedSet = new Set(accepted);

      uniqueCandidates.forEach((sId) => {
        const wasAllocated = allocation[sId] === fId;
        if (acceptedSet.has(sId)) {
          if (!wasAllocated) {
            allocation[sId] = fId;
            changed = true;
          }
        } else if (wasAllocated) {
          allocation[sId] = null;
          changed = true;
        }
      });
    });
  }

  return allocation;
};

// ---------- Démo locale (optionnelle) ----------
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  const students = [
    {
      id: 's1',
      name: 'Alice',
      scores: { math: 18, phys: 16, info: 17, francais: 14 },
      preferences: ['f1', 'f2', 'f3'],
    },
    { id: 's2', name: 'Bruno', scores: { math: 14, phys: 12, info: 15, francais: 15 }, preferences: ['f1', 'f3'] },
    { id: 's3', name: 'Chloé', scores: { math: 12, phys: 11, info: 13, francais: 17 }, preferences: ['f3', 'f2'] },
    { id: 's4', name: 'David', scores: { math: 10, phys: 13, info: 11, francais: 13 }, preferences: ['f2', 'f3'] },
  ];

  const formations = [
    { id: 'f1', name: 'Prépa MPSI', capacity: 1, requirements: { math: 16, phys: 14, info: 14 }, weights: { math: 2, phys: 1.5, info: 1 } },
    { id: 'f2', name: 'Licence Informatique', capacity: 2, requirements: { math: 12, info: 12, francais: 10 }, weights: { info: 2, math: 1.5, francais: 1 } },
    { id: 'f3', name: 'BUT GMP', capacity: 1, requirements: { math: 11, phys: 11 } },
  ];

  const predict = getPredictResultsForStudent(students[0], formations);
  const rankings = buildRankings(students, formations);
  const allocation = runDeferredAcceptance(students, formations, rankings);

  console.log('=== PREDICT (JS) ===', predict);
  console.log('=== Rankings (JS) ===', rankings);
  console.log('=== Allocation (JS) ===', allocation);
}

