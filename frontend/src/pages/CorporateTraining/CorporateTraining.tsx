import { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import { Element, scroller } from 'react-scroll';
import { useNavigate } from "react-router-dom";

import AuthService from '../../services/AuthService';

import globalStyles from '../../App.module.sass';
import styles from './CorporateTraining.module.sass';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Feedback from '../../components/Feedback/Feedback';

import CorporateTrainingContentImg from '../../assets/corporate-training/corporate-training-content-img.png';

interface ICoursesVariations {
  id: number;
  display_name: string;
  base_price: string;
  discount_percentage: string;
  hour_coefficients: IHours[];
}

interface IHours {
  number_of_hours: string;
  price_coefficient: string;
}

interface ICourses {
  count: number;
  results: ICoursesInf[];
  total_pages: number;
}

interface ICoursesInf {
  id: number;
  variation: number;
  title: string;
  short_description: string;
  image: string;
}

interface IStudent {
  id: number;
  fullName: string;
  email: string;
  courseType: { value: number; label: string } | null;
  course: { value: number; label: string } | null;
  hours: { value: string; label: string } | null;
}

const CorporateTraining = () => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const [coursesVariations, setCoursesVariations] = useState<ICoursesVariations[]>([]);
  const [courses, setCourses] = useState<ICourses | null>(null);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [coordinator, setCoordinator] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    deliveryAddress: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    deliveryAddress: '',
    checkbox: '',
  });

  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const [studentErrors, setStudentErrors] = useState<{ id: number; fullName: string; course: string, email: string, hours: string }[]>([]);

  const validateStudentName = (name: string) => {
    return name.trim() !== '';
  };

  const validateStudentCourse = (course: { value: number; label: string } | null) => {
    return course !== null;
  };

  const validateStudentEmail = (email: string) => {
    return email.trim() !== '';
  };

  const validateStudentHours = (hours: { value: string; label: string } | null) => {
    return hours !== null;
  };


  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Корпоративное обучение', href: '/corporate-training' },
  ];

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchCoursesVariations = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/courses/variations`);
      const data = await response.json();
      setCoursesVariations(data.results);
    } catch (error) {
      console.error('Error fetching courses variations:', error);
    }
  }, [apiBaseUrl]);

  const fetchCourses = useCallback(async () => {
    try {
      let allCourses: ICoursesInf[] = [];
      let currentPage = 1;
      let totalPages = 1;

      // Выполняем запросы до тех пор, пока не будут получены все страницы
      while (currentPage <= totalPages) {
        const response = await fetch(`${apiBaseUrl}/api/v1/courses/?page=${currentPage}`);
        const data: ICourses = await response.json();

        // Обновляем totalPages на основе ответа
        totalPages = data.total_pages;

        // Собираем все курсы
        allCourses = [...allCourses, ...data.results];

        currentPage++;
      }

      // Устанавливаем итоговый список курсов
      setCourses({ count: allCourses.length, results: allCourses, total_pages: totalPages });
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, [apiBaseUrl]);


  useEffect(() => {
    fetchCoursesVariations();
    fetchCourses();
    addStudent();
  }, [fetchCoursesVariations, fetchCourses]);

  const handleCourseTypeChange = (selectedOption: { value: number; label: string } | null, studentId: number) => {
    setStudents(prevStudents => prevStudents.map(student =>
      student.id === studentId
        ? { ...student, courseType: selectedOption, course: null, hours: null }
        : student
    ));
  };

  const handleStudentNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, studentId: number) => {
    const { value } = e.target;
    setStudents(prevStudents => {
      const newStudents = [...prevStudents];
      newStudents[index].fullName = value;

      // Validate student name
      setStudentErrors(prevErrors => {
        const newErrors = [...prevErrors];
        const studentErrorIndex = newErrors.findIndex(error => error.id === studentId);
        if (studentErrorIndex !== -1) {
          newErrors[studentErrorIndex].fullName = validateStudentName(value) ? '' : 'Поле обязательно для заполнения';
        } else {
          newErrors.push({ id: studentId, fullName: validateStudentName(value) ? '' : 'Поле обязательно для заполнения', course: '', email: '', hours: '' });
        }
        return newErrors;
      });

      return newStudents;
    });
  };

  const handleStudentEmailChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, studentId: number) => {
    const { value } = e.target;

    setStudents(prevStudents => {
      const newStudents = [...prevStudents];
      newStudents[index].email = value;

      // Validate student name
      setStudentErrors(prevErrors => {
        const newErrors = [...prevErrors];
        const studentErrorIndex = newErrors.findIndex(error => error.id === studentId);
        if (studentErrorIndex !== -1) {
          newErrors[studentErrorIndex].email = validateStudentEmail(value) ? '' : 'Поле обязательно для заполнения';
        } else {
          newErrors.push({ id: studentId, fullName: '', course: '', email: validateStudentEmail(value) ? '' : 'Поле обязательно для заполнения', hours: '' });
        }
        return newErrors;
      });

      return newStudents;
    });
  };

  const handleCourseChange = (selectedOption: { value: number; label: string } | null, studentId: number) => {
    setStudents(prevStudents => prevStudents.map(student =>
      student.id === studentId
        ? { ...student, course: selectedOption, hours: null }
        : student
    ));

    // Validate course selection
    setStudentErrors(prevErrors => {
      const newErrors = [...prevErrors];
      const studentErrorIndex = newErrors.findIndex(error => error.id === studentId);
      if (studentErrorIndex !== -1) {
        newErrors[studentErrorIndex].course = validateStudentCourse(selectedOption) ? '' : 'Выберите курс';
      } else {
        newErrors.push({ id: studentId, fullName: '', course: validateStudentCourse(selectedOption) ? '' : 'Выберите курс', email: '', hours: '' });
      }
      return newErrors;
    });
  };

  const handleHoursChange = (selectedOption: { value: string; label: string } | null, studentId: number) => {
    setStudents(prevStudents => prevStudents.map(student =>
      student.id === studentId
        ? { ...student, hours: selectedOption }
        : student
    ));

    setStudentErrors(prevErrors => {
      const newErrors = [...prevErrors];
      const studentErrorIndex = newErrors.findIndex(error => error.id === studentId);
      if (studentErrorIndex !== -1) {
        newErrors[studentErrorIndex].hours = validateStudentHours(selectedOption) ? '' : 'Выберите часы';
      } else {
        newErrors.push({ id: studentId, fullName: '', course: '', email: '', hours: validateStudentHours(selectedOption) ? '' : 'Выберите часы' });
      }
      return newErrors;
    });
  };

  const addStudent = () => {
    setStudents(prevStudents => [
      ...prevStudents,
      {
        id: prevStudents.length + 1,
        fullName: '',
        email: '',
        courseType: null,
        course: null,
        hours: null,
      }
    ]);
  };

  const removeStudent = (studentId: number) => {
    if (students.length > 1) {
      setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
    } else {
      alert('Минмальное количество студентов - 1!');
    }
  };

  const courseTypeOptions = coursesVariations.map(courseType => ({
    value: courseType.id,
    label: courseType.display_name,
  }));

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%'
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: '#FBF9F5',
      border: '1px solid #2D2323',
      padding: '9px 18px',
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
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: '10px',

      ':hover': {
        backgroundColor: '#E4DFF8',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '15px',
      fontWeight: '400',
      color: '#7D8592'
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none'
    }),
    indicatorContainer: (provided) => ({
      ...provided,
      color: '#2D2323'
    }),
  };

  // Helper function to calculate discounted price
  const calculateDiscountedPrice = (basePrice: number, discountPercentage: number) => {
    return basePrice - (basePrice * discountPercentage / 100);
  };

  // Calculate student price
  const calculateStudentPrice = (student: IStudent) => {
    const courseVariation = coursesVariations.find(variationEl => variationEl.id === student.courseType?.value);
    if (courseVariation) {
      const basePrice = Number(courseVariation.base_price);
      const discountPercentage = Number(courseVariation.discount_percentage);

      // Найти нужный hour_coefficient в зависимости от выбранного количества часов
      const selectedHourCoefficient = courseVariation.hour_coefficients.find(hour => hour.number_of_hours === student.hours?.value);

      // Если коэффициент найден, умножить его на базовую стоимость
      const priceCoefficient = selectedHourCoefficient ? Number(selectedHourCoefficient.price_coefficient) : 1;
      const adjustedPrice = basePrice * priceCoefficient;

      const discountedPrice = calculateDiscountedPrice(adjustedPrice, discountPercentage);
      return discountedPrice;
    }
    return 0;
  };


  // Calculate total price
  const totalPrice = students.reduce((acc, student) => {
    const courseVariation = coursesVariations.find(variationEl => variationEl.id === student.courseType?.value);
    if (courseVariation) {
      const basePrice = Number(courseVariation.base_price);
      const discountPercentage = Number(courseVariation.discount_percentage);

      // Найти нужный hour_coefficient в зависимости от выбранного количества часов
      const selectedHourCoefficient = courseVariation.hour_coefficients.find(hour => hour.number_of_hours === student.hours?.value);

      // Если коэффициент найден, умножить его на базовую стоимость
      const priceCoefficient = selectedHourCoefficient ? Number(selectedHourCoefficient.price_coefficient) : 1;
      const adjustedPrice = basePrice * priceCoefficient;

      const discountedPrice = calculateDiscountedPrice(adjustedPrice, discountPercentage);
      return acc + discountedPrice;
    }
    return acc;
  }, 0);


  const validatePhoneNumber = (phoneNumber: string) => {
    const phonePattern = /^\+7\d{10}$/;
    return phonePattern.test(phoneNumber);
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleCoordinatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      if (!value) {
        setErrors(prevErrors => ({ ...prevErrors, phoneNumber: 'Поле обязательно для заполнения' }));
      } else if (!validatePhoneNumber(value)) {
        setErrors(prevErrors => ({ ...prevErrors, phoneNumber: 'Номер телефона должен быть в формате +7XXXXXXXXXX' }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, phoneNumber: '' }));
      }
    }

    if (name === 'email') {
      if (!value) {
        setErrors(prevErrors => ({ ...prevErrors, email: 'Поле обязательно для заполнения' }));
      } else if (!validateEmail(value)) {
        setErrors(prevErrors => ({ ...prevErrors, email: 'Некорректный адрес электронной почты' }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, email: '' }));
      }
    }

    if (name === 'fullName' && !value) {
      setErrors(prevErrors => ({ ...prevErrors, fullName: 'Поле обязательно для заполнения' }));
    } else if (name === 'fullName') {
      setErrors(prevErrors => ({ ...prevErrors, fullName: '' }));
    }

    if (name === 'deliveryAddress' && !value) {
      setErrors(prevErrors => ({ ...prevErrors, deliveryAddress: 'Поле обязательно для заполнения' }));
    } else if (name === 'deliveryAddress') {
      setErrors(prevErrors => ({ ...prevErrors, deliveryAddress: '' }));
    }

    setCoordinator(prevCoordinator => ({ ...prevCoordinator, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setCheckboxChecked(checked);
    setErrors(prevErrors => ({ ...prevErrors, checkbox: checked ? '' : 'Необходимо согласиться с политикой конфиденциальности' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if there are validation errors or unfilled fields
    const newErrors = { ...errors };
    if (!coordinator.fullName) newErrors.fullName = 'Поле обязательно для заполнения';
    if (!coordinator.phoneNumber) newErrors.phoneNumber = 'Поле обязательно для заполнения';
    if (!validatePhoneNumber(coordinator.phoneNumber)) newErrors.phoneNumber = 'Номер телефона должен быть в формате +7XXXXXXXXXX';
    if (!coordinator.email) newErrors.email = 'Поле обязательно для заполнения';
    if (!validateEmail(coordinator.email)) newErrors.email = 'Некорректный адрес электронной почты';
    if (!coordinator.deliveryAddress) newErrors.deliveryAddress = 'Поле обязательно для заполнения';

    // Check if checkbox is checked
    const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
    if (!checkbox || !checkbox.checked) {
      newErrors.checkbox = 'Необходимо согласиться с политикой конфиденциальности';
    }

    setErrors(newErrors);

    // Stop if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      scroller.scrollTo('coordinatorInputs', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -150
      });
      return;
    }

    const newStudentErrors = students.map(student => ({
      id: student.id,
      fullName: validateStudentName(student.fullName) ? '' : 'Поле обязательно для заполнения',
      course: validateStudentCourse(student.course) ? '' : 'Выберите курс',
      hours: validateStudentHours(student.hours) ? '' : 'Выберите часы',
      email: validateStudentEmail(student.email) ? '' : 'Введите email',
    }));

    setStudentErrors(newStudentErrors);

    // If there are any errors, prevent form submission
    if (newStudentErrors.some(error => error.fullName || error.course)) {
      scroller.scrollTo('studentsInputs', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -150
      });
      return;
    }

    // Form the request body after all validations pass
    const requestBody = {
      coordinator: {
        full_name: coordinator.fullName,
        phone_number: coordinator.phoneNumber,
        email: coordinator.email,
        delivery_address: coordinator.deliveryAddress,
      },
      students: students.map(student => ({
        full_name: student.fullName,
        course: student.course?.value,
        number_of_hours: student.hours?.value,
      })),
    };

    try {
      const token = AuthService.getAccessToken();
      const response = await fetch(`${apiBaseUrl}/api/v1/courses/applications/collective/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        throw new Error('Failed to submit the application');
      }
      const data = await response.json();
      console.log('Application submitted successfully:', data);
      alert('Заявка успешно отправлена! Мы скоро свяжемся с Вами по указанному e-mail!');

      coordinator.fullName = '';
      coordinator.phoneNumber = '';
      coordinator.email = '';
      coordinator.deliveryAddress = '';
      setCheckboxChecked(false);
      setStudents([]);
      addStudent();
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };



  return (
    <section className={`${globalStyles.section_padding} ${styles.corporate_training}`}>
      <div className={globalStyles.container}>
        <Breadcrumbs links={breadcrumbLinks} />

        <div className={styles.corporate_training__content}>
          <div className={styles.corporate_training__content_wrapper}>
            <div className={styles.corporate_training__text}>
              <h2 className={`${globalStyles.title} ${styles.corporate_training__title}`}>
                Оформление коллективных заявок на курсы повышения квалификации
              </h2>
              <Element name="coordinatorInputs">
                <h3 className={styles.corporate_training__subtitle}>Заполните данные координатора</h3>
              </Element>
            </div>

            <form className={styles.corporate_training__form} onSubmit={handleSubmit}>
              <div className={styles.corporate_training__text}>
                <div className={styles.corporate_training__form_inputs}>
                  <input
                    className={styles.corporate_training__form_input}
                    type="text"
                    name="fullName"
                    placeholder='Фамилия, имя, отчество'
                    value={coordinator.fullName}
                    onChange={handleCoordinatorChange}
                  />
                  {errors.fullName && <span className={styles.ErrorText}>{errors.fullName}</span>}
                  <input
                    className={styles.corporate_training__form_input}
                    type="text"
                    name="phoneNumber"
                    placeholder='Номер телефона для смс информирования о доставке'
                    value={coordinator.phoneNumber}
                    onChange={handleCoordinatorChange}
                  />
                  {errors.phoneNumber && <span className={styles.ErrorText}>{errors.phoneNumber}</span>}
                  <input
                    className={styles.corporate_training__form_input}
                    type="text"
                    name="email"
                    placeholder='E-mail'
                    value={coordinator.email}
                    onChange={handleCoordinatorChange}
                  />
                  {errors.email && <span className={styles.ErrorText}>{errors.email}</span>}
                  <input
                    className={styles.corporate_training__form_input}
                    type="text"
                    name="deliveryAddress"
                    placeholder='Адрес доставки документов'
                    value={coordinator.deliveryAddress}
                    onChange={handleCoordinatorChange}
                  />
                  {errors.deliveryAddress && <span className={styles.ErrorText}>{errors.deliveryAddress}</span>}
                </div>

                <div className={styles.corporate_training__form_label}>
                  <div className={styles.corporate_training__form_label_content}>
                    <input type="checkbox" checked={checkboxChecked} onChange={handleCheckboxChange} />
                    <div>Я согласен с обработкой персональных данных и <span onClick={() => handleLinkClick("/policy")}>политикой конфиденциальности</span></div>
                  </div>
                  {errors.checkbox && <span className={styles.ErrorText}>{errors.checkbox}</span>}
                </div>
              </div>

              <Element name="studentsInputs">
                <h3 className={`${styles.corporate_training__subtitle} ${styles.corporate_training__subtitle_margin}`}>Заполните данные об обучающихся</h3>
              </Element>

              <ul className={`${globalStyles.list_reset} ${styles.corporate_training__applications}`}>
                <li className={`${styles.corporate_training__applications_item} ${styles.corporate_training__applications_item_header}`}>
                  <div className={`${styles.corporate_training__applications_column} ${styles.corporate_training__applications_column_center}`}>ФИО обучающегося</div>
                  <div className={styles.corporate_training__applications_column}>Тип курсов</div>
                  <div className={styles.corporate_training__applications_column}>Название курса</div>
                  <div className={styles.corporate_training__applications_column}>E-mail</div>
                  <div className={`${styles.corporate_training__applications_column} ${styles.corporate_training__applications_column_padding_x_header} ${styles.corporate_training__applications_column_border}`}>Кол-во часов</div>
                  <div className={`${styles.corporate_training__applications_column} ${styles.corporate_training__applications_column_padding_x_header} ${styles.corporate_training__applications_column_center}`}>Стоимость</div>
                </li>

                {students.map((student, index) => (
                  <li className={styles.corporate_training__applications_item} key={student.id}>
                    <div className={`${styles.corporate_training__applications_column} ${styles.corporate_training__applications_column_error}`}>
                      <input
                        className={styles.corporate_training__applications_input}
                        type="text"
                        placeholder='Фамилия, имя, отчество'
                        value={student.fullName}
                        onChange={(e) => handleStudentNameChange(e, index, student.id)}
                      />
                      {studentErrors.find(error => error.id === student.id)?.fullName && (
                        <span className={styles.ErrorText}>
                          {studentErrors.find(error => error.id === student.id)?.fullName}
                        </span>
                      )}
                    </div>
                    <div className={styles.corporate_training__applications_column}>
                      <Select
                        styles={customStyles}
                        options={courseTypeOptions}
                        placeholder='Выберите тип курса'
                        value={student.courseType}
                        onChange={(selectedOption) => handleCourseTypeChange(selectedOption, student.id)}
                        isSearchable={false}
                      />
                    </div>
                    <div className={`${styles.corporate_training__applications_column} ${styles.corporate_training__applications_column_error}`}>
                      <Select
                        styles={customStyles}
                        options={student.courseType ? courses?.results
                          .filter(course => course.variation === student.courseType?.value)
                          .map(course => ({ value: course.id, label: course.title })) : []}
                        placeholder='Выберите курс'
                        value={student.course}
                        onChange={(selectedOption) => handleCourseChange(selectedOption, student.id)}
                        isDisabled={!student.courseType}
                        isSearchable={true}
                      />
                      {studentErrors.find(error => error.id === student.id)?.course && (
                        <span className={styles.ErrorText}>
                          {studentErrors.find(error => error.id === student.id)?.course}
                        </span>
                      )}
                    </div>
                    <div className={`${styles.corporate_training__applications_column} ${styles.corporate_training__applications_column_padding_right} ${styles.corporate_training__applications_column_error}`}>
                      <input
                        className={styles.corporate_training__applications_input}
                        type="email"
                        placeholder='Введите E-mail'
                        value={student.email}
                        onChange={(e) => handleStudentEmailChange(e, index, student.id)}
                      />
                      {studentErrors.find(error => error.id === student.id)?.email && (
                        <span className={styles.ErrorText}>
                          {studentErrors.find(error => error.id === student.id)?.email}
                        </span>
                      )}
                    </div>
                    <div className={`${styles.corporate_training__applications_column} ${styles.corporate_training__applications_column_padding_x} ${styles.corporate_training__applications_column_border} ${styles.corporate_training__applications_column_error}`}>
                      <Select
                        styles={customStyles}
                        options={student.courseType ? coursesVariations.find(variation => variation.id === student.courseType?.value)?.hour_coefficients.map(hour => ({
                          value: hour.number_of_hours,
                          label: `${hour.number_of_hours} часов`
                        })) : []}
                        placeholder='Выберите количество часов'
                        value={student.hours}
                        onChange={(selectedOption) => handleHoursChange(selectedOption, student.id)}
                        isDisabled={!student.course}
                        isSearchable={false}
                      />
                      {studentErrors.find(error => error.id === student.id)?.hours && (
                        <span className={styles.ErrorText}>
                          {studentErrors.find(error => error.id === student.id)?.hours}
                        </span>
                      )}
                    </div>
                    <div className={`${styles.corporate_training__applications_column} ${styles.corporate_training__applications_column_padding_x}`}>
                      <div className={styles.corporate_training__applications_price}>
                        <span className={styles.corporate_training__applications_price_text}>{calculateStudentPrice(student)} руб</span>

                        <button
                          type="button"
                          onClick={() => removeStudent(student.id)}
                          className={`${globalStyles.btn_reset} ${styles.corporate_training__applications_price_btn}`}
                        ></button>
                      </div>
                    </div>
                  </li>
                ))}



                <li className={`${styles.corporate_training__applications_item} ${styles.corporate_training__applications_item_total}`}>
                  <div className={styles.corporate_training__applications_column}>
                    <div className={styles.corporate_training__applications_item_total_content}>
                      <span>Количество обучающихся:</span>
                      <span>{students.length}</span>
                    </div>
                  </div>
                  <div className={`${styles.corporate_training__applications_column} ${styles.corporate_training__applications_column_padding_x} ${styles.corporate_training__applications_column_border}`}>
                    <div className={styles.corporate_training__applications_item_total_text}>Итого:</div>
                  </div>
                  <div className={`${styles.corporate_training__applications_column} ${styles.corporate_training__applications_column_padding_x}`}>
                    <div className={styles.corporate_training__applications_item_total_numbers}>{totalPrice} руб</div>
                  </div>
                </li>
              </ul>

              <div className={styles.corporate_training__applications_btns}>
                <button
                  type="button"
                  onClick={addStudent}
                  className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.corporate_training__applications_btn} ${styles.corporate_training__applications_btn_transparent}`}
                >
                  Добавить обучающегося
                </button>

                <button type="submit" className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.corporate_training__applications_btn}`}>
                  Подтвердить заявку на обучение
                </button>
              </div>

            </form>
            <img className={styles.corporate_training__img} src={CorporateTrainingContentImg} alt="Corporate Training Content" width={362} height={644} />
          </div>

          <div className={styles.corporate_training__content_overlay}>
            <span>РАЗДЕЛ В РАЗРАБОТКЕ</span>
          </div>
        </div>

        <Feedback />
      </div>
    </section>
  );
};

export default CorporateTraining;
