import { da } from "date-fns/locale";
import { copy, randomIntFromInterval } from "../../../Helpers/helpers";

// set usefuls consts and types
export const NEGATIVE = 0;
export const NEUTRAL = 1;
export const POSITIVE = 2;

export type unitType = false | "week" | "millisecond" | "second" | "minute" | "hour" | "day" | "month" | "quarter" | "year" | undefined;

const intonations: string[] = ["neutral", "positive", "negative"];
type IntonationMap = Map<string, Map<string, [number,number]>>;


// set ally props for tabs
export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// chart.js options
export const optionsStacked = {
  plugins: {
    title: {
      display: true,
      text: "Chart.js Bar Chart - Stacked",
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export const options = {
  plugins: {
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: false,
    },
    y: {
      stacked: false,
    },
  },
};


/////////////////////////  DATA CREATION FUNCTIONS  /////////////////////////

/*
 * This function returns the data for the chart.js bar chart
 * it merges the keywords from the different articles into website based keywords
 */
export const mergeKeywords = (data1: any) => {
  let merged: any = [];
  let keywordCountMap = new Map();
  let data = [...data1];

  // get all the keywords and their website
  let keywords = data.map((row: any) => row.keyword + " " + row.website);

  // for all the keywords, get the sum of the count and add it to the merged array based on website
  keywords.forEach((item) => {
    // if keyword is in the map that means we already processed it
    if (!keywordCountMap.has(item)) {
      let keywordData = data.filter(
        (row: any) => row.keyword + " " + row.website === item
      );
      let sum = 0;
      keywordData.forEach((row: any) => (sum += row.count));
      let obj = copy(keywordData[0]);
      obj.count = sum;
      keywordCountMap.set(item, obj);
      merged.push(obj);
    }
  });

  return merged;
};

/* 
 *returns the sum of the count of the keywords based on intonation type we sent
 */
export const countSumForType = (
  datasets: any[],
  type: string,
  positiveKeywords?: string[],
  negativeKeywords?: string[]
) => {
  let sum: number = 0;
  datasets.forEach((row) => {
    type === "positive" && positiveKeywords?.includes(row.keyword)
      ? (sum += row.count)
      : type === "negative" && negativeKeywords?.includes(row.keyword)
      ? (sum += row.count)
      : row.intonation === type
      ? (sum += row.count)
      : (sum = sum);
  });
  return sum;
};
/* 
 * removes duplicates
 */
export function onlyUnique(value: any, index: any, self: string | any[]) {
  return self.indexOf(value) === index;
}

/*
 * This function returns the datasets set up for use in the chart, split on website and keywords
 */
export const websiteDatasets = (merged: any[]) => {
  // set up keyword data and filtered to only unique keywords
  const keywords = merged.map((row) => row.keyword).filter(onlyUnique);
  const websites = merged.map((row) => row.website).filter(onlyUnique);

  let innerData = new Array(websites.length);
  for (let i = 0; i < websites.length; i++) {
    innerData[i] = new Array(keywords.length);
  }

  websites.forEach((website, idx) => {
    merged.forEach((row) => {
      if (row.website === website)
        innerData[idx][keywords.indexOf(row.keyword)] = row.count;
    });
  });
  let sets = innerData.map((dataset, idx) => {
    return {
      id: idx,
      label: websites[idx],
      data: dataset,
      backgroundColor: `rgba(${randomIntFromInterval(
        0,
        255
      )},${randomIntFromInterval(0, 255)},${randomIntFromInterval(
        0,
        255
      )},0.5)`,
    };
  });

  return sets;
};


/*
* @returns a new intonation map
*/
function createIntonationMap(): IntonationMap {
  const map = new Map<string, Map<string, [number,number]>>();
  intonations.forEach((intonation: string) => {
    map.set(intonation, new Map<string, [number,number]>());
  });
  return map;
}

function createTimeAndValueBasedSet(dataMap: IntonationMap, timeFrame: unitType, valueIndex: number, isScore: boolean = false) {
  let innerData = new Array(3);
  for (let i = 0; i < 3; i++) {
    innerData[i] = new Array();
  }

  dataMap.forEach((value, key) => {
    const intonation = key;
    const timePeriods = value;
    timePeriods.forEach((value, key) => {
      const timePeriod = key;
      const yValue = isScore? value[valueIndex]/value[0]: value[valueIndex];
      if (intonation === "negative") {
        innerData[NEGATIVE].push({ x: timePeriod, y: yValue });
      } else if (intonation === "neutral") {
        innerData[NEUTRAL].push({ x: timePeriod, y: yValue });
      } else if (intonation === "positive") {
        innerData[POSITIVE].push({ x: timePeriod, y: yValue });
      } else {
        console.log(
          "not any of the normal intonations, my intonation is:" + intonation
        );
      }
    });
  });

  return innerData;

}

/*
* create a new dataset grouped by time and intonation
* @param dataset - the dataset to group
* @param timeFrame - the time frame to group by: 'day', 'week', 'month' or 'year'
* @returns a new dataset grouped by time and intonation
*/
export const createTimeIntonationSet = (dataset: any[], timeFrame: unitType) => {

  const dataMap = groupByTimeAndIntonation(dataset, timeFrame);
  console.log("------------- group by intonation ---------------");
  const dataByCount = createTimeAndValueBasedSet(dataMap, timeFrame, 0);
  const dataByScore = createTimeAndValueBasedSet(dataMap, timeFrame, 1, true);

  let intonations = ["negative", "neutral", "positive"];
  let colors = ["(255,0,0,0.5)", "(0,0,255,0.5)", "(0,255,0,0.5)"];
  let countSet = dataByCount.map((dataset, idx) => {
    return {
      id: idx,
      label: intonations[idx],
      data: dataset,
      backgroundColor: `rgba` + colors[idx],
    };
  });


  let scoreSet = dataByScore.map((dataset, idx) => {
    return {
      id: idx,
      label: intonations[idx],
      data: dataset,
      backgroundColor: `rgba` + colors[idx],
    };
  }).filter((item) => item.id !== 1);

  return [countSet, scoreSet];
};

/*
* group the data into a map by time and intonation
* @param data - the data to group
* @param timeFrame - the time frame to group by: 'day', 'week', 'month' or 'year'
* @returns a map of intonations to a map of time periods to counts
*/
const groupByTimeAndIntonation = (
  data: any[],
  timeFrame: unitType
): IntonationMap => {
  const matrix: IntonationMap = createIntonationMap();

  data.forEach((item) => {
    let timePeriod = "";
    if (timeFrame === "day") timePeriod = item.date.substr(0, 10);
    if (timeFrame === "week") timePeriod = getWeekStart(item.date);
    else if (timeFrame === "month") timePeriod = getMonthStart(item.date);
    else if (timeFrame === "year") timePeriod = getYearStart(item.date);
    //let matrixItem = matrix.get(item.overall_sentiment);
    matrix
      .get(item.overall_sentiment)
      ?.set(
        timePeriod,
        [(matrix.get(item.overall_sentiment)!.get(timePeriod)?.[0] || 0) + 1
        , (matrix.get(item.overall_sentiment)!.get(timePeriod)?.[1] || 0) + Math.abs(item.total_score)]
      );
  });

  return matrix;
};

// Function to get the start of the week for a given ISO date string
const getWeekStart = (date: string): string => {
  const datestring = new Date(date); // Convert the date string to a date object
  const dayOfWeek = datestring.getUTCDay(); // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
  const daysSinceSunday = dayOfWeek === 0 ? 0 : dayOfWeek; // Calculate number of days since Sunday
  const startOfWeek = new Date(datestring); // Copy the date object
  startOfWeek.setUTCDate(datestring.getUTCDate() - daysSinceSunday); // Set the date to the Sunday of that week
  return startOfWeek.toISOString().slice(0, 10) + " 00:00:00"; 
}

// Function to get the start of the month for a given ISO date string
const getMonthStart = (date: string): string => {
  const d = new Date(date);
  const startOfMonth = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)
  );
  return startOfMonth.toISOString().slice(0, 10) + " 00:00:00";
};

