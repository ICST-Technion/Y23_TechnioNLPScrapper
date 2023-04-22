import axios from "axios";
import { FE_SERVER } from "./consts";
import Cookies from "universal-cookie";
export const cookie = new Cookies();

export const basicAxiosInstance = axios.create({
  //added the cors-anywhere thing as we dont have "Options" set, and we get error. fix later.
  baseURL:
    FE_SERVER,
  headers: {
    Authorization: `Bearer ${cookie.get("token")}`
  },
});
 
 
 
 /*
  * This function is used to generate a random number between two numbers (inclusive)
  */
  export function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }


  /*
  * This function is used to create a new state object for the advanced query for easier updates and shorter code.
  * create a new query by using the createNewQuery function immediately after the useQueryConstructor function.
  * @param advancedQuery: The current query object
  * @param setAdvancedQuery: The function to set the query object
  * @param idx: The category ID
  * @returns: an object with the first item being the query object itself and after it all the functions to update the query object
  */
  export const useQueryConstructor = (advancedQuery: any, setAdvancedQuery: React.Dispatch<any>, idx: number) => {

    /*
    * This function create the initial query object
    */
    const createNewQuery = () => setAdvancedQuery(
        {
             category_ID: idx,
             includedWebsites: new Map<number, string>(),
             excludedWebsites: new Map<number, string>(),
             excludedKeywords: new Map<number, string>(),
             specificStatistic: new Map<number, string>(),
             positiveKeywords: new Map<number, string>(),
             negativeKeywords: new Map<number, string>(),
             timeRange:undefined
        }
    );

    /*
    * This function is used to update the query object
    * @param includedWebsites: The new included websites
    */
     const setIncludedWebsites = (includedWebsites:Map<number, string>) =>
     setAdvancedQuery((oldData:any) => {oldData.includedWebsites = includedWebsites; return {...oldData}});

     /*
    * This function is used to update the query object
    * @param excludedWebsites: The new excluded websites
    */
     const setExcludedWebsites = (excludedWebsites:Map<number, string>) =>
     setAdvancedQuery((oldData:any) => {oldData.excludedWebsites = excludedWebsites; return {...oldData}});

     /*
    * This function is used to update the query object
    * @param excludedKeywords: The new excluded keywords
    */
     const setExcludedKeywords = (excludedKeywords:Map<number, string>) =>
     setAdvancedQuery((oldData:any) => {oldData.excludedKeywords = excludedKeywords; return {...oldData}});

     /*
    * This function is used to update the query object
    * @param specificStatistic: The new specific statistic
    */
     const setSpecificStatistic = (specificStatistic:Map<number, string>) =>
     setAdvancedQuery((oldData:any) => {oldData.specificStatistic = specificStatistic; return {...oldData}});

     /*
    * This function is used to update the query object
    * @param positiveKeywords: The new positive keywords
    */
     const setPositiveKeywords = (positiveKeywords:Map<number, string>) =>
     setAdvancedQuery((oldData:any) => {oldData.positiveKeywords = positiveKeywords; return {...oldData}});

     /*
    * This function is used to update the query object
    * @param negativeKeywords: The new negative keywords
    */
     const setNegativeKeywords = (negativeKeywords:Map<number, string>) =>
     setAdvancedQuery((oldData:any) => {oldData.negativeKeywords = negativeKeywords; return {...oldData}});

     /*
    * This function is used to update the query object
    * @param timeRange: The new time range
    */
     const setTimeRange = (timeRange:[Date,Date] | undefined) =>
     setAdvancedQuery((oldData:any) => {oldData.timeRange = timeRange; return {...oldData}});

     /*
    * This function is used to clear the query object
    */
     const clear = () => { createNewQuery()};

     /* 
      * Return the query and all the functions to update the query object
    */
     return{
        advancedQuery,
        createNewQuery,
        setIncludedWebsites,
        setExcludedWebsites,
        setExcludedKeywords,
        setSpecificStatistic,
        setPositiveKeywords,
        setNegativeKeywords,
        setTimeRange,
        clear
     }

}


  /*
* This function is used to convert a map to an array
* @param map: The map to convert
* @returns: The array
* @example: mapToArray(new Map([[1,"a"],[2,"b"]])) => ["a","b"]
*/
  export const mapToArray = (map:Map<number, string>) => {
  return Array.from(map.values());
  }

  /*
  * This function is used to copy any object to another - shallow copy
  */
  export const copy = (obj: any) => {
  return Object.assign({}, obj);
}


export function parseString(str: string) {
  const words = [];
  let currentPhrase = '';

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '"') {
      // If we encounter a quote, we keep adding characters to the
      // currentPhrase string until we encounter the next quote.
      i++;
      while (str[i] !== '"' && i < str.length) {
        currentPhrase += str[i];
        i++;
      }

      // Add the phrase to the list of words and reset the currentPhrase
      // string for the next phrase.
      if (currentPhrase !== '') {
        words.push(currentPhrase);
        currentPhrase = '';
      }
    } else if (str[i] !== ' ') {
      // If the character is not a space, we keep adding characters to
      // the current word until we encounter a space or the end of the string.
      let currentWord = str[i];
      i++;
      while (str[i] !== ' ' && i < str.length) {
        currentWord += str[i];
        i++;
      }

      // Add the word to the list of words.
      words.push(currentWord);
    }
  }

  return words;
}

