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