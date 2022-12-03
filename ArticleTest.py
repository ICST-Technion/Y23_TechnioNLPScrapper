import unittest
from Article import *


class ArticleTests(unittest.TestCase):
    p1 = Article('https://www.ynet.co.il/news/article/hjg6zmupo#autoplay')

    def test_title_extraction(self):
        self.assertEqual(self.p1.title, 'תיעוד ההתפרצות בהר הגעש הפעיל הגדול בעולם: "אמא טבע מראה את פניה"')

    def test_date_extraction(self):
        self.assertEqual(self.p1.date, datetime(2022, 12, 1, 13, 42))

    def test_website_name(self):
        self.assertEqual(self.p1.website, "ynet")

    def test_sentence_extraction(self):
        sentences = self.p1.find_text_by_regex('^הר')
        matches = [sentence for sentence in sentences if re.search('^הר', sentence)]
        self.assertTrue(all(matches))


if __name__ == '__main__':
    unittest.main()
