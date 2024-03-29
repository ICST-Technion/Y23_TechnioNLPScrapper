import os
import sys
import unittest

sys.path.append('..\\Scrapping')
from Scrapping.NLP import *
from Scrapping.Article import *

class NLPTests(unittest.TestCase):
    def test_sentiment_English(self):
        text = 'May this sentence return a negative result, and nothing can possibly go wrong'
        self.assertEqual(extract_sentiment(text)[0],'negative')
    def test_sentiment_Hebrew(self):
        text = 'פתרון לבעיה שהוצע בחיפזון'
        self.assertEqual(extract_sentiment(text)[0],'positive')
    def test_sentiment_article_soup(self):
        link='https://www.ynet.co.il/environment-science/article/ryxizfkvh#autoplay'
        article=Article(link)
        self.assertEqual(extract_sentiment(article.extract_article_description())[0],'positive')
    def test_text_too_short_error(self):
        sentiment='nothing'
        try:
            extract_sentiment('')
        except:
            sentiment='neutral'    
        finally:
            self.assertEqual(sentiment,'neutral')
    def test_keyword_extraction(self):
        text='The dragon thrashed and wailed in its flight'
        keywords=find_keyword_in_text(text)
        for keyword in keywords:
            print(keyword)
        self.assertGreater(len(keywords),0)
    def test_Hebrew_keyword_sentiment_analysis(self):
        text='מסעדה גרועה, איכות מצוינת'
        keywords=find_keyword_in_text(text)
        for keyword in keywords:
            print(keyword['text'])
            print(keyword['sentiment'])
        self.assertGreater(len(keywords),0)         
                    


if __name__ == '__main__':
    unittest.main()

