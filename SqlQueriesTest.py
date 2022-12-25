import unittest
from SqlQueries import *

class MyTestCase(unittest.TestCase):
    def test_csv_to_sql_transfer(self):
        copy_csv_to_sql('example_csvs\transfer.csv')


if __name__ == '__main__':
    unittest.main()
