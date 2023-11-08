import keijiban from './src/ac-keijiban.js';
/**
 * @typedef { import("./src/ac-keijiban.js").default } KeijibanBuilder
 * @typedef { ReturnType<KeijibanBuilder> } Keijiban
 * @typedef { {header: string, msg: string} } Post
 */

const languages = ['en', 'fr'];
const sets = ['Message of the Week', 'Poetry', 'Talking to Myself'];
const key = 'ac-keijiban';

const settings = [
  {
    key: 'lang',
    type: 'enum',
    enumChoices: languages,
    enumPicker: 'radio',
    default: languages[0],
    title: 'Language Selection',
    description:
      'Select the language to display in.  French not complete.  See `https://github.com/helmasaur/ac-keijiban#translation`',
  },
  {
    key: 'sets',
    type: 'enum',
    enumChoices: sets,
    enumPicker: 'checkbox',
    default: sets,
    title: 'Override sets',
  },
];

/**
 * @param {string} s
 */
const withSettings = (s) => {
  return keijiban(s.lang);
};

/**
 * @param {number} journalDay
 */
const dateFromJournalDay = (journalDay) => {
  const str = journalDay + '';
  const year = str.substring(0, 4);
  const month = str.substring(4, 6);
  const day = str.substring(6, 8);
  return new Date(year, month - 1, day);
};

/**
 * @param {Keijiban} ac
 * @param {number} journalDay
 * @returns {Post}
 */
const getPost = (ac, journalDay) => {
  const date = dateFromJournalDay(journalDay);
  if (date.getDay() === 1) {
    return {
      header: '*Message of the Week*',
      msg: ac.messageOfTheWeek.all[journalDay % ac.messageOfTheWeek.count],
    };
  }

  const index = journalDay % (ac.poetry.count + ac.talkingToMyself.count);
  if (index < ac.poetry.count) {
    return {
      header: '-Poetry-',
      msg: ac.poetry.all[index],
    };
  }
  return {
    header: '-Talking to Myself-',
    msg: ac.talkingToMyself.all[index - ac.poetry.count],
  };
};

const main = async () => {
  let ac = withSettings(logseq.settings);
  console.info('ac-keijiban loaded');

  logseq.provideStyle({
    key: 'ac-keijiban',
    style: `
@font-face {
    font-family: 'ACWW';
    font-style: normal;
    /* font-weight: 400; */
    src: url('https://raw.githubusercontent.com/matteron/logseq-ac-keijiban/main/assets/fonts/acww.ttf') format('ttf');
}
.ac-font {
  font-family: "ACWW" !important;
  // font-weight: ${settings.main_font_weight} !important;
  // font-size: ${settings.main_font_size} !important;
  // color: ${settings.main_color} !important;
}
.post {
  display: flex;
  flex-direction: column;
}
.header {
  align-self: center;
}
    `,
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    const type = payload.arguments[0];
    if (type !== ':ac-keijiban') {
      return;
    }
    const block = await logseq.Editor.getBlock(payload.uuid);
    const post = getPost(ac, block.journalDay);
    const header = `<span class="header">${post.header}</span>`;
    const body = `<span>${post.msg}</span>`;
    const template = `<div class="post">${header}<br/>${body}</div>`;
    logseq.provideUI({
      key,
      slot,
      replace: true,
      template,
    });
  });

  logseq.onSettingsChanged((updated) => {
    ac = withSettings(updated);
  });
};

logseq.useSettingsSchema(settings).ready(main);
