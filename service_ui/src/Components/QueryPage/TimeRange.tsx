import React from 'react';
import { DateRangePicker } from 'rsuite';
import "rsuite/dist/rsuite.min.css";

export interface timeRangeProps {
    text:string;
    showPopUp:Map<number,[boolean,boolean]>;
    setShowPopUp:React.Dispatch<React.SetStateAction<Map<number,[boolean,boolean]>>>;
    timeRange:[Date,Date] | undefined;
    setTimeRange:React.Dispatch<React.SetStateAction<[Date,Date] | undefined>>;
}

export const TimeRange: React.FC<timeRangeProps> = ({text, showPopUp, setShowPopUp, timeRange, setTimeRange}) => {
    const ID = 1;

    const handleOnClick = () => {
        if(showPopUp.get(ID)![0] === true){
            let newMap = new Map(showPopUp)
            newMap.set(ID, [false, true]);
            setShowPopUp(newMap);
            // if (showPopUp.get(ID)![1] === true && timeRange === undefined){
            //     let newMap = new Map(showPopUp)
            //     newMap.set(ID, [false, false]);
            //     setShowPopUp(newMap);
            // }
            // else {
            //     let newMap = new Map(showPopUp)
            //     newMap.set(ID, [true, true]);
            //     setShowPopUp(newMap);
            // }
        }
        else{ 
            let newMap = new Map(showPopUp)
            newMap.set(ID, [true, true]);
            setShowPopUp(newMap);
        }
    }

    const getDateRangePicker = () => {
        return (
            <DateRangePicker 
                placeholder="Select Time Range" 
                onChange={(range) => {
                    if(range)
                        setTimeRange([range![0], range![1]]);
                }}
                value={timeRange}
                preventOverflow
                cleanable={true}
                onClean={() => {setTimeRange(undefined)}}
                placement='autoVertical'
            />
        )
    }
    return(
        <div className='button-pop-component'>
            <button className='select-button' onClick={handleOnClick}> {text} </button>
            {showPopUp.get(ID)![0]? getDateRangePicker(): <></>}
        </div>
    )
}