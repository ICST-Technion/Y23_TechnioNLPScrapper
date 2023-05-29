import { TextField } from "@mui/material";
import React from "react";
import { SEARCH_BAR_INFO, SEARCH_BAR_VALIDATION } from "../../../Helpers/texts";
import { getLanguage } from "../../../Helpers/helpers";
export interface SearchComponentProps {
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  idx: number;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({
  keywords,
  setKeywords,
  idx,
}) => {
  const language = getLanguage();
  const direction = language == 1 ? "RTL" : "LTR";
  return (
    <>
      <div className="search-button">
        <div id="searchbar">
          <TextField
            className={"search-bar " + direction}
            label={SEARCH_BAR_INFO[language]}
            value={keywords[idx]}
            helperText={
              !keywords[idx]?.length ? SEARCH_BAR_VALIDATION[language] : ""
            }
            onChange={(e) => {
              const text = e.target.value;
              setKeywords((old) =>
                idx === 0 ? [text, old[1]] : [old[0], text]
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
