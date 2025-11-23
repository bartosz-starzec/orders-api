import { Entity, PrimaryColumn, Column } from 'typeorm';

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
