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


def extract_date(soup):
    soup.find('head')
    date_property = soup.find("meta", property="article:published_time")
    return date_property.get("content")


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
        self.date = parse_date(extract_date(self.soup))
        self.website = get_website_name(link)

    def find_text_by_regex(self, regex):
        """
        Returns a list of strings which contain the regular expression given as a parameter
        regex- a regular expression to search for in the website,string
        """
        sentences = []
        for paragraph in self.soup.findAll(string=re.compile(regex)):
            sentences.append(paragraph.get_text())
        return sentences

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

    def write_article_info_to_file(self, file_name, num_rows=0, words=[]):
        """
    Writes data from the article in the following format:
    Date,Website,Keyword,Count
    the keywords can be either the most common words, or a list of specific words we want
    this function will append to a file if already exists
    file_name-
    words- list of keywords we want to count in the article, if empty, counts the most common words
    num_rows- the number of records (not including the field names row)
    note: the csv in the project shows up the words in an incorrect order from count due to encoding,
    but the file itself shows it correctly
        """
        array = []
        # each row is an array of the information we want from the article- word count, date,keyword, site etc.

        word_to_count = self.most_common_words_in_page(num_rows)
        if not os.path.exists(file_name):
            title_row = ['Date', 'Website', 'Keyword', 'Count']
            array.append(title_row)
        for i in range(num_rows):
            if not words:
                row = [self.date, self.website, word_to_count[i][0], word_to_count[i][1]]
            else:
                row = [self.date, self.website, words[i], self.count_word_in_webpage(words[i])]
            array.append(row)
        f = open(file_name, 'a')
        w = csv.writer(f, lineterminator='\n')
        w.writerows(array)
        f.close()

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
