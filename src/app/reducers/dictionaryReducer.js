import {
  DICTIONARY_ON_VALUE
} from '../actions/types';

const initialState = {
  cz: {
    clear: 'vymazat',
    confirm: 'OK',
    cancel: 'zrušit',
    save: 'uložit',
    edit: 'upravit',
    new: 'nový',
    id: 'id',
    aspects: 'aspekty',
    skills: 'schopnosti',
    extras: 'extra',
    stunts: 'triky',
    characters: 'postavy',
    name: 'jméno',
    description: 'popis',
    refresh: 'obnovení',
    mainAspect: 'hlavní aspekt',
    trouble: 'trable',
    consequences: 'následky',

    // skills
    artillery: 'artilérie',
    athletics: 'atletika',
    connections: 'konexe',
    craft: 'řemeslo',
    deception: 'klamání',
    diplomacy: 'diplomacie',
    empathy: 'vcítění',
    fight: 'boj',
    investigate: 'vyšetřování',
    medicine: 'medicína',
    perception: 'všímavost',
    physique: 'fyzická zdatnost',
    piloting: 'pilotování',
    provoke: 'provokace',
    resources: 'zdroje',
    science: 'věda',
    shoot: 'střelba',
    stealth: 'kradmost',
    technology: 'technologie',
    thievery: 'zlodějství',
    will: 'vůle',

    // stress
    physicalStress: 'Fyzický stres',
    mentalStress: 'Psychický stres',

    // challenge levels
    average: 'průměrný',
    fair: 'slušný',
    good: 'dobrý',
    great: 'skvělý',
    superb: 'úžasný',

    // consequence levels
    mild: 'mírný',
    moderate: 'střední',
    severe: 'vážný'
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case DICTIONARY_ON_VALUE: {
      console.log("DICTIONARY_ON_VALUE");
      return state;
    }
  }
  return state;
};
