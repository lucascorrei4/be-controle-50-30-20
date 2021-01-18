import 'reflect-metadata';

import compression from 'compression';
import cors from 'cors';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import express, { Express } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import nconf from 'nconf';
import webPush from 'web-push';

import createConnectionPostgres from '@database/index';
import jobEmail from '@jobs/index';
import jobSequenciaEmail from '@jobs/sequencia-emails';
import routes from '@routes/index';

import config from './config';

function loadEnv(): void {
  let envPath = './src/environment/environment';
  envPath += process.env.NODE_ENV === 'prod' ? '.prod.json' : '.json';

  nconf.argv().env().file(envPath);
}

function app(): Express {
  loadEnv();
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('America/Sao_Paulo');

  const server = express();

  server.use(express.json({ limit: '50mb' }));
  server.use(compression());
  server.use(helmet());
  server.use(morgan('tiny'));
  server.use(
    cors({
      origin: '*',
      exposedHeaders: ['x-total-count']
    })
  );

  mongoose.connect(nconf.get('mongodb'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  createConnectionPostgres();

  webPush.setVapidDetails(
    'mailto:contato@ebarn.com.br',
    config.pushNotificationKeys.publicKey,
    config.pushNotificationKeys.privateKey
  );

  //jobSequenciaEmail.start();
  if (nconf.get('production')) {
    //jobEmail.start();
    //jobSequenciaEmail.start();
  }

  server.use('/api', routes);
  server.use('/uploads', express.static('uploads'));

  return server;
}

const port = process.env.PORT || 3030;
const server = app();
server.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});

//server.listen('3000','192.168.0.115', () => {
//  console.info(`server started on port 80)`);
//});
