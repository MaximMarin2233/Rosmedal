import { useEffect, useState } from 'react';
import { Link, Element } from 'react-scroll';

import globalStyles from '../../App.module.sass';
import coursesStyles from '../Courses/Courses.module.sass';
import publicationStyles from '../Publications/Publications.module.sass';
import styles from './Olympiads.module.sass';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import OlympiadsChoice from './content/OlympiadsChoice/OlympiadsChoice';
import Feedback from '../../components/Feedback/Feedback';
import Faq from '../../components/Faq/Faq';
import Promo from '../../components/Promo/Promo';

import OlympiadsAdvantagesIcon1 from "../../assets/olympiads/olympiads-adv-icon-1.svg";
import OlympiadsAdvantagesIcon2 from "../../assets/olympiads/olympiads-adv-icon-2.svg";
import OlympiadsAdvantagesIcon3 from "../../assets/olympiads/olympiads-adv-icon-3.svg";
import OlympiadsAdvantagesIcon4 from "../../assets/olympiads/olympiads-adv-icon-4.svg";
import OlympiadsAdvantagesIcon5 from "../../assets/olympiads/olympiads-adv-icon-5.svg";
import OlympiadsAdvantagesIcon6 from "../../assets/olympiads/olympiads-adv-icon-6.svg";

import OlympiadsImg from '../../assets/olympiads/olympiads-img.png';
import OlympiadsStepsImg from '../../assets/olympiads/olympiads-steps-img.svg';

import { faqInterface } from '../../types/faqInterface';

