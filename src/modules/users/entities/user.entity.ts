import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class User {
    @PrimaryColumn('varchar')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @CreateDateColumn()
    dateCreated: Date;

    @Column()
    organizationId: string;

    @ManyToOne(() => Organization, (org) => org.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organizationId' })
    organization: Organization;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
