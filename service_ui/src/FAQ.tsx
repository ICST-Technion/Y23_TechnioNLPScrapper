import React from 'react';
import { AQObject } from './FAQsPage';

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
			<div className="faq-question">
				{faq.question}
			</div>
			<div className="faq-answer">
				{faq.answer}
			</div>
		</div>
	)

};
