import React from 'react';
import logo from './Images/logo.jpg';
import searchIcon from './Images/magnifying-glass.png'
import './App.css';
import { Demo } from './Components/demo';
import { TextField } from "@mui/material";
import {ButtonWithPopUp} from './Components/ButtonWithPopUp'

function App() {

  const [keywords, setKeywords] = React.useState<string>("");
  const [showPopUp, setShowPopUp] = React.useState<number>(-1);


  return (
    <>
      <div className="App">
          <button className='FAQ'>FAQs</button>
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
          <div className='button-container'>
            <div className='button-row'>
              <ButtonWithPopUp ID={0} text='exclude keywords' showPopUp={showPopUp} setShowPopUp={setShowPopUp} />
              <ButtonWithPopUp ID={1} text=' Time Range' showPopUp={showPopUp} setShowPopUp={setShowPopUp} />
            </div>
            <div className='button-row'>
              <ButtonWithPopUp ID={2} text='Specify Websites' showPopUp={showPopUp} setShowPopUp={setShowPopUp} /> 
              <ButtonWithPopUp ID={3} text='Exclude Websites' showPopUp={showPopUp} setShowPopUp={setShowPopUp} /> 
            </div>
            <div className='button-row'>
              <ButtonWithPopUp ID={4} text='specify statitcs' showPopUp={showPopUp} setShowPopUp={setShowPopUp} />
            </div>
          </div>
          <button className='run-query-button'>Run</button>
      </div>
    </>
  );
}

export default App;
