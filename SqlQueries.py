import psycopg2


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
    # conn = psycopg2.connect("host=localhost dbname=TechnioNLPScrapper user=postgres")
    cur = conn.cursor()
    with open(file_name, 'r') as f:
        next(f)  # Skip the header row.
        cur.copy_from(f, 'Data', sep=',')
    conn.commit()

