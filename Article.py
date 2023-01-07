from collections import Counter
from string import punctuation
from urllib.error import HTTPError
import bs4 as bs
import urllib.request
from datetime import datetime
from tldextract import extract
import re

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
    #checking if T is in the string not useful because some websites have IST in date
    if "T" in date_as_string:
        date_time_list = date_as_string.rsplit("T")
    else:
        date_time_list = date_as_string.rsplit(" ")        
    date = date_time_list[0]
    time = date_time_list[1]
    year_month_day = date.rsplit("-")
    hour_minute = time.rsplit(":")
    parsed_day = datetime(int(year_month_day[0]), int(year_month_day[1]), int(year_month_day[2])
                          , int(hour_minute[0]), int(hour_minute[1]))
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
            #can fail because access is forbidden sometimes
            source = urllib.request.urlopen(link).read()
        except HTTPError:
            print("Website inaccessible")
            return    
        self.soup = bs.BeautifulSoup(source, 'lxml')
        self.title = self.soup.title.string
        self.website = get_website_name(link)
        self.date = parse_date(self.extract_date())

    def extract_date(self):
        '''
tries to search in common tags in the articles where the date is found
if can't fund the date, raises exception
returns the date as a string
'''
        date_property = self.soup.head.find("meta", property="article:published_time")
        if date_property is not None:
            return date_property.get("content")
        date_property = self.soup.head.find("meta", property="article:published")
        if date_property is not None:
            return date_property.get("content")    
        date_property=self.soup.time   
        if date_property is not None:
            return date_property.get('datetime')
        date_property=self.soup.head.find("meta", property="og:published_time")
        if date_property is not None:
            return date_property.get("content")    
            #we don't know how to extract
        raise Exception('Extraction of date unknown')

    def find_text_by_regex(self, regex):
        """
        Returns a list of strings which contain the regular expression given as a parameter
        regex- a regular expression to search for in the website,string
        """
        return [paragraph.get_text() for paragraph in self.soup.findAll(name='div',string=re.compile(regex))]

    def count_word_in_webpage(self, word):
        """
        parameters:
        word- the word we want to count, string
        returns number of instances of that word in the text-integer
        """
        return len(self.soup.find_all(string=re.compile(word)))

    def most_common_words_in_page(self, num=5):
        """
        finds num most common words in the page
        Returns:
            a list of the most common words in the webpage- pairs of: (word,count)
        """
        # We get the words within paragraphs

        paragraphs = (''.join(s.findAll(string=True)) for s in self.soup.findAll('p'))
        paragraph_count = Counter((x.rstrip(punctuation).lower() for y in paragraphs for x in y.split()))
        # We get the words within divs
        divs = (''.join(s.findAll(string=True)) for s in self.soup.findAll('div'))
        div_count = Counter((x.rstrip(punctuation).lower() for y in divs for x in y.split()))
        total = div_count + paragraph_count
        return total.most_common(num)


    def create_rows_to_database(self, keyword_intonation_list):
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
        rows = []
        for keyword, intonation in keyword_intonation_list:
            rows.append((self.website, keyword, self.date.strftime("%Y-%m-%d, %H:%M:%S"),
                         str(self.count_word_in_webpage(keyword)), self.link, str(intonation)))
        return rows
