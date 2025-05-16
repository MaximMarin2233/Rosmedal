import { useNavigate } from "react-router-dom";

import globalStyles from '../../../../App.module.sass';
import styles from './MediaPage.module.sass';

import MediaCheckbox from '../../../../assets/mediafolder/media-checkbox.svg';

const MediaPage = () => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };
  return (
    <section className={styles.media}>
      <div className={globalStyles.container}>


        <div className={styles.media__content}>
          <div className={styles.media__content_1}>
            <h2 className={`${globalStyles.title} ${styles.media__title}`}>Публикуйте свои <br /> материалы В СМИ</h2>
            <h3 className={styles.media__block_title}>Мы принимаем к публикации:</h3>
            <ul className={styles.media__block_list}>
              <li className={styles.media__block_item}>идактические материалы;</li>
              <li className={styles.media__block_item}>конспекты уроков;</li>
              <li className={styles.media__block_item}>образовательные и научные статьи;</li>
              <li className={styles.media__block_item}>методические планы;</li>
              <li className={styles.media__block_item}>сценарии утренников, праздничных концертов и так далее;</li>
              <li className={styles.media__block_item}>презентации и многие другие авторские работы</li>
            </ul>
          </div>

          <div className={styles.media__content_2}>
            <div className={`${styles.media__block}`}>
              <img src={MediaCheckbox} alt="" />
              <h3 className={`${styles.media__block_title} ${styles.media__block_subtitle}`}>Наш сайт зарегистрирован как международное СМИ</h3>
            </div>
            <div className={`${styles.media__block}`}>
              <img src={MediaCheckbox} alt="" />
              <h3 className={`${styles.media__block_title} ${styles.media__block_subtitle}`}>Оповещаем о публикации по e-mail</h3>
            </div>
            <div className={`${styles.media__block}`}>
              <img src={MediaCheckbox} alt="" />
              <h3 className={`${styles.media__block_title} ${styles.media__block_subtitle}`}>Статья публикуется мгновенно, вы можете сразу заказать свидетельство</h3>
            </div>
            <div className={`${styles.media__block}`}>
              <img src={MediaCheckbox} alt="" />
              <h3 className={`${styles.media__block_title} ${styles.media__block_subtitle}`}>Мы сами модерируем статью уже после публикации</h3>
            </div>
            <div className={`${styles.media__block}`}>
              <img src={MediaCheckbox} alt="" />
              <h3 className={`${styles.media__block_title} ${styles.media__block_subtitle}`}>Можно выбирать образец <br /> свидетельства</h3>
            </div>
            <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.media__btn}`} onClick={() => handleLinkClick("/publications")}>Опубликовать в СМИ</button>
          </div>
        </div>


      </div>
    </section>
  );
};

export default MediaPage;
