const mysql = require('mysql2/promise');

async function checkDb() {
  try {
    const db = await mysql.createPool({
      host: '65.108.76.42',
      user: 'vayunexs_dbnex_user',
      password: 'yash0072500725',
      database: 'vayunexs_dbnex_db',
      port: 25060,
    });

    const [rows] = await db.query(`SHOW PROCEDURE STATUS WHERE Db = 'vayunexs_dbnex_db'`);
    console.log('Procedures:', rows);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDb();
