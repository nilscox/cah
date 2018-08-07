
module.exports = authorizer => (req, res, next) => {
  return authorize(req, authorizer)
    .then(() => next())
    .catch(next);
};