// Function to get the start of the year for a given ISO date string
const getYearStart = (date: string): string => {
  const d = new Date(date);
  const startOfYear = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return startOfYear.toISOString().slice(0, 10) + " 00:00:00";
};


export function getDate10DaysAgo(): string {
  const date = new Date();
  date.setDate(date.getDate() - 10);
  return date.toISOString().slice(0, 10) + " 00:00:00";
}

export function getStartOf10thPreviousWeek(): string {
  const currentDate = new Date();
  const daysAgo = 10 * 7;
  const startOfWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay() + 1 - daysAgo
  );
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek.toISOString().substring(0, 10);
}

export function getStartOf10thPreviousMonth(): string {
  const today = new Date();
  const tenMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 10, 1, 0, 0, 0);
  const year = tenMonthsAgo.getFullYear();
  const month = tenMonthsAgo.getMonth() + 1 < 10 ? `0${tenMonthsAgo.getMonth() + 1}` : `${tenMonthsAgo.getMonth() + 1}`;
  return `${year}-${month}-01 00:00:00`;
}

export function getStartOf10thPreviousYear(): string {
  const today = new Date();
  const tenYearsAgo = new Date(today.getFullYear() - 10, 0, 1, 0, 0, 0);
  const year = tenYearsAgo.getFullYear();
  return `${year}-01-01 00:00:00`;
}