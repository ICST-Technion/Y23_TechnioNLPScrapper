# TechnioNLPScrapper
A Technion CS Software-Project "NLP Web-Scrapper Platform" for Sikkuy-Aufoq.
The primary objective of the project is to offer a comprehensive 
framework for searching news articles using specified keywords,
analyzing the tone and sentiment of the articles, and 
generating visual representations of the results over time. 
With this platform, users can easily track trends and gain valuable insights
into media coverage of relevant topics. 
By utilizing natural language processing (NLP) techniques,
the platform can provide accurate and insightful analyses of large quantities of 
data, helping Sikkuy-Aufoq gauge the effectiveness of their campaigns.



## Project File Structure


* API- this file contains a server API for our project, 
  its purpose is to communicate 
between the frontend and the backend, return the results
of the keyword search in articles to the frontend


* Scrapping- this file contains the code in our projects 
  which collects and parses information about keyword and sentiment
  from news articles, and stores it in a database.


* SQL-this file contains the code which handles connecting to our SQL database and
handling SQL queries
  
* tests- this file contains the backend tests.

## Backend

The backend of our project is responsible for processing the keyword searches 
from the frontend, categorize the sentiments of articles and quantify them
and returning the appropriate results for building the charts.
It is built using Python.


### API
The API file is the main file of our backend. 
It contains the server API for our project and is responsible 
for handling requests between frontend and backend and returning responses.
It communicates with the frontend using 
Flask. The API file also interacts with the SQL database to 
retrieve or store data as required.

### Database
Our project uses ElephantSQL to store and manage data. 
The database is responsible for storing data related to our project such 
as the sentiment of keywords in an article. We use 
Python's libraries for postgresSQL to interact with the database.

###Deployment
We have deployed our backend on Render, leveraging their 
features to ensure seamless deployment of new updates and changes.
We use Render's logs to keep track of bugs during processing requests.

<!-- Add explanation for NLP when we add it-->

## Frontend
<!-- Explanation for the frontend of the project-->

## Setup instructions

<!-- Add the script to set up to run and clean the project -->

npm run build

npm start

