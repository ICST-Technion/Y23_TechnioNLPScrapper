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
    const [showPopUp, setShowPopUp] = React.useState<Map<number,[boolean,boolean]>>(new Map([
        [0,[false,true]],
        [1,[false,true]],
        [2,[false,true]],
        [3,[false,true]],
        [4,[false,true]],
      ]));

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
              </div>
              <AdvancedSearch data={data} keywords={keywords} setKeywords={setKeywords} 
            setPageNumber={setPageNumber} showPopUp={showPopUp} setShowPopUp={setShowPopUp} />
          </div>
        </>
      );
}