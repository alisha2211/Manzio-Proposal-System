const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function fix() {
  // Extend role enum to include 'sales'
  const sql = "ALTER TABLE users MODIFY COLUMN role ENUM('admin','management','sales') NOT NULL DEFAULT 'management'";
  await db.execute(sql);
  console.log('✅ Role enum extended');

  // Insert sales user
  const hash = await bcrypt.hash('sales123', 10);
  await db.execute(
    'INSERT IGNORE INTO users (id,name,role,email,password,avatar_color,status,proposals_sent,conversion) VALUES (?,?,?,?,?,?,?,?,?)',
    ['u8', 'Sanjay Nair', 'sales', 'sales@manzio.com', hash, '#2E9DFF', 'active', 0, 0]
  );
  console.log('✅ Sales user inserted');

  // Show all users
  const [rows] = await db.execute('SELECT id, email, role FROM users ORDER BY id');
  console.log('Users:', JSON.stringify(rows, null, 2));
  process.exit(0);
}

fix().catch(e => { console.error('Error:', e.message); process.exit(1); });
