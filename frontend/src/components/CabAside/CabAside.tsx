import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import globalStyles from "../../App.module.sass";
import styles from "./CabAside.module.sass";

import AsideIcon1 from '../../assets/cab-profile/cab-profile-aside-icon-1.svg';
import AsideIcon2 from '../../assets/cab-profile/cab-profile-aside-icon-2.svg';
import AsideIcon3 from '../../assets/cab-profile/cab-profile-aside-icon-3.svg';
import AsideIcon4 from '../../assets/cab-profile/cab-profile-aside-icon-4.svg';
import AsideIcon5 from '../../assets/cab-profile/cab-profile-aside-icon-5.svg';
import AsideIcon6 from '../../assets/cab-profile/cab-profile-aside-icon-6.svg';
import AsideIcon7 from '../../assets/cab-profile/cab-profile-aside-icon-7.svg';

import { AuthContext } from '../../context/AuthContext';

const CabAside = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { logout } = authContext;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <aside className={styles.cab_profile__aside}>
        <div className={styles.cab_profile__aside_block}>
          <h2 className={styles.cab_profile__aside_title}>Личный кабинет</h2>

          <ul className={`${globalStyles.list_reset} ${styles.cab_profile__aside_list}`}>
            <li
              className={`${styles.cab_profile__aside_item} ${pathname === '/cab-profile' ? styles.cab_profile__aside_item_active : ''}`}
              onClick={() => handleLinkClick("/cab-profile")}
            >
              <img src={AsideIcon1} alt="" width={23} height={23} />
              Мой кабинет
            </li>
            <li className={`${styles.cab_profile__aside_item} ${pathname === '/cab-courses' ? styles.cab_profile__aside_item_active : ''}`}
              onClick={() => handleLinkClick("/cab-courses")}>
              <img src={AsideIcon2} alt="" width={23} height={23} />
              Мои курсы
            </li>
            <li
              className={`${styles.cab_profile__aside_item} ${pathname === '/cab-documents' ? styles.cab_profile__aside_item_active : ''}`}
              onClick={() => handleLinkClick("/cab-documents")}
            >
              <img src={AsideIcon3} alt="" width={23} height={23} />
              Мои документы
            </li>
            <li
              className={`${styles.cab_profile__aside_item} ${pathname === '/cab-wallet' ? styles.cab_profile__aside_item_active : ''}`}
              onClick={() => handleLinkClick("/cab-wallet")}
            >
              <img src={AsideIcon4} alt="" width={23} height={23} />
              Мой кошелек
            </li>
          </ul>
        </div>
        <div className={styles.cab_profile__aside_block}>
          <h2 className={styles.cab_profile__aside_title}>Документы</h2>

          <ul className={`${globalStyles.list_reset} ${styles.cab_profile__aside_list}`}>
            <li
              className={`${styles.cab_profile__aside_item} ${pathname === '/cab-issue' ? styles.cab_profile__aside_item_active : ''}`}
              onClick={() => handleLinkClick("/cab-issue")}
            >
              <img src={AsideIcon5} alt="" width={23} height={23} />
              Оформить документ
            </li>
            <li
              className={styles.cab_profile__aside_item}
              onClick={() => handleLinkClick("/courses")}
            >
              <img src={AsideIcon6} alt="" width={23} height={23} />
              Записаться на курсы
            </li>
            <li
              className={`${styles.cab_profile__aside_item} ${pathname === '/cab-check' ? styles.cab_profile__aside_item_active : ''}`}
              onClick={() => handleLinkClick("/cab-check")}
            >
              <img src={AsideIcon7} alt="" width={23} height={23} />
              Проверка документа
            </li>
          </ul>
        </div>
        <div className={`${styles.cab_profile__aside_block} ${styles.cab_profile__aside_block_top_auto}`}>
          <button className={`${globalStyles.btn_reset} ${styles.cab_profile__aside_btn_quit}`} onClick={logout}>Выйти</button>
        </div>
      </aside>
      <div className={styles.cab_profile__aside_adaptive}>
        <button className={`${globalStyles.btn_reset} ${styles.cab_profile__aside_adaptive_btn} ${pathname === '/cab-profile' ? styles.cab_profile__aside_adaptive_btn_active : ''}`}
          onClick={() => handleLinkClick("/cab-profile")}
        >
          <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 21C16.799 21 21.5 16.299 21.5 10.5C21.5 4.70101 16.799 0 11 0C5.20101 0 0.5 4.70101 0.5 10.5C0.5 16.299 5.20101 21 11 21Z" fill="#7D8592" />
            <path d="M10.9998 11.2982C12.8901 11.2982 14.4226 9.76578 14.4226 7.87543C14.4226 5.98507 12.8901 4.45264 10.9998 4.45264C9.10941 4.45264 7.57697 5.98507 7.57697 7.87543C7.57697 9.76578 9.10941 11.2982 10.9998 11.2982Z" fill="white" />
            <path d="M17.3276 16.3972C17.041 16.0501 16.7277 15.7259 16.3904 15.4277C14.9553 14.0053 13.0247 13.1944 11.0043 13.1655C8.98389 13.1944 7.05331 14.0053 5.61818 15.4277C5.29498 15.7344 4.99605 16.0658 4.72408 16.4187C4.6627 16.504 4.61542 16.5986 4.58405 16.6988C4.96692 17.1284 5.38885 17.5215 5.8444 17.873C7.34187 19.0071 9.16891 19.6209 11.0474 19.6209C12.9259 19.6209 14.7529 19.0071 16.2504 17.873C16.691 17.5194 17.0984 17.1264 17.4676 16.6988C17.4385 16.591 17.3911 16.489 17.3276 16.3972Z" fill="white" />
          </svg>
          Мой <br /> кабинет
        </button>
        <button className={`${globalStyles.btn_reset} ${styles.cab_profile__aside_adaptive_btn} ${pathname === '/cab-courses' ? styles.cab_profile__aside_adaptive_btn_active : ''}`}
          onClick={() => handleLinkClick("/cab-courses")}
        >
          <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.2003 7.6926L12.4906 2.57661C12.3453 2.49688 12.1822 2.45508 12.0165 2.45508C11.8507 2.45508 11.6876 2.49688 11.5423 2.57661L2.80767 7.6926C2.66802 7.77547 2.55233 7.89324 2.47198 8.03435C2.39163 8.17546 2.34937 8.33505 2.34937 8.49744C2.34937 8.65982 2.39163 8.81941 2.47198 8.96052C2.55233 9.10163 2.66802 9.21941 2.80767 9.30227L11.5423 14.4058C11.6841 14.4956 11.8486 14.5434 12.0165 14.5434C12.1844 14.5434 12.3488 14.4956 12.4906 14.4058L21.2252 9.30227C21.3681 9.22195 21.4869 9.10507 21.5697 8.96364C21.6524 8.8222 21.696 8.66129 21.696 8.49744C21.696 8.33358 21.6524 8.17268 21.5697 8.03124C21.4869 7.8898 21.3681 7.77292 21.2252 7.6926H21.2003Z" fill="#7D8592" />
            <path d="M12.0161 9.84619C11.7693 9.84619 11.5281 9.77301 11.3229 9.6359C11.1177 9.49879 10.9577 9.30391 10.8633 9.0759C10.7688 8.8479 10.7441 8.59701 10.7923 8.35496C10.8404 8.11291 10.9593 7.89057 11.1338 7.71606C11.3083 7.54155 11.5306 7.42271 11.7727 7.37456C12.0147 7.32642 12.2656 7.35113 12.4936 7.44557C12.7216 7.54001 12.9165 7.69995 13.0536 7.90515C13.1907 8.11035 13.2639 8.3516 13.2639 8.59839C13.2639 8.92933 13.1325 9.24671 12.8984 9.48072C12.6644 9.71473 12.347 9.84619 12.0161 9.84619Z" fill="#CBD5F8" />
            <path d="M17.6315 12.4341L12.4905 15.4288C12.3459 15.5108 12.1826 15.5539 12.0163 15.5539C11.8501 15.5539 11.6867 15.5108 11.5422 15.4288L5.38667 11.8143C5.00734 11.5916 4.52953 11.8651 4.52953 12.305V17.1133C4.52903 17.2908 4.58114 17.4645 4.67926 17.6124C4.75413 17.7247 6.57592 20.5448 12.0163 20.5448C17.4568 20.5448 19.291 17.7247 19.3659 17.6124C19.4548 17.461 19.5021 17.2889 19.5032 17.1133V12.316C19.5032 11.8737 19.0207 11.6005 18.6414 11.8281L17.6315 12.4341Z" fill="#7D8592" />
          </svg>

          Мои <br /> курсы
        </button>
        <button className={`${globalStyles.btn_reset} ${styles.cab_profile__aside_adaptive_btn} ${pathname === '/cab-documents' ? styles.cab_profile__aside_adaptive_btn_active : ''}`}
          onClick={() => handleLinkClick("/cab-documents")}
        >
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4749 5.96615C21.1886 5.56926 20.7297 5.33394 20.2409 5.33333H19.0145L19.0008 4.26013C18.9868 3.16563 18.0955 2.28571 17.001 2.28571H11.2367C11.0196 2.28571 10.8084 2.21507 10.635 2.08444L8.4023 0.402545C8.0555 0.141296 7.6331 0 7.19891 0H2.7616C1.65703 0 0.761597 0.895431 0.761597 2L0.761597 14C0.761597 15.1046 1.65703 16 2.7616 16H17.3584C18.2196 16 18.984 15.4488 19.256 14.6318L21.6839 7.33901C21.8379 6.87428 21.7602 6.36375 21.4749 5.96615ZM7.01909 1.52381C7.23575 1.52381 7.44656 1.59418 7.61977 1.72432L9.98944 3.50474C10.2531 3.70195 10.5731 3.80883 10.9021 3.80952H16.4934C17.0457 3.80952 17.4934 4.25724 17.4934 4.80952V5.33333H5.11246C4.45754 5.33274 3.87596 5.75267 3.66941 6.37528L2.28267 10.543V2.52381C2.28267 1.97153 2.73039 1.52381 3.28267 1.52381H7.01909Z" fill="#7D8592" />
          </svg>


          Мои <br /> документы
        </button>
        <button className={`${globalStyles.btn_reset} ${styles.cab_profile__aside_adaptive_btn} ${pathname === '/cab-wallet' ? styles.cab_profile__aside_adaptive_btn_active : ''}`}
          onClick={() => handleLinkClick("/cab-wallet")}
        >
          <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.392395 8.07266V15.5657C0.392395 16.3228 0.693136 17.0488 1.22846 17.5842C1.76378 18.1195 2.48984 18.4202 3.2469 18.4202H18.233C18.9901 18.4202 19.7161 18.1195 20.2515 17.5842C20.7868 17.0488 21.0875 16.3228 21.0875 15.5657V8.07266H0.392395ZM4.67415 13.7817C4.39025 13.7817 4.11798 13.6689 3.91723 13.4681C3.71649 13.2674 3.60371 12.9951 3.60371 12.7112C3.60371 12.4273 3.71649 12.1551 3.91723 11.9543C4.11798 11.7536 4.39025 11.6408 4.67415 11.6408H8.24227C8.52617 11.6408 8.79844 11.7536 8.99919 11.9543C9.19993 12.1551 9.31271 12.4273 9.31271 12.7112C9.31271 12.9951 9.19993 13.2674 8.99919 13.4681C8.79844 13.6689 8.52617 13.7817 8.24227 13.7817H4.67415ZM16.0921 13.7817C15.8083 13.7817 15.536 13.6689 15.3352 13.4681C15.1345 13.2674 15.0217 12.9951 15.0217 12.7112C15.0217 12.4273 15.1345 12.1551 15.3352 11.9543C15.536 11.7536 15.8083 11.6408 16.0921 11.6408H16.8058C17.0897 11.6408 17.3619 11.7536 17.5627 11.9543C17.7634 12.1551 17.8762 12.4273 17.8762 12.7112C17.8762 12.9951 17.7634 13.2674 17.5627 13.4681C17.3619 13.6689 17.0897 13.7817 16.8058 13.7817H16.0921Z" fill="#7D8592" />
            <path d="M0.392395 5.93178H21.0875V3.43409C21.0875 2.67703 20.7868 1.95098 20.2515 1.41565C19.7161 0.880331 18.9901 0.57959 18.233 0.57959H3.2469C2.48984 0.57959 1.76378 0.880331 1.22846 1.41565C0.693136 1.95098 0.392395 2.67703 0.392395 3.43409V5.93178Z" fill="#7D8592" />
          </svg>

          Мой <br /> кошелек
        </button>
        <button className={`${globalStyles.btn_reset} ${styles.cab_profile__aside_adaptive_btn} ${(pathname === '/cab-issue' || pathname === '/cab-check') ? styles.cab_profile__aside_adaptive_btn_active : ''} ${styles.cab_profile__aside_adaptive_btn_dropdown} `}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className={`${styles.cab_profile__aside_adaptive_burger} ${isDropdownOpen ? styles.cab_profile__aside_adaptive_burger_active : ''}`}>
            <span></span>
          </div>

          Документы

          <div className={`${styles.cab_profile__aside_adaptive_dropdown} ${isDropdownOpen ? styles.cab_profile__aside_adaptive_dropdown_active : ''}`}>
            <button className={`${globalStyles.btn_reset} ${styles.cab_profile__aside_adaptive_dropdown_btn} ${pathname === '/cab-issue' ? styles.cab_profile__aside_adaptive_dropdown_btn_active : ''}`}
              onClick={() => handleLinkClick("/cab-issue")}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6 3C4.34315 3 3 4.34315 3 6V8C3 9.65685 4.34315 11 6 11H8C9.65685 11 11 9.65685 11 8V6C11 4.34315 9.65685 3 8 3H6ZM16 3C14.3431 3 13 4.34315 13 6V8C13 9.65685 14.3431 11 16 11H18C19.6569 11 21 9.65685 21 8V6C21 4.34315 19.6569 3 18 3H16ZM3 16C3 14.3431 4.34315 13 6 13H8C9.65685 13 11 14.3431 11 16V18C11 19.6569 9.65685 21 8 21H6C4.34315 21 3 19.6569 3 18V16ZM16 13C14.3431 13 13 14.3431 13 16V18C13 19.6569 14.3431 21 16 21H18C19.6569 21 21 19.6569 21 18V16C21 14.3431 19.6569 13 18 13H16Z" fill="#7D8592" />
              </svg>
              Оформить <br /> документ
            </button>
            <button className={`${globalStyles.btn_reset} ${styles.cab_profile__aside_adaptive_dropdown_btn}`}
              onClick={() => handleLinkClick("/courses")}
            >
              <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.7466 2.27732C18.7086 1.71694 17.592 1.31633 16.4345 1.08899V7.52369C16.4345 7.77515 16.3346 8.01632 16.1568 8.19413C15.979 8.37194 15.7378 8.47183 15.4863 8.47183C15.2349 8.47183 14.9937 8.37194 14.8159 8.19413C14.6381 8.01632 14.5382 7.77515 14.5382 7.52369V0.886719C12.9943 0.900307 11.4764 1.28627 10.1136 2.01184C8.75068 1.28627 7.23283 0.900307 5.68891 0.886719C3.86761 0.934525 2.08322 1.41094 0.480466 2.27732C0.333287 2.35771 0.210797 2.47669 0.126157 2.62147C0.0415179 2.76625 -0.00207069 2.93135 7.56032e-05 3.09904V20.1655C0.000578227 20.3312 0.0439128 20.4939 0.125871 20.6379C0.20783 20.7819 0.325627 20.9022 0.467824 20.9873C0.612759 21.0681 0.775949 21.1105 0.941893 21.1105C1.10784 21.1105 1.27103 21.0681 1.41596 20.9873C2.7361 20.2902 4.19696 19.9013 5.68891 19.8495C7.06078 19.8684 8.40356 20.2477 9.5826 20.9493C9.6629 20.999 9.74752 21.0413 9.83543 21.0758C9.92586 21.1016 10.0195 21.1144 10.1136 21.1137H10.1894C10.3221 21.1011 10.451 21.0624 10.5687 20.9999H10.6445C11.8196 20.2827 13.1621 19.8861 14.5382 19.8495C16.0302 19.9013 17.491 20.2902 18.8111 20.9873C18.9561 21.0681 19.1193 21.1105 19.2852 21.1105C19.4512 21.1105 19.6144 21.0681 19.7593 20.9873C19.9015 20.9022 20.0193 20.7819 20.1012 20.6379C20.1832 20.4939 20.2265 20.3312 20.227 20.1655V3.09904C20.2292 2.93135 20.1856 2.76625 20.101 2.62147C20.0163 2.47669 19.8938 2.35771 19.7466 2.27732Z" fill="#7D8592" />
              </svg>

              Записаться <br /> на курсы
            </button>
            <button className={`${globalStyles.btn_reset} ${styles.cab_profile__aside_adaptive_dropdown_btn} ${pathname === '/cab-check' ? styles.cab_profile__aside_adaptive_dropdown_btn_active : ''}`}
              onClick={() => handleLinkClick("/cab-check")}
            >
              <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.9212 0.250488V6.59754C13.9201 7.15194 14.1379 7.68434 14.5272 8.07907C14.9284 8.47104 15.4648 8.69402 16.0256 8.70199H20.4871L13.9212 0.250488Z" fill="#7D8592" />
                <path d="M15.5408 10.4939C14.5069 10.445 13.5315 9.9995 12.8175 9.25005C12.1035 8.50061 11.7057 7.50484 11.7069 6.46971V0.250488H1.09759C0.807693 0.254278 0.530734 0.371125 0.325727 0.576133C0.120719 0.78114 0.00387241 1.0581 8.23981e-05 1.348V22.5665C-0.00246588 22.7717 0.0541412 22.9733 0.163135 23.1472C0.272128 23.321 0.428894 23.4598 0.614688 23.547C0.764767 23.6219 0.929855 23.6619 1.09759 23.664C1.34236 23.6666 1.58036 23.5838 1.77073 23.4299L4.11209 21.6154C4.18276 21.5883 4.26092 21.5883 4.33159 21.6154C4.42277 21.6112 4.512 21.6427 4.58036 21.7032L6.59978 23.4592C6.79788 23.6454 7.05955 23.7491 7.33145 23.7491C7.60335 23.7491 7.86502 23.6454 8.06312 23.4592L10.0386 21.7471C10.1067 21.6912 10.192 21.6606 10.2801 21.6606C10.3682 21.6606 10.4535 21.6912 10.5215 21.7471L12.4824 23.4592C12.6805 23.6454 12.9422 23.7491 13.2141 23.7491C13.486 23.7491 13.7477 23.6454 13.9458 23.4592L15.9652 21.7032C16.0305 21.6473 16.1134 21.6162 16.1993 21.6154C16.2757 21.5926 16.3571 21.5926 16.4335 21.6154L18.7748 23.4299C18.9367 23.5395 19.1249 23.604 19.32 23.6165C19.5151 23.629 19.71 23.5892 19.8845 23.5012C20.0591 23.4132 20.207 23.2801 20.3129 23.1158C20.4188 22.9515 20.4789 22.7619 20.4869 22.5665V10.4939H15.5408Z" fill="#7D8592" />
              </svg>


              Проверка <br /> документа
            </button>
          </div>
        </button>
      </div>
    </>
  );
};

export default CabAside;
