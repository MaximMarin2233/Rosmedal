import React, { useState, useEffect, useMemo } from 'react';
import globalStyles from "../../App.module.sass";
import styles from "./Faq.module.sass";

import { faqInterface } from '../../types/faqInterface';

interface FAQProps {
  accordionItems: faqInterface[];
}

const Faq: React.FC<FAQProps> = ({ accordionItems }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [heights, setHeights] = useState<number[]>([]);

  const contentRefs = useMemo(() => accordionItems.map(() => React.createRef<HTMLDivElement>()), [accordionItems]);

  const handleAccordionClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const newHeights = contentRefs.map(ref => ref.current?.scrollHeight || 0);
    setHeights(newHeights);
  }, [contentRefs, accordionItems]);

  return (
    <section className={styles.faq_component}>
      <div className={globalStyles.container}>
        <ul className={`${globalStyles.list_reset} ${globalStyles.accordion__list}`}>
          {accordionItems.map((item, index) => (
            <li key={item.id} className={`${openIndex === index ? 'open' : ''}`}>
              <button
                className={`${globalStyles.btn_reset} ${globalStyles.accordion__control}`}
                aria-expanded={openIndex === index}
                onClick={() => handleAccordionClick(index)}
              >
                <span className={globalStyles.accordion__title}>{item.question}</span>
                <span className={globalStyles.accordion__icon}>
                  <span 
                    className={globalStyles.line}
                    style={{ 
                      transform: openIndex === index ? 'translate(-50%, -50%) rotate(90deg)' : 'translate(-50%, -50%)',
                    }}
                  ></span>
                </span>
                <div
                  className={globalStyles.accordion__content}
                  aria-hidden={openIndex !== index}
                  ref={contentRefs[index]}
                  style={{ 
                    maxHeight: openIndex === index ? heights[index] : 0,
                    opacity: openIndex === index ? 1 : 0,
                    padding: openIndex === index ? '34px 0 0' : '0'
                  }}
                >
                  <p className={globalStyles.accordion__descr}>{item.answer}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Faq;
