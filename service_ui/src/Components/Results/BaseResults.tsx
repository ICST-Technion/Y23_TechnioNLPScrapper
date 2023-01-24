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


export interface baseResultsProps {
    QueryData:advancedQueryData[];
    includedKeywords:string[];
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
    axiosPromise:any;
}

export const BaseResults: React.FC<baseResultsProps> = ({QueryData, includedKeywords, setPageNumber, axiosPromise}) => {
    const [loading, setLoading] = React.useState(false);
    const [datasets, setDatasets] = React.useState<any[]>([])
    React.useEffect(() => { console.log(`searching for keywords ${includedKeywords}`)}, [includedKeywords]);
    React.useEffect( ()=>{
      const getData = async () => {
        //await(axiosPromise);
        let data:any = await fetch('http://localhost:5000/rows');
        data = (await data.json()).data;
        setDatasets(data);
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

    const data = {
      labels: [...datasets.map((row) => row.keyword), "only in cat 2", "in neither"],
      datasets: [{id: 1, label:"category: "+QueryData[0].category_ID, data:datasets.map((row) => { return row.count}),backgroundColor: 'rgb(255, 99, 132)',},
      {id: 2, label:"category: "+QueryData[1].category_ID, data:[...datasets.map((row) => { return Math.floor(Math.random() * (12 - 0 + 1)) + 0;}), 5],backgroundColor: 'rgb(75, 192, 192)',}]
    };

    
    const countSum = (type:string) => {
      let sum = 0;
      datasets.forEach((row) => {row.intonation === type? sum++ : sum=sum});
      return sum;
    }


    const intonationData = {
      labels: ["negative intonation sum", "nuetral intonation" ,"positive intonation sum"],
      datasets: [{id:1, label:"negative intonation", data:[countSum("false"),0,0],backgroundColor: '#6a91dc',}
        , {id:2, label:"nuetral intonation", data:[0,countSum("neutral"),0],backgroundColor: '#5e17eb',}
        ,{id:3, label:"positive intonation", data:[0,0, countSum("true")],backgroundColor: '#4aeddd',},
      ]
    };

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
      

      if(datasets.length !== 0){
        return (
          <>
          <Background />
          <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="keyword graph" {...a11yProps(0)} />
              <Tab label="intonation graph" {...a11yProps(1)} />
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
    </Box>

          </>
        )
      }
  
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