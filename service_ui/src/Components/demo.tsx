import React from 'react';


export interface props {
    demo:string;
    num:number;
}

export const Demo: React.FC<props> = ({demo, num}) => {

    return (
        <>
            <p> demo component {demo} {num} </p>
        </>

    )
}