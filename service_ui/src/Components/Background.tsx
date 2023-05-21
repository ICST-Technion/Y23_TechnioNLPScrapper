import React from 'react';
import { ENGLISH, HEBREW } from '../Helpers/consts';
import { getLanguage, setLanguage } from '../Helpers/helpers';


export interface BGProps {

}

export const Background: React.FC<BGProps> = () => {


    return (
        <>
         <div className='background'></div>
        </>

    )
}