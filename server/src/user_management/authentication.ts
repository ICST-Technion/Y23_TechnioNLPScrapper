import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ERROR_401, ERROR_400 } from "../consts.js";
import {
  addUser,
  checkEmailExists,
  checkUsernameExists,
  getUserByEmail,
  getUserByUsername,
} from "./DBfunctions.js";
import { DBerr, setErrorResponse } from "../helpers.js";
import { assert } from "console";
const secretKey = process.env.SECRET_KEY || "your_secret_key";


export const loginRoute = async (req: Request, res: Response) => {
  const credentials = req.body;

  // Validate request body.
  if (!credentials.password) {
    setErrorResponse(ERROR_400, "Missing password.", res);
    return;
  }

  let userDBRes: any;
  try {
    // Check if username (or email) and password match
    if(await checkUsernameExists(credentials.username)) {
      userDBRes = await getUserByUsername(credentials.username);
    } 
    else if(await checkEmailExists(credentials.email)) {
      userDBRes = await getUserByEmail(credentials.email);
    }
    else throw new DBerr(ERROR_401, "no valid username or email");

    // bcrypt.hash create single string with all the informatin of the password hash and salt.
    // Read more here: https://en.wikipedia.org/wiki/Bcrypt
    // Compare password hash & salt.
     const passwordMatch = await bcrypt.compare(
       credentials.password,
       userDBRes.password
     );
     
    if (!passwordMatch) {
      throw new DBerr(ERROR_401, "incorrect password")
      return;
    }

  } catch (err: any) {
    setErrorResponse(err.status, err.message, res);
    return;
  }

  //assertion should always pass, but just in case
  assert(userDBRes !== false);

  // Create JWT token.
  // This token contain the userId in the data section.
  const token = jwt.sign({ username: userDBRes.username, role: userDBRes.role }, secretKey, {
    expiresIn: 86400, // expires in 24 hours
  });

  res.status(200)
  .send(
    JSON.stringify({
      username: userDBRes.username,
      role: userDBRes.role,
      token: token,
    })
  );
};

export const signupRoute = async (req: Request, res: Response) => {

    const credentials = req.body;
    let dbRes;
    //add to our DB
    const password = await bcrypt.hash(credentials.password, 10);
    try{
        dbRes = await addUser(credentials.email, credentials.username, password);
    }
    catch(err: any){
        setErrorResponse(err.status, err.message, res);
        return err.status;
    }

    res.status(201).send(
      JSON.stringify({
        username: dbRes.username,
      })
    );
};

