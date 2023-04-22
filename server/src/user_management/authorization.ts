import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { ERROR_401, ERROR_400 } from "../consts.js";
import { setErrorResponse } from "../helpers.js";

const secretKey = process.env.SECRET_KEY || "your_secret_key";


const GetToken = (req: Request) => {
    
    // First get token from auth header if exists
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1]
    }
    // Then try to get from cookie
    // else if (req.cookies && req.cookies.token !== undefined) {
    //     return req.cookies.token;
    // }
    // No token found
    return "";
}

  
  // Verify JWT token
  const verifyJWT = (token: string) => {
    try {
      return jwt.verify(token, secretKey);
      // Read more here: https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
      // Read about the diffrence between jwt.verify and jwt.decode.
    } catch (err) {
      return false;
    }
  };
  
  // Middelware for all protected routes. You need to expend it, implement premissions and handle with errors.
  export const protectedRoute = (req: Request, res: Response) => {
    // Get token from header or cookie
    const token = GetToken(req);
  
    if (!token) {
      setErrorResponse(ERROR_401, "No token.", res);
      return ERROR_401;
    }
  
    // Verify JWT token
    const user = verifyJWT(token);
    if (!user) {
      setErrorResponse(ERROR_401, "Failed to verify JWT.", res);
      return ERROR_401;
    }
  
    // We are good!
    return user;
  };