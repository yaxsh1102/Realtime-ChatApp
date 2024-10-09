import mongoose from 'mongoose';
require('dotenv').config()

const url = process.env.DATABASE_URL;


if (!url) {
    throw new Error("No URL provided in DATABASE_URL");
}

const connect = async () => {
    try {
        await mongoose.connect(url);
        console.log("Connected to the database");
    } catch (err) {
        console.error("Database connection error:", err);
    }
};


export default connect;
