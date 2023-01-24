import { Divider } from '@mui/material';
import React from 'react';
import { advancedQueryData } from '../../helpers';
import { AdvancedSearchComponent } from './Components/advancedSearchComponent';
import { ButtonWithPopUp } from './Components/ButtonWithPopUp';
import { TimeRange } from './Components/TimeRange';
import axios, {isCancel, AxiosError, AxiosResponse} from 'axios';

export interface advancedSearchprops {
    data: advancedQueryData[];
    keywords: string[];
    setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
    setAxiosPromise: React.Dispatch<Promise<AxiosResponse<any, any>>>
}

export const AdvancedSearch: React.FC<advancedSearchprops> = ({data, keywords, setKeywords, setPageNumber, setAxiosPromise}) => {

    const clearKeywords = (idx:number) => {
        console.log(keywords);
        setKeywords((old) => idx === 0? ['',...old.slice(1)] : [...old.slice(0,1),'']);
    }
    const setKeywordsFromChild = (idx:number, newKeywords:string) => {
        console.log("setKeywordsFromChild",idx,newKeywords);
        setKeywords((old) => idx === 0? [newKeywords,...old.slice(1)] : [...old.slice(0,1),newKeywords]);
    }
    
    React.useEffect(() => { console.log(keywords[0].split(',')); }, [keywords]);

    const getAdvancedSearchJson=(idx:Number)=>{
        const id_title=idx.valueOf()+1
        //Numbers can't be used as indices
        const advanced_body={ 
            [`included_keywords${id_title}`]:keywords[0].split(','),
            [`excluded_keywords${id_title}`]:data[0].excludedKeywords,
            [`included_sites${id_title}`]:data[0].includedWebsites,
            [`excluded_sites${id_title}`]:data[0].excludedWebsites,
            [`date_range${id_title}`]:data[0].timeRange,
            [`positive_words${id_title}`]:data[0].positiveKeywords,
            [`negative_words${id_title}`]:data[0].negativeKeywords
                };
        return advanced_body;
    }
    return (
        <>
            <div className='App'>
                <div className="flex-column">
                    <AdvancedSearchComponent data={data} keywords={keywords[0]} clearKeywords={clearKeywords} setKeywords={setKeywordsFromChild} idx={0}/>
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