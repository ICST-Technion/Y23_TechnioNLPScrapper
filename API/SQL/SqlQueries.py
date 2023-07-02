import psycopg2
import sys
import random

sys.path.append('..\\Scrapping')
from Scrapping.Article import *
from urllib.parse import urlparse


class SQLQuery:
    """
    This class is used to connect to our posgresql database
    and perform different operations on our records
    """
    def __init__(self):
        """
        Initialize the SQLQuery class.
        Set up the connection details for the PostgreSQL database.
        The current url is an ElephantSQL database.
        The maximum amount of records that can be stored, is limited by the payment plan
        Note about the encoding: the default encoding is typically ASCII, which does not support Hebrew
        characters
        """
        self.db_url = "postgres://ltwwxnaj:BYQgr0k-KgVH98QbpkMfZ1USDpX2XDGU@ella.db.elephantsql.com/ltwwxnaj"
        # this line allows us to figure out the connection information to our database independent of the actual url
        url = urlparse(self.db_url)
        self.database = url.path[1:]
        self.user = url.username
        self.password = url.password
        self.host = url.hostname
        self.port = url.port
        self.encoding ='UTF-8'

    def update_keyword_sentiment(self,table_name,keyword,intonation,website,new_score):
        """
        Update the sentiment score of a keyword in the specified table.
        :param table_name: Name of the table to update
        :param keyword: Keyword to update
        :param intonation: Intonation to update
        :param website: Website to update
        :param new_score: New sentiment score to set
        """
        conn = None
        update_query = f"""UPDATE {table_name}
                        SET score = {new_score}
                        WHERE keyword = %s AND intonation= %s AND website= %s;"""
        
        try:
            conn = psycopg2.connect(
                database=self.database, user=self.user, password=self.password, host=self.host, port=self.port
            )
            conn.set_client_encoding(self.encoding)
            cur = conn.cursor()
            # on multiple rows at once
            cur.execute(update_query,(keyword,intonation,website))
            conn.commit()
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn is not None:
                conn.close()
    def execute_query(self, sql_query, values=None):
        """
        Execute the provided SQL query,provided there are no values
        :param sql_query: SQL query to execute
        :param values: Values to be used in the query (optional)
        """
        conn = None
        try:
            conn = psycopg2.connect(
                database=self.database, user=self.user, 
                password=self.password, host=self.host, port=self.port
            )
            conn.set_client_encoding(self.encoding)
            cur = conn.cursor()
            # on multiple rows at once
            if values is not None:
                #values is a list of tuples, each tuple is a record we want to insert into the database, because of the way executemany works
                cur.executemany(sql_query, values)
            else:
                cur.execute(sql_query)
            conn.commit()
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn is not None:
                conn.close()

    def insert_article_to_sql(self, keyword_list,id=""):
        """
        Insert a list of keyword rows into the Articles table.
        :param keyword_list: List of keyword rows to insert
        :param id: Optional identifier for the table for concurrency
        """

        insert_sql = "INSERT INTO Articles"+str(id)+"(website,keyword,date,count,link,intonation,category,score) " \
                     "VALUES(%s,%s,%s,%s,%s,%s,%s,%s);"
        self.execute_query(insert_sql, keyword_list)
    def insert_keyword_intonation_to_sql(self,keyword_intonation_list):
        """
        Insert a list of keyword intonation rows into the Keywords table.
        This is the table used for learning intonations of keywords
        :param keyword_intonation_list: List of keyword intonation rows to insert
        """
        insert_sql = "INSERT INTO Keywords(keyword,intonation) " \
                     "VALUES(%s,%s);"
        self.execute_query(insert_sql, keyword_intonation_list)
    def select_all_from_table(self,table_name):
        """
        Select all rows from the specified table.
        :param table_name: Name of the table to select from
        :return: List of all rows in the table
        """
        select_query=f'SELECT * FROM {table_name}'
        conn = None
        cur = None
        try:
            conn = psycopg2.connect(
                database=self.database, user=self.user, password=self.password, host=self.host, port=self.port
            )
            conn.set_client_encoding(self.encoding)
            cur = conn.cursor()
            cur.execute(select_query)
            return cur.fetchall()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn:
                cur.close()
                conn.close()
    def select_learned_keywords(self):
        """
        Select all rows from the Keywords table.
        we need it to map keywords we already learned to intonation
        :return: List of all rows in the Keywords table
        """
        return self.select_all_from_table('Keywords')
    

    def select_keyword_sentiment(self,id):
        """
        Select all rows from the KeywordSentiment table with the specified ID.
        :param id: ID of the table
        :return: List of all rows in the KeywordSentiment table
        """
        return self.select_all_from_table('KeywordSentiment'+id)
        
                       
    def select_articles_from_sql(self, columns="*", conditions=None,id="",table_name="Articles"):
        """
        Select columns from a table based on a condition.
        :param columns: Columns to select (default: "*" meaning all)
        :param conditions: Condition to filter the rows (optional)
        :param id: Optional identifier for the table
        :param table_name: Name of the table to select from (default: "Articles")
        :return: List of selected rows from the table
        """
        if conditions is not None:
            select_query = f"SELECT {columns} FROM "+table_name+str(id)+f" WHERE {conditions}"
        else:
            select_query = f"SELECT {columns} FROM "+table_name+str(id)
        conn = None
        cur = None
        try:
            conn = psycopg2.connect(
                database=self.database, user=self.user, password=self.password, host=self.host, port=self.port
            )
            conn.set_client_encoding(self.encoding)
            cur = conn.cursor()
            cur.execute(select_query)
            return cur.fetchall()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn:
                cur.close()
                conn.close()


    def insert_article_intonation_analysis_sql(self,article_analysis_list,id=""):
        """
        Insert an article analysis list into the ArticleSentiment table.
        :param article_analysis_list: List of article analysis rows to insert
        :param id: Optional identifier for the table
        """
        insert_sql = "INSERT INTO ArticleSentiment"+str(id)+"(article_link,overall_sentiment,sum_negative_keywords ,sum_positive_keywords ,date, total_score) " \
                     "VALUES(%s,%s,%s,%s,%s,%s);"
        self.execute_query(insert_sql, article_analysis_list)

    def insert_and_update_keyword_intonation_analysis_sql(self,keyword_analysis_list,id=""):
        """
        Insert a keyword analysis list into the KeywordSentiment table.
        We also need to upate the score of any keywords that already exist
        :param keyword_analysis_list: List of keyword analysis rows to insert
        :param id: Optional identifier for the table
        """
        existing_rows=self.select_keyword_sentiment(id)
        updated_rows = []
        for keyword_analysis in keyword_analysis_list:
            keyword, intonation, score, website = keyword_analysis

        # Check if there is a matching element in the existing_rows list
            for existing_row in existing_rows:
                kw, it, existing_score, web = existing_row
                if kw == keyword and it == intonation and web == website:
                # Both are converted to float, because rows from the database with numeric type are of decimal.decimal type
                    updated_score =float(existing_score) +float(score)


                    updated_element = (keyword, intonation, updated_score, website)
                    updated_rows.append(updated_element)
        
        for row in updated_rows:
            keyword,intonation,score,website=row
            self.update_keyword_sentiment(f"KeywordSentiment{id}",keyword,intonation,website,score)

        
        insert_sql = "INSERT INTO KeywordSentiment"+str(id)+"(keyword,intonation,score,website) " \
                     "VALUES(%s,%s,%s,%s);"
        self.execute_query(insert_sql, keyword_analysis_list)
        
            
    def clear_table(self):
        """
        Clear all records from the table, but the table structure remains, unlike DROP and DELETE.
        The table can be accessed later and does not need to be created again
        """
        clear_query = "TRUNCATE TABLE Articles"
        self.execute_query(clear_query)

    def generate_table(self,upper_limit=1000):
        """
        Create a random Articles table to store the results, 
        so that concurrent requests will not show incorrectly.
        Returns the ID of the generated table as a string.
        :param upper_limit: Upper limit for the random table ID (default: 1000)
        :return: ID of the generated table
        """
        table_id=str(random.randint(0,upper_limit))
        #erases previous tables we may have failed to close
        self.delete_table(table_id)
        create_query = "CREATE TABLE Articles"+table_id+"(website TEXT,keyword TEXT,date DATE,count INT,link TEXT,intonation TEXT,category TEXT,score Numeric(4,3),PRIMARY KEY (link,keyword));"
        self.execute_query(create_query)
        create_sentiment_query = "CREATE TABLE ArticleSentiment"+table_id+"(article_link TEXT,overall_sentiment TEXT,sum_negative_keywords NUMERIC(5,3),sum_positive_keywords NUMERIC(5,3),date DATE,total_score Numeric(4,3),PRIMARY KEY (article_link));"
        self.execute_query(create_sentiment_query)
        keyword_sentiment_query = "CREATE TABLE KeywordSentiment"+table_id+"(keyword TEXT,intonation TEXT,score Numeric(5,3),website TEXT,PRIMARY KEY (keyword,intonation,website));"
        self.execute_query(keyword_sentiment_query)
        return table_id
    
    def delete_table(self,table_id):
        """
        Clear all records from all 3 tables and remove them permanently, unlike TRUNCATE.
        The reason for this is to work within the limited storage of the free plan in ElephantSQL
        :param table_id: ID of the table to delete
        """
        clear_query = "DROP TABLE IF EXISTS Articles"+str(table_id)
        self.execute_query(clear_query)
        clear_sentiment_query = "DROP TABLE IF EXISTS ArticleSentiment"+str(table_id)
        self.execute_query(clear_sentiment_query)
        clear_keyword_sentiment_query = "DROP TABLE IF EXISTS KeywordSentiment"+str(table_id)
        self.execute_query(clear_keyword_sentiment_query)
    
    def delete_specific_table(self,table_name):
        """
        Clear all records from the table and remove it permanently, unlike TRUNCATE.
        :param table_name: Name of the table to delete
        """
        clear_query = "DROP TABLE IF EXISTS "+str(table_name)
        self.execute_query(clear_query)