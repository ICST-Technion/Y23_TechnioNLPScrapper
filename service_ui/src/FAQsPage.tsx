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
    question: 'How do I search on the website?',
    answer: 'You can search by entering keywords into the search bar on the homepage and clicking the run button.',
    open: false
  },{
    question: 'Are there any advanced search options?',
    answer: 'Yes, You can click on the advanced search options button which shows the diffrent ways to elevate the search such as filtering by date.',
    open: false
  },
  {
    question: 'Is it possible to search in a specific language?',
    answer: 'Yes, you can search in any language you want.',
    open: false
  }, {
    question: 'Can I view the statistics for articles in different languages?',
    answer: 'Yes, You can by searching the keywords in that language.',
    open: false
  },{
    question: 'Are the statistics updated in real-time?',
    answer: 'Yes, You will always see the most up-to-date information when you view an articles statistics.',
    open: false
  },]);

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