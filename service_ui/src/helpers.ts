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

  export const useQueryConstructor = (advancedQuery: any, setAdvancedQuery: React.Dispatch<any>, idx: number) => {
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
    )

     const setIncludedWebsites = (includedWebsites:Map<number, string>) =>
     setAdvancedQuery((oldData:any) => {oldData.includedWebsites = includedWebsites; return {...oldData}});

     const setExcludedWebsites = (excludedWebsites:Map<number, string>) =>
     setAdvancedQuery((oldData:any) => {oldData.excludedWebsites = excludedWebsites; return {...oldData}});

     const setExcludedKeywords = (excludedKeywords:Map<number, string>) =>
     setAdvancedQuery((oldData:any) => {oldData.excludedKeywords = excludedKeywords; return {...oldData}});

     const setSpecificStatistic = (specificStatistic:Map<number, string>) =>
     setAdvancedQuery((oldData:any) => {oldData.specificStatistic = specificStatistic; return {...oldData}});

     const setPositiveKeywords = (positiveKeywords:Map<number, string>) =>
     setAdvancedQuery((oldData:any) => {oldData.positiveKeywords = positiveKeywords; return {...oldData}});

     const setNegativeKeywords = (negativeKeywords:Map<number, string>) =>
     setAdvancedQuery((oldData:any) => {oldData.negativeKeywords = negativeKeywords; return {...oldData}});

     const setTimeRange = (timeRange:[Date,Date] | undefined) =>
     setAdvancedQuery((oldData:any) => {oldData.timeRange = timeRange; return {...oldData}});

     const clear = () => { createNewQuery()}

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