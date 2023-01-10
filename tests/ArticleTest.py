import os
import sys
import unittest

sys.path.append('..\\Scrapping')
from Article import *

sys.path.append('..\\SQL')
from SqlQueries import *


class ArticleTests(unittest.TestCase):
    example_article = Article('https://www.ynet.co.il/news/article/hjg6zmupo#autoplay')

    def test_title_extraction(self):
        self.assertEqual(self.example_article.title,
                         'תיעוד ההתפרצות בהר הגעש הפעיל הגדול בעולם: "אמא טבע מראה את פניה"')

    def test_date_extraction(self):
        self.assertEqual(self.example_article.date, datetime(2022, 12, 1, 13, 42))

    def test_different_sites_date_extraction(self):
        israel_hayom_article = Article('https://www.israelhayom.co.il/magazine/hashavua/article/13542285')
        self.assertEqual(israel_hayom_article.date, datetime(2023, 1, 5, 10, 31))
        the_marker_article = Article(
            'https://www.themarker.com/news/2023-01-05/ty-article/.premium/00000185-8233-d870-abc5-967750f90000')
        self.assertEqual(the_marker_article.date, datetime(2023, 1, 5, 15, 56))
        haaretz_article = Article(
            'https://www.haaretz.co.il/news/law/2023-01-06/ty-article/00000185-8735-d4ba-add5-aff7110e0000')
        self.assertEqual(haaretz_article.date, datetime(2023, 1, 6, 16, 8))

    def test_different_date_parsing(self):
        article_no_T_separator = Article('https://news.walla.co.il/item/3550126')
        self.assertEqual(article_no_T_separator.date, datetime(2023, 1, 5, 15, 48))

    def test_website_name(self):
        self.assertEqual(self.example_article.website, "ynet")

    def test_sentence_extraction(self):
        sentences = self.example_article.find_text_by_regex("הר+")
        matches = [sentence for sentence in sentences if re.search('הר+', sentence)]
        self.assertTrue(all(matches) and sentences)

    def test_word_counting(self):
        # the reason for the greater than, is because ctrl-f can't find all the instances of the word
        counter = self.example_article.count_word_in_webpage('הר')
        self.assertTrue(21 < counter)

    def test_most_common_words(self):
        common_list = self.example_article.most_common_words_in_page(7)
        print(common_list)
        self.assertEqual(len(common_list), 7)

    def test_write_keywords_to_sql(self):
        sql_article = Article('https://www.ynetnews.com/article/hj11i0w19o')
        keyword_example = [('divide', False), ('security', True)]
        sql_query = SQLQuery()
        rows = sql_article.create_rows_to_database(keyword_example)
        self.assertEqual(len(rows), len(keyword_example))
        sql_query.insert_article_to_sql(rows)


if __name__ == '__main__':
    unittest.main()
