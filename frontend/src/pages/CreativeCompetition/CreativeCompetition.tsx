import { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Link, Element } from 'react-scroll';
import globalStyles from '../../App.module.sass';
import publicationStyles from '../Publications/Publications.module.sass';
import coursesStyles from '../Courses/Courses.module.sass';
import styles from './CreativeCompetition.module.sass';
import Select from 'react-select';

import { AuthContext } from '../../context/AuthContext';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Feedback from '../../components/Feedback/Feedback';
import Promo from '../../components/Promo/Promo';
import Faq from '../../components/Faq/Faq';

import CreativeCompetitionImg from '../../assets/creative-competition/creative-competition-img.png';
import CreativeCompetitionDiplomasBlockImg from '../../assets/creative-competition/creative-competition-diplomas-block-img.png';

import CreativeCompetitionParticipateDiplomas from '../../assets/creative-competition/creative-competition-participate-diplomas.png';

import Icon1 from "../../assets/olympiads/olympiads-advantages-icon-1.svg";
import Icon2 from "../../assets/olympiads/olympiads-advantages-icon-2.svg";
import Icon3 from "../../assets/olympiads/olympiads-advantages-icon-3.svg";
import Icon4 from "../../assets/olympiads/olympiads-advantages-icon-4.svg";

import { faqInterface } from '../../types/faqInterface';

