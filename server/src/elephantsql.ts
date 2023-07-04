import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const client = new pg.Client(`postgres://ltwwxnaj:${process.env.DBPASS}@ella.db.elephantsql.com/ltwwxnaj`);

client.connect(function(err: any) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err:any, result: any) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
  });

});
