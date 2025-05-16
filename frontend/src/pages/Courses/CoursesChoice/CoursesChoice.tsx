import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from '../../../context/AuthContext';

import { Link } from 'react-scroll';

import globalStyles from '../../../App.module.sass';
import styles from './CoursesChoice.module.sass';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import ModalComponent from '../../../components/ModalComponent/ModalComponent';

interface ICoursesVariations {
  id: number;
  display_name: string;
  base_price: string;
  discount_percentage: string;
  hour_coefficients: IHours[];
}

interface IHours {
  number_of_hours: string;
}

interface ICourses {
  count: number;
  total_pages: number;
  results: ICoursesInf[];
}

interface ICoursesInf {
  id: number;
  variation: number;
  title: string;
  short_description: string;
  image: string;
}

interface CoursesChoiceProps {
  setModalOpen: (state: boolean) => void;
}

const CoursesChoice: React.FC<CoursesChoiceProps> = ({ setModalOpen }) => {

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { isAuthenticated } = authContext;

  const [coursesVariations, setCoursesVariations] = useState<ICoursesVariations[]>([]);
  const [courses, setCourses] = useState<ICourses | null>(null);

  const [variationFiltersFlag, setVariationFiltersFlag] = useState(true);

  const [variationFilters, setVariationFilters] = useState<string[]>([]);
  const [subjectFilters, setSubjectFilters] = useState<string[]>([]);
  const [hoursFilters, setHoursFilters] = useState<string[]>([]);
  const [educationFilters, setEducationFilters] = useState<string[]>([]);

  const [maxPriceFilters, setMaxPriceFilters] = useState(100000);
  const [tempMaxPrice, setTempMaxPrice] = useState(100000);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

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

  const navigate = useNavigate();
  const location = useLocation();

  const [currentPaginationPage, setCurrentPaginationPage] = useState(0);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchCoursesVariations = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/courses/variations`);
        const data = await response.json();
        setCoursesVariations(data.results);
      } catch (error) {
        console.error('Error fetching courses variations:', error);
      }
    };

    fetchCoursesVariations();
  }, [apiBaseUrl]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const variation = queryParams.get('variation');

    if (variation) {
      setVariationFilters([variation]);
    }

    setVariationFiltersFlag(false);
    // Добавьте другие фильтры, если они могут быть установлены из queryParams.
  }, [location.search]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams();
        params.append('price_gte', '230');
        params.append('price_lte', maxPriceFilters.toString());
        variationFilters.forEach(filter => params.append('variation', filter));
        subjectFilters.forEach(filter => params.append('subject', filter));
        hoursFilters.forEach(filter => params.append('number_of_hours', filter));
        educationFilters.forEach(filter => params.append('education_degree', filter));

        if (searchQuery) {
          params.append('title', searchQuery);
        }

        params.append('page', `${currentPaginationPage + 1}`);

        const response = await fetch(`${apiBaseUrl}/api/v1/courses/?${params.toString()}`);
        const data: ICourses = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    // Только если variationFiltersFlag сброшен, можно отправить запрос
    if (!variationFiltersFlag) {
      fetchCourses();
    }
  }, [maxPriceFilters, variationFilters, subjectFilters, hoursFilters, educationFilters, searchQuery, currentPaginationPage, variationFiltersFlag]);




  const handleVariationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetPagination();
    const { value, checked } = event.target;
    setVariationFilters(prevFilters => {
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

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetPagination();
    const { value, checked } = event.target;
    setHoursFilters(prevFilters => {
      if (checked) {
        return [...prevFilters, value];
      } else {
        return prevFilters.filter(filter => filter !== value);
      }
    });
  };

  const handleEducationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetPagination();
    const { value, checked } = event.target;
    setEducationFilters(prevFilters => {
      if (checked) {
        return [...prevFilters, value];
      } else {
        return prevFilters.filter(filter => filter !== value);
      }
    });
  };

  const handleMaxPriceChange = (val) => {
    setTempMaxPrice(Number(val));
  };

  const handleMaxPriceChangeComplete = (val) => {
    resetPagination();
    setMaxPriceFilters(val);
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

  const openModal = () => {
    setIsFirstModalOpen(true);
  };

  const closeModal = () => {
    setIsFirstModalOpen(false);
  };

  const handlePaginationClick = (index: number) => {
    setCurrentPaginationPage(index);
  };

  const resetPagination = () => {
    setCurrentPaginationPage(0);
  };

  return (
    <section className={globalStyles.products_choice}>
      <h2 className={`${globalStyles.title} ${globalStyles.products_choice__title}`}>Найдите необходимые вам курсы и получите престижные документы</h2>
      <div className={globalStyles.products_choice__content}>
        <aside className={globalStyles.products_choice__aside}>
          <div className={globalStyles.products_choice__aside_block}>
            <h3 className={globalStyles.products_choice__aside_title}>Тип курса</h3>
            <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__aside_list}`}>
              {coursesVariations.map((variation, index) => (
                <li key={index} className={globalStyles.products_choice__aside_item}>
                  <label className={globalStyles.products_choice__aside_label}>
                    <input
                      type="checkbox"
                      value={variation.id.toString()}
                      onChange={handleVariationChange}
                      checked={variationFilters.includes(variation.id.toString())} // Устанавливаем чекбокс как выбранный, если значение в фильтрах
                    />
                    {variation.display_name}
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
            <button className={`${globalStyles.btn_reset} ${globalStyles.products_choice__subjects_btn}`} onClick={() => openModal()}>Смотреть все 32 предмета</button>
          </div>
          <div className={globalStyles.products_choice__aside_block}>
            <h3 className={globalStyles.products_choice__aside_title}>Выберите количество часов</h3>
            <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__aside_list} ${styles.courses_choice__filter_hours}`}>
              {[
                {
                  title: '2 ч.',
                  filter: 2
                },
                {
                  title: '108 ч.',
                  filter: 108
                },
                {
                  title: '3 ч.',
                  filter: 3
                },
                {
                  title: '144 ч.',
                  filter: 144
                },
                {
                  title: '4 ч.',
                  filter: 4
                },
                {
                  title: '180 ч.',
                  filter: 180
                },
                {
                  title: '5 ч.',
                  filter: 5
                },
                {
                  title: '300 ч.',
                  filter: 300
                },
                {
                  title: '6 ч.',
                  filter: 6
                },
                {
                  title: '500 ч.',
                  filter: 500
                },
                {
                  title: '7 ч.',
                  filter: 7
                },
                {
                  title: '600 ч.',
                  filter: 600
                },
                {
                  title: '8 ч.',
                  filter: 8
                },
                {
                  title: '900 ч.',
                  filter: 900
                },
                {
                  title: '10 ч.',
                  filter: 10
                },
                {
                  title: '1000 ч.',
                  filter: 1000
                },
                {
                  title: '36 ч.',
                  filter: 36
                },
                {
                  title: '1200 ч.',
                  filter: 1200
                },
                {
                  title: '72 ч.',
                  filter: 72
                },
                {
                  title: '1500 ч.',
                  filter: 1500
                },
              ].map((label, index) => (
                <li key={index} className={globalStyles.products_choice__aside_item}>
                  <label className={globalStyles.products_choice__aside_label}>
                    <input
                      type="checkbox"
                      value={label.filter} // Преобразование для примера
                      onChange={handleHoursChange}
                    />
                    {label.title}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className={globalStyles.products_choice__aside_block}>
            <h3 className={globalStyles.products_choice__aside_title}>Выберите стоимость курса</h3>

            <div className={styles.courses_choice__filter_price}>
              <span>от 230 руб</span>
              <span>до {tempMaxPrice} руб</span>
            </div>

            <Slider
              min={230}
              max={100000}
              defaultValue={maxPriceFilters}
              onChange={handleMaxPriceChange}
              onChangeComplete={handleMaxPriceChangeComplete}
              step={1000}
              styles={{
                rail: { backgroundColor: '#F2F2F2', height: 8 },
                track: { backgroundColor: '#FF662C', height: 8, borderRadius: 'initial' },
                handle: {
                  height: 24,
                  width: 24,
                  marginLeft: -2,
                  marginTop: -8,
                  backgroundColor: '#fff',
                  border: '2.01985px solid #F2F2F2',
                  boxShadow: '0px 8.07939px 24.2382px rgba(0, 0, 0, 0.36)',
                  opacity: 1,
                },
              }}
            />
          </div>
          <div className={globalStyles.products_choice__aside_block}>
            <h3 className={globalStyles.products_choice__aside_title}>Выберите Ваше образование</h3>
            <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__aside_list}`}>
              {[
                {
                  title: 'Высшее',
                  filter: 'HIGHER'
                },
                {
                  title: 'Среднее профессиональное',
                  filter: 'SECONDARY'
                },
              ].map((label, index) => (
                <li key={index} className={globalStyles.products_choice__aside_item}>
                  <label className={globalStyles.products_choice__aside_label}>
                    <input
                      type="checkbox"
                      value={label.filter} // Преобразование для примера
                      onChange={handleEducationChange}
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
              Найдено всего <span>{courses?.count} курса</span>
            </div>
          </div>
          <div className={globalStyles.products_choice__filters_wrapper}>
            <span>Отфильтровать курсы</span>
            <button className={globalStyles.btn_reset}
              onClick={() => setIsFiltersModalOpen(true)}
            >
              <svg width="42" height="35" viewBox="0 0 42 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.4778 34.951C27.5989 34.951 26.7951 34.7313 26.0662 34.2919C25.3481 33.8632 24.7747 33.2844 24.346 32.5556C23.9173 31.8375 23.7029 31.039 23.7029 30.1601C23.7029 29.292 23.9173 28.4935 24.346 27.7647C24.7747 27.0359 25.3481 26.4571 26.0662 26.0284C26.7951 25.5997 27.5989 25.3853 28.4778 25.3853C29.3566 25.3853 30.1551 25.5997 30.8732 26.0284C31.602 26.4571 32.1808 27.0359 32.6095 27.7647C33.0489 28.4935 33.2687 29.292 33.2687 30.1601C33.2687 31.039 33.0489 31.8375 32.6095 32.5556C32.1808 33.2844 31.602 33.8632 30.8732 34.2919C30.1551 34.7313 29.3566 34.951 28.4778 34.951ZM28.4778 32.6681C29.1851 32.6681 29.78 32.4216 30.2623 31.9286C30.7446 31.4463 30.9858 30.8568 30.9858 30.1601C30.9858 29.4528 30.7446 28.8579 30.2623 28.3756C29.78 27.8933 29.1851 27.6521 28.4778 27.6521C27.7811 27.6521 27.1916 27.8933 26.7093 28.3756C26.227 28.8579 25.9859 29.4528 25.9859 30.1601C25.9859 30.8568 26.227 31.4463 26.7093 31.9286C27.1916 32.4216 27.7811 32.6681 28.4778 32.6681ZM25.1659 28.7293V31.5749H1.58123C1.17395 31.5749 0.830976 31.4356 0.552311 31.1569C0.284364 30.889 0.150391 30.5567 0.150391 30.1601C0.150391 29.7636 0.284364 29.426 0.552311 29.1473C0.830976 28.8686 1.17395 28.7293 1.58123 28.7293H25.1659ZM40.1335 28.7293C40.4979 28.7293 40.8141 28.8686 41.082 29.1473C41.3607 29.426 41.5 29.7636 41.5 30.1601C41.5 30.5567 41.3607 30.889 41.082 31.1569C40.8141 31.4356 40.4979 31.5749 40.1335 31.5749H32.0307V28.7293H40.1335ZM13.5745 22.2664C12.7064 22.2664 11.9079 22.0521 11.1791 21.6233C10.4503 21.1946 9.87151 20.6212 9.4428 19.9031C9.01408 19.1743 8.79973 18.3705 8.79973 17.4916C8.79973 16.6127 9.01408 15.8142 9.4428 15.0961C9.87151 14.3673 10.4503 13.7886 11.1791 13.3598C11.9079 12.9204 12.7064 12.7007 13.5745 12.7007C14.4534 12.7007 15.2519 12.9204 15.97 13.3598C16.6988 13.7886 17.2776 14.3673 17.7063 15.0961C18.1457 15.8142 18.3654 16.6127 18.3654 17.4916C18.3654 18.3705 18.1457 19.1743 17.7063 19.9031C17.2776 20.6212 16.6988 21.1946 15.97 21.6233C15.2519 22.0521 14.4534 22.2664 13.5745 22.2664ZM13.5745 19.9996C14.2819 19.9996 14.8768 19.7584 15.3591 19.2761C15.8414 18.7831 16.0825 18.1829 16.0825 17.4755C16.0825 16.7681 15.8414 16.1733 15.3591 15.691C14.8768 15.2087 14.2819 14.9675 13.5745 14.9675C12.8779 14.9675 12.2884 15.2087 11.8061 15.691C11.3238 16.1733 11.0826 16.7681 11.0826 17.4755C11.0826 18.1829 11.3238 18.7831 11.8061 19.2761C12.2884 19.7584 12.8779 19.9996 13.5745 19.9996ZM1.51692 16.0608H10.0698V18.9064H1.51692C1.1418 18.9064 0.820259 18.767 0.552311 18.4884C0.284364 18.2097 0.150391 17.8721 0.150391 17.4755C0.150391 17.079 0.284364 16.7467 0.552311 16.4788C0.820259 16.2001 1.1418 16.0608 1.51692 16.0608ZM40.0692 16.0608C40.4657 16.0608 40.8033 16.2001 41.082 16.4788C41.3607 16.7467 41.5 17.079 41.5 17.4755C41.5 17.8721 41.3607 18.2097 41.082 18.4884C40.8033 18.767 40.4657 18.9064 40.0692 18.9064H16.9024V16.0608H40.0692ZM28.4778 9.56571C27.5989 9.56571 26.7951 9.35136 26.0662 8.92264C25.3481 8.48321 24.7747 7.90444 24.346 7.18634C23.9173 6.45753 23.7029 5.65369 23.7029 4.77482C23.7029 3.90667 23.9173 3.10819 24.346 2.37937C24.7747 1.65055 25.3481 1.07179 26.0662 0.643073C26.7951 0.214358 27.5989 0 28.4778 0C29.3566 0 30.1551 0.214358 30.8732 0.643073C31.602 1.07179 32.1808 1.65055 32.6095 2.37937C33.0489 3.10819 33.2687 3.90667 33.2687 4.77482C33.2687 5.65369 33.0489 6.45753 32.6095 7.18634C32.1808 7.90444 31.602 8.48321 30.8732 8.92264C30.1551 9.35136 29.3566 9.56571 28.4778 9.56571ZM28.4778 7.2828C29.1851 7.2828 29.78 7.04165 30.2623 6.55935C30.7446 6.06632 30.9858 5.47148 30.9858 4.77482C30.9858 4.06744 30.7446 3.4726 30.2623 2.99029C29.78 2.50799 29.1851 2.26683 28.4778 2.26683C27.7811 2.26683 27.1916 2.50799 26.7093 2.99029C26.227 3.4726 25.9859 4.06744 25.9859 4.77482C25.9859 5.47148 26.227 6.06632 26.7093 6.55935C27.1916 7.04165 27.7811 7.2828 28.4778 7.2828ZM25.2142 3.37613V6.22173H1.58123C1.17395 6.22173 0.830976 6.08776 0.552311 5.81981C0.284364 5.54115 0.150391 5.20353 0.150391 4.80697C0.150391 4.41041 0.284364 4.0728 0.552311 3.79413C0.830976 3.51547 1.17395 3.37613 1.58123 3.37613H25.2142ZM40.1335 3.37613C40.4979 3.37613 40.8141 3.51547 41.082 3.79413C41.3607 4.0728 41.5 4.41041 41.5 4.80697C41.5 5.20353 41.3607 5.54115 41.082 5.81981C40.8141 6.08776 40.4979 6.22173 40.1335 6.22173H31.8539V3.37613H40.1335Z" fill="#4F75FE" />
              </svg>
            </button>
          </div>
          <ul className={`${globalStyles.list_reset} ${styles.courses_choice__list}`}>

            {courses?.results.map(course => {
              const courseVariation = coursesVariations.find(variationEl => variationEl.id === course.variation);
              const displayName = courseVariation ? courseVariation.display_name : '';
              const basePrice = courseVariation ? Number(courseVariation.base_price) : 0;
              const discountPercentage = courseVariation ? Number(courseVariation.discount_percentage) : 0;

              const hoursMin = courseVariation ? courseVariation.hour_coefficients[0].number_of_hours : '';
              const hoursMax = courseVariation ? courseVariation.hour_coefficients[courseVariation.hour_coefficients.length - 1].number_of_hours : '';

              const id = course.id;

              const handleLinkClick = (id: number) => {
                navigate(`/course-details/${id}`);
              };

              const handleLinkHashClick = (id: number, hash: string) => {
                navigate(`/course-details/${id}#${hash}`);
              };

              return (
                <li className={styles.courses_choice__item} key={course.id}>
                  <div className={styles.courses_choice__item_img}>
                    <div className={styles.courses_choice__item_img_text}>{displayName}</div>
                  </div>
                  <div className={styles.courses_choice__item_content}>
                    <h3 className={styles.courses_choice__item_title}>{course.title}</h3>
                    <div className={styles.courses_choice__item_hours}>{hoursMin}/{hoursMax} ч.</div>
                    <p className={styles.courses_choice__item_descr}>{course.short_description}</p>
                    <div className={styles.courses_choice__item_price_wrapper}>
                      <div className={styles.courses_choice__item_price}>
                        <span className={styles.courses_choice__item_first_price}>от <span>{basePrice} руб.</span></span>
                        <span className={styles.courses_choice__item_second_price}>{basePrice - (basePrice * discountPercentage / 100)} ₽</span>
                      </div>
                      <div className={styles.courses_choice__item_btns}>
                        <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.courses_choice__item_btn}`}
                          onClick={() => {
                            if (isAuthenticated) {
                              handleLinkHashClick(id, 'syllabuses');
                            } else {
                              setModalOpen(true);
                            }
                          }}
                        >Подать заявку</button>
                        <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.courses_choice__item_btn} ${styles.courses_choice__item_btn_red}`} onClick={() => handleLinkClick(id)}>О курсе</button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}

          </ul>

          <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${globalStyles.products_choice__tests_btn_all}`} onClick={() => {
            window.location.href = '/courses#coursesChoice';
            setTimeout(() => {
              window.location.reload();
            }, 50);
          }}>Показать больше курсов</button>

          {courses?.total_pages && courses?.total_pages > 1 ? (
            <div className={globalStyles.products_choice__tests_pagination}>

              {Array.from({ length: courses?.total_pages }, (_, index) => (
                <Link
                  to="coursesChoice"
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

      <ModalComponent
        isOpen={isFirstModalOpen}
        onRequestClose={closeModal}
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
            <div className={`${globalStyles.products_choice__aside_block} ${globalStyles.products_choice__aside_block_adaptive}`}>
              <h3 className={globalStyles.products_choice__aside_title}>Фильтры</h3>
              <button className={`${globalStyles.btn_reset} ${globalStyles.prodicts_choice__aside_filters_reset}`}>Сбросить</button>
            </div>
            <div className={globalStyles.products_choice__aside_block}>
              <h3 className={globalStyles.products_choice__aside_title}>Тип курса</h3>
              <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__aside_list}`}>
                {coursesVariations.map((variation, index) => (
                  <li key={index} className={globalStyles.products_choice__aside_item}>
                    <label className={globalStyles.products_choice__aside_label}>
                      <input
                        type="checkbox"
                        value={variation.id.toString()}
                        onChange={handleVariationChange}
                        checked={variationFilters.includes(variation.id.toString())} // Устанавливаем чекбокс как выбранный, если значение в фильтрах
                      />
                      {variation.display_name}
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
                openModal();
              }}>Смотреть все 32 предмета</button>
            </div>
            <div className={globalStyles.products_choice__aside_block}>
              <h3 className={globalStyles.products_choice__aside_title}>Выберите количество часов</h3>
              <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__aside_list} ${styles.courses_choice__filter_hours}`}>
                {[
                  {
                    title: '2 ч.',
                    filter: 2
                  },
                  {
                    title: '108 ч.',
                    filter: 108
                  },
                  {
                    title: '3 ч.',
                    filter: 3
                  },
                  {
                    title: '144 ч.',
                    filter: 144
                  },
                  {
                    title: '4 ч.',
                    filter: 4
                  },
                  {
                    title: '180 ч.',
                    filter: 180
                  },
                  {
                    title: '5 ч.',
                    filter: 5
                  },
                  {
                    title: '300 ч.',
                    filter: 300
                  },
                  {
                    title: '6 ч.',
                    filter: 6
                  },
                  {
                    title: '500 ч.',
                    filter: 500
                  },
                  {
                    title: '7 ч.',
                    filter: 7
                  },
                  {
                    title: '600 ч.',
                    filter: 600
                  },
                  {
                    title: '8 ч.',
                    filter: 8
                  },
                  {
                    title: '900 ч.',
                    filter: 900
                  },
                  {
                    title: '10 ч.',
                    filter: 10
                  },
                  {
                    title: '1000 ч.',
                    filter: 1000
                  },
                  {
                    title: '36 ч.',
                    filter: 36
                  },
                  {
                    title: '1200 ч.',
                    filter: 1200
                  },
                  {
                    title: '72 ч.',
                    filter: 72
                  },
                  {
                    title: '1500 ч.',
                    filter: 1500
                  },
                ].map((label, index) => (
                  <li key={index} className={globalStyles.products_choice__aside_item}>
                    <label className={globalStyles.products_choice__aside_label}>
                      <input
                        type="checkbox"
                        value={label.filter} // Преобразование для примера
                        onChange={handleHoursChange}
                      />
                      {label.title}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className={globalStyles.products_choice__aside_block}>
              <h3 className={globalStyles.products_choice__aside_title}>Выберите стоимость курса</h3>

              <div className={styles.courses_choice__filter_price}>
                <span>от 230 руб</span>
                <span>до {tempMaxPrice} руб</span>
              </div>

              <Slider
                min={230}
                max={100000}
                defaultValue={maxPriceFilters}
                onChange={handleMaxPriceChange}
                onChangeComplete={handleMaxPriceChangeComplete}
                step={1000}
                styles={{
                  rail: { backgroundColor: '#F2F2F2', height: 8 },
                  track: { backgroundColor: '#5FE0BE', height: 8, borderRadius: 'initial' },
                  handle: {
                    height: 24,
                    width: 24,
                    marginLeft: -2,
                    marginTop: -8,
                    backgroundColor: '#fff',
                    border: '2.01985px solid #F2F2F2',
                    boxShadow: '0px 8.07939px 24.2382px rgba(0, 0, 0, 0.36)',
                    opacity: 1,
                  },
                }}
              />
            </div>
            <div className={globalStyles.products_choice__aside_block}>
              <h3 className={globalStyles.products_choice__aside_title}>Выберите Ваше образование</h3>
              <ul className={`${globalStyles.list_reset} ${globalStyles.products_choice__aside_list}`}>
                {[
                  {
                    title: 'Высшее',
                    filter: 'HIGHER'
                  },
                  {
                    title: 'Среднее профессиональное',
                    filter: 'SECONDARY'
                  },
                ].map((label, index) => (
                  <li key={index} className={globalStyles.products_choice__aside_item}>
                    <label className={globalStyles.products_choice__aside_label}>
                      <input
                        type="checkbox"
                        value={label.filter} // Преобразование для примера
                        onChange={handleEducationChange}
                      />
                      {label.title}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <button className={`${globalStyles.btn_reset} ${globalStyles.products_choice__aside_filters_show}`}>Показать {courses?.count} курсов</button>
          </aside>
        }
        customClassName={globalStyles.products_choice__filters_modal}
        additionalButtonClassName={globalStyles.products_choice__modal_close}
      />

    </section>
  );
};

export default CoursesChoice;
