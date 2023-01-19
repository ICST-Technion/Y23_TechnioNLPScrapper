import datetime
import unittest
import sys
from datetime import date

sys.path.append('..\\SQL')
from SqlQueries import *


class MyTestCase(unittest.TestCase):

    def test_select_sql(self):
        sql_query = SQLQuery()
        rows = sql_query.select_articles_from_sql(columns="keyword")
        self.assertEqual(len(rows), 6)

    def test_add_neutral_keyword(self):
        sql_query = SQLQuery()
        article = Article('https://www.ynet.co.il/news/article/hjg6zmupo#autoplay')
        keyword_list = [('example1', "False"), ('example2', "neutral")]
        rows = article.create_rows_to_database(keyword_list)
        sql_query.insert_article_to_sql(rows)


if __name__ == '__main__':
    unittest.main()
