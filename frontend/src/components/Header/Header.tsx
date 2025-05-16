import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import globalStyles from "../../App.module.sass";
import styles from "./Header.module.sass";

import { AuthContext } from '../../context/AuthContext';
import AuthService from '../../services/AuthService';

import Logo from "../../assets/images/logo.svg";
import HeaderSaleGift from '../../assets/header-sale/header-sale-gift.png';
import HeaderSaleDoc from '../../assets/header-sale/header-sale-doc.png';
import HeaderAuthBtn from '../../assets/header/header-auth-btn.svg';

interface HeaderProps {
  openFirstModal: () => void;
}

const navItems = [
  {
    title: "Курсы",
    titlePath: "/courses",
    subItems: [
      { title: "Повышения квалификации", path: "/courses/?variation=1#coursesChoice" },
      { title: "Профессиональной переподготовки", path: "/courses/?variation=2#coursesChoice" },
      { title: "По охране труда", path: "/courses/?variation=3#coursesChoice" },
      { title: "Обучение коллективов", path: "/corporate-training" },
    ],
  },
  {
    title: "Творческий конкурс",
    titlePath: "/creative-competition",
    subItems: [{ title: "Участвовать в конкурсе", path: "/creative-competition" }],
  },
  {
    title: "Олимпиады",
    titlePath: "/olympiads",
    subItems: [{ title: "Участвовать в олимпиаде", path: "/olympiads" }],
  },
  {
    title: "Публикации",
    titlePath: "/publications",
    subItems: [
      { title: "Публикация статьи на сайте", path: "/articles-publication" },
      { title: "Опубликованные материалы", path: "/published-materials" },
    ],
  },
  {
    title: "Другое",
    subItems: [
      { title: "Новости", path: "/news" },
      { title: "Акции", path: "/discounts" },
      { title: "Часто задаваемые вопросы", path: "/faq" },
      { title: "Оплата и доставка", path: "/payment-delivery" },
      { title: "Контакты", path: "/about#contacts" },
      { title: "Положения к мероприятиям", path: "/provisions" },
      { title: "О нас", path: "/about" },
    ],
  },
];

