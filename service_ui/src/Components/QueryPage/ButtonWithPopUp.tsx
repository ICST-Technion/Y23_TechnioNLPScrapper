import React from 'react';
import { DateRangePicker } from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import { advancedQueryData } from '../../App';
import { SelectedValues } from './SelectedValues';

export interface buttonProps {
    ID:number;
    text:string;
    showPopUp:Map<number,[boolean,boolean]>;
    setShowPopUp:React.Dispatch<React.SetStateAction<Map<number,[boolean,boolean]>>>;
    updated:Map<number, string>;
    setUpdated:React.Dispatch<React.SetStateAction<Map<number, string>>>;
}

export const ButtonWithPopUp: React.FC<buttonProps> = ({ID, text, showPopUp, setShowPopUp, updated, setUpdated}) => {
    const [message, setMessage] = React.useState('');
    const [counter, setCounter] = React.useState<number>(0);

    const handleOnClick = () => {
        let newMap:Map<number,[boolean,boolean]> = new Map(showPopUp);
        if(showPopUp.get(ID)![0] === true){
            if(updated.size === 0){
                newMap.set(ID, [false, true]);
            }
            else if (showPopUp.get(ID)![1] === false){
                newMap.set(ID, [true, true]);
            }
            else {
                newMap.set(ID, [true, false]);
            }
        }
        else{ 
            newMap.set(ID, [true, true]);
        }
        setShowPopUp(newMap);
    }

    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setMessage(event.target.value);
      };
    
    const handleKeyDown = (event: { key: string; }) => {
    if (event.key === ' ' || event.key === 'Enter') {
        // 👇 Get input value
        setUpdated(updated.set(counter,message.substring(message.lastIndexOf(' '))));
        setMessage('');
        setCounter(counter+1);
    }
    };

    const removeOnClick = (index:number) => {
        let newMap = new Map(updated);
        newMap.delete(index);
        setUpdated(newMap);
    }

    const getPopUpComponent = () =>{
        if(ID === 4) return(<div>i work i guess</div>)
        else {
            return(
            <>
                <div className='type-in'>
                {showPopUp.get(ID)![1]? 
                    <input
                        type="text"
                        id="message"
                        name="message"
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    /> : <></>
                }
                    <SelectedValues values={updated} removeString={removeOnClick} ID={ID}/>
                </div>
            </>
            )
        }
    }

    return(
        <div className='button-pop-component'>
            <button className='select-button' onClick={handleOnClick}> {text} </button>
            {showPopUp.get(ID)![0]? getPopUpComponent(): <></>}
        </div>
    )
}