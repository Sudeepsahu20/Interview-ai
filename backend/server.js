import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/config/database.js';
import app from './src/app.js'
import generateInterviewReport from './src/services/ai.service.js'
import {resume,jobDescription,selfDescription} from './src/services/temp.js'

connectDB();

//generateInterviewReport({resume,jobDescription,selfDescription});


app.listen(3000,()=>{
    console.log("Server is listening to port 3000");
})