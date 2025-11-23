import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import { Organization } from '../../modules/organizations/entities/organization.entity';
import { User } from '../../modules/users/entities/user.entity';
import { Order } from '../../modules/orders/entities/order.entity';

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '3306'),
    username: process.env.DB_USER ?? process.env.DB_USERNAME,
    password: process.env.DB_PASS ?? process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? process.env.DB_DATABASE,
    entities: [Organization, User, Order],
    synchronize: false,
});

function randomDateInPast() {
    const now = new Date();
    const past = new Date(now.getFullYear() - 1, 0, 1);
    return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

async function seed() {
    await AppDataSource.initialize();

    const orgRepo = AppDataSource.getRepository(Organization);
    const userRepo = AppDataSource.getRepository(User);
    const orderRepo = AppDataSource.getRepository(Order);

    // 2 Organizations
    const orgs = [
        orgRepo.create({
            id: randomUUID(),
            name: 'OrgOne',
            industry: 'Tech',
            dateFounded: randomDateInPast(),
        }),
        orgRepo.create({
            id: randomUUID(),
            name: 'OrgTwo',
            industry: 'Finance',
            dateFounded: randomDateInPast(),
        }),
    ];
    await orgRepo.save(orgs);

    // 10 Users
    const users: User[] = [];
    for (let i = 1; i <= 10; i++) {
        const org = orgs[i % 2];
        const user = userRepo.create({
            id: randomUUID(),
            firstName: `User${i}`,
            lastName: `Test${i}`,
            email: `user${i}@example.com`,
            organizationId: org.id,
            dateCreated: randomDateInPast(),
        });
        users.push(user);
    }
    await userRepo.save(users);

    // 20 Orders
    const orders: Order[] = [];
    for (let i = 1; i <= 20; i++) {
        const user = users[i % users.length];
        const org = orgs[i % orgs.length];
        const order = orderRepo.create({
            id: randomUUID(),
            orderDate: randomDateInPast(),
            totalAmount: Math.random() * 1000 + 50,
            userId: user.id,
            organizationId: org.id,
        });
        orders.push(order);
    }
    await orderRepo.save(orders);

    console.log('Seeding complete!');
    await AppDataSource.destroy();
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
