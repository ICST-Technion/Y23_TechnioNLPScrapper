import React from "react";
import { SearchPage } from "./QueryPage/SearchPage";
import { BaseResults } from "./Results/BaseResults";
import { Background } from "../Background";
import { Logo } from "../Logo";
import { mapToArray, useQueryConstructor } from "../../Helpers/helpers";
import { AxiosResponse } from "axios";
import { AdvancedSearchComponent } from "./QueryPage/advancedSearchComponent";
import { FAQsPage } from "../../Extra Pages/FAQsPage";
import * as consts from "../../Helpers/consts";
import { Steps } from "intro.js-react";
import "intro.js/introjs.css";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Cookies from "universal-cookie";

export interface SignedInMainPageProps {
  signOut: () => void;
}

export const SignedInMainPage: React.FC<SignedInMainPageProps> = (signOut) => {
  const [keywords, setKeywords] = React.useState<string[]>(["", ""]);
  const [axiosPromise, setAxiosPromise] =
    React.useState<Promise<AxiosResponse<any, any>>>();

  // the base query state, which will be used to create the query object
  const [queryState, setQueryState] = React.useState<any>();
  //create the constructed query, and save the value
  const query = useQueryConstructor(queryState, setQueryState, 1);
  const cookies = new Cookies();

  // during only the first load of the page, create a new query object, which will initialize the queryState
  React.useEffect(() => {
    query.createNewQuery();
    if (!cookies.get("firstTime")) {
      setEnabled(true);
    }
  },[]);

  const [enabled, setEnabled] = React.useState(false);
  const [initialStep, setInitialStep] = React.useState(0);

  const onExit = () => {
    cookies.set("firstTime", "false", { path: "/" });
    setEnabled(false);
  };
  const steps = [
    {
      element: "#FAQ",
      intro: "You can use this button for help",
      position: "right",
    },
    {
      element: "#searchbar",
      intro:
        "You write in your query into this button \n The seachbar also supports common google search shortcuts",
    },
    {
      element: "#advancedSearch",
      intro:
        "You can use this button to get redirected to a page with advanced search options",
    },
    {
      element: "#run",
      intro: "You can use this button run the query",
    },
  ];

  const [pageNumber, setPageNumber] = React.useState<number>(0);

  /*
   * This function returns the correct page to be displayed, based on the pageNumber state
   */
  const getPage = () => {
    if (pageNumber === consts.MAIN_SEARCH_PAGE) {
      return (
        <>
          <Logo />
          <HelpOutlineIcon
            className="help-icon"
            onClick={() => {
              setEnabled(true);
            }}
          />
          <Steps
            enabled={enabled}
            steps={steps}
            initialStep={initialStep}
            onExit={onExit}
          />
          <SearchPage
            keywords={keywords}
            setKeywords={setKeywords}
            setPageNumber={setPageNumber}
            setAxiosPromise={setAxiosPromise}
          />
        </>
      );
    } else if (pageNumber === consts.RESULTS_PAGE) {
      return (
        <>
          <BaseResults
            includedKeywords={keywords}
            setPageNumber={setPageNumber}
            axiosPromise={axiosPromise}
            positiveKeywords={mapToArray(query.advancedQuery.positiveKeywords)}
            negativeKeywords={mapToArray(query.advancedQuery.negativeKeywords)}
          />
        </>
      );
    } else if (pageNumber === consts.FAQ_PAGE) {
      return (
        <>
          <Logo cssClasses="minimized-logo2" />
          <FAQsPage setPageNumber={setPageNumber} />
        </>
      );
    } else if (pageNumber === consts.ADVANCED_SEARCH_PAGE) {
      return (
        <>
          <Logo cssClasses="minimized-logo" />
          <AdvancedSearchComponent
            keywords={keywords}
            setKeywords={setKeywords}
            idx={0}
            query={query}
            setAxiosPromise={setAxiosPromise}
            setPageNumber={setPageNumber}
          />
        </>
      );
    } else {
      return <div> INCORRECT PAGE NUMBER </div>;
    }
  };

  return (
    <>
      <Background />
      {getPage()}
    </>
  );
};
