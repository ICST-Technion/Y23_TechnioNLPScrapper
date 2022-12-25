import psycopg2
from Article import Article


def copy_csv_to_sql(file_name):
    """
    copies the records from a csv file to the posgresql server
    file must contain the following fields, in this order:
    Website- name of the website the data was scrapped from
    Keyword- the keyword that was scrapped
    Date- when the article was written format: yyyy-mm-dd hh:mm:ss
    Count- the number of appearances of the keyword
    Link- the link the data was scrapped from
    Intonation- the intonation of the keyword boolean (true:positive or false:negative)
    """
    conn = psycopg2.connect(
        database="TechnioNLPScrapper",
        user="postgres",
        host="localhost",
        port=5433,
        password="password",
    )
    cur = conn.cursor()
    with open(file_name, 'r') as f:
        next(f)  # Skip the header row.
        cur.copy_from(f, 'Data', sep=',')
    conn.commit()


def insert_article_to_sql(keyword_list):
    """
    insert the keyword_list given as parameter to our SQL server
    :param keyword_list: the rows you want to insert to the database
    prints an error if there was an issue with insertion
    note: postgresql automatically converts names to lowercase, to use uppercase
    we need to add quotation marks ""

    """
    insert_sql = "INSERT INTO public.\"Data\"(\"Website\",\"Keyword\",\"Date\",\"Count\",\"Link\",\"Intonation\") " \
                 "VALUES(%s,%s,%s,%s,%s,%s);"
    conn = None
    try:
        conn = psycopg2.connect(
            database="TechnioNLPScrapper",
            user="postgres",
            host="localhost",
            port=5433,
            password="password",
        )
        cur = conn.cursor()
        # execute the INSERT statement (on multiple rows at once
        cur.executemany(insert_sql, keyword_list)
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
