import { useRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import globalStyles from '../../App.module.sass';
import styles from './ArticlesPublication.module.sass';

import ModalComponent from '../../components/ModalComponent/ModalComponent'; // Путь к вашему компоненту

import Feedback from '../../components/Feedback/Feedback';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Faq from '../../components/Faq/Faq';

import ArticlesPublicationImg from '../../assets/articles-publication/articles-publication-img.png';

import ArticlesPublicationBack from '../../assets/articles-publication/articles-publication-back.svg';
import ArticlesPublicationNext from '../../assets/articles-publication/articles-publication-next.svg';
import ArticlesPublicationBold from '../../assets/articles-publication/articles-publication-bold.svg';
import ArticlesPublicationItalic from '../../assets/articles-publication/articles-publication-italic.svg';
import ArticlesPublicationTextLeft from '../../assets/articles-publication/articles-publication-text-left.svg';
import ArticlesPublicationTextCenter from '../../assets/articles-publication/articles-publication-text-center.svg';
import ArticlesPublicationTextRight from '../../assets/articles-publication/articles-publication-text-right.svg';

import { faqInterface } from '../../types/faqInterface';

const ArticlesPublication = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const shortDescriptionRef = useRef<HTMLDivElement>(null);
  const authorFullNameRef = useRef<HTMLInputElement>(null);
  const authorEmailRef = useRef<HTMLInputElement>(null);
  const topicRef = useRef<HTMLInputElement>(null);

  const [contentRefActive, setContentRefActive] = useState(false);
  const [topicRefActive, setTopicRefActive] = useState(false);

  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    authorFullName: '',
    authorEmail: '',
    topic: '',
    shortDescription: '',
    content: '',
  });

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Публикации', href: '/publications' },
    { name: 'Публикация статей', href: '/articles-publication' },
  ];

  const execCommand = (command: string, value?: string) => {
    if (value !== null && value !== undefined) {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      authorFullName: '',
      authorEmail: '',
      topic: '',
      shortDescription: '',
      content: '',
    };

    if (!authorFullNameRef.current?.value.trim()) {
      newErrors.authorFullName = 'Пожалуйста, введите ваше полное имя';
    }

    if (!authorEmailRef.current?.value.trim()) {
      newErrors.authorEmail = 'Пожалуйста, введите ваш e-mail';
    } else if (!/\S+@\S+\.\S+/.test(authorEmailRef.current?.value)) {
      newErrors.authorEmail = 'Пожалуйста, введите корректный e-mail';
    }

    if (!topicRef.current?.value.trim()) {
      newErrors.topic = 'Пожалуйста, введите название статьи';
    }

    if (shortDescriptionRef.current) {
      if (!shortDescriptionRef.current.innerHTML.trim()) {
        newErrors.shortDescription = 'Пожалуйста, введите краткое описание статьи';
      } else if (shortDescriptionRef.current.innerHTML.length > 1200) {
        newErrors.shortDescription = 'Краткое описание статьи не должно превышать 1200 символов';
      }
    }

    if (contentRef.current) {
      if (!contentRef.current.innerHTML.trim()) {
        newErrors.content = 'Пожалуйста, введите текст статьи';
      }
    }

    setErrors(newErrors);

    return Object.values(newErrors).every(error => !error);
  };



  const handleSubmit = async () => {
    if (validateForm()) {
      if (
        authorEmailRef.current &&
        authorFullNameRef.current &&
        topicRef.current &&
        contentRef.current &&
        shortDescriptionRef.current
      ) {
        const payload = {
          author_email: authorEmailRef.current.value,
          author_full_name: authorFullNameRef.current.value,
          topic: topicRef.current.value,
          short_description: shortDescriptionRef.current.innerHTML,
          text: contentRef.current.innerHTML,
        };

        setIsSubmitting(true);

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

          const response = await fetch(`${apiBaseUrl}/api/v1/publications/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': dataToken.csrf_token,
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          openModal();

          // Очистка полей после успешной отправки
          authorEmailRef.current.value = '';
          authorFullNameRef.current.value = '';
          topicRef.current.value = '';
          shortDescriptionRef.current.innerHTML = '';
          contentRef.current.innerHTML = '';

          setContentRefActive(false);
          setTopicRefActive(false);

          console.log('Success:', data);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsSubmitting(false);  // Разблокировать кнопку после завершения
        }
      }
    }
  };


  const [questions, setQuestions] = useState<faqInterface[]>([]);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/faq/?category=ARTICLES_PUBLICATION`);
        const data = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const handleContentInput = () => {
      if (contentRef.current) {
        if (contentRef.current.innerHTML.length > 0) {
          setErrors(prevErrors => ({
            ...prevErrors,
            content: '',
          }));
        }
        setContentRefActive(!!contentRef.current.innerHTML.trim());
      }
    };

    const handleShortDescriptionInput = () => {
      if (shortDescriptionRef.current) {
        if (shortDescriptionRef.current.innerHTML.length > 1200) {
          setErrors(prevErrors => ({
            ...prevErrors,
            shortDescription: 'Краткое описание статьи не должно превышать 1200 символов',
          }));
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            shortDescription: '',
          }));
        }
        setTopicRefActive(!!shortDescriptionRef.current.innerHTML.trim());
      }
    };

    if (contentRef.current) {
      contentRef.current.addEventListener('input', handleContentInput);
    }
    if (shortDescriptionRef.current) {
      shortDescriptionRef.current.addEventListener('input', handleShortDescriptionInput);
    }

    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener('input', handleContentInput);
      }
      if (shortDescriptionRef.current) {
        shortDescriptionRef.current.removeEventListener('input', handleShortDescriptionInput);
      }
    };
  }, []);



  const openModal = () => {
    setIsFirstModalOpen(true);
  };

  const closeModal = () => {
    setIsFirstModalOpen(false);
  };

  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <section className={`${globalStyles.section_padding} ${styles.articles_publication}`}>
      <div className={globalStyles.container}>
        <Breadcrumbs links={breadcrumbLinks} />

        <form
          className={styles.articles_publication__form}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h2 className={globalStyles.title}>Публикация статей на сайте для педагогов и воспитателей</h2>

          <div className={styles.articles_publication__content}>
            <div className={styles.articles_publication__form_content}>
              <div className={`${styles.articles_publication__text} ${styles.articles_publication__text_max_width}`}>
                Чтобы опубликовать свою работу на сайте заполните форму ниже, прикрепите материал в формате Word и задайте краткое описание статьи. <br />
                После публикации статьи вы можете заказать свидельство в <a onClick={() => handleLinkClick("/cab-issue")}>личном кабинете</a>.
              </div>
              <div className={styles.articles_publication__form_inputs}>
                <input
                  className={styles.articles_publication__form_input}
                  type="text"
                  placeholder='Ваша фамилия, имя, отчество'
                  ref={authorFullNameRef}
                />
                {errors.authorFullName && <p className={styles.error}>{errors.authorFullName}</p>}
                <input
                  className={styles.articles_publication__form_input}
                  type="email"
                  placeholder='Ваш e-mail'
                  ref={authorEmailRef}
                />
                {errors.authorEmail && <p className={styles.error}>{errors.authorEmail}</p>}
                <input
                  className={styles.articles_publication__form_input}
                  type="text"
                  placeholder='Название статьи'
                  ref={topicRef}
                />
                {errors.topic && <p className={styles.error}>{errors.topic}</p>}
              </div>
            </div>

            <img src={ArticlesPublicationImg} alt="" width={581} height={428} />
          </div>

          <h3 className={styles.articles_publication__subtitle}>Текст статьи</h3>

          <div className={styles.editor}>
            <div className={styles.editor__buttons}>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('undo')}>
                <img src={ArticlesPublicationBack} alt="" width={48} height={52} />
              </button>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('redo')}>
                <img src={ArticlesPublicationNext} alt="" width={48} height={52} />
              </button>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('bold')}>
                <img src={ArticlesPublicationBold} alt="" width={22} height={51} />
              </button>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('italic')}>
                <img src={ArticlesPublicationItalic} alt="" width={11} height={51} />
              </button>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('justifyLeft')}>
                <img src={ArticlesPublicationTextLeft} alt="" width={39} height={32} />
              </button>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('justifyCenter')}>
                <img src={ArticlesPublicationTextCenter} alt="" width={39} height={32} />
              </button>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('justifyRight')}>
                <img src={ArticlesPublicationTextRight} alt="" width={39} height={32} />
              </button>
            </div>
            <SimpleBar style={{ maxHeight: 400 }}>
              <div
                className={`${styles.editor__content} ${contentRefActive ? styles.editor__content_active : ''}`}
                contentEditable
                ref={contentRef}
                style={{ padding: '42px 41px', minHeight: '400px' }}
              ></div>
            </SimpleBar>
            {errors.content && <p className={styles.error}>{errors.content}</p>}
          </div>

          <h3 className={styles.articles_publication__subtitle}>Краткое описание статьи</h3>

          <div className={styles.editor}>
            <div className={styles.editor__buttons}>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('undo')}>
                <img src={ArticlesPublicationBack} alt="" width={48} height={52} />
              </button>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('redo')}>
                <img src={ArticlesPublicationNext} alt="" width={48} height={52} />
              </button>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('bold')}>
                <img src={ArticlesPublicationBold} alt="" width={22} height={51} />
              </button>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('italic')}>
                <img src={ArticlesPublicationItalic} alt="" width={11} height={51} />
              </button>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('justifyLeft')}>
                <img src={ArticlesPublicationTextLeft} alt="" width={39} height={32} />
              </button>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('justifyCenter')}>
                <img src={ArticlesPublicationTextCenter} alt="" width={39} height={32} />
              </button>
              <button className={globalStyles.btn_reset} type="button" onClick={() => execCommand('justifyRight')}>
                <img src={ArticlesPublicationTextRight} alt="" width={39} height={32} />
              </button>
            </div>
            <SimpleBar style={{ maxHeight: 400 }}>
              <div
                className={`${styles.editor__content} ${topicRefActive ? styles.editor__content_active : ''}`}
                contentEditable
                ref={shortDescriptionRef}
                style={{ padding: '42px 41px', minHeight: '400px' }}
              ></div>
            </SimpleBar>
            {errors.shortDescription && <p className={styles.error}>{errors.shortDescription}</p>}
          </div>

          <button
            className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.articles_publication__btn}`}
            type="submit"
            disabled={isSubmitting}  // Блокировка кнопки во время отправки
          >
            Опубликовать статью на сайте
          </button>

        </form>

        <style>{`
              .simplebar-track.simplebar-vertical {
                width: 20px !important;
                background-color: #DADADA !important;
                border-radius: 10px !important;
              }
              .simplebar-scrollbar {
                left: -1px !important;
              }
              .simplebar-scrollbar::before {
                background-color: #FB998A !important;
                width: 20px !important;
                border-radius: 10px !important;
                opacity: 1 !important;
              }
  
        `}</style>

        <div className={styles.articles_publication__articles}>
          <article className={styles.articles_publication__article}>
            <h2 className={`${globalStyles.title} ${styles.articles_publication__article_title}`}>Публикация статей на сайте для педагогов и воспитателей</h2>
            <p className={styles.articles_publication__article_descr}>
              Если у вас есть авторские материалы, которые вы хотите опубликовать в интернете и при этом получить свидетельство о своей публикации, тогда вы сделали верное решение зайдя на наш педагогический портал. Мы предлагаем педагогам и воспитателям опубликовать свои материалы на нашем сайте, который специально предоставлен для обмена опытом между педагогами и воспитателями.
              <br /><br />
              Опубликовав материалы вам не нужно будет выжидать несколько дней, вы моментально получаете сертификат о публикации на нашем педагогическом портале «Солнечный свет». К публикации наш портал принимает:
              <br /><br />
              Дидактические материалы;

              <ul>
                <li>Конспекты уроков;</li>
                <li>Образовательные и научные статьи;</li>
                <li>Методические планы;</li>
                <li>Сценарии утренников, праздничных концертов и так далее;</li>
                <li>Презентации и многие другие авторские работы.</li>
              </ul>
              <br />
              Оформление работ также должно соответствовать определенным требованиям, таким как:
              <br /><br />
              <ul>
                <li>Все текстовые материалы должны быть оформлены в виде документа Microsoft Word.</li>
                <li>Шрифт документа должен быть оформлен в Times New Roman.</li>
                <li>Размер шрифта должен соответствовать 12 или 14-му кеглю.</li>
                <li>Материал публикации должен быть уникальным, авторским, не скопированным с другого ресурса.</li>
              </ul>
              <br />
              Для публикации статьи необходимо заполнить небольшой бланк, в котором нужно ввести свое имя, свою электронную почту, а также тему статьи. После чего необходимо будет прикрепить документ к данному бланку и собственно отослать его на сайт портала.
            </p>
          </article>
          <article className={styles.articles_publication__article}>
            <h2 className={`${globalStyles.title} ${styles.articles_publication__article_title}`}>Получить сертификат о публикации статьи на портале «Росмедаль»</h2>
            <p className={styles.articles_publication__article_descr}>
              В настоящее время опубликованные статьи являются одними из самых ценных для учителей, воспитателей и научных руководителей. Статьи опубликованные в интернете могут найти все, научный или педагогический ресурс, позволяет находить статьи и собственно набираться опыта от других педагогов. На нашем сайте представлено много статей, которые отвечают преподавательской деятельности.
              <br /><br />
              Здесь вы можете пройти творческий конкурс, и выигрышные статьи будут опубликованы. Для того чтобы опубликовать и собственно получить сертификат за публикацию статьи, вам необходимо будет оплатить оргвзнос в размере около сотни рублей. Невысокая стоимость за мгновенное получение сертификата.
              <br /><br />
              Зайдя в свой личный кабинет и оплатив оргвзнос вы можете создать свое свидетельство и не выжидать несколько дней, а можете его получить сразу же скачав на свой персональный компьютер. Таким образом вы делитесь своими наработками, которые имеют авторский статус, и получаете свидетельство о публикации статьи на нашем педагогическом портале Солнечный свет.
            </p>
          </article>
        </div>

        <h2 className={`${globalStyles.title} ${styles.articles_publication__faq_title}`}>Часто задаваемые вопросы</h2>

        <Faq accordionItems={questions} />

        <Feedback />

      </div>

      <ModalComponent
        isOpen={isFirstModalOpen}
        onRequestClose={closeModal}
        content={
          <div className={globalStyles.products_choice__subjects_modal_content}>
            <h3 className={`${globalStyles.products_choice__aside_title} ${globalStyles.products_choice__publications_modal_title}`}>Успешно!</h3>
            <p className={globalStyles.products_choice__publications_modal_descr}>Публикация успешно создана! Проверьте Вашу почту.</p>
          </div>
        }
        customClassName={globalStyles.products_choice__publications_modal}
      />

    </section>
  );
};

export default ArticlesPublication;
