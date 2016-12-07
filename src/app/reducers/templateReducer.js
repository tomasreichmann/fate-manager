//import {} from '../actions/types';

const initialState = {
  map: {
    'Vesmírná Sága - postava': {
      name: 'Vesmírná Sága - postava',
      key: 'Vesmírná Sága - postava',
      language: 'cz',
      maxSkillsPerLevel: 5,
      skillLevels: [  "average", "fair", "good", "great", "superb" ],
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
        'notice',
        'physique',
        'pilot',
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
  /*switch (action.type) {
    case SHEETS_SYNC: {
      console.log("SHEETS_SYNC");
      return {
        ...state,
        isSynced: true
      };
    }
  }*/
  return state;
}
