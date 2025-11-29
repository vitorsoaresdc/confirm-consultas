import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';

const app: Application = express();

app.use(cors({ origin: [/^http:\/\/localhost:\d+$/], credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/', routes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Rota não encontrada' });
});

export default app;
