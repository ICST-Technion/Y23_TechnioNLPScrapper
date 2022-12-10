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
        sentences = self.p1.find_text_by_regex("הר+")
        matches = [sentence for sentence in sentences if re.search('הר+', sentence)]
        self.assertTrue(all(matches) and sentences)

    def test_word_counting(self):
        # the reason for the greater than, is because ctrl-f can't find all the instances of the word
        counter = self.p1.count_word_in_webpage('הר')
        self.assertTrue(21 < counter)

    def test_most_common_words(self):
        common_list = self.p1.most_common_words_in_page(7)
        self.assertEqual(len(common_list), 7)


if __name__ == '__main__':
    unittest.main()
