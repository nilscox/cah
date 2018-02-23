// @flow

// $FlowFixMe
const API_URL: string = process.env.REACT_APP_API_URL;

function request(
  method: string,
  route: string,
  body?: any,
  expected?: number | Array<number> = 200,
): Promise<{ status: number, body: any }> {
  const expectedStatus = Array.isArray(expected) ? expected : [expected];

  const opts = {
    method,
    credentials: 'include',
  };

  if (body) {
    opts.body = JSON.stringify(body);
    opts.headers = { 'Content-Type': 'application/json' };
  }

  let res?: any = null;

  return fetch(API_URL + route, opts)
    .then(r => {
      res = r;

      const contentType = res.headers.get('content-type');

      if (contentType && contentType.includes('application/json'))
        return res.json();

      return res.text();
    })
    .then(body => {
      if (expectedStatus.indexOf(res.status) < 0) {
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
