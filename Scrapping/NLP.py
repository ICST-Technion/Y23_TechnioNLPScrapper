from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_watson.natural_language_understanding_v1 import Features, SentimentOptions
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator



def extract_sentiment(text):
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
    if text=='':
        return 'neutral'
    assert(text!='')
    minimum_length=100
    if len(text) < minimum_length:
        text = text + ' ' * (minimum_length - len(text))
    response = natural_language_understanding.analyze(text=text,
                                                          features=Features(sentiment=SentimentOptions())
                                                          ).get_result()
    sentiment = response['sentiment']['document']
    label = sentiment['label']
    print(label)
    return label


