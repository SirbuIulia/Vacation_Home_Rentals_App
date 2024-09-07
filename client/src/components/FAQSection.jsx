import React, { useState } from "react";
import "../styles/FAQSection.scss";

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        { question: "Cum pot să rezerv o proprietate?", answer: "Pentru a rezerva o proprietate, caută destinația dorită, selectează datele de călătorie și alege o proprietate disponibilă. Apasă pe 'Rezervă' și urmează pașii pentru a finaliza rezervarea." },
        { question: "Cum pot lăsa o recenzie?", answer: "Pentru a lăsa o recenzie unei proprietăți rezervate este necesară onorarea rezervării respective adică îndeplinirea perioadei de rezervare, iar apoi în secțiunea Călătoriile mele se poate lăsa recenzia." },
        { question: "Este sigur să folosesc aplicația pentru plăți?", answer: "Da, aplicația noastră folosește tehnologii de securitate avansate pentru a proteja informațiile tale financiare. Toate tranzacțiile sunt criptate și monitorizate pentru activități suspecte." },
    ];

    return (
        <div className="faq_section">
            <h2>Întrebări frecvente</h2>
            {faqs.map((faq, index) => (
                <div className="faq_item" key={index}>
                    <div className="faq_question" onClick={() => toggleFAQ(index)}>
                        <h4>{faq.question}</h4>
                        <span className={activeIndex === index ? "open" : ""}>{activeIndex === index ? "▲" : "▼"}</span>
                    </div>
                    {activeIndex === index && <p className="faq_answer">{faq.answer}</p>}
                </div>
            ))}
        </div>
    );
}

export default FAQSection;
