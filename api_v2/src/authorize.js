const isAuthorizer = obj => {
  return typeof obj === 'function' || obj instanceof Array;
};

const normalizePermissions = (permissions) => {
  return Object.keys(permissions).reduce((fullPerms, path) => {
    if (isAuthorizer(permissions[path]))
      fullPerms[path] = permissions[path];
    else {
      const perms = normalizePermissions(permissions[path]);

      Object.keys(perms).forEach(route => {
        if (isAuthorizer(perms[route]))
          fullPerms[path] = { ...fullPerms[path], [route]: perms[route] };
        else
          fullPerms[path + route] = perms[route];
      });
    }

    return fullPerms;
  }, {});
};

module.exports = permissions => (req, res, next) => {
  permissions = normalizePermissions(permissions);

  const route = Object.keys(permissions)
    .map(path => ({
      path,
      subs: (path.match(/:[^\/]*/g) || []).length,
      regexp: new RegExp('^' + path.replace(/:[^\/]*/g, '([^/]*)') + '$'),
    }))
    .map(({ path, subs, regexp }) => ({ path, subs, match: regexp.exec(req.url) }))
    .filter(({ match }) => !!match)
    .sort(({ subs: a }, { subs: b }) => a > b)[0];

  if (!route)
    return next();

  const { path, match } = route;
  const params = path.split('/')
    .filter(part => part.startsWith(':'))
    .map(part => part.slice(1))
    .reduce((params, param, n) => {
      params[param] = match[n + 1];
      return params;
    }, {});

  const authorizer = permissions[path][req.method];
  const authorize = f => f(req, params);

  if (!isAuthorizer(authorizer))
    return next();

  const promise = authorizer instanceof Array
    ? Promise.all(authorizer.map(authorize))
    : Promise.resolve(authorize(authorizer));

  return promise
    .then(() => next())
    .catch(next);
};
