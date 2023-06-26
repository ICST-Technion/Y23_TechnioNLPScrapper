import React from 'react';
import logo from '../Images/joined_icon.png'
import { LogoProps } from './Logo';


export const JoinedLogo: React.FC<LogoProps> = ({cssClasses}) => {

    return (
        <div className='centered top-margin'>
         <img src={logo} className={cssClasses + " App-logo"} alt="logo" />
        </div>

    )
}