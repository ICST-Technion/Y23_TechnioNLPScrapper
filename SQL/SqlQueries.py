import psycopg2
import sys

sys.path.append('..\\Scrapping')
from Article import Article
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

    def copy_csv_to_sql(self, file_name):
        """
    copies the records from a csv file to the posgresql server
    file must contain the following fields, in this order:
    website- name of the website the data was scrapped from
    keyword- the keyword that was scrapped
    date- when the article was written format: yyyy-mm-dd hh:mm:ss
    count- the number of appearances of the keyword
    link- the link the data was scrapped from
    intonation- the intonation of the keyword (positive ,negative,neutral)
    """
        conn = psycopg2.connect(
            database=self.database, user=self.user, password=self.password, host=self.host, port=self.port
        )
        cur = conn.cursor()
        with open(file_name, 'r') as f:
            next(f)  # Skip the header row.
            cur.copy_from(f, 'Articles', sep=',')
        conn.commit()

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

    def insert_article_to_sql(self, keyword_list):
        """
    insert the keyword_list given as parameter to our SQL server
    :param keyword_list: the rows you want to insert to the database
    prints an error if there was an issue with insertion
    note: postgresql automatically converts names to lowercase, to use uppercase
    we need to add quotation marks ""

    """

        insert_sql = "INSERT INTO Articles(website,keyword,date,count,link,intonation) " \
                     "VALUES(%s,%s,%s,%s,%s,%s);"
        self.execute_query(insert_sql, keyword_list)

    def select_articles_from_sql(self, columns="*", conditions=None):
        """
        """
        if conditions is not None:
            select_query = f"SELECT {columns} FROM Articles WHERE {conditions}"
        else:
            select_query = f"SELECT {columns} FROM Articles"
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

    def clear_table(self):
        """
        clears all records from the table, but table structure remains,
        unlike DROP and DELETE
        """
        clear_query = "TRUNCATE TABLE Articles"
        conn = None
        cur = None
        try:
            conn = psycopg2.connect(
                database=self.database, user=self.user, password=self.password, host=self.host, port=self.port
            )
            cur = conn.cursor()
            cur.execute(clear_query)
            conn.commit()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn:
                cur.close()
                conn.close()
