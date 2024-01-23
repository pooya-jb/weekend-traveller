import express from 'express';
// import { router } from '../router.js';
import supertest from 'supertest';
import * as fD from '../models/flightData.model.js';

import { Options, DataTypes } from 'sequelize';
import { Sequelize, Model, Column, Table } from 'sequelize-typescript';


describe('Integration tests', () => {
  const app = express();
  app.use(express.json());
  // app.use(router);
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
    }

    initSequelize();
  });

  it('checks that currency table exist', async (): Promise<void> =>{
    try {
      const result = await sequelize.query(
        `SELECT table_name FROM information_schema.tables WHERE table_name = 'currencies';`,
      );
      expect(result.length).toBeGreaterThan(0)
    } catch (error) {
      console.error('Error checking table existence:', error);
      throw error;
    }
  });

  it('checks that airports table exist', async (): Promise<void> =>{
    try {
      const result = await sequelize.query(
        `SELECT table_name FROM information_schema.tables WHERE table_name = 'airports';`,
      );
      expect(result.length).toBeGreaterThan(0)
    } catch (error) {
      console.error('Error checking table existence:', error);
      throw error;
    }
  });
});