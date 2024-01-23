import express from 'express';
import { router } from '../router';
import supertest from 'supertest';
// import * as fD from '../models/flightData.model.js';

import { Options } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Currencies } from '../databases/flightData.database';

describe('Integration tests', () => {
  // app.use(router);
  const app = express();
  app.use(express.json()).use(router);
  const request = supertest(app);

  let sequelize: Sequelize;
  let dbInfo: Options;

  beforeAll(async () => {
    dbInfo = {
      database: 'weekend_traveller',
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_URL,
      port: process.env.DB_PORT,
      dialect: 'postgres',
    };

    sequelize = new Sequelize(dbInfo);

    const initSequelize = async () => {
      await sequelize.sync();
    };

    initSequelize();
  });

  it('checks that currency table exist', async (): Promise<void> => {
    try {
      const result = await sequelize.query(
        `SELECT table_name FROM information_schema.tables WHERE table_name = 'currencies';`
      );
      expect(result.length).toBeGreaterThan(0);
    } catch (error) {
      console.error('Error checking table existence:', error);
      throw error;
    }
  });

  it('checks that airports table exist', async (): Promise<void> => {
    try {
      const result = await sequelize.query(
        `SELECT table_name FROM information_schema.tables WHERE table_name = 'airports';`
      );
      expect(result.length).toBeGreaterThan(0);
    } catch (error) {
      console.error('Error checking table existence:', error);
      throw error;
    }
  });

  it('checks currencies table has data', async (): Promise<void> => {
    try {
      const res = await request.get('/currencies');
      const currencies = await Currencies.findAll();
      expect(res).toBe(currencies);
    } catch (error) {
      console.error(error);
    }
  });
});
