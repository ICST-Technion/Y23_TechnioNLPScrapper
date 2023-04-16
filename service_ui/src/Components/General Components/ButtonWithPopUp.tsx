import { Typography } from '@mui/material';
import React from 'react';
import "rsuite/dist/rsuite.min.css";
import { SelectedValues } from './SelectedValues';

export interface buttonProps {
    ID:number;
    text:string;
    updated:Map<number, string>;
    setUpdated:(v:Map<number, string>) => void
}

export const ButtonWithPopUp: React.FC<buttonProps> = ({ID, text, updated, setUpdated}) => {
    const [message, setMessage] = React.useState('');
    const [counter, setCounter] = React.useState<number>(0);

    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setMessage(event.target.value);
      };

    React.useEffect((()=>{
        //takes care of message being changed into " " at the start of a new keyword
        //this deletes it and allows all next words to start from index 0
        if(message === ' ')
            setMessage('');
    }),[message])
    
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            // 👇 Get input value
            let newKey = event.target.value;
            //make sure we arent adding an empty word
            if(newKey !== '' && newKey !== undefined)
            {
                setUpdated(new Map(updated.set(counter,newKey)));
                setCounter(counter+1);
                setMessage('');
            }
            
        }
    };

    /*
    *   This function is called when the user clicks on the x button next to a keyword
    *   It takes in the index of the keyword and deletes it from the map
    *   It then updates the map
    */
    const removeOnClick = (index:number) => {
        let newMap = new Map(updated);
        newMap.delete(index);
        setUpdated(newMap);
    }

    const getPopUpComponent = () =>{
            // return the text input and the selected values component
            return(
            <>
                <div className='type-in'>
                    <input
                        type="text"
                        id="message"
                        name="message"
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    <SelectedValues values={updated} removeString={removeOnClick} ID={ID}/>
                </div>
            </>
            )

    }

    return(
        <div className='button-pop-component'>
            <Typography variant='body1'> {text} </Typography>
            {getPopUpComponent()}
        </div>
    )
}