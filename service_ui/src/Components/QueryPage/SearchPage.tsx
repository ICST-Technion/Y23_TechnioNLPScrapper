import { Divider } from '@mui/material';
import TextField from '@mui/material/TextField';
import React from 'react';
import { advancedQueryData } from '../../helpers';
import searchIcon from './Images/magnifying-glass.png'
import { SearchComponent } from './Components/searchComponent';
import axios, {isCancel, AxiosError, AxiosResponse} from 'axios';

export interface searchPageProps {
    data: advancedQueryData[];
    keywords: string[];
    setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
    setAxiosPromise: React.Dispatch<Promise<AxiosResponse<any, any>>>;
}

export const SearchPage: React.FC<searchPageProps> = ({data, keywords, setKeywords, setPageNumber, setAxiosPromise}) => {

    return (
        <>
        <button className='FAQs' onClick={()=>{setPageNumber(2); console.log("XXDDSS")}}>FAQs</button>
        <button className='run-query-button' onClick={async ()=>{
          setPageNumber(1);
          const query_body={"Query1": keywords[0]};
          const reactServer='http://localhost:5000'
                try
                {
                    setAxiosPromise(axios.post(reactServer+'/query',query_body));              
                }
                catch (err) {
                    console.log(err);
                }                   
          }}>Run</button>
          <div className="App">
              <SearchComponent keywords={keywords} setKeywords={setKeywords} idx={0} />
              <button className='advanced-search-button' onClick={()=>{setPageNumber(3)}}>Advanced Search Options</button>
          </div>
        </>
      );
}