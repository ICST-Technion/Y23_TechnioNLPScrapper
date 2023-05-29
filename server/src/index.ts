import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {client} from "./elephantsql.js"
import axios, {AxiosError, AxiosResponse} from 'axios';
import * as consts from "./consts.js"
import { connectToDB } from './user_management/DBfunctions.js';
import { loginRoute, signupRoute } from './user_management/authentication.js';
import { setErrorResponse } from './helpers.js';
import { protectedRoute } from './user_management/authorization.js';
import cookieParser from 'cookie-parser'
dotenv.config();

const port = process.env.PORT || 5000;
const app:Express = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser())

let userDB: typeof import("mongoose");

async function clearTable() {
  const body={}
  try {
    axios.post(
      consts.api_address+consts.clear_request,
      body
     ).then((response:AxiosResponse)=>console.log(response.data));
  } catch (error) {
    console.error(error);
  }
}

app.post('/query', async (req: Request, res: Response) => {
  const token = protectedRoute(req, res);
  if(token === consts.ERROR_401 || typeof(token) === "string")
    return;

  //if we reach here then we have a token and the user is logged in
  try {
   await axios.post(consts.api_address+consts.query_request,req.body)
  }
  catch(err){
    console.log(" --------- ERROR IN QUERY API CALL ---------");
    console.log(err);
    if(err.response){
      res.status(err.response.status).send({statusText: err.response.statusText, data: err.response.data});
    }
    else{
      res.status(err.status? err.status : 500).send(err.message? err.message : err);
    }

    return;
  }
  try{
    const results = await client.query('SELECT * FROM "public"."articles"');
    res.status(200).send({data: results.rows}).end();
    clearTable();
} catch (err) {
  console.log(" ---------- ERROR IN DB QUERY AFTER QUERY ----------");
  console.log(err);
    if(err.response){
      res.status(err.response.status).send({statusText: err.response.statusText, data: err.response.data});
    }
    else{
      res.status(err.status? err.status : 500).send(err.message? err.message : err);
    }
    clearTable();
}
});

app.post('/advancedSearch', async (req: Request, res: Response) => {
  const token = protectedRoute(req, res);
  if(token === consts.ERROR_401 || typeof(token) === "string")
    return;

  //if we reach here then we have a token and the user is logged in
  try {
    await axios.post(consts.api_address+consts.advanced_search_request,req.body)
  }
  catch(err){
    console.log(" --------- ERROR IN ADVANCED SEARCH API CALL ---------");
    console.log(err);
    if(err.response){
      res.status(err.response.status).send({statusText: err.response.statusText, data: err.response.data});
    }
    else{
      res.status(err.status? err.status : 500).send(err.message? err.message : err);
    }

    return;
  }

try{
    const results = await client.query('SELECT * FROM "public"."articles"');
    res.status(200).send({data: results.rows}).end();
    clearTable();

} catch (err) {
  console.log(" ---------- ERROR IN DB QUERY AFTER ADVANCED SEARCH ----------");
  console.log(err);
    if(err.response){
      res.status(err.response.status).send({statusText: err.response.statusText, data: err.response.data});
    }
    else{
      res.status(err.status? err.status : 500).send(err.message? err.message : err);
    }
    clearTable();
}
});

app.get('/rows', async (req: Request, res: Response) => {
  try {
    const token = protectedRoute(req, res);
    if(token === consts.ERROR_401 || typeof(token) === "string")
      return;
  
    //if we reach here then we have a token and the user is logged in
    const results = await client.query('SELECT * FROM "public"."articles"');
    res.send({data: results.rows});
    clearTable();
} catch (err) {
    console.log(err);
    res.status(500).send(err);
}
});

app.post('/login', async (req: Request, res: Response) => {
  loginRoute(req, res);
});

app.post('/register', async (req: Request, res: Response) => {
  const token = protectedRoute(req, res);
  if(token === consts.ERROR_401 || typeof(token) === "string")
    return;

  //if we reach here then we have a token and the user is logged in

  //if the user is not an admin then we return an error
  if(token.role !== consts.ADMIN){
     setErrorResponse(consts.ERROR_403, "You are not authorized to register new users", res);
     return;
  }

  signupRoute(req, res);
});

app.get('/autoLogin', async (req: Request, res: Response) => {
  const token = protectedRoute(req, res);
  if(token === consts.ERROR_401 || typeof(token) === "string"){
    return;
  }

  //if we reach here then we have a token and the user is logged in
  res.status(200).send({username: token.username, role: token.role});
});

app.all('*', (req: Request, res: Response) => {
  res.status(404).send('Page not found');
});

app.listen(port, async () =>
{
  console.log(`Server running! port ${port}`);
  try{
    userDB = await connectToDB();
  }
  catch(err: any) {
    console.log(err);
  }
});


function sendErrorBack(status: Number){
  const error = {
    message: "Error",
    status: status
  }

  return error;
}