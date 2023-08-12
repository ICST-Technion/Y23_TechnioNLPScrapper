import sys
from datetime import datetime
#for handling requests and responses
from flask import Flask, jsonify, request, make_response
# this line is for the search engine
from googleapiclient.discovery import build
# for hebrew and arabic words
from urllib.parse import quote, unquote
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# this line allows python to find our module.
sys.path.append('.\\SQL')
from SQL.SqlQueries import *
import re

def parse_google_search_query(query):
    """
    Parses a Google search query and returns a dictionary with the
    different search components separated into lists.
    
    Supported search components:
        - Keywords
        - Phrases (enclosed in quotes)
        - Excluded words (preceded by '-')
        - Positive words (preceded by '++')
        - Negative words (preceded by '--')
        - Sites (preceded by 'site:')
        - Date range (specified as 'after:' or 'before:')
    
    Args:
        query (str): The Google search query to parse.
    
    Returns:
        dict: A dictionary with the different search components separated
        into lists.
    """


    phrases = []
    positive_keywords = []
    negative_keywords = []
    excluded_keywords = []
    site = None
    datarange = None
    if not query:
        return {
        'phrases': phrases,
        'positive_keywords': positive_keywords,
        'negative_keywords': negative_keywords,
        'excluded_keywords': excluded_keywords,
        'site': site,
        'datarange': datarange,
        'keywords': keywords,
    }
    # find all phrases in the query and add them to the phrases list
  
    phrases = re.findall(r'"([^"]+)"', query)
    
    # remove phrases from query
    query = re.sub(r'"[^"]+"', '', query)


    # find site and datarange components in the query
    site = re.findall(r'site:\S+', query)
    datarange = re.findall(r'daterange:\S+', query)
    
    # remove site and datarange components from query

    query = re.sub(r'site:\S+', '', query)
    query = re.sub(r'daterange:\S+', '', query)
    
    # find all positive keywords in the query and add them to the positive_keywords list
    positive_keywords = re.findall(r'\+\+\w+', query)
    
    # remove positive keywords from query
    query = re.sub(r'\+\+\w+', '', query)
    
    # find all negative keywords in the query and add them to the negative_keywords list
    negative_keywords = re.findall(r'--\w+', query)
    
    # remove negative keywords from query
    query = re.sub(r'--\w+', '', query)
    
    # find all excluded keywords in the query and add them to the excluded_keywords list
    excluded_keywords = re.findall(r'-\w+', query)
    
    # remove excluded keywords from query
    query = re.sub(r'-\w+', '', query)
    

    
    # remove any remaining whitespace from query
    query = query.strip()
    
    # add any remaining words in query to keywords list
    keywords = re.findall(r'\w+', query)
    

    #remove ++,--, and - when adding to the lists
    positive_keywords = [s[2:] for s in positive_keywords]
    negative_keywords = [s[2:] for s in negative_keywords]
    excluded_keywords = [s[1:] for s in excluded_keywords]
    # return dictionary of extracted information
    return {
        'phrases': phrases,
        'positive_keywords': positive_keywords,
        'negative_keywords': negative_keywords,
        'excluded_keywords': excluded_keywords,
        'site': site[0].replace('site:', '') if site else None,
        'datarange': datarange[0].replace('daterange:', '') if datarange else None,
        'keywords': keywords,
    }
# creating a Flask app
app = Flask(__name__)


@app.route('/sentiment', methods=['POST'])
def get_sentiment_rows():
    """
    Retrieves sentiment rows from the database based on the provided table_id.
    Returns:
    A JSON response containing the sentiment rows.
    """
    query = SQLQuery()
    #which table do we clear:
    table_id=request.json.get('table_id', "")
    rows=""
    if table_id!="":
        rows=query.select_articles_from_sql(id=table_id,table_name="ArticleSentiment")    
    return jsonify(rows)


@app.route('/delete/<string:tbid>', methods=['DELETE'])
def delete_table(tbid):
    """
    Deletes a specific table from the database based on the provided table_id.
    Args:
    tbid (str): The ID of the table to be deleted.
    Returns:
    A response indicating the success of the deletion.
    """
    clear_query = SQLQuery()
    #which table do we clear:
    table_id = tbid
    if table_id!="":
        clear_query.delete_specific_table(table_name=table_id)
    return make_response("table deleted", 200)

@app.route('/clear', methods=['POST'])
def clear_table():
    """
    Clears all created tables generated after the query is complete
    Returns:
    A response indicating the success of the table clearing.
    """
    clear_query = SQLQuery()
    #which table do we clear:
    table_id=request.json.get('table_id', "")
    if table_id!="":
        clear_query.delete_table(table_id=table_id)
    return make_response("table cleared", 200)

