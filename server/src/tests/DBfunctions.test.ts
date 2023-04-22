import { assert } from "console";
import { ERROR_400, USER, ADMIN } from "../consts.js";
import * as DBfunc from "../user_management/DBfunctions.js";
import { DBerr } from "../helpers.js";

const checkUsernameAndPassword = async (username:string, password:string) => {
  try {
      const user:any = await DBfunc.getUserByUsername(username);
      return password === user.password;
  }
  catch(err: any) {
      console.log(err.message);
      throw new DBerr (ERROR_400, err.message);
  }
}

const checkEmailAndPassword = async (email:string, password:string) => {
  try {
      const user:any = await DBfunc.getUserByEmail(email);
      return password === user.password;
  }
  catch(err: any) {
      console.log(err.message);
      throw new DBerr (ERROR_400, err.message);
  }
}

const setUpDB = async () => {
    try{
      // !!!!!!!! write in the admin and password to connect to the database !!!!!!!!!!
      await DBfunc.connectToDB('technioNLP-admin','k6ckrd0Zx0P2nYXn');
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

    if(await checkUsernameAndPassword(addition.username, addition.password) === false){
      throw new Error("user password not checked successfully");
    }
    console.log("user password checked successfully")

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

    if(await checkEmailAndPassword(addition.email, addition.password) === false){
      throw new Error("user password not checked successfully");
    }
    console.log("user password checked successfully")

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

const testValidations = async () => {
  try{
    await DBfunc.addUser("testing", "testing", "12345678");
    assert(false,"should not be able to add user with invalid email");
  }
  catch(err:any){
    assert(err.status === ERROR_400);
    console.log("invalid email caught successfully")
  }

  try{
    await DBfunc.addUser("test@example.com", "test", "12345678");
    assert(false,"should not be able to add user with invalid username");
  }
  catch(err:any){
    assert(err.status === ERROR_400);
    console.log("invalid username caught successfully")
  }

  try{
    await DBfunc.addUser("test@example.com", "testtest", "1234567");
    assert(false,"should not be able to add user with invalid password");
  }
  catch(err:any){
    assert(err.status === ERROR_400);
    console.log("invalid password caught successfully")
  }

  try{
    await DBfunc.addUser("example@email.com", "testtest", "12345678");
    if(await checkEmailAndPassword("example@email.com", "wrongpassword") === false)
      throw new Error("invalid password caught successfully");

    assert(false,"should not be able to check password with invalid password");
    await DBfunc.deleteUserByEmail("example@email.com")
  }
  catch(err:any){
    console.log("wrong password for email caught successfully")
    await DBfunc.deleteUserByEmail("example@email.com")
  }

  try{
    await DBfunc.addUser("example@email.com", "testtest", "12345678");
    if(await checkUsernameAndPassword("testtest", "wrongpassword") === false)
      throw new Error("invalid password caught successfully");
    assert(false,"should not be able to check password with invalid password");
    await DBfunc.deleteUserByEmail("example@email.com");
  }
  catch(err:any){
    console.log("wrong password for username caught successfully")
    await DBfunc.deleteUserByEmail("example@email.com")
  }

}


export const testUserManagement = async () => {
  try{
    await setUpDB();
    await ManageByUsername();
    await ManageByEmail();
    await testValidations();
  }
  catch(err:any){
    console.log("TEST FAILED: " + err.message);
  }
}