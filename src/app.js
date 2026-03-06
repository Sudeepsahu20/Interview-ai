import express from 'express';
import authRouter from './routes/auth.routes.js'
import cookieParser from'cookie-parser';

const app=express();
app.use(cookieParser());
app.use(express.json());

//using auth route here
app.use('/api/auth',authRouter);

app.get('/',(req,res)=>{
    res.send("root is running")
})

export default app;