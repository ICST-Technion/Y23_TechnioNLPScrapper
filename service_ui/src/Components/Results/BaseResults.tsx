import React from 'react';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
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
import { randomInt } from 'crypto';
import CircleLoader from "react-spinners/CircleLoader"; 
import { advancedQueryData } from '../../helpers';
import { Box, Typography } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import { AxiosResponse } from 'axios';
import { DataObject } from '../../clasees';


export interface baseResultsProps {
    QueryData:advancedQueryData[];
    includedKeywords:string[];
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
    axiosPromise?:Promise<AxiosResponse<any, any>>;
}

export const BaseResults: React.FC<baseResultsProps> = ({QueryData, includedKeywords, setPageNumber, axiosPromise}) => {
    const [loading, setLoading] = React.useState(false);
    const [datasets, setDatasets] = React.useState<any[]>([]);
    const [merged, setMerged] = React.useState<any[]>([]);
    React.useEffect(() => { console.log(`searching for keywords ${includedKeywords}`)}, [includedKeywords]);
    React.useEffect( ()=>{
      const getData = async () => {
        try{
          const req = await(axiosPromise!);
          //let data:any = await fetch('http://localhost:5000/rows');
          let data = req.data.data;
          setDatasets(data);
          console.log(data);
          setLoading(false);
          if(data.length > 0) 
            mergeKeywords(data);
        }
        catch(err){
          alert(err);
          setPageNumber(0);
        }
      }
      getData();
    },[])

    React.useEffect(()=>{console.log(datasets)},[datasets])

    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend
    );

    const options = {
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

    const mergeKeywords = (data1: any) => {
      let merged:any = [];
      let keywordCountMap = new Map();
      let data = [...data1];
      let keywords = data.map((row:any) => row.keyword + " " + row.website);
      keywords.forEach((item) => {
        if(!keywordCountMap.has(item)){
          let keywordData = data.filter((row:any) => row.keyword + " " + row.website === item);
          let sum = 0;
          keywordData.forEach((row:any) => sum += row.count);
          let obj = DataObject.copy(keywordData[0]);
          obj.count = sum;
          keywordCountMap.set(item, obj);
          merged.push(obj);
      }});
      setMerged(merged);
    }

    function onlyUnique(value: any, index: any, self: string | any[]) {
      return self.indexOf(value) === index;
    }


    const countSum = (type:string) => {
      let sum = 0;
      datasets.forEach((row) => {row.intonation === type? sum++ : sum=sum});
      return sum;
    }




      React.useEffect(()=>{ 
        setLoading(true)
      },[])

      interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
      }
      
      function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
      }
      
      function a11yProps(index: number) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
      }

        const [value, setValue] = React.useState(0);
      
        const handleChange = (event: React.SyntheticEvent, newValue: number) => {
          setValue(newValue);
        };
      

      if(!loading){
      if(datasets.length === 0) return (  <div className='App flex result' style={{width:'70vw', marginLeft:'15vw'}}>
        <button className='go-back-button run' onClick={()=>{setPageNumber(0)}}>go back</button>
        <div>no data</div>
          </div>);
        else { 

          const intonationData = {
            labels: ["negative intonation sum", "nuetral intonation" ,"positive intonation sum"],
            datasets: [{id:1, label:"negative intonation", data:[countSum("false"),0,0],backgroundColor: '#6a91dc',}
              , {id:2, label:"nuetral intonation", data:[0,countSum("neutral"),0],backgroundColor: '#5e17eb',}
              ,{id:3, label:"positive intonation", data:[0,0, countSum("true")],backgroundColor: '#4aeddd',},
            ]
          };

          const data = {
            labels: [...merged.map((row) => row.keyword).filter(onlyUnique)],
            datasets: [{id: 1, label:"category: "+ merged[0].website, data:[merged[0].count],backgroundColor: '#6a91dc',},
            {id: 2, label:"category: "+merged[1].website, data:[merged[1].count],backgroundColor: '#5e17eb',}]
          };

          const data2 = {
            labels: [...datasets.map((row) => row.keyword)],
            datasets: [{id: 1, label:"category:1", data:datasets.map((row) => row.count),backgroundColor: '#6a91dc',}]
          };
      
          
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
            <button className='go-back-button run' onClick={()=>{setPageNumber(0)}}>go back</button>
            <Bar 
            datasetIdKey='trial'
            options={options}
            data={data}
            />
          </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
          <div className='App flex result' style={{width:'70vw', marginLeft:'15vw'}}>
            <button className='go-back-button run' onClick={()=>{setPageNumber(0)}}>go back</button>
            <Bar 
            datasetIdKey='trial'
            options={options}
            data={intonationData}
            />
          </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
          <div className='App flex result' style={{width:'70vw', marginLeft:'15vw'}}>
            <button className='go-back-button run' onClick={()=>{setPageNumber(0)}}>go back</button>
            <Bar 
            datasetIdKey='trial'
            options={options}
            data={data2}
            />
          </div>
          </TabPanel>
    </Box>

          </>
        )
      }}
  
      else return ( 
      
        <>
        <Background />
      <div className="Loading-Page">
      <CircleLoader
        color={'#5e17eb'}
        loading={loading}
        size={180}
      />
      </div>
      </>);
}