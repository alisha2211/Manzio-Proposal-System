const fs = require('fs');
const path = require('path');

/**
 * Saves a base64 encoded file string to the uploads directory.
 * @param {string} base64Data - The data URL string (e.g., "data:image/png;base64,iVBORw...")
 * @param {string} prefix - Filename prefix (e.g., "logo", "avatar", "attachment")
 * @returns {string} - The public relative path (e.g. "/uploads/logo_1782967674107.png")
 */
function saveBase64File(base64Data, prefix) {
  if (!base64Data) return null;
  
  // Clean prefix
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '');
  
  // Match format: data:image/png;base64,xxxx or data:application/pdf;base64,xxxx
  const matches = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-+.]+);base64,(.+)$/);
  
  let mimeType, base64Content;
  if (matches && matches.length === 3) {
    mimeType = matches[1];
    base64Content = matches[2];
  } else {
    // If not a data URI, check if it's already a saved upload path
    if (base64Data.startsWith('/uploads/')) {
      return base64Data;
    }
    return null;
  }
  
  // Resolve extension
  let ext = 'bin';
  if (mimeType.includes('/')) {
    ext = mimeType.split('/')[1];
    // sanitize common extensions
    if (ext === 'jpeg') ext = 'jpg';
    else if (ext.includes('svg')) ext = 'svg';
    else if (ext.includes('pdf')) ext = 'pdf';
    else if (ext.includes('sheet')) ext = 'xlsx';
    else if (ext.includes('document')) ext = 'docx';
  }
  
  const buffer = Buffer.from(base64Content, 'base64');
  const filename = `${cleanPrefix}_${Date.now()}.${ext}`;
  const uploadDir = path.join(__dirname, '../../uploads');
  
  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, buffer);
  
  return `/uploads/${filename}`;
}

module.exports = { saveBase64File };
