# 🚀 คู่มือการ Deploy - OAA Issue Tracker

คู่มือนี้จะแนะนำการ deploy ระบบแจ้งปัญหาลงเซิร์ฟเวอร์ production

## 📋 เตรียมเซิร์ฟเวอร์

### ความต้องการระบบ
- Ubuntu 20.04 LTS หรือใหม่กว่า
- RAM อย่างน้อย 2GB
- Storage อย่างน้อย 20GB
- Node.js 18.x หรือใหม่กว่า
- MySQL 8.0
- Nginx
- PM2 (สำหรับ process management)

### การติดตั้ง Dependencies

```bash
# อัพเดทระบบ
sudo apt update && sudo apt upgrade -y

# ติดตั้ง Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# ติดตั้ง MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# ติดตั้ง Nginx
sudo apt install nginx -y

# ติดตั้ง PM2
sudo npm install -g pm2

# ติดตั้ง Git
sudo apt install git -y
```

## 🗄️ ตั้งค่าฐานข้อมูล

### 1. สร้างฐานข้อมูลและผู้ใช้

```sql
-- เข้าสู่ MySQL
sudo mysql

-- สร้างฐานข้อมูล
CREATE DATABASE oaa_issue_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- สร้างผู้ใช้สำหรับ production
CREATE USER 'oaa_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON oaa_issue_tracker.* TO 'oaa_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

### 2. Import Schema

```bash
# ไปยัง directory ของโปรเจค
cd /var/www/oaa

# Import database schema
mysql -u oaa_user -p oaa_issue_tracker < backend/config/schema.sql
```

## 📁 เตรียมไฟล์โปรเจค

### 1. Clone Repository

```bash
# สร้าง directory
sudo mkdir -p /var/www/oaa
sudo chown $USER:$USER /var/www/oaa

# Clone project
cd /var/www/oaa
git clone <your-repo-url> .

# ติดตั้ง dependencies
npm run install:all
```

### 2. ตั้งค่า Environment Variables

```bash
# สร้าง .env file
nano backend/.env
```

```env
# Production Environment Variables
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Database Configuration
DB_HOST=localhost
DB_USER=oaa_user
DB_PASSWORD=strong_password_here
DB_NAME=oaa_issue_tracker
DB_PORT=3306

# JWT Configuration
JWT_SECRET=super_secure_random_string_change_this_in_production
JWT_EXPIRES_IN=24h

# Admin Credentials (เปลี่ยนจากค่าเริ่มต้น)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_admin_password

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### 3. Build Frontend

```bash
cd frontend
npm run build
cd ..
```

## 🔧 ตั้งค่า PM2

### 1. สร้าง PM2 Ecosystem File

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'oaa-backend',
      script: './backend/server.js',
      cwd: '/var/www/oaa',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/log/pm2/oaa-backend.err.log',
      out_file: '/var/log/pm2/oaa-backend.out.log',
      log_file: '/var/log/pm2/oaa-backend.log'
    },
    {
      name: 'oaa-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/oaa/frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/oaa-frontend.err.log',
      out_file: '/var/log/pm2/oaa-frontend.out.log',
      log_file: '/var/log/pm2/oaa-frontend.log'
    }
  ]
};
```

### 2. เริ่ม Services ด้วย PM2

```bash
# สร้าง log directory
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# เริ่ม services
pm2 start ecosystem.config.js

# บันทึก PM2 configuration
pm2 save

# ตั้งค่าให้ PM2 เริ่มอัตโนมัติเมื่อ reboot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

## 🌐 ตั้งค่า Nginx

### 1. สร้าง Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/oaa
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (ใช้หลังจากติดตั้ง SSL)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Security Headers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # API Rate Limiting
        limit_req zone=api_limit burst=10 nodelay;
    }

    # Static Files (Uploads)
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Cache static files
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json;
}

# Rate Limiting Zone
http {
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
}
```

### 2. เปิดใช้งาน Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/oaa /etc/nginx/sites-enabled/

# ตรวจสอบ configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 🔒 ติดตั้ง SSL Certificate

### ใช้ Let's Encrypt (ฟรี)

```bash
# ติดตั้ง Certbot
sudo apt install certbot python3-certbot-nginx -y

