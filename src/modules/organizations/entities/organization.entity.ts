import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Organization {
    @PrimaryColumn('varchar')
    id: string;

    @Column()
    name: string;

    @Column()
    industry: string;

    @Column({ type: 'date' })
    dateFounded: Date;
}
