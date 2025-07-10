const express = require('express');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
const router = express.Router();

// Generate unique tracking code
const generateTrackingCode = async () => {
  const pool = getPool();
  let isUnique = false;
  let code;
  
  while (!isUnique) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    code = `OAA${timestamp}${random}`;
    
    const [existing] = await pool.execute(
      'SELECT id FROM issues WHERE tracking_code = ?',
      [code]
    );
    
    isUnique = existing.length === 0;
  }
  
  return code;
};

// Validation rules
const createIssueValidation = [
  body('customerLineName')
    .notEmpty()
    .withMessage('ชื่อไลน์ลูกค้าจำเป็นต้องกรอก')
    .isLength({ max: 255 })
    .withMessage('ชื่อไลน์ลูกค้าต้องไม่เกิน 255 ตัวอักษร'),
  
  body('emails')
    .isArray({ min: 1 })
    .withMessage('ต้องมีอีเมลอย่างน้อย 1 อีเมล')
    .custom((emails) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const email of emails) {
        if (!emailRegex.test(email)) {
          throw new Error(`อีเมล "${email}" ไม่ถูกต้อง`);
        }
      }
      return true;
    }),
  
  body('problemType')
    .isIn(['youtube_premium', 'family_plan', 'email_not_working'])
    .withMessage('ประเภทปัญหาไม่ถูกต้อง'),
  
  body('problemDescription')
    .notEmpty()
    .withMessage('รายละเอียดปัญหาจำเป็นต้องกรอก')
    .isLength({ min: 10, max: 5000 })
    .withMessage('รายละเอียดปัญหาต้องมีความยาว 10-5000 ตัวอักษร')
];

// POST /api/issues - Create new issue
router.post('/', createIssueValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'ข้อมูลไม่ถูกต้อง',
        details: errors.array()
      });
    }

    const { customerLineName, emails, problemType, problemDescription } = req.body;
    const pool = getPool();
    
    // Generate unique tracking code
    const trackingCode = await generateTrackingCode();
    
    // Insert issue
    const [result] = await pool.execute(
      `INSERT INTO issues (tracking_code, customer_line_name, emails, problem_type, problem_description) 
       VALUES (?, ?, ?, ?, ?)`,
      [trackingCode, customerLineName, JSON.stringify(emails), problemType, problemDescription]
    );

    res.status(201).json({
      success: true,
      message: 'แจ้งปัญหาเรียบร้อยแล้ว',
      trackingCode,
      issueId: result.insertId
    });

  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      message: error.message
    });
  }
});

// GET /api/issues/track/:trackingCode - Get issue by tracking code
router.get('/track/:trackingCode', async (req, res) => {
  try {
    const { trackingCode } = req.params;
    const pool = getPool();
    
    // Get issue details
    const [issues] = await pool.execute(
      `SELECT 
        id, tracking_code, customer_line_name, emails, problem_type, 
        problem_description, status, admin_response, created_at, updated_at
       FROM issues 
       WHERE tracking_code = ?`,
      [trackingCode]
    );

    if (issues.length === 0) {
      return res.status(404).json({
        error: 'ไม่พบรหัสติดตาม',
        message: 'โปรดตรวจสอบรหัสติดตามอีกครั้ง'
      });
    }

    const issue = issues[0];
    
    // Get issue images
    const [images] = await pool.execute(
      'SELECT image_path, is_admin_image, created_at FROM issue_images WHERE issue_id = ? ORDER BY created_at',
      [issue.id]
    );
    
    // Parse emails JSON safely
    try {
      if (typeof issue.emails === 'string') {
        issue.emails = JSON.parse(issue.emails);
      }
    } catch (parseError) {
      console.error('Error parsing emails JSON:', parseError);
      // Fallback: if parsing fails, treat as single email
      issue.emails = [issue.emails];
    }
    issue.images = images;

    // Convert status to Thai
    const statusMap = {
      'pending': 'รอดำเนินการ',
      'in_progress': 'กำลังดำเนินการ', 
      'contact_admin': 'ติดต่อแอดมินทางไลน์',
      'completed': 'เสร็จสิ้น'
    };
    
    issue.statusText = statusMap[issue.status];

    res.json({
      success: true,
      data: issue
    });

  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      message: error.message
    });
  }
});

// GET /api/issues/problem-types - Get available problem types
router.get('/problem-types', (req, res) => {
  const problemTypes = [
    { value: 'youtube_premium', label: 'ยูทูปไม่ขึ้นพรีเมี่ยม/ยูทูปขึ้นโฆษณา' },
    { value: 'family_plan', label: 'ครอบครัวไม่พร้อมใช้งาน' },
    { value: 'email_not_working', label: 'เมลร้านใช้งานไม่ได้' }
  ];
  
  res.json({
    success: true,
    data: problemTypes
  });
});

module.exports = router; 