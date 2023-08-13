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

it also contains these subfolder that allow it to run properly:


### API
The API file is the main file of our backend. 
It contains the server API for our project and is responsible 
for handling requests between the web server and the backend and returning responses.
It communicates with the frontend using 
Flask. The API file also interacts with the SQL database to 
retrieve or store data as required.

#### Analysis Database
Our project uses ElephantSQL to store and manage data. 
The database is responsible for storing data related to our project such 
as the sentiment of keywords in an article. We use 
Python's libraries for postgresSQL to interact with the database.

#### Deployment
We have deployed our backend on google cloud run, leveraging their 
features to ensure seamless deployment of new updates and changes.
We use GCR's logs to keep track of bugs during processing requests.

#### NLP
In order to analyze article sentiments in Hebrew, we are using the API of IBM-Watson
The NLP is responsible for classifying the article as positive, negative, or neutral,
finding keywords (other than the keywords given as a user input) and calculating an overall score,
to illustrate the how strong the sentiment is throughout the article.


## FE Server / Gateway

written in node.js, this server takes care of user authentication and autherization.
it is responsible for redirecting requests between BE and FE, and connection to DB.
the server is deoployed on GCR and connects to the deployement of the BE.


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

the website connects to the server via its GCR deployement,
the website itself is currently deployed on github pages.


## Website Access:
[TechnioNLPScrapper](https://jouwana.github.io/TechnioNLPScrapper/)

you will need to contact an admin to create a new account to use on the website.
there is also the main admin account, please send a message if you need it.


## LOCAL Setup instructions

1. Clone the Repo.
   
3. You will need to change the links in the consts file of 'server' and 'service_ui' to run the local API and server.

4. Start the Python API by navigating to the "API" folder, installing requirements with `pip -r requirements.txt`, then running the api.py file with `python API.py`.

5. Start the server by navigating to the "server" folder, run `npm install` to download dependencies, then `npm star`t or `npm run dev` to start the server.

6. Navigate to the "service_ui" folder, run `npm install` to download depndencies, then `npm start` to open the browser.


This will start the website and make it accessible in your local environment.

note: if you ran it before, you dont need to 'install' the libraries again, and can simply use the run commands alone instead.



## Docker local setup:
1. Clone the repo:
   
3. Open Docker Client, and open a local terminal and write `make build-images`.
   
4. If you would like to run the images locally and use the localhost, change the links in the const files as explained in local setup instruction '2'. 
   
5. Create and run the containers locally.
   
6. Add in the env vars in .env files to server and API, or add them in during creating the container.

### links to the dockerhub images:
The links can be found [here]('./prebuilt docker images.md')

