import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Organization } from './src/modules/organizations/entities/organization.entity';
import { User } from './src/modules/users/entities/user.entity';
import { Order } from './src/modules/orders/entities/order.entity';

const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [Organization, User, Order],
    migrations: ['src/database/migrations/*.{ts,js}'],
    synchronize: false,
    logging: true,
});

export default dataSource;
