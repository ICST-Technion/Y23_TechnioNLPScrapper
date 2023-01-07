from collections import Counter
from string import punctuation
import csv
import bs4 as bs
import urllib.request
from datetime import datetime
from tldextract import extract
import re
import os







'''
Convert the string with the date to a datetime object
date_as_string has the format returned by extract_date
returns a datetime object with the same Year,Month,Day,Hour,Minute
as the string
'''


def parse_date(date_as_string):
    date_time_list = date_as_string.rsplit("T")
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

    """

    def __init__(self, link):
        self.link = link
        source = urllib.request.urlopen(link).read()
        self.soup = bs.BeautifulSoup(source, 'lxml')
        self.title = self.soup.title.string
        self.website = get_website_name(link)
        self.date = parse_date(self.extract_date())

    def extract_date(self):
        '''
finds the date property in Ynet articles, given the extracted parsed tree
returns the date as a string in the format
"YYYY-MM-DDTHH:MM:SS.SSSSSSZ"
Y- year
M-month
D- day
H-hour
M-minute
S-second
'''
        if self.website=="ynet" or self.website=="ynetnews":    
            date_property = self.soup.find("meta", property="article:published_time")
            return date_property.get("content")
        elif self.website=="israelhayom":
            return self.soup.time.get('datetime')
            #the marker   
        elif self.website=="themarker":
            date_property = self.soup.head.find("meta", property="article:published")
            return date_property.get("content")
        else:
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
