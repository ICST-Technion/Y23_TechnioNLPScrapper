import unittest

from Graph import *
from TechnioNLPScrapper.CompareGraph import CompareGraph
from TechnioNLPScrapper.HistGraph import HistGraph
from TechnioNLPScrapper.LineGraph import LineGraph


class TestGraph(unittest.TestCase):
    def test_keywords_by_count(self):
        h = HistGraph("dummy.csv", "Keyword", "Count", "Count of keywords")
        h.get_graph()

    def test_count_over_time(self):
        h = LineGraph("date_dummy.csv", "Date", "Count", "Count over time")
        h.get_graph()

    def test_compare_keywords_over_time(self):
        h = CompareGraph("sample.csv", "Date", "Keyword")
        h.get_graph()


if __name__ == '__main__':
    unittest.main()
