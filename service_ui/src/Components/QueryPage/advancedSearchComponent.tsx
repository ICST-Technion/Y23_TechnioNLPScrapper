import { Typography } from '@mui/material';
import React from 'react'
import { advancedQueryData } from '../../helpers';
import { ButtonWithPopUp } from './ButtonWithPopUp';
import { TimeRange } from './TimeRange';
export interface AdvancedSearchComponentProps {
    data: advancedQueryData[];
    keywords: string;
    setKeywords: (idx: number) => void;
    idx:number;
}

export const AdvancedSearchComponent: React.FC<AdvancedSearchComponentProps> = ({data,keywords, setKeywords, idx}) => {

    const [keywordMap, setKeywordMap] = React.useState<Map<number,string>>(new Map());

    const handleClear = () => {
        const newQuery = data[idx];
            newQuery.setExcludedKeywords(new Map());
            newQuery.setIncludedWebsites(new Map());
            newQuery.setExcludedWebsites(new Map());
            newQuery.setSpecificStatistic(new Map());
            newQuery.setTimeRange(undefined);
            newQuery.setPositiveKeywords(new Map());  
            newQuery.setNegativeKeywords(new Map());
        setKeywords(idx);
        setKeywordMap(new Map());
    }

    React.useEffect(()=>{
        const keywordArray= keywords?.split(' ');
        keywordArray?.forEach((keyword, index) => {
            if(keyword)
                setKeywordMap(keywordMap.set(index,keyword));
        })
    }
    ,[])

   return(<>
   <div className='button-container'>
        <Typography variant='h3'> Advanced Search on Category: {data[idx].category_ID}</Typography>
        <div className='button-row'>
        <ButtonWithPopUp ID={5} text='included keywords' updated={keywordMap} setUpdated={setKeywordMap} />
        <ButtonWithPopUp ID={0} text='exclude keywords' updated={data[idx].excludedKeywords} setUpdated={data[idx].setExcludedKeywords} />
        </div>
        <div className='button-row'>
        <ButtonWithPopUp ID={6} text='Positive Keywords' updated={data[idx].positiveKeywords} setUpdated={data[idx].setPositiveKeywords}/> 
        <ButtonWithPopUp ID={7} text='Negative Keywords' updated={data[idx].negativeKeywords} setUpdated={data[idx].setNegativeKeywords}/> 
        </div>
        <div className='button-row'>
        <ButtonWithPopUp ID={2} text='Specify Websites' updated={data[idx].includedWebsites} setUpdated={data[idx].setIncludedWebsites}/> 
        <ButtonWithPopUp ID={3} text='Exclude Websites' updated={data[idx].excludedWebsites} setUpdated={data[idx].setExcludedWebsites}/> 
        </div>
        <div className='button-row'>
        <TimeRange text=' Time Range' timeRange={data[idx].timeRange} setTimeRange={data[idx].setTimeRange}/>
        <ButtonWithPopUp ID={4} text='specify statitcs' updated={data[idx].specificStatistic} setUpdated={data[idx].setSpecificStatistic}/>
        </div>
        <button className='clear-query-button' onClick={()=>handleClear()}>Clear</button>
    </div>

   </>);

};