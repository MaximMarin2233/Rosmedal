import { useState, FormEvent, useContext } from "react";

import styles from "../../App.module.sass";

import { AuthContext } from '../../context/AuthContext';

const ModalAuth = () => {

  const [isResetPasswordActive, setIsResetPasswordActive] = useState(false);
  const [isPasswordInputActive, setIsPasswordInputActive] = useState(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { login } = authContext;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = { email };

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

      const response = await fetch(`${apiBaseUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': dataToken.csrf_token
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setEmail('');
        alert('Ссылка для регистрации отправлена на почту!');
      } else {
        const responseData = await response.json();
        console.log(responseData);

        try {
          await login(email, isPasswordInputActive ? password : 'password');
          console.log('success login');
          window.location.reload();
        } catch (err) {
          console.log(err);
          console.log('err success');

          if (isPasswordInputActive) {
            alert('Неверный E-mail или пароль!');
          }

          setIsPasswordInputActive(true);
        }

      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    }
  };

  const handleSubmitPasswordReset = async (e: FormEvent) => {
    e.preventDefault();

    const data = { email };

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

      const response = await fetch(`${apiBaseUrl}/api/v1/auth/password_reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': dataToken.csrf_token
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setEmail('');
        alert('Ссылка для сброса пароля отправлена на почту!');
      } else {
        const responseData = await response.json();
        console.log(responseData);


      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    }
  };

  return (
    isResetPasswordActive ? (
      <div className={styles.modal_content}>
        <h2 className={styles.modal_content__title}>Сбросить пароль</h2>
        <form className={styles.modal_auth} onSubmit={handleSubmitPasswordReset}>
          <input
            className={styles.modal_auth__input}
            type="text"
            placeholder="Ваш E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.modal_content__link}>
            <span onClick={() => setIsResetPasswordActive(false)}>Войти</span>
          </div>
          <button className={`${styles.btn_reset} ${styles.modal_auth__btn}`}>Сбросить</button>
        </form>
      </div>
    ) : (
      <div className={styles.modal_content}>
        <h2 className={styles.modal_content__title}>Авторизация</h2>
        <form className={styles.modal_auth} onSubmit={handleSubmit}>
          <input
            className={styles.modal_auth__input}
            type="text"
            placeholder="Ваш E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {isPasswordInputActive && (
            <input
              className={styles.modal_auth__input}
              type="password"
              placeholder="Ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <div className={styles.modal_content__link}>
            <span onClick={() => setIsResetPasswordActive(true)}>Сбросить пароль</span>
          </div>
          <button className={`${styles.btn_reset} ${styles.modal_auth__btn}`}>Войти</button>
        </form>
      </div>
    )
  );
};

export default ModalAuth;
