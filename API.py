# Using flask to make an api
# import necessary libraries and functions
from flask import Flask, jsonify, request, make_response
from SqlQueries import *
from datetime import datetime
# from google import search

# creating a Flask app
app = Flask(__name__)


@app.route('/rows', methods=['POST'])
def default_select_table():
    select_all = SQLQuery()
    table = select_all.select_articles_from_sql()
    return make_response(jsonify(results=table), 200)


@app.route('/clear', methods=['POST'])
def clear_table():
    clear_query = SQLQuery()
    clear_query.clear_table()
    return make_response("OK", 200)


# request of regular query
@app.route('/query', methods=['POST'])
def get_database_query():
    query = request.json.get('Query', "")
    #TODO:add the google search in here

    return make_response(query, 200)


def parse_json_and_strip(json_field):
    field_content = request.json.get(json_field, "")
    return  [word.strip() for word in field_content.split(',')]


def parse_table_rows(rows):
    return [row[0] for row in rows]


@app.route('/advancedSearch', methods=['POST'])
def advanced_search():
    # TODO: check format
    included_keywords = parse_json_and_strip('included_keywords')
    #requires at least one keyword
    if not included_keywords:
        #return bad request error
        return make_response("Searching requires at least one keyword", 400)

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
    time_range = parse_json_and_strip('date_range')
    #no dates were passed
    if time_range==[""]:
        datetime_range=[datetime(year=datetime.now().year-1,month= 1, day=1),datetime.now()]
    else:
        datetime_range = [datetime.strptime(date_string, "%Y-%m-%d") for date_string in time_range]

    links_to_scrap=[]
    #TODO: search for queries and stuff here

    # not adding specified statistics yet, because there is only counter for now
    return make_response("OK", 200)


# driver function
if __name__ == '__main__':

    app.run(debug=True)
