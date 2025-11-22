import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthRepository {
    private readonly repo: Repository<User>;

    constructor(private readonly dataSource: DataSource) {
        this.repo = this.dataSource.getRepository(User);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.repo.findOne({ where: { email } });

        return user ?? null;
    }
}
