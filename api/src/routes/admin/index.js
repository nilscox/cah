const { MissingFieldError } = require('../../errors');
const { isAdmin } = require('../../permissions');
const { MasterQuestion, MasterChoice } = require('../../models');
const router = require('../createRouter')();

router.post('/feed', {
  authorize: isAdmin,
  validate: req => {
    const { questions, choices } = req.body;

    if (!questions)
      throw new MissingFieldError('questions');

    if (!choices)
      throw new MissingFieldError('choices');

    return { questions, choices };
  },
}, async ({ validated }) => {
  const { questions, choices } = validated;

  await MasterQuestion.bulkCreate(questions);
  await MasterChoice.bulkCreate(choices);
});

module.exports = router.router;
