import React, { useEffect } from "react";
import "./App.css";
import { Background } from "./Components/Background";
import { Logo } from "./Components/Logo";
import { SignedInMainPage } from "./Components/Client_Pages/signedin";
import { SignIn } from "./SignIn";
import { cookie } from "./Helpers/helpers";
import { SignUp } from "./SignUp";

function App() {

  const emptyUser = {username: "", role: ""};
  const [signedIn, setSignedIn] = React.useState(emptyUser);
  const [register, setRegister] = React.useState(false);

  /*
   * This function returns the correct page to be displayed, based on the pageNumber state
   */
  const getPage = () => {
    if (signedIn.username !== "") {
      return (
        <>
          <button className="sign-out" onClick={() => { cookie.remove("token"); setSignedIn(emptyUser); setRegister(false);}}>Sign Out</button>
          <button className="register" onClick={() => { setRegister(true)}} hidden={signedIn.role !== "admin" || register}> register new user</button>
          {register? <><Logo /><SignUp setRegistered={setRegister}/></>
          :<SignedInMainPage username={signedIn.username} role={signedIn.role}/>
          }
        </>
      );
    } else {
      return (
        <>
          <Logo cssClasses="logo" />
          <SignIn setSignedIn={setSignedIn}/>
        </>
      );
    }
  };

  return (
    <>
      <Background />
      {getPage()}
    </>
  );
}

export default App;
