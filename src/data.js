import msgEn from './data/en/messageOfTheWeekData.js';
import poetEn from './data/en/poetryData.js';
import talkEn from './data/en/talkingToMyselfData.js';

import msgFr from './data/fr/messageOfTheWeekData.js';
import poetFr from './data/fr/poetryData.js';
import talkFr from './data/fr/talkingToMyselfData.js';

export default {
  en: {
    messageOfTheWeekData: msgEn,
    messageOfTheWeekHeader: '*Message of the Week*',
    poetryData: poetEn,
    poetryHeader: '-Poetry-',
    talkingToMyselfData: talkEn,
    talkingToMyselfHeader: '-Talking to Myself-',
  },
  fr: {
    messageOfTheWeekData: msgFr,
    messageOfTheWeekHeader: '*Message de la semaine*',
    poetryData: poetFr,
    poetryHeader: '-Poème-',
    talkingToMyselfData: talkFr,
    talkingToMyselfHeader: '-Réflexions-',
  },
};
