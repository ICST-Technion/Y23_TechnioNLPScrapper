import React, { useEffect } from "react";
import "./App.css";
import { Background } from "./Components/Background";
import { Logo } from "./Components/Logo";
import { SignedInMainPage } from "./Components/Client_Pages/clientMain";
import { SignIn } from "./SignIn";
import { basicAxiosInstance, cookie, getLanguage } from "./Helpers/helpers";
import { SignUp } from "./SignUp";
import Button from "@mui/material/Button";
import { REGISTER, SINGOUT } from "./Helpers/texts";

function App() {

  const emptyUser = {username: "", role: ""};
  const [signedIn, setSignedIn] = React.useState<any>(undefined);
  const [register, setRegister] = React.useState(false);

  //only for reneder on cookie change
  const [changed, setChanged] = React.useState(false);
  const language = getLanguage();

  const getUserFromCookie = async () => {
    console.log("getting user from cookie");
    const token = cookie.get("token");
    if (token) {
      try{
        let res = await basicAxiosInstance()({method: "GET", url: "/autologin"})
        console.log(res.data)
        setSignedIn(res.data);
        return signedIn;
      }
      catch{
        cookie.remove("token");
      }
    }
    setSignedIn(emptyUser);
    console.log(signedIn);
    return signedIn;
  }

  useEffect(() => {
    setSignedIn(getUserFromCookie());
  }, []);

  /*
   * This function returns the correct page to be displayed, based on the pageNumber state
   */
  const getPage = () => {
    if (signedIn !== undefined && signedIn.username !== undefined && signedIn.username !== "") {
      return (
        <>
          <Button className="sign-out" onClick={() => { cookie.remove("token"); setSignedIn(emptyUser); setRegister(false);}}>{SINGOUT[language]}</Button>
          <Button className="register" onClick={() => { setRegister(true)}} hidden={signedIn.role !== "admin" || register}> {REGISTER[language]}</Button>
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
      <Background setChanged={setChanged}/>
      {signedIn === undefined? <></> : getPage()}
    </>
  );
}

export default App;