const CreativeCompetition = () => {

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { isAuthenticated } = authContext;

  const [isSelected, setIsSelected] = useState(false);
  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');
  const [nomination, setNomination] = useState('');
  const [authorFullName, setAuthorFullName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [level, setLevel] = useState<{ value: string, label: string } | null>(null);

  const [errors, setErrors] = useState<{ authorFullName?: string, authorEmail?: string, title?: string, nomination?: string, level?: string }>({});

  const [desiredObject, setDesiredObject] = useState<{ price: string } | null>(null);

  const validateForm = () => {
    let valid = true;
    const newErrors: { authorFullName?: string, authorEmail?: string, title?: string, nomination?: string, level?: string } = {};

    if (!authorFullName) {
      newErrors.authorFullName = 'ФИО обязательно для заполнения';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!authorEmail) {
      newErrors.authorEmail = 'Email обязателен для заполнения';
      valid = false;
    } else if (!emailRegex.test(authorEmail)) {
      newErrors.authorEmail = 'Неверный формат email';
      valid = false;
    }

    if (!title) {
      newErrors.title = 'Название обязательно для заполнения';
      valid = false;
    }

    if (!nomination) {
      newErrors.nomination = 'Номинация обязательна для заполнения';
      valid = false;
    }

    if (!level) {
      newErrors.level = 'Конкурс обязателен для заполнения';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


  const handleChange = (option: { value: string, label: string } | null) => {
    setIsSelected(option !== null);
    setLevel(option);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      alert('Вы должны быть авторизованы!');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const data = {
      title,
      nomination,
      author_full_name: authorFullName,
      author_email: authorEmail,
      level: level ? level.value : null
    };

    try {
      const responseToken = await fetch(`${apiBaseUrl}/api/v1/common/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!responseToken.ok) {
        throw new Error('Failed to fetch CSRF token');
      }

      const dataToken = await responseToken.json();

      const response = await fetch(`${apiBaseUrl}/api/v1/contest_works/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': dataToken.csrf_token
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
      alert('Заявка успешно отправлена!');
      setTitle('');
      setNomination('');
      setAuthorFullName('');
      setAuthorEmail('');
      setLevel(null);
      setIsSelected(false);
      setFileName('');
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Творческий конкурс', href: '/creative-competition' },
  ];

  const courseTypeOptions = [
    {
      value: 'INTNAT',
      label: 'Международный',
    },
    {
      value: 'ALRUSS',
      label: 'Всероссийский',
    },
    {
      value: 'INTREG',
      label: 'Межрегиональный',
    },
  ];

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%'
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: isSelected ? '#CDC4FB' : '#FBF9F5',
      border: isSelected ? 'none' : '1px solid #2D2323',
      padding: '12px 18px',
      borderRadius: '10px',
      cursor: 'pointer'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      borderRadius: '10px'
    }),
    option: (provided, state) => ({
      ...provided,
      color: '#2D2323',
      backgroundColor: state.isSelected ? '#CDC4FB' : '#FBF9F5',
      fontSize: '20px',
      fontWeight: '400',
      cursor: 'pointer',
      borderRadius: '10px',

      ':hover': {
        backgroundColor: '#E4DFF8',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '20px',
      fontWeight: '400',
      color: '#2D2323'
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '20px',
      fontWeight: '400',
      color: '#2D2323'
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#2d232380',
      ':hover': {
        color: '#2D2323',
      },
    }),
    indicatorContainer: (provided) => ({
      ...provided,
      color: '#2D2323'
    }),
  };

  const [questions, setQuestions] = useState<faqInterface[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/faq/?category=CREATIVE_COMPETITION`);
        const data = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();

    const fetchDocs = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/docs/variations`);
        const data = await response.json();

        const foundObject = data.results.find(obj => obj.tag === "ТК");
        setDesiredObject(foundObject);

      } catch (error) {
        console.error('Error fetching docs:', error);
      }
    };

    fetchDocs();
  }, []);

  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };


  return (
    <section className={`${globalStyles.section_padding} ${styles.creative_competition}`}>
      <div className={globalStyles.container}>
        <Breadcrumbs links={breadcrumbLinks} />

        <div className={styles.creative_competition__content}>
          <div className={`${globalStyles.bg_blue} ${styles.creative_competition__text}`}>
            <h2 className={styles.creative_competition__content_title}>Бесплатные онлайн конкурсы для педагогов и учащихся</h2>
          </div>
          <img className={styles.creative_competition__img} src={CreativeCompetitionImg} alt="" />
        </div>

        <Element name="creativeCompetitionStart">
          <div className={styles.creative_competition__diplomas}>
            <div className={styles.creative_competition__diplomas_block}>
              <h2 className={styles.creative_competition__diplomas_title}>
                <span>1</span>
                Отправьте работу и получите результаты в течение 2 часов
              </h2>

              <form className={styles.creative_competition__diplomas_form} onSubmit={handleSubmit}>
                <div className={styles.creative_competition__diplomas_form_inputs}>
                  <label className={styles.creative_competition__diplomas_form_input_label}>
                    <input
                      className={styles.creative_competition__diplomas_form_input}
                      type="text"
                      placeholder='Ваша фамилия, имя, отчество'
                      value={authorFullName}
                      onChange={(e) => setAuthorFullName(e.target.value)}
                    />
                    {errors.authorFullName && <span>{errors.authorFullName}</span>}
                  </label>
                  <label className={styles.creative_competition__diplomas_form_input_label}>
                    <input
                      className={styles.creative_competition__diplomas_form_input}
                      type="email"
                      placeholder='Ваш e-mail'
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                    />
                    {errors.authorEmail && <span>{errors.authorEmail}</span>}
                  </label>
                  <label className={styles.creative_competition__diplomas_form_input_label}>
                    <input
                      className={styles.creative_competition__diplomas_form_input}
                      type="text"
                      placeholder='Название работы'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title && <span>{errors.title}</span>}
                  </label>
                  <label className={styles.creative_competition__diplomas_form_input_label}>
                    <input
                      className={styles.creative_competition__diplomas_form_input}
                      type="text"
                      placeholder='Название номинации'
                      value={nomination}
                      onChange={(e) => setNomination(e.target.value)}
                    />
                    {errors.nomination && <span>{errors.nomination}</span>}
                  </label>
                </div>

                <label className={styles.creative_competition__diplomas_form_input_label}>
                  <Select
                    key={level ? level.value : 'empty'}
                    options={courseTypeOptions}
                    styles={customStyles}
                    placeholder='Выберите конкурс'
                    isSearchable={false}
                    onChange={handleChange}
                    value={level}
                  />
                  {errors.level && <span>{errors.level}</span>}
                </label>

                <div className={styles.creative_competition__file_wrapper}>
                  <h3 className={styles.creative_competition__diplomas_subtitle}>Прикрепите файл</h3>
                  <div className={styles.creative_competition__diplomas_descr}>Максимальный размер файла: 20МБ</div>
                  <div className={styles.creative_competition__diplomas_form_label_wrapper}>
                    <label className={styles.creative_competition__diplomas_form_label}>
                      <input name="competition-file" type="file" onChange={handleFileChange} />
                      Выберите файл
                    </label>
                    {fileName && (
                      <span className={styles.creative_competition__diplomas_form_file_name}>
                        {fileName}
                      </span>
                    )}
                  </div>
                </div>

                <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.creative_competition__diplomas_form_btn}`}>Отправить работу</button>
              </form>
            </div>
            <div className={styles.creative_competition__diplomas_block}>
              <h2 className={styles.creative_competition__diplomas_title}>
                <span>2</span>
                Создайте и получите официальный наградной документ
              </h2>

              <img className={styles.creative_competition__diplomas_block_img} src={CreativeCompetitionDiplomasBlockImg} alt="Дипломы" width={633} height={466} />
              <div className={globalStyles.text_center}>
                <div className={styles.creative_competition__diplomas_descr}>Официальный диплом:</div>
                <div className={`${styles.creative_competition__diplomas_subtitle} ${styles.creative_competition__diplomas_subtitle_margin}`}>{desiredObject?.price} руб</div>
              </div>
              <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.creative_competition__diplomas_form_btn} ${styles.creative_competition__diplomas_form_btn_blue}`}
                onClick={() => handleLinkClick("/cab-issue")}
              >Создать диплом</button>

            </div>
          </div>
        </Element>

        <section className={styles.creative_competition__participate}>
          <div className={styles.creative_competition__participate_text}>
            <h2 className={styles.creative_competition__participate_title}>Бесплатные ФГОС конкурсы для педагогов и учащихся</h2>
            <div className={styles.creative_competition__participate_btns}>
              <Link
                to="creativeCompetitionStart"
                spy={true}
                smooth={true}
                duration={500}
                offset={-150}
                className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.creative_competition__participate_btn} ${styles.creative_competition__participate_btn_transparent}`}
              >
                Принять участие за 3 минуты
              </Link>
              <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.creative_competition__participate_btn}`}
                onClick={() => handleLinkClick("/cab-issue")}
              >Оформить диплом</button>
            </div>
          </div>
          <img src={CreativeCompetitionParticipateDiplomas} alt="" width={601} height={469} />
        </section>

        <Promo isTemplatesActive={true} bgColor={globalStyles.bg_green} isSecondBlockActive={false} btnText={'Подобрать курсы'} />

        <section className={globalStyles.advantages}>
          <div className={globalStyles.advantages__content}>
            <h2 className={`${globalStyles.title} ${globalStyles.advantages__title}`}>Тысячи педагогов уже приняли участие в конкурсах на нашем портале</h2>
            <div className={`${globalStyles.advantages__block} ${globalStyles.advantages__block_bg} ${globalStyles.advantages__block_bg_1} ${styles.advantages__block_bg_1}`}>
              <h3 className={globalStyles.advantages__block_title}>Круглосуточная работа сайта</h3>
              <p className={globalStyles.advantages__block_descr}>
                Ваши работы принимаются 24/7. Вы можете получить диплом в любое удобное для вас время
              </p>
            </div>
            <div className={globalStyles.advantages__block}>
              <h3 className={globalStyles.advantages__block_title}>Бесплатное участие</h3>
              <p className={globalStyles.advantages__block_descr}>
                Участие в олимпиаде бесплатное. Вы оплачиваете изготовление диплома, только когда довольны результатом
              </p>
              <img className={globalStyles.advantages__block_icon} src={Icon1} alt="" width={100} height={100} aria-hidden={true} />
            </div>
            <div className={globalStyles.advantages__block}>
              <h3 className={globalStyles.advantages__block_title}>Соответствие ФЗ и ФГОС</h3>
              <p className={globalStyles.advantages__block_descr}>
                Олимпиады проводятся в строгом соответствии с ФЗ «Об образовании» и ФГОС. Сайт имеет лицензию СМИ
              </p>
              <img className={globalStyles.advantages__block_icon} src={Icon2} alt="" width={100} height={100} aria-hidden={true} />
            </div>
            <div className={`${globalStyles.advantages__block} ${globalStyles.advantages__block_bg} ${globalStyles.advantages__block_bg_2} ${styles.advantages__block_bg_2}`}>
              <h3 className={globalStyles.advantages__block_title}>Онлайн оплата</h3>
              <p className={globalStyles.advantages__block_descr}>
                На ваш выбор представлен десяток способов оплаты: банковской картой, с баланса сотового телефона, платеж по квитанции
              </p>
            </div>
            <div className={globalStyles.advantages__block}>
              <h3 className={globalStyles.advantages__block_title}>Выбор номинаций и бланков дипломов</h3>
              <p className={globalStyles.advantages__block_descr}>
                Более 100 номинаций, разнообразие бланков дипломов
              </p>
              <img className={globalStyles.advantages__block_icon} src={Icon3} alt="" width={100} height={100} aria-hidden={true} />
            </div>
            <div className={globalStyles.advantages__block}>
              <h3 className={globalStyles.advantages__block_title}>Отзывчивая поддержка</h3>
              <p className={globalStyles.advantages__block_descr}>
                Поддержка клиентов работает без выходных. В любую минуту мы готовы вам помочь
              </p>
              <img className={globalStyles.advantages__block_icon} src={Icon4} alt="" width={100} height={100} aria-hidden={true} />
            </div>
            <Link
              to="creativeCompetitionStart"
              spy={true}
              smooth={true}
              duration={500}
              offset={-150}
              className={`${globalStyles.btn_reset} ${globalStyles.button} ${globalStyles.advantages__btn} ${styles.creative_competition__advantages_btn}`}
            >
              Выбрать конкурс
            </Link>
          </div>
        </section>

        <section className={coursesStyles.courses__steps}>
          <h2 className={`${globalStyles.title} ${coursesStyles.courses__steps_title}`}>Тысячи педагогов уже приняли участие в конкурсах на нашем портале</h2>

          <ul className={`${globalStyles.list_reset} ${coursesStyles.courses__steps_list} ${styles.creative_competition__steps_list}`}>
            <li className={`${globalStyles.bg_purple} ${coursesStyles.courses__steps_item}`}>
              <h3 className={`${coursesStyles.courses__steps_item_title} ${styles.creative_competition__text_dark}`}>
                <span>1</span>
                Заполните заявку на конкурс
              </h3>
              <div className={`${coursesStyles.courses__steps_item_text} ${styles.creative_competition__text_dark}`}>прямо сейчас</div>
            </li>
            <li className={`${globalStyles.bg_red} ${coursesStyles.courses__steps_item}`}>
              <h3 className={`${coursesStyles.courses__steps_item_title} ${styles.creative_competition__text_dark}`}>
                <span>2</span>
                Мы сообщим результат участия на ваш емайл
              </h3>
              <div className={`${coursesStyles.courses__steps_item_text} ${styles.creative_competition__text_dark}`}>в течение 2-х часов</div>
            </li>
            <li className={`${globalStyles.bg_green} ${coursesStyles.courses__steps_item}`}>
              <h3 className={`${coursesStyles.courses__steps_item_title} ${styles.creative_competition__text_dark}`}>
                <span>3</span>
                Получите диплом в своем личном кабинете
              </h3>
              <div className={`${coursesStyles.courses__steps_item_text} ${styles.creative_competition__text_dark}`}>как только пройдете конкурс</div>
            </li>
          </ul>
          <a className={styles.creative_competition__steps_link} href="download.docx" download>
            <span>Ознакомиться с положением о проведении конкурса</span>
          </a>
          <div className={styles.creative_competition__steps_btns}>
            <Link
              to="creativeCompetitionStart"
              spy={true}
              smooth={true}
              duration={500}
              offset={-150}
              className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.creative_competition__steps_btn} ${styles.creative_competition__steps_btn_grow}`}
            >
              Отправить работу на конкурс
            </Link>
            <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.creative_competition__steps_btn}`}
              onClick={() => handleLinkClick("/cab-issue")}
            >Оформить диплом</button>
          </div>
        </section>

        <section className={publicationStyles.publications__content}>
          <h2 className={`${globalStyles.title} ${publicationStyles.publications__advantages_title}`}>Результаты опроса <br /> 73 481 участника</h2>

          <ul className={`${globalStyles.list_reset} ${publicationStyles.publications__content_list}`}>
            <li className={publicationStyles.publications__content_item}>
              <div className={`${publicationStyles.publications__content_item_title} ${styles.creative_competition__results_item_title}`}>95%</div>
              <div className={`${publicationStyles.publications__content_item_val} ${styles.creative_competition__results_item_val}`}>участников</div>
              <p className={publicationStyles.publications__content_item_descr}>принимают участие в конкурсах два и более раз</p>
            </li>
            <li className={publicationStyles.publications__content_item}>
              <div className={`${publicationStyles.publications__content_item_title} ${styles.creative_competition__results_item_title}`}>97%</div>
              <div className={`${publicationStyles.publications__content_item_val} ${styles.creative_competition__results_item_val}`}>клиентов</div>
              <p className={publicationStyles.publications__content_item_descr}>довольны организацией конкурсов</p>
            </li>
            <li className={publicationStyles.publications__content_item}>
              <div className={`${publicationStyles.publications__content_item_title} ${styles.creative_competition__results_item_title}`}>93%</div>
              <div className={`${publicationStyles.publications__content_item_val} ${styles.creative_competition__results_item_val}`}>человек</div>
              <p className={publicationStyles.publications__content_item_descr}>рекомендовали наш сервис коллегам и друзьям</p>
            </li>
          </ul>
        </section>

        <h2 className={`${globalStyles.title} ${styles.creative_competition__faq_title}`}>Часто задаваемые вопросы</h2>
        <Faq accordionItems={questions} />

        <Feedback />
      </div>
    </section>
  );
};

export default CreativeCompetition;
