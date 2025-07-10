const { getPool } = require('../config/database');
const fs = require('fs');
const path = require('path');

class CleanupService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../uploads');
  }

  // Main cleanup function
  async runCleanup() {
    try {
      console.log('🧹 Starting automated cleanup process...');
      
      const deletedIssues = await this.cleanupOldIssues();
      const deletedFiles = await this.cleanupOrphanedFiles();
      
      console.log(`✅ Cleanup completed: ${deletedIssues} issues deleted, ${deletedFiles} orphaned files removed`);
      
      return {
        deletedIssues,
        deletedFiles,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Cleanup process failed:', error);
      throw error;
    }
  }

  // Delete completed issues older than 30 days
  async cleanupOldIssues() {
    try {
      const pool = getPool();
      
      // Get images for issues that will be deleted
      const [imagesToDelete] = await pool.execute(`
        SELECT ii.image_path 
        FROM issue_images ii
        INNER JOIN issues i ON ii.issue_id = i.id
        WHERE i.status = 'completed' 
        AND i.updated_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);

      // Delete physical image files
      for (const image of imagesToDelete) {
        try {
          const filePath = path.join(this.uploadsDir, image.image_path);
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log(`🗑️ Deleted image file: ${image.image_path}`);
          }
        } catch (fileError) {
          console.error(`Failed to delete image file ${image.image_path}:`, fileError);
        }
      }

      // Delete issues (cascade will handle related records)
      const [result] = await pool.execute(`
        DELETE FROM issues 
        WHERE status = 'completed' 
        AND updated_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);

      console.log(`🗑️ Deleted ${result.affectedRows} completed issues older than 30 days`);
      return result.affectedRows;
      
    } catch (error) {
      console.error('Error cleaning up old issues:', error);
      throw error;
    }
  }

  // Clean up orphaned files that don't have database records
  async cleanupOrphanedFiles() {
    try {
      const pool = getPool();
      
      // Get all files in uploads directory
      if (!fs.existsSync(this.uploadsDir)) {
        console.log('📁 Uploads directory does not exist, skipping file cleanup');
        return 0;
      }

      const files = await fs.promises.readdir(this.uploadsDir);
      
      // Get all image paths from database
      const [dbImages] = await pool.execute('SELECT image_path FROM issue_images');
      const dbImagePaths = dbImages.map(img => img.image_path);
      
      // Find orphaned files
      const orphanedFiles = files.filter(file => !dbImagePaths.includes(file));
      
      // Delete orphaned files
      let deletedCount = 0;
      for (const file of orphanedFiles) {
        try {
          const filePath = path.join(this.uploadsDir, file);
          await fs.promises.unlink(filePath);
          console.log(`🗑️ Deleted orphaned file: ${file}`);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete orphaned file ${file}:`, error);
        }
      }
      
      console.log(`🗑️ Deleted ${deletedCount} orphaned files`);
      return deletedCount;
      
    } catch (error) {
      console.error('Error cleaning up orphaned files:', error);
      throw error;
    }
  }

  // Get cleanup statistics
  async getCleanupStats() {
    try {
      const pool = getPool();
      
      // Count issues eligible for cleanup
      const [eligibleIssues] = await pool.execute(`
        SELECT COUNT(*) as count 
        FROM issues 
        WHERE status = 'completed' 
        AND updated_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);

      // Count all files in uploads directory
      let totalFiles = 0;
      let orphanedFiles = 0;
      
      if (fs.existsSync(this.uploadsDir)) {
        const files = await fs.promises.readdir(this.uploadsDir);
        totalFiles = files.length;
        
        const [dbImages] = await pool.execute('SELECT image_path FROM issue_images');
        const dbImagePaths = dbImages.map(img => img.image_path);
        orphanedFiles = files.filter(file => !dbImagePaths.includes(file)).length;
      }

      return {
        eligibleIssuesForCleanup: eligibleIssues[0].count,
        totalFilesInUploads: totalFiles,
        orphanedFiles: orphanedFiles,
        lastCheck: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error getting cleanup stats:', error);
      throw error;
    }
  }

  // Start automatic cleanup scheduler (runs daily)
  startAutoCleanup() {
    console.log('🔄 Starting automatic cleanup scheduler (runs daily at 2:00 AM)');
    
    // Calculate time until next 2:00 AM
    const now = new Date();
    const next2AM = new Date();
    next2AM.setHours(2, 0, 0, 0);
    
    if (next2AM <= now) {
      next2AM.setDate(next2AM.getDate() + 1);
    }
    
    const timeUntilNext2AM = next2AM.getTime() - now.getTime();
    
    // Set initial timeout
    setTimeout(() => {
      this.runCleanup();
      
      // Then run every 24 hours
      setInterval(() => {
        this.runCleanup();
      }, 24 * 60 * 60 * 1000); // 24 hours
      
    }, timeUntilNext2AM);
    
    console.log(`⏰ Next cleanup scheduled for: ${next2AM.toLocaleString('th-TH')}`);
  }
}

module.exports = CleanupService; 