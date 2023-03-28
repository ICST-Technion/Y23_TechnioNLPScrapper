export class advancedQueryData{
    category_ID:string;
    setCategory_ID:React.Dispatch<React.SetStateAction<string>>;
    includedWebsites:Map<number, string>;
    setIncludedWebsites:React.Dispatch<React.SetStateAction<Map<number, string>>>;
    excludedWebsites:Map<number, string>;
    setExcludedWebsites:React.Dispatch<React.SetStateAction<Map<number, string>>>;
    excludedKeywords:Map<number, string>;
    setExcludedKeywords:React.Dispatch<React.SetStateAction<Map<number, string>>>;
    specificStatistic:Map<number, string>;
    setSpecificStatistic:React.Dispatch<React.SetStateAction<Map<number, string>>>;
    positiveKeywords:Map<number, string>;
    setPositiveKeywords:React.Dispatch<React.SetStateAction<Map<number, string>>>; 
    negativeKeywords:Map<number, string>;
    setNegativeKeywords:React.Dispatch<React.SetStateAction<Map<number, string>>>;
    timeRange:[Date,Date] | undefined;
    setTimeRange:React.Dispatch<React.SetStateAction<[Date,Date] | undefined>>;
  
    constructor(categoryState:[string,React.Dispatch<React.SetStateAction<string>>],
            stateList:[Map<number, string>, React.Dispatch<React.SetStateAction<Map<number, string>>>][],
            timeState:[[Date, Date] | undefined, React.Dispatch<React.SetStateAction<[Date, Date] | undefined>>]){

        [this.category_ID, this.setCategory_ID] = categoryState;
        [this.includedWebsites, this.setIncludedWebsites] = stateList[0];
        [this.includedWebsites, this.setIncludedWebsites] = stateList[0];
        [this.excludedWebsites, this.setExcludedWebsites] = stateList[1];
        [this.excludedKeywords, this.setExcludedKeywords] = stateList[2];
        [this.specificStatistic, this.setSpecificStatistic] = stateList[3];
        [this.positiveKeywords,this.setPositiveKeywords] = stateList[4];
        [this.negativeKeywords,this.setNegativeKeywords] = stateList[5];
        [this.timeRange, this.setTimeRange] = timeState;
    }
  }


  export function randomIntFromInterval(min: number, max: number) { // min and max included 
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