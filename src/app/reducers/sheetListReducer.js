import {
  SHEETS_SYNC,
  SHEETS_ON_CHILD_ADDED,
  SHEETS_ON_CHILD_REMOVED,
  SHEETS_ON_CHILD_CHANGED,
  SHEETS_ON_CHILD_MOVED
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

function addAfter(array, item, previousKey){
  const itemIndex = array.indexOf(item);
  const previousItem = previousKey !== -1 ? array.filter( (item)=>(item.key === previousKey) ) : null;
  const previousIndex = previousKey !== -1 ? array.indexOf(previousItem) : 0;

  return [
    ...array.slice(0, previousIndex),
    item,
    ...array.slice(previousIndex)
  ]
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
        sheets: addAfter(state.sheets, action.payload.item, action.payload.previousKey)
      };
    }
    case SHEETS_ON_CHILD_REMOVED: {
      console.log("SHEETS_ON_CHILD_REMOVED", "action", action, "state", state);
      return {
        ...state,
        sheets: state.sheets.filter( (item)=>( item.key != action.payload.key ) )
      };
    }
    case SHEETS_ON_CHILD_CHANGED: {
      console.log("SHEETS_ON_CHILD_CHANGED", "action", action, "state", state);
      const itemIndex = state.sheets.indexOf(action.payload.key);
      return {
        ...state,
        sheets: [
          ...state.sheets.slice(0, itemIndex),
          action.payload,
          ...state.sheets.slice(itemIndex+1)
        ]
      };
    }
    case SHEETS_ON_CHILD_MOVED: {
      console.log("SHEETS_ON_CHILD_MOVED", "action", action, "state", state);
      const itemIndex = state.sheets.indexOf(action.payload.key);
      const filteredArray = state.sheets.filter( (item)=>( item.key != action.payload.key ) )
      return {
        ...state,
        sheets: addAfter(filteredArray, action.payload.item, action.payload.previousKey)
      };
    }

  }
  return state;
}
