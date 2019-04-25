import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import middlewares from './middlewares';
import api from './api';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());

app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
