/*
    MIT License

    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    MinSU DocuReg - Default Account Seeder
*/

import bcrypt from "bcrypt";
import { User } from "./models/userModel.js";
import { sequelize } from "./models/db.js";

const defaultAccounts = [
  {
    name: "Administrator",
    email: "admin@admin.com",
    password: "admin123",
    studentId: null,
    role: "admin",
    status: "active"
  },
  {
    name: "Registrar",
    email: "registrar@reg.com",
    password: "reg123",
    studentId: null,
    role: "registrar",
    status: "active"
  },
  {
    name: "Juan Dela Cruz",
    email: "student@student.com",
    password: "student123",
    studentId: "2024-00001",
    role: "student",
    status: "active"
  }
];

try {
  await sequelize.authenticate();
  console.log("✅ Connected to database\n");

  for (const account of defaultAccounts) {
    const existing = await User.findOne({ where: { email: account.email } });
    if (existing) {
      console.log(`⚠️  Skipped (already exists): ${account.email}`);
      continue;
    }

    const hashed = await bcrypt.hash(account.password, 10);
    await User.create({ ...account, password: hashed });
    console.log(`✅ Created [${account.role.toUpperCase()}] ${account.email}  →  password: ${account.password}`);
  }

  console.log("\n🎉 Seeding complete!");
  console.table(
    defaultAccounts.map(a => ({
      Role: a.role,
      Name: a.name,
      Email: a.email,
      Password: a.password,
      "Student ID": a.studentId ?? "N/A"
    }))
  );
} catch (err) {
  console.error("❌ Seeding failed:", err.message);
} finally {
  process.exit();
}
