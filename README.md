# 🌸 OAA Issue Tracker - ระบบแจ้งปัญหา

ระบบแจ้งปัญหาออนไลน์ที่ออกแบบมาเพื่อความง่ายในการใช้งาน พร้อมด้วยการจัดการที่มีประสิทธิภาพสำหรับแอดมิน

## 📋 คุณสมบัติ

### สำหรับผู้ใช้งาน (User)
- ✅ แจ้งปัญหาพร้อมรายละเอียดครบถ้วน
- ✅ อัพโหลดรูปภาพประกอบ (สูงสุด 2 รูป, 10MB ต่อรูป)
- ✅ ติดตามสถานะการแก้ไขปัญหาแบบ real-time
- ✅ ระบบรหัสติดตามที่ไม่ซ้ำกัน
- ✅ รองรับอีเมลหลายอันในการแจ้ง

### สำหรับแอดมิน (Admin)
- ✅ Dashboard ครบครันสำหรับจัดการปัญหา
- ✅ กรองและค้นหาปัญหาตามเงื่อนไขต่างๆ
- ✅ อัพเดทสถานะและตอบกลับลูกค้า
- ✅ ระบบ Pagination สำหรับข้อมูลจำนวนมาก
- ✅ สถิติการใช้งานแบบ real-time

### ระบบรักษาความปลอดภัย
- ✅ JWT Authentication สำหรับแอดมิน
- ✅ Rate Limiting
- ✅ Input Validation และ Sanitization
- ✅ File Upload Security

### ระบบอัตโนมัติ
- ✅ ลบข้อมูลเก่าอัตโนมัติหลังจาก 30 วัน
- ✅ ทำความสะอาดไฟล์ที่ไม่ใช้งาน
- ✅ Backup และ Recovery

## 🏗️ สถาปัตยกรรมระบบ

```
oaa/
├── frontend/          # Next.js Application
│   ├── src/
│   │   ├── app/       # App Router Pages
│   │   │   ├── page.jsx           # หน้าหลัก
│   │   │   ├── report/            # หน้าแจ้งปัญหา
│   │   │   ├── track/             # หน้าติดตามสถานะ
│   │   │   └── admin/             # หน้า Admin
│   │   │       ├── login/         # หน้า Login
│   │   │       └── dashboard/     # หน้า Dashboard
│   │   └── components/            # Reusable Components
│   └── package.json
├── backend/           # Express API Server
│   ├── config/        # Database และ Configuration
│   ├── routes/        # API Routes
│   ├── middleware/    # Custom Middleware
│   ├── utils/         # Utilities และ Helpers
│   ├── uploads/       # File Upload Directory
│   └── server.js      # Main Server File
└── README.md          # คู่มือนี้
```

## 🚀 การติดตั้งและเริ่มใช้งาน

### ความต้องการระบบ
- Node.js 18.x หรือใหม่กว่า
- MySQL 8.0 หรือใหม่กว่า
- npm หรือ yarn

### 1. ติดตั้ง Dependencies

```bash
# ติดตั้ง dependencies ทั้งหมด
npm run install:all

# หรือติดตั้งแยกกัน
cd frontend && npm install
cd ../backend && npm install
```

### 2. ตั้งค่าฐานข้อมูล

1. สร้างฐานข้อมูล MySQL:
```sql
CREATE DATABASE oaa_issue_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Import database schema:
```bash
mysql -u root -p oaa_issue_tracker < backend/config/schema.sql
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ `backend/`:

```env
# Server Configuration
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=oaa_issue_tracker
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Admin Default Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### 4. เริ่มระบบ

```bash
# เริ่มทั้ง frontend และ backend
npm run dev

