import unittest

from Article import *


class ArticleTests(unittest.TestCase):
    def test_title_extraction(self):
        p1 = Article('https://www.ynet.co.il/news/article/hjg6zmupo#autoplay')
        self.assertEqual(p1.title, 'תיעוד ההתפרצות בהר הגעש הפעיל הגדול בעולם: "אמא טבע מראה את פניה"')

    def test_date_extraction(self):
        p1 = Article('https://www.ynet.co.il/news/article/hjg6zmupo#autoplay')
        self.assertEqual(p1.date, datetime(2022, 12, 1, 13, 42))

    def test_website_name(self):
        p1 = Article('https://www.ynet.co.il/news/article/hjg6zmupo#autoplay')

        self.assertEqual(p1.website, "ynet")


if __name__ == '__main__':
    unittest.main()
