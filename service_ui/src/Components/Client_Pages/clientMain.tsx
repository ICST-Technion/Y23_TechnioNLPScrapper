import React from "react";
import { SearchPage } from "./QueryPage/SearchPage";
import { BaseResults } from "./Results/BaseResults";
import { Background } from "../Background";
import { Logo } from "../Logo";
import { cookie, getLanguage, mapToArray, useQueryConstructor } from "../../Helpers/helpers";
import { AxiosResponse } from "axios";
import { AdvancedSearchComponent } from "./QueryPage/advancedSearchComponent";
import { FAQsPage } from "../../Extra Pages/FAQsPage";
import * as consts from "../../Helpers/consts";
import { Steps } from "intro.js-react";
import "intro.js/introjs.css";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Cookies from "universal-cookie";
import Typography from "@mui/material/Typography";
import { ADVANCED_SEARCH_TUT, FAQS_TUT, HELLO, HELP_TUT, RUN_TUT, SEARCH_BAR_TUT } from "../../Helpers/texts";

export interface SignedInMainPageProps {
  username: string;
  role: string;
}

export const SignedInMainPage: React.FC<SignedInMainPageProps> = ({username, role}) => {
  const [keywords, setKeywords] = React.useState<string[]>(["", ""]);
  const [axiosPromise, setAxiosPromise] =
    React.useState<Promise<AxiosResponse<any, any>>>();

  // the base query state, which will be used to create the query object
  const [queryState, setQueryState] = React.useState<any>();
  //create the constructed query, and save the value
  const query = useQueryConstructor(queryState, setQueryState, 1);

  const language = getLanguage();

  // during only the first load of the page, create a new query object, which will initialize the queryState
  React.useEffect(() => {
    query.createNewQuery();
    if (!cookie.get("firstTime")) {
      setEnabled(true);
    }
  },[]);

  const [enabled, setEnabled] = React.useState(false);
  const [initialStep, setInitialStep] = React.useState(0);

  const onExit = () => {
    cookie.set("firstTime", "false", { path: "/" });
    setEnabled(false);
  };
  const steps = [
    {
      element: "#FAQ",
      intro: FAQS_TUT[language],
      position: "right",
    },
    {
      element: "#help",
      intro: HELP_TUT[language],
      position: "right",
    },
    {
      element: "#searchbar",
      intro: SEARCH_BAR_TUT[language],
    },
    {
      element: "#advancedSearch",
      intro: ADVANCED_SEARCH_TUT[language],
    },
    {
      element: "#run",
      intro: RUN_TUT[language],
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
            id="help"
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
          <Typography id="hello" variant="h5" className="centered" marginTop={-3} marginBottom={3}>
            {HELLO[language]}{username}
          </Typography>
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
      
      {getPage()}
    </>
  );
};
