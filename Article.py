import bs4 as bs
import urllib.request
from datetime import datetime


def extract_date(soup):
    soup.find('head')
    date_property = soup.find("meta", property="article:published_time")
    return date_property.get("content")


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
        self.date = extract_date(soup)
