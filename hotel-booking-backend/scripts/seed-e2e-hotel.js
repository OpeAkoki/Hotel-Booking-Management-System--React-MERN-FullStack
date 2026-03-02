/**
 * Seed script: Adds "Dublin Getaways" hotel for e2e tests.
 * Run: node scripts/seed-e2e-hotel.js
 * Requires: User 1@1.com must already exist (create via Register in the app).
 */
require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_CONNECTION_STRING in .env");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const user = await db.collection("users").findOne({ email: "1@1.com" });
  if (!user) {
    console.error("User 1@1.com not found. Register at http://localhost:5174 first.");
    process.exit(1);
  }

  const existing = await db.collection("hotels").findOne({
    name: "Dublin Getaways",
    city: "Dublin",
  });
  if (existing) {
    console.log("Dublin Getaways already exists.");
    await mongoose.disconnect();
    return;
  }

  await db.collection("hotels").insertOne({
    userId: user._id.toString(),
    name: "Dublin Getaways",
    city: "Dublin",
    country: "Ireland",
    description: "Lorem ipsum dolor sit amet. A wonderful stay in Dublin.",
    type: ["All Inclusive"],
    adultCount: 2,
    childCount: 3,
    facilities: ["Airport Shuttle", "Family Rooms", "Non-Smoking Rooms", "Spa"],
    pricePerNight: 119,
    starRating: 2,
    imageUrls: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    ],
    lastUpdated: new Date(),
    totalBookings: 0,
    totalRevenue: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("Dublin Getaways added successfully.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
