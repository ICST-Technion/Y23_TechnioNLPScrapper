import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import knex from 'knex';
import dotenv from 'dotenv';
import {client} from "./elephantsql.js"
dotenv.config();

const port = process.env.PORT || 5000;
const app:Express = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

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