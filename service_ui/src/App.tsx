import React, { useEffect } from 'react';
import './App.css';
import { SearchPage } from './Components/QueryPage/SearchPage';
import { BaseResults } from './Components/Results/BaseResults';
import { FAQsPage } from './FAQsPage';
import { AdvancedSearch } from './Components/QueryPage/AdvancedSearch';
import { Background } from './Components/Background';
import { Logo } from './Components/Logo';
import { advancedQueryData } from './helpers';
import { AxiosResponse } from 'axios';


function App() {

  const [keywords, setKeywords] = React.useState<string[]>(['', '']);
  const [axiosPromise, setAxiosPromise] = React.useState<Promise<AxiosResponse<any, any>>>();

  const queryArray = [
    new advancedQueryData(
        React.useState<string>("1"),[
        React.useState<Map<number,string>>(new Map()),
        React.useState<Map<number,string>>(new Map()),
        React.useState<Map<number,string>>(new Map()),
        React.useState<Map<number,string>>(new Map()),
        React.useState<Map<number,string>>(new Map()), 
        React.useState<Map<number,string>>(new Map())
      ],React.useState<[Date,Date]>()
    ),
    new advancedQueryData(
        React.useState<string>("2"),[
        React.useState<Map<number,string>>(new Map()),
        React.useState<Map<number,string>>(new Map()),
        React.useState<Map<number,string>>(new Map()),
        React.useState<Map<number,string>>(new Map()),
        React.useState<Map<number,string>>(new Map()), 
        React.useState<Map<number,string>>(new Map())
      ],React.useState<[Date,Date]>()
    )
  ];


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
          <SearchPage data={queryArray} keywords={keywords} setKeywords={setKeywords}
           setPageNumber={setPageNumber} setAxiosPromise={setAxiosPromise}/>
        </>
      );
    }
    else if(pageNumber === 1){
      return (
        <>
          <BaseResults QueryData={queryArray} includedKeywords={keywords} 
          setPageNumber={setPageNumber} axiosPromise={axiosPromise}/>
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
    else if(pageNumber == 3) {
      return (
        <>
          <Logo cssClasses='minimized-logo'/>
          <AdvancedSearch data={queryArray} keywords={keywords} setKeywords={setKeywords}
           setPageNumber={setPageNumber} setAxiosPromise={setAxiosPromise}/>
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
