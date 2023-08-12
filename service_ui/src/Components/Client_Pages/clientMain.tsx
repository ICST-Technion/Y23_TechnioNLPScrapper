import React from "react";
import { SearchPage } from "./QueryPage/SearchPage";
import { BaseResults } from "./Results/BaseResults";
import { Logo } from "../Logo";
import { cookie, getLanguage, mapToArray, useQueryConstructor } from "../../Helpers/helpers";
import { AxiosResponse } from "axios";
import { AdvancedSearchComponent } from "./QueryPage/advancedSearchComponent";
import * as consts from "../../Helpers/consts";
import { Steps } from "intro.js-react";
import "intro.js/introjs.css";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Typography from "@mui/material/Typography";
import { ADVANCED_SEARCH_TUT, FAQS, FAQS_TUT, HELLO, HELP_TUT, LANGUAGE_TUT, RUN_TUT, SEARCH_BAR_TUT } from "../../Helpers/texts";

export interface SignedInMainPageProps {
  username: string;
  role: string;
}

export const SignedInMainPage: React.FC<SignedInMainPageProps> = ({username, role}) => {
  const [keywords, setKeywords] = React.useState<string[]>(["", ""]);
  const [axiosPromise, setAxiosPromise] =
    React.useState<Promise<AxiosResponse<any, any>> | undefined>(undefined);

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
      //only need to show it on one language button, no need for both
      element: "#language1",
      intro: LANGUAGE_TUT[language],
    },
    {
      element: "#FAQ",
      intro: FAQS_TUT[language],
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
    {
      element: "#help",
      intro: HELP_TUT[language],
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
