import { useEffect, useState } from 'react';

import globalStyles from '../../App.module.sass';
import styles from './FaqPage.module.sass';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Feedback from '../../components/Feedback/Feedback';
import Faq from '../../components/Faq/Faq';

import { faqInterface } from '../../types/faqInterface';

const FaqPage = () => {
  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Часто задаваемые вопросы', href: '/faq' },
  ];

  const [questionsOlympiads, setQuestionsOlympiads] = useState<faqInterface[]>([]);
  const [questionsCourses, setQuestionsCourses] = useState<faqInterface[]>([]);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response1 = await fetch(`${apiBaseUrl}/api/v1/faq/?category=FAQ_OLYMPIADS_AND_COMPETITIONS`);
        const data1 = await response1.json();
        setQuestionsOlympiads(data1.results);

        const response2 = await fetch(`${apiBaseUrl}/api/v1/faq/?category=FAQ_COURSES`);
        const data2 = await response2.json();
        setQuestionsCourses(data2.results);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [apiBaseUrl]); // Добавляем apiBaseUrl в массив зависимостей

  return (
    <section className={`${globalStyles.section_padding} ${styles.faq_page}`}>
      <div className={globalStyles.container}>
        <Breadcrumbs links={breadcrumbLinks} />

        <h2 className={`${globalStyles.title} ${styles.faq_page__title}`}>Часто задаваемые вопросы</h2>

        <div className={styles.faq_page__content}>
          <div className={styles.fag_page__block}>
            <h3 className={styles.faq_page__subtitle}>Вопросы по олимпиадам и конкурсам:</h3>
            <Faq accordionItems={questionsOlympiads} />
          </div>

          <div className={styles.fag_page__block}>
            <h3 className={styles.faq_page__subtitle}>Вопросы по курсам повышения квалификации и переподготовки:</h3>
            <Faq accordionItems={questionsCourses} />
          </div>
        </div>

        <Feedback />
      </div>
    </section>
  );
};

export default FaqPage;
