import React from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import { Background } from "../../Background";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import CircleLoader from "react-spinners/CircleLoader";
import { copy, randomIntFromInterval } from "../../../Helpers/helpers";
import { Box, Button, Container, Typography } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
import { AxiosResponse } from "axios";
import { MAIN_SEARCH_PAGE } from "../../../Helpers/consts";
import {
  a11yProps,
  countSumForType,
  createTimeIntonationSet,
  getDate10DaysAgo,
  getStartOf10thPreviousMonth,
  getStartOf10thPreviousWeek,
  getStartOf10thPreviousYear,
  mergeKeywords,
  onlyUnique,
  options,
  unitType,
  websiteDatasets,
} from "./ResultHelpers";
import { TabPanel } from "./TabPanel";
import "chartjs-adapter-date-fns";

export interface baseResultsProps {
  includedKeywords: string[];
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  axiosPromise?: Promise<AxiosResponse<any, any>>;
  positiveKeywords?: string[];
  negativeKeywords?: string[];
}

export const BaseResults: React.FC<baseResultsProps> = ({
  includedKeywords,
  setPageNumber,
  axiosPromise,
  positiveKeywords,
  negativeKeywords,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [datasets, setDatasets] = React.useState<any[]>([]);
  const [merged, setMerged] = React.useState<any[]>([]);
  const [value, setValue] = React.useState(0);
  const [timeFrame, setTimeFrame] = React.useState<unitType>("week");
  const timeFrameLimits = new Map<unitType, string>();
  timeFrameLimits.set("day", getDate10DaysAgo());
  timeFrameLimits.set("week", getStartOf10thPreviousWeek());
  timeFrameLimits.set("month", getStartOf10thPreviousMonth());
  timeFrameLimits.set("year", getStartOf10thPreviousYear());
  /*
   * This function gets the data from the server, and sets the datasets state
   */
  const getData = async () => {
    try {
      const req = await axiosPromise!;
      let data = req.data.data;
      setDatasets(data);
      console.log(data);
      setLoading(false);
      if (data.length > 0) setMerged(mergeKeywords(data));
    } catch (err) {
      alert(err);
      setPageNumber(MAIN_SEARCH_PAGE);
    }
  };

  // get the data from server on page load async and start loading screen
  React.useEffect(() => {
    getData();
    setLoading(true);
  }, []);

  // print datasets onto the console for testing/viewing
  React.useEffect(() => {
    console.log(datasets);
  }, [datasets]);

  // register the chart.js plugins
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // use loading screen if data is not loaded yet
  if (loading) {
    return (
      <>
        <Background />
        <div className="Loading-Page">
          <CircleLoader color={"#5e17eb"} loading={loading} size={180} />
        </div>
      </>
    );
  }

  // if there is no data, return a message
  else if (datasets.length === 0) {
    return (
      <div className="App flex result">
        <button
          className="go-back-button run"
          onClick={() => {
            setPageNumber(MAIN_SEARCH_PAGE);
          }}
        >
          go back
        </button>
        <div>no data</div>
      </div>
    );
  } else {
    // ------ DATA SETUP ------ //

    //set up intonation data
    const intonationData = {
      labels: ["intonation"],
      datasets: [
        {
          id: 1,
          label: "negative intonation",
          data: [
            countSumForType(
              datasets,
              "negative",
              positiveKeywords,
              negativeKeywords
            ),
          ],
          backgroundColor: "#6a91dc",
        },
        {
          id: 2,
          label: "neutral intonation",
          data: [
            countSumForType(
              datasets,
              "neutral",
              positiveKeywords,
              negativeKeywords
            ),
          ],
          backgroundColor: "#5e17eb",
        },
        {
          id: 3,
          label: "positive intonation",
          data: [
            countSumForType(
              datasets,
              "positive",
              positiveKeywords,
              negativeKeywords
            ),
          ],
          backgroundColor: "#4aeddd",
        },
      ],
    };

    const keywordWebsiteData = {
      labels: [...merged.map((row) => row.keyword).filter(onlyUnique)],
      datasets: websiteDatasets(merged),
    };

    const timedData = {
      datasets: createTimeIntonationSet(datasets, timeFrame),
    };

    // ------ END DATA SETUP ------ //

    return (
      <>
        <Background />
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Keyword-Website Graph" {...a11yProps(0)} />
              <Tab label="Intonation Summary Graph" {...a11yProps(1)} />
              <Tab label="Timed Intonation Graph" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <div
              className="App flex result"
            >
              <button
                className="go-back-button run"
                onClick={() => {
                  setPageNumber(MAIN_SEARCH_PAGE);
                }}
              >
                go back
              </button>

          <TabPanel value={value} index={0} >

              <Bar
                datasetIdKey="trial"
                options={options}
                data={keywordWebsiteData}
                className="fit"
              />
          </TabPanel>

          <TabPanel value={value} index={1}>

              <Bar
                datasetIdKey="trial"
                options={options}
                data={intonationData}
                className="fit"
              />
          </TabPanel>

          <TabPanel value={value} index={2}>
            <Container className="timeFrames">
              <Button onClick={() => setTimeFrame("day")}>daily</Button>
              <Button onClick={() => setTimeFrame("week")}>weekly</Button>
              <Button onClick={() => setTimeFrame("month")}>monthly</Button>
              <Button onClick={() => setTimeFrame("year")}>yearly</Button>
            </Container>
              <Bar
                datasetIdKey="trial"
                className="fit"
                options={{
                  responsive: true,
                  scales: {
                    x: {
                      type: "time",
                      time: {
                        unit: timeFrame,
                      },
                      min: timeFrameLimits.get(timeFrame),
                      stacked: false,
                    },
                    y: {
                      stacked: false,
                    },
                  },
                }}
                data={timedData}
              />
            
          </TabPanel>
          </div>
        </Box>
      </>
    );
  }
};
