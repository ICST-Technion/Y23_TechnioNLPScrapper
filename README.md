# TechnioNLPScrapper

## About the project
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

* server- This folder contains the web server implementation
  for our project. 
  It serves as the intermediary between the frontend and the backend API,
  enabling communication and exchange of the search results.
  The server utilizes Axios, a popular JavaScript library,
  to handle HTTP requests and responses efficiently.
  

* service_ui- contains the UI the user interface components . 
  It includes various components such as the search bars, 
  charts, and other visual elements that enable users to 
  interact with our project.
  

* API- this folder contains a server API for our project, 
  its purpose is to communicate 
between the frontend and the backend, return the results
of the keyword search in articles to the frontend


* Scrapping- this folder contains the code in our projects 
  which collects and parses information about keyword and sentiment
  from news articles, and stores it in a database.


* SQL-this folder contains the code which handles connecting to our SQL database and
handling SQL queries for the API
  
* tests- this folder contains the backend tests.

## Backend

The backend of our project is responsible for processing the keyword searches 
from the frontend, categorize the sentiments of articles and quantify them
and returning the appropriate results for building the charts.
It is built using Python.


### API
The API file is the main file of our backend. 
It contains the server API for our project and is responsible 
for handling requests between the web server and the backend and returning responses.
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
Using React.js and typescript, we aimed to design a 
user-friendly and easy to use UI for the client,
taking into consideration the client’s requests for a clear and concise UI.
For registered users, the frontend allows them to run
a sentiment analysis search by typing into a search bar,
or using advanced search options such as date and specific sources 
for more specification.
Giving them back detailed charts to showcase the 
sentiment and numerical differences between keywords,
websites, and in different time ranges

## Setup instructions

1. Download the project files.

2. Start the Python API by navigating to the "API" folder and running the appropriate Python script.

3. Start the server by navigating to the "server" folder and running the necessary server script.

4. Navigate to the "service_ui" folder.

5. Run the following command in your terminal:

`npm start`

This will start the website and make it accessible in your local environment.

Alternatively, you can access the website directly in:

[TechnioNLPScrapper](https://jouwana.github.io/TechnioNLPScrapper/)


Please make sure you have the necessary dependencies installed and any required environment configurations set up before running the project locally.