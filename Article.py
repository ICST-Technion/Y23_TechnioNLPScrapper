import bs4 as bs
import urllib.request
from datetime import datetime
from tldextract import extract

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
        soup = bs.BeautifulSoup(source, 'lxml')
        self.title = soup.title.string
        self.date = parse_date(extract_date(soup))
        self.website = get_website_name(link)
