import pg from 'pg';

const client = new pg.Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'app_db',
});

await client.connect();

const email = 'tahiruplayz@gmail.com';

// Check if user exists first
const check = await client.query('SELECT id, name, email, role FROM users WHERE email = $1', [email]);

if (check.rows.length === 0) {
  console.log(`No user found with email: ${email}`);
  console.log('They need to register first, then run this script again.');
} else {
  const result = await client.query(
    "UPDATE users SET role = 'OWNER' WHERE email = $1 RETURNING id, name, email, role",
    [email]
  );
  const user = result.rows[0];
  console.log('✓ Role updated successfully:');
  console.log(`  Name:  ${user.name}`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Role:  ${user.role}`);
}

await client.end();
