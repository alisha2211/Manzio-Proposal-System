const db = require('../config/db');

async function getStats(req, res) {
  try {
    // 1. Get proposals status counts
    const [statusRows] = await db.execute(
      'SELECT status, COUNT(*) as count FROM proposals GROUP BY status'
    );
    
    let totalProposals = 0;
    let draftProposals = 0;
    let sentProposals = 0;
    let acceptedProposals = 0;
    let rejectedProposals = 0;
    let pendingApprovals = 0;
    
    statusRows.forEach(row => {
      const count = Number(row.count);
      totalProposals += count;
      if (row.status === 'draft') draftProposals = count;
      else if (row.status === 'sent') sentProposals = count;
      else if (row.status === 'accepted') acceptedProposals = count;
      else if (row.status === 'rejected' || row.status === 'expired') rejectedProposals += count;
      else if (row.status === 'pending') pendingApprovals = count;
    });

    // 2. Get active clients count
    const [clientRows] = await db.execute('SELECT COUNT(*) as count FROM clients');
    const clientsCount = Number(clientRows[0].count);

    // 3. Compute revenue from accepted proposals
    const [acceptedProps] = await db.execute(
      "SELECT id, discount, tax FROM proposals WHERE status = 'accepted'"
    );
    
    let revenue = 0;
    if (acceptedProps.length > 0) {
      const propIds = acceptedProps.map(p => p.id);
      const placeholders = propIds.map(() => '?').join(',');
      const [items] = await db.execute(
        `SELECT proposal_id, qty, rate FROM proposal_items WHERE proposal_id IN (${placeholders})`,
        propIds
      );
      
      acceptedProps.forEach(p => {
        const pItems = items.filter(it => it.proposal_id === p.id);
        const subtotal = pItems.reduce((sum, it) => sum + (it.qty * it.rate), 0);
        const discountAmt = subtotal * (p.discount || 0);
        const taxable = subtotal - discountAmt;
        const taxAmt = taxable * (p.tax || 0.18);
        const total = taxable + taxAmt;
        revenue += total;
      });
    }

    // 4. Get recent system activities
    const [activityRows] = await db.execute(
      'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10'
    );
    const recentActivities = activityRows.map(row => ({
      id: row.id,
      userId: row.user_id,
      userName: row.user_name,
      action: row.action,
      description: row.description,
      createdAt: row.created_at
    }));

    // 5. Get recent notifications
    const [notificationRows] = await db.execute(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10'
    );
    const recentNotifications = notificationRows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      message: row.message,
      time: row.time,
      read: !!row.read,
      link: row.link,
      createdAt: row.created_at
    }));

    res.json({
      success: true,
      data: {
        totalProposals,
        draftProposals,
        sentProposals,
        acceptedProposals,
        rejectedProposals,
        clientsCount,
        revenue,
        pendingApprovals,
        recentActivities,
        recentNotifications
      }
    });
  } catch (err) {
    console.error('dashboard stats error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getStats };
