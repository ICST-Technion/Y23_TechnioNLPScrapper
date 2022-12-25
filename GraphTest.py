import unittest

import matplotlib.pyplot as plt

from Graph import *
from CompareGraph import CompareGraph
from HistGraph import HistGraph
from LineGraph import LineGraph


class TestGraph(unittest.TestCase):
    def test_keywords_by_count(self):
        h = HistGraph("example_csvs\dummy.csv", "Keyword", "Count", "Count of keywords")
        h.get_graph()

    def test_count_over_time(self):
        h = LineGraph(file="example_csvs\date_dummy2.csv", x_axis="Date", y_axis="Count", title="Keyword over time")
        h.get_graph()

    def test_compare_keywords_over_time(self):
        h = CompareGraph("example_csvs\sample.csv", "Date", "Keyword")
        h.get_graph()


if __name__ == '__main__':
    unittest.main()
