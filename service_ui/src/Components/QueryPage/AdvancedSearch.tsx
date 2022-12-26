import React from 'react';
import { advancedQueryData } from '../../App';
import { ButtonWithPopUp } from './ButtonWithPopUp';
import { TimeRange } from './TimeRange';


export interface advancedSearchprops {
    data: advancedQueryData;
    keywords: string | undefined;
    setKeywords: React.Dispatch<React.SetStateAction<string | undefined>>;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

export const AdvancedSearch: React.FC<advancedSearchprops> = ({data, keywords, setKeywords, setPageNumber}) => {

    const handleClear = (clearOrigKeywords: Boolean) => {
        data.setExcludedKeywords(new Map());
        data.setIncludedWebsites(new Map());
        data.setExcludedWebsites(new Map());
        data.setSpecificStatistic(new Map());
        data.setTimeRange(undefined);
        setKeywordMap(new Map());
        if(clearOrigKeywords)
            setKeywords('');
    }

    const [keywordMap, setKeywordMap] = React.useState<Map<number,string>>(new Map());

    React.useEffect(()=>{
        const keywordArray= keywords?.split(' ');
        keywordArray?.forEach((keyword, index) => {
            setKeywordMap(keywordMap.set(index,keyword));
        })
    }
    ,[])
    return (
        <>
            <div className='App'>
                <div className='button-container'>
                    <div className='button-row'>
                    <ButtonWithPopUp ID={5} text='included keywords' updated={keywordMap} setUpdated={setKeywordMap} />
                    <ButtonWithPopUp ID={0} text='exclude keywords' updated={data.excludedKeywords} setUpdated={data.setExcludedKeywords} />
                    </div>
                    <div className='button-row'>
                    <ButtonWithPopUp ID={2} text='Specify Websites' updated={data.includedWebsites} setUpdated={data.setIncludedWebsites}/> 
                    <ButtonWithPopUp ID={3} text='Exclude Websites' updated={data.excludedWebsites} setUpdated={data.setExcludedWebsites}/> 
                    </div>
                    <div className='button-row'>
                    <TimeRange text=' Time Range' timeRange={data.timeRange} setTimeRange={data.setTimeRange}/>
                    <ButtonWithPopUp ID={4} text='specify statitcs' updated={data.specificStatistic} setUpdated={data.setSpecificStatistic}/>
                    </div>
                </div>
                <button className='go-back-button' onClick={()=>{handleClear(false); setPageNumber(0)}}>go back</button>
                <button className='run-query-button' onClick={()=>{setPageNumber(1)}}>Run</button>
                <button className='clear-query-button' onClick={()=>handleClear(true)}>Clear</button>
              </div>
        </>

    )
}