const Header: React.FC<HeaderProps> = ({ openFirstModal }) => {
  const [isDropdownActive, setIsDropdownActive] = useState(false); // Стейт для выпадающего меню
  const [isBurgerMenuActive, setIsBurgerMenuActive] = useState(false); // Стейт для бургер-меню

  const [openIndexes, setOpenIndexes] = useState<number[]>([]); // Открытые пункты аккордеона
  const dropdownRefs = useRef<(HTMLUListElement | null)[]>([]); // Ссылки на выпадающие списки

  const [formData, setFormData] = useState({ email: '' }); // Данные формы (email)
  const [avatar, setAvatar] = useState(''); // Аватар пользователя

  const navigate = useNavigate(); // Навигация
  const { pathname, search, hash } = useLocation(); // Текущий URL

  const authContext = useContext(AuthContext); // Контекст авторизации

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { isAuthenticated, logout } = authContext; // Авторизация и выход

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL; // Базовый URL API
  const token = AuthService.getAccessToken(); // Токен авторизации

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

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log(data);

        if (localStorage.getItem('refId')) {
          const body = {
            referrer: localStorage.getItem('refId'),
            referral: data.id,
          };

          fetch(`${apiBaseUrl}/api/v1/cab/referral/create`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
          })
            .then(() => localStorage.removeItem('refId'))
            .catch((error) => console.error('Error:', error));
        }

        setFormData({ email: data.email || '' }); // Установка email
        setAvatar(data.avatar); // Установка аватара

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (token) fetchData();
  }, []);

  // Component functions
  function handleLinkClick(path: string) {
    navigate(path);
  }

  function isSubPathActive(subItemsOrPath: { path: string }[] | string | undefined) {
    // Проверка активности подменю
    if (Array.isArray(subItemsOrPath)) {
      return subItemsOrPath.some(item => {
        const url = new URL(item.path, window.location.origin);
        return pathname === url.pathname && search === url.search && hash === url.hash;
      });
    }
    if (typeof subItemsOrPath === 'string') {
      const url = new URL(subItemsOrPath, window.location.origin);
      return pathname === url.pathname && search === url.search && hash === url.hash;
    }
    return false;
  }

  function toggleAccordion(index: number) {
    // Открытие/закрытие пункта аккордеона
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }

  return (
    <>
      <div className={styles.header_sale}>
        <div className={`${globalStyles.container} ${styles.header_sale__container}`}>
          <img src={HeaderSaleGift} alt="" aria-hidden={true} />
          <div className={styles.header_sale__text}>
            Сезонная скидка 41% на все курсы повышения <br /> квалификации и профессиональной переподготовки
          </div>
          <img src={HeaderSaleDoc} alt="" aria-hidden={true} />
          <button className={`${globalStyles.btn_reset} ${styles.header_sale__btn}`} onClick={() => handleLinkClick("/courses")}>Выбрать курс</button>
          <button className={`${globalStyles.btn_reset} ${styles.header_sale__close}`}></button>
        </div>
      </div>
      <header className={styles.header}>
        <div className={`${globalStyles.container} ${styles.header__content}`}>
          <div className={styles.header__logo}>
            <div className={styles.header__logo_img} onClick={() => handleLinkClick("/")}>
              <img src={Logo} alt="Логотип проекта Росмедаль" width={128} height={115} />
            </div>
          </div>

          <nav className={styles.header__nav}>
            <ul className={`${globalStyles.list_reset} ${styles.header__nav_list}`}>
              {navItems.map((navItem, index) => (
                <li
                  key={index}
                  className={`${styles.header__nav_item} ${(navItem.subItems && isSubPathActive(navItem.subItems)) || isSubPathActive(navItem.titlePath) ? styles.header__nav_item_active : ""}`}
                >
                  <span onClick={navItem.titlePath ? () => handleLinkClick(navItem.titlePath) : undefined}>{navItem.title}</span>
                  {navItem.subItems && (
                    <ul className={`${globalStyles.list_reset} ${styles.header__dropdown}`}>
                      {navItem.subItems.map((subItem, subIndex) => (
                        <li className={styles.header__dropdown_item} key={subIndex} onClick={() => handleLinkClick(subItem.path)}>{subItem.title}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={`${globalStyles.search} ${styles.header__search}`}>
            <input className={globalStyles.search__input} type="text" placeholder="Поиск" />
            <button className={`${globalStyles.btn_reset} ${globalStyles.search__btn}`}></button>
          </div>

          {isAuthenticated ?
            <div className={styles.header__profile}>
              {avatar ? (
                <img src={avatar} alt="Фото профиля" width={44} height={44} style={{ borderRadius: '100%' }} />
              ) : (
                <div className={styles.cab_profile__block_img}></div>
              )}
              <div className={styles.header__profile_email}>{formData.email}</div>
              <button className={`${globalStyles.btn_reset} ${styles.header__profile_arrow}`} onClick={() => { setIsDropdownActive(!isDropdownActive) }}></button>

              <div className={`${isDropdownActive ? styles.header__profile_dropdown_active : ''} ${styles.header__profile_dropdown}`}>
                <button className={`${globalStyles.btn_reset} ${styles.header__profile_dropdown_btn}`} onClick={() => {
                  handleLinkClick("/cab-profile");
                  setIsDropdownActive(false);
                }}>Личный кабинет</button>
                <button className={`${globalStyles.btn_reset} ${styles.header__profile_dropdown_btn}`} onClick={() => {
                  logout();
                  setIsDropdownActive(false);
                }}>Выйти</button>
              </div>
            </div>
            :
            <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.header__btn}`} onClick={openFirstModal}>
              Войти
              <img src={HeaderAuthBtn} alt="" width={24} height={24} />
            </button>
          }

          <button className={`${globalStyles.btn_reset} ${globalStyles.burger} ${isBurgerMenuActive ? globalStyles.burger_active : ''}`}
            onClick={() => setIsBurgerMenuActive(!isBurgerMenuActive)}
          >
            <span className={globalStyles.burger__line}></span>
          </button>

          <div className={`${globalStyles.burger_menu} ${isBurgerMenuActive ? globalStyles.burger_menu_active : ''}`}>
            <div className={globalStyles.burger_menu__content}>
              <div className={`${styles.header__logo_text} ${styles.header__logo_text_adaptive}`}>
                Международный педагогический портал (лицензия на осуществление образовательной деятельности №9757-л, свидетельство о регистрации СМИ №ЭЛ ФС 77-65391)
              </div>
              {isAuthenticated ?
                <div className={`${styles.header__profile} ${styles.header__profile_adaptive}`}>
                  {avatar ? (
                    <img src={avatar} alt="Фото профиля" width={44} height={44} style={{ borderRadius: '100%' }} />
                  ) : (
                    <div className={styles.cab_profile__block_img}></div>
                  )}
                  <div className={styles.header__profile_email}>{formData.email}</div>
                  <button className={`${globalStyles.btn_reset} ${styles.header__profile_arrow}`} onClick={() => { setIsDropdownActive(!isDropdownActive) }}></button>

                  <div className={`${isDropdownActive ? styles.header__profile_dropdown_active : ''} ${styles.header__profile_dropdown}`}>
                    <button className={`${globalStyles.btn_reset} ${styles.header__profile_dropdown_btn}`} onClick={() => {
                      handleLinkClick("/cab-profile");
                      setIsDropdownActive(false);
                    }}>Личный кабинет</button>
                    <button className={`${globalStyles.btn_reset} ${styles.header__profile_dropdown_btn}`} onClick={() => {
                      logout();
                      setIsDropdownActive(false);
                    }}>Выйти</button>
                  </div>
                </div>
                :
                <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.header__btn} ${styles.header__btn_adaptive}`} onClick={openFirstModal}>Войти в личный кабинет</button>
              }
              <div className={`${globalStyles.search} ${styles.header__search} ${styles.header__search_adaptive}`}>
                <input className={globalStyles.search__input} type="text" placeholder="Поиск" />
                <button className={`${globalStyles.btn_reset} ${globalStyles.search__btn}`}></button>
              </div>

              <div className={globalStyles.burger_menu__list}>
                {navItems.map((navItem, index) => (
                  <div key={index} className={globalStyles.burger_menu__accordion_wrapper}>
                    <button
                      className={`${globalStyles.btn_reset} ${globalStyles.burger_menu__accordion}`}
                      onClick={() => toggleAccordion(index)}
                    >
                      <div
                        className={`${globalStyles.burger_menu__item} ${(navItem.subItems && isSubPathActive(navItem.subItems)) || isSubPathActive(navItem.titlePath) ? globalStyles.burger_menu__item_active : ""}`}
                      >
                        <span>{navItem.title}</span>
                      </div>
                    </button>
                    {navItem.subItems && (
                      <ul
                        ref={(el) => (dropdownRefs.current[index] = el)}
                        className={`${globalStyles.list_reset} ${globalStyles.burger_menu__dropdown}`}
                        style={{
                          maxHeight: openIndexes.includes(index)
                            ? `${dropdownRefs.current[index]?.scrollHeight || 0}px`
                            : "0",
                          overflow: "hidden",
                          transition: "max-height 0.3s ease",
                        }}
                      >
                        {navItem.subItems.map((subItem, subIndex) => (
                          <li
                            className={globalStyles.burger_menu__dropdown_item}
                            key={subIndex}
                            onClick={() => {
                              setIsBurgerMenuActive(false);
                              handleLinkClick(subItem.path);
                            }}
                          >
                            {subItem.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