def get_default_websites():
    """
    Retrieves a list of default websites to search.
    Returns:
    A list of default websites.
    """
    websites_to_search= ["www.ynet.co.il","www.israelhayom.co.il"] 
    return  websites_to_search


def create_keyword_sentiment_rows(keywords_to_intonation_in_query,article):
    """
    Creates keyword sentiment rows based on the provided keywords and article.
    Args:
    keywords_to_intonation_in_query (list): List of tuples containing keywords and their intonation.
    article (Article): The article object.
    Returns:
    A list of keyword sentiment rows.
    """
    website=article.get_website()
    postive_rows_in_query= [(keyword,intonation,1.0,website) for (keyword,intonation) in keywords_to_intonation_in_query if intonation=='positive']
    negative_rows_in_query= [(keyword,intonation,-1.0,website) for (keyword,intonation) in keywords_to_intonation_in_query if intonation=='negative']
    #Watson doesn't find these as keywords
    neutral_rows_in_query= [(keyword,intonation,0.0,website) for (keyword,intonation) in keywords_to_intonation_in_query if intonation=='neutral']
    #keywords we have according to Watson 
    rows_from_watson=[(keyword['text'],keyword['sentiment']['label'],keyword['sentiment']['score'],website) for keyword in article.find_keywords_in_article()]
    return postive_rows_in_query+negative_rows_in_query+neutral_rows_in_query+rows_from_watson

def is_date_in_range(date_str, start_str, end_str):
    """
    Check if the date represented by date_str is between start_str and end_str.
    
    :param date_str: Date string in the format "YYYYMMDD"
    :param start_str: Start date string in the format "YYYYMMDD"
    :param end_str: End date string in the format "YYYYMMDD"
    :return: Boolean, True if date is in the range, False otherwise
    """
    date_format = "%Y%m%d"
    
    date = datetime.strptime(date_str, date_format)
    start = datetime.strptime(start_str, date_format)
    end = datetime.strptime(end_str, date_format)
    
    return start <= date <= end

def scrap_links(links_to_scrap,keywords_intonation_list,phrase_intonation_list,table_id,datetime_range=None,category='1'):
    '''
    Scrapes information about each keyword and website from the provided links and inserts them into the database.
    Parameters:
    - links_to_scrap (dict): Dictionary containing the links to scrape.
    - keywords_intonation_list (list): List of tuples containing keywords and their intonation.
    - phrase_intonation_list (list): List of tuples containing phrases and their intonation.
    - table_id (str): The ID of the table in the database.
    - category (str): The current query category.
    Notes:
    - Some websites are forbidden to scrape, and we can't access them.
    '''
    if 'items' in links_to_scrap.keys():
        for item in links_to_scrap['items']:
            try:
                article_info=Article(item['link'])
                if datetime_range is not None and isinstance(datetime_range, list):
                    article_date = article_info.date
                    formatted_date = format_date(article_date)
                    if datetime_range.length >=2:
                        if not is_date_in_range(formatted_date, datetime_range[0], datetime_range[1]):
                            continue
                    else:
                        if not is_date_in_range(formatted_date, datetime_range[0], datetime_range[0]):
                            continue
                keywords_intonation_list=[(keyword,intonation) if intonation!='neutral' else (keyword,article_info.sentiment)  for (keyword,intonation) in keywords_intonation_list]
                phrase_intonation_list=[(keyword,intonation) if intonation!='neutral' else (keyword,article_info.sentiment)  for (keyword,intonation) in phrase_intonation_list]
                
                rows_to_add=article_info.create_rows_to_database(keywords_intonation_list,
                phrase_intonation_list,
                category)
                sentiment_row_to_add=article_info.create_sentiment_score_rows()
                keyword_sentiment_rows_to_add=create_keyword_sentiment_rows(keywords_intonation_list,article_info)
                insert_query=SQLQuery()
                insert_query.insert_article_to_sql(rows_to_add,table_id)
                insert_query.insert_article_intonation_analysis_sql(sentiment_row_to_add,table_id)
                #TODO: change to insert and update
                insert_query.insert_and_update_keyword_intonation_analysis_sql(keyword_sentiment_rows_to_add,table_id)
            except HTTPError:
                print('forbidden website')
                #skip websites that we can't scrap because access is forbidden
                continue

