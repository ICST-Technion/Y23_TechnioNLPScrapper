import csv
import random
from datetime import date, timedelta

import pandas


def generate_keywords_over_time(row, col):
    a = []
    sdate = date(2019, 12, 22)  # start date
    edate = date(2020, 4, 9)  # end date
    dates = pandas.date_range(sdate, edate - timedelta(days=1), freq='d').strftime("%Y-%m-%d %H:%M:%S").tolist()
    keywords = ["Government", "Arrest", "Citizens", "Illegal"]
    websites = ["Ynet", "The marker", "Haaretz", "Israel Today"]
    for i in range(col):
        l = []
        for j in range(row):
            if j == 0:
                t = random.randrange(0, len(websites))
                l.append(websites[t])
            if j == 1:
                l.append(dates[i])
            else:
                k = random.randrange(0, len(keywords))
                l.append(keywords[k])
        a.append(l)
    return a


def generate_count_over_time(row, col):
    a = []
    sdate = date(2019, 12, 22)  # start date
    edate = date(2020, 4, 9)  # end date
    dates = pandas.date_range(sdate, edate - timedelta(days=1), freq='d').strftime("%Y-%m-%d %H:%M:%S").tolist()
    for i in range(col):
        l = []
        for j in range(row):
            if j == 1:
                t = random.randrange(1, 100)
                l.append(t)
            elif j == 0:
                l.append(dates[i])
        a.append(l)
    return a


if __name__ == '__main__':
    row = 2
    col = 100

    array = generate_count_over_time(row, col)

    f = open('date_dummy2.csv', 'w')
    w = csv.writer(f, lineterminator='\n')
    w.writerows(array)
    f.close()
