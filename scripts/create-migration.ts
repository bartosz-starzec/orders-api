import * as fs from 'fs';
import * as path from 'path';

const name = process.argv[2];

if (!name) {
    console.error('Użycie: pnpm run create:migration <MigrationName>');
    process.exit(1);
}

const timestamp = Date.now();
const filename = `${timestamp}-${name}.ts`;
const migrationsDir = path.join(__dirname, '../src/database/migrations');

const template = `import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${name}${timestamp} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // TODO: implement migration
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO: rollback
  }
}
`;

fs.writeFileSync(path.join(migrationsDir, filename), template);
console.log(`Migracja utworzona: ${filename}`);
