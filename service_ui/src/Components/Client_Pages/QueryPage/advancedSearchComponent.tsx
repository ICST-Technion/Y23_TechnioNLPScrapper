import axios, { AxiosResponse } from "axios";
import React from "react";
import {
  FE_SERVER,
  MAIN_SEARCH_PAGE,
  RESULTS_PAGE,
} from "../../../Helpers/consts";
import { basicAxiosInstance, mapToArray, parseString } from "../../../Helpers/helpers";
import { ButtonWithPopUp } from "../General Components/ButtonWithPopUp";
import { TimeRange } from "../General Components/TimeRange";

export interface AdvancedSearchComponentProps {
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  setAxiosPromise: React.Dispatch<Promise<AxiosResponse<any, any>>>;
  idx: number;
  query: any;
}

export const AdvancedSearchComponent: React.FC<
  AdvancedSearchComponentProps
> = ({ keywords, setKeywords, idx, query, setPageNumber, setAxiosPromise }) => {
  const [keywordMap, setKeywordMap] = React.useState<Map<number, string>>(
    new Map()
  );

  //build the json body for the advanced search
  const getAdvancedSearchJson = (idx: Number) => {
    const id_title = idx.valueOf() + 1;
    //Numbers can't be used as indices
    console.log(keywords[0].split(","));
    const advanced_body = {
      [`included_keywords${id_title}`]: parseString(keywords[0]),
      [`excluded_keywords${id_title}`]: mapToArray(
        query.advancedQuery.excludedKeywords
      ),
      [`included_sites${id_title}`]: mapToArray(
        query.advancedQuery.includedWebsites
      ),
      [`excluded_sites${id_title}`]: mapToArray(
        query.advancedQuery.excludedWebsites
      ),
      [`date_range${id_title}`]: query.advancedQuery.timeRange,
      [`positive_words${id_title}`]: mapToArray(
        query.advancedQuery.positiveKeywords
      ),
      [`negative_words${id_title}`]: mapToArray(
        query.advancedQuery.negativeKeywords
      ),
    };
    return advanced_body;
  };

  const handleClear = () => {
    //call the query's clear function
    query.clear();
    //clear the keyword map
    setKeywordMap(new Map());
  };

  // update the keyword map based on the keyword string we got from main search bar
  React.useEffect(() => {
    let words = parseString(keywords[0]);
    const newMap = new Map();
    words.forEach((keyword, index) => {
      if (keyword) {
        newMap.set(index, keyword);
      }
    });
    setKeywordMap(newMap);
  }, []);

  // left over from having the option of more than one keyword list, updates a string array item based on index
  const setKeywordsFromChildByIndex = (idx: number, newKeywords: string) => {
    console.log("setKeywordsFromChild", idx, newKeywords);
    setKeywords((old) =>
      idx === 0
        ? [newKeywords, ...old.slice(1)]
        : [...old.slice(0, 1), newKeywords]
    );
  };

  //updates the keyword map, and then updates the string array item based on index, specifically index 0
  const setKeywordMapFromChild: React.Dispatch<
    React.SetStateAction<Map<number, string>>
  > = (newMap) => {
    console.log("on update keywordMap 1");
    setKeywordMap(newMap);
    let newKeywords: string[] = [];
    keywordMap.forEach((value, key) => {
      if (value.includes(" ")) {
        newKeywords.push(`"${value}"`);
      } else newKeywords.push(value);
    });
    const newString = newKeywords.join(" ");
    setKeywordsFromChildByIndex(0, newString);
  };

  //similar to the other search component, except it bases everything off of the query object
  return (
    <>
      <div className="App">
        <div className="flex-column">
          <div className="button-container">
            <div className="button-row">
              <ButtonWithPopUp
                ID={4}
                text="included keywords"
                updated={keywordMap}
                setUpdated={setKeywordMapFromChild}
              />
              <ButtonWithPopUp
                ID={0}
                text="exclude keywords"
                updated={query.advancedQuery.excludedKeywords}
                setUpdated={query.setExcludedKeywords}
              />
            </div>
            <div className="button-row">
              <ButtonWithPopUp
                ID={5}
                text="Positive Keywords"
                updated={query.advancedQuery.positiveKeywords}
                setUpdated={query.setPositiveKeywords}
              />
              <ButtonWithPopUp
                ID={6}
                text="Negative Keywords"
                updated={query.advancedQuery.negativeKeywords}
                setUpdated={query.setNegativeKeywords}
              />
            </div>
            <div className="button-row">
              <ButtonWithPopUp
                ID={2}
                text="Specify Websites"
                updated={query.advancedQuery.includedWebsites}
                setUpdated={query.setIncludedWebsites}
              />
              <ButtonWithPopUp
                ID={3}
                text="Exclude Websites"
                updated={query.advancedQuery.excludedWebsites}
                setUpdated={query.setExcludedWebsites}
              />
            </div>
            <div className="button-row">
              <TimeRange
                text=" Time Range"
                timeRange={query.advancedQuery.timeRange}
                setTimeRange={query.setTimeRange}
              />
            </div>
            <button
              className="clear-query-button"
              onClick={() => handleClear()}
            >
              Clear
            </button>
          </div>
        </div>
        <button
          className="go-back-button"
          onClick={() => {
            setPageNumber(MAIN_SEARCH_PAGE);
          }}
        >
          go back
        </button>
        <button
          className="run-query-button"
          disabled={keywords[0].length === 0}
          onClick={async () => {
            setPageNumber(RESULTS_PAGE);
            const merged = { ...getAdvancedSearchJson(0) };
            try {
              setAxiosPromise(basicAxiosInstance({method:"post", url:"/advancedSearch", data:merged}));
            } catch (err) {
              console.log(err);
            }
          }}
        >
          Run
        </button>
      </div>
    </>
  );
};
