import userDB from "./models/user.js";
import { ERROR_400, ERROR_500, USER } from "../consts.js"
import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        // Connect to mongoDB
        const dbURI = `mongodb+srv://${process.env.USERDB_ADMIN}:${process.env.USERDB_PASSWORD}@technionlp.5wct67t.mongodb.net/test`;
        mongoose.set('strictQuery', false); // Takes care of depreciated warning
        const userDB = await mongoose.connect(dbURI);
        console.log("Connected to DB");
        return userDB;
    }
    catch(err: any) {
        console.log(err.message);
        return ERROR_500;
    }
}


export const getUserByUsername = async (username:string) => {
    try {
        const client = await userDB.find({username: username});
        if(client.length > 0) {
            return client[0];
        }
        else return ERROR_400;
    }
    catch(err: any) {
        console.log(err.message);
        return ERROR_400;
    }
}

export const getUserByEmail = async (email:string) => {
    try {
        const client = await userDB.find({email: email});
        if(client.length > 0) {
            return client[0];
        }
        else return ERROR_400;
    }
    catch(err: any) {
        console.log(err.message);
        return ERROR_400;
    }
}

export const addUser = async (email:string ,username:string, password:string) => {
    try{
        if((await getUserByUsername(username)) || await getUserByEmail(email))
        {
            //username and email must be unique
            return ERROR_400;
        }
        const client = new userDB({
            email: email,
            username: username,
            password: password,
            role: USER, //the default role on signup
          });
          return client.save();
    }
    catch(err: any) {
        console.log(err.message);
        return ERROR_400;
    }
}


export const getUserRoleByEmail = async (email:string) => {
    try {
        const user = await getUserByEmail(email);
        if(user && user !== ERROR_400 && user.role) {
            return user.role;
        }
        else return ERROR_400;
    }
    catch(err: any) {
        console.log(err.message);
        return ERROR_400;
    }
}

export const UpdateUserRoleByName = async (email:string, newRole: string) => {
    try {
        let user = await getUserByEmail(email)
        if (user === ERROR_400){
            return ERROR_400;
        }
        else if(user !== undefined) {
            const userJson:any = user;
            await userDB.findByIdAndUpdate(userJson._id, {role: newRole});
            return userJson.email;
        }
        else return ERROR_400;
    }
    catch(err: any) {
        console.log(err.message);
        return ERROR_400;
    }
}

