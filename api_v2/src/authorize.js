const authorize = (req, obj) => {
  if (typeof obj === 'function')
    return authorize_function(req, obj);

  if (obj instanceof Array)
    return authorize_array(req, obj);

  throw new Error('invalid authorizer ' + typeof authorizer);
}

const authorize_function = (req, f) => {
  return Promise.resolve(f(req));
};

const authorize_array = (req, arr) => {
  return Promise.mapSeries(arr, a => authorize(req, a));
};

module.exports = authorizer => (req, res, next) => {
  return authorize(req, authorizer)
    .then(() => next())
    .catch(next);
};
