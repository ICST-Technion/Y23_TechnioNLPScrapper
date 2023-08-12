import React from "react";
import { SearchComponent } from "../General Components/searchComponent";
import axios, { AxiosResponse } from "axios";
import {
  ADVANCED_SEARCH_PAGE,
  FAQ_PAGE,
  FE_SERVER,
  RESULTS_PAGE,
} from "../../../Helpers/consts";
import { basicAxiosInstance, getLanguage, getLastSearchID, setLastSearchID } from "../../../Helpers/helpers";
import { ADVANCED_SEARCH_OPTIONS, FAQS, RUN } from "../../../Helpers/texts";

export interface searchPageProps {
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  setAxiosPromise: React.Dispatch<Promise<AxiosResponse<any, any>>>;
}

export const SearchPage: React.FC<searchPageProps> = ({
  keywords,
  setKeywords,
  setPageNumber,
  setAxiosPromise,
}) => {
  React.useEffect(() => {
    console.log(keywords);
  }, [keywords]);

  const language = getLanguage();

  return (
    <>
      <button
        id="run"
        className="run-query-button"
        disabled={keywords[0].length === 0}
        onClick={async () => {
          setPageNumber(RESULTS_PAGE);
          const generated_id = Math.floor(100000 + Math.random() * 900000);
          const query_body = { Query1: keywords[0], id: generated_id};
          try {
            setAxiosPromise(basicAxiosInstance()({method:"post", url:"/query", data:query_body}));
            //get last search id cookie
            const lastSearchID = getLastSearchID();

            if(lastSearchID)
            {
              //delete from DB all tables for last search id
              basicAxiosInstance()({method:"delete", url:`/sentiment/${lastSearchID}`});
              basicAxiosInstance()({method:"delete", url:`/fullResults/${lastSearchID}`});
              basicAxiosInstance()({method:"delete", url:`/keywordSentiment/${lastSearchID}`});
            }

            //change last search id cookie
            setLastSearchID(generated_id);

          } catch (err) {
            console.log(err);
          }
        }}
      >
        {RUN[language]}
      </button>
      <div className="App">
        <SearchComponent
          keywords={keywords}
          setKeywords={setKeywords}
          idx={0}
        />
        <button
          id="advancedSearch"
          className="advanced-search-button"
          onClick={() => {
            setPageNumber(ADVANCED_SEARCH_PAGE);
          }}
        >
          {ADVANCED_SEARCH_OPTIONS[language]}
        </button>
      </div>
    </>
  );
};