const Olympiads = () => {

  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Олимпиады', href: '/olympiads' },
  ];

  const [questions, setQuestions] = useState<faqInterface[]>([]);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/faq/?category=OLYMPIADS`);
        const data = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <section className={globalStyles.section_padding}>
      <div className={`${globalStyles.hero__outer}`}>
        <div className={globalStyles.container}>
          <Breadcrumbs links={breadcrumbLinks} />

          <section className={globalStyles.hero}>
            <div className={globalStyles.hero__content}>
              <div className={globalStyles.hero__content_text}>
                <div className={`${globalStyles.hero__text_wrapper} ${coursesStyles.courses__hero_wrapper}`}>
                  <h2 className={`${globalStyles.title} ${coursesStyles.courses__title}`}>Бесплатные онлайн олимпиады</h2>
                  <p className={`${globalStyles.hero__descr} ${coursesStyles.courses__descr}`}>
                    Примите участие в олимпиаде и получите <span className={coursesStyles.courses__color_dark}>диплом победителя всего за 2 минуты!</span>
                  </p>
                  <div className={coursesStyles.courses__price_wrapper}>
                    <Link
                      to="olympiadsChoice"
                      spy={true}
                      smooth={true}
                      duration={500}
                      className={`${globalStyles.btn_reset} ${globalStyles.hero__btn} ${coursesStyles.courses__btn} ${styles.olympiads__hero_btn}`}
                    >
                      Выбрать олимпиаду
                    </Link>
                  </div>
                  <div className={styles.olympiads__etc_title}>Для кого</div>
                  <div className={styles.olympiads__etc_content}>
                    <ul className={`${styles.olympiads__etc_list}`}>
                      <li>для учителей</li>
                      <li>для студентов</li>
                      <li>для школьников</li>
                      <li>для дошкольников</li>
                    </ul>
                    <ul className={`${styles.olympiads__etc_list}`}>
                      <li>по ФГОС</li>
                      <li>по предметам</li>
                      <li>для всех классов</li>
                      <li>на различные темы</li>
                    </ul>
                  </div>
                </div>
              </div>
              <img src={OlympiadsImg} alt="" width={800} />
            </div>
          </section>
        </div>
        <div className={globalStyles.hero__outer_content}>
          <div className={globalStyles.hero__outer_content_block}>
            Официальные <br /> документы
            <span>
              Дипломы соответствуют требованиям ФЗ "Об образовании" и ФГОС. Подойдут для пополнения вашего портфолио
            </span>
          </div>
          <div className={globalStyles.hero__outer_content_block}>
            Большой выбор <br /> олимпиад
            <span>
              На нашем портале мы предлагаем вам свыше 100 олимпиад на разные темы
            </span>
          </div>
          <div className={globalStyles.hero__outer_content_block}>
            Удобно, быстро, <br /> круглосуточно
            <span>
              Неограниченное количество попыток и официальный диплом за 2 минуты!
            </span>
          </div>
        </div>
      </div>


      <div className={globalStyles.container}>
        <Element name="olympiadsChoice">
          <OlympiadsChoice />
        </Element>

        <section className={globalStyles.advantages}>
          <h2 className={`${globalStyles.title} ${globalStyles.advantages__title}`}>Олимпиады на портале <br /> прошли <span>более 300 000 человек</span></h2>

          <div className={globalStyles.advantages__content}>
            <div className={globalStyles.advantages__block}>
              <img className={globalStyles.advantages__block_icon} src={OlympiadsAdvantagesIcon1} alt="" width={100} height={100} aria-hidden={true} />
              <h3 className={globalStyles.advantages__block_title}>Бесплатное участие</h3>
              <p className={globalStyles.advantages__block_descr}>
                Участие в олимпиаде бесплатное. Вы оплачиваете изготовление диплома, только когда довольны результатом
              </p>
            </div>
            <div className={globalStyles.advantages__block}>
              <img className={globalStyles.advantages__block_icon} src={OlympiadsAdvantagesIcon2} alt="" width={100} height={100} aria-hidden={true} />
              <h3 className={globalStyles.advantages__block_title}>Соответствие
                ФЗ и ФГОС</h3>
              <p className={globalStyles.advantages__block_descr}>
                Олимпиады проводятся в строгом соответствии с ФЗ «Об образовании» и ФГОС. Сайт имеет лицензию СМИ
              </p>
            </div>
            <div className={`${globalStyles.advantages__block}`}>
              <img className={globalStyles.advantages__block_icon} src={OlympiadsAdvantagesIcon3} alt="" width={100} height={100} aria-hidden={true} />
              <h3 className={globalStyles.advantages__block_title}>Дипломы участникам и победителям</h3>
              <p className={globalStyles.advantages__block_descr}>
                В наших олимпиадах нет проигравших. Дипломы получают как победители, так и участники
              </p>
            </div>
            <div className={`${globalStyles.advantages__block}`}>
              <img className={globalStyles.advantages__block_icon} src={OlympiadsAdvantagesIcon4} alt="" width={100} height={100} aria-hidden={true} />
              <h3 className={globalStyles.advantages__block_title}>Онлайн оплата</h3>
              <p className={globalStyles.advantages__block_descr}>
                На ваш выбор представлен десяток способов оплаты: банковской картой, с баланса сотового телефона, платеж по квитанции
              </p>
            </div>
            <div className={globalStyles.advantages__block}>
              <img className={globalStyles.advantages__block_icon} src={OlympiadsAdvantagesIcon5} alt="" width={100} height={100} aria-hidden={true} />
              <h3 className={globalStyles.advantages__block_title}>Выбор номинаций и бланков дипломов</h3>
              <p className={globalStyles.advantages__block_descr}>
                Более 100 номинаций, разнообразие бланков дипломов
              </p>
            </div>
            <div className={globalStyles.advantages__block}>
              <img className={globalStyles.advantages__block_icon} src={OlympiadsAdvantagesIcon6} alt="" width={100} height={100} aria-hidden={true} />
              <h3 className={globalStyles.advantages__block_title}>Отзывчивая поддержка</h3>
              <p className={globalStyles.advantages__block_descr}>
                Поддержка клиентов работает без выходных. В любую минуту мы готовы вам помочь
              </p>
            </div>
          </div>
        </section>
        <section className={styles.olympiads_steps}>
          <h2 className={`${globalStyles.title} ${styles.olympiads_steps__title}`}>Этапы участия <br /> в олимпиаде</h2>
          <ul className={`${globalStyles.list_reset} ${styles.olympiads_steps__list}`}>
            <li className={`${styles.olympiads_steps__item}`}>
              <h3 className={styles.olympiads_steps__item_title}>1. Выберите тему олимпиады</h3>
              <div className={styles.olympiads_steps__item_text}>менее 5 минут</div>
            </li>
            <li className={`${styles.olympiads_steps__item}`}>
              <h3 className={styles.olympiads_steps__item_title}>2. Ответьте на вопросы</h3>
              <div className={styles.olympiads_steps__item_text}>менее 5 минут</div>
            </li>
            <li className={`${styles.olympiads_steps__item}`}>
              <h3 className={styles.olympiads_steps__item_title}>3. Получите диплом в своем личном кабинете</h3>
              <div className={styles.olympiads_steps__item_text}>за 1 минуту</div>
            </li>
            <img className={styles.olympiads_steps__img} src={OlympiadsStepsImg} alt="" />
          </ul>

          <Link
            to="olympiadsChoice"
            spy={true}
            smooth={true}
            duration={500}
            className={`${globalStyles.btn_reset} ${globalStyles.hero__btn} ${styles.olympiads_steps__btn}`}
          >
            Выбрать олимпиаду
          </Link>

        </section>

        <section className={publicationStyles.publications__content}>
          <h2 className={`${globalStyles.title} ${publicationStyles.publications__advantages_title}`}>Результаты опроса <br /> 73 481 участника</h2>

          <ul className={`${globalStyles.list_reset} ${publicationStyles.publications__content_list}`}>
            <li className={publicationStyles.publications__content_item}>
              <div className={`${publicationStyles.publications__content_item_title} ${styles.olympiads_results__item_title}`}>&gt;2000</div>
              <div className={`${publicationStyles.publications__content_item_val} ${styles.olympiads_results__item_val}`}>тем</div>
              <p className={publicationStyles.publications__content_item_descr}>для олимпиад и викторин</p>
            </li>
            <li className={publicationStyles.publications__content_item}>
              <div className={`${publicationStyles.publications__content_item_title} ${styles.olympiads_results__item_title}`}>97%</div>
              <div className={`${publicationStyles.publications__content_item_val} ${styles.olympiads_results__item_val}`}>клиентов</div>
              <p className={publicationStyles.publications__content_item_descr}>довольны организацией олимпиад</p>
            </li>
            <li className={publicationStyles.publications__content_item}>
              <div className={`${publicationStyles.publications__content_item_title} ${styles.olympiads_results__item_title}`}>5</div>
              <div className={`${publicationStyles.publications__content_item_val} ${styles.olympiads_results__item_val}`}>минут</div>
              <p className={publicationStyles.publications__content_item_descr}>среднее время прохождения олимпиады</p>
            </li>
          </ul>
        </section>

        <Promo isTemplatesActive={false} bgColor={globalStyles.bg_red} isSecondBlockActive={false} btnText={'Подобрать олимпиаду'} />

        <h2 className={`${globalStyles.title} ${styles.olympiads__faq_title}`}>Часто задаваемые вопросы</h2>
        <Faq accordionItems={questions} />

        <Feedback />

      </div>
    </section>
  );
};

export default Olympiads;
