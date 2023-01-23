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
        await(axiosPromise);
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
    }

    const images = [
        {
          original: require('./Images/graph1.jpg'),
          thumbnail: require('./Images/graph1.jpg'),
        },
        {
          original: require('./Images/graph2.jpg'),
          thumbnail: require('./Images/graph2.jpg'),
        },
        {
          original: require('./Images/graph3.jpg'),
          thumbnail: require('./Images/graph3.jpg'),
        },
      ];

      React.useEffect(()=>{ 
        setLoading(true)
      },[])

      if(datasets.length !== 0){
        return (
          <>
          <Background />
          <div className='App flex result' style={{width:'70vw', marginLeft:'15vw'}}>
            <button className='go-back-button' onClick={()=>{setPageNumber(0)}}>go back</button>
            <Bar 
            datasetIdKey='trial'
            options={options}
            data={data}
            />
          </div>
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