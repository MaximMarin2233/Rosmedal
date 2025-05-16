import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link, scroller } from 'react-scroll';
import { useLocation } from "react-router-dom";

import globalStyles from '../../../../App.module.sass';
import modalStyles from '../../../../components/ModalComponent/ModalComponent.module.sass';
import styles from './OlympiadsChoice.module.sass';

import ModalComponent from '../../../../components/ModalComponent/ModalComponent'; // Путь к вашему компоненту

interface IOlympiads {
  count: number;
  total_pages: number;
  results: IOlympiadsInf[];
}

interface IOlympiadsInf {
  id: number;
  title: string;
  description: string;
}

interface IOlympiadDetail {
  title: string;
  description: string;
  questions: IOlympiadDetailQuestions[];
  // Добавьте другие поля, если они есть
}

interface IOlympiadDetailQuestions {
  question: string;
  answers: IOlympiadDetailQuestionsAnswers[];
}

interface IOlympiadDetailQuestionsAnswers {
  title: string;
  is_correct: boolean;
}

const OlympiadsChoice = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const anchor = location.hash.slice(1); // Получаем якорь без символа #
      scroller.scrollTo(anchor, {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -150
      });
    }
  }, [location]);

  const [olympiads, setOlympiads] = useState<IOlympiads | null>(null);
  const [forWhomFilters, setForWhomFilters] = useState<string[]>([]);
  const [subjectFilters, setSubjectFilters] = useState<string[]>([]);
  const [gradeFilters, setGradeFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSubjectsModalOpen, setIsSubjectsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState<number | null>(null);
  const [modalContent, setModalContent] = useState<IOlympiadDetail | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [questionsStatus, setQuestionsStatus] = useState<(boolean | null)[]>([]);
  const [checkedAnswers, setCheckedAnswers] = useState<{ [key: number]: string[] }>({});
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isTestCompleted, setIsTestCompleted] = useState(false);

  const [isEnChecked, setIsEnChecked] = useState(false);
  const [isLibraryChecked, setIsLibraryChecked] = useState(false);
  const [isBiologyChecked, setIsBiologyChecked] = useState(false);
  const [isEducationalWorkChecked, setIsEducationalWorkChecked] = useState(false);
  const [isGeographyChecked, setIsGeographyChecked] = useState(false);
  const [isAdditionalEducationChecked, setIsAdditionalEducationChecked] = useState(false);
  const [isPreschoolEducationChecked, setIsPreschoolEducationChecked] = useState(false);
  const [isArtChecked, setIsArtChecked] = useState(false);
  const [isForeignChecked, setIsForeignChecked] = useState(false);
  const [isComputerChecked, setIsComputerChecked] = useState(false);
  const [isHistoryChecked, setIsHistoryChecked] = useState(false);
  const [isClassChecked, setIsClassChecked] = useState(false);
  const [isMHKChecked, setIsMHKChecked] = useState(false);
  const [isMathsChecked, setIsMathsChecked] = useState(false);
  const [isMusicChecked, setIsMusicChecked] = useState(false);
  const [isPrimaryChecked, setIsPrimaryChecked] = useState(false);
  const [isLifeChecked, setIsLifeChecked] = useState(false);
  const [isSpecialChecked, setIsSpecialChecked] = useState(false);
  const [isSocialChecked, setIsSocialChecked] = useState(false);
  const [isEnviromentChecked, setIsEnviromentChecked] = useState(false);
  const [isReligiousChecked, setIsReligiousChecked] = useState(false);
  const [isLaborChecked, setIsLaborChecked] = useState(false);
  const [isLawChecked, setIsLawChecked] = useState(false);
  const [isLiteratureChecked, setIsLiteratureChecked] = useState(false);
  const [isRusChecked, setIsRusChecked] = useState(false);
  const [isPedagogyChecked, setIsPedagogyChecked] = useState(false);
  const [isTechnologyChecked, setIsTechnologyChecked] = useState(false);
  const [isPhysicsChecked, setIsPhysicsChecked] = useState(false);
  const [isPhysicalChecked, setIsPhysicalChecked] = useState(false);
  const [isChemistryChecked, setIsChemistryChecked] = useState(false);
  const [isPsychologistChecked, setIsPsychologistChecked] = useState(false);
  const [isEconomicsChecked, setIsEconomicsChecked] = useState(false);

  const [currentPaginationPage, setCurrentPaginationPage] = useState(0);

  const [skippedQuestions, setSkippedQuestions] = useState<number[]>([]);
  const [skippedFlag, setSkippedFlag] = useState(true);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  useEffect(() => {
    const fetchOlympiads = async () => {
      try {
        const params = new URLSearchParams();
        forWhomFilters.forEach(filter => params.append('for_whom', filter));
        subjectFilters.forEach(filter => params.append('subject', filter));
        gradeFilters.forEach(filter => params.append('grade', filter));

        if (searchQuery) {
          params.append('title', searchQuery);
        }

        params.append('page', `${currentPaginationPage + 1}`);

        const response = await fetch(`${apiBaseUrl}/api/v1/olympiads/?${params.toString()}`);
        const data: IOlympiads = await response.json();
        setOlympiads(data);
      } catch (error) {
        console.error('Error fetching olympiads:', error);
      }
    };

    fetchOlympiads();
  }, [forWhomFilters, subjectFilters, gradeFilters, searchQuery, currentPaginationPage]);

  useEffect(() => {
    if (modalKey !== null) {
      const fetchModalContent = async () => {
        try {
          const response = await fetch(`${apiBaseUrl}/api/v1/olympiads/${modalKey}`);
          const data: IOlympiadDetail = await response.json();
          setModalContent(data);
          setQuestionsStatus(new Array(data.questions.length).fill(null)); // Инициализация статуса вопросов
          setStartTime(new Date()); // Установить время начала теста
        } catch (error) {
          console.error('Error fetching modal content:', error);
        }
      };

      fetchModalContent();
    }
  }, [modalKey]);

  const handleForWhomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetPagination();
    const { value, checked } = event.target;
    setForWhomFilters(prevFilters => {
      if (checked) {
        return [...prevFilters, value];
      } else {
        return prevFilters.filter(filter => filter !== value);
      }
    });
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetPagination();
    const { value, checked } = event.target;
    setSubjectFilters(prevFilters => {
      if (checked) {
        return [...prevFilters, value];
      } else {
        return prevFilters.filter(filter => filter !== value);
      }
    });
  };

  const handleGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetPagination();
    const { value, checked } = event.target;
    setGradeFilters(prevFilters => {
      if (checked) {
        return [...prevFilters, value];
      } else {
        return prevFilters.filter(filter => filter !== value);
      }
    });
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetPagination();
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    resetPagination();
    event.preventDefault();
    setSearchQuery(searchQuery);
  };

  const openModal = (key: number) => {
    setModalKey(key);
    setIsFirstModalOpen(true);
    setCurrentQuestionIndex(0); // Начинаем с первого вопроса
    setSelectedAnswers([]); // Сбросить выбранные ответы
    setQuestionsStatus([]); // Сбросить статус вопросов
    setCheckedAnswers({}); // Сбросить проверенные ответы
    setIsAnswerChecked(false); // Сбросить проверку ответа
    setIsTestCompleted(false); // Сбросить состояние завершения теста
  };

  const closeModal = () => {
    setSkippedFlag(true);
    setIsFirstModalOpen(false);
    setQuestionsStatus([]);
    setIsTestCompleted(false);
  };

  const openSubjectsModal = () => {
    setIsSubjectsModalOpen(true);
  };

  const closeSubjectsModal = () => {
    setIsSubjectsModalOpen(false);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedAnswers(prevAnswers => {
      if (checked) {
        return [...prevAnswers, value];
      } else {
        return prevAnswers.filter(answer => answer !== value);
      }
    });
  };

  const checkAnswer = () => {
    const currentQuestion = modalContent?.questions[currentQuestionIndex];
    if (currentQuestion) {
      const isCorrect = currentQuestion.answers.every(answer =>
        selectedAnswers.includes(answer.title) === answer.is_correct
      );
      setIsAnswerChecked(true);

      // Обновить состояние вопросов
      setQuestionsStatus(prevStatus => {
        const newStatus = [...prevStatus];
        newStatus[currentQuestionIndex] = isCorrect;
        return newStatus;
      });

      // Обновить состояние проверенных ответов
      setCheckedAnswers(prevCheckedAnswers => ({
        ...prevCheckedAnswers,
        [currentQuestionIndex]: selectedAnswers,
      }));
    }
  };

  const skipQuestion = () => {
    setSkippedQuestions(prevSkipped => [...prevSkipped, currentQuestionIndex]);
    nextQuestion();
  };

  const nextQuestion = () => {
    setIsAnswerChecked(false);
    setCheckedAnswers(prevCheckedAnswers => ({
      ...prevCheckedAnswers,
      [currentQuestionIndex]: [],
    }));
    setSelectedAnswers([]);

    console.log(skippedQuestions);

    if ((currentQuestionIndex < (modalContent?.questions.length ?? 0) - 1) && skippedFlag) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (skippedQuestions.length > 0) {
      setSkippedFlag(false);

      setCurrentQuestionIndex(skippedQuestions[0]);
      setSkippedQuestions(prevSkipped => prevSkipped.slice(1));
    } else {
      setEndTime(new Date()); // Установить время завершения теста
      setIsTestCompleted(true); // Установить состояние завершения теста
    }
  };

  const getResults = () => {
    const correctAnswersCount = questionsStatus.filter(status => status === true).length;
    const totalQuestions = questionsStatus.length;
    const percentage = (correctAnswersCount / totalQuestions) * 100;
    const timeSpent = endTime && startTime ? ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(2) : '0';

    return { correctAnswersCount, totalQuestions, percentage, timeSpent };
  };

  const handlePaginationClick = (index: number) => {
    setCurrentPaginationPage(index);
  };

  const resetPagination = () => {
    setCurrentPaginationPage(0);
  };

  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <section className={globalStyles.products_choice}>
      <div className={globalStyles.container}>
        <h2 className={`${globalStyles.title} ${globalStyles.products_choice__title}`}>Выберите олимпиаду</h2>
        <div className={globalStyles.products_choice__content}>
          <aside className={globalStyles.products_choice__aside}>
            <div className={globalStyles.products_choice__aside_block}>
              <h3 className={globalStyles.products_choice__aside_title}>Выберите для кого</h3>
              <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__aside_list}`}>
                {[
                  {
                    title: 'Для воспитателей',
                    filter: 'KINDERGARTENER'
                  },
                  {
                    title: 'Для учителей',
                    filter: 'TEACHERS'
                  },
                  {
                    title: 'Для дошкольников',
                    filter: 'PRESCHOOLERS'
                  },
                  {
                    title: 'Для школьников',
                    filter: 'PUPILS'
                  },
                  {
                    title: 'Для студентов',
                    filter: 'STUDENTS'
                  },
                ].map((label, index) => (
                  <li key={index} className={globalStyles.products_choice__aside_item}>
                    <label className={globalStyles.products_choice__aside_label}>
                      <input
                        type="checkbox"
                        value={label.filter} // Преобразование для примера
                        onChange={handleForWhomChange}
                      />
                      {label.title}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className={globalStyles.products_choice__aside_block}>
              <h3 className={globalStyles.products_choice__aside_title}>Выберите предмет</h3>
              <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__aside_list}`}>
                {[
                  {
                    title: 'Математика',
                    filter: 'MATHS',
                    checked: isMathsChecked,
                    function: () => {
                      setIsMathsChecked(!isMathsChecked);
                    }
                  },
                  {
                    title: 'Русский язык',
                    filter: 'RUSSIAN_LANGUAGE',
                    checked: isRusChecked,
                    function: () => {
                      setIsRusChecked(!isRusChecked);
                    }
                  },
                  {
                    title: 'Английский язык',
                    filter: 'ENGLISH_LANGUAGE',
                    checked: isEnChecked,
                    function: () => {
                      setIsEnChecked(!isEnChecked);
                    }
                  },
                  {
                    title: 'Музыка',
                    filter: 'MUSIC',
                    checked: isMusicChecked,
                    function: () => {
                      setIsMusicChecked(!isMusicChecked);
                    }
                  },
                  {
                    title: 'История',
                    filter: 'HISTORY',
                    checked: isHistoryChecked,
                    function: () => {
                      setIsHistoryChecked(!isHistoryChecked);
                    }
                  },
                  {
                    title: 'Физкультура',
                    filter: 'PHYSICAL_CULTURE',
                    checked: isPhysicalChecked,
                    function: () => {
                      setIsPhysicalChecked(!isPhysicalChecked);
                    }
                  },
                ].map((label, index) => (
                  <li key={index} className={globalStyles.products_choice__aside_item}>
                    <label className={globalStyles.products_choice__aside_label}>
                      <input
                        type="checkbox"
                        value={label.filter} // Преобразование для примера
                        {...(label.checked ? { checked: label.checked } : {})}
                        onChange={label.function ? (e) => {
                          label.function();
                          handleSubjectChange(e);
                        } : handleSubjectChange}
                      />
                      {label.title}
                    </label>
                  </li>
                ))}
              </ul>
              <button className={`${globalStyles.btn_reset} ${globalStyles.products_choice__subjects_btn}`} onClick={() => openSubjectsModal()}>Смотреть все 32 предмета</button>
            </div>
            <div className={globalStyles.products_choice__aside_block}>
              <h3 className={globalStyles.products_choice__aside_title}>Выберите класс</h3>
              <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__aside_list}`}>
                {[
                  {
                    title: 'Вузовские олимпиады',
                    filter: 12
                  },
                  {
                    title: 'Для 1 класса',
                    filter: 1
                  },
                  {
                    title: 'Для 2 класса',
                    filter: 2
                  },
                  {
                    title: 'Для 3 класса',
                    filter: 3
                  },
                  {
                    title: 'Для 4 класса',
                    filter: 4
                  },
                  {
                    title: 'Для 5 класса',
                    filter: 5
                  },
                  {
                    title: 'Для 6 класса',
                    filter: 6
                  },
                  {
                    title: 'Для 7 класса',
                    filter: 7
                  },
                  {
                    title: 'Для 8 класса',
                    filter: 8
                  },
                  {
                    title: 'Для 9 класса',
                    filter: 9
                  },
                  {
                    title: 'Для 10 класса',
                    filter: 10
                  },
                  {
                    title: 'Для 11 класса',
                    filter: 11
                  },
                ].map((label, index) => (
                  <li key={index} className={globalStyles.products_choice__aside_item}>
                    <label className={globalStyles.products_choice__aside_label}>
                      <input
                        type="checkbox"
                        value={label.filter} // Преобразование для примера
                        onChange={handleGradeChange}
                      />
                      {label.title}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className={globalStyles.products_choice__tests}>
            <div className={globalStyles.products_choice__tests_search}>
              <form className={`${globalStyles.search} ${globalStyles.products_choice__search}`} onSubmit={handleSearchSubmit}>
                <input className={globalStyles.search__input} type="text" placeholder="Поиск" value={searchQuery} onChange={handleSearchInputChange} />
                <button className={`${globalStyles.btn_reset} ${globalStyles.search__btn}`}></button>
              </form>
              <div className={globalStyles.products_choice__tests_results}>
                Найдено всего <span>{olympiads?.count} теста</span>
              </div>
            </div>
            <div className={globalStyles.products_choice__filters_wrapper}>
              <span>Отфильтровать олимпиады</span>
              <button className={globalStyles.btn_reset}
                onClick={() => setIsFiltersModalOpen(true)}
              >
                <svg width="42" height="35" viewBox="0 0 42 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28.4778 34.951C27.5989 34.951 26.7951 34.7313 26.0662 34.2919C25.3481 33.8632 24.7747 33.2844 24.346 32.5556C23.9173 31.8375 23.7029 31.039 23.7029 30.1601C23.7029 29.292 23.9173 28.4935 24.346 27.7647C24.7747 27.0359 25.3481 26.4571 26.0662 26.0284C26.7951 25.5997 27.5989 25.3853 28.4778 25.3853C29.3566 25.3853 30.1551 25.5997 30.8732 26.0284C31.602 26.4571 32.1808 27.0359 32.6095 27.7647C33.0489 28.4935 33.2687 29.292 33.2687 30.1601C33.2687 31.039 33.0489 31.8375 32.6095 32.5556C32.1808 33.2844 31.602 33.8632 30.8732 34.2919C30.1551 34.7313 29.3566 34.951 28.4778 34.951ZM28.4778 32.6681C29.1851 32.6681 29.78 32.4216 30.2623 31.9286C30.7446 31.4463 30.9858 30.8568 30.9858 30.1601C30.9858 29.4528 30.7446 28.8579 30.2623 28.3756C29.78 27.8933 29.1851 27.6521 28.4778 27.6521C27.7811 27.6521 27.1916 27.8933 26.7093 28.3756C26.227 28.8579 25.9859 29.4528 25.9859 30.1601C25.9859 30.8568 26.227 31.4463 26.7093 31.9286C27.1916 32.4216 27.7811 32.6681 28.4778 32.6681ZM25.1659 28.7293V31.5749H1.58123C1.17395 31.5749 0.830976 31.4356 0.552311 31.1569C0.284364 30.889 0.150391 30.5567 0.150391 30.1601C0.150391 29.7636 0.284364 29.426 0.552311 29.1473C0.830976 28.8686 1.17395 28.7293 1.58123 28.7293H25.1659ZM40.1335 28.7293C40.4979 28.7293 40.8141 28.8686 41.082 29.1473C41.3607 29.426 41.5 29.7636 41.5 30.1601C41.5 30.5567 41.3607 30.889 41.082 31.1569C40.8141 31.4356 40.4979 31.5749 40.1335 31.5749H32.0307V28.7293H40.1335ZM13.5745 22.2664C12.7064 22.2664 11.9079 22.0521 11.1791 21.6233C10.4503 21.1946 9.87151 20.6212 9.4428 19.9031C9.01408 19.1743 8.79973 18.3705 8.79973 17.4916C8.79973 16.6127 9.01408 15.8142 9.4428 15.0961C9.87151 14.3673 10.4503 13.7886 11.1791 13.3598C11.9079 12.9204 12.7064 12.7007 13.5745 12.7007C14.4534 12.7007 15.2519 12.9204 15.97 13.3598C16.6988 13.7886 17.2776 14.3673 17.7063 15.0961C18.1457 15.8142 18.3654 16.6127 18.3654 17.4916C18.3654 18.3705 18.1457 19.1743 17.7063 19.9031C17.2776 20.6212 16.6988 21.1946 15.97 21.6233C15.2519 22.0521 14.4534 22.2664 13.5745 22.2664ZM13.5745 19.9996C14.2819 19.9996 14.8768 19.7584 15.3591 19.2761C15.8414 18.7831 16.0825 18.1829 16.0825 17.4755C16.0825 16.7681 15.8414 16.1733 15.3591 15.691C14.8768 15.2087 14.2819 14.9675 13.5745 14.9675C12.8779 14.9675 12.2884 15.2087 11.8061 15.691C11.3238 16.1733 11.0826 16.7681 11.0826 17.4755C11.0826 18.1829 11.3238 18.7831 11.8061 19.2761C12.2884 19.7584 12.8779 19.9996 13.5745 19.9996ZM1.51692 16.0608H10.0698V18.9064H1.51692C1.1418 18.9064 0.820259 18.767 0.552311 18.4884C0.284364 18.2097 0.150391 17.8721 0.150391 17.4755C0.150391 17.079 0.284364 16.7467 0.552311 16.4788C0.820259 16.2001 1.1418 16.0608 1.51692 16.0608ZM40.0692 16.0608C40.4657 16.0608 40.8033 16.2001 41.082 16.4788C41.3607 16.7467 41.5 17.079 41.5 17.4755C41.5 17.8721 41.3607 18.2097 41.082 18.4884C40.8033 18.767 40.4657 18.9064 40.0692 18.9064H16.9024V16.0608H40.0692ZM28.4778 9.56571C27.5989 9.56571 26.7951 9.35136 26.0662 8.92264C25.3481 8.48321 24.7747 7.90444 24.346 7.18634C23.9173 6.45753 23.7029 5.65369 23.7029 4.77482C23.7029 3.90667 23.9173 3.10819 24.346 2.37937C24.7747 1.65055 25.3481 1.07179 26.0662 0.643073C26.7951 0.214358 27.5989 0 28.4778 0C29.3566 0 30.1551 0.214358 30.8732 0.643073C31.602 1.07179 32.1808 1.65055 32.6095 2.37937C33.0489 3.10819 33.2687 3.90667 33.2687 4.77482C33.2687 5.65369 33.0489 6.45753 32.6095 7.18634C32.1808 7.90444 31.602 8.48321 30.8732 8.92264C30.1551 9.35136 29.3566 9.56571 28.4778 9.56571ZM28.4778 7.2828C29.1851 7.2828 29.78 7.04165 30.2623 6.55935C30.7446 6.06632 30.9858 5.47148 30.9858 4.77482C30.9858 4.06744 30.7446 3.4726 30.2623 2.99029C29.78 2.50799 29.1851 2.26683 28.4778 2.26683C27.7811 2.26683 27.1916 2.50799 26.7093 2.99029C26.227 3.4726 25.9859 4.06744 25.9859 4.77482C25.9859 5.47148 26.227 6.06632 26.7093 6.55935C27.1916 7.04165 27.7811 7.2828 28.4778 7.2828ZM25.2142 3.37613V6.22173H1.58123C1.17395 6.22173 0.830976 6.08776 0.552311 5.81981C0.284364 5.54115 0.150391 5.20353 0.150391 4.80697C0.150391 4.41041 0.284364 4.0728 0.552311 3.79413C0.830976 3.51547 1.17395 3.37613 1.58123 3.37613H25.2142ZM40.1335 3.37613C40.4979 3.37613 40.8141 3.51547 41.082 3.79413C41.3607 4.0728 41.5 4.41041 41.5 4.80697C41.5 5.20353 41.3607 5.54115 41.082 5.81981C40.8141 6.08776 40.4979 6.22173 40.1335 6.22173H31.8539V3.37613H40.1335Z" fill="#4F75FE" />
                </svg>
              </button>
            </div>
            <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__list}`}>
              {olympiads?.results.map(item => (
                <li className={globalStyles.products_choice__item} key={item.id}>
                  <h3 className={globalStyles.products_choice__item_title}>{item.title}</h3>
                  <p className={globalStyles.products_choice__item_descr}>{item.description}</p>
                  <button
                    className={`${globalStyles.btn_reset} ${globalStyles.button} ${globalStyles.products_choice__item_btn}`}
                    onClick={() => openModal(item.id)}
                  >
                    Начать тест
                  </button>
                </li>
              ))}
            </ul>

            <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${globalStyles.products_choice__tests_btn_all}`} onClick={() => {
              window.location.href = '/olympiads#olympiadsChoice';
              setTimeout(() => {
                window.location.reload();
              }, 50);
            }}>Загрузить ещё тесты</button>

            {olympiads?.total_pages && olympiads?.total_pages > 1 ? (
              <div className={globalStyles.products_choice__tests_pagination}>

                {Array.from({ length: olympiads?.total_pages }, (_, index) => (
                  <Link
                    to="olympiadsChoice"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    <span
                      key={index}
                      className={index === currentPaginationPage ? globalStyles.products_choice__tests_pagination_active : ''}
                      onClick={() => handlePaginationClick(index)}
                    >
                      {index + 1}
                    </span>
                  </Link>
                ))}

              </div>
            ) : ('')}

          </div>
        </div>
      </div>

      <ModalComponent
        isOpen={isFirstModalOpen}
        onRequestClose={closeModal}
        content={
          modalContent && (
            <div className={styles.modal_olympiad}>
              <h2 className={styles.modal_olympiad__title}>{modalContent.title}</h2>
              {isTestCompleted ? (
                <div>
                  <p className={`${styles.modal_olympiad__results_descr} ${styles.modal_olympiad__results_descr_margin}`}>Правильных ответов: {getResults().correctAnswersCount} из {getResults().totalQuestions}</p>
                  <p className={`${styles.modal_olympiad__results_descr} ${styles.modal_olympiad__results_descr_bold} ${styles.modal_olympiad__results_descr_margin}`}>Время прохождения теста: {getResults().timeSpent}</p>
                  <div className={styles.modal_olympiad__results_title}>Вы набрали {getResults().correctAnswersCount} из {getResults().totalQuestions} баллов ({getResults().percentage.toFixed(2)}%)</div>
                  <p className={`${styles.modal_olympiad__results_descr} ${styles.modal_olympiad__results_descr_margin} ${styles.modal_olympiad__results_descr_center}`}>Поздравляем с прохождением олимпиады, Вы можете заказать изготовление персонального диплома участника олимпиады!</p>
                  <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.modal_olympiad__results_btn}`}
                    onClick={() => handleLinkClick("/cab-issue")}
                  >Получить диплом</button>
                </div>
              ) : (
                <>
                  <ul className={`${globalStyles.list_reset} ${styles.modal_olympiad__questions}`}>
                    {modalContent.questions.map((_, index) => (
                      <li
                        key={index}
                        className={`${styles.modal_olympiad__question} ${questionsStatus[index] === true
                          ? styles.modal_olympiad__question_green
                          : questionsStatus[index] === false
                            ? styles.modal_olympiad__question_red
                            : ''
                          }`}
                      >
                        {index + 1}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.modal_olympiad__text}>
                    <div className={styles.modal_olympiad__question_num}>Вопрос {currentQuestionIndex + 1}</div>
                    <div className={styles.modal_olympiad__question_text}>{modalContent.questions[currentQuestionIndex].question}</div>
                    <div className={styles.modal_olympiad__question_choice}>Выберите вариант ответа</div>
                    <ul className={`${globalStyles.list_reset} ${styles.modal_olympiad__questions_list}`}>
                      {modalContent.questions[currentQuestionIndex].answers.map((answer, index) => (
                        <li
                          key={index}
                          className={`${styles.modal_olympiad__questions_item} ${checkedAnswers[currentQuestionIndex]?.includes(answer.title)
                            ? answer.is_correct
                              ? styles.modal_olympiad__questions_item_green
                              : styles.modal_olympiad__questions_item_red
                            : isAnswerChecked && answer.is_correct
                              ? styles.modal_olympiad__questions_item_green
                              : ''
                            }`}
                        >
                          <label className={styles.modal_olympiad__question_label}>
                            <input
                              type="checkbox"
                              value={answer.title}
                              onChange={handleAnswerChange}
                              checked={selectedAnswers.includes(answer.title)}
                              disabled={isAnswerChecked}
                            />
                            {answer.title}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>



                  <div className={styles.modal_olympiad__btns}>
                    {skippedFlag ? (
                      <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.modal_olympiad__btn_skip}`} onClick={skipQuestion}>Пропустить вопрос</button>
                    ) : ('')}
                    {isAnswerChecked ? (
                      <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.modal_olympiad__btn}`} onClick={nextQuestion}>Следующий вопрос</button>
                    ) : (
                      <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.modal_olympiad__btn}`} onClick={checkAnswer}>Проверить ответ</button>
                    )}
                  </div>

                </>
              )}
            </div>
          )
        }
        customClassName={modalStyles.modalContent_olympiad}
      />

      <ModalComponent
        isOpen={isSubjectsModalOpen}
        onRequestClose={closeSubjectsModal}
        content={
          <div className={globalStyles.products_choice__subjects_modal_content}>
            <h3 className={globalStyles.products_choice__aside_title}>Предметы</h3>

            <div className={globalStyles.products_choice__subjects_modal_list_wrapper}>
              <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__subjects_modal_list}`}>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>А</span>
                    <input
                      type="checkbox"
                      value={'ENGLISH_LANGUAGE'}
                      checked={isEnChecked}
                      onChange={(e) => {
                        setIsEnChecked(!isEnChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Английский язык
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>Б</span>
                    <input
                      type="checkbox"
                      value={'LIBRARY'}
                      checked={isLibraryChecked}
                      onChange={(e) => {
                        setIsLibraryChecked(!isLibraryChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Библиотечное дело
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'BIOLOGY'}
                      checked={isBiologyChecked}
                      onChange={(e) => {
                        setIsBiologyChecked(!isBiologyChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Биология
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>В</span>
                    <input
                      type="checkbox"
                      value={'EDUCATIONAL_WORK'}
                      checked={isEducationalWorkChecked}
                      onChange={(e) => {
                        setIsEducationalWorkChecked(!isEducationalWorkChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Воспитательная работа
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>Г</span>
                    <input
                      type="checkbox"
                      value={'GEOGRAPHY'}
                      checked={isGeographyChecked}
                      onChange={(e) => {
                        setIsGeographyChecked(!isGeographyChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    География
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>Д</span>
                    <input
                      type="checkbox"
                      value={'ADDITIONAL_EDUCATION'}
                      checked={isAdditionalEducationChecked}
                      onChange={(e) => {
                        setIsAdditionalEducationChecked(!isAdditionalEducationChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Доп. образование
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'PRESCHOOL_EDUCATION'}
                      checked={isPreschoolEducationChecked}
                      onChange={(e) => {
                        setIsPreschoolEducationChecked(!isPreschoolEducationChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Дошкольное образование
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>И</span>
                    <input
                      type="checkbox"
                      value={'ART'}
                      checked={isArtChecked}
                      onChange={(e) => {
                        setIsArtChecked(!isArtChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    ИЗО
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'FOREIGN_LANGUAGES'}
                      checked={isForeignChecked}
                      onChange={(e) => {
                        setIsForeignChecked(!isForeignChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Иностранные языки
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'COMPUTER_SCIENCE'}
                      checked={isComputerChecked}
                      onChange={(e) => {
                        setIsComputerChecked(!isComputerChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Информатика
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'HISTORY'}
                      checked={isHistoryChecked}
                      onChange={(e) => {
                        setIsHistoryChecked(!isHistoryChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    История
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>К</span>
                    <input
                      type="checkbox"
                      value={'CLASS_MANAGEMENT'}
                      checked={isClassChecked}
                      onChange={(e) => {
                        setIsClassChecked(!isClassChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Классное руководство
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>М</span>
                    <input
                      type="checkbox"
                      value={'MHK'}
                      checked={isMHKChecked}
                      onChange={(e) => {
                        setIsMHKChecked(!isMHKChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    МХК
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'MATHS'}
                      checked={isMathsChecked}
                      onChange={(e) => {
                        setIsMathsChecked(!isMathsChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Математика
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'MUSIC'}
                      checked={isMusicChecked}
                      onChange={(e) => {
                        setIsMusicChecked(!isMusicChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Музыка
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>Н</span>
                    <input
                      type="checkbox"
                      value={'PRIMARY_CLASSES'}
                      checked={isPrimaryChecked}
                      onChange={(e) => {
                        setIsPrimaryChecked(!isPrimaryChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Начальные классы
                  </label>
                </li>
              </ul>
              <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__subjects_modal_list}`}>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>О</span>
                    <input
                      type="checkbox"
                      value={'LIFE_SAFETY'}
                      checked={isLifeChecked}
                      onChange={(e) => {
                        setIsLifeChecked(!isLifeChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    ОБЖ
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'SPECIAL_EDUCATION'}
                      checked={isSpecialChecked}
                      onChange={(e) => {
                        setIsSpecialChecked(!isSpecialChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Обучение детей с ОВЗ
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'SOCIAL_SCIENCE'}
                      checked={isSocialChecked}
                      onChange={(e) => {
                        setIsSocialChecked(!isSocialChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Обществознание
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'ENVIRONMENTAL_STUDIES'}
                      checked={isEnviromentChecked}
                      onChange={(e) => {
                        setIsEnviromentChecked(!isEnviromentChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Окружающий мир
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'RELIGIOUS_CULTURES'}
                      checked={isReligiousChecked}
                      onChange={(e) => {
                        setIsReligiousChecked(!isReligiousChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Основы религиозных культур
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'LABOR_SAFETY'}
                      checked={isLaborChecked}
                      onChange={(e) => {
                        setIsLaborChecked(!isLaborChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Охрана труда
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>П</span>
                    <input
                      type="checkbox"
                      value={'LAW'}
                      checked={isLawChecked}
                      onChange={(e) => {
                        setIsLawChecked(!isLawChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Право
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>Р</span>
                    <input
                      type="checkbox"
                      value={'RUSSIAN_LITERATURE'}
                      checked={isLiteratureChecked}
                      onChange={(e) => {
                        setIsLiteratureChecked(!isLiteratureChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Русская литература
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'RUSSIAN_LANGUAGE'}
                      checked={isRusChecked}
                      onChange={(e) => {
                        setIsRusChecked(!isRusChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Русский язык
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>С</span>
                    <input
                      type="checkbox"
                      value={'SOCIAL_PEDAGOGY'}
                      checked={isPedagogyChecked}
                      onChange={(e) => {
                        setIsPedagogyChecked(!isPedagogyChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Социальному педагогу
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>Т</span>
                    <input
                      type="checkbox"
                      value={'TECHNOLOGY'}
                      checked={isTechnologyChecked}
                      onChange={(e) => {
                        setIsTechnologyChecked(!isTechnologyChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Технология
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>Ф</span>
                    <input
                      type="checkbox"
                      value={'PHYSICS'}
                      checked={isPhysicsChecked}
                      onChange={(e) => {
                        setIsPhysicsChecked(!isPhysicsChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Физика
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <input
                      type="checkbox"
                      value={'PHYSICAL_CULTURE'}
                      checked={isPhysicalChecked}
                      onChange={(e) => {
                        setIsPhysicalChecked(!isPhysicalChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Физкультура
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>Х</span>
                    <input
                      type="checkbox"
                      value={'CHEMISTRY'}
                      checked={isChemistryChecked}
                      onChange={(e) => {
                        setIsChemistryChecked(!isChemistryChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Химия
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>Ш</span>
                    <input
                      type="checkbox"
                      value={'SCHOOL_PSYCHOLOGIST'}
                      checked={isPsychologistChecked}
                      onChange={(e) => {
                        setIsPsychologistChecked(!isPsychologistChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Школьному психологу
                  </label>
                </li>
                <li className={globalStyles.products_choice__aside_item}>
                  <label className={`${globalStyles.products_choice__aside_label} ${globalStyles.products_choice__subjects_label}`}>
                    <span>Э</span>
                    <input
                      type="checkbox"
                      value={'ECONOMICS'}
                      checked={isEconomicsChecked}
                      onChange={(e) => {
                        setIsEconomicsChecked(!isEconomicsChecked);
                        handleSubjectChange(e)
                      }}
                    />
                    Экономика
                  </label>
                </li>
              </ul>
            </div>
          </div>
        }
        customClassName={globalStyles.products_choice__subjects_modal}
      />

      <ModalComponent
        isOpen={isFiltersModalOpen}
        onRequestClose={() => setIsFiltersModalOpen(false)}
        content={
          <aside className={`${globalStyles.products_choice__aside} ${globalStyles.products_choice__aside_adaptive}`}>
            <div className={globalStyles.products_choice__aside_block}>
              <h3 className={globalStyles.products_choice__aside_title}>Выберите для кого</h3>
              <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__aside_list}`}>
                {[
                  {
                    title: 'Для воспитателей',
                    filter: 'KINDERGARTENER'
                  },
                  {
                    title: 'Для учителей',
                    filter: 'TEACHERS'
                  },
                  {
                    title: 'Для дошкольников',
                    filter: 'PRESCHOOLERS'
                  },
                  {
                    title: 'Для школьников',
                    filter: 'PUPILS'
                  },
                  {
                    title: 'Для студентов',
                    filter: 'STUDENTS'
                  },
                ].map((label, index) => (
                  <li key={index} className={globalStyles.products_choice__aside_item}>
                    <label className={globalStyles.products_choice__aside_label}>
                      <input
                        type="checkbox"
                        value={label.filter} // Преобразование для примера
                        onChange={handleForWhomChange}
                      />
                      {label.title}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className={globalStyles.products_choice__aside_block}>
              <h3 className={globalStyles.products_choice__aside_title}>Выберите предмет</h3>
              <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__aside_list}`}>
                {[
                  {
                    title: 'Математика',
                    filter: 'MATHS',
                    checked: isMathsChecked,
                    function: () => {
                      setIsMathsChecked(!isMathsChecked);
                    }
                  },
                  {
                    title: 'Русский язык',
                    filter: 'RUSSIAN_LANGUAGE',
                    checked: isRusChecked,
                    function: () => {
                      setIsRusChecked(!isRusChecked);
                    }
                  },
                  {
                    title: 'Английский язык',
                    filter: 'ENGLISH_LANGUAGE',
                    checked: isEnChecked,
                    function: () => {
                      setIsEnChecked(!isEnChecked);
                    }
                  },
                  {
                    title: 'Музыка',
                    filter: 'MUSIC',
                    checked: isMusicChecked,
                    function: () => {
                      setIsMusicChecked(!isMusicChecked);
                    }
                  },
                  {
                    title: 'История',
                    filter: 'HISTORY',
                    checked: isHistoryChecked,
                    function: () => {
                      setIsHistoryChecked(!isHistoryChecked);
                    }
                  },
                  {
                    title: 'Физкультура',
                    filter: 'PHYSICAL_CULTURE',
                    checked: isPhysicalChecked,
                    function: () => {
                      setIsPhysicalChecked(!isPhysicalChecked);
                    }
                  },
                ].map((label, index) => (
                  <li key={index} className={globalStyles.products_choice__aside_item}>
                    <label className={globalStyles.products_choice__aside_label}>
                      <input
                        type="checkbox"
                        value={label.filter} // Преобразование для примера
                        {...(label.checked ? { checked: label.checked } : {})}
                        onChange={label.function ? (e) => {
                          label.function();
                          handleSubjectChange(e);
                        } : handleSubjectChange}
                      />
                      {label.title}
                    </label>
                  </li>
                ))}
              </ul>
              <button className={`${globalStyles.btn_reset} ${globalStyles.products_choice__subjects_btn}`} onClick={() => {
                setIsFiltersModalOpen(false);
                openSubjectsModal();
              }}>Смотреть все 32 предмета</button>
            </div>
            <div className={globalStyles.products_choice__aside_block}>
              <h3 className={globalStyles.products_choice__aside_title}>Выберите класс</h3>
              <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__aside_list}`}>
                {[
                  {
                    title: 'Вузовские олимпиады',
                    filter: 12
                  },
                  {
                    title: 'Для 1 класса',
                    filter: 1
                  },
                  {
                    title: 'Для 2 класса',
                    filter: 2
                  },
                  {
                    title: 'Для 3 класса',
                    filter: 3
                  },
                  {
                    title: 'Для 4 класса',
                    filter: 4
                  },
                  {
                    title: 'Для 5 класса',
                    filter: 5
                  },
                  {
                    title: 'Для 6 класса',
                    filter: 6
                  },
                  {
                    title: 'Для 7 класса',
                    filter: 7
                  },
                  {
                    title: 'Для 8 класса',
                    filter: 8
                  },
                  {
                    title: 'Для 9 класса',
                    filter: 9
                  },
                  {
                    title: 'Для 10 класса',
                    filter: 10
                  },
                  {
                    title: 'Для 11 класса',
                    filter: 11
                  },
                ].map((label, index) => (
                  <li key={index} className={globalStyles.products_choice__aside_item}>
                    <label className={globalStyles.products_choice__aside_label}>
                      <input
                        type="checkbox"
                        value={label.filter} // Преобразование для примера
                        onChange={handleGradeChange}
                      />
                      {label.title}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <button className={`${globalStyles.btn_reset} ${globalStyles.products_choice__aside_filters_show}`}>Показать {olympiads?.count} тестов</button>
          </aside>
        }
        customClassName={globalStyles.products_choice__filters_modal}
      />
    </section>
  );
};

export default OlympiadsChoice;
