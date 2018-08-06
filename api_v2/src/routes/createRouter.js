const express = require('express');
const authorize = require('../authorize');

const formatResult = async (result, formatter) => {
  if (!formatter)
    return result;

  const opts = {
    many: result instanceof Array,
  };

  return await formatter(result, opts);
};

const handleRoute = (handler, validator, formatter) => async (req, res, next) => {
  try {
    const data = await validator(req);
    const result = await handler(req, res, data);

    if (result)
      res.json(await formatResult(result, formatter));
    else
      res.status(204).end();
  } catch (e) {
    next(e);
  }
};

module.exports = () => {
  const router = express.Router();

  return ['head', 'get', 'post', 'put', 'patch', 'delete'].reduce((obj, method) => {
    obj[method] = (route, opts = {}, handler) => {
      const validator = opts.validator || (() => {});
      const formatter = opts.formatter || null;
      const authorizer = opts.authorize || [];

      router[method](route, authorize(authorizer), handleRoute(handler, validator, formatter));
    };

    return obj;
  }, {
    router,
    all: router.all.bind(router),
    param: router.param.bind(router),
    route: router.route.bind(router),
    use: router.use.bind(router),
  });
};
