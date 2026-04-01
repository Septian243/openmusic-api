import server from './server/index.js';
import RabbitMQService from './utils/rabbitmq.js';
import 'dotenv/config';

const host = process.env.HOST;
const port = process.env.PORT;

RabbitMQService.connect().catch(console.error);

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await RabbitMQService.close();
  process.exit(0);
});