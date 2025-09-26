
import dotenv from "dotenv"
dotenv.config()

import { User } from "../models /user.model.js";
import jwt from "jsonwebtoken";

const jwtVerify = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
 // console.log(token)
    if (!token) {
    return res.status(409).json({
      message:"UnAuthorized Request"
    })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decodedToken)
    const user = await User.findById(decodedToken?.id).select(
      "-password"
    );
  // console.log(user)
    if (!user) {
    
     return res.status(409).json({
        message:"Invalid Access Token"
      })
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(409).json({
      message: error.message? error.message: "Invalid Access Token"
    }) ;
  }
};

export { jwtVerify };