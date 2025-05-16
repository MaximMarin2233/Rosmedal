import { useState } from "react";

import styles from "../../App.module.sass";

const ModalPasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  // Component functions
  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    const token = localStorage.getItem("passwordResetToken");
    if (!token) {
      setError("Токен отсутствует");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/auth/password_reset/confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при сбросе пароля, введенный пароль слишком широко распространен");
      }

      const data = await response.json();
      // Дополнительная логика после успешного запроса
      console.log("Пароль успешно сброшен", data);
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Произошла неизвестная ошибка");
      }
    }
  };

  return (
    <div className={styles.modal_content}>
      <h2 className={styles.modal_content__title}>Сбросить пароль</h2>
      <form className={styles.modal_auth} onSubmit={handleSubmit}>
        {error && <p className={styles.error_message} style={{ color: 'red' }}>{error}</p>}
        <input
          className={styles.modal_auth__input}
          type="password"
          placeholder="Введите новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className={styles.modal_auth__input}
          type="password"
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className={`${styles.btn_reset} ${styles.modal_auth__btn}`}>Сбросить</button>
      </form>
    </div>
  );
};

export default ModalPasswordReset;
