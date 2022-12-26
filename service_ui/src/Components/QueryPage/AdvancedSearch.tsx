import React from 'react';
import { advancedQueryData } from '../../App';
import { ButtonWithPopUp } from './ButtonWithPopUp';
import { TimeRange } from './TimeRange';


export interface advancedSearchprops {
    data: advancedQueryData;
    keywords: string;
    setKeywords: React.Dispatch<React.SetStateAction<string>>;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

export const AdvancedSearch: React.FC<advancedSearchprops> = ({data, keywords, setKeywords, setPageNumber}) => {
    const [showPopUp, setShowPopUp] = React.useState<Map<number,[boolean,boolean]>>(new Map([
        [0,[false,true]],
        [1,[false,true]],
        [2,[false,true]],
        [3,[false,true]],
        [4,[false,true]],
      ]));

    return (
        <>
            <div className='App'>
                <div className='button-container'>
                    <div className='button-row'>
                    <ButtonWithPopUp ID={0} text='exclude keywords' showPopUp={showPopUp} setShowPopUp={setShowPopUp} updated={data.excludedKeywords} setUpdated={data.setExcludedKeywords} />
                    <TimeRange text=' Time Range' showPopUp={showPopUp} setShowPopUp={setShowPopUp} timeRange={data.timeRange} setTimeRange={data.setTimeRange}/>
                    </div>
                    <div className='button-row'>
                    <ButtonWithPopUp ID={2} text='Specify Websites' showPopUp={showPopUp} setShowPopUp={setShowPopUp} updated={data.includedWebsites} setUpdated={data.setIncludedWebsites}/> 
                    <ButtonWithPopUp ID={3} text='Exclude Websites' showPopUp={showPopUp} setShowPopUp={setShowPopUp} updated={data.excludedWebsites} setUpdated={data.setExcludedWebsites}/> 
                    </div>
                    <div className='button-row'>
                    <ButtonWithPopUp ID={4} text='specify statitcs' showPopUp={showPopUp} setShowPopUp={setShowPopUp} updated={data.specificStatistic} setUpdated={data.setSpecificStatistic}/>
                    </div>
                </div>
                <button className='go-back-button' onClick={()=>{setPageNumber(0)}}>go back</button>
                <button className='run-query-button' onClick={()=>{setPageNumber(1)}}>Run</button>
                <button className='clear-query-button' onClick={()=>{window.location.reload()}}>Clear</button>
              </div>
        </>

    )
}