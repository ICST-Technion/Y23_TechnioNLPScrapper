import React from 'react';
import { advancedQueryData } from '../../App';


export interface baseResultsProps {
    advancedQueryData:advancedQueryData;
    includedKeywords:string[];
}

export const BaseResults: React.FC<baseResultsProps> = (props) => {

    return (
        <>
            <p> searching for keywords {props.includedKeywords.join(", ")} </p>
        </>

    )
}