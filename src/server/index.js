import express from 'express';
import routes from '../routes/index.js';
import ErrorHandler from '../middlewares/error.js';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use('/uploads/covers', express.static(path.join(__dirname, '../../public/uploads/covers')));
app.use(routes);
app.use(ErrorHandler);

app.get('/', (req, res) => {
  res.send({ message: 'OpenMusic API is running!' });
});

export default app;