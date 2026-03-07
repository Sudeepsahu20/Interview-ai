import jwt from'jsonwebtoken';
import blacklistModel from "../models/blacklist.model.js";

async function authUser(req,res,next) {
    try {
        const token= req.cookies.token;

        if(!token){
            return res.status(401).json({
                  message: "Token not provided."
            })
        }

        const blackListToken=await blacklistModel.findOne({token});

        if(blackListToken){
            return res.status(401).json({
                message:"Token already blackListed"
            })
        }
      
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user=decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token."
        })
    }
    
}

export default authUser;