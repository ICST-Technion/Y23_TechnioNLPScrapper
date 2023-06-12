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
import { ALLTIME, LASTMONTH, LASTWEEK, LASTYEAR, LAST_30_DAYS, LAST_7_DAYS, SELECTTIME, THISMONTH, THISWEEK, THISYEAR, TODAY, YESTERDAY } from "../../../Helpers/texts";

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
  const language = getLanguage();
  const ID = 1;
  const { afterToday } = DateRangePicker;

  /*
   * A list of predefined ranged to use on the sides of the calendar
   */
  const predefinedRanges: RangeType[] = [
    {
      label: TODAY[language],
      value: [new Date(), new Date()],
      placement: "left",
    },
    {
      label: YESTERDAY[language],
      value: [addDays(new Date(), -1), addDays(new Date(), -1)],
      placement: "left",
    },
    {
      label: THISWEEK[language],
      value: [startOfWeek(new Date()), new Date()],
    },
    {
      label: LAST_7_DAYS[language],
      value: [subDays(new Date(), 6), new Date()],
      placement: "left",
    },
    {
      label: LAST_30_DAYS[language],
      value: [subDays(new Date(), 29), new Date()],
      placement: "left",
    },
    {
      label: LASTWEEK[language],
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
      label: THISMONTH[language],
      value: [startOfMonth(new Date()), new Date()],
    },
    {
      label: LASTMONTH[language],
      value: [
        startOfMonth(addMonths(new Date(), -1)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },
    {
      label: THISYEAR[language],
      value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    },
    {
      label: LASTYEAR[language],
      value: [
        new Date(new Date().getFullYear() - 1, 0, 1),
        new Date(new Date().getFullYear(), 0, 0),
      ],
      placement: "left",
    },
    {
      label: ALLTIME[language],
      value: [new Date(new Date().getFullYear() - 32, 0, 1), new Date()],
      placement: "left",
    },
  ];

  const getDateRangePicker = () => {
    return (
      <div style={{ marginLeft: "-3vw" }}>
        <DateRangePicker
          placeholder={SELECTTIME[language]}
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
