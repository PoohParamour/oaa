const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'oaa_issue_tracker',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ทดสอบ connection ตอนเริ่มต้น
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ MySQL pool connected');
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }
})();

// query wrapper ปลอดภัย
async function safeQuery(sql, params = []) {
  try {
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal) {
      console.warn('🔁 Retrying query after connection lost...');
      const [rows] = await pool.query(sql, params);
      return rows;
    }
    throw err;
  }
}

// execute wrapper ปลอดภัย (ใช้กับ prepare statement)
async function safeExecute(sql, params = []) {
  try {
    return await pool.execute(sql, params);
  } catch (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal) {
      console.warn('🔁 Retrying execute after connection lost...');
      return await pool.execute(sql, params);
    }
    throw err;
  }
}

module.exports = {
  query: safeQuery,
  execute: safeExecute
};
