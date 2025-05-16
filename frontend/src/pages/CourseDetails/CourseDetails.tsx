import { useEffect, useState, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Element, scroller } from 'react-scroll';

import { AuthContext } from '../../context/AuthContext';

import globalStyles from '../../App.module.sass';
import coursesStyles from '../Courses/Courses.module.sass';
import publicationsStyle from '../Publications/Publications.module.sass';
import styles from './CourseDetails.module.sass';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Feedback from '../../components/Feedback/Feedback';
import AdditionalDiscounts from '../../components/AdditionalDiscounts/AdditionalDiscounts';
import Reviews from '../../components/Reviews/Reviews';
import Faq from '../../components/Faq/Faq';

import CourseDetailsAdvantagesIcon1 from '../../assets/course-details/course-details-advantages-icon-1.svg';
import CourseDetailsAdvantagesIcon2 from '../../assets/course-details/course-details-advantages-icon-2.svg';
import CourseDetailsAdvantagesIcon3 from '../../assets/course-details/course-details-advantages-icon-3.svg';
import CourseDetailsAdvantagesIcon4 from '../../assets/course-details/course-details-advantages-icon-4.svg';

import CourseDetailsImg from '../../assets/course-details/course-details-img.png';
import CoursesSteps from '../../assets/courses/courses-steps-img.svg';

import AuthService from '../../services/AuthService';

interface ICurrentCourse {
  id: number;
  title: string;
  short_description: string;
  syllabuses: ICurrentCourseSyllabuses[];
  variation: number;
  description: string;
  goal: string;
  content: string;
  categories_of_listeners: string;
  traineeship: string;
  final_examination: string;
  issued_document: string;
}

interface ICurrentCourseSyllabuses {
  id: number;
  course: number;
  course_hours: number;
  modules: ICurrentCourseSyllabusesModules[];
}

interface ICurrentCourseSyllabusesModules {
  id: number;
  title: string;
  module_order: number;
  number_of_control_hours: number;
  number_of_hours: number;
  number_of_independent_works: number;
  number_of_lectures: number;
}

interface ICoursesVariations {
  id: number;
  base_price: string;
  discount_percentage: string;
  hour_coefficients: ICoursesHoursCoefficients[];
}

interface ICoursesHoursCoefficients {
  number_of_hours: number;
  price_coefficient: string;
}

import { faqInterface } from '../../types/faqInterface';

