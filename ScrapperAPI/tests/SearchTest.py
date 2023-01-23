import unittest
from googleapiclient.discovery import build
from urllib.parse import quote, unquote

class TestGoogleSearch(unittest.TestCase):
    def test_search(self):
        # Set up the API client
        service = build('customsearch', 'v1', developerKey='AIzaSyDShZ9oDpV1o-z-KAcrQXAB-pKEexqNJHc',cache_discovery=False)

        # Define the search query
        query = 'בהר הגעש הפעיל'
        encoded_keyword = quote(query)
        decoded_keyword = unquote(encoded_keyword)

        # Perform the search
        result = service.cse().list(q=decoded_keyword, cx='0655ca3f748ac4757', siteSearch='www.ynet.co.il').execute()

        # Check the results
        self.assertIsNotNone(result)
        self.assertGreater(len(result['items']), 0)
        for item in result['items']:
            self.assertIn(query, item['title'])
            self.assertIn(query, item['snippet'])
if __name__ == '__main__':
    unittest.main()