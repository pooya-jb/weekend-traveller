import 'dotenv/config';

import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';

import { router } from './router.js';
import { errorHandler } from './middleware/errorHandler.js';

const SERVER_URL: string = process.env.SERVER_URL;
const SERVER_PORT: number = process.env.SERVER_PORT;
const CLIENT_URL: string = process.env.CLIENT_URL;
const CLIENT_PORT: number = process.env.CLIENT_PORT;

const corsOptions: CorsOptions = {
  origin: `${CLIENT_URL}:${CLIENT_PORT}`,
  methods: ['GET', 'POST'], // we don't use more
};

const app: Application = express();

app
  .use(cors(corsOptions))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(router)
  .use(errorHandler)
  .listen(SERVER_PORT, SERVER_URL, () =>
    console.log(`Webserver on: ${SERVER_URL}:${SERVER_PORT}`)
  );
