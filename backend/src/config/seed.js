require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB_NAME = process.env.DB_NAME || 'manzio_db';

async function seed() {
  // Connect WITHOUT specifying db first so we can create it
  const root = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
  });

  await root.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await root.query(`USE \`${DB_NAME}\``);

  await root.query(`SET FOREIGN_KEY_CHECKS = 0`);
  await root.query(`DROP TABLE IF EXISTS proposal_activity`);
  await root.query(`DROP TABLE IF EXISTS proposal_items`);
  await root.query(`DROP TABLE IF EXISTS proposals`);
  await root.query(`DROP TABLE IF EXISTS clients`);
  await root.query(`DROP TABLE IF EXISTS users`);
  await root.query(`DROP TABLE IF EXISTS templates`);
  await root.query(`DROP TABLE IF EXISTS settings`);
  await root.query(`DROP TABLE IF EXISTS notifications`);
  await root.query(`DROP TABLE IF EXISTS reports`);
  await root.query(`DROP TABLE IF EXISTS activity_logs`);
  await root.query(`SET FOREIGN_KEY_CHECKS = 1`);

  // ── USERS ─────────────────────────────────────────────────────
  await root.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          VARCHAR(10)  PRIMARY KEY,
      name        VARCHAR(120) NOT NULL,
      role        ENUM('admin','management','sales') NOT NULL DEFAULT 'management',
      email       VARCHAR(200) NOT NULL UNIQUE,
      password    VARCHAR(200) NOT NULL,
      avatar_color VARCHAR(10) DEFAULT '#5B8DEF',
      avatar_path  VARCHAR(255) DEFAULT NULL,
      status      VARCHAR(20) DEFAULT 'active',
      proposals_sent INT DEFAULT 0,
      conversion  FLOAT DEFAULT 0,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ── CLIENTS ───────────────────────────────────────────────────
  await root.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id              VARCHAR(10)  PRIMARY KEY,
      name            VARCHAR(200) NOT NULL,
      contact         VARCHAR(120),
      email           VARCHAR(200),
      phone           VARCHAR(40),
      address         VARCHAR(200),
      industry        VARCHAR(100),
      proposals_count INT DEFAULT 0,
      notes           TEXT,
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ── PROPOSALS ─────────────────────────────────────────────────
  await root.query(`
    CREATE TABLE IF NOT EXISTS proposals (
      id            VARCHAR(30)  PRIMARY KEY,
      number        VARCHAR(20)  NOT NULL UNIQUE,
      client_id     VARCHAR(10),
      custom_client JSON,
      owner_id      VARCHAR(10),
      status        VARCHAR(20)  NOT NULL DEFAULT 'draft',
      title         VARCHAR(300) NOT NULL,
      service       VARCHAR(100),
      currency      VARCHAR(10)  DEFAULT 'INR',
      discount      FLOAT        DEFAULT 0,
      tax           FLOAT        DEFAULT 0.18,
      views         INT          DEFAULT 0,
      last_viewed   DATE,
      created_at    DATE,
      updated_at    DATE,
      expires_at    DATE,
      sent_at       DATE,
      accepted_at   DATE,
      -- builder sections
      project_overview  TEXT,
      proposed_solution TEXT,
      scope_items       JSON,
      pages             JSON,
      features          JSON,
      tech_stack        JSON,
      timeline          JSON,
      payment_schedule  JSON,
      terms             TEXT,
      signature         JSON,
      company_logo      LONGTEXT,
      attachments       JSON,
      FOREIGN KEY (client_id)  REFERENCES clients(id)  ON DELETE SET NULL,
      FOREIGN KEY (owner_id)   REFERENCES users(id)    ON DELETE SET NULL
    )
  `);

  // ── PROPOSAL ITEMS ────────────────────────────────────────────
  await root.query(`
    CREATE TABLE IF NOT EXISTS proposal_items (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      proposal_id VARCHAR(30) NOT NULL,
      \`desc\`    VARCHAR(300),
      qty         INT DEFAULT 1,
      rate        FLOAT DEFAULT 0,
      sort_order  INT DEFAULT 0,
      FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE
    )
  `);

  // ── TEMPLATES ────────────────────────────────────────────────
  await root.query(`
    CREATE TABLE IF NOT EXISTS templates (
      id          VARCHAR(10)  PRIMARY KEY,
      name        VARCHAR(200) NOT NULL,
      service     VARCHAR(100),
      uses        INT DEFAULT 0,
      status      VARCHAR(20) DEFAULT 'active',
      updated_at  DATE
    )
  `);

  // ── ACTIVITY LOG ──────────────────────────────────────────────
  await root.query(`
    CREATE TABLE IF NOT EXISTS proposal_activity (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      proposal_id VARCHAR(30) NOT NULL,
      at_date     DATE NOT NULL,
      label       VARCHAR(200),
      by_name     VARCHAR(120),
      note        TEXT,
      FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE
    )
  `);

  // ── SETTINGS ──────────────────────────────────────────────────
  await root.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id             INT PRIMARY KEY DEFAULT 1,
      company_name   VARCHAR(200) NOT NULL DEFAULT 'Manzio Creative Studio',
      address        VARCHAR(200) DEFAULT 'Kochi, Kerala, India',
      phone          VARCHAR(40) DEFAULT '+91 9495929458',
      email          VARCHAR(200) DEFAULT 'manziostudio@gmail.com',
      website        VARCHAR(200) DEFAULT 'https://www.manziostudio.com/',
      gst_number     VARCHAR(50) DEFAULT '',
      currency       VARCHAR(10) DEFAULT 'INR',
      tax_percentage FLOAT DEFAULT 18.0,
      company_logo   LONGTEXT DEFAULT NULL,
      number_prefix  VARCHAR(20) DEFAULT 'MZ',
      number_format  VARCHAR(100) DEFAULT '{PREFIX}-{YYYY}-{####}',
      next_number    VARCHAR(20) DEFAULT '0122',
      validity_days  INT DEFAULT 30
    )
  `);

  // ── NOTIFICATIONS ─────────────────────────────────────────────
  await root.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id         VARCHAR(50) PRIMARY KEY,
      type       VARCHAR(50) NOT NULL,
      title      VARCHAR(200) NOT NULL,
      message    TEXT NOT NULL,
      time       VARCHAR(50) NOT NULL,
      \`read\`     TINYINT(1) DEFAULT 0,
      link       VARCHAR(200) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ── REPORTS ───────────────────────────────────────────────────
  await root.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(200) NOT NULL,
      type        VARCHAR(50) NOT NULL,
      created_by  VARCHAR(10),
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      data        JSON,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // ── SYSTEM ACTIVITY LOGS ─────────────────────────────────────────
  await root.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     VARCHAR(10),
      user_name   VARCHAR(120),
      action      VARCHAR(255) NOT NULL,
      description TEXT,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Tables created');

  // ── SEED USERS ────────────────────────────────────────────────
  const adminPw = await bcrypt.hash('admin123', 10);
  const mgmtPw = await bcrypt.hash('manager123', 10);
  const salesPw = await bcrypt.hash('sales123', 10);

  const users = [
    ['u1', 'Aisha Verghese', 'management', 'aisha@manzio.studio', mgmtPw, '#5B8DEF', 0, 0],
    ['u2', 'Rohan Mathew', 'management', 'rohan@manzio.studio', mgmtPw, '#FF4D2E', 0, 0],
    ['u3', 'Lena Cherian', 'management', 'lena@manzio.studio', mgmtPw, '#1A8754', 0, 0],
    ['u4', 'David Pinto', 'management', 'david@manzio.studio', mgmtPw, '#C98A1F', 0, 0],
    ['u5', 'Naomi Sequeira', 'admin', 'naomi@manzio.studio', adminPw, '#8A8F98', 0, 0],
    // Extra login accounts matching Login.jsx demo cards
    ['u6', 'Alex Rivera', 'admin', 'admin@manzio.com', adminPw, '#FF4D2E', 0, 0],
    ['u7', 'Jordan Blake', 'management', 'manager@manzio.com', mgmtPw, '#5B8DEF', 0, 0],
    ['u8', 'Sanjay Nair', 'sales', 'sales@manzio.com', salesPw, '#2E9DFF', 0, 0],
  ];

  for (const u of users) {
    await root.query(
      `INSERT IGNORE INTO users (id,name,role,email,password,avatar_color,proposals_sent,conversion)
       VALUES (?,?,?,?,?,?,?,?)`, u
    );
  }
  console.log('✅ Users seeded');

  // ── SEED TEMPLATES ────────────────────────────────────────────
  const templates = [
    ['t1', 'Template 1', 'UI/UX Design', 0, 'active', new Date().toISOString().slice(0, 10)],
    ['t2', 'Template 2', 'Web Design', 0, 'active', new Date().toISOString().slice(0, 10)],
  ];

  for (const t of templates) {
    await root.query(
      `INSERT IGNORE INTO templates (id,name,service,uses,status,updated_at) VALUES (?,?,?,?,?,?)`, t
    );
  }
  console.log('✅ Templates seeded');

  // ── SEED SETTINGS ─────────────────────────────────────────────
  await root.query(`
    INSERT INTO settings (
      id, company_name, address, phone, email, website, gst_number, currency, tax_percentage,
      number_prefix, number_format, next_number, validity_days
    ) VALUES (
      1, 'Manzio Creative Studio', 'Kochi, Kerala, India', '+91 98470 22310', 'hello@manzio.studio',
      'https://manzio.studio', '32ABCDE1234F1Z5', 'INR', 18.0, 'MZ', '{PREFIX}-{YYYY}-{####}', '0122', 30
    ) ON DUPLICATE KEY UPDATE company_name='Manzio Creative Studio'
  `);
  console.log('✅ Settings seeded');

  await root.end();
  console.log('\n🎉 Database seeded with clean templates & users successfully!\n');
}

seed().catch(err => { console.error('Seed failed:', err.message); process.exit(1); });
