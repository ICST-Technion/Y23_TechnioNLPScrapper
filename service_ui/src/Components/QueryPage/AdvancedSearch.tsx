import { Divider } from '@mui/material';
import React from 'react';
import { advancedQueryData } from '../../helpers';
import { AdvancedSearchComponent } from './Components/advancedSearchComponent';
import { ButtonWithPopUp } from './Components/ButtonWithPopUp';
import { TimeRange } from './Components/TimeRange';
import axios, {isCancel, AxiosError, AxiosResponse} from 'axios';
import { reactToString } from 'rsuite/esm/utils';

export interface advancedSearchprops {
    keywords: string[];
    setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
    setAxiosPromise: React.Dispatch<Promise<AxiosResponse<any, any>>>
    excludedKeywords: Map<number, string>;
    includedWebsites: Map<number, string>;
    excludedWebsites: Map<number, string>;
    timeRange: [Date, Date] | undefined;
    positiveKeywords: Map<number, string>;
    negativeKeywords: Map<number, string>;
    specificStatistic: Map<number, string>;
    setExcludedKeywords: React.Dispatch<React.SetStateAction<Map<number, string>>>;
    setIncludedWebsites: React.Dispatch<React.SetStateAction<Map<number, string>>>;
    setExcludedWebsites: React.Dispatch<React.SetStateAction<Map<number, string>>>;
    setTimeRange: React.Dispatch<React.SetStateAction<[Date, Date] | undefined>>;
    setPositiveKeywords: React.Dispatch<React.SetStateAction<Map<number, string>>>;
    setNegativeKeywords: React.Dispatch<React.SetStateAction<Map<number, string>>>;
    setSpecificStatistic: React.Dispatch<React.SetStateAction<Map<number, string>>>;
}

export const AdvancedSearch: React.FC<advancedSearchprops> = ({keywords, setKeywords, setPageNumber, setAxiosPromise,
     includedWebsites, setIncludedWebsites, excludedKeywords, setExcludedKeywords, excludedWebsites, setExcludedWebsites,
    negativeKeywords, setNegativeKeywords, timeRange, setTimeRange, positiveKeywords, setPositiveKeywords,
    specificStatistic, setSpecificStatistic}) => {

    const clearKeywords = (idx:number) => {
        console.log(keywords);
        setKeywords((old) => idx === 0? ['',...old.slice(1)] : [...old.slice(0,1),'']);
    }
    const setKeywordsFromChild1 = (idx:number, newKeywords:string) => {
        console.log("setKeywordsFromChild",idx,newKeywords);
        setKeywords((old) => idx === 0? [newKeywords,...old.slice(1)] : [...old.slice(0,1),newKeywords]);
    }

    const setKeywordMapFromChild:React.Dispatch<React.SetStateAction<Map<number, string>>> = (newMap) => {
        console.log("on update keywordMap 1");
        setKeywordMap(newMap);
        const newKeywords = Array.from(keywordMap.values()).join(',');
        setKeywordsFromChild1(0, newKeywords);
    }

    const [keywordMap, setKeywordMap] = React.useState<Map<number,string>>(new Map());

    const handleClear = () => {
        setExcludedKeywords(new Map());
        setIncludedWebsites(new Map());
        setExcludedWebsites(new Map());
        setSpecificStatistic(new Map());
        setTimeRange(undefined);
        setPositiveKeywords(new Map());  
        setNegativeKeywords(new Map());
        clearKeywords(0);
        setKeywordMap(new Map());
    }

    React.useEffect(()=>{
        const keywordArray= keywords[0]?.split(',');
        keywordArray?.forEach((keyword: string, index: number) => {
            if(keyword){
                setKeywordMap(keywordMap.set(index,keyword));
            }
        })
    }
    ,[])
    

    // React.useEffect(() => { console.log(excludedKeywords); }, [excludedKeywords]);
    // React.useEffect(() => { console.log(includedWebsites); }, [includedWebsites]);
    // React.useEffect(() => { console.log(excludedWebsites); }, [excludedWebsites]);
    // React.useEffect(() => { console.log(timeRange); }, [timeRange]);
    // React.useEffect(() => { console.log(positiveKeywords); }, [positiveKeywords]);
    // React.useEffect(() => { console.log(negativeKeywords); }, [negativeKeywords]);
    // React.useEffect(() => { console.log(specificStatistic); }, [specificStatistic]);
    // React.useEffect(() => { console.log(keywords[0].split(',')); }, [keywords]);

    const getAdvancedSearchJson=(idx:Number)=>{
        const id_title=idx.valueOf()+1
        //Numbers can't be used as indices
        console.log(keywords[0].split(','));
        const advanced_body={ 
            [`included_keywords${id_title}`]:keywords[0].split(','),
            [`excluded_keywords${id_title}`]:Array.from(excludedKeywords.values()),
            [`included_sites${id_title}`]:Array.from(includedWebsites),
            [`excluded_sites${id_title}`]:Array.from(excludedWebsites),
            [`date_range${id_title}`]:timeRange,
            [`positive_words${id_title}`]:Array.from(positiveKeywords),
            [`negative_words${id_title}`]:Array.from(negativeKeywords)
                };
        return advanced_body;
    }
    return (
        <>
            <div className='App'>
                <div className="flex-column">
                       <div className='button-container'>
                            <div className='button-row'>
                            <ButtonWithPopUp ID={5} text='included keywords' updated={keywordMap} setUpdated={setKeywordMapFromChild} />
                            <ButtonWithPopUp ID={0} text='exclude keywords' updated={excludedKeywords} setUpdated={setExcludedKeywords} />
                            </div>
                            <div className='button-row'>
                            <ButtonWithPopUp ID={6} text='Positive Keywords' updated={positiveKeywords} setUpdated={setPositiveKeywords}/> 
                            <ButtonWithPopUp ID={7} text='Negative Keywords' updated={negativeKeywords} setUpdated={setNegativeKeywords}/> 
                            </div>
                            <div className='button-row'>
                            <ButtonWithPopUp ID={2} text='Specify Websites' updated={includedWebsites} setUpdated={setIncludedWebsites}/> 
                            <ButtonWithPopUp ID={3} text='Exclude Websites' updated={excludedWebsites} setUpdated={setExcludedWebsites}/> 
                            </div>
                            <div className='button-row'>
                            <TimeRange text=' Time Range' timeRange={timeRange} setTimeRange={setTimeRange}/>
                            <ButtonWithPopUp ID={4} text='specify statitcs' updated={specificStatistic} setUpdated={setSpecificStatistic}/>
                            </div>
                            <button className='clear-query-button' onClick={()=>handleClear()}>Clear</button>
                        </div>
                </div>

                <button className='go-back-button' onClick={()=>{setPageNumber(0)}}>go back</button>
                <button className='run-query-button' onClick={async ()=>{setPageNumber(1);
                const merged = {...getAdvancedSearchJson(0)};
                const reactServer='http://localhost:5000'
                try
                {
                    setAxiosPromise(axios.post(reactServer+'/advancedSearch',merged));
                }
                catch (err) {
                    console.log(err);
                }

                }}>Run</button>

              </div>
        </>

    )
}