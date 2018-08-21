const API_URL = process.env.REACT_APP_API_URL;


export default async (route, opts = {}) => {
  if (!(opts.headers instanceof Headers))
    opts.headers = new Headers(opts.headers);

  if (opts.body && typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
    opts.headers.set('Content-Type', 'application/json');
  }

  opts.credentials = 'include';

  const result = await request(route, opts);
  const { res, text, json } = result;

  console.log('[REQUEST]', route, '(' + res.status + ')', json || text || null);

  return result;
};

const request = async (route, opts = {}) => {
  try {
    const res = await fetch(API_URL + route, opts);
    const contentType = res.headers.get('Content-Type');

    if (!contentType)
      return { res };

    if (contentType.match(/^application\/json/))
      return { res, json: await res.json() };

    if (contentType.match(/^text\//))
      return { res, text: await res.text() };

    return { res };
  } catch (e) {
    if (e instanceof Error && e.message === 'Network request failed')
      ; // check api status

    throw e;
  }
};
