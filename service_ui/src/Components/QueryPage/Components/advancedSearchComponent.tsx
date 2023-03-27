import axios, { AxiosResponse } from 'axios';
import React from 'react'
import { ButtonWithPopUp } from './ButtonWithPopUp';
import { TimeRange } from './TimeRange';
export interface AdvancedSearchComponentProps {
    keywords: string[];
    setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
    setAxiosPromise: React.Dispatch<Promise<AxiosResponse<any, any>>>
    idx:number;
    query: any;

}

export const AdvancedSearchComponent: React.FC<AdvancedSearchComponentProps> = ({keywords, setKeywords, idx, query, setPageNumber, setAxiosPromise}) => {

    const getAdvancedSearchJson=(idx:Number)=>{
        const id_title=idx.valueOf()+1
        //Numbers can't be used as indices
        console.log(keywords[0].split(','));
        const advanced_body={ 
            [`included_keywords${id_title}`]:keywords[0].split(','),
            [`excluded_keywords${id_title}`]:query.excludedKeywords,
            [`included_sites${id_title}`]:query.includedWebsites,
            [`excluded_sites${id_title}`]:query.excludedWebsites,
            [`date_range${id_title}`]:query.timeRange,
            [`positive_words${id_title}`]:query.positiveKeywords,
            [`negative_words${id_title}`]:query.negativeKeywords
                };
        return advanced_body;
    }

    const [keywordMap, setKeywordMap] = React.useState<Map<number,string>>(new Map());

    const handleClear = () => {
        query.clear();
        setKeywordMap(new Map());
    }

    React.useEffect(()=>{
        const keywordArray= keywords[0]?.split(',');
        keywordArray?.forEach((keyword, index) => {
            if(keyword){
                setKeywordMap(keywordMap.set(index,keyword));
            }
        })
    }
    ,[])

    const setKeywordsFromChildByIndex = (idx:number, newKeywords:string) => {
        console.log("setKeywordsFromChild",idx,newKeywords);
        setKeywords((old) => idx === 0? [newKeywords,...old.slice(1)] : [...old.slice(0,1),newKeywords]);
    }

    const setKeywordMapFromChild:React.Dispatch<React.SetStateAction<Map<number, string>>> = (newMap) => {
        console.log("on update keywordMap 1");
        setKeywordMap(newMap);
        const newKeywords = Array.from(keywordMap.values()).join(',');
        setKeywordsFromChildByIndex(0, newKeywords);
    }

   return(<>
   <div className='App'>
                <div className="flex-column">
   <div className='button-container'>
        <div className='button-row'>
        <ButtonWithPopUp ID={5} text='included keywords' updated={keywordMap} setUpdated={setKeywordMapFromChild} />
        <ButtonWithPopUp ID={0} text='exclude keywords' updated={query.advancedQuery.excludedKeywords} setUpdated={query.setExcludedKeywords} />
        </div>
        <div className='button-row'>
        <ButtonWithPopUp ID={6} text='Positive Keywords' updated={query.advancedQuery.positiveKeywords} setUpdated={query.setPositiveKeywords}/> 
        <ButtonWithPopUp ID={7} text='Negative Keywords' updated={query.advancedQuery.negativeKeywords} setUpdated={query.setNegativeKeywords}/> 
        </div>
        <div className='button-row'>
        <ButtonWithPopUp ID={2} text='Specify Websites' updated={query.advancedQuery.includedWebsites} setUpdated={query.setIncludedWebsites}/> 
        <ButtonWithPopUp ID={3} text='Exclude Websites' updated={query.advancedQuery.excludedWebsites} setUpdated={query.setExcludedWebsites}/> 
        </div>
        <div className='button-row'>
        <TimeRange text=' Time Range' timeRange={query.advancedQuery.timeRange} setTimeRange={query.setTimeRange}/>
        <ButtonWithPopUp ID={4} text='specify statitcs' updated={query.advancedQuery.specificStatistic} setUpdated={query.setSpecificStatistic}/>
        </div>
        <button className='clear-query-button' onClick={()=>handleClear()}>Clear</button>
    </div>
    </div>
    <button className='go-back-button' onClick={()=>{setPageNumber(0)}}>go back</button>
    <button className='run-query-button' onClick={async ()=>{setPageNumber(1);
                const merged = {...getAdvancedSearchJson(0)};
                const reactServer='https://technionlp-fe-service.onrender.com'
                try
                {
                    setAxiosPromise(axios.post(reactServer+'/advancedSearch',merged));
                }
                catch (err) {
                    console.log(err);
                }

                }}>Run</button>
    </div>
   </>);

};