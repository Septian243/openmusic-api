import server from './server/index.js';

const host = process.env.HOST;
const port = process.env.PORT;

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});