# หรือเริ่มแยกกัน
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:5001
```

## 📖 คู่มือการใช้งาน

### สำหรับผู้ใช้งาน

#### การแจ้งปัญหา
1. เข้าสู่หน้าแจ้งปัญหา
2. กรอกข้อมูล:
   - ชื่อไลน์ลูกค้า
   - อีเมลที่หารยูทูป (สามารถเพิ่มได้หลายอีเมล)
   - เลือกประเภทปัญหา
   - อธิบายปัญหาอย่างละเอียด
   - แนบรูปภาพ (ถ้ามี)
3. กดส่งแบบฟอร์ม
4. บันทึกรหัสติดตามสำหรับติดตามสถานะ

#### การติดตามสถานะ
1. เข้าสู่หน้าติดตามสถานะ
2. ใส่รหัสติดตาม
3. ดูข้อมูลปัญหาและสถานะปัจจุบัน

### สำหรับแอดมิน

#### การเข้าสู่ระบบ
- Username: `admin`
- Password: `admin123`

#### การจัดการปัญหา
1. ดูสถิติรวมในหน้า Dashboard
2. ใช้ตัวกรองเพื่อค้นหาปัญหา
3. คลิก "แก้ไข" เพื่อ:
   - เปลี่ยนสถานะ
   - เพิ่มข้อความตอบกลับ
4. ลบปัญหาที่เสร็จสิ้นแล้ว (ถ้าจำเป็น)

## 🔧 การพัฒนาและปรับปรุง

### โครงสร้างไฟล์สำคัญ

#### Frontend (Next.js)
```
src/app/
├── layout.jsx           # Layout หลักพร้อม Toaster
├── page.jsx            # หน้าแรก
├── report/page.jsx     # ฟอร์มแจ้งปัญหา
├── track/page.jsx      # หน้าติดตามสถานะ
└── admin/
    ├── login/page.jsx  # หน้า Login Admin
    └── dashboard/page.jsx # Dashboard Admin
```

#### Backend (Express)
```
routes/
├── issues.js           # API สำหรับปัญหา
├── admin.js           # API สำหรับ Admin
└── upload.js          # API สำหรับอัพโหลดไฟล์

utils/
└── cleanup.js         # ระบบทำความสะอาดอัตโนมัติ

