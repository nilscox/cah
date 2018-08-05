global.Promise = require('bluebird');

const fs = require('fs-extra');
const path = require('path');

const DATA_PATH = process.env.CAH_DATA_PATH;
const now = new Date();

const getObjs = async filename => {
  const objs = [];
  const langs = await fs.readdir(DATA_PATH);

  for (let i = 0; i < langs.length; ++i) {
    const values = require(path.join(DATA_PATH, langs[i], filename));

    values.forEach(value => objs.push({
      ...value,
      lang: langs[i],
      createdAt: now,
      updatedAt: now,
    }));
  }

  return objs;
};

const getQuestions = () => getObjs('questions.json');
const getChoices = async () => (await getObjs('choices.json'))
  .map(c => ({ ...c, keepCapitalization: c.keepCapitalization || false }));

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.resolve()
      .then(() => getQuestions())
      .then(questions => queryInterface.bulkInsert('master_question', questions))
      .then(() => getChoices())
      .then(choices => queryInterface.bulkInsert('master_choice', choices));
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve()
      .then(() => queryInterface.bulkDelete('master_question', null))
      .then(() => queryInterface.bulkDelete('master_choice', null));
  }
};
