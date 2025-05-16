import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types'; // Импортируйте тип Swiper
import { A11y } from 'swiper/modules';
import 'swiper/css';

import globalStyles from '../../../App.module.sass';
import styles from './CoursesDiscount.module.sass';

interface ICoursesVariations {
  id: number;
  display_name: string;
  base_price: string;
  discount_percentage: string;
  hour_coefficients: IHours[];
}

interface IHours {
  number_of_hours: string;
  price_coefficient: string;
  discount_percentage: string;
}

const CoursesDiscount = () => {
  const swiperRef = useRef<SwiperClass | null>(null);

  const [expiryDate, setExpiryDate] = useState<string>('');

  const [coursesVariations, setCoursesVariations] = useState<ICoursesVariations[]>([]);

  const coursesHours1 = [
    '3 дня', '6 дней', '9 дней', ' 12 дней', ' 15 дней', ' 18 дней',
    '20 дней'
  ];

  const coursesHours2 = [
    '25 дня', '50 дней', '84 дня', ' 118 дней', ' 152 дня'
  ];

  const coursesHours3 = [
    '1.5 дня', '25 дней'
  ];

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
    <section className={`${globalStyles.section_padding} ${styles.courses_discount}`}>
      <div className={globalStyles.container}>
        <div className={styles.courses_discount__content}>
          <h2 className={`${globalStyles.title} ${styles.courses_discount__title}`}>
            До {expiryDate} стоимость обучения на курсах профессиональной переподготовки СНИЖЕНА на {Math.ceil(+coursesVariations[1]?.discount_percentage)}%
          </h2>
          <div className={styles.courses_discount__descr}>
            Стоимость курсов не зависит от темы, только от количества часов
          </div>
          <div className={styles.courses_discount__swiper_wrapper}>
            <Swiper
              modules={[A11y]}
              spaceBetween={15}
              slidesPerView={1}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={() => console.log('slide change')}
              breakpoints={{
                992: {
                  slidesPerView: 4,
                  spaceBetween: 23,
                },
                576: {
                  slidesPerView: 2,
                },
              }}
            >

              {coursesVariations[0]?.hour_coefficients.map((hours, index) => (
                <SwiperSlide>
                  <div className={styles.courses_discount__item}>
                    <div className={styles.courses_discount__item_val}>{hours.number_of_hours}</div>
                    <div className={styles.courses_discount__item_text}>часов</div>
                    <div className={styles.courses_discount__item_descr}>
                      Выдача диплома и приложения уже через {coursesHours1[index]}
                    </div>
                    <div className={styles.courses_discount__item_price}>
                      <span>{Math.ceil(+coursesVariations[0].base_price * +hours.price_coefficient)} руб</span>
                      {Math.ceil((+coursesVariations[0]?.base_price * +hours.price_coefficient) * (1 - (+coursesVariations[0]?.discount_percentage / 100)))} руб

                      {hours.number_of_hours == '108' ? (
                        <div className={styles.courses_discount__item_price_choice}>Выбор <br /> пользователей</div>
                      ) : ('')}
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              {coursesVariations[1]?.hour_coefficients.map((hours, index) => (
                <SwiperSlide>
                  <div className={styles.courses_discount__item}>
                    <div className={styles.courses_discount__item_val}>{hours.number_of_hours}</div>
                    <div className={styles.courses_discount__item_text}>часов</div>
                    <div className={styles.courses_discount__item_descr}>
                      Выдача диплома и приложения уже через {coursesHours2[index]}
                    </div>
                    <div className={styles.courses_discount__item_price}>
                      <span>{Math.ceil(+coursesVariations[1].base_price * +hours.price_coefficient)} руб</span>
                      {Math.ceil((+coursesVariations[1]?.base_price * +hours.price_coefficient) * (1 - (+coursesVariations[1]?.discount_percentage / 100)))} руб
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              {coursesVariations[2]?.hour_coefficients.map((hours, index) => (
                <SwiperSlide>
                  <div className={styles.courses_discount__item}>
                    <div className={styles.courses_discount__item_val}>{hours.number_of_hours}</div>
                    <div className={styles.courses_discount__item_text}>часов</div>
                    <div className={styles.courses_discount__item_descr}>
                      Выдача диплома и приложения уже через {coursesHours3[index]}
                    </div>
                    <div className={styles.courses_discount__item_price}>
                      <span>{Math.ceil(+coursesVariations[2].base_price * +hours.price_coefficient)} руб</span>
                      {Math.ceil((+coursesVariations[2]?.base_price * +hours.price_coefficient) * (1 - (+coursesVariations[2]?.discount_percentage / 100)))} руб
                    </div>
                  </div>
                </SwiperSlide>
              ))}


            </Swiper>
            <div
              className={styles.courses_discount__swiper_prev}
              onClick={() => swiperRef.current?.slidePrev()}
            ></div>
            <div
              className={styles.courses_discount__swiper_next}
              onClick={() => swiperRef.current?.slideNext()}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesDiscount;
