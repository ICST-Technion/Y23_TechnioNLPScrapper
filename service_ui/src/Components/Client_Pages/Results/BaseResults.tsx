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
import { basicAxiosInstance, cookie, copy, getLanguage, randomIntFromInterval } from "../../../Helpers/helpers";
import { Box, Button, Container, Typography } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";
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
import { BASIC_TABS_EXAMPLE, GO_BACK, INTONATION, INTONATION_SUMMARY_GRAPH, KEYWORD_WEBSITE_GRAPH, NEGATIVE, NEGATIVE_INTONATION, NEUTRAL, NEUTRAL_INTONATION, NODATA, POSITIVE, POSITIVE_INTONATION, SESSION_EXPIRE, TIMED_INTONATION_GRAPH } from "../../../Helpers/texts";
import { LoadingComponent } from "../General Components/LoadingComponent";

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
  const language = getLanguage();
  const [loading, setLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState("Scrapping and Analyzing Data...");
  const [showResult, setShowResult] = React.useState(false);

  // this is the dataset that includes everything, split by keyword and article
  const [datasets, setDatasets] = React.useState<any[]>([]);

  //this dataset is one that focuses on article, date and its overall intonation
  const [articleIntonationDataset, setArticleIntonationDataset] = React.useState<any[]>([]);

  // merged datasets is the datasets merged by keyword and website, wont be needed when we this in the backend
  const [merged, setMerged] = React.useState<any[]>([]);

  const [value, setValue] = React.useState(0);

  // helpers needed for the time graph
  const [dataByScore, setDataByScore] = React.useState<boolean>(false);
  const [timeFrame, setTimeFrame] = React.useState<unitType>("week")
  const timeFrameLimits = new Map<unitType, string>();
  timeFrameLimits.set("day", getDate10DaysAgo());
  timeFrameLimits.set("week", getStartOf10thPreviousWeek());
  timeFrameLimits.set("month", getStartOf10thPreviousMonth());
  timeFrameLimits.set("year", getStartOf10thPreviousYear());


  /*
   * This function sets up the data from the server, and sets the datasets state
   */
  const startAnalysis = async () => {
    try {
      const req = await axiosPromise!;
      let table_id = req.data.table_id;
      return table_id;
    } catch (err: any) {
      if (err && err.response && err.response.status === 401)
      {
         alert(SESSION_EXPIRE[language]);
         cookie.remove("token");
         window.location.reload();
      }
      alert(err.response?.data? err.response.data.statusText : err)
      setPageNumber(MAIN_SEARCH_PAGE);
    }
  };

  const getData = async (table_id: string) => {
    try {
      setLoadingMessage("Loading Analysis and Graphs...");

      //request data from DB
      const [dataReq, intonationDataReq] = await Promise.all([basicAxiosInstance()({method:"get", url:"/fullResults/" + table_id}),
      basicAxiosInstance()({method:"get", url:"/sentiment/" + table_id})])

      // print them for local testing, can delete this later
      console.log(dataReq.data.data);
      console.log(intonationDataReq.data.data);

      //save the datasets
      const data = dataReq.data.data;
      const intonationData = intonationDataReq.data.data;
      setDatasets(data);
      setArticleIntonationDataset(intonationData);
      
      //if we have data, merge them by keywords
      if (data.length > 0) setMerged(mergeKeywords(data));
    
    } catch (err: any) {
      if (err && err.response && err.response.status === 401)
      {
         alert(SESSION_EXPIRE[language]);
         cookie.remove("token");
         window.location.reload();
      }

      if(err.response?.data?.includes("does not exist"))
      {
        return;
      }

      alert(err.response?.data? err.response.data : err)
      setPageNumber(MAIN_SEARCH_PAGE);
    }
  };

  const endLoading = () => {
    setLoading(false);
    setTimeout(() => {setShowResult(true)}, 2000);
  };

  // get the data from server on page load async and start loading screen
  React.useEffect(() => {
    setLoading(true);
    setShowResult(false);

    startAnalysis().then((table_id) => {
      if(table_id) 
        getData(table_id)
        .then(() => {endLoading()})
      });
  }, []);

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


  const getPage = () => {
  // if there is no data, return a message
  if (datasets.length === 0) {
    return (
      <div className="App flex result">
        <button
          className="go-back-button run"
          onClick={() => {
            setPageNumber(MAIN_SEARCH_PAGE);
          }}
        >
          {GO_BACK[language]}
        </button>
        <div>{NODATA[language]}</div>
      </div>
    );
  } else {
    // ------ DATA SETUP ------ //

    //set up intonation data
    const intonationData = {
      labels: [INTONATION[language]],
      datasets: [
        {
          id: 1,
          label: NEGATIVE_INTONATION[language],
          data: [
            countSumForType(
              datasets,
              NEGATIVE[language],
              positiveKeywords,
              negativeKeywords
            ),
          ],
          backgroundColor: "#6a91dc",
        },
        {
          id: 2,
          label: NEUTRAL_INTONATION[language],
          data: [
            countSumForType(
              datasets,
              NEUTRAL[language],
              positiveKeywords,
              negativeKeywords
            ),
          ],
          backgroundColor: "#5e17eb",
        },
        {
          id: 3,
          label: POSITIVE_INTONATION[language],
          data: [
            countSumForType(
              datasets,
              POSITIVE[language],
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

    const timedDataByCount = {
      datasets: createTimeIntonationSet(articleIntonationDataset, timeFrame)[0],
    };

    const timedDataByScore = {
      datasets: createTimeIntonationSet(articleIntonationDataset, timeFrame)[1],
    };

    // ------ END DATA SETUP ------ //

    return (
      <>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label={BASIC_TABS_EXAMPLE[language]}
            >
              <Tab label= {KEYWORD_WEBSITE_GRAPH[language]} {...a11yProps(0)} />
              <Tab label= {INTONATION_SUMMARY_GRAPH[language]} {...a11yProps(1)} />
              <Tab label= {TIMED_INTONATION_GRAPH[language]} {...a11yProps(1)} />
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
                {GO_BACK[language]}
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
              <Button  onClick={() => setDataByScore((old) => !old)}>show the graph by {dataByScore? "Count" : "Score"}</Button>
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
                data={dataByScore? timedDataByScore : timedDataByCount}
              />
              <Container className="timeFrames">
              <Button onClick={() => setTimeFrame("day")}>daily</Button>
              <Button onClick={() => setTimeFrame("week")}>weekly</Button>
              <Button onClick={() => setTimeFrame("month")}>monthly</Button>
              <Button onClick={() => setTimeFrame("year")}>yearly</Button>
            </Container>
          </TabPanel>
          </div>
        </Box>
      </>
    );
  }
}

const getLoadingOrPage = () => {
  if(!showResult)
    {
      return <LoadingComponent isAnimating={loading} message={loadingMessage}/>
    }
  else {
    return(
      <div hidden={loading}>
        {getPage()}
      </div>
    );
  }
}

return(
  <>
    {getLoadingOrPage()}
  </>

);

};
