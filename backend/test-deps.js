const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function test() {
    console.log("--- STARTING DIAGNOSTIC ---");
    console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Present" : "MISSING");
    console.log("MONGODB_URI:", process.env.MONGODB_URI);

    try {
        console.log("Testing bcrypt hash...");
        const hash = await bcrypt.hash("password123", 12);
        console.log("Bcrypt hash success:", hash.substring(0, 10) + "...");
        
        console.log("Testing bcrypt compare...");
        const match = await bcrypt.compare("password123", hash);
        console.log("Bcrypt compare success:", match);
    } catch (err) {
        console.error("BCRYPT ERROR:", err);
    }

    try {
        console.log("Testing MongoDB connection...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connection SUCCESS");
        await mongoose.disconnect();
    } catch (err) {
        console.error("MONGODB ERROR:", err);
    }

    try {
        console.log("Testing JWT sign...");
        const token = jwt.sign({ id: 'test' }, process.env.JWT_SECRET || 'secret');
        console.log("JWT sign SUCCESS");
    } catch (err) {
        console.error("JWT ERROR:", err);
    }

    console.log("--- DIAGNOSTIC COMPLETE ---");
}

test();
