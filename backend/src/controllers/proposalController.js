const db = require('../config/db');
const { logActivity } = require('../utils/logger');

function safeParseJSON(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return null;
  }
}

/** Shape a flat DB row into the nested object the frontend expects */
function shapeProposal(row, items = [], activity = []) {
  return {
    id:         String(row.id),
    number:     row.number,
    client:     row.client_id ? String(row.client_id) : 'custom',
    customClient: safeParseJSON(row.custom_client),
    owner:      row.owner_id ? String(row.owner_id) : null,
    status:     row.status,
    title:      row.title,
    service:    row.service,
    currency:   row.currency,
    discount:   row.discount,
    tax:        row.tax,
    views:      row.views,
    lastViewed: row.last_viewed,
    createdAt:  row.created_at,
    updatedAt:  row.updated_at,
    expiresAt:  row.expires_at,
    sentAt:     row.sent_at,
    acceptedAt: row.accepted_at,
    projectOverview:  row.project_overview,
    proposedSolution: row.proposed_solution,
    scopeItems:       safeParseJSON(row.scope_items)  || [],
    pages:            safeParseJSON(row.pages)         || [],
    features:         safeParseJSON(row.features)      || [],
    techStack:        safeParseJSON(row.tech_stack)    || {},
    timeline:         safeParseJSON(row.timeline)      || [],
    paymentSchedule:  safeParseJSON(row.payment_schedule) || [],
    terms:            row.terms || '',
    signature:        safeParseJSON(row.signature)     || {},
    companyLogo:      row.company_logo    || null,
    items:    (items  || []).map(it => ({ desc: it.desc, qty: it.qty, rate: it.rate })),
    activity: (activity || []).map(a => ({ at: a.at_date, label: a.label, by: a.by_name, note: a.note })),
  };
}

