import unittest
from SqlQueries import *


class MyTestCase(unittest.TestCase):

    def test_select_sql(self):
        sql_query = SQLQuery()
        rows = sql_query.select_articles_from_sql(columns="*", conditions="count=8")
        self.assertEqual(len(rows), 2)


if __name__ == '__main__':
    unittest.main()
