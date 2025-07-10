const mysql = require('mysql2/promise');

// สร้าง connection pool เดียวทั่วระบบ
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

// ทดสอบการเชื่อมต่อทันทีที่แอปเริ่ม
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ MySQL connected successfully');
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
})();

// 🔁 ฟังก์ชัน query ปลอดภัย พร้อม Retry 1 ครั้งถ้า connection หลุด
async function safeQuery(sql, params = []) {
  try {
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (err) {
    console.warn('⚠️ Query failed:', err.message);
    if (err.fatal || err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('🔁 Retrying query...');
      const [rows] = await pool.query(sql, params);
      return rows;
    }
    throw err;
  }
}

// ส่งออก query function และ pool เผื่อใช้พิเศษ
module.exports = {
  query: safeQuery,
  getPool: () => pool
};
