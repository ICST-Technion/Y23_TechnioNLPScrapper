import unittest
import sys
sys.path.append('..')
from SqlQueries import *


class MyTestCase(unittest.TestCase):

    def test_select_sql(self):
        sql_query = SQLQuery()
        rows = sql_query.select_articles_from_sql(columns="keyword")
        print(rows)
        self.assertEqual(len(rows), 6)


if __name__ == '__main__':
    unittest.main()
