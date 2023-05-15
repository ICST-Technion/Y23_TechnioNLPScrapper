import React from "react";
import { DateRangePicker, Stack } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
import { RangeType } from "rsuite/esm/DateRangePicker";
import { Typography } from "@mui/material";
import { getLanguage } from "../../../Helpers/helpers";
import { ENGLISH } from "../../../Helpers/consts";

export interface timeRangeProps {
  text: string;
  timeRange: [Date, Date] | undefined;
  setTimeRange: (v: [Date, Date] | undefined) => void;
}

export const TimeRange: React.FC<timeRangeProps> = ({
  text,
  timeRange,
  setTimeRange,
}) => {
  const ID = 1;
  const { afterToday } = DateRangePicker;

  /*
   * A list of predefined ranged to use on the sides of the calendar
   */
  const predefinedRanges: RangeType[] = [
    {
      label: "Today",
      value: [new Date(), new Date()],
      placement: "left",
    },
    {
      label: "Yesterday",
      value: [addDays(new Date(), -1), addDays(new Date(), -1)],
      placement: "left",
    },
    {
      label: "This week",
      value: [startOfWeek(new Date()), new Date()],
    },
    {
      label: "Last 7 days",
      value: [subDays(new Date(), 6), new Date()],
      placement: "left",
    },
    {
      label: "Last 30 days",
      value: [subDays(new Date(), 29), new Date()],
      placement: "left",
    },
    {
      label: "Last week",
      closeOverlay: false,
      placement: "left",
      value: (value: any) => {
        const [start = new Date()] = value || [];
        return [
          addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
          addDays(endOfWeek(start, { weekStartsOn: 0 }), -7),
        ];
      },
    },
    {
      label: "This month",
      value: [startOfMonth(new Date()), new Date()],
    },
    {
      label: "Last month",
      value: [
        startOfMonth(addMonths(new Date(), -1)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },
    {
      label: "This year",
      value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    },
    {
      label: "Last year",
      value: [
        new Date(new Date().getFullYear() - 1, 0, 1),
        new Date(new Date().getFullYear(), 0, 0),
      ],
      placement: "left",
    },
    {
      label: "All time",
      value: [new Date(new Date().getFullYear() - 32, 0, 1), new Date()],
      placement: "left",
    },
  ];

  const getDateRangePicker = () => {
    return (
      <div style={{ marginLeft: "-3vw" }}>
        <DateRangePicker
          placeholder="Select Time Range"
          onChange={(range) => {
            if (range) setTimeRange([range![0], range![1]]);
          }}
          value={timeRange ? timeRange : null}
          preventOverflow
          cleanable={true}
          onClean={() => {
            setTimeRange(undefined);
          }}
          placement="autoVertical"
          disabledDate={afterToday!()}
          ranges={predefinedRanges}
        />
      </div>
    );
  };
  const language = getLanguage();
  if(language == ENGLISH){
  return (
    <div className="button-pop-component time">
      <Typography variant="body1"> {text} </Typography>
      {getDateRangePicker()}
    </div>
  );}
  else{
    return (
      <div className="button-pop-component time">
        {getDateRangePicker()}
        <Typography variant="body1"  className="heb"> {text} </Typography>
      </div>
    );

  }
};
