import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import globalStyles from "../../App.module.sass";
import styles from "./AdditionalDiscounts.module.sass";

import AdditionalDiscountsImg from "../../assets/additional-discounts/additional-discounts-img.png";

const AdditionalDiscounts = () => {
  const [value, setValue] = useState(30);

  const handleSliderChange = (newValue) => {
    setValue(newValue);
  };

  const calculateDiscount = (value) => {
    if (value <= 25) {
      return value + 5;
    } else {
      return 30;
    }
  };

  const discount = calculateDiscount(value);

  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <section className={styles.additional_discounts}>
      <div className={styles.additional_discounts__content}>
        <div className={styles.additional_discounts__text}>
          <h2 className={`${globalStyles.title} ${styles.additional_discounts__title}`}>Дополнительные скидки при коллективном обучении</h2>

          <p className={styles.additional_discounts__descr}>
            Вы можете подать коллективную заявку на обучение. Чем больше человек в заявке, тем больше скидка. Вы можете рассчитать дополнительную скидку, просто введя количество человек в группе
          </p>
          <div className={styles.additional_discounts__price}>
            <h3 className={styles.additional_discounts__price_title}>Рассчитайте скидку</h3>
            <p className={styles.additional_discounts__price_descr}>Количество человек:</p>
            <div className={styles.additional_discounts__price_content}>
              <div className={styles.additional_discounts__price_min}>от 5</div>
              <div className={styles.additional_discounts__price_max}>до {value}</div>
            </div>
            <div className={styles.additional_discounts__range}>
              <Slider
                min={5}
                max={30}
                step={1}
                value={value}
                onChange={handleSliderChange}
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
              <div className={styles.additional_discounts__discount}>
                Скидка:
                <span className={styles.additional_discounts__discount_text}>{discount}%</span>
              </div>
            </div>
          </div>
          <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.additional_discounts__btn}`} onClick={() => handleLinkClick("/corporate-training")}>Подать заявку на коллективное обучение</button>
        </div>
        <img className={styles.additional_discounts__img} src={AdditionalDiscountsImg} alt="" width={668} height={473} />
      </div>
    </section>
  );
};

export default AdditionalDiscounts;
