import {
  SHEETS_SYNC,
  SHEETS_ON_CHILD_ADDED
} from '../actions/types';

const initialState = {
  sheets: [],
  templates: {
    'Vesmírná Sága - postava': {
      name: 'Vesmírná Sága - postava',
      language: 'cz',
      skillLevels: 5,
      skillsPerLevel: 5,
      skillLevelNames: [  "average", "fair", "good", "great", "superb" ],
      skillList: [
        'artillery',
        'athletics',
        'connections',
        'craft',
        'deception',
        'diplomacy',
        'empathy',
        'fight',
        'investigate',
        'medicine',
        'perception',
        'physique',
        'piloting',
        'provoke',
        'resources',
        'science',
        'shoot',
        'stealth',
        'technology',
        'thievery',
        'will'
      ],
      stress: [
        { label: "physicalStress", key: "physical", count: 4, def: 2, skill: "physique" },
        { label: "mentalStress", key: "mental", count: 4, def: 2, skill: "will" }
      ],
      consequences: {
        defaultCount: 2,
        bonusSkillLevel: 5,
        skills: ["physique", "will"],
        list: [
          { val: 2, label: "mild", key:  "consequences.minor" },
          { val: 4, label: "moderate", key:  "consequences.moderate" },
          { val: 6, label: "severe", key: "consequences.severe" }
        ]
      },
    }
  }
}

export default function (state = initialState, action) {
  console.log(action.type, action.payload);
  switch (action.type) {
    case SHEETS_SYNC: {
      console.log("SHEETS_SYNC");
      return state;
    }
    case SHEETS_ON_CHILD_ADDED: {
      console.log("SHEETS_ON_CHILD_ADDED", "action", action, "state", state);
      return {
        ...state,
        sheets: [
          ...state.sheets,
          action.payload
        ]
      };
    }

  }
  return state;
}
