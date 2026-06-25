const express = require("express");
const cors = require("cors");

const proposalRoutes = require("./src/routes/proposalRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/proposals", proposalRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Manzio Backend Running 🚀"
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});