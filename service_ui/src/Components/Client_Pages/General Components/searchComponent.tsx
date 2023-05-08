import { TextField } from "@mui/material";
import React from "react";
import { SEARCH_BAR_INFO, SEARCH_BAR_VALIDATION } from "../../../Helpers/texts";
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
  return (
    <>
      <div className="search-button">
        <div id="searchbar">
          <TextField
            className="search-bar"
            label={SEARCH_BAR_INFO[0]}
            value={keywords[idx]}
            helperText={
              !keywords[idx]?.length ? SEARCH_BAR_VALIDATION[0] : ""
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
