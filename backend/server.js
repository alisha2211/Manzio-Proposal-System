const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Mock Database (Replace this with your real database model later)
const users = [
    {
        email: "admin@manzio.com",
        // This is a hashed version of the password "password123"
        passwordHash: "$2a$10$X7vH7KxW7xR8gZ6vK9yQOuG2p7B1vYm3G5vK9yQOuG2p7B1vYm3G5", 
        role: "admin" // Matches the first button in your UI
    },
    {
        email: "manager@manzio.com",
        passwordHash: "$2a$10$X7vH7KxW7xR8gZ6vK9yQOuG2p7B1vYm3G5vK9yQOuG2p7B1vYm3G5",
        role: "manager" // Matches the bag icon button
    }
];

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password, role } = req.body;

    // 1. Basic validation
    if (!email || !password || !role) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    // 2. Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    // 3. Verify role match (Frontend sends 'admin' or 'manager')
    if (user.role !== role.toLowerCase()) {
        return res.status(403).json({ error: `Access denied. Account is not registered as ${role}.` });
    }

    // 4. Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    // 5. Generate JWT token
    const token = jwt.sign(
        { email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // 6. Respond to frontend
    res.status(200).json({
        message: "Login successful",
        token,
        user: { email: user.email, role: user.role }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running smoothly on http://localhost:${PORT}`);
});