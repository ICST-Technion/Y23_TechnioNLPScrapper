import React from 'react';
import { FAQsPageProps } from './FAQsPage';

function FAQ ({faq, index, toggleFAQ}:{faq:any;index:number,toggleFAQ:any}) {
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
}

export default FAQ