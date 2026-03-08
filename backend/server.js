import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/config/database.js';
import app from './src/app.js'


connectDB();
const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("Server is listening to port 3000");
})