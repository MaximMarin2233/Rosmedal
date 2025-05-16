import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import globalStyles from '../../App.module.sass';
import coursesStyles from '../Courses/Courses.module.sass';
import styles from './Publications.module.sass';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Feedback from '../../components/Feedback/Feedback';

import Faq from '../../components/Faq/Faq';

import PublicationsImg from '../../assets/publications/publications-hero-img.png';
import PublicationsStepsImg from '../../assets/publications/publications-steps-img.png';
import PublicationsStepsBg from '../../assets/publications/publications-steps-bg.png';
import PublicationsCertificateImg from '../../assets/publications/publications-certificate.png';

import PublicationsAdvantagesIcon1 from '../../assets/publications/publications-olympiads-icon-1.svg';
import PublicationsAdvantagesIcon2 from '../../assets/publications/publications-olympiads-icon-2.svg';
import PublicationsAdvantagesIcon3 from '../../assets/publications/publications-olympiads-icon-3.svg';
import PublicationsAdvantagesIcon4 from '../../assets/publications/publications-olympiads-icon-4.svg';

import { faqInterface } from '../../types/faqInterface';

const Publications = () => {
  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Публикации', href: '/publications' },
  ];

  const [questions, setQuestions] = useState<faqInterface[]>([]);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/faq/?category=PUBLICATIONS`);
        const data = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const START_DATE = new Date('2024-01-01T00:00:00');
  const PUBLICATIONS_PER_DAY = 10;
  const AUTHORS_PERCENTAGE = '96%';

  const [publications, setPublications] = useState(0);
  const [participants, setParticipants] = useState(0);
  const [yearsPublishing, setYearsPublishing] = useState(0);

  useEffect(() => {
    const calculateCounts = () => {
      const now = new Date();
      const timeDifference = now.getTime() - START_DATE.getTime();
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      const totalPublications = daysDifference * PUBLICATIONS_PER_DAY;
      const totalParticipants = Math.round(totalPublications / 2.44);
      const totalYearsPublishing = Math.floor(daysDifference / 365);

      setPublications(totalPublications);
      setParticipants(totalParticipants);
      setYearsPublishing(totalYearsPublishing);
    };

    calculateCounts();
    const interval = setInterval(calculateCounts, 1000 * 60 * 60 * 24); // Обновлять каждый день

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`${globalStyles.section_padding} ${styles.publications}`}>

      <div className={`${globalStyles.hero__outer}`}>
        <div className={globalStyles.container}>
          <Breadcrumbs links={breadcrumbLinks} />

          <section className={globalStyles.hero}>
            <div className={globalStyles.hero__content}>
              <div className={globalStyles.hero__content_text}>
                <div className={`${globalStyles.hero__text_wrapper} ${coursesStyles.courses__hero_wrapper}`}>
                  <h2 className={`${globalStyles.title} ${coursesStyles.courses__title}`}>Опубликуйте собственные материалы в СМИ  за 5 минут!</h2>
                  <p className={`${globalStyles.hero__descr} ${coursesStyles.courses__descr}`}>
                    <span className={coursesStyles.courses__color_dark}>Бесплатная публикация</span> материалов на сайте. <span className={coursesStyles.courses__color_dark}>Подайте заявку прямо сейчас,</span> чтобы пополнить портфолио!
                  </p>
                  <div className={coursesStyles.courses__price_wrapper}>
                    <button className={`${globalStyles.btn_reset} ${globalStyles.hero__btn} ${styles.publications__hero_btn}`} onClick={() => handleLinkClick("/articles-publication")}>
                      Выбрать способ публикации
                    </button>
                  </div>
                </div>
              </div>
              <img src={PublicationsImg} alt="" width={800} />
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

      <div className={`${globalStyles.container} ${styles.publications__olympiads_content}`}>
        <section className={styles.publications__advantages}>
          <h2 className={`${globalStyles.title} ${styles.publications__advantages_title}`}>Олимпиады на портале прошли <br /> <span>более 300 000 человек</span></h2>
          <ul className={`${globalStyles.list_reset} ${styles.publications__advantages_list}`}>
            <li className={styles.publications__advantages_item}>
              <div className={`${styles.publications__advantages_item_text} ${styles.publications__advantages_item_text_shorter}`}>
                <img className={styles.publications__advantages_item_icon} src={PublicationsAdvantagesIcon1} alt="" width={99} height={99} />
                <h3 className={styles.publications__advantages_item_title}>Реальная помощь при аттестации</h3>
                <p className={styles.publications__advantages_item_descr}>
                  Портал зарегистрирован как СМИ, изданию присвоен международный номер ISSN!
                </p>
              </div>
            </li>
            <li className={styles.publications__advantages_item}>
              <div className={`${styles.publications__advantages_item_text} ${styles.publications__advantages_item_text_shorter}`}>
                <img className={styles.publications__advantages_item_icon} src={PublicationsAdvantagesIcon2} alt="" width={99} height={99} />
                <h3 className={styles.publications__advantages_item_title}>Публикация в короткие сроки</h3>
                <p className={styles.publications__advantages_item_descr}>
                  Олимпиады проводятся в строгом соответствии с ФЗ «Об образовании» и ФГОС. Сайт имеет лицензию СМИ
                </p>
              </div>
            </li>
            <li className={styles.publications__advantages_item}>
              <div className={`${styles.publications__advantages_item_text} ${styles.publications__advantages_item_text_shorter}`}>
                <img className={styles.publications__advantages_item_icon} src={PublicationsAdvantagesIcon3} alt="" width={99} height={99} />
                <h3 className={styles.publications__advantages_item_title}>Удобная форма отправки материала</h3>
                <p className={styles.publications__advantages_item_descr}>
                  В среднем заполнение формы занимает менее 1 мин.
                </p>
              </div>
            </li>
            <li className={styles.publications__advantages_item}>
              <div className={`${styles.publications__advantages_item_text} ${styles.publications__advantages_item_text_shorter}`}>
                <img className={styles.publications__advantages_item_icon} src={PublicationsAdvantagesIcon4} alt="" width={99} height={99} />
                <h3 className={styles.publications__advantages_item_title}>Гарантируем качество</h3>
                <p className={styles.publications__advantages_item_descr}>
                  В течение 3 лет мы публикуем материалы авторов. 96% постоянно публикуют свои материалы!
                </p>
              </div>
            </li>
          </ul>
        </section>

        <section className={styles.publications__accept}>
          <h2 className={`${globalStyles.title} ${styles.publications__advantages_title}`}>Принимаем к публикации:</h2>

          <ul className={`${globalStyles.list_reset} ${styles.publications__accept_list}`}>
            <li className={`${globalStyles.bg_green} ${styles.publications__accept_item}`}>
              <ul>
                <li>авторские статьи и материалы</li>
                <li>методические разработки</li>
                <li>мастер-классы и проекты</li>
                <li>конспекты занятий</li>
              </ul>
            </li>
            <li className={`${globalStyles.bg_purple} ${styles.publications__accept_item}`}>
              <ul>
                <li>обзоры полезных программ</li>
                <li>тесты, викторины и олимпиады</li>
                <li>планы мероприятий</li>
                <li>учебные планы</li>
              </ul>
            </li>
            <li className={`${globalStyles.bg_blue} ${styles.publications__accept_item}`}>
              <ul>
                <li>презентации</li>
                <li>дидактические материалы</li>
                <li>учебные программы</li>
                <li>технологические карты занятий</li>
              </ul>
            </li>
            <li className={`${globalStyles.bg_red} ${styles.publications__accept_item}`}>
              <ul>
                <li>сценарии проведения праздников и мероприятий</li>
                <li>статьи и материалы, написанные в соавторстве</li>
              </ul>
            </li>
          </ul>

        </section>

        <section className={styles.publications__steps}>
          <h2 className={`${globalStyles.title} ${styles.publications__advantages_title}`}>Как мы публикуем ваш <br /> материал в сетевом издании</h2>

          <div className={styles.publications__steps_wrapper}>
            <ul className={`${globalStyles.list_reset} ${styles.publications__steps_list}`}>
              <li className={styles.publications__steps_item}>
                <div className={styles.publications__steps_item_text}>Вы отправляете материал через специальную форму на сайте</div>
              </li>
              <li className={styles.publications__steps_item}>
                <div className={styles.publications__steps_item_text}>Мы сразу размещаем его на портале</div>
              </li>
              <li className={styles.publications__steps_item}>
                <div className={styles.publications__steps_item_text}>Вы заполняете данные для формирования свидетельства о публикации</div>
              </li>
              <div className={styles.publications__steps_item_full_column}>
                <div className={styles.publications__steps_item_block}>
                  <div className={`${styles.publications__steps_item_text} ${styles.publications__steps_item_text_max_width}`}>Оплачиваете и скачиваете его</div>
                </div>
                <div className={styles.publications__steps_item_block}>
                  <div className={`${styles.publications__steps_item_text} ${styles.publications__steps_item_text_max_width}`}>Наши модераторы просматривают опубликованный материал</div>
                </div>
              </div>
              <img className={styles.publications__steps_bg} src={PublicationsStepsBg} alt="" />
            </ul>

            <img src={PublicationsStepsImg} alt="" />
          </div>
          <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.publications__steps_btn}`} onClick={() => handleLinkClick("/articles-publication")}>Опубликовать статью в сми</button>
        </section>

        <section className={styles.publications__certificate}>
          <h2 className={styles.publications__certificate_title}>Разместим Ваш материал и выдадим Вам свидетельство о публикации установленного образца</h2>
          <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.publications__certificate_btn}`} onClick={() => handleLinkClick("/cab-issue")}>Получить свидетельство о публикации</button>

          <img className={styles.publications__certificate_img} src={PublicationsCertificateImg} alt="" />
        </section>

        <section className={styles.publications__content}>
          <h2 className={`${globalStyles.title} ${styles.publications__advantages_title}`}>
            Опубликовались <br /> <span>{participants} участника</span>
          </h2>

          <ul className={`${globalStyles.list_reset} ${styles.publications__content_list}`}>
            <li className={styles.publications__content_item}>
              <div className={styles.publications__content_item_title}>Свыше</div>
              <div className={styles.publications__content_item_val}>{publications}</div>
              <p className={styles.publications__content_item_descr}>для опубликованных материалов олимпиад и викторин</p>
            </li>
            <li className={styles.publications__content_item}>
              <div className={styles.publications__content_item_title}>Авторов</div>
              <div className={styles.publications__content_item_val}>{AUTHORS_PERCENTAGE}</div>
              <p className={styles.publications__content_item_descr}>постоянно размещают свои материалы</p>
            </li>
            <li className={styles.publications__content_item}>
              <div className={styles.publications__content_item_title}>Более</div>
              <div className={styles.publications__content_item_val}>{yearsPublishing}</div>
              <p className={styles.publications__content_item_descr}>лет публикуем авторские материалы</p>
            </li>
          </ul>
        </section>

        <h2 className={`${globalStyles.title} ${styles.publications__advantages_title}`}>Часто задаваемые вопросы</h2>

        <Faq accordionItems={questions} />

        <Feedback />
      </div>
    </section>
  );
};

export default Publications;
