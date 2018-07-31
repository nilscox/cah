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

  const authorize = permissions[path][req.method];

  if (!isAuthorizer(authorize))
    return next();

  const promise = authorize instanceof Array
    ? Promise.all(authorize.map(f => f(req, params)))
    : Promise.resolve(authorize(req, params));

  return promise
    .then(() => next())
    .catch(next);
};
