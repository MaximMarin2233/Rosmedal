import { useEffect, useState } from 'react';
import Select from 'react-select';
import InputMask from 'react-input-mask';

import DatePicker, { registerLocale } from 'react-datepicker';
import { Locale } from 'date-fns'; // Импорт типа Locale
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css'; // Импорт стилей для DatePicker

registerLocale('ru', ru as unknown as Locale);

import AuthService from '../../services/AuthService';

import globalStyles from '../../App.module.sass';
import styles from './CabProfile.module.sass';

import Feedback from '../../components/Feedback/Feedback';
import CabAside from '../../components/CabAside/CabAside';

const CabProfile = () => {

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = AuthService.getAccessToken();

  const [gender, setGender] = useState<{ value: string, label: string } | null>(null);
  const [citizenship, setСitizenship] = useState<{ value: string, label: string } | null>(null);
  const [education, setEducation] = useState<{ value: string, label: string } | null>(null);

  const [avatar, setAvatar] = useState('');
  const [avatarUpload, setAvatarUpload] = useState(false);
  const [avatarRemove, setAvatarRemove] = useState(false);

  const [formData, setFormData] = useState({
    avatar: '',
    last_name: '',
    first_name: '',
    patronymic: '',
    phone_number: '',
    email: '',
    city: '',
    date_of_birth: '',
    gender: '',
    citizenship: '',
    snils: '',
    education_degree: '',
    job: '',
    position: '',
    diploma_series: '',
    diploma_number: '',
    graduation_date: '',
    qualification: '',
    delivery_country: '',
    delivery_region: '',
    delivery_city: '',
    delivery_street: '',
    delivery_house: '',
    delivery_flat: '',
    post_index: '',
  });

  const [formDataPassword, setFormDataPassword] = useState({
    new_password: '',
    repeat_password: '',
  });

  const genderOptions = [
    {
      value: 'MAN',
      label: 'Мужской',
    },
    {
      value: 'WOMAN',
      label: 'Женский',
    },
  ];

  const citizenshipOptions = [
    {
      value: 'RU',
      label: 'Россия',
    },
    {
      value: 'AZ',
      label: 'Азербайджан',
    },
    {
      value: 'AM',
      label: 'Армения',
    },
    {
      value: 'BY',
      label: 'Беларусь ',
    },
    {
      value: 'GE',
      label: 'Грузия',
    },
    {
      value: 'KG',
      label: 'Кыргызстан',
    },
    {
      value: 'MD',
      label: 'Молдова',
    },
    {
      value: 'KZ',
      label: 'Казахстан',
    },
    {
      value: 'TJ',
      label: 'Таджикистан',
    },
    {
      value: 'UZ',
      label: 'Узбекистан',
    },
    {
      value: 'UA',
      label: 'Украина',
    },
  ];

  const educationOptions = [
    {
      value: 'HIGHER',
      label: 'Высшее',
    },
    {
      value: 'SECONDARY',
      label: 'Среднее профессиональное',
    },
  ];

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

        const genderOption = genderOptions.find(option => option.value === data.gender);
        setGender(genderOption || null);

        const citizenshipOption = citizenshipOptions.find(option => option.value === data.citizenship);
        setСitizenship(citizenshipOption || null);

        const educationOption = educationOptions.find(option => option.value === data.education_degree);
        setEducation(educationOption || null);

        setAvatar(data.avatar);

        setFormData({
          avatar: '',
          last_name: data.last_name || '',
          first_name: data.first_name || '',
          patronymic: data.patronymic || '',
          phone_number: data.phone_number || '',
          email: data.email || '',
          city: data.city || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          citizenship: data.citizenship || '',
          snils: data.snils || '',
          education_degree: data.education_degree || '',
          job: data.job || '',
          position: data.position || '',
          diploma_series: data.diploma_series || '',
          diploma_number: data.diploma_number || '',
          graduation_date: data.graduation_date || '',
          qualification: data.qualification || '',
          delivery_country: data.delivery_country || '',
          delivery_region: data.delivery_region || '',
          delivery_city: data.delivery_city || '',
          delivery_street: data.delivery_street || '',
          delivery_house: data.delivery_house || '',
          delivery_flat: data.delivery_flat || '',
          post_index: data.post_index || '',
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const [errors, setErrors] = useState({
    last_name: '',
    first_name: '',
    patronymic: '',
    email: '',
    phone_number: '',
    snils: '',
    graduation_date: '',
  });


  const validateCyrillicName = (value) => {
    const cyrillicRegex = /^[А-ЯЁ][а-яё]+$/; // Начинается с заглавной кириллической буквы
    return cyrillicRegex.test(value);
  };

  const validatePhoneNumber = (value) => {
    const phoneRegex = /^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/; // Полный формат +7-xxx-xxx-xx-xx
    return phoneRegex.test(value) && value.length === 16; // Учитываем длину полного номера с маской
  };

  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
  };

  const validateSnils = (value) => {
    const snilsRegex = /^\d{3}-\d{3}-\d{3}-\d{2}$/; // Полный формат xxx-xxx-xxx-xx
    return snilsRegex.test(value) && value.length === 14; // Учитываем длину полного СНИЛСа с маской
  };

  const validateGraduationDate = (value) => {
    const graduationDateRegex = /^\d{4}$/;
    return graduationDateRegex.test(value) && value.length === 4;
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      date_of_birth: date ? date.toISOString().split('T')[0] : '', // Сохранение в формате YYYY-MM-DD
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Валидация фамилии, имени и отчества
    if (name === 'last_name' || name === 'first_name' || name === 'patronymic') {
      if (value.length > 0 && !validateCyrillicName(value)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: `${name === 'last_name' ? 'Фамилия' : name === 'first_name' ? 'Имя' : 'Отчество'} должно начинаться с заглавной кириллической буквы.`
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: ''
        }));
      }
    }

    // Валидация номера телефона (только если номер полностью введен)
    if (name === 'phone_number') {
      if (value.length === 16 && !validatePhoneNumber(value)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          phone_number: 'Номер телефона должен соответствовать формату +7-xxx-xxx-xx-xx.'
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          phone_number: ''
        }));
      }
    }

    if (name === 'email') {
      if (value.length > 0 && !validateEmail(value)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: `Введите корректный E-mail!`
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: ''
        }));
      }
    }

    if (name === 'snils') {
      if (!validateSnils(value)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          snils: 'Снилс должен соответствовать формату xxx-xxx-xxx-xx'
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          snils: ''
        }));
      }
    }

    if (name === 'graduation_date') {
      if (!validateGraduationDate(value)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          graduation_date: 'Год должен соответствовать формату xxxx'
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          graduation_date: ''
        }));
      }
    }
  };



  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setFormDataPassword(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%'
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: '#fff',
      border: '1px solid #FB998A',
      padding: '5px 11px',
      borderRadius: '10px',
      cursor: 'pointer'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#fff',
      borderRadius: '10px'
    }),
    option: (provided, state) => ({
      ...provided,
      color: '#7d8592',
      backgroundColor: state.isSelected ? '#FB998A' : '#fff',
      fontSize: '11px',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: '10px',

      ':hover': {
        backgroundColor: '#fb998a80',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '11px',
      fontWeight: '600',
      color: '#7d8592'
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '11px',
      fontWeight: '600',
      color: '#7d8592'
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#7d8592',
      ':hover': {
        color: '#7d8592',
      },
    }),
    indicatorContainer: (provided) => ({
      ...provided,
      color: '#7d8592'
    }),
  };

  const handleGenderChange = (option: { value: string, label: string } | null) => {
    setGender(option);
    setFormData(prevState => ({
      ...prevState,
      gender: option ? option.value : ''
    }));
  };

  const handleCitizenshipChange = (option: { value: string, label: string } | null) => {
    setСitizenship(option);
    setFormData(prevState => ({
      ...prevState,
      citizenship: option ? option.value : ''
    }));
  };

  const handleEducationChange = (option: { value: string, label: string } | null) => {
    setEducation(option);
    setFormData(prevState => ({
      ...prevState,
      education_degree: option ? option.value : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Функция для проверки и установки ошибки, если поле не пустое и не проходит валидацию
    const validateField = (fieldName, validator, errorMessage) => {
      if (formData[fieldName] && !validator(formData[fieldName])) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [fieldName]: errorMessage,
        }));
        return false;
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          [fieldName]: '',
        }));
        return true;
      }
    };

    // Проверка каждого поля с учетом необязательности
    const isLastNameValid = validateField(
      'last_name',
      validateCyrillicName,
      'Фамилия должна начинаться с заглавной кириллической буквы и содержать только кириллицу.'
    );

    const isFirstNameValid = validateField(
      'first_name',
      validateCyrillicName,
      'Имя должно начинаться с заглавной кириллической буквы и содержать только кириллицу.'
    );

    const isPatronymicValid = validateField(
      'patronymic',
      validateCyrillicName,
      'Отчество должно начинаться с заглавной кириллической буквы и содержать только кириллицу.'
    );

    const isPhoneNumberValid = validateField(
      'phone_number',
      validatePhoneNumber,
      'Номер телефона должен соответствовать формату +7-xxx-xxx-xx-xx.'
    );

    const isEmailValid = validateField(
      'email',
      validateEmail,
      'Введите корректный E-mail!'
    );

    const isSnilsValid = validateField(
      'snils',
      validateSnils,
      'Снилс должен соответствовать формату xxx-xxx-xxx-xx'
    );

    const isGraduationDateValid = validateField(
      'graduation_date',
      validateGraduationDate,
      'Год должен соответствовать формату xxxx'
    );

    // Проверка, что все заполненные поля валидны
    if (!isLastNameValid || !isFirstNameValid || !isPatronymicValid ||
      !isPhoneNumberValid || !isEmailValid || !isSnilsValid ||
      !isGraduationDateValid) {
      return;
    }

    // Если все поля валидны, очищаем ошибки и выполняем отправку
    setErrors({
      last_name: '',
      first_name: '',
      patronymic: '',
      email: '',
      phone_number: '',
      snils: '',
      graduation_date: '',
    });

    const formDataToSend = new FormData();

    if (avatarUpload) {
      formDataToSend.append('avatar', formData.avatar);
    }

    if (avatarRemove) {
      formDataToSend.append('avatar', '');
    }

    formDataToSend.append('last_name', formData.last_name);
    formDataToSend.append('first_name', formData.first_name);
    formDataToSend.append('patronymic', formData.patronymic);
    formDataToSend.append('phone_number', formData.phone_number);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('date_of_birth', formData.date_of_birth);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('citizenship', formData.citizenship);
    formDataToSend.append('snils', formData.snils);
    formDataToSend.append('education_degree', formData.education_degree);
    formDataToSend.append('job', formData.job);
    formDataToSend.append('position', formData.position);
    formDataToSend.append('diploma_series', formData.diploma_series);
    formDataToSend.append('diploma_number', formData.diploma_number);
    formDataToSend.append('graduation_date', formData.graduation_date);
    formDataToSend.append('qualification', formData.qualification);
    formDataToSend.append('delivery_country', formData.delivery_country);
    formDataToSend.append('delivery_region', formData.delivery_region);
    formDataToSend.append('delivery_city', formData.delivery_city);
    formDataToSend.append('delivery_street', formData.delivery_street);
    formDataToSend.append('delivery_house', formData.delivery_house);
    formDataToSend.append('delivery_flat', formData.delivery_flat);
    formDataToSend.append('post_index', formData.post_index);

    // Отправка обновленных данных на сервер
    fetch(`${apiBaseUrl}/api/v1/cab/user/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formDataToSend,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Данные успешно изменены!');
        setAvatarUpload(false);
        setAvatarRemove(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!formDataPassword.new_password) {
      alert('Введите пароль!');
      return;
    }

    if (formDataPassword.new_password !== formDataPassword.repeat_password) {
      alert('Пароли не совпадают!');
      return;
    }

    // Отправка обновленных данных на сервер
    fetch(`${apiBaseUrl}/api/v1/auth/password_change`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataPassword)
    })
      .then(data => {
        console.log('Success:', data);
        setFormDataPassword({
          new_password: '',
          repeat_password: '',
        })
        alert('Пароль успешно изменен!');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null); // Задаем тип состояния

  // Функция для обработки загрузки фото
  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // берем первый файл из списка файлов
    if (file) {

      setFormData(prevState => ({
        ...prevState,
        avatar: file
      }));

      setImagePreview(URL.createObjectURL(file));

      setAvatarUpload(true);
    }
  };

  // Функция для удаления фото
  const handleImageRemove = () => {
    setFormData(prevState => ({
      ...prevState,
      avatar: ''
    }));

    setImagePreview(null); // убираем превью
    setAvatar('');

    setAvatarRemove(true);
  };

  return (
    <section className={`${globalStyles.section_padding} ${styles.cab_profile}`}>
      <div className={globalStyles.container}>

        <div className={globalStyles.cab_container}>
          <CabAside />

          <div className={globalStyles.cab_content}>
            <h2 className={globalStyles.cab_title}>Мой кабинет</h2>

            <div className={globalStyles.cab_blocks}>
              <form className={`${globalStyles.cab_block} ${styles.cab_profile__block}`} onSubmit={handleSubmit}>
                <h3 className={styles.cab_profile__subtitle}>Укажите Ваши данные</h3>

                <div className={styles.cab_profile__block_content}>

                  {/* <div className={styles.cab_profile__block_img_wrapper}>
                    <div className={styles.cab_profile__block_img}></div>
                    <button className={`${globalStyles.btn_reset} ${styles.cab_profile__block_img_btn}`}>Загрузить фото</button>
                    <button className={`${globalStyles.btn_reset} ${styles.cab_profile__block_img_btn}`}>Удалить фото</button>
                  </div> */}

                  <div className={styles.cab_profile__block_img_wrapper}>

                    {imagePreview || avatar ? (
                      <img src={imagePreview || avatar} alt="Фото профиля" width={177} height={177} style={{ borderRadius: '100%' }} />
                    ) : (
                      <div className={styles.cab_profile__block_img}></div>
                    )}

                    <input
                      type="file"
                      id="upload-photo"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="upload-photo" className={`${globalStyles.btn_reset} ${styles.cab_profile__block_img_btn}`}>
                      Загрузить фото
                    </label>
                    <button
                      onClick={handleImageRemove}
                      className={`${globalStyles.btn_reset} ${styles.cab_profile__block_img_btn}`}
                    >
                      Удалить фото
                    </button>
                  </div>

                  <div className={styles.cab_profile__block_text}>
                    <div className={styles.cab_profile__block_text_content}>
                      <h4 className={styles.cab_profile__block_text_title}>Личные данные</h4>
                      <div className={styles.cab_profile__block_text_inputs}>
                        <label className={styles.cab_profile__block_text_label}>
                          <input className={globalStyles.cab_input}
                            type="text"
                            name="last_name"
                            placeholder="Фамилия"
                            value={formData.last_name}
                            onChange={handleChange}
                          />
                          {errors.last_name && <p className={styles.error_message}>{errors.last_name}</p>}
                        </label>

                        <label className={styles.cab_profile__block_text_label}>
                          <input className={globalStyles.cab_input}
                            type="text"
                            name="first_name"
                            placeholder="Имя"
                            value={formData.first_name}
                            onChange={handleChange}
                          />
                          {errors.first_name && <p className={styles.error_message}>{errors.first_name}</p>}
                        </label>

                        <label className={styles.cab_profile__block_text_label}>
                          <input className={globalStyles.cab_input}
                            type="text"
                            name="patronymic"
                            placeholder="Отчество"
                            value={formData.patronymic}
                            onChange={handleChange}
                          />
                          {errors.patronymic && <p className={styles.error_message}>{errors.patronymic}</p>}
                        </label>


                        <label className={styles.cab_profile__block_text_label}>
                          <InputMask
                            mask="+7-999-999-99-99"
                            value={formData.phone_number}
                            onChange={handleChange}
                          >
                            {() => (
                              <input
                                className={globalStyles.cab_input}
                                type="text"
                                name="phone_number"
                                placeholder="Номер телефона"
                              />
                            )}
                          </InputMask>
                          {errors.phone_number && <p className={styles.error_message}>{errors.phone_number}</p>}
                        </label>

                        <label className={styles.cab_profile__block_text_label}>
                          <input className={globalStyles.cab_input} type="email" name="email" placeholder="Ваш e-mail" value={formData.email} onChange={handleChange} />
                          {errors.email && <p className={styles.error_message}>{errors.email}</p>}
                        </label>

                        <input className={globalStyles.cab_input} type="text" name="city" placeholder="Город проживания" value={formData.city} onChange={handleChange} />

                        <label className={styles.cab_profile__block_text_label_date}>
                          <span>Дата рождения:</span>
                          <DatePicker
                            selected={formData.date_of_birth ? new Date(formData.date_of_birth) : null}
                            onChange={handleDateChange}
                            className="custom-input"
                            placeholderText="дд.мм.гггг"
                            dateFormat="dd.MM.yyyy" // Формат даты
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            locale="ru" // Установка русского языка
                            customInput={<input style={{
                              fontSize: '11px',
                              fontWeight: '600',
                              color: '#7D8592'
                            }} />} // Настройка font-size для placeholder и value
                          />
                        </label>

                        <Select
                          options={genderOptions}
                          styles={customStyles}
                          placeholder='Ваш пол'
                          isSearchable={false}
                          onChange={handleGenderChange}
                          value={gender}
                        />

                        <Select
                          options={citizenshipOptions}
                          styles={customStyles}
                          placeholder='Гражданство'
                          isSearchable={false}
                          onChange={handleCitizenshipChange}
                          value={citizenship}
                        />


                        <label className={styles.cab_profile__block_text_label}>
                          <InputMask
                            mask="999-999-999-99"
                            value={formData.snils}
                            onChange={handleChange}
                          >
                            {() => (
                              <input className={globalStyles.cab_input} type="text" name="snils" placeholder="СНИЛС" value={formData.snils} onChange={handleChange} />
                            )}
                          </InputMask>
                          {errors.snils && <p className={styles.error_message}>{errors.snils}</p>}
                        </label>

                        <input className={globalStyles.cab_input} type="text" name="job" placeholder="Место работы" value={formData.job} onChange={handleChange} />
                        <input className={globalStyles.cab_input} type="text" name="position" placeholder="Должность" value={formData.position} onChange={handleChange} />
                      </div>
                    </div>
                    <div className={styles.cab_profile__block_text_content}>
                      <h4 className={styles.cab_profile__block_text_title}>Информация об образовании</h4>
                      <div className={styles.cab_profile__block_text_inputs}>
                        <Select
                          options={educationOptions}
                          styles={customStyles}
                          placeholder='Образование'
                          isSearchable={false}
                          onChange={handleEducationChange}
                          value={education}
                        />
                        <input className={globalStyles.cab_input} type="text" name="diploma_series" placeholder="Серия диплома" value={formData.diploma_series} onChange={handleChange} />
                        <input className={globalStyles.cab_input} type="text" name="diploma_number" placeholder="Номер диплома" value={formData.diploma_number} onChange={handleChange} />
                        <div className={styles.cab_profile__block_text_full_column}>


                          <label className={styles.cab_profile__block_text_label_year}>
                            <span>Год получ. диплома:</span>
                            <InputMask
                              mask="9999"
                              value={formData.graduation_date}
                              onChange={handleChange}
                            >
                              {() => (
                                <input className={globalStyles.cab_input} type="text" name="graduation_date" placeholder="Год получения диплома" value={formData.graduation_date} onChange={handleChange} />
                              )}
                            </InputMask>
                            {errors.graduation_date && <p className={styles.error_message}>{errors.graduation_date}</p>}
                          </label>

                          <input className={globalStyles.cab_input} type="text" name="qualification" placeholder="Квалификация в соответствии с документом об образовании" value={formData.qualification} onChange={handleChange} />
                        </div>
                      </div>
                    </div>
                    <div className={styles.cab_profile__block_text_content}>
                      <h4 className={styles.cab_profile__block_text_title}>Адрес для доставки</h4>
                      <div className={styles.cab_profile__block_text_inputs}>
                        <input className={globalStyles.cab_input} type="text" name="delivery_country" placeholder="Страна" value={formData.delivery_country} onChange={handleChange} />
                        <input className={globalStyles.cab_input} type="text" name="delivery_region" placeholder="Регион" value={formData.delivery_region} onChange={handleChange} />
                        <input className={globalStyles.cab_input} type="text" name="delivery_city" placeholder="Город" value={formData.delivery_city} onChange={handleChange} />
                        <div className={styles.cab_profile__block_text_full_column}>
                          <input className={globalStyles.cab_input} type="text" name="delivery_street" placeholder="Улица" value={formData.delivery_street} onChange={handleChange} />
                          <input className={globalStyles.cab_input} type="text" name="delivery_house" placeholder="Дом" value={formData.delivery_house} onChange={handleChange} />
                          <input className={globalStyles.cab_input} type="text" name="delivery_flat" placeholder="Квартира" value={formData.delivery_flat} onChange={handleChange} />
                          <input className={globalStyles.cab_input} type="number" name="post_index" placeholder="Почтовый индекс" value={formData.post_index} onChange={handleChange} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_profile__btn}`}>Сохранить данные</button>

              </form>
              <form className={`${globalStyles.cab_block} ${styles.cab_profile__block}`} onSubmit={handlePasswordSubmit}>
                <h3 className={styles.cab_profile__subtitle}>Сменить пароль</h3>

                <div className={styles.cab_profile__block_content}>
                  <div className={styles.cab_profile__block_text}>
                    <div className={styles.cab_profile__block_text_content}>
                      <div className={styles.cab_profile__block_text_inputs}>
                        <div className={styles.cab_profile__block_text_full_column}>
                          <input className={globalStyles.cab_input} type="text" name="new_password" placeholder="Введите пароль" value={formDataPassword.new_password} onChange={handleChangePassword} />
                          <input className={globalStyles.cab_input} type="text" name="repeat_password" placeholder="Повторите пароль" value={formDataPassword.repeat_password} onChange={handleChangePassword} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_profile__btn}`}>Сохранить пароль</button>

              </form>
            </div>
          </div>
        </div>


        <Feedback />
      </div>
    </section>
  );
};

export default CabProfile;
