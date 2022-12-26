import React from 'react';


export interface aboutProps {
    setPageNumber: React.Dispatch<React.SetStateAction<number>>
}

export const About: React.FC<aboutProps> = ({setPageNumber}) => {

  return (
    <>
    <button className='go-back-button' onClick={()=>{setPageNumber(0)}}>go back</button>
    <div className="App">
      <div className='about-text'>
        <p>
          This project addresses the needs of Sikkuy-Aufoq (SA) 
          - a shared Jewish and Arab nonprofit organization that 
          works to advance equality and partnership between the 
          Arab-Palestinian citizens of Israel - who, in their own words: 
          work to educate and motivate the public at large and to shape 
          public discourse through the media and digital spaces.
        </p>
        <p>
          The MVP provides a dashboard that presents an easy way to query data, with advanced search options,
          the results found can be sortable, queryable data/statistics.
        </p>
        <p>
          This is done by scrapping targeted websites and
          digital-newspapers for relevant articles and evaluating the intonation/meaning
          of their content.
        </p>
      </div>
    </div>
  </>
  )
}