import keijiban from './src/ac-keijiban.js';
/**
 * @global { import("@logseq/libs/dist/LSPlugin.js").ILSPluginUser } logseq
 * @typedef { import("./src/ac-keijiban.js").default } KeijibanBuilder
 * @typedef { ReturnType<KeijibanBuilder> } Keijiban
 * @typedef { {header: string, msg: string} } Post
 */
const languages = ['en', 'fr'];
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
    key: 'fontSize',
    type: 'number',
    default: 32,
    title: 'Font Size',
  },
];

/** @param {string} uuid */
const getJournalDay = async (uuid) => {
  const block = await logseq.Editor.getBlock(uuid, { includeChildren: false });
  if (block?.page) {
    const page = await logseq.Editor.getPage(block.page.id, {
      includeChildren: false,
    });
    if (page?.journalDay) {
      return page.journalDay;
    }
  }
  return undefined;
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
  console.log(journalDay);
  const date = dateFromJournalDay(journalDay);
  if (date.getDay() === 1) {
    return {
      header: ac.messageOfTheWeek.header,
      msg: ac.messageOfTheWeek.all[journalDay % ac.messageOfTheWeek.count],
    };
  }

  const index = journalDay % (ac.poetry.count + ac.talkingToMyself.count);
  if (index < ac.poetry.count) {
    return {
      header: ac.poetry.header,
      msg: ac.poetry.all[index],
    };
  }
  return {
    header: ac.talkingToMyself.header,
    msg: ac.talkingToMyself.all[index - ac.poetry.count],
  };
};

/**
 * @param {string} uuid
 * @returns {Promise<boolean>}
 */
const inTemplate = async (uuid) => {
  const block = await logseq.Editor.getBlock(uuid, { includeChildren: false });
  if (!!block?.properties?.template) {
    return true;
  }
  if (block?.parent) {
    return await inTemplate(block.parent.id);
  }
  return false;
};

const styles = (fontSize) =>
  logseq.provideStyle({
    key: 'ac-keijiban-styling',
    style: `
@import url('https://rawcdn.githack.com/matteron/logseq-ac-keijiban/4381b1dbd689a94ebacec9181624d84094ecc6f4/assets/fonts/acww.css');
.post {
  display: flex;
  flex-direction: column;
  font-size: ${fontSize}px;
  line-height: 1;
}
.header {
  align-self: center;
}
.break {
  height: ${fontSize * 2.5}px
}
  `,
  });

const main = async () => {
  let ac = keijiban(logseq.settings.lang);
  styles(logseq.settings.fontSize);

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    const type = payload.arguments[0];
    if (type !== ':ac-keijiban') {
      return;
    }
    if (await inTemplate(payload.uuid)) {
      logseq.provideUI({
        key: key + '_' + slot,
        slot,
        reset: true,
        template: '<div class="post ac-font">Will be Rendered %</div>',
      });
      return;
    }
    const journalDay = await getJournalDay(payload.uuid);
    if (!journalDay) {
      logseq.provideUI({
        key: key + '_' + slot,
        slot,
        reset: true,
        template:
          '<div class="post ac-font">Could not find Journal Day #</div>',
      });
      return;
    }
    const post = getPost(ac, journalDay);
    const header = `<span class="header">${post.header}</span>`;
    const body = `<span>${post.msg}</span>`;
    const template = `<div class="post ac-font">${header}<br class="break"/>${body}</div>`;
    logseq.provideUI({
      key: key + '_' + slot,
      slot,
      reset: true,
      template,
    });
  });

  logseq.onSettingsChanged((updated) => {
    ac = keijiban(updated.lang);
    styles(updated.fontSize);
  });

  console.info('ac-keijiban loaded');
};

logseq.useSettingsSchema(settings).ready(main);
