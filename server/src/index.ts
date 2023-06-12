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


//added the format here in addition to the test
//link,overall_sentiment, sum_negative_keywords,sum_positive_keywords,date,total_sentiment_score 
//why do we need total_sentiment_score?
//because sometimes there aren't keywords in the article that watson can recognize, so we need all of these
// [
//   [
//     "https://www.ynet.co.il/news/article/hjg6zmupo#autoplay",
//     "negative",
//     "0.000",
//     "1.770",
//     "Thu, 01 Dec 2022 00:00:00 GMT",
//     "-0.781"
//   ]
// ]

app.get('/sentiment', async (req: Request, res: Response) => {
  try {
    const token = protectedRoute(req, res);
    if(token === consts.ERROR_401 || typeof(token) === "string")
      return;

    //if we reach here then we have a token and the user is logged in

    //since wer'e using concurrent tables we have ids too
    // const body={'table_id': table_id}
    //body['table_id']
    const api_response=await axios.post(consts.api_address+consts.sentiment_request,req.body)
    
    res.send({data: api_response.data});
    //we need id to clear table
    clearTable(req.body['table_id']);
} catch (err) {
    console.log(err);
    res.status(500).send(err);
}




});

async function clearTable(table_id: string) {
  //We need the table id, to know which table to clear
  //this deletes all relevant tables, including the sentiment analysis tables
  const body={'table_id': table_id}
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
   var api_response=await axios.post(consts.api_address+consts.query_request,req.body)
  }
  catch(err){
    redircetError(err, res, " --------- ERROR IN QUERY API CALL ---------");
    return;
  }
  try{
    //we have a table_id in the response to work with
    if(api_response.data)
    {
      var table_id=api_response.data
      //TODO: add this line
      //const sentiment_results = await client.query('SELECT * FROM ArticleSentiment'+table_id);
      //I am leaving the use of this data up to you
      const results = await client.query('SELECT * FROM Articles'+table_id);
      res.status(200).send({data: results.rows}).end();
      clearTable(table_id);

    }
    
} catch (err) {
  redircetError(err, res," ---------- ERROR IN DB QUERY AFTER QUERY ----------");
    if(api_response.data)
    {
  clearTable(api_response.data);
    return;
    }
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

try{
    if(api_response.data)
    {
      var table_id=api_response.data
      console.log(table_id)
      //TODO: add this line
      //const sentiment_results = await client.query('SELECT * FROM ArticleSentiment'+table_id);
      //I am leaving the use of this data up to you
      const results = await client.query('SELECT * FROM Articles'+table_id);
      res.status(200).send({data: results.rows}).end();
      clearTable(table_id);
    }
    

} catch (err) {
  redircetError(err, res," ---------- ERROR IN DB QUERY AFTER ADVANCED SEARCH ----------");
    if(api_response.data)
    {
    clearTable(api_response.data);
    return;
    }
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
