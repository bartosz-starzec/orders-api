import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/entities/user.entity';
import { Organization } from './src/entities/organization.entity';
import { Order } from './src/entities/order.entity';

dotenv.config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'servernode',
  entities: [User, Organization, Order],
  migrations: ['src/migrations/*.ts'],
});
