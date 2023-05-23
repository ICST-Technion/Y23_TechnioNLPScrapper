import os
import sys
import unittest

sys.path.append('..\\Scrapping')
from Scrapping.NLP import *
from Scrapping.Article import *

class NLPTests(unittest.TestCase):
    def test_sentiment_English(self):
        text = 'May this sentence return a negative result, and nothing can possibly go wrong'
        self.assertEqual(extract_sentiment(text),'negative')
    def test_sentiment_Hebrew(self):
        text = 'פתרון לבעיה שהוצע בחיפזון'
        self.assertEqual(extract_sentiment(text),'positive')
    def test_sentiment_article_soup(self):
        link='https://www.ynet.co.il/environment-science/article/ryxizfkvh#autoplay'
        article=Article(link)
        self.assertEqual(extract_sentiment(article.extract_article_content()),'negative')            


if __name__ == '__main__':
    unittest.main()

