import { useContext } from 'react';
import { useNavigate } from "react-router-dom";

import globalStyles from "../../App.module.sass";
import styles from "./Footer.module.sass";

import { AuthContext } from '../../context/AuthContext';

import FooterLogo from "../../assets/footer/footer-logo.svg";
import FooterVK from "../../assets/footer/footer-vk.svg";
import FooterOK from "../../assets/footer/footer-ok.svg";
import FooterTG from "../../assets/footer/footer-tg.svg";

interface FooterProps {
  setModalOpen: (state: boolean) => void;
}

const Footer: React.FC<FooterProps> = ({ setModalOpen }) => {
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { isAuthenticated } = authContext;

  // Component functions
  function handleLinkClick(path: string) {
    navigate(path);
  };

  return (
    <footer className={styles.footer}>
      <div className={`${globalStyles.container}`}>

        <div className={styles.footer__content}>
          <div className={styles.footer__logo}>
            <img src={FooterLogo} alt="" width={145} height={131} />

            <a className={styles.footer__logo_text} href="mailto:arthelper2015@gmail.com">arthelper2015@gmail.com</a>

            <div className={styles.footer__logo_text}>
              ИП Кузнецова И.П. ; <br />
              ИНН 240403465592; <br />
              ОГРН 318246800141010
            </div>
          </div>
          <nav className={styles.footer__nav}>
            <div className={styles.footer__nav_block}>


              {isAuthenticated ? (
                <h2 className={`${styles.footer__nav_title} ${styles.footer__nav_title_blue}`}
                  onClick={() => handleLinkClick("/cab-profile")}
                >Личный кабинет</h2>
              ) : (
                <h2 className={`${styles.footer__nav_title} ${styles.footer__nav_title_blue}`}
                  onClick={() => setModalOpen(true)}
                >Войти в личный кабинет</h2>
              )}

              <ul className={`${globalStyles.list_reset} ${styles.footer__nav_list}`}>
                <li className={styles.footer__nav_item} onClick={() => handleLinkClick("/courses")}>Курсы</li>
                <li className={styles.footer__nav_item} onClick={() => handleLinkClick("/creative-competition")}>Творческие конкурсы</li>
                <li className={styles.footer__nav_item} onClick={() => handleLinkClick("/olympiads")}>Олимпиады</li>
                <li className={styles.footer__nav_item} onClick={() => handleLinkClick("/publications")}>Публикации</li>
                <li className={styles.footer__nav_item} onClick={() => handleLinkClick("/about#contacts")}>Контакты</li>
              </ul>
            </div>
            <div className={styles.footer__nav_block}>
              <h2 className={styles.footer__nav_title} onClick={() => handleLinkClick("/news")}>Новости</h2>
              <ul className={`${globalStyles.list_reset} ${styles.footer__nav_list}`}>
                <li className={styles.footer__nav_item} onClick={() => handleLinkClick("/faq")}>Вопрос-ответ</li>
                <li className={styles.footer__nav_item} onClick={() => handleLinkClick("/about")}>О нас</li>
                <li className={styles.footer__nav_item} onClick={() => handleLinkClick("/about#contacts")}>Реквизиты</li>
              </ul>
            </div>
            <div className={styles.footer__nav_block}>
              <h2 className={styles.footer__nav_title}>Контакты</h2>
              <ul className={`${globalStyles.list_reset} ${styles.footer__nav_list}`}>
                <li className={styles.footer__nav_item}>
                  <a className={`${styles.footer__nav_social} ${styles.footer__nav_social_vk}`} href="https://vk.com/rosmedal" target="_blank">
                    <img src={FooterVK} alt="VK" width={33} height={33} />
                    Вконтакте
                  </a>
                </li>
                <li className={styles.footer__nav_item}>
                  <a className={`${styles.footer__nav_social} ${styles.footer__nav_social_ok}`} href="https://ok.ru/rosmedal" target="_blank">
                    <img src={FooterOK} alt="OK" width={33} height={33} />
                    Одноклассники
                  </a>
                </li>
                <li className={styles.footer__nav_item}>
                  <a className={`${styles.footer__nav_social} ${styles.footer__nav_social_tg}`} href="https://t.me/rosmedal" target="_blank">
                    <img src={FooterTG} alt="TG" width={33} height={33} />
                    Телеграм
                  </a>
                </li>
                <li className={styles.footer__nav_item}>
                  <a className={styles.footer__nav_social_request} href="#">Оставить заявку</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className={styles.footer__copyright}>
          <div className={styles.footer__copyright_text}>© Copyright 2015 - 2024 Сетевое издание «Росмедаль» 0+</div>
          <div className={styles.footer__copyright_links}>
            <div className={`${styles.footer__copyright_text} ${styles.footer__copyright_text_pointer}`} onClick={() => handleLinkClick("/public-offer")}>Публичная оферта</div>
            <div className={`${styles.footer__copyright_text} ${styles.footer__copyright_text_pointer}`} onClick={() => handleLinkClick("/policy")}>Политика конфиденциальности</div>
          </div>
        </div>



      </div>
    </footer>
  );
};

export default Footer;
