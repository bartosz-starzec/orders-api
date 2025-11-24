import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateOrders1680000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'order',
                columns: [
                    { name: 'id', type: 'varchar', isPrimary: true },
                    {
                        name: 'orderDate',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'totalAmount',
                        type: 'int',
                        precision: 10,
                        isNullable: false,
                    },
                    { name: 'userId', type: 'varchar', isNullable: false },
                    {
                        name: 'organizationId',
                        type: 'varchar',
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKeys('order', [
            new TableForeignKey({
                columnNames: ['userId'],
                referencedTableName: 'user',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
            new TableForeignKey({
                columnNames: ['organizationId'],
                referencedTableName: 'organization',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('order');
        const userFk = table!.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
        const orgFk = table!.foreignKeys.find((fk) => fk.columnNames.indexOf('organizationId') !== -1);

        if (userFk) await queryRunner.dropForeignKey('order', userFk);
        if (orgFk) await queryRunner.dropForeignKey('order', orgFk);

        await queryRunner.dropTable('order');
    }
}
