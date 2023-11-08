import data from './data.js';

const regex = new RegExp('^[a-z]{2}(-[A-Z]{2})?$'); // xx-YY

/** @param {keyof data} language */
export default (language) => {
  // Language format verification
  if (regex.test(language)) {
    // Language format (xx-YY) verification
    language = language.substring(0, 2);
  }
  language ??= 'en';

  const messageOfTheWeekData = data[language].messageOfTheWeekData;
  const poetryData = data[language].poetryData;
  const talkingToMyselfData = data[language].talkingToMyselfData;

  // Modules
  return {
    messageOfTheWeek: {
      all: messageOfTheWeekData,
      count: messageOfTheWeekData.length,
      random: () => {
        return randomMessage(messageOfTheWeekData);
      },
    },
    poetry: {
      all: poetryData,
      count: poetryData.length,
      random: () => {
        return randomMessage(poetryData);
      },
    },
    talkingToMyself: {
      all: talkingToMyselfData,
      count: talkingToMyselfData.length,
      random: () => {
        return randomMessage(talkingToMyselfData);
      },
    },
    all: messageOfTheWeekData.concat(poetryData.concat(talkingToMyselfData)),
    count:
      messageOfTheWeekData.length +
      poetryData.length +
      talkingToMyselfData.length,
    random: () => {
      return randomMessage(
        messageOfTheWeekData.concat(poetryData.concat(talkingToMyselfData)),
      );
    },
  };
};

/** @param {string[]} array */
const randomMessage = (array) => {
  const message = array[Math.floor(Math.random() * array.length)];
  if (message === undefined || message === null) {
    return -1;
  }
  return message;
};
