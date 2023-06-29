import psycopg2
import sys
import random

sys.path.append('..\\Scrapping')
from Scrapping.Article import *
from urllib.parse import urlparse


class SQLQuery:
    def __init__(self):
        self.db_url = "postgres://ltwwxnaj:BYQgr0k-KgVH98QbpkMfZ1USDpX2XDGU@ella.db.elephantsql.com/ltwwxnaj"
        # this line allows us to figure out the connection information to our database independent of the actual url
        url = urlparse(self.db_url)
        self.database = url.path[1:]
        self.user = url.username
        self.password = url.password
        self.host = url.hostname
        self.port = url.port

    def update_keyword_sentiment(self,table_name,keyword,intonation,website,new_score):
        conn = None
        update_query = f"""UPDATE {table_name}
                        SET score = {new_score}
                        WHERE keyword = {keyword} AND intonation={intonation} AND website={website};"""
        
        try:
            conn = psycopg2.connect(
                database=self.database, user=self.user, password=self.password, host=self.host, port=self.port
            )
            cur = conn.cursor()
            # on multiple rows at once
            cur.execute(update_query)
            conn.commit()
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn is not None:
                conn.close()
    def execute_query(self, sql_query, values=None):

        conn = None
        try:
            conn = psycopg2.connect(
                database=self.database, user=self.user, password=self.password, host=self.host, port=self.port
            )
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
    insert the keyword_list given as parameter to our SQL server
    :param keyword_list: the rows you want to insert to the database
    prints an error if there was an issue with insertion
    note: postgresql automatically converts names to lowercase, to use uppercase
    we need to add quotation marks ""

    """

        insert_sql = "INSERT INTO Articles"+str(id)+"(website,keyword,date,count,link,intonation,category,score) " \
                     "VALUES(%s,%s,%s,%s,%s,%s,%s,%s);"
        self.execute_query(insert_sql, keyword_list)
    def insert_keyword_intonation_to_sql(self,keyword_intonation_list):
        insert_sql = "INSERT INTO Keywords(keyword,intonation) " \
                     "VALUES(%s,%s);"
        self.execute_query(insert_sql, keyword_intonation_list)
    def select_all_from_table(self,table_name):
        select_query=f'SELECT * FROM {table_name}'
        conn = None
        cur = None
        try:
            conn = psycopg2.connect(
                database=self.database, user=self.user, password=self.password, host=self.host, port=self.port
            )
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
        return self.select_all_from_table('Keywords')
    

    def select_keyword_sentiment(self,id):
        return self.select_all_from_table(f'KeywordSentiment'+{id})
        
                       
    def select_articles_from_sql(self, columns="*", conditions=None,id="",table_name="Articles"):
        """
        select columns from a table based in a condition
        assumption: all tables have a name format of table_nameid
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
        insert_sql = "INSERT INTO ArticleSentiment"+str(id)+"(article_link,overall_sentiment,sum_negative_keywords ,sum_positive_keywords ,date, total_score) " \
                     "VALUES(%s,%s,%s,%s,%s,%s);"
        self.execute_query(insert_sql, article_analysis_list)
    def insert_keyword_intonation_analysis_sql(self,keyword_analysis_list,id=""):
        existing_rows=self.select_keyword_sentiment(id)
        updated_rows = []
        for keyword_analysis in keyword_analysis_list:
            keyword, intonation, score, website = keyword_analysis

        # Check if there is a matching element in the existing_rows list
            for existing_row in existing_rows:
                kw, it, existing_score, web = existing_row
                if kw == keyword and it == intonation and web == website:
                # Calculate the updated score by adding the previous score and the current score
                    updated_score = existing_score + score

                # Create a new tuple with the updated score and append it to the updated_elements list
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
        clears all records from the table, but table structure remains,
        unlike DROP and DELETE
        """
        clear_query = "TRUNCATE TABLE Articles"
        self.execute_query(clear_query)
    def generate_table(self,upper_limit=1000):
        """
        Create a random Articles table to store the results,
        so that concurrent requests will not show incorrectly
        returns the id of the generated table as string
        """
        table_id=str(random.randint(0,upper_limit))
        create_query = "CREATE TABLE Articles"+table_id+"(website TEXT,keyword TEXT,date DATE,count INT,link TEXT,intonation TEXT,category TEXT,score Numeric(4,3),PRIMARY KEY (link,keyword));"
        self.execute_query(create_query)
        create_sentiment_query = "CREATE TABLE ArticleSentiment"+table_id+"(article_link TEXT,overall_sentiment TEXT,sum_negative_keywords NUMERIC(5,3),sum_positive_keywords NUMERIC(5,3),date DATE,total_score Numeric(4,3),PRIMARY KEY (article_link));"
        self.execute_query(create_sentiment_query)
        keyword_sentiment_query = "CREATE TABLE KeywordSentiment"+table_id+"(keyword TEXT,intonation TEXT,score Numeric(5,3),website TEXT,PRIMARY KEY (keyword,intonation,website));"
        self.execute_query(keyword_sentiment_query)
        return table_id
    
    def delete_table(self,table_id):
        """
        clears all records from the table and removes it permenantly
        unlike TRUNCATE 
        """
        clear_query = "DROP TABLE Articles"+str(table_id)
        self.execute_query(clear_query)
        clear_sentiment_query = "DROP TABLE ArticleSentiment"+str(table_id)
        self.execute_query(clear_sentiment_query)
        clear_keyword_sentiment_query = "DROP TABLE KeywordSentiment"+str(table_id)
        self.execute_query(clear_keyword_sentiment_query)
    
    def delete_specific_table(self,table_name):
        """
        clears all records from the table and removes it permenantly
        unlike TRUNCATE 
        """
        clear_query = "DROP TABLE "+str(table_name)
        self.execute_query(clear_query)