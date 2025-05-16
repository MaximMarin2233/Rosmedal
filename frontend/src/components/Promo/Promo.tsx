import { useEffect, useState } from "react";
import { Link } from 'react-scroll';

import { addDays, differenceInMilliseconds, startOfDay } from "date-fns";
import globalStyles from "../../App.module.sass";
import styles from "./Promo.module.sass";
import PromoDiplomas from "../../assets/promo/promo-diplomas.png";
import PromoDiplomas2 from "../../assets/promo/promo-diplomas-2.png";

interface PromoProps {
  isTemplatesActive: boolean;
  bgColor: string;
  isSecondBlockActive: boolean;
  btnText: string;
}

const Promo: React.FC<PromoProps> = ({ isTemplatesActive, bgColor, isSecondBlockActive, btnText }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const now = new Date();
    const startDate = startOfDay(now);
    const daysToAdd = 3 - (now.getDate() % 3);
    const nextReset = addDays(startDate, daysToAdd);

    const difference = differenceInMilliseconds(nextReset, now);

    const timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };

    return timeLeft;
  }

  return (
    <section className={styles.promo}>
      <div className={`${globalStyles.container}`}>
        <div className={`${bgColor} ${styles.promo__content}`}>
          <div className={styles.promo__inner}>
            <img src={PromoDiplomas} alt="" width={645} height={642} />
            <div className={styles.promo__timer_wrapper}>
              <h2 className={`${globalStyles.title} ${styles.promo__title}`}>
                Внимание
                <span className={isTemplatesActive ? styles.promo__title_label : `${styles.promo__title_label} ${styles.promo__title_label_purple}`}>
                  <span>акция!</span>
                </span>
              </h2>
              {isTemplatesActive ? (
                <p className={styles.promo__descr}>
                  Оформите заказ на 3 диплома и получите <br /> 1 из них абсолютно бесплатно!
                </p>
              ) : (
                <p className={styles.promo__descr}>
                  Каждый третий диплом в заказе в подарок!
                </p>
              )}
              <div className={styles.promo__timer_outer}>
                <div className={styles.promo__timer}>
                  <h3 className={styles.promo__timer_title}>До конца акции:</h3>
                  <ul className={`${globalStyles.list_reset} ${styles.promo__timer_content}`}>
                    <li className={styles.promo__timer_content_item}>
                      <div className={`${styles.promo__timer_content_item_val} ${styles.promo__timer_content_item_val_first}`}>
                        {timeLeft.days}
                      </div>
                      <div className={styles.promo__timer_content_item_text}>Дней</div>
                    </li>
                    <li className={styles.promo__timer_content_item}>
                      <div className={styles.promo__timer_content_item_val}>{timeLeft.hours}</div>
                      <div className={styles.promo__timer_content_item_text}>Часов</div>
                    </li>
                    <li className={styles.promo__timer_content_item}>
                      <div className={styles.promo__timer_content_item_val}>{timeLeft.minutes}</div>
                      <div className={styles.promo__timer_content_item_text}>Минут</div>
                    </li>
                    <li className={styles.promo__timer_content_item}>
                      <div className={`${styles.promo__timer_content_item_val} ${styles.promo__timer_content_item_val_last}`}>
                        {timeLeft.seconds}
                      </div>
                      <div className={styles.promo__timer_content_item_text}>Секунд</div>
                    </li>
                  </ul>
                </div>
              </div>
              {!isTemplatesActive ? (
                <Link
                  to="olympiadsChoice"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.promo__timer_btn}`}
                >
                  {btnText}
                </Link>
              ) : ''}
            </div>
          </div>
          <div className={styles.promo__text}>*Оплачиваете за два диплома третий в подарок</div>
        </div>
        {isSecondBlockActive ? (
          <div className={`${globalStyles.bg_purple} ${styles.promo__content} ${styles.promo__content_diplomas}`}>
            <div className={styles.promo__templates}>
              <h2 className={`${globalStyles.title} ${styles.promo__title} ${styles.promo__title_diplomas}`}>Большое разнообразие шаблонов и образцов для ваших дипломов и свидетельств</h2>
              <img src={PromoDiplomas2} alt="" width={1184} height={532} />
            </div>
          </div>
        ) : ''}
      </div>
    </section>
  );
};

export default Promo;
