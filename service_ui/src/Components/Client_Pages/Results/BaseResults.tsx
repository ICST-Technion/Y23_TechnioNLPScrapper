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
import { basicAxiosInstance, cookie, copy, getLanguage, getLastSearchID, randomIntFromInterval } from "../../../Helpers/helpers";
import { Box, Button, Container, Modal, Typography } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";
import { MAIN_SEARCH_PAGE } from "../../../Helpers/consts";
import {
  a11yProps,
  countSumForType,
  createTimeIntonationSet,
  downloadArticleDataAsExcel,
  getDate10DaysAgo,
  getStartOf10thPreviousMonth,
  getStartOf10thPreviousWeek,
  getStartOf10thPreviousYear,
  mergeKeywords,
  onlyUnique,
  options,
  unitType,
  websiteDatasets,
  websiteIntonationDatasets,
  websiteIntonationDatasetsByCount,
} from "./ResultHelpers";
import { TabPanel } from "./TabPanel";
import "chartjs-adapter-date-fns";
import { BASIC_TABS_EXAMPLE, CLICK_TO_DOWNLOAD, COUNT, DAILY, DATA_PREPARATION_LABEL, DATA_READING_LABEL, DOWNLOAD_ARTICLE_DATA, DOWNLOAD_DESC_1, DOWNLOAD_DESC_2, DOWNLOAD_DESC_3, DOWNLOAD_FILE, GO_BACK, GRAPH_BY, INTONATION, KEYWORD_INTONATION_COUNT, INTONATION_SUMMARY_GRAPH as KEYWORD_INTONATION_GRAPH, KEYWORD_WEBSITE_GRAPH, MONTHLY, NEGATIVE, NEGATIVE_INTONATION, NEUTRAL, NEUTRAL_INTONATION, NODATA, POSITIVE, POSITIVE_INTONATION, SCORE, SESSION_EXPIRE, SHOW_THE_GRAPH_BY, TIMED_INTONATION_GRAPH, WATSON_KEYWORD_INTONATION_GRAPH, WEEKLY, YEARLY } from "../../../Helpers/texts";
import { LoadingComponent } from "../General Components/LoadingComponent";
import { TabPanelUnstyled } from "@mui/base";

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
  const [loadingMessage, setLoadingMessage] = React.useState(DATA_PREPARATION_LABEL[language]);
  const [showResult, setShowResult] = React.useState(false);


  const [data, setData] = React.useState<any[]>([]);


  // merged datasets is the datasets merged by keyword and website, wont be needed when we this in the backend
  const [merged, setMerged] = React.useState<any[]>([]);

  const [value, setValue] = React.useState(0);

  // open for the download modal popup
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // helpers needed for the time graph
  const [dataByScore, setDataByScore] = React.useState<boolean>(false);
  const [timeFrame, setTimeFrame] = React.useState<unitType>("week")
  const timeFrameLimits = new Map<unitType, string>();
  timeFrameLimits.set("day", getDate10DaysAgo());
  timeFrameLimits.set("week", getStartOf10thPreviousWeek());
  timeFrameLimits.set("month", getStartOf10thPreviousMonth());
  timeFrameLimits.set("year", getStartOf10thPreviousYear());






  const endLoading = () => {
    setLoading(false);
    setTimeout(() => {setShowResult(true)}, 2000);
  };

  // get the data from server on page load async and start loading screen
  React.useEffect(() => {
  /*
   * This function sets up the data from the server, and sets the datasets state
   */
  const startAnalysis = async () => {
    try {
      setLoading(true);
      setShowResult(false);
      let table_id;
      if(axiosPromise)
      { 
        const req = await axiosPromise!;
        table_id = req.data.table_id;
      }
      else{
        table_id = getLastSearchID();
      }

      setLoadingMessage(DATA_READING_LABEL[language]);
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
        
        //request data from DB
        const [dataReq, intonationDataReq, keywordIntonationDataset] = await Promise.all([basicAxiosInstance()({method:"get", url:"/fullResults/" + table_id}),
        basicAxiosInstance()({method:"get", url:"/sentiment/" + table_id}),await basicAxiosInstance()({method:"get", url:"/keywordSentiment/" + table_id})])
  
        
        const datas = dataReq.data.data;
        //set the data
        setData([dataReq.data.data, intonationDataReq.data.data, keywordIntonationDataset.data.data]);
        
        //if we have data, merge them by keywords
        if (datas.length > 0 ) setMerged(mergeKeywords(datas));
      
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
  if (data[0].length === 0) {
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
              data[0],
              "negative",
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
              data[0],
              "neutral",
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
              data[0],
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

    const timedDataByCount = {
      datasets: createTimeIntonationSet(data[1], timeFrame)[0],
    };

    const timedDataByScore = {
      datasets: createTimeIntonationSet(data[1], timeFrame)[1],
    };

    const [keywordLabels, keywordDatasets] =websiteIntonationDatasets(data[2], merged.map((row) => row.keyword).filter(onlyUnique));
    const dataByKeywordIntonationByScore = {
      labels: keywordLabels,
      datasets:keywordDatasets,
    }

    // TODO: remove comment when adding row count to keyword intonation
    // const [keywordLabelsByCount, keywordDatasetsByCount] =websiteIntonationDatasetsByCount(data[2]);
    // const dataByKeywordIntonationByScoreByCount = {
    //   labels: keywordLabelsByCount,
    //   datasets:keywordDatasetsByCount,
    // }

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
              <Tab label= {KEYWORD_INTONATION_GRAPH[language]} {...a11yProps(1)} />
              <Tab label= {TIMED_INTONATION_GRAPH[language]} {...a11yProps(2)} />
              <Tab label= {WATSON_KEYWORD_INTONATION_GRAPH[language]} {...a11yProps(3)} />
              <Button onClick={handleOpen}>{DOWNLOAD_ARTICLE_DATA[language]}</Button>
              <Modal 
                open={open}
                onClose={handleClose}>
                <Box className="download-modal">
                  <h2 id="parent-modal-title" style={{alignSelf:'center'}}>{DOWNLOAD_FILE[language]}</h2>
                  <p id="parent-modal-description_1">
                    {DOWNLOAD_DESC_1[language]}
                  </p>
                  <p id="parent-modal-description_2">
                    {DOWNLOAD_DESC_2[language]}
                  </p>
                  <p id="parent-modal-description_3">
                    {DOWNLOAD_DESC_3[language]}
                  </p>
                  <Button onClick={() => downloadArticleDataAsExcel(data[1])}>{CLICK_TO_DOWNLOAD[language]}</Button>
                </Box>
              </Modal>
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
                options={
                  {...options, plugins: {
                    title: {
                      display: true,
                      text: `${GRAPH_BY[language]} ${KEYWORD_INTONATION_COUNT[language]}` ,
                    },
                  },}}
                data={intonationData}
                className="fit"
              />
          </TabPanel>

          <TabPanel value={value} index={2}>
              <Button onClick={() => setDataByScore((old) => !old)}>{SHOW_THE_GRAPH_BY[language]} {dataByScore? COUNT[language] : SCORE[language]}</Button>
              <Bar
                datasetIdKey="trial"
                className="fit"
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: `${GRAPH_BY[language]} ${dataByScore? SCORE[language] : COUNT[language]}` ,
                    },
                  },
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
              <Button onClick={() => setTimeFrame("day")}>{DAILY[language]}</Button>
              <Button onClick={() => setTimeFrame("week")}>{WEEKLY[language]}</Button>
              <Button onClick={() => setTimeFrame("month")}>{MONTHLY[language]}</Button>
              <Button onClick={() => setTimeFrame("year")}>{YEARLY[language]}</Button>
            </Container>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Bar
                datasetIdKey="trial"
                options={options}
                data={dataByKeywordIntonationByScore}
                className="fit"
              />
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
