import { useEffect, useState } from 'react';
import { Link, Element, scroller } from 'react-scroll';
import { useNavigate, useLocation } from "react-router-dom";

import globalStyles from '../../App.module.sass';
import styles from './Courses.module.sass';

import HeroImg from '../../assets/courses/courses-hero-img.png';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Feedback from '../../components/Feedback/Feedback';
import Faq from '../../components/Faq/Faq';
import CoursesChoice from '../../pages/Courses/CoursesChoice/CoursesChoice';
import AdditionalDiscounts from '../../components/AdditionalDiscounts/AdditionalDiscounts';
import Reviews from '../../components/Reviews/Reviews';

import CoursesSteps from '../../assets/courses/courses-steps-img.svg';

import { faqInterface } from '../../types/faqInterface';

interface ICoursesVariations {
  id: number;
  base_price: number;
  discount_percentage: number;
}

interface CoursesProps {
  setModalOpen: (state: boolean) => void;
}

const Courses: React.FC<CoursesProps> = ({ setModalOpen }) => {

  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Курсы', href: '/courses' },
  ];

  const [coursesVariations, setCoursesVariations] = useState<ICoursesVariations[]>([]);

  const location = useLocation();

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

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
  }, []);

  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const [expiryDate, setExpiryDate] = useState<string>('');

  console.log(expiryDate);


  useEffect(() => {
    const updateExpiryDate = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);  // Сброс времени до начала дня
      const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
      const nextResetDate = new Date((daysSinceEpoch - (daysSinceEpoch % 3) + 3) * (1000 * 60 * 60 * 24));

      const day = nextResetDate.getDate();
      const monthNames = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];
      const month = monthNames[nextResetDate.getMonth()];

      setExpiryDate(`${day} ${month}`);
    };

    updateExpiryDate();
    const interval = setInterval(updateExpiryDate, 1000 * 60 * 60 * 24); // Проверять каждый день

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`${globalStyles.section_padding} ${styles.courses}`}>
      <div className={`${globalStyles.hero__outer}`}>
        <div className={globalStyles.container}>
          <Breadcrumbs links={breadcrumbLinks} />

          <section className={globalStyles.hero}>
            <div className={globalStyles.hero__content}>
              <div className={globalStyles.hero__content_text}>
                <div className={`${globalStyles.hero__text_wrapper} ${styles.courses__hero_wrapper}`}>
                  <h2 className={`${globalStyles.title} ${styles.courses__title}`}>Онлайн курсы дополнительного профессионального образования</h2>
                  <p className={`${globalStyles.hero__descr} ${styles.courses__descr}`}>
                    Получите <span className={styles.courses__color_dark}>качественное образование и</span> <span className={styles.courses__color_dark}>удостоверение установленного</span> <span className={styles.courses__color_bold}>образца</span> в удобное для Вас время
                  </p>
                  <div className={styles.courses__price_wrapper}>
                    <Link
                      to="coursesChoice"
                      spy={true}
                      smooth={true}
                      duration={500}
                      className={`${globalStyles.btn_reset} ${globalStyles.hero__btn} ${styles.courses__btn}`}
                    >
                      Выбрать курс
                    </Link>

                    <div className={styles.courses__price}>
                      <div className={styles.courses__first_price}>от <span>{Math.ceil(coursesVariations[0]?.base_price)} ₽</span></div>
                      <div className={styles.courses__second_price}>
                        {Math.ceil(coursesVariations[0]?.base_price * (1 - (coursesVariations[0]?.discount_percentage / 100)))} ₽
                        <span className={styles.courses__discount}>-{Math.ceil(coursesVariations[0]?.discount_percentage)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <img src={HeroImg} alt="" width={678} height={558} />
            </div>
          </section>
        </div>
        <div className={globalStyles.hero__outer_content}>
          <div className={globalStyles.hero__outer_content_block}>
            Размер каждой лекции не менее 15 страниц
            <span>
              Все материалы разбиты на модули, есть дополнительные материалы и литература. Доступ к актуальной информации и лучшим практикам в отрасли.
            </span>
          </div>
          <div className={globalStyles.hero__outer_content_block}>
            От 2 до 7 лекций в каждом модуле
            <span>
              Есть нормативно-правовая база, методические рекомендации, актуальное законодательство. Можно сразу начать применять новые знания на практике.
            </span>
          </div>
          <div className={globalStyles.hero__outer_content_block}>
            Объем курсов от 1 дня по ускоренной программе
            <span>
              Все курсы предполагают интерактивный формат обучения и доступны в удобное время. Можно совмещать обучение с работой или другими занятиями.
            </span>
          </div>
        </div>
      </div>

      <div className={globalStyles.container}>



        <Element name="coursesChoice">
          <CoursesChoice setModalOpen={setModalOpen} />
        </Element>

        <AdditionalDiscounts />

        <section className={styles.courses__steps}>
          <h2 className={`${globalStyles.title} ${styles.courses__steps_title} ${styles.courses__steps_title_width}`}>Как проходит обучение <span>по программе?</span></h2>

          <ul className={`${globalStyles.list_reset} ${styles.courses__steps_list}`}>
            <img className={styles.courses__steps_list_img} src={CoursesSteps} alt="" />
            <li className={`${styles.courses__steps_item} ${styles.courses__steps_item_flex_end}`}>
              <h3 className={styles.courses__steps_item_title}>
                1. Подача заявки
              </h3>
              <p className={styles.courses__steps_item_descr}>
                Подаете и оплачиваете заявку на обучение
              </p>
              <div className={styles.courses__steps_item_text}>30 секунд</div>
            </li>
            <li className={`${styles.courses__steps_item}`}>
              <h3 className={styles.courses__steps_item_title}>
                2. Онлайн-обучение
              </h3>
              <p className={styles.courses__steps_item_descr}>
                Вы обучаетесь дистанционно в любое удобное время
              </p>
              <div className={styles.courses__steps_item_text}>от 2-х дней</div>
            </li>
            <li className={`${styles.courses__steps_item} ${styles.courses__steps_item_flex_end}`}>
              <h3 className={styles.courses__steps_item_title}>
                3. Проверка знаний
              </h3>
              <p className={styles.courses__steps_item_descr}>
                Сдаете итоговое тестирование (количество попыток неограничено)
              </p>
              <div className={styles.courses__steps_item_text}>30 секунд</div>
            </li>
            <li className={`${styles.courses__steps_item}`}>
              <h3 className={styles.courses__steps_item_title}>
                4. Диплом
              </h3>
              <p className={styles.courses__steps_item_descr}>
                Получаете диплом с бесплатной доставкой Почтой России
              </p>
              <div className={styles.courses__steps_item_text}>доставка от 3-х дней</div>
            </li>
          </ul>

          <Link
            to="coursesChoice"
            spy={true}
            smooth={true}
            duration={500}
            className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.courses__steps_btn}`}
          >
            Подобрать курсы
          </Link>

        </section>

        <section className={styles.courses__work}>
          <h2 className={`${globalStyles.title} ${styles.courses__steps_title}`}>Мы работаем как с частными <br /> лицами, так и с организациями</h2>

          <ul className={`${globalStyles.list_reset} ${styles.courses__work_list}`}>
            <li className={styles.courses__work_item}>
              <h3 className={styles.courses__work_item_title}>С 2016 года обучение на курсах прошли более 320 000 человек</h3>

              <Link
                to="coursesChoice"
                spy={true}
                smooth={true}
                duration={500}
                className={`${globalStyles.btn_reset} ${globalStyles.button} ${globalStyles.bg_red} ${styles.courses__work_btn} ${styles.courses__work_btn_1}`}
              >
                Подобрать курсы
              </Link>


            </li>
            <li className={styles.courses__work_item}>
              <h3 className={styles.courses__work_item_title}>Исполнили свыше 1200 договоров и контрактов с юридическими лицами</h3>
              <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${globalStyles.bg_purple} ${styles.courses__work_btn} ${styles.courses__work_btn_2}`} onClick={() => handleLinkClick("/corporate-training")}>Получить контракт</button>
            </li>
            <li className={`${styles.courses__work_item} ${styles.courses__work_item_full_column}`}>
              <div className={styles.courses__work_item_content}>
                <h3 className={`${styles.courses__work_item_title} ${styles.courses__work_item_title_margin}`}>Получите налоговый вычет за обучение</h3>
                <p className={`${styles.courses__work_item_descr} ${styles.courses__work_item_descr_margin}`}>
                  Наш сервис имеет государственную образовательную лицензию, которая позволяет нашим ученикам получить денежную компенсацию от государства в сумме до 13% от стоимости курсов
                </p>
                <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${globalStyles.bg_green} ${styles.courses__work_btn} ${styles.courses__work_btn_3}`} onClick={() => handleLinkClick("/tax-deduction")}>Подробнее</button>
              </div>
            </li>
          </ul>
        </section>



        <h2 className={`${globalStyles.title} ${styles.courses__steps_title}`}>Часто задаваемые вопросы</h2>
        <Faq accordionItems={questions} />

        <Reviews />

        <Feedback />

      </div>
    </section>
  );
};

export default Courses;
