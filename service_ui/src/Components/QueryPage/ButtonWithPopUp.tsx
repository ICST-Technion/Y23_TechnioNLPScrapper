import React from 'react';
import { DateRangePicker } from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import { advancedQueryData } from '../../App';
import { SelectedValues } from './SelectedValues';

export interface buttonProps {
    ID:number;
    text:string;
    updated:Map<number, string>;
    setUpdated:React.Dispatch<React.SetStateAction<Map<number, string>>>;
}

export const ButtonWithPopUp: React.FC<buttonProps> = ({ID, text, updated, setUpdated}) => {
    const [message, setMessage] = React.useState('');
    const [counter, setCounter] = React.useState<number>(0);
    const [showTextBox, setShowTextBox] = React.useState<Boolean>(false);

    const handleOnClick = () => {
        setShowTextBox(!showTextBox);
    }

    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setMessage(event.target.value);
      };

    React.useEffect((()=>{
        //takes care of message being changed into " " at the start of a new keyword
        //this deletes it and allows all next words to start from index 0
        if(message === ' ')
            setMessage('');
    }),[message])
    
    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === ' ' || event.key === 'Enter') {
            // 👇 Get input value
            let newKey = message.substring(message.lastIndexOf(' '));
            //make sure we arent adding an empty word
            if(newKey !== '' && newKey !== undefined)
            {
                setUpdated(updated.set(counter,newKey));
                setCounter(counter+1);
                setMessage('');
            }
            
        }
    };

    const removeOnClick = (index:number) => {
        let newMap = new Map(updated);
        newMap.delete(index);
        setUpdated(newMap);
    }

    const getPopUpComponent = () =>{
        if(ID === 4 && showTextBox) return(<div>Currently Only Supports Keyword Counter</div>)
        else {
            return(
            <>
                <div className='type-in'>
                {showTextBox? 
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
            {getPopUpComponent()}
        </div>
    )
}