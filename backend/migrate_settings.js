require('dotenv').config();
const mysql = require('mysql2/promise');
const db = require('./db');

async function migrate() {
  let connection;
  try {
    connection = await db.getConnection();
    console.log('Connected to database.');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value VARCHAR(255) NOT NULL
      )
    `);
    console.log('Created settings table.');

    // Insert default email if not exists
    await connection.query(`
      INSERT IGNORE INTO settings (setting_key, setting_value) 
      VALUES ('receiver_email', 'sandeep327hr@gmail.com')
    `);
    console.log('Inserted default receiver_email.');

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

migrate();
