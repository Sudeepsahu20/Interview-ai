import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import blacklistModel from "../models/blacklist.model.js";

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
 async function registerUserController(req, res) {
   try {
     const { username, email, password } = req.body;

     if (!username || !email || !password) {
       return res.status(400).json({
         message: "All fields are required",
       });
     }

     const isUserAlreadyExists = await userModel.findOne({
       $or: [{ username }, { email }],
     });

     if (isUserAlreadyExists) {
       return res
         .status(403)
         .json({
           message:
             "User already exist in database with this email or username",
         });
     }

     const hashedPassword = await bcrypt.hash(password, 10);

     const user = await userModel.create({
       username,
       email,
       password: hashedPassword,
     });
     const token = jwt.sign(
       { id: user._id, username: user.username },
       process.env.JWT_SECRET,
       { expiresIn: "1d" },
     );

     res.cookie("token", token);

     res.status(201).json({
       message: "User registered successfully",
       user: {
         id: user._id,
         username: user.username,
         email: user.email,
       },
     });
   } catch (error) {
     console.log(error);
     res.status(500).json({
       message: "Server Error",
     });
   }
 }

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {
 try {
     const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password both the fields are required",
    });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User does not exist with this email address",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User loggedin successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
 } catch (error) {
    console.log(error);
    res.status(500).json({message:"Internal server error"});
 }
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req,res) {
  const token=req.cookies.token;
  console.log(token);

  if(token){
    await blacklistModel.create({token});
  }
     res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}


/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req,res) {
   try {
   const user = await userModel.findById(req.user.id).select("-password");


    if(!user){
      return res.status(401).json({message:"Please login first"})
    }

    return res.status(200).json({message:"User details fetched successfully",
       user:{
        id:user._id,
        username:user.username,
        email:user.email,

        
      }
    },
     
    )
  } catch (error) {
      console.log(error);
      return res.status(500).json({
        message:"Internal server error"
      })
   }
}

export{
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}