import React from 'react';
import { AQComponent } from './FAQ';


export interface AQObject{
  question: string;
  answer: string;
  open: boolean;
}

export interface FAQsPageProps {
    setPageNumber: React.Dispatch<React.SetStateAction<number>>
}

export const FAQsPage: React.FC<FAQsPageProps> = ({setPageNumber}) => {
  const [faqs, setFaqs] = React.useState<AQObject[]>([{
    question: 'Q1',
    answer: 'answer 1',
    open: false
  },{
    question: 'Q2',
    answer: 'answer 2',
    open: false
  },
  {
    question: 'Q3',
    answer: 'answer 3',
    open: false
  }, {
    question: 'Q4',
    answer: 'answer 4',
    open: false
  }, {
    question: 'Q5',
    answer: 'answer 5',
    open: false
  }]);

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
    <button className='go-back-button' onClick={()=>{setPageNumber(0)}}>go back</button>
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