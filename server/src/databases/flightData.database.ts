/**
 * @module
 * Connects to database and exports schemas for static resources.
 * Database is only used for storing resources which do not change often
 * and are updated once per day.
 * @version 1.0.0
 */

//  External dependencies
import { Options, DataTypes } from 'sequelize';
import { Sequelize, Model, Column, Table } from 'sequelize-typescript';

const dbInfo: Options = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_URL,
  port: process.env.DB_PORT,
  dialect: 'postgres',
};

const sequelize: Sequelize = new Sequelize(dbInfo);

@Table({ tableName: 'currencies' })
export class Currencies extends Model {
  @Column({ type: DataTypes.STRING })
  code!: string;
}

@Table({ tableName: 'airports' })
export class Airports extends Model {
  @Column({ type: DataTypes.STRING, primaryKey: true })
  override id!: string;
  @Column({ type: DataTypes.STRING })
  name!: string;
}

/**
 * Adds models to sequelize and syncronizes the model.
 * Must be initialized before webserver and Cron.
 */
export const initSequelize = async () => {
  sequelize.addModels([Currencies, Airports]);
  await sequelize.sync();
};
