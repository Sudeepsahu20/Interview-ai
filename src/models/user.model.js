import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"user name already taken"],
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:[true,"Email already exist with this email address"],
        required:true
    },
    password:{
        type:String,
        required:true
    },
},
{
    timestamps:true
})

const userModel=mongoose.model("user",userSchema);
export default userModel;