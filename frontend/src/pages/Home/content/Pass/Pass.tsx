import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import globalStyles from '../../../../App.module.sass';
import styles from './Pass.module.sass';

interface ICoursesVariations {
  id: number;
  base_price: number;
  discount_percentage: number;
}

const Pass = () => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const [coursesVariations, setCoursesVariations] = useState<ICoursesVariations[]>([]);

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
  }, []);

  return (
    <section className={styles.pass}>
      <div className={globalStyles.container}>

        <h2 className={`${globalStyles.title} ${styles.pass__title}`}>Пройдите курс</h2>

        <div className={styles.pass__content}>
          <div className={`${styles.pass__course} ${globalStyles.bg_blue}`}>
            <h3 className={styles.pass__course_title}>Повышения квалификации</h3>

            <ul className={`${styles.pass__course_list}`}>
              <li className={styles.pass__course_item}>Набор групп каждый день, обучение в короткие сроки</li>
              <li className={styles.pass__course_item}>Форма обучения заочная, по индивидуальному учебному графику</li>
              <li className={styles.pass__course_item}>Учебные программы составлены с учетом требований ФГОС и профстандартов</li>
              <li className={styles.pass__course_item}>Отправка документов об образовании в электронном виде и заказным письмом почтой россии за наш счет</li>
              <li className={styles.pass__course_item}>Скидки при коллективном обучении</li>
            </ul>

            <div className={styles.pass__course_price_text}>Всего за</div>
            <div className={styles.pass__course_price}>{Math.ceil(coursesVariations[0]?.base_price)} Р</div>

            <button className={`${globalStyles.btn_reset} ${globalStyles.hero__btn} ${styles.pass__btn}`} onClick={() => handleLinkClick("/courses/?variation=1#coursesChoice")}>
              Подобрать курс
            </button>
          </div>
          <div className={`${styles.pass__course} ${globalStyles.bg_red}`}>
            <h3 className={styles.pass__course_title}>Профессиональной переподготовки</h3>

            <ul className={`${globalStyles.list_reset} ${styles.pass__course_list}`}>
              <li className={styles.pass__course_item}>По окончанию обучения выдается диплом и приложение установленного образца</li>
              <li className={styles.pass__course_item}>Подробные методические материалы</li>
              <li className={styles.pass__course_item}>В процессе обучения применяются исключительно дистанционные технологии</li>
              <li className={styles.pass__course_item}>Деятельность учебного центра лицензирована (лицензия №9757-л)</li>
              <li className={styles.pass__course_item}>Обучение в короткие сроки</li>
            </ul>

            <div className={styles.pass__course_price_text}>Всего за</div>
            <div className={styles.pass__course_price}>{Math.ceil(coursesVariations[1]?.base_price)} Р</div>

            <button className={`${globalStyles.btn_reset} ${globalStyles.hero__btn} ${styles.pass__btn}`} onClick={() => handleLinkClick("/courses/?variation=2#coursesChoice")}>
              Подобрать курс
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pass;
