import React, { MouseEventHandler } from "react";

export interface selectedProps {
  values: Map<number, string>;
  removeString: (index: number) => void;
  ID: number;
}

export const SelectedValues: React.FC<selectedProps> = ({
  values,
  removeString,
  ID,
}) => {
  /*
   *   This function creates the JSX elements for the selected values
   *   It uses the values map to create the JSX elements
   */
  const createValues = () => {
    let childrenComponents: JSX.Element[] = [];
    values.forEach((value, key) => {
      childrenComponents.push(
        <div className="selected-value" key={key}>
          <span>{value}</span>
          <button onClick={() => removeString(key)}>X</button>
        </div>
      );
    });
    return childrenComponents;
  };

  return (
    <div className={`selected-values-container ${ID}`}>{createValues()}</div>
  );
};
