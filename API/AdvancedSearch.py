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
    
    # find all phrases in the query and add them to the phrases list
    phrases = re.findall(r'"([^"]+)"', query)
    
    # remove phrases from query
    query = re.sub(r'"[^"]+"', '', query)
    
    # find all positive keywords in the query and add them to the positive_keywords list
    positive_keywords = re.findall(r'\+\+?\w+', query)
    
    # remove positive keywords from query
    query = re.sub(r'\+\+?\w+', '', query)
    
    # find all negative keywords in the query and add them to the negative_keywords list
    negative_keywords = re.findall(r'--?\w+', query)
    
    # remove negative keywords from query
    query = re.sub(r'--?\w+', '', query)
    
    # find all excluded keywords in the query and add them to the excluded_keywords list
    excluded_keywords = re.findall(r'-\w+', query)
    
    # remove excluded keywords from query
    query = re.sub(r'-\w+', '', query)
    
    # find site and datarange components in the query
    site = re.findall(r'site:\S+', query)
    datarange = re.findall(r'daterange:\S+', query)
    
    # remove site and datarange components from query
    query = re.sub(r'site:\S+', '', query)
    query = re.sub(r'daterange:\S+', '', query)
    
    # remove any remaining whitespace from query
    query = query.strip()
    
    # add any remaining words in query to keywords list
    keywords = re.findall(r'\w+', query)
    
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