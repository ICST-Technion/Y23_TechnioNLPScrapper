import unittest

from Histogram import *


class TestHistogram(unittest.TestCase):
    def show_keyword_by_count(self):
        h = Histogram("dummy.csv", "Keyword", "Count")
        h.get_histogram()


if __name__ == '__main__':
    unittest.main()
