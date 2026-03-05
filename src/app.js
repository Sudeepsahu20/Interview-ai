import express from 'express';



const app=express();

app.get('/',(req,res)=>{
    res.send("root is running")
})

export default app;