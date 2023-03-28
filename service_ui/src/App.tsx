import React, { useEffect } from 'react';
import './App.css';
import { SearchPage } from './Components/QueryPage/SearchPage';
import { BaseResults } from './Components/Results/BaseResults';
import { FAQsPage } from './FAQsPage';
import { AdvancedSearch } from './Components/QueryPage/AdvancedSearch';
import { Background } from './Components/Background';
import { Logo } from './Components/Logo';
import { advancedQueryData, mapToArray, useQueryConstructor } from './helpers';
import { AxiosResponse } from 'axios';
import { AdvancedSearchComponent } from './Components/QueryPage/Components/advancedSearchComponent';


function App() {

  const [keywords, setKeywords] = React.useState<string[]>(['', '']);
  const [axiosPromise, setAxiosPromise] = React.useState<Promise<AxiosResponse<any, any>>>();

  const [category_ID, setCategory_ID] = React.useState<string>("1");
  const [includedWebsites, setIncludedWebsites] = React.useState<Map<number,string>>(new Map());
  const [excludedWebsites, setExcludedWebsites] = React.useState<Map<number,string>>(new Map());
  const [excludedKeywords, setExcludedKeywords] = React.useState<Map<number,string>>(new Map());
  const [specificStatistic, setSpecificStatistic] = React.useState<Map<number,string>>(new Map());
  const [positiveKeywords,setPositiveKeywords] = React.useState<Map<number,string>>(new Map());
  const [negativeKeywords,setNegativeKeywords] = React.useState<Map<number,string>>(new Map());
  const [timeRange, setTimeRange] = React.useState<[Date,Date]>();

  // this will be used instead of the long list of states above, the base query
  const [queryState, setQueryState] = React.useState<any>();
  //create the constructed query, and save the value
  const query = useQueryConstructor(queryState, setQueryState, 1);

  // during only the first load of the page, create a new query object, which will initialize the queryState
  React.useEffect(() => {
    query.createNewQuery();
  },[])

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
  const getPage = () => {
    if(pageNumber === 0){
      return (
        <>
          <Logo />
          <SearchPage keywords={keywords} setKeywords={setKeywords}
           setPageNumber={setPageNumber} setAxiosPromise={setAxiosPromise}/>
           {// add a trial button to lead to the new search page
           }
           <button onClick={() => setPageNumber(6)}>Advanced Search trial</button>
        </>
      );
    }
    else if(pageNumber === 1){
      return (
        <>
          <BaseResults includedKeywords={keywords} 
          setPageNumber={setPageNumber} axiosPromise={axiosPromise}
          positiveKeywords={Array.from(positiveKeywords.values())} negativeKeywords={Array.from(negativeKeywords.values())}/>
        </>
      )
    }
    else if(pageNumber === 2){
      return (
        <>
          <FAQsPage setPageNumber={setPageNumber} />
        </>
      )
    }
    else if(pageNumber === 3) {
      return (
        <>
          <Logo cssClasses='minimized-logo'/>
          <AdvancedSearch keywords={keywords} setKeywords={setKeywords}
            includedWebsites={includedWebsites} setIncludedWebsites={setIncludedWebsites}
            excludedWebsites={excludedWebsites} setExcludedWebsites={setExcludedWebsites}
            excludedKeywords={excludedKeywords} setExcludedKeywords={setExcludedKeywords}
            specificStatistic={specificStatistic} setSpecificStatistic={setSpecificStatistic}
            positiveKeywords={positiveKeywords} setPositiveKeywords={setPositiveKeywords}
            negativeKeywords={negativeKeywords} setNegativeKeywords={setNegativeKeywords}
            timeRange={timeRange} setTimeRange={setTimeRange}
            setPageNumber={setPageNumber} setAxiosPromise={setAxiosPromise}/>
        </>
      )
    }
    else if(pageNumber === 6) {
      //the trial page, will lead to the new page using the new component
      // can see how much shorter it is that the if statement above
      return (
        <>
          <Logo cssClasses='minimized-logo'/>
          <AdvancedSearchComponent keywords={keywords} setKeywords={setKeywords} idx={0} query={query}
          setAxiosPromise={setAxiosPromise} setPageNumber={setPageNumber}/>
        </>
      )
    }
    else if(pageNumber === 7){
      //results page for the new search page
      return (
        <>
          <BaseResults includedKeywords={keywords} 
          setPageNumber={setPageNumber} axiosPromise={axiosPromise}
          positiveKeywords={mapToArray(query.advancedQuery.positiveKeywords)} negativeKeywords={mapToArray(query.advancedQuery.negativeKeywords)}/>
        </>
      )
    }
    else {
      return (<div> INCORRECT PAGE NUMBER </div>)
    }
  }

  return(
    <>
    <Background />
    {getPage()}
    </>
  )
}

export default App;
