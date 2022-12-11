import unittest

import matplotlib.pyplot as plt

from Graph import *
from CompareGraph import CompareGraph
from HistGraph import HistGraph
from LineGraph import LineGraph


class TestGraph(unittest.TestCase):
    def test_keywords_by_count(self):
        h = HistGraph("dummy.csv", "Keyword", "Count", "Count of keywords")
        plt.savefig("MVP_keyword_by_counter.png")
        h.get_graph()

    def test_count_over_time(self):
        h = LineGraph(file="date_dummy2.csv",x_axis= "Date",y_axis= "Count",title="Keyword over time")
        plt.savefig("MVP_count_over_time.png")
        h.get_graph()

    def test_compare_keywords_over_time(self):
        h = CompareGraph("sample.csv", "Date", "Keyword")
        plt.savefig("MVP_keyword_over_time.png")
        h.get_graph()


if __name__ == '__main__':
    unittest.main()
