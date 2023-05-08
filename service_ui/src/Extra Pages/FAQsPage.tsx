import React from 'react';
import { MAIN_SEARCH_PAGE } from '../Helpers/consts';
import { AQComponent, FAQObject } from './FAQComponent';
import { ANSWER1, ANSWER2, ANSWER3, ANSWER4, ANSWER5, QUESTION1, QUESTION2, QUESTION3, QUESTION4, QUESTION5 } from '../Helpers/texts';


export interface FAQsPageProps {
    setPageNumber: React.Dispatch<React.SetStateAction<number>>
}

export const FAQsPage: React.FC<FAQsPageProps> = ({setPageNumber}) => {


  const FAQList = [{
    question: QUESTION1[0],
    answer: ANSWER1[0],
    open: false
  },{
    question: QUESTION2[0],
    answer: ANSWER2[0],
    open: false
  },
  {
    question: QUESTION3[0],
    answer: ANSWER3[0],
    open: false
  }, {
    question: QUESTION4[0],
    answer: ANSWER4[0],
    open: false
  },{
    question: QUESTION5[0],
    answer: ANSWER5[0],
    open: false
  },]

  const [faqs, setFaqs] = React.useState<FAQObject[]>(FAQList);


  /*
  * This function toggles the open state of the FAQ object at the given index
  */
  const toggleFAQ = (index: number) => {
    setFaqs(faqs.map((faq, i) => {
      if (i === index) {
        faq.open = !faq.open
      } else {
        faq.open = false;
      }
      return faq;
    }))
  }

  
  return (
    <>
    <button className='go-back-button' onClick={()=>{setPageNumber(MAIN_SEARCH_PAGE)}}>go back</button>
    <div className="App">
    <div className="faqs">
        {faqs.map((faq, i) => (
          <AQComponent key={i} faq={faq} index={i} toggleFAQ={toggleFAQ} />
        ))}
      </div>
    </div>
  </>
  )
} 