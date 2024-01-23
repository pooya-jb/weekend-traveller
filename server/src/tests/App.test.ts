import express from 'express';
import { router } from '../router';
import supertest from 'supertest';
// import * as fD from '../models/flightData.model.js';

import { Options } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Airports, Currencies } from '../databases/flightData.database';

describe('Integration tests', () => {
  const app = express();
  app.use(express.json());
  app.use(router);
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
      sequelize.addModels([Currencies, Airports]);
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
      // const currencies = await Currencies.findAll();
      expect(res.text.length).toBeGreaterThan(150);
    } catch (error) {
      console.error(error);
    }
  });

  it('checks airports table has data', async (): Promise<void> => {
    try {
      const res = await request.get('/airports');
      // const airports = await Airports.findAll();
      expect(res.text.length).toBeGreaterThan(4000);
    } catch (error) {
      console.error(error);
    }
  });

  // it ('checks that it returns an airport', async (): Promise<void> => {
  //   try {
  //     const res = await request.post('/city-airport')
  //     .send({cityName: 'Berlin'});
  //     console.log('res', res)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // })
});
