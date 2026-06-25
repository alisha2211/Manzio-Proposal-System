const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Dental Equipment Proposal",
      client: "ABC Dental Clinic",
      amount: 25000,
      status: "Pending"
    }
  ]);
});

module.exports = router;