import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity()
export class Order {
    @PrimaryColumn('varchar')
    id: string;

    @Column('date')
    orderDate: Date;

    @Column('int')
    totalAmount: number;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    organizationId: string;

    @ManyToOne(() => Organization, (org) => org.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organizationId' })
    organization: Organization;
}
