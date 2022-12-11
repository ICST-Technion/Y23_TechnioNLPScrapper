import React from 'react';
import { DateRangePicker } from 'rsuite';
import "rsuite/dist/rsuite.min.css";

export interface buttonProps {
    ID:number;
    text:string;
    showPopUp:number;
    setShowPopUp:React.Dispatch<React.SetStateAction<number>>;
}

export const ButtonWithPopUp: React.FC<buttonProps> = ({ID, text, showPopUp, setShowPopUp}) => {
    const [message, setMessage] = React.useState('');
    const [updated, setUpdated] = React.useState<String[]>([]);

    const handleOnClick = () => {
        if(showPopUp === ID)
            setShowPopUp(-1)
        else setShowPopUp(ID)
    }
    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setMessage(event.target.value);
      };
    
      const handleKeyDown = (event: { key: string; }) => {
        if (event.key === ' ') {
          // 👇 Get input value
          setUpdated([...updated, message.substring(message.lastIndexOf(' '))]);
          setMessage('');
        }
        if(event.key === 'Enter'){
            setShowPopUp(-1);
        }
      };

    const getPopUpComponent = () =>{
        if(ID === 1){
            return(<DateRangePicker placeholder="Select Time Range" defaultOpen/>)
        }
        else if(ID === 4) return(<div>i work i guess</div>)
        else {
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
                    <span>{updated}</span>
                </div>
            </>
            )
        }
    }

    return(
        <div className='button-pop-component'>
            <button className='select-button' onClick={handleOnClick}> {text} </button>
            {showPopUp === ID? getPopUpComponent(): <></>}
        </div>
    )
}