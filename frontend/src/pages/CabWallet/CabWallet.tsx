import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import AuthService from '../../services/AuthService';

import globalStyles from '../../App.module.sass';
import cabIssueStyles from '../CabIssue/CabIssue.module.sass';
import styles from './CabWallet.module.sass';
import documentsStyles from '../CabDocuments/CabDocuments.module.sass';

import Feedback from '../../components/Feedback/Feedback';
import CabAside from '../../components/CabAside/CabAside';

import CabWalletBonusFile from '../../assets/cab-wallet/cab-wallet-bonus-file.svg';

interface ISubscriptions {
  results: ISubscriptionsInf[];
}

interface ISubscriptionsInf {
  id: number;
  title: string;
  price: string;
  duration: number;
}

interface Referral {
  email: string;
}

interface FormData {
  id: number;
  active_subscription: { end_date: string };
  balance: string;
  bonus_balance: string;
  number_of_coupons: string;
  referrals: Referral[];
}

const CabWallet = () => {

  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = AuthService.getAccessToken();

  const [balanceInfActive, setBalanceInfActive] = useState(false);
  const [sum, setSum] = useState('');

  const [formData, setFormData] = useState<FormData>({
    id: 0,
    active_subscription: { end_date: '' },
    balance: '',
    bonus_balance: '',
    number_of_coupons: '',
    referrals: [],  // Начальное значение - пустой массив
  });

  const [currentContent, setCurrentContent] = useState(1);

  const [subscriptions, setSubscriptions] = useState<ISubscriptions | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const url = `${apiBaseUrl}/api/v1/cab/user`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        setFormData({
          id: data.id !== null ? data.id : 0,
          active_subscription: data.active_subscription !== null
            ? { end_date: data.active_subscription.end_date }
            : { end_date: '' },
          balance: data.balance !== null ? data.balance : '',
          bonus_balance: data.bonus_balance !== null ? data.bonus_balance : '',
          number_of_coupons: data.number_of_coupons !== null ? data.number_of_coupons : '',
          referrals: data.referrals !== null ? data.referrals : [],  // Используем пустой массив, если null
        });


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const fetchDataSubscriptions = async () => {
      const url = `${apiBaseUrl}/api/v1/subscriptions`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ISubscriptions = await response.json();
        setSubscriptions(data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataSubscriptions();
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setSum(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const replenishBody = {
      amount: +sum
    };

    // Отправка обновленных данных на сервер
    fetch(`${apiBaseUrl}/api/v1/cab/balance/replenish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(replenishBody),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        window.open(data.confirmation.confirmation_url, '_blank');
        alert('Завершите оплату через ЮKassa!');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const [payFromBalance, setPayFromBalance] = useState(false);
  const [yookassaChecked, setYookassaChecked] = useState(true);
  const [balanceChecked, setBalanceChecked] = useState(false);

  const handleSubscriptionPurchase = (e, id) => {
    e.preventDefault();

    const subscriptionBody = {
      subscription: id,
      from_balance: payFromBalance
    };

    fetch(`${apiBaseUrl}/api/v1/cab/subscriptions/purchase`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionBody),
    })
      .then(response => {
        if (!response.ok) { // проверяем, если ответ не ок (код 200-299)
          if (response.status === 400) {
            throw new Error('Недостаточно средств! Пополните баланс!'); // генерируем исключение с сообщением
          }
          throw new Error('Произошла ошибка при выполнении запроса.');
        }
        return response.json(); // если все ок, парсим JSON
      })
      .then(data => {
        console.log('Success:', data);
        if (data.confirmation) {
          window.open(data.confirmation.confirmation_url, '_blank');
          alert('Завершите оплату через ЮKassa!');
        } else {
          alert('Подписка успешно оплачена!');
          window.location.reload();
        }
      })
      .catch(error => {
        alert(error.message); // выводим сообщение об ошибке
      });

  };

  const generateEmailsString = (referrals) => {
    return referrals.map(referral => referral.email).join('<br>');
  };

  const accordionItems = [
    {
      id: 1,
      question: 'Ваши рефералы:',
      answer: formData.referrals.length > 0 ? generateEmailsString(formData.referrals) : 'Нет рефералов',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [height, setHeight] = useState<number>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleAccordionClick = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
      setHeight(0); // Сброс высоты при закрытии
    } else {
      setOpenIndex(index);
      if (contentRefs.current[index]) {
        setHeight(contentRefs.current[index]!.scrollHeight);
      }
    }
  };

  useEffect(() => {
    if (openIndex !== null && contentRefs.current[openIndex]) {
      setHeight(contentRefs.current[openIndex]!.scrollHeight);
    }
  }, [openIndex]);

  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string>('');

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFile = e.target.files ? e.target.files[0] : null;
    setFile(chosenFile);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    let hasError = false;

    // Проверка URL
    if (!validateUrl(url)) {
      setError('Введите правильный URL!');
      hasError = true;
    } else {
      setError('');
    }

    // Проверка файла
    if (file === null) {
      setFileError('Прикрепите файл!');
      hasError = true;
    } else {
      setFileError('');
    }

    if (hasError) {
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append('link', url);
    formDataToSend.append('user', `${formData.id}`);

    if (file !== null) {
      formDataToSend.append('image', file);
    }

    fetch(`${apiBaseUrl}/api/v1/cab/reviews/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formDataToSend
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Данные успешно изменены!');

        setUrl('');
        setFile(null);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const [url, setUrl] = useState<string>(''); // Состояние для URL
  const [error, setError] = useState<string>(''); // Состояние для ошибки

  const validateUrl = (inputUrl: string) => {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)' + // обязательно наличие http или https
      '((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|' + // доменные имена
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // IP (v4) адрес
      '(\\:\\d+)?(\\/[-a-zA-Z0-9@:%._\\+~#=]*)*' + // порт и путь
      '(\\?[;&a-zA-Z0-9@:%_\\+.~#?&//=]*)?' + // параметры
      '(\\#[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?$', 'i' // якорь
    );
    return urlPattern.test(inputUrl);
  };

  const [refEmail, setRefEmail] = useState(''); // Состояние для URL

  const handleSubmitRef = (e) => {
    e.preventDefault();

    const replenishBody = {
      email: refEmail
    };

    // Отправка данных на сервер
    fetch(`${apiBaseUrl}/api/v1/cab/referral/invite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(replenishBody),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            // Отображение сообщения об ошибке из ответа
            const errorMessage = errorData.email ? errorData.email.join(", ") : 'Произошла ошибка';
            alert(errorMessage);
            throw new Error(errorMessage); // Останавливаем дальнейшую обработку
          });
        }
        // Успешный статус без содержимого
        alert('Приглашение успешно отправлено!');
        setRefEmail('');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };



  const renderContent = () => {
    return (
      <>
        {currentContent === 1 &&
          <div className={styles.cab_wallet__block}>
            <h3 className={styles.cab_wallet__subtitle}>У вас на балансе {Math.floor(+formData.balance)} руб.</h3>
            <div className={styles.cab_wallet__text}>Пополнение баланса</div>

            <div className={styles.cab_wallet__form}>
              <h3 className={styles.cab_wallet__form_title}>Укажите сумму, на которую вы хотите пополнить свой баланс</h3>
              <input className={globalStyles.cab_input} type="number" placeholder='Укажите сумму:' min={1} required value={sum} onChange={handleChange} />
              <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_wallet__form_btn}`}
                onClick={() => {
                  if (sum.length === 0) {
                    setSum('1');
                  }
                  setBalanceInfActive(true);
                }}
              >Пополнить баланс</button>
            </div>

            {balanceInfActive && (
              <div className={styles.cab_wallet__balance_wrapper}>
                <form className={styles.cab_wallet__balance_val} onSubmit={(e) => handleSubmit(e)}>
                  <button className={`${globalStyles.btn_reset} ${styles.cab_wallet__close}`} onClick={() => {
                    setSum('');
                    setBalanceInfActive(false);
                  }}></button>
                  <ul className={`${globalStyles.list_reset} ${styles.cab_wallet__balance_list}`}>
                    <li className={styles.cab_wallet__balance_item}>
                      Описание:
                      <span>Заказ balance_66349</span>
                    </li>
                    <li className={styles.cab_wallet__balance_item}>
                      Сумма:
                      <span>{(+sum).toFixed(2).replace('.', ',')} RUB</span>
                    </li>
                  </ul>
                  <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_wallet__form_btn} ${styles.cab_wallet__balance_btn}`}>Перейти к оплате</button>
                  <div className={styles.cab_wallet__balance_links}>
                    <span className={styles.cab_wallet__balance_link}
                      onClick={() => handleLinkClick('/payment-delivery')}
                    >Ознакомиться с правилами оплаты онлайн</span>
                    <span className={styles.cab_wallet__balance_link}
                      onClick={() => handleLinkClick('/public-offer')}
                    >Скачать договор оферты</span>
                  </div>
                </form>
                <div className={styles.cab_wallet__balance_inf}>
                  <div className={styles.cab_wallet__balance_inf_block}>
                    <h4 className={styles.cab_wallet__balance_inf_title}>Все платежи на сайте абсолютно безопасны</h4>
                    <p className={styles.cab_wallet__balance_inf_descr}>
                      Мы не храним данные Вашей карты, мы создаем безопасное зашифрованное соединение с платежной системой, на стороне которой Вы вводите данные банковской карты.
                    </p>
                  </div>
                  <div className={styles.cab_wallet__balance_inf_block}>
                    <h4 className={styles.cab_wallet__balance_inf_title}>Для обеспечения безопасности платежей мы используем:</h4>
                    <ul className={styles.cab_wallet__balance_inf_list}>
                      <li className={styles.cab_wallet__balance_inf_descr}>безопасные/зашифрованные интернет-соединения</li>
                      <li className={styles.cab_wallet__balance_inf_descr}>стандарт безопасности данных индустрии платёжных карт — PCI DSS</li>
                      <li className={styles.cab_wallet__balance_inf_descr}>клиентская защита</li>
                      <li className={styles.cab_wallet__balance_inf_descr}>осуществление доступа в систему по зашифрованному протоколу HTTPS/SSL</li>
                      <li className={styles.cab_wallet__balance_inf_descr}>защита при пересылке платежных сообщений</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        }
        {currentContent === 2 &&
          <div>
            {formData.active_subscription.end_date.length > 0 ? (
              <div className={`${styles.cab_wallet__subscribe} ${styles.cab_wallet__subscribe_active}`}>
                Подписка активна до {new Date(formData.active_subscription.end_date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
              </div>
            ) : (
              <div className={styles.cab_wallet__subscribe}>
                Подписка не активирована
              </div>
            )}

            <h2 className={styles.cab_wallet__subscribe_title}>Преимущества подписки:</h2>
            <div className={styles.cab_wallet__subscribe_benefits}>
              <div className={`${globalStyles.bg_green} ${styles.cab_wallet__subscribe_benefit}`}>
                Скидка 250₽ на курс КПК или 500₽ на курс КПП
              </div>
              <div className={`${globalStyles.bg_purple} ${styles.cab_wallet__subscribe_benefit}`}>
                1 сертификат за участие в любом мероприятии - 0₽
              </div>
              <div className={`${globalStyles.bg_blue} ${styles.cab_wallet__subscribe_benefit}`}>
                Разработки уроков, документы, шаблоны - 0 руб
              </div>
              <div className={`${globalStyles.bg_red} ${styles.cab_wallet__subscribe_benefit}`}>
                Эксклюзивная рассылка с экспертными статьями
              </div>
            </div>
            <label className={`${cabIssueStyles.cab_issue__diplomas_label_wrapper} ${cabIssueStyles.cab_issue__diplomas_label_wrapper_docs}`}>
              <div className={`${cabIssueStyles.cab_issue__diplomas_checkbox} ${yookassaChecked ? cabIssueStyles.cab_issue__diplomas_checkbox_active : ''}`}>
                <input
                  type="checkbox"
                  checked={yookassaChecked}
                  onChange={() => {
                    setYookassaChecked(true);
                    setBalanceChecked(false);
                    setPayFromBalance(false);
                  }}
                />
              </div>
              <span>Оплата через ЮKassa</span>
            </label>
            <label className={`${cabIssueStyles.cab_issue__diplomas_label_wrapper} ${cabIssueStyles.cab_issue__diplomas_label_wrapper_docs}`}>
              <div className={`${cabIssueStyles.cab_issue__diplomas_checkbox} ${balanceChecked ? cabIssueStyles.cab_issue__diplomas_checkbox_active : ''}`}>
                <input
                  type="checkbox"
                  checked={balanceChecked}
                  onChange={() => {
                    setBalanceChecked(true);
                    setYookassaChecked(false);
                    setPayFromBalance(true);
                  }}
                />
              </div>
              <span>Оплата с кошелька</span>
            </label>
            <h3 className={styles.cab_wallet__subscribe_subtitle}>Выберите длительность подписки</h3>
            <ul className={`${globalStyles.list_reset} ${styles.cab_wallet__subscribe_blocks}`}>
              {subscriptions?.results && subscriptions.results.map(subscription => (
                <li className={styles.cab_wallet__subscribe_block} key={subscription.id}>
                  <h4 className={styles.cab_wallet__subscribe_block_title}>{subscription.title}</h4>
                  <div className={styles.cab_wallet__subscribe_block_label}>
                    на {subscription.duration} {
                      subscription.duration === 1
                        ? 'месяц'
                        : (subscription.duration >= 2 && subscription.duration <= 4)
                          ? 'месяца'
                          : 'месяцев'
                    }
                  </div>
                  <div className={styles.cab_wallet__subscribe_block_price}>{Math.floor(+subscription.price)}₽</div>
                  <button
                    className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_wallet__subscribe_block_btn}`}
                    onClick={(e) => handleSubscriptionPurchase(e, subscription.id)}
                  >
                    Оформить на {subscription.duration} {
                      subscription.duration === 1
                        ? 'месяц'
                        : (subscription.duration >= 2 && subscription.duration <= 4)
                          ? 'месяца'
                          : 'месяцев'
                    }
                  </button>
                </li>
              ))}
            </ul>
          </div>
        }
        {currentContent === 3 &&
          <div>
            <div className={`${styles.cab_wallet__subscribe_subtitle} ${styles.cab_wallet__subscribe_subtitle_margin}`}>
              Бонусы начисляются за подписку на сайте и за каждый диплом, который был оплачен приглашенным Вами другом. Как только в вашем личном кабинете будет накоплено 100 бонусов, Вы сможете получить любой диплом бесплатно.
            </div>
            <div className={`${styles.cab_wallet__subscribe} ${styles.cab_wallet__subscribe_active} ${styles.cab_wallet__subscribe_bonus}`}>
              На вашем счете <span>{Math.floor(+formData.bonus_balance)}</span> бонусных руб.
            </div>
            <h2 className={`${styles.cab_wallet__subscribe_subtitle} ${styles.cab_wallet__subscribe_subtitle_margin}`}>Вам доступно:</h2>
            <ul className={`${globalStyles.list_reset} ${styles.cab_wallet__bonus_list}`}>
              <li className={styles.cab_wallet__bonus_item}>
                {Math.floor(+formData.bonus_balance / 100)}
                <span>бесплатных дипломов</span>
              </li>
              <li className={styles.cab_wallet__bonus_item}>
                {formData.number_of_coupons}
                <span>купонов</span>
              </li>
            </ul>
            <ul className={`${globalStyles.list_reset} ${globalStyles.accordion__list} ${documentsStyles.cab_documents__accordion_list} ${documentsStyles.cab_documents__accordion_list_full_width}`}>
              {accordionItems.map((item, index) => (
                <li key={item.id} className={`${openIndex === index ? 'open' : ''}`}>
                  <button
                    className={`${globalStyles.btn_reset} ${globalStyles.accordion__control} ${documentsStyles.cab_documents__accordion_control}`}
                    onClick={() => handleAccordionClick(index)}
                    aria-expanded={openIndex === index}
                  >
                    <span className={`${globalStyles.accordion__title} ${documentsStyles.cab_documents__accordion_title}`}>
                      {item.question}
                    </span>
                    <span className={`${globalStyles.accordion__icon} ${documentsStyles.cab_documents__accordion_icon}`}>
                      <span
                        className={globalStyles.line}
                        style={{
                          transform: openIndex === index ? 'translate(-50%, -50%) rotate(90deg)' : 'translate(-50%, -50%)',
                        }}
                      ></span>
                    </span>
                  </button>
                  <div
                    className={`${globalStyles.accordion__content} ${documentsStyles.cab_documents__accordion_content}`}
                    aria-hidden={openIndex !== index}
                    ref={el => contentRefs.current[index] = el}
                    style={{
                      maxHeight: openIndex === index ? height : 0,
                      opacity: openIndex === index ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 0.3s ease',
                      padding: openIndex === index ? '30px 0 0' : '0',
                    }}
                  >
                    <div
                      className={`${documentsStyles.cab_documents__accordion_inner} ${styles.cab_wallet__documents_accordion_inner}`}
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.cab_wallet__separator}></div>

            <h2 className={`${styles.cab_wallet__subscribe_title} ${styles.cab_wallet__subscribe_title_text_initial}`}>Как получить ещё бонусы</h2>

            <h3 className={`${styles.cab_wallet__subscribe_subtitle} ${styles.cab_wallet__subscribe_subtitle_bonus}`}>Оставьте отзыв о нашем сайте и получите бонусы!</h3>

            <div className={styles.cab_wallet__bonus_descr}>
              Разместите отзыв о портале на одной из площадок, таких как otzovik, irecommend, яндекс. После этого сделайте скриншот Вашего сообщения и пришлите нам ссылку на страницу с отзывом. Пожалуйста, ознакомьтесь с условиями акции, чтобы узнать подробности. Если возникнут вопросы о том, как сделать ссылку на скриншот, ознакомьтесь с инструкцией. После того, как Вы отправите отзыв, проверка его займет 5 рабочих дней. После проверки мы начислим вам 140 бонусов.
            </div>

            <div className={styles.cab_wallet__bonus_container}>
              <div className={styles.cab_wallet__bonus_input_wrapper}>
                <div className={styles.cab_wallet__bonus_subtitle}>Прикрепите ссылку на отзыв</div>
                <input
                  className={globalStyles.cab_input}
                  type="text"
                  placeholder="Ссылка на отзыв"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                {error && <div style={{ color: 'red' }}>{error}</div>}
              </div>

              <form className={styles.cab_wallet__bonus_review} onSubmit={handleReviewSubmit}>
                <div className={styles.cab_wallet__bonus_subtitle}>Прикрепите скриншот отзыва</div>

                <div
                  className={`${styles.cab_wallet__bonus_review_file} ${isDragOver ? styles.drag_over : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <img src={CabWalletBonusFile} alt="" width={48} height={48} />
                  <div className={styles.cab_wallet__bonus_file_content}>
                    <div className={styles.cab_wallet__bonus_file_text}>
                      {file ? (
                        <p>{file.name}</p>
                      ) : (
                        <>
                          Перетащите файл сюда
                          <span> или </span>
                        </>
                      )}
                    </div>
                    <label htmlFor="file-upload" className={`${globalStyles.btn_reset} ${styles.cab_wallet__bonus_btn}`}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9.49865 6.59485L9.49865 6.59489H9.50519H12.9621V12.4699C12.9621 12.8037 12.8295 13.1238 12.5934 13.3599C12.3574 13.5959 12.0373 13.7285 11.7035 13.7285H4.22932C3.89552 13.7285 3.57538 13.5959 3.33934 13.3599C3.10331 13.1238 2.9707 12.8037 2.9707 12.4699V3.23714C2.9707 2.90333 3.10331 2.58319 3.33934 2.34716C3.57538 2.11112 3.89552 1.97852 4.22932 1.97852H8.3457V5.43541H8.34566L8.34575 5.44195C8.34973 5.74648 8.47247 6.03742 8.68783 6.25277C8.90318 6.46813 9.19412 6.59087 9.49865 6.59485Z"
                          fill="white"
                          stroke="white"
                          stroke-linecap="round"
                        />
                        <path
                          d="M10.261 4.55649V1.74269C10.2589 1.69898 10.2704 1.65569 10.294 1.61882C10.3176 1.58195 10.352 1.55332 10.3926 1.5369C10.4332 1.52048 10.4778 1.51708 10.5204 1.52717C10.563 1.53726 10.6014 1.56034 10.6303 1.59321L13.4617 4.39821C13.4936 4.42896 13.5155 4.46864 13.5245 4.51204C13.5335 4.55545 13.5291 4.60056 13.512 4.64145C13.4949 4.68234 13.4658 4.71709 13.4286 4.74116C13.3913 4.76523 13.3477 4.77748 13.3034 4.77631H10.4808C10.4225 4.77631 10.3666 4.75315 10.3254 4.71193C10.2841 4.6707 10.261 4.61479 10.261 4.55649Z"
                          fill="white"
                        />
                      </svg>
                      Выберите файл
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7.85572 2.7041L13.2499 7.85311M13.2499 7.85311L7.85572 13.0021M13.2499 7.85311L2.75 7.85311"
                          stroke="white"
                          stroke-width="1.40625"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </label>
                  </div>
                </div>

                {fileError && <div style={{ color: 'red' }}>{fileError}</div>}

                <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_wallet__bonus_file_btn}`}>Отправить отзыв</button>

              </form>
            </div>

            <div className={`${styles.cab_wallet__separator} ${styles.cab_wallet__separator_margin}`}></div>

            <h3 className={`${styles.cab_wallet__subscribe_subtitle} ${styles.cab_wallet__subscribe_subtitle_bonus}`}>Пригласите друга</h3>

            <div className={styles.cab_wallet__bonus_descr}>
              Хотите получать дипломы <span>абсолютно бесплатно?</span> Приглашайте друзей, знакомых, коллег по работе и получайте по 20 бонусов за каждый оплаченный ими диплом. <span>Накопив 100 бонусов</span>, Вы сможете получить диплом бесплатно!
            </div>

            <div className={styles.cab_wallet__bonus_container}>
              <form className={styles.cab_wallet__bonus_input_wrapper} onSubmit={handleSubmitRef}>
                <div className={styles.cab_wallet__bonus_subtitle}>Введите адрес электронной почты друга, которого вы хотите пригласить:</div>
                <input className={globalStyles.cab_input} type="email" placeholder='e-mail друга' value={refEmail} onChange={(e) => setRefEmail(e.target.value)} required />
                <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_wallet__bonus_file_btn}`}>Пригласить</button>
              </form>
            </div>

            <h3 className={`${styles.cab_wallet__subscribe_subtitle} ${styles.cab_wallet__subscribe_subtitle_bonus}`}>Не получается отправить email?</h3>

            <div className={styles.cab_wallet__bonus_descr}>
              Для того, чтобы получать бонусы необходимо: <br />
              <div className={styles.cab_wallet__bonus_descr_padding}>
                2. В поле выше ввести адрес электронной почты приглашаемого друга <br />
                3. Другу будет отправлено письмо на почту с приглашением и ссылкой на сайт. <br />
                4. После того, как он пройдет по этой ссылке и введет адрес электронной почты в правом верхнем углу ("Войти в личный кабинет"), он автоматически будет считаться системой как приглашенный Вами. С этого момента Вы будете получать бонусы с каждого оплаченного диплома Вашим другом
              </div>
            </div>

            <div className={`${styles.cab_wallet__separator} ${styles.cab_wallet__separator_margin_none}`}></div>

          </div>
        }
      </>
    );
  };

  return (
    <section className={`${globalStyles.section_padding}`}>
      <div className={globalStyles.container}>

        <div className={globalStyles.cab_container}>
          <CabAside />

          <div className={globalStyles.cab_content}>
            <h2 className={globalStyles.cab_title}>Мой кошелек</h2>

            <div className={globalStyles.cab_blocks}>
              <div className={`${globalStyles.cab_block} ${styles.cab_wallet__block}`}>

                <div className={styles.cab_wallet__btns}>
                  <button className={`${globalStyles.btn_reset} ${globalStyles.bg_red} ${styles.cab_wallet__btn} ${currentContent === 1 ? styles.cab_wallet__btn_active : ''}`} onClick={() => setCurrentContent(1)}>Мой кошелек</button>
                  <button className={`${globalStyles.btn_reset} ${globalStyles.bg_green} ${styles.cab_wallet__btn} ${currentContent === 2 ? styles.cab_wallet__btn_active : ''}`} onClick={() => setCurrentContent(2)}>Подписка</button>
                  <button className={`${globalStyles.btn_reset} ${globalStyles.bg_purple} ${styles.cab_wallet__btn} ${currentContent === 3 ? styles.cab_wallet__btn_active : ''}`} onClick={() => setCurrentContent(3)}>Бонусы</button>
                </div>

                {renderContent()}

              </div>
            </div>
          </div>
        </div>


        <Feedback />
      </div>
    </section>
  );
};

export default CabWallet;
