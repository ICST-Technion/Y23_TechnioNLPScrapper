import React from 'react';
import logo from './Images/logo.jpg';
import searchIcon from './Images/magnifying-glass.png'
import './App.css';
import { TextField } from "@mui/material";
import {ButtonWithPopUp} from './Components/QueryPage/ButtonWithPopUp'
import { TimeRange } from './Components/QueryPage/TimeRange';
import { JsxEmit } from 'typescript';

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
  const [showPopUp, setShowPopUp] = React.useState<Map<number,[boolean,boolean]>>(new Map([
    [0,[false,true]],
    [1,[false,true]],
    [2,[false,true]],
    [3,[false,true]],
    [4,[false,true]],
  ]));

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
        <div className="App">
            <button className='FAQ' onClick={()=>{setPageNumber(2)}}>FAQs</button>
            <img src={logo} className="App-logo" alt="logo" />
            <div className='search-button'>
              <TextField className='search-bar'
                label={'Search Keywords Separated by Space'}
                value={keywords}
                helperText={!keywords.length ? 'At Least One Keyword is Required' : ''}
                onChange={(e) => {
                  const text = e.target.value;
                  setKeywords(text);
                } }
              />
              <img src={searchIcon} className='search-icon'/>
            </div>
            <div className='button-container'>
              <div className='button-row'>
                <ButtonWithPopUp ID={0} text='exclude keywords' showPopUp={showPopUp} setShowPopUp={setShowPopUp} updated={QueryData.excludedKeywords} setUpdated={QueryData.setExcludedKeywords} />
                <TimeRange text=' Time Range' showPopUp={showPopUp} setShowPopUp={setShowPopUp} timeRange={QueryData.timeRange} setTimeRange={QueryData.setTimeRange}/>
              </div>
              <div className='button-row'>
                <ButtonWithPopUp ID={2} text='Specify Websites' showPopUp={showPopUp} setShowPopUp={setShowPopUp} updated={QueryData.includedWebsites} setUpdated={QueryData.setIncludedWebsites}/> 
                <ButtonWithPopUp ID={3} text='Exclude Websites' showPopUp={showPopUp} setShowPopUp={setShowPopUp} updated={QueryData.excludedWebsites} setUpdated={QueryData.setExcludedWebsites}/> 
              </div>
              <div className='button-row'>
                <ButtonWithPopUp ID={4} text='specify statitcs' showPopUp={showPopUp} setShowPopUp={setShowPopUp} updated={QueryData.specificStatistic} setUpdated={QueryData.setSpecificStatistic}/>
              </div>
            </div>
            <button className='run-query-button' onClick={()=>{setPageNumber(1)}}>Run</button>
            <button className='clear-query-button' onClick={()=>{window.location.reload()}}>Clear</button>
        </div>
      </>
    );
  }
  else if(pageNumber === 1){


    return (
    <>
    <div className="App">
      <button className='go-back-button' onClick={()=>{setPageNumber(0)}}>go back</button>
        <div style={{display:'flex', flexDirection:'row', justifyContent: 'space-around',
        alignItems: 'baseline', flexWrap:'wrap', height:'70vh', width:'60vw', position:'absolute', left:'20vw', top:'15vh'}}>
          <img src={require('./Components/Results/Images/graph1.jpg')} className="graphs" alt="graphs" />
          <img src={require('./Components/Results/Images/graph2.jpg')} className="graphs" alt="graphs" />
          <img src={require('./Components/Results/Images/graph3.jpg')} className="graphs" alt="graphs" />
        </div>
      </div>
    </>
    )
  }
  else if(pageNumber === 2){
    return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
       FAQ
      <button className='go-back-button' onClick={()=>{setPageNumber(0)}}>go back</button>
    </div>)
  }
  else {
    return (<div> INCORRECT PAGE NUMBER </div>)
  }

}

export default App;
