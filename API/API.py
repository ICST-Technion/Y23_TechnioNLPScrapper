import sys
from datetime import datetime
from flask import Flask, jsonify, request, make_response
# this line is for the search engine
from googleapiclient.discovery import build
# for hebrew and arabic words
from urllib.parse import quote, unquote

# this line allows python to find our module.
sys.path.append('..\\SQL')
from SQL.SqlQueries import *

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

def get_default_websites():
    websites_to_search= ["www.ynet.co.il","www.israelhayom.co.il"] 
    return  websites_to_search

def scrap_links(links_to_scrap,keywords_intonation_list):
    if 'items' in links_to_scrap.keys():
        for item in links_to_scrap['items']:
            try:
                article_info=Article(item['link'])
                rows_to_add=article_info.create_rows_to_database(keywords_intonation_list)
                insert_query=SQLQuery()
                insert_query.insert_article_to_sql(rows_to_add)
            except HTTPError:
                make_response("This website is forbidden to scrap",403)
            finally:
                continue        

# request of regular query
@app.route('/query', methods=['POST'])
def get_database_query():
    query = request.json.get('Query', "")  # assuming Query is the keywords
    # Encode the query in UTF-8
    if query!="":
        encoded_query = quote(query)  # we need this for arabic and hebrew
        decoded_query = unquote(encoded_query)
        site_list = get_default_websites()  # TODO: connect this to the included websites Database
        for website in site_list:
            result = search_google(decoded_query, website)
            scrap_links(result,[(query,"neutral")])
    #TODO: scrap the links we get

        
    return make_response(result, 200)  


def search_google(query, site_list):
    service = build("customsearch", "v1", developerKey="AIzaSyDShZ9oDpV1o-z-KAcrQXAB-pKEexqNJHc")
    result = service.cse().list(q=query, cx='0655ca3f748ac4757', siteSearch=site_list).execute()
    return result


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
    # database_rows = query_executor.select_articles_from_sql(columns=database_field, conditions=conditions)
    # database_parameters = parse_table_rows(database_rows)
    return include_exclude_lists([], included_parameters, excluded_parameters)


def is_at_least_one_keyword():
    included_keywords = parse_json_and_strip('included_keywords')
    return included_keywords != []

def map_keywords_to_intonation(keywords_list):

    known_keyword_to_intonation=dict(SQLQuery().select_learned_keywords())

    keyword_to_intonation=[]
    for keyword in keywords_list:
        if keyword in known_keyword_to_intonation.keys():
            keyword_to_intonation.append((keyword,known_keyword_to_intonation[keyword]))
        else:
            keyword_to_intonation.append((keyword,'neutral'))
    return keyword_to_intonation
    
@app.route('/advancedSearch', methods=['POST'])
def advanced_search():
    # TODO: check format
    # requires at least one keyword
    if not is_at_least_one_keyword():
        # return bad request error
        return make_response("Searching requires at least one keyword", 400)

    keywords_to_search = create_parameters_list('included_keywords', 'excluded_keywords', 'keyword')
    websites_to_search = create_parameters_list('Sites', 'excluded_Sites', 'website')
    websites_to_search=list(set(websites_to_search) | set(get_default_websites()))
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

    #TODO: add seperate table for positive and negative keywords
    #TODO: add 2 categories
    #learn the words we got
    query_executor = SQLQuery()
    negative_words =parse_json_and_strip('negative_words')
    positive_words =parse_json_and_strip('positive_words')
    words_to_insert=[(word,'negative') for word in negative_words]
    words_to_insert.extend([(word,'positive') for word in positive_words])
    query_executor.insert_keyword_intonation_to_sql(words_to_insert)

    keyword_to_intonation=map_keywords_to_intonation(keywords_to_search)

    

    encoded_keywords = [quote(keyword) for keyword in keywords_to_search]
    decoded_keywords = [unquote(keyword) for keyword in encoded_keywords]
    query = ','.join(decoded_keywords)
    for website in websites_to_search:
        links_to_scrap = search_google(query, website)
        scrap_links(links_to_scrap,keyword_to_intonation)
    # TODO : edit the keywords_to_search and add exclude keywords

    # not adding specified statistics yet, because there is only counter for now
    return make_response("ok", 200)


# driver function
if __name__ == '__main__':
    #TODO: remove debug mode in the final version
    app.run(debug=True)
