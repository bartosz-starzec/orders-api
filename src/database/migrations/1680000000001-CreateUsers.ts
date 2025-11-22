import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUsers1680000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    { name: 'id', type: 'varchar', isPrimary: true },
                    {
                        name: 'firstName',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'lastName',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'organizationId',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'dateCreated',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            'user',
            new TableForeignKey({
                columnNames: ['organizationId'],
                referencedTableName: 'organization',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('user');
        const foreignKey = table!.foreignKeys.find((fk) => fk.columnNames.indexOf('organizationId') !== -1);
        if (foreignKey) await queryRunner.dropForeignKey('user', foreignKey);
        await queryRunner.dropTable('user');
    }
}
