import os
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_watson.natural_language_understanding_v1 import Features, SentimentOptions, KeywordsOptions
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

def initialize_natural_language_understanding():
    """
    Initialize the IBM Watson Natural Language Understanding (NLU) service.
    see https://cloud.ibm.com/apidocs/natural-language-understanding?code=python#features-examples
    for examples
    Set up the authentication using the provided API key and URL.
    The amount of available services is based on the payment plan and the language used.
    Return an instance of the NaturalLanguageUnderstandingV1 class.
    """

    api_key = os.environ['NLP_API_KEY']
    url = 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/7ce07ab7-0f4a-4105-9823-0cb663b472fb'

    authenticator = IAMAuthenticator(api_key)
    natural_language_understanding = NaturalLanguageUnderstandingV1(
    version='2021-03-25',
    authenticator=authenticator
)
    # Set the service URL
    natural_language_understanding.set_service_url(url)
    return natural_language_understanding

def find_keyword_in_text(text,keywords_limit_num=5):
    """
    Analyze the given text using IBM Watson Natural Language Understanding.
    Extract keywords with sentiment and emotion analysis.
    Return a list of keywords with their sentiment and emotion information.

    :param text: Text to be analyzed
    :param keywords_limit_num: Maximum number of keywords to be returned
    :return: List of keywords, each element a dictionary with sentiment and emotion information
    see the NLP Test file for examples
    """
    features=Features(keywords=KeywordsOptions(sentiment=True,emotion=True,limit=keywords_limit_num))
    natural_language_understanding=initialize_natural_language_understanding()
    response = natural_language_understanding.analyze(text=text, features=features).get_result()
    keywords = response['keywords']
    return keywords
    




def extract_sentiment(text):
    """
    Analyze the sentiment of the overall text using IBM Watson Natural Language Understanding.
    Return the sentiment label and score.
    :param text: Text to be analyzed
    :return: Sentiment label (the intonation) and score as a tuple
    """
    natural_language_understanding=initialize_natural_language_understanding()
    # # the IBM expects a certain length of text and throws exception otherwise,
    # # we are going to pad the text with a neutral word if the text is too short
    response = natural_language_understanding.analyze(text=text,
                                                          features=Features(sentiment=SentimentOptions())
                                                          ).get_result()
    sentiment = response['sentiment']['document']
    label = sentiment['label']
    score = sentiment['score']
    return label,score


