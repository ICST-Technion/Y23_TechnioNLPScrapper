from collections import Counter
from string import punctuation
import sys
from urllib.error import HTTPError
import bs4 as bs
import urllib.request
from datetime import datetime
from tldextract import extract
import re

sys.path.append('..\\Scrapping')
from Scrapping.NLP import extract_sentiment


# this dictionary is here in case we will want to parse new date formats
def month_string_to_number(month_string):
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


'''
Convert the string with the date to a datetime object
date_as_string has the format returned by extract_date
returns a datetime object with the same Year,Month,Day,Hour,Minute
as the string
The string format:
"YYYY-MM-DDTHH:MM:SS.SSSSSSZ"
(the format of the seconds doesn't really matter because we aren't using them)
Y- year
M-month
D- day
H-hour
M-minute
S-second

'''


def parse_date(date_as_string):
    # checking if T is in the string not useful because some websites have IST in date
    date_format = "%Y-%m-%dT%H:%M:%S.%fZ"
    datetime_object=datetime.now()
    try:
        datetime_object = datetime.strptime(date_as_string, date_format)
        parsed_day=datetime_object
    except ValueError:
        parsed_day=datetime_object
    finally:    
        return parsed_day


'''
extract the name of the website from the link without tld,
for example- www.ynet.co.il
will return just ynet
'''


def get_website_name(link):
    _, name, _ = extract(link)
    return name


class Article:
    """
    This class will represent scrapped data from articles and put them in an Article object
    the properties are:
    link- the link of the article the scrapping is done from
    make sure that the website allows scrapping first
    title: the main title of the article
    date: the date the article was published
    website: the name of the website (without TLD such as .com)
    """

    def __init__(self, link):
        self.link = link
        try:
            # can fail because access is forbidden sometimes
            source = urllib.request.urlopen(link).read()
        except HTTPError:
            print("Website inaccessible")
            return
        self.soup = bs.BeautifulSoup(source, 'lxml')
        if self.soup.title is not None:
            self.title = self.soup.title.string
        self.website = get_website_name(link)
        self.date = parse_date(self.extract_date())

        text=self.extract_article_content()
        self.sentiment=extract_sentiment(text)

    def extract_date(self):
        """
    Tries to search in common tags in the articles where the date is found.
    If it can't find the date, raises an exception.
    Returns the date as a string.
    """
        tags_to_check = [
        self.soup.head.find("meta", property=prop) for prop in
        ["article:published_time", "article:published", "og:published_time"]
    ] + [self.soup.time]

        date_property = next((tag.get("content") for tag in tags_to_check if tag is not None), None)

        if date_property is not None:
            return date_property

    # we don't know how to extract
        return datetime.now().strftime("%Y-%m-%dT%H:%M:%S")


    def find_text_by_regex(self, regex):
        """
        Returns a list of strings which contain the regular expression given as a parameter
        regex- a regular expression to search for in the website,string
        """
        return [paragraph.get_text() for paragraph in self.soup.findAll(name='div', string=re.compile(regex))]




    def count_word_in_webpage(self, word):
        
        """
        parameters:
        word- the word we want to count, string
        includes instances of the word within other words,
        for example if the word is "in" , will be counted in "instance"
        returns number of instances of that word in the text-integer
        """
        return len(self.soup.find_all(string=re.compile(word)))

    def count_phrase_in_webpage(self, phrase):
        """
        parameters:
        phrase- the phrase we want to count, string
        counts only if the phrase is the entire word
        returns number of instances of that word in the text-integer
        """
        pattern = re.compile(r'\b{}\b'.format(re.escape(phrase)))
        return len(self.soup.find_all(string=pattern))






    def extract_article_content(self):
        print('&&&&&&&&&&&&') 
        meta_tag = self.soup.head.find('meta', attrs={'name': 'description'})
        content_description=meta_tag["content"] if meta_tag is not None else ''
        print(content_description)          
        return content_description    

    def create_rows_to_database(self, keyword_intonation_list, phrases_intonation_list, category='1'):
        """
    given a keyword list, convert it into a format which can be written to the database
    :param keyword_intonation_list:
    list of tuples, each tuple is (keyword,intonation)
    keyword- string
    intonation- True: positive, False:negative
    :return: a list of the tuples :
     (website name, the keyword, date of the article, the number of times the keyword shows up in the article,
    the link to the article, the intonation of the keyword)
    """
        date_str = self.date.strftime("%Y-%m-%d, %H:%M:%S")
        rows = [(self.website, keyword, date_str, str(self.count_word_in_webpage(keyword)), self.link, str(intonation), category)
            for keyword, intonation in keyword_intonation_list]
        rows += [(self.website, phrase, date_str, str(self.count_phrase_in_webpage(phrase)), self.link, str(intonation), category)
             for phrase, intonation in phrases_intonation_list]
        return rows



