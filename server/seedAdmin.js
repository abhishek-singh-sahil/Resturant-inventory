import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

await connectDB();

try {
  // Delete old users (optional)
  await User.deleteMany({});

  const password = await bcrypt.hash("123456", 10);

  await User.insertMany([
    {
      name: "Admin",
      email: "admin@gmail.com",
      password,
      role: "admin",
    },
    {
      name: "Store Staff",
      email: "staff1@gmail.com",
      password,
      role: "staff",
    },
    {
      name: "Store Staff",
      email: "staff2@gmail.com",
      password,
      role: "staff",
    },
  ]);

  console.log("✅ Users Seeded Successfully");

  await mongoose.connection.close();

  process.exit();
} catch (error) {
  console.error(error);

  await mongoose.connection.close();

  process.exit(1);
}