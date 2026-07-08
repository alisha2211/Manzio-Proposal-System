const db = require("../config/db");

// Get all proposals
const getAllProposals = async () => {
  const [rows] = await db.query(
    "SELECT * FROM proposals ORDER BY created_at DESC"
  );
  return rows;
};

// Get proposal by ID
const getProposalById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM proposals WHERE id = ?",
    [id]
  );

  return rows[0];
};

// Create proposal
const createProposal = async (proposal) => {
  const {
    title,
    client_name,
    description,
    total_amount,
    status,
  } = proposal;

  const [result] = await db.query(
    `INSERT INTO proposals
    (title, client_name, description, total_amount, status)
    VALUES (?, ?, ?, ?, ?)`,
    [
      title,
      client_name,
      description,
      total_amount,
      status || "Draft",
    ]
  );

  return result.insertId;
};

// Update proposal
const updateProposal = async (id, proposal) => {
  const {
    title,
    client_name,
    description,
    total_amount,
    status,
  } = proposal;

  await db.query(
    `UPDATE proposals
     SET title=?,
         client_name=?,
         description=?,
         total_amount=?,
         status=?
     WHERE id=?`,
    [
      title,
      client_name,
      description,
      total_amount,
      status,
      id,
    ]
  );
};

// Delete proposal
const deleteProposal = async (id) => {
  await db.query(
    "DELETE FROM proposals WHERE id=?",
    [id]
  );
};

module.exports = {
  getAllProposals,
  getProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
};