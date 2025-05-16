import { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import 'swiper/css';

import globalStyles from "../../App.module.sass";
import styles from "./Reviews.module.sass";

interface IReviews {
  image: string;
}

const Reviews = () => {

  const [reviews, setReviews] = useState<IReviews[]>([]);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/common/home_reviews`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className={styles.reviews}>
      <div className={`${globalStyles.container}`}>
        <div className={styles.reviews__content}>
          <div className={styles.reviews__text}>
            <div className={styles.reviews__content_title}>
              С нами больше 100 тысяч пользователей
            </div>
            <div className={styles.reviews__content_descr}>
              Ценим обратную связь. Когда вы напишете отзыв, он тоже появится здесь
            </div>
          </div>

          <Swiper
            className={styles.news_swiper}
            modules={[A11y]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              992: {
                slidesPerView: 4,
              },
              768: {
                slidesPerView: 3,
              },
              576: {
                slidesPerView: 2,
              },
            }}
          >

            {reviews.map(review => (
              <SwiperSlide>
                <img className={styles.reviews__img} src={review.image} alt="" width={422} height={352} />
              </SwiperSlide>
            ))}


          </Swiper>
        </div>
        <div className={styles.reviews__nav}>
          <div className={styles.reviews__nav_star}>
            <svg width="58" height="55" viewBox="0 0 58 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27.0979 1.8541C27.6966 0.0114784 30.3034 0.0114803 30.9021 1.8541L36.1844 18.1115C36.4522 18.9355 37.2201 19.4934 38.0866 19.4934L55.1806 19.4934C57.118 19.4934 57.9236 21.9727 56.3561 23.1115L42.5268 33.1591C41.8258 33.6683 41.5325 34.5711 41.8003 35.3951L47.0826 51.6525C47.6813 53.4951 45.5723 55.0273 44.0049 53.8885L30.1756 43.841C29.4746 43.3317 28.5254 43.3317 27.8244 43.841L13.9951 53.8885C12.4277 55.0273 10.3187 53.4951 10.9174 51.6525L16.1997 35.3951C16.4675 34.5711 16.1742 33.6683 15.4732 33.1591L1.64387 23.1115C0.0764456 21.9727 0.881997 19.4934 2.81944 19.4934L19.9134 19.4934C20.7799 19.4934 21.5478 18.9355 21.8156 18.1115L27.0979 1.8541Z" fill="#1691D0" />
            </svg>
            <span>4.9</span>
          </div>
        </div>


      </div>
    </section>
  );
};

export default Reviews;
