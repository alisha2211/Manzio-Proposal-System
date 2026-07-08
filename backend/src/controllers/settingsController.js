const db = require('../config/db');
const { saveBase64File } = require('../utils/fileUpload');
const { logActivity } = require('../utils/logger');

async function getSettings(req, res) {
  try {
    const [rows] = await db.execute('SELECT * FROM settings WHERE id = 1');
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Settings not found' });
    }
    const r = rows[0];
    res.json({
      success: true,
      data: {
        companyName: r.company_name,
        address: r.address,
        phone: r.phone,
        email: r.email,
        website: r.website,
        gstNumber: r.gst_number,
        currency: r.currency,
        taxPercentage: r.tax_percentage,
        companyLogo: r.company_logo,
        numberPrefix: r.number_prefix,
        numberFormat: r.number_format,
        nextNumber: r.next_number,
        validityDays: r.validity_days,
      }
    });
  } catch (err) {
    console.error('get settings error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function updateSettings(req, res) {
  const s = req.body;
  try {
    await db.execute(
      `UPDATE settings SET
        company_name = ?, address = ?, phone = ?, email = ?, website = ?, gst_number = ?,
        currency = ?, tax_percentage = ?, company_logo = ?, number_prefix = ?,
        number_format = ?, next_number = ?, validity_days = ?
       WHERE id = 1`,
      [
        s.companyName || 'Manzio Creative Studio',
        s.address || null,
        s.phone || null,
        s.email || null,
        s.website || null,
        s.gstNumber || null,
        s.currency || 'INR',
        s.taxPercentage !== undefined ? Number(s.taxPercentage) : 18.0,
        s.companyLogo !== undefined ? s.companyLogo : null,
        s.numberPrefix || 'MZ',
        s.numberFormat || '{PREFIX}-{YYYY}-{####}',
        s.nextNumber || '0122',
        s.validityDays !== undefined ? Number(s.validityDays) : 30
      ]
    );

    const [rows] = await db.execute('SELECT * FROM settings WHERE id = 1');
    const r = rows[0];
    res.json({
      success: true,
      data: {
        companyName: r.company_name,
        address: r.address,
        phone: r.phone,
        email: r.email,
        website: r.website,
        gstNumber: r.gst_number,
        currency: r.currency,
        taxPercentage: r.tax_percentage,
        companyLogo: r.company_logo,
        numberPrefix: r.number_prefix,
        numberFormat: r.number_format,
        nextNumber: r.next_number,
        validityDays: r.validity_days,
      }
    });
  } catch (err) {
    console.error('update settings error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function uploadLogo(req, res) {
  const { logo } = req.body;
  if (!logo) {
    return res.status(400).json({ success: false, message: 'Logo data is required' });
  }
  try {
    const logoPath = saveBase64File(logo, 'logo');
    if (!logoPath) {
      return res.status(400).json({ success: false, message: 'Invalid logo format' });
    }
    
    await db.execute('UPDATE settings SET company_logo = ? WHERE id = 1', [logoPath]);
    
    await logActivity(req.user.id, req.user.name, 'Logo Uploaded', `Uploaded company logo to ${logoPath}`);

    const [rows] = await db.execute('SELECT * FROM settings WHERE id = 1');
    const r = rows[0];
    res.json({
      success: true,
      data: {
        companyName: r.company_name,
        address: r.address,
        phone: r.phone,
        email: r.email,
        website: r.website,
        gstNumber: r.gst_number,
        currency: r.currency,
        taxPercentage: r.tax_percentage,
        companyLogo: r.company_logo,
        numberPrefix: r.number_prefix,
        numberFormat: r.number_format,
        nextNumber: r.next_number,
        validityDays: r.validity_days,
      }
    });
  } catch (err) {
    console.error('upload logo error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getSettings, updateSettings, uploadLogo };