def do_search_query(category='1'):
    '''
    Performs a Google search query (only keywords, no additional parameters).
    Scrapes from the links we found and updates the database.
    Parameters:
    - category (str): The number of the current category we are scraping for.
    '''
    query = request.json.get('Query'+category, "")  # assuming Query is the keywords
    table_id = str(request.json.get('id', ""))

    # Parse the query
    query_dict = parse_google_search_query(query)
    keywords = query_dict["keywords"]
    phrases = query_dict["phrases"]
    positive_keywords = query_dict["positive_keywords"]
    negative_keywords = query_dict["negative_keywords"]
    excluded_keywords = query_dict["excluded_keywords"]
    site = query_dict["site"]
    datarange = query_dict["datarange"]
    
    # Get the list of websites to search
    site_list = get_default_websites()
    if site is not None:
        site_list.append(site)
    keyword_to_intonation,phrase_to_intonation = map_keywords_to_intonation(
            keywords_list=keywords,
            phrases=phrases,
            positive_keywords=positive_keywords,
            negative_keywords=negative_keywords
        )
    # Perform the search and scrape the links for each website
    SQLQuery().generate_table(str(table_id))
    for website in site_list:
        # Retrieve the first 2 pages (20 results) for more results increase the end of the range.
        for page in range(1, 21, 10):
            search_results = search_google(query, website, page=page)
            scrap_links(search_results, keyword_to_intonation,phrase_to_intonation,table_id,category)
    return table_id    



@app.route('/query', methods=['POST'])
def get_database_query():
    '''
    search and scrap only by keywords
    the default search by search bar
    return an OK response for success
    '''
    table_id=do_search_query('1')
    return make_response(str(table_id), 200)  


def search_google(query, site_list, exclude_query='', datetime=None, page = 1):
    '''
    Searches Google using the provided query and site list.

    Parameters:
    - query (str): The search query.
    - site_list (list): The list of websites to search.
    - exclude_query (str): The query to exclude.
    - datetime (list): date range
    - page (int): the index of the next result

    Returns:
    - result (dict): The search result from Google.
    '''
    service = build("customsearch", "v1", developerKey=os.environ['GOOGLE_API_KEY'])
    if datetime is not None:
        date_restrict = f'date:r:{datetime[0]}:{datetime[1]}'
        result = service.cse().list(q=query, cx='0655ca3f748ac4757', siteSearch=site_list, excludeTerms=exclude_query, fileType='-pdf', sort= date_restrict, start=page).execute()
    else:
        result = service.cse().list(q=query, cx='0655ca3f748ac4757', siteSearch=site_list, excludeTerms=exclude_query, fileType='-pdf', start=page).execute()
    return result


def parse_json_and_strip(json_field):
    '''
    Searches for an element with the name json_field.
    If it exists, returns a list of the content of that field.
    If not, returns an empty list.

    Parameters:
    - json_field (str): The name of the JSON field to search.

    Returns:
    - field_content (list): The content of the JSON field.
    '''
    field_content = request.json.get(json_field, [])
    if field_content == []:
        return []
    return field_content


def parse_table_rows(rows):
    '''
    Converts a list of rows returned by a select query to a list of values.
    when returning a select query, it returns as a list of tuple [(row1),(row2),...]
    Parameters:
    - rows (list): The rows returned by a select query.

    Returns:
    - result (list): The list of values extracted from the rows.
    '''
    return [row[0] for row in rows]


def is_at_least_one_keyword(category='1'):
    '''
    Checks if at least one keyword is provided in the request.

    Parameters:
    - category (str): The category number.

    Returns:
    - result (bool): True if at least one keyword is provided, False otherwise.
    '''
    included_keywords = parse_json_and_strip('included_keywords'+category)
    return included_keywords != []

def map_keywords_to_intonation(keywords_list,phrases,positive_keywords,negative_keywords):
    '''
    Maps keywords and phrases to their intonation (if available).

    Parameters:
    - keywords_list (list): The list of keywords.
    - phrases (list): The list of phrases.
    - positive_keywords (list): The list of positive keywords.
    - negative_keywords (list): The list of negative keywords.

    Returns:
    - keyword_to_intonation (list): List of tuples containing keywords and their intonation.
    - phrase_to_intonation (list): List of tuples containing phrases and their intonation.
    '''
    known_keyword_to_intonation = {t[0]: t[1] for t in SQLQuery().select_learned_keywords()}
    # known_keyword_to_intonation = SQLQuery().select_learned_keywords()
    if known_keyword_to_intonation is None:
        known_keyword_to_intonation={}
    phrases_no_quotes = [phrase.strip('"\'') for phrase in phrases]

    # Process keywords
    keyword_to_intonation = [
        (keyword, known_keyword_to_intonation[keyword] if keyword in known_keyword_to_intonation.keys() else 
         'positive' if keyword in positive_keywords else 
         'negative' if keyword in negative_keywords else 
         'neutral')
        for keyword in keywords_list
    ]

    # Process phrases
    phrase_to_intonation = [
        (phrase, known_keyword_to_intonation[phrase] if phrase in known_keyword_to_intonation else 
         'positive' if phrase in positive_keywords else 
         'negative' if phrase in negative_keywords else 
         'neutral')
        for phrase in phrases_no_quotes
    ]
    #TODO:replace with NLP once we have it
    filtered_learned_words = [(s1, s2) for s1, s2 in keyword_to_intonation+phrase_to_intonation if s2 != "neutral"]
    SQLQuery().insert_keyword_intonation_to_sql(filtered_learned_words)
    return keyword_to_intonation, phrase_to_intonation

