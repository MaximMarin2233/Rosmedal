import { useNavigate } from "react-router-dom";

import globalStyles from '../../App.module.sass';
import styles from './Home.module.sass';

import Feedback from '../../components/Feedback/Feedback';
import Promo from '../../components/Promo/Promo';
import Reviews from '../../components/Reviews/Reviews';

import Participate from './content/Participate/Participate';
import Pass from './content/Pass/Pass';
import MediaPage from './content/MediaPage/MediaPage';

import HomeItemImg1 from '../../assets/home/home-item-bg-content-1.svg';
import HomeItemImg2 from '../../assets/home/home-item-bg-content-2.svg';
import HomeItemImg3 from '../../assets/home/home-item-bg-content-3.svg';
import HomeItemImg4 from '../../assets/home/home-item-bg-content-4.svg';
import HomeItemImg5 from '../../assets/home/home-item-bg-content-5.svg';

import HomeAdvantagesIcon1 from '../../assets/home/home-advantages-icon-1.svg';
import HomeAdvantagesIcon2 from '../../assets/home/home-advantages-icon-2.svg';
import HomeAdvantagesIcon3 from '../../assets/home/home-advantages-icon-3.svg';
import HomeAdvantagesIcon4 from '../../assets/home/home-advantages-icon-4.svg';
import HomeAdvantagesIcon5 from '../../assets/home/home-advantages-icon-5.svg';
import HomeAdvantagesIcon6 from '../../assets/home/home-advantages-icon-6.svg';

