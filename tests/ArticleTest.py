import unittest
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Article import *
from SqlQueries import *


class ArticleTests(unittest.TestCase):
    example_article = Article('https://www.ynet.co.il/news/article/hjg6zmupo#autoplay')

    def test_title_extraction(self):
        self.assertEqual(self.example_article.title,
                         'תיעוד ההתפרצות בהר הגעש הפעיל הגדול בעולם: "אמא טבע מראה את פניה"')

    def test_date_extraction(self):
        self.assertEqual(self.example_article.date, datetime(2022, 12, 1, 13, 42))

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
