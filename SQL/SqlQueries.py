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


    def execute_query(self, sql_query, values=None):

        conn = None
        try:
            conn = psycopg2.connect(
                database=self.database, user=self.user, password=self.password, host=self.host, port=self.port
            )
            cur = conn.cursor()
            # on multiple rows at once
            if values is not None:
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
    def select_learned_keywords(self):
        select_query='SELECT * FROM Keywords'
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
    def select_articles_from_sql(self, columns="*", conditions=None,id=""):
        """
        """
        if conditions is not None:
            select_query = f"SELECT {columns} FROM Articles"+str(id)+f" WHERE {conditions}"
        else:
            select_query = f"SELECT {columns} FROM Articles"+str(id)
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
    def insert_article_intonation_analysis_sql(self,article_analysis_list):
        insert_sql = "INSERT INTO ArticleSentiment(article_link,overall_sentiment ,sum_negative_keywords ,sum_positive_keywords ,date) " \
                     "VALUES(%s,%s,%s,%s,%s);"
        self.execute_query(insert_sql, article_analysis_list)
            
    def clear_table(self,table_name='Articles'):
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
        return table_id
    def delete_table(self,table_id):
        """
        clears all records from the table and removes it permenantly
        unlike TRUNCATE 
        """
        clear_query = "DROP TABLE Articles"+str(table_id)
        self.execute_query(clear_query)
