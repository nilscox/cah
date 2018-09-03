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
};

const validateRequest = (req, validate) => {
  if (typeof validate === 'function')
    validate = [validate];

  return Promise.reduce(validate, async (validated, f) => ({
    ...validated,
    ...(await f(req)),
  }), {});
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
 * @param opts.before: hook invoked before the request is processed
 * @param opts.after: hook invoked after the request has been processed successfully
 * @param opts.middlewares: custom express middlewares
 * @param opts.authorize (function | function[]): an authorizer function
 * @param opts.validate (function): a validator function
 * @param opts.format (function): a formatter function
 * @param handler (function): the express handler
 *
 * before function: req => any
 * after function: (req, result) => any
 * middlewares Array<function>
 * authorizer function: req => any | Promise<any>
 * validator function: data => object | Promise<object>
 * format function: instance => object | Promise<object>
 *
 * If one of theses functions throws an error or returns a promise that
 * rejects, the router will call next with the error
 */
module.exports = () => {
  const expressRouter = express.Router();

  const handle = (method, route, opts, handler) => {
    const { before, after, middlewares, authorize, validate, format } = opts;

    expressRouter[method](route, middlewares || [], async (req, res, next) => {
      try {
        if (before)
          await before(req);

        if (authorize)
          await authorizeRequest(req, authorize);

        req.validated = validate
          ? await validateRequest(req, validate)
          : null;

        const result = await handler(req, res, req.params);

        if (result) {
          if (format)
            res.json(await format(req, result));
          else
            res.json(result);
        } else {
          res.status(204).end();
        }

        if (after)
          after(req, result);
      } catch (e) {
        next(e);
      }
    });
  };

  return {
    head: handle.bind(null, 'head'),
    get: handle.bind(null, 'get'),
    post: handle.bind(null, 'post'),
    put: handle.bind(null, 'put'),
    patch: handle.bind(null, 'patch'),
    delete: handle.bind(null, 'delete'),
    all: expressRouter.all.bind(expressRouter),
    param: expressRouter.param.bind(expressRouter),
    route: expressRouter.route.bind(expressRouter),
    use: expressRouter.use.bind(expressRouter),
    router: expressRouter,
  };
};
