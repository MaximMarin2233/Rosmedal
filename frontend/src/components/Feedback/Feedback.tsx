import { useState, FormEvent } from "react";

import globalStyles from "../../App.module.sass";

const FeedbackForm = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [question, setQuestion] = useState<string>('');

  const [errors, setErrors] = useState<{ name?: string, email?: string, question?: string }>({});

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  // Component functions
  function validateForm() {
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

  async function handleSubmit(e: FormEvent) {
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
        setName('');
        setEmail('');
        setQuestion('');
        setErrors({});

        alert('Заявка успешно отправлена!');
      } else {
        console.error('Ошибка при отправке формы');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    }
  };

  return (
    <section className={globalStyles.feedback}>
      <div className={`${globalStyles.container} ${globalStyles.feedback__content}`}>
        <div className={globalStyles.feedback__text}>
          <h2 className={`${globalStyles.title} ${globalStyles.feedback__title}`}>Оставьте заявку на консультацию
            или обучение</h2>
          <p className={globalStyles.feedback__descr}>
            Остались вопросы или возникли какие-то проблемы, а может Вы хотите выдвинуть предложение по развитию проекта? Просто заполните поля ниже и мы Вам ответим в течение суток
          </p>
        </div>
        <form className={globalStyles.feedback__form} onSubmit={handleSubmit}>
          <label className={`${globalStyles.feedback__form_label} ${globalStyles.feedback__form_label_full_column}`}>
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
              placeholder="Номер телефона"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>{errors.email && (errors.email)}</span>
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
          <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${globalStyles.feedback__form_btn}`} type="submit">Отправить</button>
          <div className={globalStyles.feedback__form_agree}>
            <input type="checkbox" />
            <div className={globalStyles.feedback__form_agree_text}>
              Я согласен с обработкой <span>персональных данных и политикой конфиденциальности</span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FeedbackForm;
