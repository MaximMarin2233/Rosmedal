import { useNavigate } from "react-router-dom";

import globalStyles from '../../../../App.module.sass';
import styles from './Participate.module.sass';

import ParticipateContentText1 from '../../../../assets/participate/participate-content-text-1.svg';
import ParticipateContentText2 from '../../../../assets/participate/participate-content-text-2.svg';

const Participate = () => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <section className={styles.participate}>
      <div className={globalStyles.container}>

        <h2 className={`${globalStyles.title} ${styles.participate__title}`}>Участвуйте</h2>

        <ul className={`${globalStyles.list_reset} ${styles.participate__content}`}>
          <li className={styles.participate__content_item}>
            <div className={`${styles.participate__content_text} ${styles.participate__content_text_1}`}>
              <h3 className={styles.participate__content_title}>В конкурсах</h3>
              <ul className={styles.participate__content_list}>
                <li>Выберите подходящую номинацию</li>
                <li>Примите участие в международном или всероссийском конкурсе</li>
                <li>Получите письмо с результатом участия на e-mail в течение 2 часов</li>
                <li>Выберите один из 50 бланков диплома</li>
                <li>Получите диплом победителя или участника конкурса</li>
              </ul>
              <button className={`${globalStyles.btn_reset} ${globalStyles.hero__btn} ${styles.participate__btn}`} onClick={() => handleLinkClick("/creative-competition")}>
                Принять участие в конкурсе
              </button>
              <img className={styles.participate__content_text_img} src={ParticipateContentText1} alt="" />
            </div>
          </li>
          <li className={styles.participate__content_item}>
            <div className={`${styles.participate__content_text} ${styles.participate__content_text_2}`}>
              <h3 className={styles.participate__content_title}>В олимпиадах</h3>
              <ul className={styles.participate__content_list}>
                <li>Результаты доступны сразу</li>
                <li>Проводим олимпиады для воспитателей, учителей, школьников и всех желающих проверить свои знания</li>
                <li>Предлагаем более 2000 тем по ФГОС, предметным и профильным олимпиадам</li>
                <li>Предлагаем актуальные темы олимпиад для воспитателей, педагогов дошкольного и школьного образования</li>
                <li>Выдаем дипломы победителям и участникам олимпиад и викторин</li>
              </ul>
              <button className={`${globalStyles.btn_reset} ${globalStyles.hero__btn} ${styles.participate__btn}`} onClick={() => handleLinkClick("/olympiads")}>
                Принять участие в олимпиаде
              </button>
              <img className={styles.participate__content_text_img} src={ParticipateContentText2} alt="" />
            </div>
          </li>
        </ul>

      </div>
    </section>
  );
};

export default Participate;
