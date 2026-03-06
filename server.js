import connectDB from './src/config/database.js';
import app from './src/app.js'
import dotenv from 'dotenv';
dotenv.config();

connectDB();

app.listen(3000,()=>{
    console.log("Server is listening to port 3000");
})