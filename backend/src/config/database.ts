import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables



const url = process.env.DATABASE_URL;
console.log(url)


if (!url) {
    throw new Error("No URL provided in DATABASE_URL");
}

const connect = async () => {
    try {
        console.log(url)
        await mongoose.connect(url , {
            
          
        }); 
        console.log("Connected to the database");
    } catch (err) {
        console.log(err)
        console.error("Database connection error:", err);
    }
};


export default connect;
