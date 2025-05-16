import { useNavigate } from "react-router-dom";

import globalStyles from '../../App.module.sass';
import styles from './Provisions.module.sass';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

const Provisions = () => {

  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Положения к мероприятиям', href: '/provisions' },
  ];

  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <section className={`${globalStyles.section_padding} ${styles.provisions}`}>
      <div className={globalStyles.container}>
        <Breadcrumbs links={breadcrumbLinks} />

        <h2 className={`${globalStyles.title} ${styles.provisions__title}`}>Положения к мероприятиям, проводимых на портале</h2>
        <p className={styles.provisions__descr}>
          Ниже Вы можете ознакомиться с положениями ко всем мероприятиям, которые проводятся на нашем портале:
        </p>

        <div className={globalStyles.provisions_block}>
          <ol className={styles.provisions__list}>
            <li className={styles.provisions__item} onClick={() => handleLinkClick("/provision-competition")}>Положение к творческому конкурсу;</li>
            <li className={styles.provisions__item}>Положение к олимпиаде;</li>
            <li className={styles.provisions__item}>Положение к викторине;</li>
            <li className={styles.provisions__item}>Положение к публикации статьи на сайте;</li>
            <li className={styles.provisions__item}>Положение к работе социальной сети и формированию персонального мини-сайта, участию в группах, включение в состав жюри и экспертного совета.</li>
          </ol>
        </div>
        







      </div>
    </section>
  );
};

export default Provisions;
