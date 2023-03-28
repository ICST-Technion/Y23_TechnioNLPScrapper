import React from 'react';

export interface AQObject{
	question: string;
	answer: string;
	open: boolean;
  }

export interface AQComponentProps {
   faq:AQObject;
   index:number;
   toggleFAQ:(index: number) => void;
}

export const AQComponent: React.FC<AQComponentProps> = ({faq, index, toggleFAQ}) => {

	return (
		<div
			className={"faq " + (faq.open ? 'open' : '')}
			key={index}
			onClick={() => toggleFAQ(index)}
		>
			<div className="faq-question" style={{display: 'flex', justifyContent:'space-between', alignItems: 'center'}}>
				{faq.question}
				
			</div>
			<div className="faq-answer">
				{faq.answer}
			</div>
		</div>
	)

};
