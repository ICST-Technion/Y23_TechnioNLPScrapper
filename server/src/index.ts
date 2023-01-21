import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import knex from 'knex';
import dotenv from 'dotenv';
import {client} from "./elephantsql.js"
import axios, {isCancel, AxiosError} from 'axios';
import * as consts from "./consts.js"
dotenv.config();

const port = process.env.PORT || 5000;
const app:Express = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


async function clearTable() {
  const body={}
  try {
    axios.post(
      consts.api_address+consts.clear_request,
      body
     ).then((response:Response)=>console.log(response.data));
  } catch (error) {
    console.error(error);
  }
}

app.get('/query', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(consts.api_address+consts.query_request,req.body)
    console.log(response);
    const results = await client.query('SELECT * FROM "public"."articles"');
    res.send({data: results.rows});
    clearTable()
} catch (err) {
    console.log(err);
}
});

app.get('/advancedSearch', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(consts.api_address+consts.advanced_search_request,req.body)
    console.log(response);
    const results = await client.query('SELECT * FROM "public"."articles"');
    res.send({data: results.rows});
    clearTable()
} catch (err) {
    console.log(err);
}
});

app.get('/rows', async (req: Request, res: Response) => {
  try {
    const results = await client.query('SELECT * FROM "public"."articles"');
    res.send({data: results.rows});
} catch (err) {
    console.log(err);
}
});

app.listen(port);
console.log(`Server running! port ${port}`);