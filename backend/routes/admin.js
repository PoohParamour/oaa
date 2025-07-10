const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/database');

const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

// Middleware to verify JWT token
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'ไม่มี token สำหรับการยืนยันตัวตน' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const pool = getPool();
    
    const [admins] = await pool.execute(
      'SELECT id, username FROM admins WHERE id = ?',
      [decoded.adminId]
    );

    if (admins.length === 0) {
      return res.status(401).json({ error: 'Token ไม่ถูกต้อง' });
    }

    req.admin = admins[0];
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Token ไม่ถูกต้อง' });
  }
};

// POST /api/admin/login - Admin login
router.post('/login', [
  body('username').notEmpty().withMessage('Username จำเป็นต้องกรอก'),
  body('password').notEmpty().withMessage('Password จำเป็นต้องกรอก')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'ข้อมูลไม่ถูกต้อง',
        details: errors.array()
      });
    }

    const { username, password } = req.body;
    const pool = getPool();
    
    // Get admin user
    const [admins] = await pool.execute(
      'SELECT id, username, password FROM admins WHERE username = ?',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({ error: 'Username หรือ Password ไม่ถูกต้อง' });
    }

    const admin = admins[0];
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Username หรือ Password ไม่ถูกต้อง' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
      message: error.message
    });
  }
});

