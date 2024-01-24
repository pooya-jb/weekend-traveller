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
    const result = await sequelize.query(
      `SELECT table_name FROM information_schema.tables WHERE table_name = 'currencies';`
    );
    expect(result.length).toBeGreaterThan(0);
  });

  it('checks that airports table exist', async (): Promise<void> => {
    const result = await sequelize.query(
      `SELECT table_name FROM information_schema.tables WHERE table_name = 'airports';`
    );
    expect(result.length).toBeGreaterThan(0);
  });

  it('checks currencies table has data', async (): Promise<void> => {
    const res = await request.get('/currencies');
    // const currencies = await Currencies.findAll();
    expect(res.text.length).toBeGreaterThan(150);
  });

  it('checks airports table has data', async (): Promise<void> => {
    const res = await request.get('/airports');
    // const airports = await Airports.findAll();
    expect(res.text.length).toBeGreaterThan(4000);
  });

  it('checks that it returns an airport', async (): Promise<void> => {
    const res = await request
      .post('/city-airport')
      .send({ cityName: 'Berlin' });
    console.log('😻', JSON.parse(res.text));
    const airport = JSON.parse(res.text).name;
    console.log(airport);
    expect(airport).toBe('Berlin Brandenburg (BER), Germany');
  });
  it('checks that it returns the cheapest flights', async (): Promise<void> => {
    try {
      const res = await request.post('/request-cheapest-flights').send({
        currencyCode: 'EUR',
        localeCode: 'en-US',
        marketCode: 'DE',
        originPlaceId: '95673383',
        lookAtWeeks: 4,
        travelDate: 1706119305527,
      });
      console.log(res);
    } catch (error) {
      console.log('😿', error);
    }
  });
});
