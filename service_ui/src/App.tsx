import React from 'react';
import './App.css';
import { SearchPage } from './Components/QueryPage/SearchPage';
import { BaseResults } from './Components/Results/BaseResults';
import { About } from './About';
import { AdvancedSearch } from './Components/QueryPage/AdvancedSearch';

export class advancedQueryData{
  includedWebsites:Map<number, string>;
  setIncludedWebsites:React.Dispatch<React.SetStateAction<Map<number, string>>>;
  excludedWebsites:Map<number, string>;
  setExcludedWebsites:React.Dispatch<React.SetStateAction<Map<number, string>>>;
  excludedKeywords:Map<number, string>;
  setExcludedKeywords:React.Dispatch<React.SetStateAction<Map<number, string>>>;
  specificStatistic:Map<number, string>;
  setSpecificStatistic:React.Dispatch<React.SetStateAction<Map<number, string>>>;
  timeRange:[Date,Date] | undefined;
  setTimeRange:React.Dispatch<React.SetStateAction<[Date,Date] | undefined>>;

  constructor(stateList:[Map<number, string>, React.Dispatch<React.SetStateAction<Map<number, string>>>][], timeState:[[Date, Date] | undefined, React.Dispatch<React.SetStateAction<[Date, Date] | undefined>>]){
    [this.includedWebsites, this.setIncludedWebsites] = stateList[0];
    [this.excludedWebsites, this.setExcludedWebsites] = stateList[1];
    [this.excludedKeywords, this.setExcludedKeywords] = stateList[2];
    [this.specificStatistic, this.setSpecificStatistic] = stateList[3];
    [this.timeRange, this.setTimeRange] = timeState;
  }
}

function App() {

  const [keywords, setKeywords] = React.useState<string>("");

  const QueryData =  new advancedQueryData(
    [
      React.useState<Map<number,string>>(new Map()),
      React.useState<Map<number,string>>(new Map()),
      React.useState<Map<number,string>>(new Map()),
      React.useState<Map<number,string>>(new Map())
    ],React.useState<[Date,Date]>()
  )

  const [pageNumber, setPageNumber] = React.useState<number>(0)

  const getComponentsOfMap = (data:Map<number,string>, text:string):JSX.Element => {
    if(data.size === 0)
      return (<></>)
    
    let childrenComponents:JSX.Element[] = [];
      data.forEach((value,key)=>{
      childrenComponents.push(<li key={key} > {value}</li>);
    })
    return(
      <p>
        {text}
        <ul>
            {childrenComponents}
        </ul>
      </p>
    )
  }

  if(pageNumber === 0){
    return (
      <>
        <SearchPage data={QueryData} keywords={keywords} setKeywords={setKeywords} setPageNumber={setPageNumber} />
      </>
    );
  }
  else if(pageNumber === 1){
    return (
      <>
        <BaseResults QueryData={QueryData} includedKeywords={keywords} setPageNumber={setPageNumber} />
      </>
    )
  }
  else if(pageNumber === 2){
    return (
      <>
        <About setPageNumber={setPageNumber} />
      </>
    )
  }
  else if(pageNumber == 3) {
    return (
      <>
        <AdvancedSearch data={QueryData} keywords={keywords} setKeywords={setKeywords} setPageNumber={setPageNumber} />
      </>
    )
  }
  else {
    return (<div> INCORRECT PAGE NUMBER </div>)
  }

}

export default App;
