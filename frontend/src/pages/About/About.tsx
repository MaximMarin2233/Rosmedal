import { useEffect, useState, FormEvent } from "react";
import { Element, scroller } from 'react-scroll';
import { useLocation } from "react-router-dom";

import globalStyles from '../../App.module.sass';
import styles from './About.module.sass';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

import AboutHeroImg from '../../assets/about/about-hero-img.png';

import AboutGoalsIcon1 from '../../assets/about/about-goals-icon-1.svg';
import AboutGoalsIcon2 from '../../assets/about/about-goals-icon-2.svg';
import AboutGoalsIcon3 from '../../assets/about/about-goals-icon-3.svg';
import AboutDiplomasImg from '../../assets/about/about-diplomas-img.png';

const About = () => {

  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'О нас', href: '/about' },
  ];

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [question, setQuestion] = useState<string>('');

  const [errors, setErrors] = useState<{ name?: string, email?: string, question?: string }>({});

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const validateForm = () => {
    let valid = true;
    const newErrors: { name?: string, email?: string, question?: string } = {};

    if (!name) {
      newErrors.name = 'Имя обязательно для заполнения';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email обязателен для заполнения';
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Неверный формат email';
      valid = false;
    }

    if (!question) {
      newErrors.question = 'Вопрос обязателен для заполнения';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const anchor = location.hash.slice(1); // Получаем якорь без символа #
      scroller.scrollTo(anchor, {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -150
      });
    }
  }, [location]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = {
      client_name: name,
      client_email: email,
      text: question
    };

    try {

      const responseToken = await fetch(`${apiBaseUrl}/api/v1/common/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!responseToken.ok) {
        throw new Error('Failed to fetch token');
      }

      const dataToken = await responseToken.json();

      const response = await fetch(`${apiBaseUrl}/api/v1/common/feedback_form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': dataToken.csrf_token
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Обработка успешного ответа
        setName('');
        setEmail('');
        setQuestion('');

        alert('Заявка успешно отправлена!');
      } else {
        // Обработка ошибок
        console.error('Ошибка при отправке формы');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    }
  };


  return (
    <section className={`${globalStyles.section_padding} ${styles.about}`}>
      <div className={globalStyles.container}>
        <Breadcrumbs links={breadcrumbLinks} />

        <div className={styles.about__hero}>
          <div className={styles.about__hero_text}>
            <h2 className={`${globalStyles.title} ${styles.about__title}`}>О нас</h2>
            <p className={styles.about__hero_descr}>
              Педагогический портал «Росcмедаль» начал свою активную деятельность с марта 2016 года. За это время было выдано более 4 000 000 наградных документов, а в наших конкурсах и олимпиадах поучаствовало более 1 000 000 человек со всей России и стран СНГ.
            </p>
          </div>
          <img className={styles.about__hero_img} src={AboutHeroImg} alt="" width={791} height={381} />
        </div>

        <ul className={`${globalStyles.list_reset} ${styles.about__goals}`}>
          <li className={styles.about__goals_item}>
            <img className={styles.about__goals_item_img} src={AboutGoalsIcon1} alt="" width={66} height={66} />
            <h3 className={`${styles.about__goals_item_title} ${styles.about__goals_item_title_blue}`}>В октябре <br /> 2020 года</h3>
            <p className={styles.about__goals_item_descr}>
              мы получили экспертное заключение специалистов инновационного фонда Сколково и стали резидентами инновационного центра! На базе нашего сайта работает учебный центр дополнительного профессионального образования "Луч знаний". Сайт зарегистрирован как средство массовой информации (СМИ), деятельность учебного центра лицензирована (лицензия на осуществление образовательной деятельности 9757-л).
            </p>
          </li>
          <li className={styles.about__goals_item}>
            <img className={styles.about__goals_item_img} src={AboutGoalsIcon2} alt="" width={66} height={66} />
            <h3 className={`${styles.about__goals_item_title} ${styles.about__goals_item_title_red}`}>Цели нашего <br /> проекта</h3>
            <p className={styles.about__goals_item_descr}>
              обмен опытом между педагогами, воспитателями и учителями посредством публикаций и создание условий для  удобного и оперативного участия в творческих конкурсах и олимпиадах, как всероссийского, так и международного уровня.
            </p>
          </li>
          <li className={styles.about__goals_item}>
            <img className={styles.about__goals_item_img} src={AboutGoalsIcon3} alt="" width={66} height={66} />
            <h3 className={`${styles.about__goals_item_title} ${styles.about__goals_item_title_green}`}>Наша <br /> команда</h3>
            <p className={`${styles.about__goals_item_descr} ${styles.about__goals_item_descr_adaptive}`}>
              старается сделать максимально удобный и понятный сервис, учитывая потребности всех пользователей портала. Мы постоянно вносим изменения в механизм работы сайта, делая его более функциональным.  Также на сайте реализован механизм «Пригласи друга», Вы можете получать бонусы за активность приглашенного Вами друга, а за бонусы получить бесплатный диплом. Участвуйте сами и приглашайте своих друзей!
            </p>
          </li>
        </ul>

        <div className={styles.about__diplomas}>
          <div className={styles.about__diplomas_text}>
            <p className={styles.about__diplomas_descr}>
              Портал имеет лицензию на осуществление образовательной деятельности  №9757-л от 19 апреля 2019. (посмотреть лицензию в pdf и ссылка на портал Рособрнадзора)
              <br /><br />
              Наше сетевое издание зарегистрировано в реестре Роскомнадзора. (ссылка на портал Роскомнадзора)
            </p>
            <p className={styles.about__diplomas_descr}>
              Ответственный редактор сетевого издания "Солнечный свет" - Космынина И.А. Адрес редакции: г. Красноярск, ул. Мартынова д. 15
              <br /><br />
              Состав редакционного совета:
              <br /><br />
              – председатель оргкомитета – Космынина И.А. – заместитель председателя <br /> – Гурина И.А. – член оргкомитета – Шахов В.А. – секретарь оргкомитета – Быкова Д.Д.
              <br /><br />
              Если Вам необходимо предъявить свидетельство по месту требования, Вы можете скачать его и распечатать. Скачать свидетельство
              <br /><br />
              Ознакомиться с положением о нашем творческом конкурсе Вы можете на этой странице.
              <br /><br />
              Ознакомиться с положением об интернет-олимпиадах Вы можете на этой странице.
            </p>
          </div>
          <img src={AboutDiplomasImg} alt="" width={618} height={615} />
        </div>

        <Element name="contacts">
          <div className={styles.about__form_wrapper}>
            <div className={styles.about__form_contacts}>
              <div className={styles.about__form_contacts_content}>
                <h3 className={styles.about__form_title}>Контакты</h3>
                <ul className={`${globalStyles.list_reset} ${styles.about__form_contacts_list}`}>
                  <li className={`${styles.about__form_contacts_item} ${styles.about__form_contacts_item_phone}`}>телефон редакции: 8 800 350 54 64 <br /> (По всей России)</li>
                  <li className={`${styles.about__form_contacts_item} ${styles.about__form_contacts_item_email}`}>адрес электронной почты редакции: <a href="mailto:arthelper2015@gmail.com">arthelper2015@gmail.com</a></li>
                </ul>
                <div className={styles.about__form_contacts_text}>
                  Реквизиты организации:
                  <br /><br />
                  ИП Кузнецова И.П. ; ИНН <br />
                  240403465592; ОГРН <br />
                  318246800141010
                  <br /><br />
                  Главный редактор сетевого издания<br />
                  "Росмедаль" – Кузнецова И.П..
                </div>
                <h4 className={styles.about__form_subtitle}>Социальные сети</h4>
                <div className={styles.about__form_contacts_links}>
                  <div className={styles.about__form_contacts_link}>
                    Вконтакте
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.about__form_content}>
              <h3 className={`${styles.about__form_title} ${styles.about__form_content_title}`}>Форма для обратной связи</h3>
              <p className={styles.about__form_content_descr}>
                Что-то не получилось? Остались вопросы или возникли какие-то проблемы, а может хотите написать предложение по развитию проекта? Просто заполните поля ниже.
              </p>
              <form className={globalStyles.feedback__form} onSubmit={handleSubmit}>
                <label className={globalStyles.feedback__form_label}>
                  <input
                    className={globalStyles.feedback__form_input}
                    type="text"
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <span>{errors.name && (errors.name)}</span>
                </label>
                <label className={globalStyles.feedback__form_label}>
                  <input
                    className={globalStyles.feedback__form_input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span>{errors.email && (errors.email)}</span>
                </label>
                <label className={`${globalStyles.feedback__form_label} ${globalStyles.feedback__form_label_full_column}`}>
                  <textarea
                    className={`${globalStyles.feedback__form_input} ${globalStyles.feedback__form_input_textarea}`}
                    placeholder="Ваш вопрос"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  ></textarea>
                  <span>{errors.question && (errors.question)}</span>
                </label>
                <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${globalStyles.feedback__form_btn} ${styles.about__form_btn}`} type="submit">Отправить</button>
              </form>
            </div>
          </div>
        </Element>



      </div>
    </section>
  );
};

export default About;
