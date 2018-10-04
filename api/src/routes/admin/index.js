const { isAdmin } = require('../../permissions');
const { MasterQuestion, MasterChoice } = require('../../models');
const router = require('../createRouter')();
const { validator, masterQuestionValidator, masterChoiceValidator } = require('../../validators');

router.post('/feed', {
  authorize: req => isAdmin(req.admin),
  validate: validator({
    questions: data => masterQuestionValidator.validate(data, { many: true }),
    choices: data => masterChoiceValidator.validate(data, { many: true }),
  }).body(),
}, async ({ validated }) => {
  const { questions, choices } = validated;

  await MasterQuestion.bulkCreate(questions);
  await MasterChoice.bulkCreate(choices);
});

module.exports = router.router;
