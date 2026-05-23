// Flowssom Science Layer
// Evidence-based breathing and relaxation techniques
// Every technique is based on peer-reviewed research

export type TechniqueType = 'breathe' | 'move' | 'eyes' | 'sigh' | 'mind';

export interface BreathingPhase {
  name: string;
  duration: number; // seconds
  instruction: string;
  expand: boolean; // for circle animation
}

export interface Technique {
  id: string;
  type: TechniqueType;
  name: string;
  description: string;
  scientificBasis: string;
  duration?: number; // total duration in seconds (optional)
  cycles?: number; // number of cycles
  phases?: BreathingPhase[]; // for breathing techniques
  prompts?: string[]; // for movement techniques
}

export const boxBreathingTechnique: Technique = {
  id: 'box-breathing',
  type: 'breathe',
  name: 'Box Breathing',
  description: '4-4-4-4 breathing pattern used by Navy SEALs for stress management',
  scientificBasis: 'Box breathing reduces cortisol in under 90 seconds (NIH, 2017)',
  duration: 64, // 4 cycles × 16 seconds
  cycles: 4,
  phases: [
    {
      name: 'inhale',
      duration: 4,
      instruction: 'Inhale...',
      expand: true,
    },
    {
      name: 'hold',
      duration: 4,
      instruction: 'Hold...',
      expand: false,
    },
    {
      name: 'exhale',
      duration: 4,
      instruction: 'Exhale...',
      expand: false,
    },
    {
      name: 'hold',
      duration: 4,
      instruction: 'Hold...',
      expand: false,
    },
  ],
};

export const physiologicalSighTechnique: Technique = {
  id: 'physiological-sigh',
  type: 'breathe',
  name: 'Physiological Sigh',
  description: 'Two quick inhales followed by a long exhale',
  scientificBasis: 'Fastest known technique to reduce acute stress (Huberman Lab / Stanford, 2022)',
  duration: 18, // 3 cycles × 6 seconds
  cycles: 3,
  phases: [
    {
      name: 'first-inhale',
      duration: 1,
      instruction: 'Quick inhale through nose...',
      expand: true,
    },
    {
      name: 'second-inhale',
      duration: 0.5,
      instruction: 'Another quick inhale...',
      expand: true,
    },
    {
      name: 'exhale',
      duration: 4.5,
      instruction: 'Long slow exhale through mouth...',
      expand: false,
    },
  ],
};

export const eyeRelaxationTechnique: Technique = {
  id: 'eye-relaxation',
  type: 'eyes',
  name: '20-20-20 Rule',
  description: 'Look at something 6 metres away for 20 seconds',
  scientificBasis: 'Reduces digital eye strain (American Optometric Association)',
  duration: 20,
};

export const microMovementPrompts: string[] = [
  'Stand up slowly. Roll your shoulders back five times.',
  'Walk to the nearest window. Look outside for 30 seconds without your phone.',
  'Stretch your arms above your head. Hold for 10 seconds.',
  'Gently tilt your head to the right. Hold 10 seconds. Then left.',
  'Shake out both hands vigorously for 10 seconds.',
  'Take three very slow, deep belly breaths.',
  'Sit up straight. Press your shoulder blades together gently. Hold 5 seconds.',
  'Look at your hands. Open and close them slowly, five times.',
  'Stand and march in place for 30 seconds.',
  'Roll your ankles slowly, 5 rotations each direction.',
  'Close your eyes. Let your face completely relax. Hold 20 seconds.',
  "If you've been sitting for over an hour, please stand for this entire break.",
  'Look at the farthest thing you can see from where you\'re sitting.',
  'Take a sip of water. Drink slowly.',
  'Gently massage the back of your neck for 20 seconds.',
  'Press your palms flat on a desk and lean into a gentle stretch.',
  'Yawn deliberately. It resets your jaw tension.',
  'Close your eyes and notice 3 sounds in the room around you.',
  'Put your phone face down for the entire break.',
  'Do 5 slow head rolls. Both directions.',
];

export const microMovementTechnique: Technique = {
  id: 'micro-movement',
  type: 'move',
  name: 'Micro-Movement',
  description: 'Gentle movements to release physical tension',
  scientificBasis: 'Brief movement breaks improve circulation and reduce muscle fatigue (Mayo Clinic)',
  prompts: microMovementPrompts,
};

export const cognitiveClearTechnique: Technique = {
  id: 'cognitive-clear',
  type: 'mind',
  name: 'Cognitive Clear',
  description: 'Write down intrusive thoughts to clear mental space',
  scientificBasis: 'Writing down thoughts reduces intrusive thinking during focus tasks (Baddeley, 1994 - working memory offloading)',
};

export const allTechniques: Technique[] = [
  boxBreathingTechnique,
  physiologicalSighTechnique,
  eyeRelaxationTechnique,
  microMovementTechnique,
  cognitiveClearTechnique,
];

export const getTechniqueById = (id: string): Technique | undefined => {
  return allTechniques.find(t => t.id === id);
};

export const getDefaultBreakTechniques = (): Technique[] => {
  return [
    boxBreathingTechnique,
    microMovementTechnique,
    eyeRelaxationTechnique,
    physiologicalSighTechnique,
    cognitiveClearTechnique,
  ];
};

export default {
  allTechniques,
  boxBreathingTechnique,
  physiologicalSighTechnique,
  eyeRelaxationTechnique,
  microMovementTechnique,
  cognitiveClearTechnique,
  getTechniqueById,
  getDefaultBreakTechniques,
  microMovementPrompts,
};
