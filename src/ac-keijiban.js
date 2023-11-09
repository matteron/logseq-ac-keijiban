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

  // Modules
  return {
    messageOfTheWeek: {
      all: data[language].messageOfTheWeekData,
      count: data[language].messageOfTheWeekData.length,
      random: () => {
        return randomMessage(data[language].messageOfTheWeekData);
      },
      header: data[language].messageOfTheWeekHeader,
    },
    poetry: {
      all: data[language].poetryData,
      count: data[language].poetryData.length,
      random: () => {
        return randomMessage(data[language].poetryData);
      },
      header: data[language].poetryHeader,
    },
    talkingToMyself: {
      all: data[language].talkingToMyselfData,
      count: data[language].talkingToMyselfData.length,
      random: () => {
        return randomMessage(data[language].talkingToMyselfData);
      },
      header: data[language].talkingToMyselfHeader,
    },
    all: data[language].messageOfTheWeekData.concat(
      data[language].poetryData.concat(data[language].talkingToMyselfData),
    ),
    count:
      data[language].messageOfTheWeekData.length +
      data[language].poetryData.length +
      data[language].talkingToMyselfData.length,
    random: () => {
      return randomMessage(
        data[language].messageOfTheWeekData.concat(
          data[language].poetryData.concat(data[language].talkingToMyselfData),
        ),
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
