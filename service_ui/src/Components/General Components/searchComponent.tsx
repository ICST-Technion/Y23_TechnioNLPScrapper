import { TextField } from '@mui/material';
import React from 'react'
export interface SearchComponentProps {
   keywords:string[];
   setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
   idx:number;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({keywords, setKeywords, idx}) => {


   return(<>
   <div className='search-button'>
        <TextField className='search-bar'
            label={'Search Keywords Separated by Space'}
            value={keywords[idx]}
            helperText={!keywords[idx]?.length ? 'At Least One Keyword is Required' : ''}
            onChange={(e) => {
            const text = e.target.value;
            setKeywords((old) => idx===0? [text,old[1]] : [old[0],text]);
            } }
        />
    </div>
   </>);

};