const fetch = require('isomorphic-fetch');

fetch('http://192.168.0.18:8000/api/player', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nick: 'nils',
  }),
})
  .then(r => {
    console.log(r);
    return r.json();
  })
  .then(json => {
    console.log(json);
  })
  .catch(e => {
    console.error('ERROR: ', e);
  });
