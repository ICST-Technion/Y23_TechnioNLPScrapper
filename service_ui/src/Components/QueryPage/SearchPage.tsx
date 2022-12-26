import TextField from '@mui/material/TextField';
import React from 'react';
import { advancedQueryData } from '../../App';
import { AdvancedSearch } from './AdvancedSearch';
import logo from './Images/logo.jpg';
import searchIcon from './Images/magnifying-glass.png'


export interface searchPageProps {
    data: advancedQueryData;
    keywords: string;
    setKeywords: React.Dispatch<React.SetStateAction<string>>;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>
}

export const SearchPage: React.FC<searchPageProps> = ({data, keywords, setKeywords, setPageNumber}) => {

    return (
        <>
          <div className="App">
              <button className='FAQ' onClick={()=>{setPageNumber(2)}}>About</button>
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
                <button className='run-query-button' onClick={()=>{setPageNumber(1)}}>Run</button>
                <button className='advanced-search-button' onClick={()=>{setPageNumber(3)}}>Advanced Search Options</button>
              </div>
          </div>
        </>
      );
}