interface CourseDetailsProps {
  setModalOpen: (state: boolean) => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ setModalOpen }) => {
  const { id } = useParams<{ id: string }>();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = AuthService.getAccessToken();

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { isAuthenticated } = authContext;

  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const [coursesVariations, setCoursesVariations] = useState<ICoursesVariations[]>([]);
  const [currentCourse, setCurrentCourse] = useState<ICurrentCourse | null>(null);
  const [selectedSyllabus, setSelectedSyllabus] = useState<ICurrentCourseSyllabuses | null>(null);

  const fetchCoursesVariations = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/courses/variations`);
      const data = await response.json();
      setCoursesVariations(data.results);
    } catch (error) {
      console.error('Error fetching courses variations:', error);
    }
  }, [apiBaseUrl]);

  const [currentNumberOfHours, setCurrentNumberOfHours] = useState(0);

  const fetchCurrentCourse = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/courses/${id}`);
      const data = await response.json();
      setCurrentCourse(data);
      if (data.syllabuses.length > 0) {
        setSelectedSyllabus(data.syllabuses[0]);
        setCurrentNumberOfHours(data.syllabuses[0].course_hours);
      }
      setIsContentLoaded(true);
    } catch (error) {
      console.error('Error fetching current course:', error);
    }
  }, [apiBaseUrl, id]);

  useEffect(() => {
    fetchCoursesVariations();
    fetchCurrentCourse();
  }, [fetchCoursesVariations, fetchCurrentCourse]);

  useEffect(() => {
    if (isContentLoaded && location.hash) {
      const anchor = location.hash.slice(1);
      scroller.scrollTo(anchor, {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -150
      });
    }
  }, [isContentLoaded, location]);

  const handleSyllabusClick = (syllabus: ICurrentCourseSyllabuses) => {
    setSelectedSyllabus(syllabus);
  };

  const calculateTotal = (field: keyof ICurrentCourseSyllabusesModules) => {
    return selectedSyllabus?.modules.reduce((total, module) => {
      const value = module[field];
      return total + (typeof value === 'number' ? value : parseFloat(value));
    }, 0) || 0;
  };


  const [questions, setQuestions] = useState<faqInterface[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/faq/?category=COURSES`);
        const data = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const courseVariation = coursesVariations.find(variationEl => variationEl.id === currentCourse?.variation);

  const basePrice = courseVariation ? Number(courseVariation.base_price) : 0;
  const discountPercentage = courseVariation ? Number(courseVariation.discount_percentage) : 0;

  const discountedPrice = basePrice * (1 - discountPercentage / 100);
  const [currentPriceCoeff, setCurrentPriceCoeff] = useState(1);

  useEffect(() => {
    const updateValues = () => {
      const newStudentsCount = Math.floor(Math.random() * (1500 - 1000 + 1)) + 1000;
      const newRegionsCount = Math.floor(Math.random() * (69 - 60 + 1)) + 60;

      localStorage.setItem('studentsCount', newStudentsCount.toString());
      localStorage.setItem('regionsCount', newRegionsCount.toString());

      // Set the next reset time to 3 days from now
      const now = new Date();
      const nextResetDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      nextResetDate.setHours(0, 0, 0, 0); // Reset time to the start of the day
      localStorage.setItem('nextResetDate', nextResetDate.getTime().toString());
    };

    const checkAndUpdateValues = () => {
      const now = new Date().getTime();
      const nextResetDateStr = localStorage.getItem('nextResetDate');

      if (!nextResetDateStr || now >= parseInt(nextResetDateStr)) {
        updateValues();
      }
    };

    checkAndUpdateValues();
  }, []);

  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Курсы', href: '/courses' },
    { name: `${currentCourse?.title}`, href: '/courses/course-details' },
  ];

  const handleCourseCreate = () => {

    if (!isAuthenticated) {
      setModalOpen(true);
      return;
    }

    const courseBody = {
      course: selectedSyllabus ? selectedSyllabus.course : 0,
      number_of_hours: currentNumberOfHours
    };

    fetch(`${apiBaseUrl}/api/v1/cab/courses/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseBody)
    })
      .then(data => {
        console.log('Success:', data);
        alert('Успешно!');
        window.location.href = '/cab-courses';
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <section className={`${globalStyles.section_padding} ${styles.course_details}`}>

      <div className={`${globalStyles.hero__outer} ${styles.course_details__hero_outer}`}>
        <div className={globalStyles.container}>
          <Breadcrumbs links={breadcrumbLinks} />

          <section className={globalStyles.hero}>
            <div className={globalStyles.hero__content}>
              <div className={globalStyles.hero__content_text}>
                <div className={`${globalStyles.hero__text_wrapper} ${coursesStyles.courses__hero_wrapper}`}>
                  <h2 className={`${globalStyles.title} ${coursesStyles.courses__title}`}>Внедрение ФОП дошкольного образования</h2>
                  <p className={`${globalStyles.hero__descr} ${coursesStyles.courses__descr}`}>
                    Дистанционные курсы
                    повышения квалификации
                  </p>
                  <div className={`${coursesStyles.courses__price_wrapper} ${styles.course_details__price_wrapper}`}>
                    <button className={`${globalStyles.btn_reset} ${globalStyles.hero__btn} ${coursesStyles.courses__btn} ${styles.course_details__hero_btn}`} onClick={handleCourseCreate}>
                      Записаться на курс со скидкой
                    </button>
                    <div className={coursesStyles.courses__price}>
                      <div className={coursesStyles.courses__first_price}><span>{Math.ceil(Number(coursesVariations[0]?.base_price))} ₽</span></div>
                      <div className={coursesStyles.courses__second_price}>
                        {Math.ceil(Number(coursesVariations[0]?.base_price) * (1 - (Number(coursesVariations[0]?.discount_percentage) / 100)))} ₽
                        <span className={coursesStyles.courses__discount}>-{Math.ceil(Number(coursesVariations[0]?.discount_percentage))}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <img src={CourseDetailsImg} alt="" width={695} height={592} />
            </div>
          </section>
        </div>
      </div>

      <div className={globalStyles.container}>

        <section className={styles.course_details__about}>
          <ul className={`${globalStyles.list_reset} ${styles.course_details__about_list}`}>

            {currentCourse?.description.length ? (
              <li className={`${styles.course_details__about_item} ${styles.course_details__about_item_full_column}`}>
                <h3 className={styles.course_details__about_item_title}>О программе:</h3>
                <p className={styles.course_details__about_item_descr}>{currentCourse?.description}</p>
              </li>
            ) : ('')}

            {currentCourse?.goal.length ? (
              <li className={`${styles.course_details__about_item} ${styles.course_details__about_item_full_column}`}>
                <h3 className={styles.course_details__about_item_title}>Цель:</h3>
                <p className={styles.course_details__about_item_descr}>{currentCourse?.goal}</p>
              </li>
            ) : ('')}

            {currentCourse?.content.length ? (
              <li className={`${styles.course_details__about_item} ${styles.course_details__about_item_full_column}`}>
                <h3 className={styles.course_details__about_item_title}>Курс содержит:</h3>
                <p className={styles.course_details__about_item_descr}>{currentCourse?.content}</p>
              </li>
            ) : ('')}

            {currentCourse?.categories_of_listeners.length ? (
              <li className={styles.course_details__about_item}>
                <h3 className={styles.course_details__about_item_title}>Категории слушателей:</h3>
                <p className={styles.course_details__about_item_descr}>{currentCourse?.categories_of_listeners}</p>
              </li>
            ) : ('')}

            {currentCourse?.traineeship.length ? (
              <li className={styles.course_details__about_item}>
                <h3 className={styles.course_details__about_item_title}>Стажировка:</h3>
                <p className={styles.course_details__about_item_descr}>{currentCourse?.traineeship}</p>
              </li>
            ) : ('')}

            {currentCourse?.final_examination.length ? (
              <li className={styles.course_details__about_item}>
                <h3 className={styles.course_details__about_item_title}>Итоговая аттестация:</h3>
                <p className={styles.course_details__about_item_descr}>{currentCourse?.final_examination}</p>
              </li>
            ) : ('')}

            {currentCourse?.issued_document.length ? (
              <li className={styles.course_details__about_item}>
                <h3 className={styles.course_details__about_item_title}>Выдаваемый документ:</h3>
                <p className={styles.course_details__about_item_descr}>{currentCourse?.issued_document}</p>
              </li>
            ) : ('')}

          </ul>
        </section>

        <Element name="syllabuses">
          <h2 className={`${globalStyles.title} ${styles.course_details__title}`}>Учебный план</h2>
        </Element>

        <div className={styles.course_details__hours}>
          {currentCourse?.syllabuses.map((syllabus) => (
            <button
              key={syllabus.id}
              className={`${globalStyles.btn_reset} ${styles.course_details__hours_btn} ${selectedSyllabus?.id === syllabus.id ? styles.course_details__hours_btn_active : ''}`}
              onClick={() => {
                handleSyllabusClick(syllabus);
                setCurrentNumberOfHours(syllabus.course_hours);

                if (courseVariation) {
                  const currentCoeff = courseVariation.hour_coefficients.find(hours => hours.number_of_hours === syllabus.course_hours)?.price_coefficient;
                  setCurrentPriceCoeff(Number(currentCoeff));
                }


              }}
            >
              {syllabus.course_hours}
            </button>
          ))}
        </div>

        <div className={styles.course_details__table}>
          <div className={`${styles.course_details__table_row} ${styles.course_details__table_row_header}`}>
            <div className={styles.course_details__table_column}>
              Наименование модулей
            </div>
            <div className={styles.course_details__table_column}>
              Всего часов
            </div>
            <div className={styles.course_details__table_column}>
              Лекции
            </div>
            <div className={styles.course_details__table_column}>
              Самостоятельная работа
            </div>
            <div className={styles.course_details__table_column}>
              Кол-во часов контроля
            </div>
            <div className={styles.course_details__table_column}>
              Тип контроля
            </div>
          </div>

          {selectedSyllabus?.modules.map((module) => (
            <div key={module.id} className={styles.course_details__table_row}>
              <div className={styles.course_details__table_column}>
                {module.module_order}. {module.title}
              </div>
              <div className={styles.course_details__table_column}>
                {module.number_of_hours}
              </div>
              <div className={styles.course_details__table_column}>
                {module.number_of_lectures}
              </div>
              <div className={styles.course_details__table_column}>
                {module.number_of_independent_works}
              </div>
              <div className={styles.course_details__table_column}>
                {module.number_of_control_hours}
              </div>
              <div className={styles.course_details__table_column}>
                Тест
              </div>
            </div>
          ))}

          <div className={`${styles.course_details__table_row} ${styles.course_details__table_row_footer}`}>
            <div className={styles.course_details__table_column}>
              Всего часов
            </div>
            <div className={styles.course_details__table_column}>
              {calculateTotal('number_of_hours')}
            </div>
            <div className={styles.course_details__table_column}>
              {calculateTotal('number_of_lectures')}
            </div>
            <div className={styles.course_details__table_column}>
              {calculateTotal('number_of_independent_works')}
            </div>
            <div className={styles.course_details__table_column}>
              {calculateTotal('number_of_control_hours')}
            </div>
            <div className={styles.course_details__table_column}>
              {Math.floor(discountedPrice * currentPriceCoeff)} ₽
            </div>
          </div>
        </div>

        <div className={styles.course_details__table_adaptive}>
          {selectedSyllabus?.modules.map((module) => (
            <div key={module.id} className={styles.course_details__table_row_adaptive}>
              <div className={styles.course_details__table_row_adaptive_block}>
                <div className={styles.course_details__table_row_adaptive_title}>Наименование модулей</div>
                <div className={styles.course_details__table_column_adaptive}>
                  {module.module_order}. {module.title}
                </div>
              </div>
              <div className={styles.course_details__table_row_adaptive_block}>
                <div className={styles.course_details__table_row_adaptive_title}>Всего часов</div>
                <div className={styles.course_details__table_column_adaptive}>
                  {module.number_of_hours}
                </div>
              </div>
              <div className={styles.course_details__table_row_adaptive_block}>
                <div className={styles.course_details__table_row_adaptive_title}>Лекции</div>
                <div className={styles.course_details__table_column_adaptive}>
                  {module.number_of_lectures}
                </div>
              </div>
              <div className={styles.course_details__table_row_adaptive_block}>
                <div className={styles.course_details__table_row_adaptive_title}>Самостоятельная работа</div>
                <div className={styles.course_details__table_column_adaptive}>
                  {module.number_of_independent_works}
                </div>
              </div>
              <div className={styles.course_details__table_row_adaptive_block}>
                <div className={styles.course_details__table_row_adaptive_title}>Кол-во часов контроля</div>
                <div className={styles.course_details__table_column_adaptive}>
                  {module.number_of_control_hours}
                </div>
              </div>
              <div className={styles.course_details__table_row_adaptive_block}>
                <div className={styles.course_details__table_row_adaptive_title}>Тип контроля</div>
                <div className={styles.course_details__table_column_adaptive}>
                  Тест
                </div>
              </div>
            </div>
          ))}

          <div className={`${styles.course_details__table_row_adaptive} ${styles.course_details__table_row_adaptive_total}`}>
            <div className={styles.course_details__table_row_adaptive_block}>
              <div className={`${styles.course_details__table_row_adaptive_title} ${styles.course_details__table_row_adaptive_title_total}`}>Всего часов</div>
              <div className={styles.course_details__table_column_adaptive}>
                {calculateTotal('number_of_hours')}
              </div>
            </div>
            <div className={styles.course_details__table_row_adaptive_block}>
              <div className={`${styles.course_details__table_row_adaptive_title} ${styles.course_details__table_row_adaptive_title_total}`}>Лекции</div>
              <div className={styles.course_details__table_column_adaptive}>
                {calculateTotal('number_of_lectures')}
              </div>
            </div>
            <div className={styles.course_details__table_row_adaptive_block}>
              <div className={`${styles.course_details__table_row_adaptive_title} ${styles.course_details__table_row_adaptive_title_total}`}>Самостоятельная работа</div>
              <div className={styles.course_details__table_column_adaptive}>
                {calculateTotal('number_of_independent_works')}
              </div>
            </div>
            <div className={styles.course_details__table_row_adaptive_block}>
              <div className={`${styles.course_details__table_row_adaptive_title} ${styles.course_details__table_row_adaptive_title_total}`}>Кол-во часов контроля</div>
              <div className={styles.course_details__table_column_adaptive}>
                {calculateTotal('number_of_control_hours')}
              </div>
            </div>
            <div className={styles.course_details__table_row_adaptive_block}>
              <div className={`${styles.course_details__table_row_adaptive_title} ${styles.course_details__table_row_adaptive_title_total}`}>Цена</div>
              <div className={styles.course_details__table_column_adaptive}>
                {Math.floor(discountedPrice * currentPriceCoeff)} ₽
              </div>
            </div>

          </div>
        </div>

        {/* <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.course_details__btn}`}
          onClick={handleCourseCreate}
        >Записаться</button> */}

        <section className={publicationsStyle.publications__advantages}>
          <h2 className={`${globalStyles.title} ${publicationsStyle.publications__advantages_title}`}>Ваши коллеги уже обучаются <br /> <span>на нашем портале</span></h2>
          <ul className={`${globalStyles.list_reset} ${publicationsStyle.publications__advantages_list}`}>
            <li className={publicationsStyle.publications__advantages_item}>
              <div className={publicationsStyle.publications__advantages_item_text}>
                <img className={publicationsStyle.publications__advantages_item_icon} src={CourseDetailsAdvantagesIcon1} alt="" width={99} height={99} />
                <h3 className={publicationsStyle.publications__advantages_item_title}>Дистанционное <br /> обучение</h3>
                <p className={publicationsStyle.publications__advantages_item_descr}>
                  В документах не увидите дистанционной формы обучения, она в них попросту не указана. Современные документы выглядят так же, как те, как те, что вы получаете при очной форме.
                </p>
              </div>
            </li>
            <li className={publicationsStyle.publications__advantages_item}>
              <div className={publicationsStyle.publications__advantages_item_text}>
                <img className={publicationsStyle.publications__advantages_item_icon} src={CourseDetailsAdvantagesIcon2} alt="" width={99} height={99} />
                <h3 className={publicationsStyle.publications__advantages_item_title}>Ежедневный набор <br /> учебных групп</h3>
                <p className={publicationsStyle.publications__advantages_item_descr}>
                  Набираем образовательные группы ежедневно. Начало обучения - сразу же после оплаты.Существует дополнительная программа экспресс обучение!
                </p>
              </div>
            </li>
            <li className={publicationsStyle.publications__advantages_item}>
              <div className={publicationsStyle.publications__advantages_item_text}>
                <img className={publicationsStyle.publications__advantages_item_icon} src={CourseDetailsAdvantagesIcon3} alt="" width={99} height={99} />
                <h3 className={publicationsStyle.publications__advantages_item_title}>Официально</h3>
                <p className={publicationsStyle.publications__advantages_item_descr}>
                  Вам будет выдано индивидуальное удостоверение официального образца. Вносим основную информацию о документах в Федеральный реестр сведений документов об обучении (ФИС ФРДО).
                </p>
              </div>
            </li>
            <li className={publicationsStyle.publications__advantages_item}>
              <div className={publicationsStyle.publications__advantages_item_text}>
                <img className={publicationsStyle.publications__advantages_item_icon} src={CourseDetailsAdvantagesIcon4} alt="" width={99} height={99} />
                <h3 className={publicationsStyle.publications__advantages_item_title}>Онлайн платформа</h3>
                <p className={publicationsStyle.publications__advantages_item_descr}>
                  Профессиональное образование вы получаете в удобное время. Отрыва от работы не происходит.
                </p>
              </div>
            </li>
          </ul>
        </section>

        <section className={coursesStyles.courses__steps}>
          <h2 className={`${globalStyles.title} ${coursesStyles.courses__steps_title}`}>Как пройти программу</h2>

          <ul className={`${globalStyles.list_reset} ${coursesStyles.courses__steps_list}`}>
            <img className={coursesStyles.courses__steps_list_img} src={CoursesSteps} alt="" />
            <li className={`${globalStyles.bg_blue} ${coursesStyles.courses__steps_item}`}>
              <h3 className={coursesStyles.courses__steps_item_title}>
                1. Подача заявки
              </h3>
              <p className={coursesStyles.courses__steps_item_descr}>
                Подаете и оплачиваете заявку на обучение
              </p>
              <div className={coursesStyles.courses__steps_item_text}>30 секунд</div>
            </li>
            <li className={`${globalStyles.bg_red} ${coursesStyles.courses__steps_item}`}>
              <h3 className={coursesStyles.courses__steps_item_title}>
                2. Онлайн-обучение
              </h3>
              <p className={coursesStyles.courses__steps_item_descr}>
                Получаете дистанционное образование в удобное время
              </p>
              <div className={coursesStyles.courses__steps_item_text}>от 2-х дней</div>
            </li>
            <li className={`${globalStyles.bg_purple} ${coursesStyles.courses__steps_item}`}>
              <h3 className={coursesStyles.courses__steps_item_title}>
                3. Проверка знаний
              </h3>
              <p className={coursesStyles.courses__steps_item_descr}>
                Выполняете итоговый тест неограниченное число попыток
              </p>
              <div className={coursesStyles.courses__steps_item_text}>30 секунд</div>
            </li>
            <li className={`${globalStyles.bg_green} ${coursesStyles.courses__steps_item}`}>
              <h3 className={coursesStyles.courses__steps_item_title}>
                4. Диплом
              </h3>
              <p className={coursesStyles.courses__steps_item_descr}>
                Получаете удостоверение с бесплатной доставкой Почтой России
              </p>
              <div className={coursesStyles.courses__steps_item_text}>доставка от 3-х дней</div>
            </li>
          </ul>
        </section>

        <AdditionalDiscounts />
        {/* <CoursesDiscount /> */}
        <Reviews />

        <h2 className={`${globalStyles.title} ${coursesStyles.courses__steps_title}`}>Часто задаваемые вопросы</h2>
        <Faq accordionItems={questions} />

        <Feedback />
      </div>
    </section>
  );
};

export default CourseDetails;
