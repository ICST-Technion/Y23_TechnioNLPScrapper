import React from 'react';
import logo from '../Images/logo.jpg';


export interface LogoProps {
    cssClasses?:string;
}

export const Logo: React.FC<LogoProps> = ({cssClasses}) => {

    return (
        <div className='centered top-margin'>
         <img src={logo} className={cssClasses + " App-logo"} alt="logo" />
        </div>

    )
}