config/
├── database.js        # การเชื่อมต่อฐานข้อมูล
└── schema.sql         # Database Schema
```

### การเพิ่มฟีเจอร์ใหม่

#### 1. เพิ่ม API Endpoint ใหม่

```javascript
// backend/routes/issues.js
router.get('/new-endpoint', async (req, res) => {
  try {
    // Logic ของคุณ
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### 2. เพิ่มหน้าใหม่ใน Frontend

```jsx
// frontend/src/app/new-page/page.jsx
'use client';

export default function NewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100">
      {/* เนื้อหาของคุณ */}
    </div>
  );
}
```

#### 3. เพิ่มตารางใหม่ในฐานข้อมูล

```sql
-- เพิ่มใน backend/config/schema.sql
CREATE TABLE IF NOT EXISTS new_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### การปรับแต่ง UI/UX

#### สีหลักของระบบ
```css
/* Tailwind CSS Classes ที่ใช้ */
bg-pink-50    /* พื้นหลังอ่อน */
bg-pink-100   /* พื้นหลังปานกลาง */
bg-pink-500   /* สีหลัก */
text-pink-800 /* ข้อความเข้ม */
border-pink-200 /* เส้นขอบ */
```

#### การเพิ่ม Animation
```jsx
// ใช้ Tailwind Animation Classes
className="transition-all duration-300 hover:scale-105"
```

### การเพิ่มความปลอดภัย

#### 1. เพิ่ม Middleware Authentication

```javascript
// backend/middleware/auth.js
const authenticateUser = (req, res, next) => {
  // Logic การตรวจสอบ
  next();
};
```

#### 2. เพิ่ม Input Validation

```javascript
const { body, validationResult } = require('express-validator');

const validateInput = [
  body('field').notEmpty().withMessage('Field is required'),
  // เพิ่มการตรวจสอบอื่นๆ
];
```

## 🔄 ระบบ Auto-Cleanup

ระบบจะทำงานอัตโนมัติทุกวันเวลา 02:00 น. เพื่อ:

1. **ลบปัญหาที่เสร็จสิ้นแล้ว** หลังจากผ่านไป 30 วัน
2. **ลบไฟล์รูปภาพ** ที่เกี่ยวข้องกับปัญหาที่ถูกลบ
3. **ลบไฟล์ที่ไม่มีการอ้างอิง** ในฐานข้อมูล

### การตรวจสอบสถานะ Cleanup

```bash
# เรียก API เพื่อดู statistics
curl http://localhost:5001/api/upload/cleanup
```

### การปิด Auto-Cleanup

```javascript
// ใน server.js
// Comment บรรทัดนี้เพื่อปิดการทำงาน
// cleanupService.startAutoCleanup();
```

## 📊 การ Monitor และ Logging

### การดู Log
```bash
# Backend logs
tail -f backend/logs/app.log

# Database logs
tail -f /var/log/mysql/mysql.log
```

### การ Monitor Performance
1. ใช้ `htop` หรือ `top` เพื่อดู CPU และ Memory usage
2. ตรวจสอบ Database connections
3. Monitor file system space สำหรับโฟลเดอร์ uploads

## 🧪 การทดสอบ

### การทดสอบ API

```bash
# ทดสอบ Health Check
curl http://localhost:5001/api/health

# ทดสอบการแจ้งปัญหา
curl -X POST http://localhost:5001/api/issues \
  -H "Content-Type: application/json" \
  -d '{
    "customerLineName": "ทดสอบ",
    "emails": ["test@example.com"],
    "problemType": "youtube_premium",
    "problemDescription": "ทดสอบระบบ"
  }'

# ทดสอบการติดตามสถานะ
curl http://localhost:5001/api/issues/track/OAA20240101001
```

### การทดสอบ Frontend

```bash
# เข้าสู่โหมด development
cd frontend && npm run dev

# ทดสอบ build
npm run build
```

## 🚨 การแก้ไขปัญหาเบื้องต้น

### ปัญหาที่พบบ่อย

#### 1. Database Connection Error
```bash
# ตรวจสอบการเชื่อมต่อ MySQL
mysql -u root -p -e "SELECT 1"

# ตรวจสอบ .env file
cat backend/.env
```

#### 2. Port Already in Use
```bash
# หา process ที่ใช้ port
lsof -i :5000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### 3. File Upload Error
```bash
# ตรวจสอบ permissions โฟลเดอร์ uploads
ls -la backend/uploads
chmod 755 backend/uploads
```

#### 4. Frontend Build Error
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf frontend/node_modules
rm frontend/package-lock.json
cd frontend && npm install
```

## 📈 การ Scale และ Deploy

### การ Deploy Production

#### 1. ตั้งค่า Environment Variables สำหรับ Production

```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
DB_HOST=your-production-db-host
JWT_SECRET=super-secure-random-string
```

#### 2. Build และ Deploy

```bash
# Build frontend
cd frontend && npm run build

# Start production server
cd backend && npm start
```

#### 3. ใช้ PM2 สำหรับ Process Management

```bash
# ติดตั้ง PM2
npm install -g pm2

# Start backend with PM2
cd backend && pm2 start server.js --name "oaa-backend"

# Start frontend with PM2 (ถ้าใช้ standalone)
cd frontend && pm2 start npm --name "oaa-frontend" -- start
```

### การใช้ Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/oaa
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🤝 การ Contribute

### Git Workflow

```bash
# สร้าง feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Add new feature"

# Push และสร้าง Pull Request
git push origin feature/new-feature
```

### Code Standards

1. **JavaScript**: ใช้ ES6+ syntax
2. **CSS**: ใช้ Tailwind CSS classes
3. **Comments**: เขียน comments เป็นภาษาไทยสำหรับ business logic
4. **Error Handling**: ใช้ try-catch และ return meaningful error messages

## 📞 การติดต่อและสนับสนุน

สำหรับการสนับสนุนทางเทคนิคหรือคำถามเกี่ยวกับระบบ:

- 📧 Email: support@oaa.com
- 📱 Line: @oaa-support
- 📞 Tel: 02-xxx-xxxx

---

## 📝 License

MIT License - ดูรายละเอียดใน LICENSE file

---

**สร้างด้วย ❤️ โดย OAA Development Team** 