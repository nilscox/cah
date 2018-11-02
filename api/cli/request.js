const fs = require('fs-extra');
const args = require('node-args');
const request = require('request-promise');
const tough = require('tough-cookie');
const { CLIRequestError } = require('./error');

const getEnv = (key, defaultValue) => {
  let value = process.env[key];

  if (!value)
    value = defaultValue;

  if (!value) {
    console.log(key + ' env is not set');
    process.exit(1);
  }

  return value;
};

const COOKIES_FILE = getEnv('CAH_COOKIES_FILE', '/tmp/cah-cookies.json');
const SESSION = getEnv('CAH_SESSION');
const API_URL = getEnv('CAH_API_URL');

if (!fs.existsSync(COOKIES_FILE))
  fs.writeFileSync(COOKIES_FILE, '{}');

module.exports = (route, opts = {}) => {
  const cookieJar = request.jar();

  const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE));
  const session = cookies[SESSION];

  if (session)
    cookieJar._jar = tough.CookieJar.deserializeSync(session);

  if (!opts.headers)
    opts.headers = {};

  if (opts.body) {
    if (typeof opts.body === 'object') {
      opts.body = JSON.stringify(opts.body);
      opts.headers['Content-Type'] = 'application/json';
    }
  }

  return request({
    uri: API_URL + route,
    jar: cookieJar,
    simple: false,
    resolveWithFullResponse: true,
    ...opts,
  }).promise()
    .then(r => {
      cookies[SESSION] = cookieJar._jar.serializeSync();
      fs.writeFileSync(COOKIES_FILE, JSON.stringify(cookies, 2, 2));

      const ct = r.headers['content-type'];
      let body = null;

      if (ct && ct.startsWith('application/json'))
        body = JSON.parse(r.body);
      else if (ct && ct.startsWith('text/'))
        body = r.body;

      if (args.request)
        console.log(opts.method || 'GET', route, '->', r.statusCode, JSON.stringify(body, 2, 2));

      if (opts.expect && opts.expect.indexOf(r.statusCode) < 0)
        throw new CLIRequestError(opts.method || 'GET', route, r.statusCode, body);

      return { status: r.statusCode, body };
    });
};
