import React from 'react';
import { ENGLISH, HEBREW } from '../Helpers/consts';
import { getLanguage, setLanguage } from '../Helpers/helpers';

export interface BGProps {
    setChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Background: React.FC<BGProps> = ({setChanged}) => {

    const language = getLanguage();
    return (
        <>
        <div className='header'>
            <button className='language-button' onClick={()=>{setLanguage(
                language == ENGLISH? HEBREW : ENGLISH); setChanged((old: boolean) => !old) 
                }}>
                 {language == ENGLISH? "hebrew" : "english"}
             </button>
        </div>
         <div className='background'></div>
        </>

    )
}