const Home = () => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <section className={globalStyles.section_padding}>
      <div className={globalStyles.container}>
        <ul className={`${globalStyles.list_reset} ${styles.home__list}`}>
          <h2 className={`${globalStyles.title} ${styles.home__title}`}>Выберите направление обучения</h2>
          <li className={`${styles.home__item} ${styles.home__item_1}`}>
            <div className={styles.home__item_text}>
              <h3 className={`${styles.home__item_title} ${styles.home__item_title_white}`}>Курсы</h3>
              <p className={`${styles.home__item_descr} ${styles.home__item_descr_white}`}>
                Получите документы установленного образца и пройдите аккредитацию легко!
              </p>

              <button className={`${globalStyles.btn_reset} ${styles.home__card_btn} ${styles.home__btn_margin}`} onClick={() => handleLinkClick("/courses")}>
                Выбрать курс
              </button>
            </div>
            <img className={`${styles.home__item_img} ${styles.home__item_img_1}`} src={HomeItemImg1} alt="Курсы" width={200} height={200} />
          </li>
          <li className={`${styles.home__item} ${styles.home__item_2}`}>
            <div className={styles.home__item_text}>
              <h3 className={`${styles.home__item_title} ${styles.home__item_title_white}`}>Дипломы</h3>
              <p className={`${styles.home__item_descr} ${styles.home__item_descr_white}`}>
                Подготовьтесь к очередной аттестации за 10 минут и увеличьте свой доход
              </p>

              <button className={`${globalStyles.btn_reset} ${styles.home__card_btn} ${styles.home__btn}`} onClick={() => handleLinkClick("/creative-competition")}>Пополнить портфолио</button>
            </div>
            <img className={`${styles.home__item_img} ${styles.home__item_img_2}`} src={HomeItemImg2} alt="Дипломы" width={200} height={200} />
          </li>
          <li className={`${styles.home__item} ${styles.home__item_arrow}`}>
            <div className={styles.home__item_text}>
              <h3 className={styles.home__item_title}>Публикации</h3>
              <p className={styles.home__item_descr}>
                Бесплатно опубликуйте свой материал в этом разделе за 2 клика
              </p>
            </div>
            <button className={`${globalStyles.btn_reset} ${styles.home__arrow_btn}`} onClick={() => handleLinkClick("/publications")}>
              <svg width="75" height="16" viewBox="0 0 75 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M74.7071 8.70711C75.0976 8.31658 75.0976 7.68342 74.7071 7.29289L68.3431 0.928932C67.9526 0.538408 67.3195 0.538408 66.9289 0.928932C66.5384 1.31946 66.5384 1.95262 66.9289 2.34315L72.5858 8L66.9289 13.6569C66.5384 14.0474 66.5384 14.6805 66.9289 15.0711C67.3195 15.4616 67.9526 15.4616 68.3431 15.0711L74.7071 8.70711ZM0 9H74V7H0V9Z" fill="black" />
              </svg>
            </button>
            <img className={`${styles.home__item_img} ${styles.home__item_img_1}`} src={HomeItemImg3} alt="Публикации" width={111} height={111} />
          </li>
          <li className={`${styles.home__item} ${styles.home__item_arrow}`}>
            <div className={styles.home__item_text}>
              <h3 className={styles.home__item_title}>Конкурсы</h3>
              <p className={styles.home__item_descr}>
                Участвуйте в бесплатных творческих конкурсах и получайте диплом за 2 часа
              </p>
            </div>
            <button className={`${globalStyles.btn_reset} ${styles.home__arrow_btn}`} onClick={() => handleLinkClick("/creative-competition")}>
              <svg width="75" height="16" viewBox="0 0 75 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M74.7071 8.70711C75.0976 8.31658 75.0976 7.68342 74.7071 7.29289L68.3431 0.928932C67.9526 0.538408 67.3195 0.538408 66.9289 0.928932C66.5384 1.31946 66.5384 1.95262 66.9289 2.34315L72.5858 8L66.9289 13.6569C66.5384 14.0474 66.5384 14.6805 66.9289 15.0711C67.3195 15.4616 67.9526 15.4616 68.3431 15.0711L74.7071 8.70711ZM0 9H74V7H0V9Z" fill="black" />
              </svg>
            </button>
            <img className={`${styles.home__item_img} ${styles.home__item_img_1}`} src={HomeItemImg4} alt="Конкурсы" width={96} height={96} />
          </li>
          <li className={`${styles.home__item} ${styles.home__item_olympiads} ${styles.home__item_arrow}`}>
            <div className={styles.home__item_text}>
              <h3 className={styles.home__item_title}>Олимпиады</h3>
              <p className={styles.home__item_descr}>
                Примите участие в бесплатных олимпиадах и заберите диплом победителя уже сегодня!
              </p>
            </div>
            <button className={`${globalStyles.btn_reset} ${styles.home__arrow_btn}`} onClick={() => handleLinkClick("/olympiads")}>
              <svg width="75" height="16" viewBox="0 0 75 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M74.7071 8.70711C75.0976 8.31658 75.0976 7.68342 74.7071 7.29289L68.3431 0.928932C67.9526 0.538408 67.3195 0.538408 66.9289 0.928932C66.5384 1.31946 66.5384 1.95262 66.9289 2.34315L72.5858 8L66.9289 13.6569C66.5384 14.0474 66.5384 14.6805 66.9289 15.0711C67.3195 15.4616 67.9526 15.4616 68.3431 15.0711L74.7071 8.70711ZM0 9H74V7H0V9Z" fill="black" />
              </svg>
            </button>
            <img className={`${styles.home__item_img} ${styles.home__item_img_1}`} src={HomeItemImg5} alt="Конкурсы" width={106} height={106} />
          </li>
        </ul>

        <section className={globalStyles.advantages}>
          <h2 className={`${globalStyles.title} ${globalStyles.advantages__title}`}>Почему выбирают <br /> <span>именно нас?</span></h2>

          <div className={globalStyles.advantages__content}>
            <div className={globalStyles.advantages__block}>
              <img className={globalStyles.advantages__block_icon} src={HomeAdvantagesIcon1} alt="" width={100} height={100} aria-hidden={true} />
              <h3 className={globalStyles.advantages__block_title}>Надежно</h3>
              <p className={globalStyles.advantages__block_descr}>
                Диплом оформляется согласно действующим требованиям аттестационной комиссии
              </p>
            </div>
            <div className={globalStyles.advantages__block}>
              <img className={globalStyles.advantages__block_icon} src={HomeAdvantagesIcon2} alt="" width={100} height={100} aria-hidden={true} />
              <h3 className={globalStyles.advantages__block_title}>Легко</h3>
              <p className={globalStyles.advantages__block_descr}>
                Вы сможете оформить диплом в удобном личном кабинете онлайн в простой форме
              </p>
            </div>
            <div className={`${globalStyles.advantages__block}`}>
              <img className={globalStyles.advantages__block_icon} src={HomeAdvantagesIcon3} alt="" width={100} height={100} aria-hidden={true} />
              <h3 className={globalStyles.advantages__block_title}>Выгодно</h3>
              <p className={globalStyles.advantages__block_descr}>
                Предложите пользоваться нашим сервисом своим знакомым, наберите баллы и получите диплом бесплатно!
              </p>
            </div>
            <div className={`${globalStyles.advantages__block}`}>
              <img className={globalStyles.advantages__block_icon} src={HomeAdvantagesIcon4} alt="" width={100} height={100} aria-hidden={true} />
              <h3 className={globalStyles.advantages__block_title}>Прозрачно</h3>
              <p className={globalStyles.advantages__block_descr}>
                Вы принимаете участие в олимпиаде или конкурсе на бесплатной основе. И только после того, как результат будет известен, оплачиваете диплом
              </p>
            </div>
            <div className={globalStyles.advantages__block}>
              <img className={globalStyles.advantages__block_icon} src={HomeAdvantagesIcon5} alt="" width={100} height={100} aria-hidden={true} />
              <h3 className={globalStyles.advantages__block_title}>Оперативно</h3>
              <p className={globalStyles.advantages__block_descr}>
                Модерация статей перед публикацией в течение 2-х минут, результаты конкурса - в тот же день!
              </p>
            </div>
            <div className={globalStyles.advantages__block}>
              <img className={globalStyles.advantages__block_icon} src={HomeAdvantagesIcon6} alt="" width={100} height={100} aria-hidden={true} />
              <h3 className={globalStyles.advantages__block_title}>Быстро</h3>
              <p className={globalStyles.advantages__block_descr}>
                Регистрация на сайте происходит мгновенно! Не теряйте ни минуты! Участвуйте прямо сейчас!
              </p>
            </div>
          </div>
        </section>

        <Participate />
        <Pass />
        <MediaPage />
        <Promo isTemplatesActive={true} bgColor={globalStyles.bg_green} isSecondBlockActive={true} btnText={'Подобрать курсы'} />
        <Reviews />

        <Feedback />
      </div>
    </section>
  );
};

export default Home;
