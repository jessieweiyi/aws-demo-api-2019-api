import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import middlewares from './middlewares';
import api from './api';
import Logger from './utils/logger';

const app = express();

app.use(morgan('dev'));
app.use(helmet());

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const rawBodyParserOptions = {
  inflate: false,
  type: 'image/*',
  limit: '1mb'
};

app.use(bodyParser.raw(rawBodyParserOptions));

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

console.log('Environment', process.env);

module.exports = app;
