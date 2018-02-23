// @flow

// $FlowFixMe
const API_URL: string = process.env.REACT_APP_API_URL;

class ApiError extends Error {
  method: string;
  route: string;
  requestBody: string;
  response: any;
  responseBody: any;

  constructor(method: string, route: string, requestBody: any, response: any, responseBody: any) {
    super([
      method, route, '->', response.status,
      responseBody.hasOwnProperty('detail') ? '(' + responseBody.detail + ')' : '',
    ].join(' '));

    this.method = method;
    this.route = route;
    this.responseBody = responseBody;
    this.response = response;
    this.requestBody = requestBody;
  }
}

function request(
  method: string,
  route: string,
  body?: any,
  expected?: number | Array<number> = 200,
): Promise<{ status: number, body: any }> {
  const expectedStatus = Array.isArray(expected) ? expected : [expected];

  const opts = {
    ...{ method },
    ...{ credentials: 'include' },
  };

  if (body) {
    opts.body = JSON.stringify(body);
    opts.headers = { 'Content-Type': 'application/json' };
  }

  let res?: any = null;

  return fetch(API_URL + route, opts)
    .then((r: any) => {
      res = r;

      const contentType = res.headers.get('content-type');

      if (contentType && contentType.includes('application/json'))
        return res.json();

      return res.text();
    })
    .then((responseBody: any) => {
      if (expectedStatus.indexOf(res.status) < 0)
        throw new ApiError(method, route, body, res, responseBody);

      return {
        status: res.status,
        body,
      };
    });
}

export default request;
