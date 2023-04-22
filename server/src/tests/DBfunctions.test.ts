import { assert } from "console";
import { ERROR_400, USER, ADMIN } from "../consts.js";
import * as DBfunc from "../user_management/DBfunctions.js";


const setUpDB = async () => {
    try{
      //write in the admin and password to connect to the database
      await DBfunc.connectToDB();
    }
    catch(err){
      throw err;
    }
}

const ManageByUsername = async () => {
  let username:any = "";
  let role:any = "";
  try{
    const addition:any = await DBfunc.addUser("example@test.com", "testtest", "testtest");
    console.log("user added by username successfully")

    const user:any = await DBfunc.getUserByUsername(addition.username);
    assert(user.username === addition.username);
    console.log("user found by username successfully")

    role = await DBfunc.getUserRoleByUsername(addition.username);
    assert(role === USER)
    console.log("user role found by username successfully")

    username = await DBfunc.UpdateUserRoleByName(addition.username, ADMIN);
    assert(username === addition.username);
    role = await DBfunc.getUserRoleByUsername(addition.username);
    assert(role === ADMIN);
    console.log("user role updated by username successfully")

    username = await DBfunc.deleteUserByUsername(addition.username);
    assert(username===addition.username);

  }
  catch(err){
    throw err;
  }

  try{
    const user = await DBfunc.getUserByUsername("testtest");
    throw new Error("user should not exist");
  }
  catch(err:any){
    assert(err.status === ERROR_400);
    console.log("user deleted by username successfully")
  }
}

const ManageByEmail = async () => {
  let email:any = "";
  let role:any = "";
   try{
    const addition:any = await DBfunc.addUser("example@test.com", "testtest", "testtest");
    console.log("user added by email successfully")

    const user = await DBfunc.getUserByEmail(addition.email);
    assert(user.email === addition.email);
    console.log("user found by email successfully")

    role = await DBfunc.getUserRoleByEmail(addition.email);
    assert(role===USER);
    console.log("user role found by email successfully")

    email = await DBfunc.UpdateUserRoleByEmail(addition.email, ADMIN);
    assert(email===addition.email);
    role = await DBfunc.getUserRoleByEmail(addition.email);
    assert(role===ADMIN);
    console.log("user role updated by email successfully")
    
    email = await DBfunc.deleteUserByEmail(addition.email);
    assert(email===addition.email);

  }
  catch(err){
    throw err;
  }

  try{
    const user = await DBfunc.getUserByEmail("example@test.com");
    assert(false, "user should not exist");
    throw new Error("user should not exist");
  }
  catch(err:any){
    assert(err.status === ERROR_400);
    console.log("user deleted by email successfully")
  }
}

export const testUserManagement = async () => {
  try{
    await setUpDB();
    await ManageByUsername();
    await ManageByEmail();
  }
  catch(err){
    console.log("TEST FAILED: " + err);
  }
}