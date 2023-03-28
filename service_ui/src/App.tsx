import React, { useEffect } from 'react';
import './App.css';
import { SearchPage } from './Components/QueryPage/SearchPage';
import { BaseResults } from './Components/Results/BaseResults';
import { Background } from './Components/Background';
import { Logo } from './Components/Logo';
import {mapToArray, useQueryConstructor } from './helpers';
import { AxiosResponse } from 'axios';
import { AdvancedSearchComponent } from './Components/QueryPage/Components/advancedSearchComponent';
import { FAQsPage } from './FAQsPage';


function App() {

  const [keywords, setKeywords] = React.useState<string[]>(['', '']);
  const [axiosPromise, setAxiosPromise] = React.useState<Promise<AxiosResponse<any, any>>>();

  // the base query state, which will be used to create the query object
  const [queryState, setQueryState] = React.useState<any>();
  //create the constructed query, and save the value
  const query = useQueryConstructor(queryState, setQueryState, 1);

  // during only the first load of the page, create a new query object, which will initialize the queryState
  React.useEffect(() => {
    query.createNewQuery();
  },[])

  const [pageNumber, setPageNumber] = React.useState<number>(0)

  const getPage = () => {
    if(pageNumber === 0){
      return (
        <>
          <Logo />
          <SearchPage keywords={keywords} setKeywords={setKeywords}
           setPageNumber={setPageNumber} setAxiosPromise={setAxiosPromise}/>
        </>
      );
    }
    else if(pageNumber === 1){
      return (
        <>
          <BaseResults includedKeywords={keywords} 
          setPageNumber={setPageNumber} axiosPromise={axiosPromise}
          positiveKeywords={mapToArray(query.advancedQuery.positiveKeywords)} negativeKeywords={mapToArray(query.advancedQuery.negativeKeywords)}/>
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
          <AdvancedSearchComponent keywords={keywords} setKeywords={setKeywords} idx={0} query={query}
          setAxiosPromise={setAxiosPromise} setPageNumber={setPageNumber}/>
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
