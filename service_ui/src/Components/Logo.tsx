import React from 'react';
import logo from '../Images/logo.jpg';


export interface LogoProps {}

export const Logo: React.FC<LogoProps> = () => {

    return (
        <>
         <img src={logo} className="App-logo" alt="logo" />
        </>

    )
}