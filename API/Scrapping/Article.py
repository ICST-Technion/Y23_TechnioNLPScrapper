import sys
from urllib.error import HTTPError
import bs4 as bs
import urllib.request
from datetime import datetime
from tldextract import extract
import re

sys.path.append('..\\Scrapping')
from Scrapping.NLP import *


def month_string_to_number(month_string):
    """
    Convert the month string to its corresponding number.
    :param month_string: String representing the month abbreviation (e.g., 'Jan', 'Feb', etc.)
    :return: Corresponding month number (1-12)
    """
    month_to_number = {
        "Jan": 1,
        "Feb": 2,
        "Mar": 3,
        "Apr": 4,
        "May": 5,
        "Jun": 6,
        "Jul": 7,
        "Aug": 8,
        "Sep": 9,
        "Oct": 10,
        "Nov": 11,
        "Dec": 12
    }
    return month_to_number[month_string]





def parse_date(date_as_string):
    """
    Convert the string with the date to a datetime object for uniformity ease of use
    :param date_as_string: Date string in the format "YYYY-MM-DDTHH:MM:SS.SSSSSSZ"
    because this is the format most news websites use
    :return: Corresponding datetime object
    """
    date_format = "%Y-%m-%dT%H:%M:%S.%fZ"
    datetime_object=datetime.now()
    #can fail beause some websites don't use this format
    try:
        datetime_object = datetime.strptime(date_as_string, date_format)
        parsed_day=datetime_object
    except ValueError:
        parsed_day=datetime_object
    finally:    
        return parsed_day





def get_website_name(link):
    """
    Extract the name of the website from the link without TLD.
    for example- www.ynet.co.il
    will return just ynet
    :param link: Full website link
    :return: Website name (without TLD)
    """
    _, name, _ = extract(link)
    return name


