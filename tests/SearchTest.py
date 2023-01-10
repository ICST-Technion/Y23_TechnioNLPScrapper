import unittest
from googleapiclient.discovery import build
from urllib.parse import quote, unquote

class TestGoogleSearch(unittest.TestCase):
    def test_search(self):
        # Set up the API client
        service = build('Testsearch', 'v1', developerKey='AIzaSyAxMB-n27DPUUksC-A5ppV07zuEaN7qtZE')

        # Define the search query
        query = 'בהר הגעש הפעיל'
        encoded_keyword = quote(query)
        decoded_keyword = unquote(query)

        # Perform the search
        result = service.cse().list(q=decoded_keyword, cx='0655ca3f748ac4757', siteSearch='www.ynet.co.il').execute()

        # Check the results
        self.assertIsNotNone(result)
        self.assertGreater(len(result['items']), 0)
        for item in result['items']:
            self.assertIn(query, item['title'])
            self.assertIn(query, item['snippet'])
