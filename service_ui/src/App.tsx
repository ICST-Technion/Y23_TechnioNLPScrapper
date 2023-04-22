import React, { useEffect } from "react";
import "./App.css";
import { Background } from "./Components/Background";
import { Logo } from "./Components/Logo";
import { SignedInMainPage } from "./Components/Client_Pages/signedin";
import { SignIn } from "./SignIn";
import { cookie } from "./Helpers/helpers";

function App() {
  const [signedIn, setSignedIn] = React.useState(false);

  /*
   * This function returns the correct page to be displayed, based on the pageNumber state
   */
  const getPage = () => {
    if (signedIn) {
      return (
        <>
          <button className="sign-out" onClick={() => { cookie.remove("token"); setSignedIn(false)}}>Sign Out</button>
          <SignedInMainPage signOut={() => setSignedIn(true)} />
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
