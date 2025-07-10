const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { getPool } = require('../config/database');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('รองรับเฉพาะไฟล์รูปภาพ (JPEG, PNG, GIF, WebP)'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    files: 2 // Maximum 2 files
  },
  fileFilter: fileFilter
});

// POST /api/upload/issue-images/:issueId - Upload images for an issue
router.post('/issue-images/:issueId', upload.array('images', 2), async (req, res) => {
  try {
    const { issueId } = req.params;
    const { isAdmin = false } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'ไม่มีไฟล์รูปภาพ' });
    }

    if (req.files.length > 2) {
      return res.status(400).json({ error: 'อัพโหลดได้สูงสุด 2 รูป' });
    }

    const pool = getPool();
    
    // Check if issue exists
    const [issues] = await pool.execute(
      'SELECT id FROM issues WHERE id = ?',
      [issueId]
    );
    
    if (issues.length === 0) {
      return res.status(404).json({ error: 'ไม่พบปัญหาที่ต้องการ' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      try {
        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const extension = path.extname(file.originalname) || '.jpg';
        const filename = `issue_${issueId}_${timestamp}_${random}${extension}`;
        const filepath = path.join(uploadsDir, filename);

        // Process and optimize image using Sharp
        let imageBuffer = file.buffer;
        
        // Resize if too large and convert to JPEG for consistency
        imageBuffer = await sharp(file.buffer)
          .resize(1920, 1920, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .jpeg({ 
            quality: 85,
            progressive: true 
          })
          .toBuffer();

        // Save file to disk
        await fs.promises.writeFile(filepath, imageBuffer);

        // Save file info to database
        const [result] = await pool.execute(
          'INSERT INTO issue_images (issue_id, image_path, image_size, mime_type, is_admin_image) VALUES (?, ?, ?, ?, ?)',
          [issueId, filename, imageBuffer.length, 'image/jpeg', isAdmin === 'true' || isAdmin === true]
        );

        uploadedFiles.push({
          id: result.insertId,
          filename: filename,
          originalName: file.originalname,
          size: imageBuffer.length,
          path: `/uploads/${filename}`
        });

      } catch (fileError) {
        console.error('Error processing file:', fileError);
        // Continue with other files even if one fails
      }
    }

    if (uploadedFiles.length === 0) {
      return res.status(500).json({ error: 'ไม่สามารถอัพโหลดไฟล์ได้' });
    }

    res.json({
      success: true,
      message: `อัพโหลดรูปภาพเรียบร้อยแล้ว ${uploadedFiles.length} ไฟล์`,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)' });
      }
      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: 'อัพโหลดได้สูงสุด 2 ไฟล์' });
      }
    }
    
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการอัพโหลด',
      message: error.message
    });
  }
});

// DELETE /api/upload/image/:imageId - Delete uploaded image
router.delete('/image/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const pool = getPool();
    
    // Get image info
    const [images] = await pool.execute(
      'SELECT id, image_path FROM issue_images WHERE id = ?',
      [imageId]
    );
    
    if (images.length === 0) {
      return res.status(404).json({ error: 'ไม่พบรูปภาพที่ต้องการลบ' });
    }
    
    const image = images[0];
    const filepath = path.join(uploadsDir, image.image_path);
    
    // Delete file from disk
    try {
      if (fs.existsSync(filepath)) {
        await fs.promises.unlink(filepath);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue even if file deletion fails
    }
    
    // Delete from database
    await pool.execute('DELETE FROM issue_images WHERE id = ?', [imageId]);

    res.json({
      success: true,
      message: 'ลบรูปภาพเรียบร้อยแล้ว'
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการลบรูปภาพ',
      message: error.message
    });
  }
});

// GET /api/upload/image/:filename - Serve uploaded images
router.get('/image/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(uploadsDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'ไม่พบไฟล์รูปภาพ' });
    }
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31557600'); // 1 year cache
    
    // Send file
    res.sendFile(filepath);

  } catch (error) {
    console.error('Serve image error:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการโหลดรูปภาพ',
      message: error.message
    });
  }
});

// Utility function to clean up orphaned files (can be called by cron job)
const cleanupOrphanedFiles = async () => {
  try {
    const pool = getPool();
    
    // Get all files in uploads directory
    const files = await fs.promises.readdir(uploadsDir);
    
    // Get all image paths from database
    const [dbImages] = await pool.execute('SELECT image_path FROM issue_images');
    const dbImagePaths = dbImages.map(img => img.image_path);
    
    // Find orphaned files
    const orphanedFiles = files.filter(file => !dbImagePaths.includes(file));
    
    // Delete orphaned files
    for (const file of orphanedFiles) {
      try {
        await fs.promises.unlink(path.join(uploadsDir, file));
        console.log(`Deleted orphaned file: ${file}`);
      } catch (error) {
        console.error(`Error deleting orphaned file ${file}:`, error);
      }
    }
    
    return orphanedFiles.length;
    
  } catch (error) {
    console.error('Cleanup error:', error);
    return 0;
  }
};

// GET /api/upload/cleanup - Manual cleanup endpoint (for admin)
router.get('/cleanup', async (req, res) => {
  try {
    const deletedCount = await cleanupOrphanedFiles();
    
    res.json({
      success: true,
      message: `ล้างไฟล์ที่ไม่ใช้แล้วเรียบร้อย จำนวน ${deletedCount} ไฟล์`
    });
    
  } catch (error) {
    console.error('Manual cleanup error:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการล้างไฟล์',
      message: error.message
    });
  }
});

module.exports = router; 