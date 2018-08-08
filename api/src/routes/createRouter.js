const express = require('express');
const { AuthenticationError } = require('../errors');

const authorizeRequest = async (req, authorize) => {
  if (!authorize)
    return;

  const authorize_function = (req, f) => Promise.resolve(f(req));
  const authorize_and = (req, arr) => Promise.mapSeries(arr, a => authorizeRequest(req, a));
  const authorize_or = async (req, arr) => {
    let error = null;

    for (let i = 0; i < arr.length; ++i) {
      try {
        return await authorizeRequest(req, arr[i]);
      } catch (e) {
        if (!(e instanceof AuthenticationError))
          throw e;

        error = e;
      }
    }

    if (error)
      throw error;
  };

  const authorize_object = (req, obj) => {
    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; ++i) {
      const op = keys[i];

      switch (op) {
      case 'or':
        return authorize_or(req, obj[op]);

      case 'and':
        return authorize_and(req, obj[op]);

      default:
        throw new Error('invalid operator ' + op);
      }
    }
  };

  if (typeof authorize === 'function')
    await authorize_function(req, authorize);
  else if (authorize instanceof Array)
    await authorize_and(req, authorize);
  else if (typeof authorize === 'object')
    await authorize_object(req, authorize);
  else
    throw new Error('invalid authorizer ' + typeof authorize);
}

const handleRoute = (authorize, validate, format, handler) => async (req, res, next) => {
  try {
    await authorizeRequest(req, authorize);

    const data = await validate(req);
    const result = await handler(req, res, data);

    if (result)
      res.json(await format(result));
    else
      res.status(204).end();
  } catch (e) {
    next(e);
  }
};

/**
 * Create a router supporting authorization, validation and formatting
 *
 * @returns the new router object
 *
 * router.router: access the underlying express router
 * router.METHOD(route, opts, handler): define a route
 * router.[all,param,route,use]: bounded to the express router
 *
 * router.METHOD params:
 *
 * @param route (string): the route
 * @param opts (object): an options object
 * @param opts.authorize (function | function[]): an authorizer function
 * @param opts.validate (function): a validator function
 * @param opts.format (function): a formatter function
 * @param handler (function): the express handler
 *
 * authorizer function: req => any | Promise<any>
 * validator function: data => object | Promise<object>
 * format function: instance => object | Promise<object>
 *
 * If one of theses functions throws an error or returns a promise that
 * rejects, the router will call next with the error
 */
module.exports = () => {
  const router = express.Router();

  return ['head', 'get', 'post', 'put', 'patch', 'delete'].reduce((obj, method) => {
    obj[method] = (route, opts = {}, handler) => {

      router[method](route, handleRoute(
        opts.authorize || [],
        opts.validate || (() => {}),
        opts.format || null,
        handler,
      ));
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
