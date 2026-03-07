import express from 'express';
import authRouter from './routes/auth.routes.js'
import cookieParser from'cookie-parser';
import cors from 'cors';

const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(cors(
    {origin:" http://localhost:5173",
        credentials:true
    }
    
))

//using auth route here
app.use('/api/auth',authRouter);

app.get('/',(req,res)=>{
    res.send("root is running")
})

export default app;