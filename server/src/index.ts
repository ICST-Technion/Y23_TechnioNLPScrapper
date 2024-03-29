import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {client} from "./elephantsql.js"
import axios, {AxiosError, AxiosResponse} from 'axios';
import * as consts from "./consts.js"
import { connectToDB } from './user_management/DBfunctions.js';
import { loginRoute, signupRoute } from './user_management/authentication.js';
import { redircetError, setErrorResponse } from './helpers.js';
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

app.delete('/keywordSentiment/:id', async (req: Request, res: Response) => {
  try{
    clearTable("KeywordSentiment"+req.params.id);
    res.status(200).send({message: "Table deleted"}).end();
  } 
  catch (err) {
    redircetError(err, res," ---------- ERROR IN DELETE----------");
  }
});

app.delete('/sentiment/:id', async (req: Request, res: Response) => {
  try{
    clearTable("ArticleSentiment"+req.params.id);
    res.status(200).send({message: "Table deleted"}).end();
  } 
  catch (err) {
    redircetError(err, res," ---------- ERROR IN DELETE----------");
  }
});

app.delete('/fullResults/:id', async (req: Request, res: Response) => {
  try{
    clearTable("Articles"+req.params.id);
    res.status(200).send({message: "Table deleted"}).end();
  } 
  catch (err) {
    redircetError(err, res," ---------- ERROR IN DELETE----------");
  }
});


// TODO: set timeout to check every 5 seconds if data is done, this should
// affect reading data after a disconnection happened, otherwise there will be no wait
app.get('/keywordSentiment/:id', async (req: Request, res: Response) => {
  const starttime = new Date().getTime();
  let doesntExist = true;
  while(new Date().getTime() - starttime < 10000 * 60 || doesntExist && new Date().getTime() - starttime < 10000 * 6)
  {
    try {
      const token = protectedRoute(req, res);
      if(token === consts.ERROR_401 || typeof(token) === "string")
        return;
      //if we reach here then we have a token and the user is logged in

      if((await client.query('SELECT * FROM KeywordSentiment'+req.params.id + " WHERE keyword='XXXDONEXXX'")).rowCount === 0){
        doesntExist = false;
        continue;
      }

      //table id is req.params.id
      const sentiment_results = await client.query('SELECT * FROM KeywordSentiment'+req.params.id + " WHERE NOT keyword='XXXDONEXXX'");
      
      res.status(200).send({data: sentiment_results.rows}).end();

      return;

    } catch (err) {
      doesntExist = true;
    }
  }
  if(doesntExist){
    let err;
    err.message = "Table not found";
    err.status = 404;
    redircetError(err, res," ---------- ERROR IN DB QUERY IN SENTIMENT ----------");
  }
  else{
    let err;
    err.message = "Timed OUT - please try again";
    err.status = 500;
    redircetError(err, res," ---------- ERROR IN DB QUERY IN SENTIMENT ----------");
  }
  return;
});

app.get('/sentiment/:id', async (req: Request, res: Response) => {
  const starttime = new Date().getTime();
  let doesntExist = true;
  while(new Date().getTime() - starttime < 10000 * 60 || doesntExist && new Date().getTime() - starttime < 10000 * 6)
  {
    try {
      const token = protectedRoute(req, res);
      if(token === consts.ERROR_401 || typeof(token) === "string")
        return;
      //if we reach here then we have a token and the user is logged in
      if((await client.query('SELECT * FROM ArticleSentiment'+req.params.id + " WHERE article_link='XXXDONEXXX'")).rowCount === 0){
        doesntExist = false;
        continue;
      }

    //table id is req.params.id
    const sentiment_results = await client.query('SELECT * FROM ArticleSentiment'+req.params.id + " WHERE NOT article_link='XXXDONEXXX'");
    
    res.status(200).send({data: sentiment_results.rows}).end();
    return;

    } catch (err) {
      doesntExist = true;
    }
  }
  if(doesntExist){
    let err;
    err.message = "Table not found";
    err.status = 404;
    redircetError(err, res," ---------- ERROR IN DB QUERY IN SENTIMENT ----------");
  }
  else{
    let err;
    err.message = "Timed OUT - please try again";
    err.status = 500;
    redircetError(err, res," ---------- ERROR IN DB QUERY IN SENTIMENT ----------");
  }
  return;
});

app.get('/fullResults/:id', async (req: Request, res: Response) => {
  const starttime = new Date().getTime();
  let doesntExist = true;
  while(new Date().getTime() - starttime < 10000 * 60 || doesntExist && new Date().getTime() - starttime < 10000 * 6)
  {
    try {
      const token = protectedRoute(req, res);
      if(token === consts.ERROR_401 || typeof(token) === "string")
        return;
      //if we reach here then we have a token and the user is logged in
      if((await client.query('SELECT * FROM Articles'+req.params.id + " WHERE keyword='XXXDONEXXX'")).rowCount === 0){
        doesntExist = false;
        continue;
      }
      //table id is req.params.id
      const sentiment_results = await client.query('SELECT * FROM Articles'+req.params.id + " WHERE NOT keyword='XXXDONEXXX'");
      
      res.status(200).send({data: sentiment_results.rows}).end();
      return;

    } catch (err) {
      doesntExist = true;
    }
  }
  if(doesntExist){
    let err;
    err.message = "Table not found";
    err.status = 404;
    redircetError(err, res," ---------- ERROR IN DB QUERY IN SENTIMENT ----------");
  }
  else{
    let err;
    err.message = "Timed OUT - please try again";
    err.status = 500;
    redircetError(err, res," ---------- ERROR IN DB QUERY IN SENTIMENT ----------");
  }
  return;
});

async function clearTable(table_id: string) {
  //We need the table id, to know which table to clear/delete
  //table_id is a string that includes the table name and the specific transaction id
  //for example: "Articles142857"

  try {
    axios.delete(
      consts.api_address+consts.clear_table_request+"/"+table_id,
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
   var api_response=await axios.post(consts.api_address+consts.query_request,req.body)
  }
  catch(err){
    redircetError(err, res, " --------- ERROR IN QUERY API CALL ---------");
    return;
  }
  //we have a table_id in the response to work with
  if(api_response.data)
  {
    var table_id=api_response.data
    res.status(200).send({table_id:table_id}).end();
  }
  else {
    setErrorResponse(500," --------- NO TABLE CREATED ---------", res);
  }
    
});

app.post('/advancedSearch', async (req: Request, res: Response) => {
  const token = protectedRoute(req, res);
  if(token === consts.ERROR_401 || typeof(token) === "string")
    return;

  //if we reach here then we have a token and the user is logged in
  try {
   var api_response= await axios.post(consts.api_address+consts.advanced_search_request,req.body)
  }
  catch(err){
    redircetError(err, res," --------- ERROR IN ADVANCED SEARCH API CALL ---------");
    return;
  }
  if(api_response.data)
  {
    var table_id=api_response.data
    res.status(200).send({table_id:table_id}).end();
  }
  else {
    setErrorResponse(500," --------- NO TABLE CREATED ---------", res);
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

  //generally this will be on first page load
  //send a message to wake up the API server

  //we dont care to await the response
  axios.get(consts.api_address+"/fakeRoute").then().catch((err: any) => {});


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
