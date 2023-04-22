import userDB from "./models/user.js";
import { ERROR_400, ERROR_500, USER, DBerr } from "../consts.js"
import mongoose from "mongoose";

export const connectToDB = async (admin:string|undefined = process.env.USERDB_ADMIN, pass:string|undefined = process.env.USERDB_PASSWORD) => {
    try {
        // Connect to mongoDB
        const dbURI = `mongodb+srv://${admin}:${pass}@technionlp.5wct67t.mongodb.net/test`;
        mongoose.set('strictQuery', false); // Takes care of depreciated warning
        const userDB = await mongoose.connect(dbURI);
        console.log("Connected to DB");
        return userDB;
    }
    catch(err: any) {
        console.log(err.message);
        throw new DBerr(ERROR_500, err.message);
    }
}


export const getUserByUsername = async (username:string) => {
    try {
        const client = await userDB.find({username: username});
        if(client.length > 0) {
            return client[0];
        }
        else throw new DBerr(ERROR_400, "username not found");
    }
    catch(err: any) {
        throw new DBerr (ERROR_400, err.message);
    }
}

export const getUserByEmail = async (email:string) => {
    try {
        const client = await userDB.find({email: email});
        if(client.length > 0) {
            return client[0];
        }
        else throw new DBerr(ERROR_400, "email not found");
    }
    catch(err: any) {
        throw new DBerr (ERROR_400, err.message);
    }
}

export const checkUsernameExists = async (username:string) => {
    try {
        const user:any = await getUserByUsername(username);
        return true;
    }
    catch(err: any) {
        return false;
    }
}

export const checkEmailExists = async (email:string) => {
    try {
        const user:any = await getUserByEmail(email);
        return true;
    }
    catch(err: any) {
        return false;
    }
}

export const addUser = async (email:string ,username:string, password:string) => {
    try{
        //these will throw error if user was not found, which is what we want
        if(await checkEmailExists(email)) throw new DBerr(ERROR_400, "email already exists");
        if(await checkUsernameExists(username)) throw new DBerr(ERROR_400, "username already exists");

        const client = new userDB({
            email: email,
            username: username,
            password: password,
            role: USER, //the default role on signup
            });
        return await client.save();
    }
    catch(err: any) {
        console.log(err.message);
        throw new DBerr (ERROR_400, err.message);
    }

}


export const getUserRoleByEmail = async (email:string) => {
    try {
        const user:any = await getUserByEmail(email);
        if(!user.status && user.role) {
            return user.role;
        }
        else throw new DBerr(ERROR_400, "email not found");
    }
    catch(err: any) {
        console.log(err.message);
        throw new DBerr (ERROR_400, err.message);
    }
}

export const getUserRoleByUsername = async (username:string) => {
    try {
        const user:any = await getUserByUsername(username);
        if(!user.status && user.role) {
            return user.role;
        }
        else throw new DBerr(ERROR_400, "username not found");
    }
    catch(err: any) {
        console.log(err.message);
        throw new DBerr (ERROR_400, err.message);
    }
}

export const UpdateUserRoleByName = async (email:string, newRole: string) => {
    try {
        let user:any = await getUserByUsername(email)
        if (user.status){
           throw new DBerr(ERROR_400, "username not found");
        }
        
        const userJson:any = user;
        await userDB.findByIdAndUpdate(userJson._id, {role: newRole});
        return userJson.username;
        
    }
    catch(err: any) {
        console.log(err.message);
        throw new DBerr (ERROR_400, err.message);
    }
}

export const UpdateUserRoleByEmail = async (email:string, newRole: string) => {
    try {
        let user:any = await getUserByEmail(email)
        if (user.status){
            throw new DBerr(ERROR_400, "email not found");
        }
        const userJson:any = user;
        await userDB.findByIdAndUpdate(userJson._id, {role: newRole});
        return userJson.email;

    }
    catch(err: any) {
        console.log(err.message);
        throw new DBerr (ERROR_400, err.message);
    }
}

export const deleteUserByEmail = async (email:string) => {
    try {
        const user:any = await getUserByEmail(email);
        if(user.status) {
            throw new DBerr(ERROR_400, "email not found");
        }

        const userJson:any = user;
        await userDB.findByIdAndDelete(userJson._id);
        return userJson.email;

    }
    catch(err: any) {
        console.log(err.message);
        throw new DBerr (ERROR_400, err.message);
    }
}

export const deleteUserByUsername = async (username:string) => {
    try {
        const user:any = await getUserByUsername(username);
        if(user.status) {
            throw new DBerr(ERROR_400, "username not found");
        }
        const userJson:any = user;
        await userDB.findByIdAndDelete(userJson._id);
        return userJson.username;
    }
    catch(err: any) {
        console.log(err.message);
        throw new DBerr (ERROR_400, err.message);
    }
}