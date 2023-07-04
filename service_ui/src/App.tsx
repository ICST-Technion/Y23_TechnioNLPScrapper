import React, { useEffect } from "react";
import "./App.css";
import { Background } from "./Components/Background";
import { Logo } from "./Components/Logo";
import { SignedInMainPage } from "./Components/Client_Pages/clientMain";
import { SignIn } from "./SignIn";
import { basicAxiosInstance, cookie, getLanguage } from "./Helpers/helpers";
import { SignUp } from "./SignUp";
import CircleLoader from "react-spinners/CircleLoader";
import { Header } from "./Components/Header";
import { FAQsPage } from "./Extra Pages/FAQsPage";
import { set } from "date-fns";

function App() {

  const [signedIn, setSignedIn] = React.useState<any>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);

  //only for reneder on cookie change
  const [changed, setChanged] = React.useState(false);

  const getUserFromCookie = async () => {
    console.log("getting user from cookie");
    if(cookie.get("token") === undefined){
      setLoading(false);
      return undefined;
    }
    try{
      let res: any = await basicAxiosInstance()({method: "GET", url: "/autologin"})
      console.log(res.data)
      setSignedIn(res.data);
      return signedIn;
    }
    catch{
      cookie.remove("token");
      setLoading(false);
      return undefined;
    }
  }

  const signOut = () => {
    cookie.remove("token");
    setSignedIn(undefined);
    setPage(0);
    setLoading(false);
  }

  const openRegister = () => {
    setPage(2);
  }

  const goHome = () => {
    setPage(0);
  }

  const openFAQ = () => {
    setPage(1);
  }

  const hideRegister = () => {
    return (signedIn && signedIn.role !== "admin");
  }

  const isLoggedIn = () => {
      return signedIn !== undefined && signedIn.username !== undefined;
  }


  useEffect(() => {
   getUserFromCookie();
  }, []);

  /*
   * This function returns the correct page to be displayed, based on the pageNumber state
   */
  const getPage = () => {
    if (page === 1) {
      return (
        <FAQsPage hideFAQ={() => setPage(0)}/>
      );
    }
    else if (isLoggedIn()) {
      return (
        <>
          {page === 2? <><Logo /><SignUp setRegistered={() => {setPage(0)}}/></>
          :<SignedInMainPage username={signedIn.username} role={signedIn.role}/>
          }
        </>
      );
    } else if(!loading) {
      return (
        <>
          <SignIn setSignedIn={setSignedIn}/>
        </>
      );
    }
    else {
      return( 
      <div className="Loading-Page">
      <CircleLoader color={"#5e17eb"} loading={true} size={180} />
     </div>
     )}
  };

  return (
    <>
          <Header setChanged={setChanged} signOut={signOut}
          openRegister={openRegister} hideRegister={hideRegister()}
          isLoggedIn={isLoggedIn()} openFAQ={openFAQ} goToMainPage={goHome}
          username={isLoggedIn()? signedIn.username : undefined}/>
      <Background />
      <div className="page-body">
       {getPage()}
      </div>
    </>
  );
}

export default App;