// GET /api/admin/issues - Get all issues with pagination and filters
router.get('/issues', authenticateAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      startDate, 
      endDate,
      sortOrder = 'asc' // asc = oldest first, desc = newest first
    } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const pool = getPool();
    
    // Build WHERE clause
    let whereConditions = [];
    let queryParams = [];
    
    if (status && status !== 'all') {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }
    
    if (startDate) {
      whereConditions.push('DATE(created_at) >= ?');
      queryParams.push(startDate);
    }
    
    if (endDate) {
      whereConditions.push('DATE(created_at) <= ?');
      queryParams.push(endDate);
    }
    
    const whereClause = whereConditions.length > 0 ? 
      `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM issues ${whereClause}`,
      queryParams
    );
    
    const total = countResult[0].total;
    
    // Get issues - build complete query string to avoid parameter binding issues
    const orderBy = sortOrder === 'desc' ? 'ORDER BY created_at DESC' : 'ORDER BY created_at ASC';
    
    const finalQuery = `SELECT 
      id, tracking_code, customer_line_name, emails, problem_type, 
      problem_description, status, admin_response, created_at, updated_at
     FROM issues 
     ${whereClause}
     ${orderBy}
     LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    
    const [issues] = await pool.execute(finalQuery, queryParams);

    // Get images for all issues
    const issueIds = issues.map(issue => issue.id);
    let imagesMap = {};
    
    if (issueIds.length > 0) {
      const [images] = await pool.execute(
        `SELECT issue_id, image_path, is_admin_image, created_at 
         FROM issue_images 
         WHERE issue_id IN (${issueIds.map(() => '?').join(',')}) 
         ORDER BY created_at`,
        issueIds
      );
      
      // Group images by issue_id
      images.forEach(image => {
        if (!imagesMap[image.issue_id]) {
          imagesMap[image.issue_id] = [];
        }
        imagesMap[image.issue_id].push(image);
      });
    }

    // Parse emails for each issue safely and add images
    const issuesWithParsedEmails = issues.map(issue => {
      let parsedEmails;
      try {
        if (typeof issue.emails === 'string') {
          parsedEmails = JSON.parse(issue.emails);
        } else {
          parsedEmails = issue.emails;
        }
      } catch (parseError) {
        console.error('Error parsing emails JSON:', parseError);
        parsedEmails = [issue.emails]; // Fallback
      }
      
      return {
        ...issue,
        emails: parsedEmails,
        images: imagesMap[issue.id] || []
      };
    });

    // Get status counts
    const [statusCounts] = await pool.execute(`
      SELECT 
        status,
        COUNT(*) as count
      FROM issues 
      GROUP BY status
    `);
    
    const statusSummary = {
      pending: 0,
      in_progress: 0,
      contact_admin: 0,
      completed: 0,
      total: total
    };
    
    statusCounts.forEach(item => {
      statusSummary[item.status] = item.count;
    });

    res.json({
      success: true,
      data: {
        issues: issuesWithParsedEmails,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        },
        statusSummary
      }
    });

  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      message: error.message
    });
  }
});

// PUT /api/admin/issues/:id/status - Update issue status
router.put('/issues/:id/status', authenticateAdmin, [
  body('status')
    .isIn(['pending', 'in_progress', 'contact_admin', 'completed'])
    .withMessage('สถานะไม่ถูกต้อง'),
  body('adminResponse').optional().isLength({ max: 5000 }).withMessage('ข้อความตอบกลับต้องไม่เกิน 5000 ตัวอักษร')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'ข้อมูลไม่ถูกต้อง',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { status, adminResponse } = req.body;
    const pool = getPool();
    
    // Get current issue
    const [currentIssue] = await pool.execute(
      'SELECT status FROM issues WHERE id = ?',
      [id]
    );
    
    if (currentIssue.length === 0) {
      return res.status(404).json({ error: 'ไม่พบปัญหาที่ต้องการแก้ไข' });
    }
    
    const previousStatus = currentIssue[0].status;
    
    // Update issue
    await pool.execute(
      'UPDATE issues SET status = ?, admin_response = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, adminResponse || null, id]
    );
    
    // Record status history
    await pool.execute(
      'INSERT INTO status_history (issue_id, previous_status, new_status, changed_by) VALUES (?, ?, ?, ?)',
      [id, previousStatus, status, req.admin.username]
    );

    res.json({
      success: true,
      message: 'อัพเดทสถานะเรียบร้อยแล้ว'
    });

  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ',
      message: error.message
    });
  }
});

// GET /api/admin/issues/:id - Get single issue details
router.get('/issues/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    
    // Get issue details
    const [issues] = await pool.execute(
      `SELECT 
        id, tracking_code, customer_line_name, emails, problem_type, 
        problem_description, status, admin_response, created_at, updated_at
       FROM issues 
       WHERE id = ?`,
      [id]
    );

    if (issues.length === 0) {
      return res.status(404).json({ error: 'ไม่พบปัญหาที่ต้องการ' });
    }

    const issue = issues[0];
    
    // Get issue images
    const [images] = await pool.execute(
      'SELECT id, image_path, is_admin_image, created_at FROM issue_images WHERE issue_id = ? ORDER BY created_at',
      [issue.id]
    );
    
    // Get status history
    const [history] = await pool.execute(
      'SELECT previous_status, new_status, changed_by, changed_at FROM status_history WHERE issue_id = ? ORDER BY changed_at',
      [issue.id]
    );
    
    // Parse emails JSON safely
    try {
      if (typeof issue.emails === 'string') {
        issue.emails = JSON.parse(issue.emails);
      }
    } catch (parseError) {
      console.error('Error parsing emails JSON:', parseError);
      issue.emails = [issue.emails]; // Fallback
    }
    issue.images = images;
    issue.statusHistory = history;

    res.json({
      success: true,
      data: issue
    });

  } catch (error) {
    console.error('Error fetching issue details:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      message: error.message
    });
  }
});

// DELETE /api/admin/issues/:id - Delete completed issue (manual cleanup)
router.delete('/issues/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    
    // Check if issue exists and is completed
    const [issues] = await pool.execute(
      'SELECT id, status FROM issues WHERE id = ?',
      [id]
    );
    
    if (issues.length === 0) {
      return res.status(404).json({ error: 'ไม่พบปัญหาที่ต้องการลบ' });
    }
    
    if (issues[0].status !== 'completed') {
      return res.status(400).json({ error: 'สามารถลบได้เฉพาะปัญหาที่เสร็จสิ้นแล้วเท่านั้น' });
    }
    
    // Delete issue (cascades to images and history)
    await pool.execute('DELETE FROM issues WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'ลบปัญหาเรียบร้อยแล้ว'
    });

  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการลบปัญหา',
      message: error.message
    });
  }
});

module.exports = router; 