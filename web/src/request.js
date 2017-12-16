const request = (method, route, body) => {
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
      .then(r => res = r)
      .then(() => res.json())
      .then(body => {
        if (!res.status.toString().startsWith('2'))
          throw new Error([method, route, '->', res.status, '(' + body.detail + ')'].join(' '));

        return body;
      });
};

export default request;
