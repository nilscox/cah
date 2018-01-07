function request(method, route, body, expected=200) {
  if (Number.isInteger(expected))
    expected = [expected];

  const opts = {
    method,
    credentials: 'include',
  };

  if (body) {
    opts.body = JSON.stringify(body);
    opts.headers = { 'Content-Type': 'application/json' };
  }

  let res = null;

  return fetch('http://localhost:8000' + route, opts)
    .then(r => {
      res = r;

      const contentType = res.headers.get('content-type');

      if (contentType && contentType.includes('application/json'))
        return res.json();

      return res.text();
    })
    .then(body => {
      if (expected.indexOf(res.status) < 0) {
        const detail = body.hasOwnProperty('detail') ? '(' + body.detail + ')' : '';
        const err = new Error([method, route, '->', res.status, detail].join(' '));

        err.res = res;
        err.body = body;

        throw err;
      }

      return {
        status: res.status,
        body,
      };
    });
}

export default request;
