import React from 'react';
import { advancedQueryData } from '../../App';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';


export interface baseResultsProps {
    QueryData:advancedQueryData;
    includedKeywords:string;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>
}

export const BaseResults: React.FC<baseResultsProps> = ({QueryData, includedKeywords, setPageNumber}) => {
    React.useEffect(() => { console.log(`searching for keywords ${includedKeywords}`)}, []);

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
  
      return (
      <>
        <div className="App">
          <button className='go-back-button' onClick={()=>{setPageNumber(0)}}>go back</button>
          <div className='flex result'>
            <h3 className='result-header'> Example Results</h3>
            <h4 className='result-sub-header'>keyword check in a hardcoded HTML from ynet</h4>
            <ImageGallery items={images} showThumbnails showFullscreenButton showNav/>
          </div>
        </div>
      </>
      )
}