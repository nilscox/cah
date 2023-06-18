import express from 'express';

main();

function main() {
  const app = express();

  app.listen(3000, 'localhost', () => {
    console.log('server started on port 3000');
  });
}
