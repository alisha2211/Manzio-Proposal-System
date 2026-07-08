const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function createUsers() {
  try {
    const adminPassword = await bcrypt.hash("admin123", 10);
    const managerPassword = await bcrypt.hash("manager123", 10);

    // ADMIN
    await db.execute(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [
        "Administrator",
        "admin@manzio.com",
        adminPassword,
        "admin",
      ]
    );

    // MANAGER
    await db.execute(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [
        "Manager",
        "manager@manzio.com",
        managerPassword,
        "manager",
      ]
    );

    console.log("✅ Admin + Manager created successfully");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
}

createUsers();