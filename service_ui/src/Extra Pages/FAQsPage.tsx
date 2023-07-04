import React from 'react';
import { ARABIC, ENGLISH, HEBREW, MAIN_SEARCH_PAGE } from '../Helpers/consts';
import { AQComponent, FAQObject } from './FAQComponent';
import { ANSWER1, ANSWER2, ANSWER3, ANSWER4, ANSWER5, GO_BACK, QUESTION1, QUESTION2, QUESTION3, QUESTION4, QUESTION5 } from '../Helpers/texts';
import { getLanguage } from '../Helpers/helpers';


export interface FAQsPageProps {
    hideFAQ: () => void;
}

export const FAQsPage: React.FC<FAQsPageProps> = ({hideFAQ}) => {

  const language:number = getLanguage();
  const FAQList_E = [{
    question: QUESTION1[ENGLISH],
    answer: ANSWER1[ENGLISH],
    open: false
  },{
    question: QUESTION2[ENGLISH],
    answer: ANSWER2[ENGLISH],
    open: false
  },
  {
    question: QUESTION3[ENGLISH],
    answer: ANSWER3[ENGLISH],
    open: false
  }, {
    question: QUESTION4[ENGLISH],
    answer: ANSWER4[ENGLISH],
    open: false
  },{
    question: QUESTION5[ENGLISH],
    answer: ANSWER5[ENGLISH],
    open: false
  },]

  const FAQList_H = [{
    question: QUESTION1[HEBREW],
    answer: ANSWER1[HEBREW],
    open: false
  },{
    question: QUESTION2[HEBREW],
    answer: ANSWER2[HEBREW],
    open: false
  },
  {
    question: QUESTION3[HEBREW],
    answer: ANSWER3[HEBREW],
    open: false
  }, {
    question: QUESTION4[HEBREW],
    answer: ANSWER4[HEBREW],
    open: false
  },{
    question: QUESTION5[HEBREW],
    answer: ANSWER5[HEBREW],
    open: false
  },]

  const FAQList_A = [{
    question: QUESTION1[ARABIC],
    answer: ANSWER1[ARABIC],
    open: false
  },{
    question: QUESTION2[ARABIC],
    answer: ANSWER2[ARABIC],
    open: false
  },
  {
    question: QUESTION3[ARABIC],
    answer: ANSWER3[ARABIC],
    open: false
  }, {
    question: QUESTION4[ARABIC],
    answer: ANSWER4[ARABIC],
    open: false
  },{
    question: QUESTION5[ARABIC],
    answer: ANSWER5[ARABIC],
    open: false
  },]

  const [faqs_E, setFaqs_E] = React.useState<FAQObject[]>(FAQList_E);
  const [faqs_H, setFaqs_H] = React.useState<FAQObject[]>(FAQList_H);
  const [faqs_A, setFaqs_A] = React.useState<FAQObject[]>(FAQList_A);


  /*
  * This function toggles the open state of the FAQ object at the given index
  */
  const toggleFAQ_E = (index: number) => {
    setFaqs_E(faqs_E.map((faq, i) => {
      if (i === index) {
        faq.open = !faq.open
      } else {
        faq.open = false;
      }
      return faq;
    }))
  }

  const toggleFAQ_H = (index: number) => {
    setFaqs_H(faqs_H.map((faq, i) => {
      if (i === index) {
        faq.open = !faq.open
      } else {
        faq.open = false;
      }
      return faq;
    }))
  }

  const toggleFAQ_A = (index: number) => {
    setFaqs_A(faqs_A.map((faq, i) => {
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
    <button className='go-back-button' onClick={hideFAQ}>{GO_BACK[language]}</button>
    <div className="App">
    <div className="faqs">
        {language == HEBREW ? faqs_H.map((faq, i) => (
          <AQComponent key={i} faq={faq} index={i} toggleFAQ={toggleFAQ_H} />
          ))
          : language == ENGLISH? faqs_E.map((faq, i) => (
            <AQComponent key={i} faq={faq} index={i} toggleFAQ={toggleFAQ_E} />
            ))
          : faqs_A.map((faq, i) => (
            <AQComponent key={i} faq={faq} index={i} toggleFAQ={toggleFAQ_A} />
            ))
        }
      </div>
    </div>
  </>
  )
} 