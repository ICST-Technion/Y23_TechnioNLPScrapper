from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_watson.natural_language_understanding_v1 import Features, SentimentOptions
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

def initialize_natural_language_understanding():
        # Provide your IBM Watson NLU service API key and URL
    api_key = '14yrJFPYDHSKNq69o0O4t7EBr-TEScrM5PKBBdRxESev'
    url = 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/7ce07ab7-0f4a-4105-9823-0cb663b472fb'

# Create an authenticator and NLU client
    authenticator = IAMAuthenticator(api_key)
    natural_language_understanding = NaturalLanguageUnderstandingV1(
    version='2021-03-25',
    authenticator=authenticator
)
    # Set the service URL
    natural_language_understanding.set_service_url(url)
    return natural_language_understanding

def find_keyword_in_text(text,keywords_limit_num=5):
    features = {
    'keywords': {
        'limit': keywords_limit_num  # Set the desired number of keywords to extract
    }
}
    natural_language_understanding=initialize_natural_language_understanding()
# Call the NLU service to extract keywords
    response = natural_language_understanding.analyze(text=text, features=features).get_result()

# Extract and print the keywords
    keywords = response['keywords']
    return keywords
    


def extract_sentiment(text):
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


