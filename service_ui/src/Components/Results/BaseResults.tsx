import React from 'react';
import "react-image-gallery/styles/css/image-gallery.css";
import { Background } from '../Background';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import CircleLoader from "react-spinners/CircleLoader"; 
import { copy, randomIntFromInterval } from '../../Helpers/helpers';
import { Box, Typography } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import { AxiosResponse } from 'axios';
import { MAIN_SEARCH_PAGE} from '../../Helpers/consts';
import { a11yProps, options } from './ResultHelpers';
import { TabPanel } from './TabPanel';


export interface baseResultsProps {
    includedKeywords:string[];
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
    axiosPromise?:Promise<AxiosResponse<any, any>>;
    positiveKeywords?:string[];
    negativeKeywords?:string[];
}

export const BaseResults: React.FC<baseResultsProps> = ({includedKeywords, setPageNumber, axiosPromise, positiveKeywords, negativeKeywords}) => {
    const [loading, setLoading] = React.useState(false);
    const [datasets, setDatasets] = React.useState<any[]>([]);
    const [merged, setMerged] = React.useState<any[]>([]);
    const [value, setValue] = React.useState(0);


      /*
      * This function gets the data from the server, and sets the datasets state
      */
      const getData = async () => {
        try{
          const req = await(axiosPromise!);
          let data = req.data.data;
          setDatasets(data);
          console.log(data);
          setLoading(false);
          if(data.length > 0) 
            mergeKeywords(data);
        }
        catch(err){
          alert(err);
          setPageNumber(MAIN_SEARCH_PAGE);
        }
      }


    // get the data from server on page load async and start loading screen
    React.useEffect( ()=>{
      getData();
      setLoading(true)
    },[])

    // print datasets onto the console for testing/viewing
    React.useEffect(()=>{console.log(datasets)},[datasets])

    // register the chart.js plugins
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend
    );


    /*
    * This function returns the data for the chart.js bar chart
    * it merges the keywords from the different articles into website based keywords
    */
    const mergeKeywords = (data1: any) => {
      let merged:any = [];
      let keywordCountMap = new Map();
      let data = [...data1];

      // get all the keywords and their website
      let keywords = data.map((row:any) => row.keyword + " " + row.website);

      // for all the keywords, get the sum of the count and add it to the merged array based on website
      keywords.forEach((item) => {
        // if keyword is in the map that means we already processed it
        if(!keywordCountMap.has(item)){
          let keywordData = data.filter((row:any) => row.keyword + " " + row.website === item);
          let sum = 0;
          keywordData.forEach((row:any) => sum += row.count);
          let obj = copy(keywordData[0]);
          obj.count = sum;
          keywordCountMap.set(item, obj);
          merged.push(obj);
      }});

      setMerged(merged);
    }

    // removes duplicates
    function onlyUnique(value: any, index: any, self: string | any[]) {
      return self.indexOf(value) === index;
    }

    // returns the sum of the count of the keywords based on intonation type we sent
    const countSumForType = (type:string) => {
      let sum: number = 0;
      datasets.forEach((row) => {type === 'positive' && positiveKeywords?.includes(row.keyword)? sum += row.count :
       type==='negative' && negativeKeywords?.includes(row.keyword)? sum+= row.count
      :type==='neutral'? sum+= row.count
      : sum = sum});
      return sum;
    }



  
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
      
    // use loading screen if data is not loaded yet
    if(loading){
      return ( 
        <>
          <Background />
          <div className="Loading-Page">
            <CircleLoader
              color={'#5e17eb'}
              loading={loading}
              size={180}
            />
          </div>
      </>)
    }

    // if there is no data, return a message
    else if(datasets.length === 0) {
     return (  <div className='App flex result' style={{width:'70vw', marginLeft:'15vw'}}>
    <button className='go-back-button run' onClick={()=>{setPageNumber(MAIN_SEARCH_PAGE)}}>go back</button>
    <div>no data</div>
      </div>);
    }
  
    else { 
      // ------ DATA SETUP ------ //

      //set up intonation data
      const intonationData = {
        labels: ["negative intonation sum", "nuetral intonation" ,"positive intonation sum"],
        datasets: [{id:1, label:"negative intonation", data:[countSumForType("negative"),0,0],backgroundColor: '#6a91dc',}
          , {id:2, label:"nuetral intonation", data:[0,countSumForType("neutral"),0],backgroundColor: '#5e17eb',}
          ,{id:3, label:"positive intonation", data:[0,0, countSumForType("positive")],backgroundColor: '#4aeddd',},
        ]
      };

      // set up keyword data and filtered to only unique keywords
      const keywords = merged.map((row) => row.keyword).filter(onlyUnique);
      const websites = merged.map((row) => row.website).filter(onlyUnique);

      /*
      * This function returns the datasets set up for use in the chart, split on website nad keywords
      */
      const websiteDatasets =() => { 
        let innerData = new Array(websites.length);
        for (let i = 0; i < websites.length; i++) {
          innerData[i] = new Array(keywords.length);
        }

        websites.forEach((website, idx) => {
          merged.forEach((row) => {if(row.website === website) innerData[idx][keywords.indexOf(row.keyword)] = row.count});
          console.log(innerData);
        })
        let sets = innerData.map((dataset, idx) => 
        {
          return {id: idx, label: websites[idx], data:dataset,
          backgroundColor: `rgba(${randomIntFromInterval(0,255)},${randomIntFromInterval(0,255)},${randomIntFromInterval(0,255)},0.5)`,}
        })
        
        return sets;
      }

      // chart.js data set up for the keyword + website count sum graph
      const data = {
        labels: [...merged.map((row) => row.keyword).filter(onlyUnique)],
        datasets: websiteDatasets(),
      };

      // chart.js data set up for the all keyword count sum graph
      const data2 = {
        labels: [...datasets.map((row) => row.keyword)],
        datasets: [{id: 1, label:"all data", data:datasets.map((row) => row.count),backgroundColor: '#6a91dc',}]
      };
      
      // ------ END DATA SETUP ------ //
      
    return (
      <>
        <Background />
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="keyword count sum graph" {...a11yProps(0)} />
              <Tab label="intonation graph" {...a11yProps(1)} />
              <Tab label="full keyword graph" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <div className='App flex result' style={{width:'70vw', marginLeft:'15vw'}}>
              <button className='go-back-button run' onClick={()=>{setPageNumber(MAIN_SEARCH_PAGE)}}>go back</button>
              <Bar 
              datasetIdKey='trial'
              options={options}
              data={data}
              />
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <div className='App flex result' style={{width:'70vw', marginLeft:'15vw'}}>
              <button className='go-back-button run' onClick={()=>{setPageNumber(MAIN_SEARCH_PAGE)}}>go back</button>
              <Bar 
              datasetIdKey='trial'
              options={options}
              data={intonationData}
              />
            </div>
          </TabPanel>

          <TabPanel value={value} index={2}>
            <div className='App flex result' style={{width:'70vw', marginLeft:'15vw'}}>
              <button className='go-back-button run' onClick={()=>{setPageNumber(MAIN_SEARCH_PAGE)}}>go back</button>
              <Bar 
              datasetIdKey='trial'
              options={options}
              data={data2}
              />
            </div>
          </TabPanel>
        </Box>
      </>
    );
  }
}