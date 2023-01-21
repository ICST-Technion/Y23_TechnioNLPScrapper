import { Divider } from '@mui/material';
import React from 'react';
import { advancedQueryData } from '../../helpers';
import { AdvancedSearchComponent } from './advancedSearchComponent';
import { ButtonWithPopUp } from './ButtonWithPopUp';
import { TimeRange } from './TimeRange';


export interface advancedSearchprops {
    data: advancedQueryData[];
    keywords: string[];
    setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

export const AdvancedSearch: React.FC<advancedSearchprops> = ({data, keywords, setKeywords, setPageNumber}) => {

    const clearKeywords = (idx:number) => {
        console.log(keywords);
        setKeywords((old) => idx === 0? ['',...old.slice(1)] : [...old.slice(0,1),'']);
    }
    const getAdvancedSearchJson=(idx:Number)=>{
        //Numbers can't be used as indices
        const advanced_body={ 
            [`included_keywords${idx}`]:keywords[idx.valueOf()],
            [`excluded_keywords${idx}`]:data[idx.valueOf()].excludedKeywords,
            [`included_sites${idx}`]:data[idx.valueOf()].includedWebsites,
            [`excluded_sites${idx}`]:data[idx.valueOf()].excludedWebsites,
            [`date_range${idx}`]:data[idx.valueOf()].timeRange,
            [`positive_words${idx}`]:data[idx.valueOf()].positiveKeywords,
            [`negative_words${idx}`]:data[idx.valueOf()].negativeKeywords
                };
        return advanced_body;
    }
    return (
        <>
            <div className='App'>
                <div className="flex-column">
                    <AdvancedSearchComponent data={data} keywords={keywords[0]} setKeywords={clearKeywords} idx={0}/>
                    <Divider style={{width:'70vw', marginLeft:'15vw'}}/>
                    <AdvancedSearchComponent data={data} keywords={keywords[1]} setKeywords={clearKeywords} idx={1}/>
                </div>

                <button className='go-back-button' onClick={()=>{setPageNumber(0)}}>go back</button>
                <button className='run-query-button' onClick={()=>{setPageNumber(1);
                const merged = {...getAdvancedSearchJson(0), ...getAdvancedSearchJson(1)};
                
                }}>Run</button>

              </div>
        </>

    )
}