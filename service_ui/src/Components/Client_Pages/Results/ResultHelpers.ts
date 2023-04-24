import { randomIntFromInterval } from "../../../Helpers/helpers";

export const NEGATIVE = 0;
export const NEUTRAL = 1;
export const POSITIVE = 2;


export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// chart.js options
export const optionsStacked = {
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Bar Chart - Stacked',
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
      text: 'Chart.js Bar Chart',
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

  // removes duplicates
  export function onlyUnique(value: any, index: any, self: string | any[]) {
    return self.indexOf(value) === index;
  }

    /*
     * This function returns the datasets set up for use in the chart, split on website and keywords
     */
   export const websiteDatasets = (merged:any[]) => {

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
        console.log(innerData);
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




const intonations:string[]=['neutral','positive','negative'];

type IntonationMap = Map<string, Map<string, number>>;

function createIntonationMap(): IntonationMap {
  const map = new Map<string, Map<string, number>>();
  intonations.forEach((intonation:string) => {
     map.set(intonation, new Map<string, number>());
  });
  return map;
}

export const createTimeIntonationSet = (dataset:any[], timeFrame:string) => {
  let innerData = new Array(3);
  for (let i = 0; i < 3; i++) {
    innerData[i] = new Array();
  }

  const dataMap = groupByTimeAndIntonation(dataset, timeFrame);

  dataMap.forEach((value, key) => {
    const intonation = key;
    const timePeriods = value;
    timePeriods.forEach((value, key) => {
      const timePeriod = key;
      const count = value;
      if (intonation === "negative") {
        innerData[NEGATIVE].push({x:timePeriod, y:count});
      } else if (intonation === "neutral") {
        innerData[NEUTRAL].push({x:timePeriod, y:count});
      } else if (intonation === "positive") {
        innerData[POSITIVE].push({x:timePeriod, y:count});
      } else {
        console.log(
          "not any of the normal intonations, my intonation is:" + intonation
        );
      }
    });
  });

  let intonations = ["negative", "neutral", "positive"];
  let colors = ["(255,0,0,0.5)", "(0,0,255,0.5)", "(0,255,0,0.5)"];
  let sets = innerData.map((dataset, idx) => {
    return {
      id: idx,
      label: intonations[idx],
      data: dataset,
      backgroundColor: `rgba` + colors[idx],
    };
  });

  return sets;
};


const groupByTimeAndIntonation = (data: any[], timeFrame:string): IntonationMap => {
  const matrix: IntonationMap = createIntonationMap();

  data.forEach((item) => {
    let timePeriod = "";
    if(timeFrame==='day')
      timePeriod = item.date.substr(0, 10);
    if(timeFrame==='week')
      timePeriod = getWeekStart(item.date);
    else if(timeFrame==='month')
      timePeriod = getMonthStart(item.date);
    else if(timeFrame==='year')
      timePeriod = getYearStart(item.date);
    const count = item.count;
    matrix.get(item.intonation)?.set(timePeriod, (matrix.get(item.intonation)?.get(timePeriod) || 0) + count);
  });

  return matrix;
};


// Function to get the start of the week for a given ISO date string
 const getWeekStart = (date: string): string => {
  const d = new Date(date);
  const dayOfWeek = d.getUTCDay();
  const diff = d.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const startOfWeek = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
  return startOfWeek.toISOString();
}

// Function to get the start of the month for a given ISO date string
 const getMonthStart = (date: string): string => {
  const d = new Date(date);
  const startOfMonth = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  return startOfMonth.toISOString();
}

// Function to get the start of the year for a given ISO date string
 const getYearStart = (date: string): string => {
  const d = new Date(date);
  const startOfYear = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return startOfYear.toISOString();
}