# ขอ SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# ตั้งค่า auto-renewal
sudo systemctl enable certbot.timer
```

## 🔥 Firewall Configuration

```bash
# เปิดใช้งาน UFW
sudo ufw enable

# อนุญาต SSH
sudo ufw allow ssh

# อนุญาต HTTP และ HTTPS
sudo ufw allow 'Nginx Full'

# ตรวจสอบสถานะ
sudo ufw status
```

## 📊 Monitoring และ Logging

### 1. ตั้งค่า Log Rotation

```bash
sudo nano /etc/logrotate.d/oaa
```

```
/var/log/pm2/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 2. Monitoring Commands

```bash
# ดู PM2 status
pm2 status

# ดู logs
pm2 logs oaa-backend
pm2 logs oaa-frontend

# ดู system resources
htop

# ดู Nginx access logs
sudo tail -f /var/log/nginx/access.log

# ดู Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

## 🔄 การ Deploy Updates

### 1. สร้าง Deploy Script

```bash
# deploy.sh
#!/bin/bash

echo "🚀 Deploying OAA Issue Tracker..."

# Backup current version
echo "📦 Creating backup..."
cp -r /var/www/oaa /var/www/oaa-backup-$(date +%Y%m%d_%H%M%S)

# Pull latest changes
echo "⬇️ Pulling latest changes..."
cd /var/www/oaa
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm run build
cd ..

# Restart services
echo "♻️ Restarting services..."
pm2 restart ecosystem.config.js

echo "✅ Deployment completed!"
```

```bash
# ทำให้ script executable
chmod +x deploy.sh
```

### 2. Zero-Downtime Deployment

```bash
# สำหรับ production ที่ต้องการ zero downtime
pm2 reload ecosystem.config.js
```

## 🆘 การแก้ไขปัญหาใน Production

### ปัญหาที่พบบ่อย

#### 1. Service ไม่เริ่มต้น
```bash
# ตรวจสอบ PM2 logs
pm2 logs

# ตรวจสอบ .env file
cat backend/.env

# Restart services
pm2 restart all
```

#### 2. Database Connection Error
```bash
# ตรวจสอบ MySQL status
sudo systemctl status mysql

# ตรวจสอบ database connectivity
mysql -u oaa_user -p -e "SELECT 1"
```

#### 3. Nginx Error
```bash
# ตรวจสอบ Nginx configuration
sudo nginx -t

# ตรวจสอบ Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

#### 4. SSL Certificate Issues
```bash
# ตรวจสอบ certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --dry-run
```

## 📈 Performance Optimization

### 1. Database Optimization

```sql
-- เพิ่ม indexes สำหรับ performance
CREATE INDEX idx_issues_created_at ON issues(created_at);
CREATE INDEX idx_issues_status_created ON issues(status, created_at);
```

### 2. Nginx Caching

```nginx
# เพิ่มใน Nginx config
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. PM2 Cluster Mode

```javascript
// สำหรับ high-traffic applications
{
  name: 'oaa-backend',
  script: './backend/server.js',
  instances: 'max', // ใช้ทุก CPU cores
  exec_mode: 'cluster'
}
```

## 🔐 Security Checklist

- [ ] เปลี่ยน admin password จากค่าเริ่มต้น
- [ ] ใช้ strong JWT secret
- [ ] ติดตั้ง SSL certificate
- [ ] ตั้งค่า firewall
- [ ] เปิดใช้งาน fail2ban
- [ ] อัพเดท dependencies เป็นประจำ
- [ ] ตั้งค่า automated backups
- [ ] Monitor system logs

## 📞 Production Support

### Emergency Contacts
- System Admin: xxx-xxx-xxxx
- Database Admin: xxx-xxx-xxxx
- Network Admin: xxx-xxx-xxxx

### Critical Commands
```bash
# Emergency restart
pm2 restart all && sudo systemctl restart nginx

# Check system health
pm2 status && sudo systemctl status mysql && sudo systemctl status nginx

# Emergency database backup
mysqldump -u oaa_user -p oaa_issue_tracker > emergency_backup_$(date +%Y%m%d_%H%M%S).sql
```

---

**🚀 Good luck with your deployment!** 