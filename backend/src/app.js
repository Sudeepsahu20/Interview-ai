import express from 'express';
import authRouter from './routes/auth.routes.js'
import cookieParser from'cookie-parser';
import cors from 'cors';
import interviewRouter from './routes/interview.routes.js'

const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(cors(
    {origin:"https://your-frontend-url.vercel.ap",
        credentials:true
    }
    
))

//using auth route here
app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter)


export default app;