class Article:
    """
    This class represents scrapped data from articles and puts them in an Article object.
    It allows to process it before adding it to the database
    """

    def __init__(self, link):
        """
        Initialize the Article object with the given link.
        :param link: Link of the article to be scraped
        """
        self.link = link
        try:
            # can fail because access is forbidden to some links
            source = urllib.request.urlopen(link).read()
            self.soup = bs.BeautifulSoup(source, 'lxml')
        except HTTPError as e:
            raise HTTPError(e.url, e.code, "forbidden to scrap.", e.hdrs, e.fp)
        if self.soup.title is not None:
            self.title = self.soup.title.string
        self.website = get_website_name(link)
        self.date = parse_date(self.extract_date())
        text=self.extract_article_description()
        try:
            self.sentiment,self.score=extract_sentiment(text)
            #Watson can fail because the text is too short, or if there are invalid characters, 
            # In any case, there is a default value
        except:
            self.sentiment,self.score='neutral',0.0    
    def get_website(self):
        return self.website
    def extract_date(self):
        """
        Tries to search in common tags in articles where the date is found.
        If it can't find the date, returns the current date and time.
        :return: Date string in the format "YYYY-MM-DDTHH:MM:SS"
        """
        tags_to_check = [
        self.soup.head.find("meta", property=prop) for prop in
        ["article:published_time", "article:published", "og:published_time"]
        ] + [self.soup.time]

        date_property = next((tag.get("content") for tag in tags_to_check if tag is not None), None)

        if date_property is not None:
            return date_property

        # We don't know how to extract, return current date and time
        return datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

    def extract_article_body(self):
        """
        Extract the body of the article from the webpage, for sentiment analysis.
        Searches by looking for text in Hebrew,can return an empty string based on the site format
        :return: Extracted text from the article body
        """
        hebrew_pattern = re.compile(r'[\u0590-\u05FF\s]+')
        hebrew_elements = self.soup.body.find_all('span',text=hebrew_pattern,attrs={'data-text': 'true'})
        extracted_text = ''.join([element.get_text() for element in hebrew_elements])
        return extracted_text
    
    def find_keywords_in_article(self):
        """
        Find keywords in the article (using Watson, see NLP) by analyzing its body and description.
        :return: List of keywords found in the article
        """
        body=self.extract_article_body()
        description=self.extract_article_description()
        text=body+description
        try:
            #Watson can throw exceptions if a text is too short
            keywords_in_article=find_keyword_in_text(text)
            return keywords_in_article
        except:
            return []    
        
    def calculate_keyowrd_sum(self,intonation):
        """
        Calculate the sum of scores for keywords with the given intonation.
        :param intonation: Intonation of the keywords ('positive' or 'negative' or 'neutral')
        :return: Sum of scores for keywords with the given intonation
        """
        keywords_in_article=self.find_keywords_in_article()
        intonated_keywords=[keyword['sentiment']['score'] for keyword in keywords_in_article if keyword['sentiment']['label']==intonation]
        return sum(intonated_keywords)


    def create_sentiment_score_rows(self):
        """
        Create rows for sentiment score data to be stored in the database.
        :return: List of tuples representing sentiment score data
        (overall_sentiment,sum_negative,sum_positive,date,article_score)
        the reason for this format is this is the format psycopg uses for adding rows to the database.
        The article_score is not always equal to sum_positive and sum_negative, this is intentional,
        because article_score
        analyzes the description and the body in its entirety.
        """
        date_str = self.date_to_sql_format()
        rows = [(self.link,self.sentiment,
                 self.calculate_keyowrd_sum('negative'),self.calculate_keyowrd_sum('positive'),date_str,self.score)]
        return rows

    def find_text_by_regex(self, regex):
        """
        Return the list of strings that match a regular expression in the article.
        :param regex: The expression to match
        :return: The list of strings that match a regular expression in the article
        """
        return [paragraph.get_text() for paragraph in self.soup.findAll(name='div', string=re.compile(regex))]




    def count_word_in_webpage(self, word):
        
        """
        Count the number of instances of a word in the webpage.
        :param word: Word to be counted
        :return: Number of instances of the word in the text
        """
        return len(self.soup.find_all(string=re.compile(word)))

    def count_phrase_in_webpage(self, phrase):
        """
        Count the number of instances of a phrase in the webpage.
        (it can't be a part of another word)
        :param phrase: Phrase to be counted
        :return: Number of instances of the phrase in the text
        """
        pattern = re.compile(r'\b{}\b'.format(re.escape(phrase)))
        return len(self.soup.find_all(string=pattern))

    

    def extract_article_description(self):
        """
        Extract the description of the article from the webpage.
        can be empty because news formats for websites are different
        :return: Extracted article description
        """
        meta_tag = self.soup.head.find('meta', attrs={'name': 'description'})
        content_description=meta_tag["content"] if meta_tag is not None else ''        
        return content_description    
    def date_to_sql_format(self):

        sql_datetime_format="%Y-%m-%d, %H:%M:%S"
        date_as_sql_string=''
        try:
            date_as_sql_string = self.date.strftime(sql_datetime_format)
        except:
            date_as_sql_string = datetime.now().strftime(sql_datetime_format)
        finally:
            return date_as_sql_string    

        
    def create_rows_to_database(self, keyword_intonation_list, phrases_intonation_list, category='1'):
        """
        Create rows of data to be stored in the database.
        :param keyword_intonation_list: List of tuples containing keywords and their intonations
        :param phrases_intonation_list: List of tuples containing phrases and their intonations
        :param category: Category of the article
        :return: List of tuples representing data rows
        """
        date_str = self.date_to_sql_format()
        rows = [(self.website, keyword, date_str, str(self.count_word_in_webpage(keyword)), self.link, str(intonation), category,self.score)
            for keyword, intonation in keyword_intonation_list]
        rows += [(self.website, phrase, date_str, str(self.count_phrase_in_webpage(phrase)), self.link, str(intonation), category,self.score)
             for phrase, intonation in phrases_intonation_list]
        return rows



