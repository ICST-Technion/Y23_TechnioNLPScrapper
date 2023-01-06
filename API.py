# Using flask to make an api
# import necessary libraries and functions
from flask import Flask, jsonify, request, make_response
import requests
from SqlQueries import *
from datetime import datetime
# from google import search

# creating a Flask app
app = Flask(__name__)


@app.route('/rows', methods=['POST'])
def default_select_table():
    select_all = SQLQuery()
    table = select_all.select_articles_from_sql()
    return jsonify(results=table)


@app.route('/clear', methods=['POST'])
def clear_table():
    clear_query = SQLQuery()
    clear_query.clear_table()


# request of regular query
@app.route('/query', methods=['POST'])
def get_database_query():
    query = request.json.get('Query', [])

    return make_response("OK", 200)


def parse_json_and_strip(json_field):
    field_content = request.json.get(json_field, "")
    [word.strip() for word in field_content.split(',')]
    return field_content


def parse_table_rows(rows):
    return [row[0] for row in rows]


@app.route('/advancedSearch', methods=['POST'])
def advanced_search():
    # TODO: check format
    included_keywords = parse_json_and_strip('included_keywords')
    excluded_keywords = parse_json_and_strip('excluded_keywords')
    query_executor = SQLQuery()
    table = query_executor.select_articles_from_sql(columns="keyword")
    database_keywords = parse_table_rows(table)
    # [('one',), ('two',), ('three',)]
    keywords_to_search = list((set(database_keywords) | set(included_keywords)) - set(excluded_keywords))

    specified_websites = parse_json_and_strip('Sites')
    excluded_websites = parse_json_and_strip('excluded_Sites')
    table_websites = query_executor.select_articles_from_sql(columns="website")
    database_websites = parse_table_rows(table_websites)

    websites_to_search = list((set(database_websites) | set(specified_websites)) - set(excluded_websites))

    # assumption: time range would be just two dates separated by comma
    time_range = parse_json_and_strip('time_range')
    datetime_range = [datetime.strptime(date_string, "%Y-%m-%d") for date_string in time_range]

    links_to_scrap=[]
    # for website in websites_to_search:
    #     query = website
    #     links_to_scrap.extend(search(query, tld="com", lang=['en', 'he'], num=10, start=1))

    # not adding specified statistics yet, because there is only counter for now
    return make_response("OK", 200)


# driver function
if __name__ == '__main__':
    app.run(debug=True)
