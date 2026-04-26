
import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  const sql = neon(url);
  const migrationPath = path.join(process.cwd(), 'drizzle', '0000_nosy_redwing.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  // Split by drizzle's statement breakpoint
  const statements = migrationSql.split('--> statement-breakpoint');

  console.log(`Found ${statements.length} statements to execute.`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    if (!stmt) continue;

    try {
      console.log(`Executing statement ${i + 1}...`);
      await sql.query(stmt);
      console.log(`Success.`);
    } catch (err: any) {
      if (err.code === '42P07') {
        console.log(`Table/Type already exists, skipping.`);
      } else if (err.code === '42710') {
          console.log(`Type already exists, skipping.`);
      } else {
        console.error(`Error executing statement ${i + 1}:`, err.message);
        // We continue anyway, as some might fail due to dependencies or existing constraints
      }
    }
  }

  console.log('Migration sync complete.');
}

run();
