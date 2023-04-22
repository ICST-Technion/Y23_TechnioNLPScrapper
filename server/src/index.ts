import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {client} from "./elephantsql.js"
import axios, {isCancel, AxiosError, AxiosResponse} from 'axios';
import * as consts from "./consts.js"
import { connectToDB } from './user_management/DBfunctions.js';
import { testUserManagement } from './tests/DBfunctions.test.js';
import { loginRoute, protectedRoute, signupRoute } from './user_management/autherntication.js';
import { setErrorResponse } from './helpers.js';
dotenv.config();

const port = process.env.PORT || 5000;
const app:Express = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

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
  try {

    const response = await axios.post(consts.api_address+consts.query_request,req.body)
    console.log(response);
    const results = await client.query('SELECT * FROM "public"."articles"');
    res.status(200).send({data: results.rows}).end();
    clearTable();
} catch (err) {
    console.log(err);
    clearTable();
    res.status(500).send(err);
}
});

app.post('/advancedSearch', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(consts.api_address+consts.advanced_search_request,req.body)
    console.log(response);
    const results = await client.query('SELECT * FROM "public"."articles"');
    res.status(200).send({data: results.rows}).end();
    clearTable();
} catch (err) {
    console.log(err);
    clearTable();
    res.status(500).send(err);
}
});

app.get('/rows', async (req: Request, res: Response) => {
  try {
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
