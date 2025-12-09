// Domaine Scoolize : algorithmes de matching et d'affectation
// Module indépendant, sans dépendance externe. Importable côté front/back TS.

// ---------- Types de base ----------
export type StudentId = string;
export type FormationId = string;
export type CompetenceId = string;

export interface Student {
  id: StudentId;
  name: string;
  scores: Record<CompetenceId, number>; // niveaux par compétence
  preferences: FormationId[]; // ordre décroissant de préférence
}

export interface Formation {
  id: FormationId;
  name: string;
  capacity: number;
  requirements: Record<CompetenceId, number>;
  weights?: Record<CompetenceId, number>;
}

export interface MatchResult {
  formationId: FormationId;
  formationName: string;
  admissible: boolean;
  score: number; // 0-100
  level: 'tres_adapte' | 'adapte' | 'limite' | 'peu_adapte' | 'non_admissible';
}

export type AllocationResult = Record<StudentId, FormationId | null>;

// ---------- Fonctions de matching ----------

export const isAdmissible = (student: Student, formation: Formation, margin = 0): boolean => {
  for (const [comp, required] of Object.entries(formation.requirements)) {
    const level = student.scores[comp] ?? 0;
    if (level < required - margin) return false;
  }
  return true;
};

export const computeMatchScore = (student: Student, formation: Formation): number => {
  let num = 0;
  let den = 0;
  for (const [comp, required] of Object.entries(formation.requirements)) {
    const weight = formation.weights?.[comp] ?? 1;
    const studentLevel = student.scores[comp] ?? 0;
    num += weight * Math.min(studentLevel, required);
    den += weight * required;
  }
  if (den === 0) return 0;
  return Number(((100 * num) / den).toFixed(2));
};

export const classifyMatch = (
  admissible: boolean,
  score: number
): MatchResult['level'] => {
  if (!admissible) return 'non_admissible';
  if (score >= 90) return 'tres_adapte';
  if (score >= 70) return 'adapte';
  if (score >= 50) return 'limite';
  return 'peu_adapte';
};

// ---------- PREDICT : matching d'un élève avec toutes les formations ----------

export const getPredictResultsForStudent = (
  student: Student,
  formations: Formation[],
  margin = 0
): MatchResult[] => {
  const results = formations.map((formation) => {
    const admissible = isAdmissible(student, formation, margin);
    const score = admissible ? computeMatchScore(student, formation) : 0;
    const level = classifyMatch(admissible, score);
    return {
      formationId: formation.id,
      formationName: formation.name,
      admissible,
      score,
      level,
    };
  });

  return results.sort((a, b) => b.score - a.score);
};

// ---------- Classement local des élèves par formation ----------

export const buildRankings = (
  students: Student[],
  formations: Formation[],
  margin = 0
): Record<FormationId, StudentId[]> => {
  const rankings: Record<FormationId, StudentId[]> = {};

  formations.forEach((formation) => {
    const candidates = students
      .filter((s) => isAdmissible(s, formation, margin))
      .map((s) => ({
        id: s.id,
        score: computeMatchScore(s, formation),
        tie: Math.random(), // départage aléatoire en cas d'égalité parfaite
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

// ---------- Algorithme d'acceptation différée (type Parcoursup) ----------

export const runDeferredAcceptance = (
  students: Student[],
  formations: Formation[],
  rankings: Record<FormationId, StudentId[]>
): AllocationResult => {
  const allocation: AllocationResult = {};
  const nextChoiceIndex: Record<StudentId, number> = {};
  const capacities: Record<FormationId, number> = {};
  const rankIndex: Record<FormationId, Record<StudentId, number>> = {};

  students.forEach((s) => {
    allocation[s.id] = null;
    nextChoiceIndex[s.id] = 0;
  });
  formations.forEach((f) => {
    capacities[f.id] = f.capacity;
    rankIndex[f.id] = {};
    rankings[f.id]?.forEach((sId, idx) => {
      rankIndex[f.id][sId] = idx;
    });
  });

  let changed = true;
  while (changed) {
    changed = false;
    const proposals: Record<FormationId, StudentId[]> = {};

    // Étape 1 : chaque élève non affecté propose à la prochaine formation de sa liste
    students.forEach((s) => {
      if (allocation[s.id] !== null) return;
      const prefIdx = nextChoiceIndex[s.id];
      if (prefIdx >= s.preferences.length) return;
      const fId = s.preferences[prefIdx];
      nextChoiceIndex[s.id] += 1;
      if (!proposals[fId]) proposals[fId] = [];
      proposals[fId].push(s.id);
    });

    // Étape 2 : chaque formation sélectionne ses meilleurs candidats
    formations.forEach((f) => {
      const fId = f.id;
      const currentAccepted = students
        .filter((s) => allocation[s.id] === fId)
        .map((s) => s.id);

      const incoming = proposals[fId] || [];
      if (currentAccepted.length === 0 && incoming.length === 0) {
        return;
      }

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

// ---------- Exemple d'utilisation rapide ----------

if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  const students: Student[] = [
    {
      id: 's1',
      name: 'Alice',
      scores: { math: 18, phys: 16, info: 17, francais: 14 },
      preferences: ['f1', 'f2', 'f3'],
    },
    {
      id: 's2',
      name: 'Bruno',
      scores: { math: 14, phys: 12, info: 15, francais: 15 },
      preferences: ['f1', 'f3'],
    },
    {
      id: 's3',
      name: 'Chloé',
      scores: { math: 12, phys: 11, info: 13, francais: 17 },
      preferences: ['f3', 'f2'],
    },
    {
      id: 's4',
      name: 'David',
      scores: { math: 10, phys: 13, info: 11, francais: 13 },
      preferences: ['f2', 'f3'],
    },
  ];

  const formations: Formation[] = [
    {
      id: 'f1',
      name: 'Prépa MPSI',
      capacity: 1,
      requirements: { math: 16, phys: 14, info: 14 },
      weights: { math: 2, phys: 1.5, info: 1 },
    },
    {
      id: 'f2',
      name: 'Licence Informatique',
      capacity: 2,
      requirements: { math: 12, info: 12, francais: 10 },
      weights: { info: 2, math: 1.5, francais: 1 },
    },
    {
      id: 'f3',
      name: 'BUT GMP',
      capacity: 1,
      requirements: { math: 11, phys: 11 },
    },
  ];

  const predictAlice = getPredictResultsForStudent(students[0], formations);
  console.log('=== PREDICT pour Alice ===');
  console.log(predictAlice);

  const rankings = buildRankings(students, formations);
  console.log('=== Rankings ===');
  console.log(rankings);

  const allocation = runDeferredAcceptance(students, formations, rankings);
  console.log('=== Allocation finale ===');
  console.log(allocation);
}