// GET /api/proposals
async function list(req, res) {
  try {
    let sql = `SELECT p.*, c.name AS client_name
               FROM proposals p
               LEFT JOIN clients c ON p.client_id = c.id`;
    const params = [];
    if (req.user.role === 'sales') {
      sql += ' WHERE p.owner_id = ?';
      params.push(req.user.id);
    }
    sql += ' ORDER BY p.updated_at DESC';

    const [proposals] = await db.execute(sql, params);

    // Fetch items for all proposals in one query
    const ids = proposals.map(p => p.id);
    let items = [], activity = [];
    if (ids.length) {
      const placeholders = ids.map(() => '?').join(',');
      [items]    = await db.execute(`SELECT * FROM proposal_items    WHERE proposal_id IN (${placeholders}) ORDER BY sort_order`, ids);
      [activity] = await db.execute(`SELECT * FROM proposal_activity WHERE proposal_id IN (${placeholders}) ORDER BY at_date`, ids);
    }

    const shaped = proposals.map(p => shapeProposal(
      p,
      items.filter(i => i.proposal_id === p.id),
      activity.filter(a => a.proposal_id === p.id),
    ));

    res.json({ success: true, data: shaped });
  } catch (err) {
    console.error('list proposals error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// GET /api/proposals/:id
async function getOne(req, res) {
  try {
    const [rows] = await db.execute('SELECT * FROM proposals WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Proposal not found' });

    if (req.user.role === 'sales' && rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions to view this proposal' });
    }

    const [items]    = await db.execute('SELECT * FROM proposal_items    WHERE proposal_id = ? ORDER BY sort_order', [req.params.id]);
    const [activity] = await db.execute('SELECT * FROM proposal_activity WHERE proposal_id = ? ORDER BY at_date',   [req.params.id]);

    res.json({ success: true, data: shapeProposal(rows[0], items, activity) });
  } catch (err) {
    console.error('getOne error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// POST /api/proposals
async function create(req, res) {
  const p = req.body;
  const id     = p.id     || `p-${Date.now()}`;
  const number = p.number || `MZ-${new Date().getFullYear()}-${String(Math.floor(Math.random()*900)+100).padStart(4,'0')}`;
  const stamp  = new Date().toISOString().slice(0, 10);

  try {
    await db.execute(
      `INSERT INTO proposals
        (id,number,client_id,custom_client,owner_id,status,title,service,currency,discount,tax,
         created_at,updated_at,expires_at,
         project_overview,proposed_solution,scope_items,pages,features,tech_stack,
         timeline,payment_schedule,terms,signature,company_logo)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id, number,
        (p.client && p.client !== 'custom') ? p.client : null,
        p.customClient ? JSON.stringify(p.customClient) : null,
        p.owner || req.user.id,
        p.status || 'draft',
        p.title || null, p.service || null, p.currency || 'INR',
        p.discount || 0, p.tax || 0.18,
        p.createdAt || stamp, stamp,
        p.expiresAt || null,
        p.projectOverview  || null,
        p.proposedSolution || null,
        p.scopeItems       ? JSON.stringify(p.scopeItems)       : null,
        p.pages            ? JSON.stringify(p.pages)            : null,
        p.features         ? JSON.stringify(p.features)         : null,
        p.techStack        ? JSON.stringify(p.techStack)        : null,
        p.timeline         ? JSON.stringify(p.timeline)         : null,
        p.paymentSchedule  ? JSON.stringify(p.paymentSchedule)  : null,
        p.terms || null,
        p.signature        ? JSON.stringify(p.signature)        : null,
        p.companyLogo || null,
      ]
    );

    // Insert items
    if (p.items?.length) {
      for (let i = 0; i < p.items.length; i++) {
        const it = p.items[i];
        await db.execute(
          'INSERT INTO proposal_items (proposal_id,`desc`,qty,rate,sort_order) VALUES (?,?,?,?,?)',
          [id, it.desc, it.qty, it.rate, i]
        );
      }
    }

    // Insert initial activity
    if (p.activity?.length) {
      for (const a of p.activity) {
        await db.execute(
          'INSERT INTO proposal_activity (proposal_id,at_date,label,by_name,note) VALUES (?,?,?,?,?)',
          [id, a.at, a.label, a.by, a.note || null]
        );
      }
    } else {
      await db.execute(
        'INSERT INTO proposal_activity (proposal_id,at_date,label,by_name) VALUES (?,?,?,?)',
        [id, stamp, 'Proposal created', req.user.name]
      );
    }

    await logActivity(req.user.id, req.user.name, 'Proposal Created', `Created proposal ${number} - "${p.title}"`);

    const [rows] = await db.execute('SELECT * FROM proposals WHERE id = ?', [id]);
    const [items]    = await db.execute('SELECT * FROM proposal_items    WHERE proposal_id = ? ORDER BY sort_order', [id]);
    const [activity] = await db.execute('SELECT * FROM proposal_activity WHERE proposal_id = ? ORDER BY at_date',   [id]);

    // Create notification
    try {
      await db.execute(
        "INSERT INTO notifications (id, type, title, message, time, `read`, link) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [`n-${Date.now()}`, 'created', 'New Proposal Created', `${req.user.name} created proposal ${number}`, 'Just now', 0, `/proposals/${id}`]
      );
    } catch (errNotif) {
      console.error('Failed to create proposal created notification:', errNotif.message);
    }

    res.status(201).json({ success: true, data: shapeProposal(rows[0], items, activity) });
  } catch (err) {
    console.error('create error:', err);
    res.status(500).json({ success: false, message: 'Server error', detail: err.message });
  }
}

// PUT /api/proposals/:id
async function update(req, res) {
  const p = req.body;
  const stamp = new Date().toISOString().slice(0, 10);
  try {
    const [existing] = await db.execute('SELECT owner_id FROM proposals WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Proposal not found' });
    if (req.user.role === 'sales' && existing[0].owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions to update this proposal' });
    }

    await db.execute(
      `UPDATE proposals SET
        client_id=?, custom_client=?, status=?, title=?, service=?, currency=?,
        discount=?, tax=?, updated_at=?, expires_at=?,
        project_overview=?, proposed_solution=?, scope_items=?, pages=?, features=?,
        tech_stack=?, timeline=?, payment_schedule=?, terms=?, signature=?, company_logo=?
       WHERE id=?`,
      [
        (p.client && p.client !== 'custom') ? p.client : null,
        p.customClient ? JSON.stringify(p.customClient) : null,
        p.status || 'draft', p.title || null, p.service || null, p.currency || 'INR',
        p.discount || 0, p.tax || 0.18, stamp, p.expiresAt || null,
        p.projectOverview  || null, p.proposedSolution || null,
        p.scopeItems       ? JSON.stringify(p.scopeItems)       : null,
        p.pages            ? JSON.stringify(p.pages)            : null,
        p.features         ? JSON.stringify(p.features)         : null,
        p.techStack        ? JSON.stringify(p.techStack)        : null,
        p.timeline         ? JSON.stringify(p.timeline)         : null,
        p.paymentSchedule  ? JSON.stringify(p.paymentSchedule)  : null,
        p.terms || null,
        p.signature        ? JSON.stringify(p.signature)        : null,
        p.companyLogo || null,
        req.params.id,
      ]
    );

    // Replace items
    await db.execute('DELETE FROM proposal_items WHERE proposal_id = ?', [req.params.id]);
    if (p.items?.length) {
      for (let i = 0; i < p.items.length; i++) {
        const it = p.items[i];
        await db.execute(
          'INSERT INTO proposal_items (proposal_id,`desc`,qty,rate,sort_order) VALUES (?,?,?,?,?)',
          [req.params.id, it.desc, it.qty, it.rate, i]
        );
      }
    }

    const [rows]     = await db.execute('SELECT * FROM proposals WHERE id = ?', [req.params.id]);
    const [items]    = await db.execute('SELECT * FROM proposal_items    WHERE proposal_id = ? ORDER BY sort_order', [req.params.id]);
    const [activity] = await db.execute('SELECT * FROM proposal_activity WHERE proposal_id = ? ORDER BY at_date',   [req.params.id]);

    await logActivity(req.user.id, req.user.name, 'Proposal Updated', `Updated proposal ${rows[0].number} - "${p.title}"`);

    res.json({ success: true, data: shapeProposal(rows[0], items, activity) });
  } catch (err) {
    console.error('update error:', err);
    res.status(500).json({ success: false, message: 'Server error', detail: err.message });
  }
}

// PATCH /api/proposals/:id/status
async function updateStatus(req, res) {
  const { status, note } = req.body;
  const stamp = new Date().toISOString().slice(0, 10);
  const labelMap = {
    pending:'Submitted for approval', approved:'Approved', rejected:'Rejected',
    sent:'Sent to client', accepted:'Client accepted', cancelled:'Cancelled', draft:'Reverted to draft',
  };
  try {
    const [existing] = await db.execute('SELECT owner_id FROM proposals WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Proposal not found' });
    if (req.user.role === 'sales' && existing[0].owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions to update status of this proposal' });
    }

    const extra = {};
    if (status === 'sent')     extra.sent_at     = stamp;
    if (status === 'accepted') extra.accepted_at = stamp;

    let sql = 'UPDATE proposals SET status=?, updated_at=?';
    const params = [status, stamp];
    for (const [k, v] of Object.entries(extra)) { sql += `, ${k}=?`; params.push(v); }
    sql += ' WHERE id=?'; params.push(req.params.id);
    await db.execute(sql, params);

    await db.execute(
      'INSERT INTO proposal_activity (proposal_id,at_date,label,by_name,note) VALUES (?,?,?,?,?)',
      [req.params.id, stamp, labelMap[status] || `Status → ${status}`, req.user.name, note || null]
    );

    const [rows]     = await db.execute('SELECT * FROM proposals WHERE id = ?', [req.params.id]);
    const [items]    = await db.execute('SELECT * FROM proposal_items    WHERE proposal_id = ? ORDER BY sort_order', [req.params.id]);
    const [activity] = await db.execute('SELECT * FROM proposal_activity WHERE proposal_id = ? ORDER BY at_date',   [req.params.id]);

    // Create notification
    try {
      const typeMap = {
        pending: 'pending_approval',
        approved: 'approved',
        rejected: 'rejected',
        sent: 'sent',
        accepted: 'accepted',
        cancelled: 'cancelled',
        draft: 'reverted'
      };
      const titleMap = {
        pending: 'Proposal Submitted',
        approved: 'Proposal Approved',
        rejected: 'Proposal Rejected',
        sent: 'Proposal Sent',
        accepted: 'Proposal Accepted',
        cancelled: 'Proposal Cancelled',
        draft: 'Proposal Reverted'
      };
      const type = typeMap[status] || 'status_changed';
      const title = titleMap[status] || 'Status Updated';
      const msg = `Proposal ${rows[0].number} is now "${labelMap[status] || status}" (updated by ${req.user.name})`;

      await db.execute(
        "INSERT INTO notifications (id, type, title, message, time, `read`, link) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [`n-${Date.now()}`, type, title, msg, 'Just now', 0, `/proposals/${req.params.id}`]
      );
    } catch (errNotif) {
      console.error('Failed to create status notification:', errNotif.message);
    }

    res.json({ success: true, data: shapeProposal(rows[0], items, activity) });
  } catch (err) {
    console.error('updateStatus error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// DELETE /api/proposals/:id
async function remove(req, res) {
  try {
    const [rows] = await db.execute('SELECT number, owner_id FROM proposals WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Proposal not found' });
    
    if (req.user.role === 'sales' && rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions to delete this proposal' });
    }

    const num = rows[0].number;
    await db.execute('DELETE FROM proposals WHERE id = ?', [req.params.id]);
    
    // Log system activity
    await logActivity(req.user.id, req.user.name, 'Proposal Deleted', `Deleted proposal ${num}`);
    
    res.json({ success: true, message: 'Proposal deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// POST /api/proposals/:id/duplicate
async function duplicate(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM proposals WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Proposal not found' });
    const original = rows[0];

    if (req.user.role === 'sales' && original.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions to duplicate this proposal' });
    }

    const [items] = await db.execute('SELECT * FROM proposal_items WHERE proposal_id = ? ORDER BY sort_order', [id]);

    const newId = `p-${Date.now()}`;
    
    const [settings] = await db.execute('SELECT number_prefix, next_number FROM settings WHERE id = 1');
    const prefix = settings[0]?.number_prefix || 'MZ';
    const nextNum = String(Number(settings[0]?.next_number || 100) + 1).padStart(4, '0');
    
    await db.execute('UPDATE settings SET next_number = ? WHERE id = 1', [nextNum]);
    
    const newNumber = `${prefix}-${new Date().getFullYear()}-${nextNum}`;
    const stamp = new Date().toISOString().slice(0, 10);

    await db.execute(
      `INSERT INTO proposals
        (id, number, client_id, custom_client, owner_id, status, title, service, currency, discount, tax,
         created_at, updated_at, expires_at,
         project_overview, proposed_solution, scope_items, pages, features, tech_stack,
         timeline, payment_schedule, terms, signature, company_logo, attachments)
       VALUES (?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId, newNumber, original.client_id, original.custom_client, req.user.id,
        `Duplicate of ${original.title}`, original.service, original.currency, original.discount, original.tax,
        stamp, stamp, null,
        original.project_overview, original.proposed_solution, original.scope_items, original.pages,
        original.features, original.tech_stack, original.timeline, original.payment_schedule, original.terms,
        original.signature, original.company_logo, original.attachments
      ]
    );

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      await db.execute(
        'INSERT INTO proposal_items (proposal_id, `desc`, qty, rate, sort_order) VALUES (?, ?, ?, ?, ?)',
        [newId, it.desc, it.qty, it.rate, i]
      );
    }

    await db.execute(
      'INSERT INTO proposal_activity (proposal_id, at_date, label, by_name, note) VALUES (?, ?, ?, ?, ?)',
      [newId, stamp, 'Proposal duplicated', req.user.name, `Duplicated from ${original.number}`]
    );
    
    await logActivity(req.user.id, req.user.name, 'Proposal Duplicated', `Duplicated proposal ${original.number} to ${newNumber}`);

    const [newPropRows] = await db.execute('SELECT * FROM proposals WHERE id = ?', [newId]);
    const [newItems] = await db.execute('SELECT * FROM proposal_items WHERE proposal_id = ? ORDER BY sort_order', [newId]);
    const [newActivities] = await db.execute('SELECT * FROM proposal_activity WHERE proposal_id = ? ORDER BY at_date', [newId]);

    res.status(201).json({ success: true, data: shapeProposal(newPropRows[0], newItems, newActivities) });
  } catch (err) {
    console.error('duplicate proposal error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// POST /api/proposals/:id/send
async function sendProposal(req, res) {
  const { id } = req.params;
  const stamp = new Date().toISOString().slice(0, 10);
  try {
    const [rows] = await db.execute('SELECT * FROM proposals WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Proposal not found' });
    const proposal = rows[0];

    if (req.user.role === 'sales' && proposal.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions to send this proposal' });
    }

    await db.execute(
      'UPDATE proposals SET status = ?, sent_at = ?, updated_at = ? WHERE id = ?',
      ['sent', stamp, stamp, id]
    );

    await db.execute(
      'INSERT INTO proposal_activity (proposal_id, at_date, label, by_name) VALUES (?, ?, "Sent to client", ?)',
      [id, stamp, req.user.name]
    );

    await logActivity(req.user.id, req.user.name, 'Proposal Sent', `Sent proposal ${proposal.number} to client`);

    if (proposal.owner_id) {
      await db.execute('UPDATE users SET proposals_sent = proposals_sent + 1 WHERE id = ?', [proposal.owner_id]);
    }

    if (proposal.service) {
      await db.execute('UPDATE templates SET uses = uses + 1 WHERE service = ?', [proposal.service]);
    }

    try {
      await db.execute(
        "INSERT INTO notifications (id, type, title, message, time, `read`, link) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [`n-${Date.now()}`, 'sent', 'Proposal Sent', `Proposal ${proposal.number} was sent to the client`, 'Just now', 0, `/proposals/${id}`]
      );
    } catch (errNotif) {
      console.error('Failed to create status notification:', errNotif.message);
    }

    const [updatedProp] = await db.execute('SELECT * FROM proposals WHERE id = ?', [id]);
    const [items] = await db.execute('SELECT * FROM proposal_items WHERE proposal_id = ? ORDER BY sort_order', [id]);
    const [activity] = await db.execute('SELECT * FROM proposal_activity WHERE proposal_id = ? ORDER BY at_date', [id]);

    res.json({ success: true, data: shapeProposal(updatedProp[0], items, activity) });
  } catch (err) {
    console.error('sendProposal error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

const tempPdfs = new Map();
const crypto = require('crypto');

async function storeTempPdf(req, res) {
  try {
    const { pdfData, filename, disposition } = req.body;
    if (!pdfData) {
      return res.status(400).json({ success: false, message: 'Missing pdfData' });
    }
    const key = crypto.randomUUID();
    const pdfBuffer = Buffer.from(pdfData, 'base64');
    tempPdfs.set(key, { pdfBuffer, filename, disposition: disposition || 'attachment' });

    setTimeout(() => {
      tempPdfs.delete(key);
    }, 120000);

    return res.status(200).json({ success: true, key });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function downloadTempPdf(req, res) {
  try {
    const { key, filename: urlFilename } = req.params;
    const item = tempPdfs.get(key);
    if (!item) {
      return res.status(404).send('PDF link has expired or is invalid. Please try downloading/viewing again.');
    }
    res.setHeader('Content-Type', 'application/pdf');

    // Prefer the filename from the URL param, fall back to stored filename
    let rawName = urlFilename
      ? decodeURIComponent(urlFilename)
      : (item.filename || 'Proposal.pdf');

    // Always ensure the filename ends with .pdf
    let safeName = rawName.replace(/"/g, '_');
    if (!safeName.toLowerCase().endsWith('.pdf')) {
      safeName = safeName + '.pdf';
    }

    res.setHeader(
      'Content-Disposition',
      `${item.disposition}; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`
    );
    res.send(item.pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
}

module.exports = { list, getOne, create, update, updateStatus, remove, duplicate, sendProposal, storeTempPdf, downloadTempPdf };
