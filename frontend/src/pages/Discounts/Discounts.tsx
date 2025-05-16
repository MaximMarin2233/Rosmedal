import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import globalStyles from '../../App.module.sass';
import styles from './Discounts.module.sass';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Feedback from '../../components/Feedback/Feedback';

import DiscountsImg1 from "../../assets/discounts/discounts-img-1.png";
import DiscountsImg2 from "../../assets/discounts/discounts-img-2.png";
import DiscountsImg3 from "../../assets/discounts/discounts-img-3.png";

interface ICoursesVariations {
  id: number;
  display_name: string;
  base_price: string;
  discount_percentage: string;
}

const Discounts = () => {

  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Акции', href: '/discounts' },
  ];

  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const [coursesVariations, setCoursesVariations] = useState<ICoursesVariations[]>([]);
  const [desiredObject, setDesiredObject] = useState<{ price: string } | null>(null);

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

    const fetchDocs = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/docs/variations`);
        const data = await response.json();

        const foundObject = data.results.find(obj => obj.tag === "КПП");
        setDesiredObject(foundObject);

      } catch (error) {
        console.error('Error fetching docs:', error);
      }
    };

    fetchDocs();
  }, [apiBaseUrl]);

  return (
    <section className={`${globalStyles.section_padding} ${styles.discounts}`}>
      <div className={globalStyles.container}>
        <Breadcrumbs links={breadcrumbLinks} />

        <h2 className={`${globalStyles.title} ${styles.discounts__title}`}>Акции</h2>

        <ul className={`${globalStyles.list_reset} ${styles.discounts__list}`}>
          <li className={`${globalStyles.bg_purple} ${styles.discounts__item}`}>
            <div className={styles.discounts__item_text}>
              <h3 className={styles.discounts__item_title}>Сезонная скидка {Math.ceil(+coursesVariations[0]?.discount_percentage)}% на все курсы повышения квалификации и профессиональной переподготовки</h3>
              <p className={styles.discounts__item_descr}>
                Только в этом месяце скидка на обучение на курсах повышения квалификации и переподготовки — {Math.ceil(+coursesVariations[0]?.discount_percentage)}%! Получите удостоверение установленного образца всего за {Math.ceil(+coursesVariations[0]?.base_price * (1 - (+coursesVariations[0]?.discount_percentage / 100)))} руб., а диплом переподготовки за {desiredObject?.price} руб.! Дополнительные скидки на коллективное обучение до -30%!
              </p>
              <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.discounts__item_btn}`} onClick={() => handleLinkClick("/courses#coursesChoice")}>Подобрать курс</button>
            </div>
            <img className={styles.discounts__img} src={DiscountsImg1} alt="" />
          </li>
          <li className={`${globalStyles.bg_green} ${styles.discounts__item}`}>
            <div className={styles.discounts__item_text}>
              <h3 className={styles.discounts__item_title}>Диплом в подарок! 1+1=3!</h3>
              <p className={styles.discounts__item_descr}>
                Каждый третий диплом/сертификат/благодарственное письмо/свидетельство в заказе абсолютно бесплатно! Оформляйте больше дипломов в один заказ - это действительно ВЫГОДНО!
              </p>
              <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.discounts__item_btn}`} onClick={() => handleLinkClick("/cab-issue")}>Оформить диплом</button>
            </div>
            <img className={styles.discounts__img} src={DiscountsImg2} alt="" />
          </li>
          <li className={`${globalStyles.bg_red} ${styles.discounts__item}`}>
            <div className={styles.discounts__item_text}>
              <h3 className={styles.discounts__item_title}>Диплом за 100 р. при заказе от 15 шт!  15*100=1 500 р!</h3>
              <p className={styles.discounts__item_descr}>
                Хотите получить дипломы действительно выгодно? Закажите сразу на весь класс!
              </p>
              <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.discounts__item_btn}`} onClick={() => handleLinkClick("/cab-issue")}>Оформить диплом</button>
            </div>
            <img className={styles.discounts__img} src={DiscountsImg3} alt="" />
          </li>
        </ul>

        <Feedback />
      </div>
    </section>
  );
};

export default Discounts;
