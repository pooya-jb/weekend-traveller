import {
  Sequelize,
  Options,
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
} from 'sequelize';

const dbInfo: Options = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_URL,
  port: process.env.DB_PORT,
  dialect: 'postgres',
};

const sequelize: Sequelize = new Sequelize(dbInfo);

export class Currencies extends Model<
  InferAttributes<Currencies>,
  InferCreationAttributes<Currencies>
> {
  declare code: string;
}

export class Airports extends Model<
  InferAttributes<Airports>,
  InferCreationAttributes<Airports>
> {
  declare id: string;
  declare name: string;
}

Currencies.init(
  { code: DataTypes.STRING },
  { tableName: 'currencies', sequelize }
);

Airports.init(
  { id: { type: DataTypes.STRING, primaryKey: true }, name: DataTypes.STRING },
  { tableName: 'airports', sequelize }
);

export const initSequelize = async () => {
  await sequelize.sync();
};
