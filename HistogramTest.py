import unittest

from Graph import *


class TestHistogram(unittest.TestCase):
    def test_keywords_by_count(self):
        h = Graph("dummy.csv", "Keyword", "Count", "Count of keywords")
        h.get_graph()

    def test_count_over_time(self):
        h = Graph("date_dummy.csv", "Date", "Count", "Count over time")
        h.get_graph()


if __name__ == '__main__':
    unittest.main()
