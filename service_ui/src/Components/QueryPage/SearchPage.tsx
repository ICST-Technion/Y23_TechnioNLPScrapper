import { Divider } from '@mui/material';
import TextField from '@mui/material/TextField';
import React from 'react';
import { advancedQueryData } from '../../helpers';
import searchIcon from './Images/magnifying-glass.png'
import { SearchComponent } from './searchComponent';
import axios, {isCancel, AxiosError} from 'axios';

export interface searchPageProps {
    data: advancedQueryData[];
    keywords: string[];
    setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>
}

export const SearchPage: React.FC<searchPageProps> = ({data, keywords, setKeywords, setPageNumber}) => {

    return (
        <>
        <button className='FAQs' onClick={()=>{setPageNumber(2)}}>FAQs</button>
        <button className='run-query-button' onClick={()=>{
          setPageNumber(1);
          const query_body={"Query1": keywords[0],"Query2":keywords[1]};
                   
          }}>Run</button>
          <div className="App">
              <div className='category-field'>
                Category: <TextField
                  required
                  id="outlined-required"
                  label="Required"
                  variant="standard"
                  value={data[0].category_ID}
                  onChange={(e) => {
                    const text = e.target.value;
                    data[0].setCategory_ID(text)}}
                />
              </div>
              <SearchComponent keywords={keywords} setKeywords={setKeywords} idx={0} />
              <br/>
              <br/>
              <Divider style={{width:'70vw', marginLeft:'15vw'}}/>
              <br/>
              <div className='category-field'>
                Category: <TextField
                  required
                  id="outlined-required"
                  label="Required"
                  variant="standard"
                  value={data[1].category_ID}
                  onChange={(e) => {
                    const text = e.target.value;
                    data[1].setCategory_ID(text)}}
                />
              </div>
              <SearchComponent keywords={keywords} setKeywords={setKeywords} idx={1} />
              <br/>
              <button className='advanced-search-button' onClick={()=>{setPageNumber(3)}}>Advanced Search Options</button>
          </div>
        </>
      );
}