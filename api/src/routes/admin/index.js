const { AuthenticationError } = require('../../errors');
const { isAdmin, isNotAdmin } = require('../../permissions');
const { MasterQuestion, MasterChoice } = require('../../models');
const router = require('../createRouter')();
const { validator, masterQuestionValidator, masterChoiceValidator } = require('../../validators');
const config = require('../../config');

router.post('/login', {
  authorize: req => isNotAdmin(req.admin),
}, ({ body, session }) => {
  if (body.token !== config.adminToken)
    throw new AuthenticationError('invalid token');

  session.admin = true;
});

router.post('/logout', {
  authorize: req => isAdmin(req.admin),
}, ({ session }) => {
  session.admin = false;
});

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
