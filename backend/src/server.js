import './config/env.js';
import express from 'express';
import cors from 'cors';
import { clerk, protegido } from './middlewares/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import photosRouter from './routes/photos.js';
import analysisRouter from './routes/analysis.js';
import usersRouter from './routes/users.js';
import { env } from './config/env.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(clerk);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/users', protegido, usersRouter);
app.use('/api/photos', protegido, photosRouter);
app.use('/api/analysis', protegido, analysisRouter);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`[Server] RetratofitIA backend rodando na porta ${env.port}`);
});