def format_date(date_string):
    '''
    Converts a date string in the format "YYYY-MM-DDTHH:MM:SS.sssZ" to a simpler format "YYYYMMDD".
    
    :param date_string: A string representation of a date in the format "YYYY-MM-DDTHH:MM:SS.sssZ"
    :return: A string representation of the date in the format "YYYYMMDD"
    '''
    if isinstance(date_string, str):
        date_obj = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S.%fZ")
    else:
        date_obj = date_string
    formatted_date = date_obj.strftime("%Y%m%d")
    return formatted_date


def advanced_search_query(category='1'):
    '''
    Performs scraping based on all the advanced search parameters.
    The only mandatory parameter is keywords.

    Parameters:
    - category (str): The category number. Default is '1'.

    Returns:
    - table_id (str): The ID of the generated table.
    '''
    if not is_at_least_one_keyword():
        # return bad request error
        return make_response("Searching requires at least one keyword", 400)
    #returns string
    keywords_to_search=request.json.get('included_keywords' + category, [])
    table_id = str(request.json.get('id', ''))

    websites_to_search = list(set(request.json.get('included_sites' + category,[])) | 
                              set(get_default_websites()))
    
    # assumption: time range would be just two dates separated by comma
    time_range =request.json.get('date_range' + category, [])
    # no dates were passed
    if not time_range:
        # either default range or just not searching by range at all
        notformated = [datetime(year=datetime.now().year - 1, month=1, day=1), datetime.now()]
        datetime_range = [dt.strftime('%Y%m%d') for dt in notformated]
    else:
        try:
            datetime_range = [format_date(date_string) for date_string in time_range]
        except ValueError:
            return make_response("The date format is incorrect, please make sure the format is year-month-day", 400)
    
  
    negative_words=request.json.get('negative_words' + category, [])
        

    positive_words=request.json.get('positive_words' + category, [])


    keywords_to_exclude =parse_json_and_strip('excluded_keywords'+category)

    words_to_insert=[(word,'negative') for word in negative_words]
    words_to_insert.extend([(word,'positive') for word in positive_words])
    SQLQuery().insert_keyword_intonation_to_sql(words_to_insert)

    #TODO: add phrases list here
    keyword_to_intonation,phrases_to_intonation=map_keywords_to_intonation(keywords_to_search,[],
                                                                           positive_words,negative_words)

   

    # URL-encode the search keywords
    _, decoded_keywords = url_encode_keywords(keywords_to_search)
    query = ','.join(decoded_keywords)

    # URL-encode the exclude keywords
    _, decoded_exclude = url_encode_keywords(keywords_to_exclude)
    exclude_query = ','.join(decoded_exclude)
    

    SQLQuery().generate_table(str(table_id))
    for website in websites_to_search:
        # Retrieve the first 2 pages (20 results) for more results increase the end of the range.
        for page in range(1, 21, 10):
            links_to_scrap = search_google(query, website, exclude_query, datetime_range, page)
            scrap_links(links_to_scrap,keyword_to_intonation,phrases_to_intonation,table_id,datetime_range,category)
    # TODO: specify dates in the google search
    return table_id

def url_encode_keywords(keywords):
    """
    URL-encodes a list of keywords using UTF-8 encoding and returns the encoded and decoded values.

    Args:
        keywords (list): A list of keywords to encode.

    Returns:
        A tuple containing two lists: the first list contains the URL-encoded and UTF-8 encoded keywords,
        and the second list contains the decoded keywords.
    """
    encoded_keywords = [quote(keyword.encode('utf-8')) for keyword in keywords]
    decoded_keywords = [unquote(keyword) for keyword in encoded_keywords]
    return encoded_keywords, decoded_keywords

@app.route('/advancedSearch', methods=['POST'])
def advanced_search():
    '''
    API response to advanced search.
    Searching with tags such as included/excluded keywords, websites, date range, and so on.
    Adds the information by category to the database for display in the frontend later.
    Returns a bad request if there are no keywords in the search query.
    Otherwise, returns OK.
    '''
    
    table_id=advanced_search_query('1')
    return make_response(str(table_id), 200)


# run the server
if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=10000)
