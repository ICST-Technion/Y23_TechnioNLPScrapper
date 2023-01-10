from flask import Flask, jsonify, request, make_response
from datetime import datetime
import os, sys

# this line allows the python to see, the files in the parent directory and import them
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from SqlQueries import *

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
    return make_response("table cleared", 200)


# request of regular query
@app.route('/query', methods=['POST'])
def get_database_query():
    query = request.json.get('Query', "")
    # TODO:add the google search in here

    return make_response(query, 200)


def parse_json_and_strip(json_field):
    field_content = request.json.get(json_field, [])
    if field_content == []:
        return []
    return [word.strip() for word in field_content.split(',')]


def parse_table_rows(rows):
    return [row[0] for row in rows]


def include_exclude_lists(universe, included, excluded):
    return list((set(universe) | set(included)) - set(excluded))


def create_parameters_list(included_field, excluded_field, database_field, conditions=None):
    query_executor = SQLQuery()
    included_parameters = parse_json_and_strip(included_field)
    excluded_parameters = parse_json_and_strip(excluded_field)
    database_rows = query_executor.select_articles_from_sql(columns=database_field, conditions=conditions)
    database_parameters = parse_table_rows(database_rows)
    return include_exclude_lists(database_parameters, included_parameters, excluded_parameters)


def is_at_least_one_keyword():
    included_keywords = parse_json_and_strip('included_keywords')
    return included_keywords != []


@app.route('/advancedSearch', methods=['POST'])
def advanced_search():
    # TODO: check format
    # requires at least one keyword
    if not is_at_least_one_keyword():
        # return bad request error
        return make_response("Searching requires at least one keyword", 400)

    keywords_to_search = create_parameters_list('included_keywords', 'excluded_keywords', 'keyword')
    websites_to_search = create_parameters_list('Sites', 'excluded_Sites', 'website')
    # assumption: time range would be just two dates separated by comma
    time_range = parse_json_and_strip('date_range')
    # no dates were passed
    if time_range == []:
        # either default range or just not searching by range at all
        datetime_range = [datetime(year=datetime.now().year - 1, month=1, day=1), datetime.now()]
    else:
        try:
            datetime_range = [datetime.strptime(date_string, "%Y-%m-%d") for date_string in time_range]
        except ValueError:
            return make_response("The date format is incorrect, please make sure the format is year-month-day", 400)
    negative_words = create_parameters_list('negative_words', '', 'keyword', conditions='intonation=FALSE')
    positive_words = create_parameters_list('positive_words', '', 'keyword', conditions='intonation=TRUE')

    links_to_scrap = []
    # TODO: search for queries and stuff here

    # TODO: scrap info and insert to the database here
    # not adding specified statistics yet, because there is only counter for now
    return make_response(positive_words, 200)


# driver function
if __name__ == '__main__':
    app.run(debug=True)
