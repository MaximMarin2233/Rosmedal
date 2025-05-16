import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import InputMask from 'react-input-mask';
import axios from 'axios';

import DatePicker, { registerLocale } from 'react-datepicker';
import { Locale } from 'date-fns'; // Импорт типа Locale
import ru from 'date-fns/locale/ru'; // Убедитесь, что используется правильный импорт
import 'react-datepicker/dist/react-datepicker.css'; // Импорт стилей для DatePicker

registerLocale('ru', ru as unknown as Locale);

import AuthService from '../../services/AuthService';
import globalStyles from '../../App.module.sass';
import profileStyles from '../CabProfile/CabProfile.module.sass';
import walletStyles from '../CabWallet/CabWallet.module.sass';
import cabIssueStyles from '../CabIssue/CabIssue.module.sass';
import documentsStyles from '../CabDocuments/CabDocuments.module.sass';
import modalStyles from '../../components/ModalComponent/ModalComponent.module.sass';
import olympiadsStyles from '../Olympiads/content/OlympiadsChoice/OlympiadsChoice.module.sass';
import styles from './CabCourses.module.sass';
import Feedback from '../../components/Feedback/Feedback';
import CabAside from '../../components/CabAside/CabAside';
import ModalComponent from '../../components/ModalComponent/ModalComponent';

import CabWalletBonusFile from '../../assets/cab-wallet/cab-wallet-bonus-file.svg';
import CabCoursesAddition1 from '../../assets/cab-courses/cab-courses-addition-1.png';
import CabCoursesAddition2 from '../../assets/cab-courses/cab-courses-addition-2.png';
import CabCoursesAddition3 from '../../assets/cab-courses/cab-courses-addition-3.png';
import CabCoursesChecked from '../../assets/cab-courses/cab-courses-checked.svg';
import CabCoursesErr from '../../assets/cab-courses/cab-courses-err.svg';
import CabCoursesCertificate from '../../assets/cab-courses/cab-courses-certificate.png';

import CabCoursesDocVariation1 from '../../assets/cab-courses/cab-courses-variation-1.png';
import CabCoursesDocVariation2 from '../../assets/cab-courses/cab-courses-variation-2.png';
import CabCoursesDocVariation2App from '../../assets/cab-courses/cab-courses-variation-2-app.png';

import Logo from "../../assets/images/logo.svg";

interface ICourses {
  id: number;
  course_title: string;
  course_variation: number;
  number_of_hours: number;
  is_paid: boolean;
}

interface IModules {
  module_order: number;
  title: string;
  number_of_hours: number;
}

interface ICoursesVariations {
  id: number;
  display_name: string;
  base_price: string;
  discount_percentage: string;
  coupon_discount: string;
  hour_coefficients: ICoursesHoursCoefficients[];
}

interface ICoursesHoursCoefficients {
  number_of_hours: number;
  price_coefficient: string;
}

interface ICoursesAdditions {
  id: number;
  title: string;
  price: string;
}

interface IOlympiadDetail {
  title: string;
  description: string;
  questions: IOlympiadDetailQuestions[];
  // Добавьте другие поля, если они есть
}

interface IOlympiadDetailQuestions {
  question: string;
  answers: IOlympiadDetailQuestionsAnswers[];
}

interface IOlympiadDetailQuestionsAnswers {
  title: string;
  is_correct: boolean;
}

const CabCourses = () => {
  // Данные для документов:

  // Удостоверение о повышении квалификации:
  const diplomAppLeader = 'Лигаев С. О.'; // Руководитель
  const diplomAppSecretary = 'Лигаев С. О.'; // Секретарь

  // Диплом о профессиональной переподготовке:
  const diplomChairPerson = 'Лигаев С. О.'; // Председатель комиссии
  const diplomLeader = 'Лигаев С. О.'; // Руководитель
  const diplomSecretary = 'Лигаев С. О.'; // Секретарь

  // Приложение к диплому о профессиональной переподготовке:
  const certificateLeader = 'Лигаев С. О.'; // Руководитель
  const certificateSecretary = 'Лигаев С. О.'; // Секретарь



  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = AuthService.getAccessToken();

  const [courses, setCourses] = useState<ICourses[]>([]);
  const [modules, setModules] = useState<IModules[]>([]);
  const [coursesVariations, setCoursesVariations] = useState<ICoursesVariations[]>([]);
  const [coursesAdditions, setCoursesAdditions] = useState<ICoursesAdditions[]>([]);
  const [selectedAdditions, setSelectedAdditions] = useState<number[]>([]);

  const handleCheckboxChange = (id: number) => {
    setSelectedAdditions((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((itemId) => itemId !== id); // Удалить, если анчек
      } else {
        return [...prevSelected, id]; // Добавить, если чек
      }
    });
  };

  const isAdditionSelected = (id: number) => selectedAdditions.includes(id);

  const [formData, setFormData] = useState({
    number_of_coupons: '',
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
    diploma_scan: null as File | null,
    graduation_date: '',
    qualification: '',
    delivery_country: '',
    delivery_region: '',
    delivery_city: '',
    delivery_street: '',
    delivery_house: '',
    delivery_flat: '',
    post_index: '',
    delivery_address: '',
    is_paid: false,
    test_passed: false,
    track_number: '',
  });

  const [errors, setErrors] = useState({
    last_name: '',
    first_name: '',
    patronymic: '',
    email: '',
    phone_number: '',
    snils: '',
    graduation_date: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/cab/courses`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setCourses(data.results);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchCoursesVariations = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/courses/variations`);
        const data = await response.json();
        setCoursesVariations(data.results);
      } catch (error) {
        console.error('Error fetching courses variations:', error);
      }
    };

    const fetchAdditions = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/cab/courses/additions`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setCoursesAdditions(data.results);
      } catch (error) {
        console.error('Error fetching courses variations:', error);
      }
    };

    fetchCourses();
    fetchCoursesVariations();
    fetchAdditions();
  }, [apiBaseUrl]);

  const [currentContent, setCurrentContent] = useState(0);
  const [currentId, setCurrentId] = useState(0);
  const [currentCreatedDate, setCurrentCreatedDate] = useState('');
  const [currentVariationId, setCurrentVariationId] = useState(0);
  const [currentCoursePrice, setCurrentCoursePrice] = useState(0);
  const [currentCourseDiscount, setCurrentCourseDiscount] = useState(0);
  const [currentCourseCoupon, setCurrentCourseCoupon] = useState(0);
  const [currentVariation, setCurrentVariation] = useState('');
  const [currentTitle, setCurrentTitle] = useState('Выберите курс!');
  const [currentTitleVariation, setCurrentTitleVariation] = useState('');
  const [currentTitleVariationHours, setCurrentTitleVariationHours] = useState('');

  const [currentDefaultMaterialsLink, setCurrentDefaultMaterialsLink] = useState('');

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [gender, setGender] = useState<{ value: string, label: string } | null>(null);
  const [citizenship, setСitizenship] = useState<{ value: string, label: string } | null>(null);
  const [education, setEducation] = useState<{ value: string, label: string } | null>(null);

  const [updateFlag, setUpdateFlag] = useState(false);

  const coursesOptions = [
    {
      value: '1',
      label: 'Неоплаченные курсы',
    },
    {
      value: '2',
      label: 'Оплаченные курсы',
    },
  ];

  const tabsOptions = [
    {
      value: '1',
      label: '1. Заполните данные',
    },
    {
      value: '2',
      label: '2. Загрузить документы',
    },
    {
      value: '3',
      label: '3. Информация',
    },
    {
      value: '4',
      label: '4. Оплатить',
    },
    {
      value: '5',
      label: '5. Приступить к обучению',
    },
  ];

  const [coursesType, setCoursesType] = useState<{ value: string, label: string } | null>(coursesOptions[0] || null);
  const [tabsType, setTabsType] = useState<{ value: string, label: string } | null>(tabsOptions[0] || null);

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

  const handleCoursesTypeChange = (option: { value: string, label: string } | null) => {
    setCoursesType(option);
    setCurrentContent(0);
    setCurrentId(0);
    setCurrentTitle('Выберите курс!');
    setCurrentVariation('');
    setSelectedIndex(null);

    if (option && option.value === '2') {
      setUpdateFlag(true);
    } else {
      setUpdateFlag(false);
    }

  };

  const handleTabsTypeChange = (option: { value: string, label: string } | null) => {
    if (currentId !== 0 && option) {
      setTabsType(option);
      setCurrentContent(Number(option.value));
    } else {
      alert('Сначала выберите курс!');

      return;
    }

    if (option && Number(option.value) === 5 && currentId !== 0 && (coursesType && coursesType.value === '2')) {
      setTabsType(option);
      setCurrentContent(Number(option.value));
    } else if (option && Number(option.value) === 5 && currentId !== 0 && (coursesType && coursesType.value === '1')) {
      alert('Сначала оплатите курс!');
    }
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

  const coursesTypeStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%'
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: 'none',
      border: 'none',
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
      backgroundColor: state.isSelected ? '#CBD5F8' : '#fff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: '10px',

      ':hover': {
        backgroundColor: '#EBEFFF',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '14px',
      fontWeight: '600',
      color: '#7d8592'
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '14px',
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

  const tabsTypeStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
      marginBottom: '35px'
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: '#FB998A',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      padding: '5px 20px'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#fff',
      borderRadius: '10px'
    }),
    option: (provided, state) => ({
      ...provided,
      color: '#2D2323',
      backgroundColor: state.isSelected ? '#FB998A' : '#fff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: '10px',
      paddingRight: '28px',
      paddingLeft: '28px',

      ':hover': {
        backgroundColor: '#EBEFFF',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '14px',
      fontWeight: '600',
      color: '#2D2323'
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '14px',
      fontWeight: '600',
      color: '#2D2323'
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#2D2323',
      ':hover': {
        color: '#2D2323',
      },
    }),
    indicatorContainer: (provided) => ({
      ...provided,
      color: '#2D2323'
    }),
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

  const MAX_FILE_SIZE_MB = 5;
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Файл превышает максимальный размер ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setFile(droppedFile);

    setFormData((prevFormData) => ({
      ...prevFormData,
      diploma_scan: droppedFile,
    }));
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

    if (chosenFile && chosenFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Файл превышает максимальный размер ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setFile(chosenFile);

    // Update formData with the file for "diploma_scan"
    setFormData((prevFormData) => ({
      ...prevFormData,
      diploma_scan: chosenFile,
    }));
  };


  const handleCourseDelete = () => {
    const confirmDelete = window.confirm('Вы действительно хотите удалить курс?');

    if (confirmDelete) {
      console.log(currentId);

      fetch(`${apiBaseUrl}/api/v1/cab/courses/delete/${currentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      alert('Курс удален!');
      window.location.reload();
    }
  };

  const [completionDate, setCompletionDate] = useState('');
  const [plannedDocsDate, setPlannedDocsDate] = useState('');
  const [plannedDocsDepositDate, setPlannedDocsDepositDate] = useState('');

  const [testId, setTestId] = useState(0);
  const [modalKey, setModalKey] = useState<number | null>(null);
  const [modalContent, setModalContent] = useState<IOlympiadDetail | null>(null);
  const [questionsStatus, setQuestionsStatus] = useState<(boolean | null)[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [checkedAnswers, setCheckedAnswers] = useState<{ [key: number]: string[] }>({});
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [skippedFlag, setSkippedFlag] = useState(true);
  const [skippedQuestions, setSkippedQuestions] = useState<number[]>([]);

  useEffect(() => {
    if (modalKey !== null) {
      const fetchModalContent = async () => {
        try {
          const response = await fetch(`${apiBaseUrl}/api/v1/olympiads/${modalKey}`);
          const data: IOlympiadDetail = await response.json();
          setModalContent(data);
          setQuestionsStatus(new Array(data.questions.length).fill(null)); // Инициализация статуса вопросов
          setStartTime(new Date()); // Установить время начала теста
        } catch (error) {
          console.error('Error fetching modal content:', error);
        }
      };

      fetchModalContent();
    }
  }, [modalKey]);

  const openModal = (key: number) => {
    setModalKey(key);
    setIsTestModalOpen(true);
    setCurrentQuestionIndex(0); // Начинаем с первого вопроса
    setSelectedAnswers([]); // Сбросить выбранные ответы
    setQuestionsStatus([]); // Сбросить статус вопросов
    setCheckedAnswers({}); // Сбросить проверенные ответы
    setIsAnswerChecked(false); // Сбросить проверку ответа
    setIsTestCompleted(false); // Сбросить состояние завершения теста
  };

  const closeModal = () => {
    setSkippedFlag(true);
    setIsTestModalOpen(false);
    setQuestionsStatus([]);
    setIsTestCompleted(false);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedAnswers(prevAnswers => {
      if (checked) {
        return [...prevAnswers, value];
      } else {
        return prevAnswers.filter(answer => answer !== value);
      }
    });
  };

  const checkAnswer = () => {
    const currentQuestion = modalContent?.questions[currentQuestionIndex];
    if (currentQuestion) {
      const isCorrect = currentQuestion.answers.every(answer =>
        selectedAnswers.includes(answer.title) === answer.is_correct
      );
      setIsAnswerChecked(true);

      // Обновить состояние вопросов
      setQuestionsStatus(prevStatus => {
        const newStatus = [...prevStatus];
        newStatus[currentQuestionIndex] = isCorrect;
        return newStatus;
      });

      // Обновить состояние проверенных ответов
      setCheckedAnswers(prevCheckedAnswers => ({
        ...prevCheckedAnswers,
        [currentQuestionIndex]: selectedAnswers,
      }));
    }
  };

  const skipQuestion = () => {
    setSkippedQuestions(prevSkipped => [...prevSkipped, currentQuestionIndex]);
    nextQuestion();
  };

  const nextQuestion = () => {
    setIsAnswerChecked(false);
    setCheckedAnswers(prevCheckedAnswers => ({
      ...prevCheckedAnswers,
      [currentQuestionIndex]: [],
    }));
    setSelectedAnswers([]);

    console.log(skippedQuestions);

    if ((currentQuestionIndex < (modalContent?.questions.length ?? 0) - 1) && skippedFlag) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (skippedQuestions.length > 0) {
      setSkippedFlag(false);

      setCurrentQuestionIndex(skippedQuestions[0]);
      setSkippedQuestions(prevSkipped => prevSkipped.slice(1));
    } else {
      setEndTime(new Date()); // Установить время завершения теста
      setIsTestCompleted(true); // Установить состояние завершения теста

      if (Number(getResults().percentage) >= 100) {
        const body = {
          user_course: currentId
        };

        fetch(`${apiBaseUrl}/api/v1/cab/courses/pass_test`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        })
          .then(response => {
            return response.json();
          })
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }
  };

  const getResults = () => {
    const correctAnswersCount = questionsStatus.filter(status => status === true).length;
    const totalQuestions = questionsStatus.length;
    const percentage = (correctAnswersCount / totalQuestions) * 100;
    const timeSpent = endTime && startTime ? ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(2) : '0';

    return { correctAnswersCount, totalQuestions, percentage, timeSpent };
  };

  const handleCourseChoice = async (id) => {
    const url = `${apiBaseUrl}/api/v1/cab/courses/${id}`;

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

      setFormData((prevFormData) => ({
        ...prevFormData,
        ...(data.last_name && { last_name: data.last_name }),
        ...(data.first_name && { first_name: data.first_name }),
        ...(data.patronymic && { patronymic: data.patronymic }),
        ...(data.date_of_birth && { date_of_birth: data.date_of_birth }),
        ...(data.gender && { gender: data.gender }),
        ...(data.citizenship && { citizenship: data.citizenship }),
        ...(data.education_degree && { education_degree: data.education_degree }),
        ...(data.diploma_series && { diploma_series: data.diploma_series }),
        ...(data.diploma_number && { diploma_number: data.diploma_number }),
        ...(data.graduation_date && { graduation_date: data.graduation_date }),
        ...(data.qualification && { qualification: data.qualification }),
        ...(data.position && { position: data.position }),
        ...(data.snils && { snils: data.snils }),
        ...(data.delivery_address && { delivery_address: data.delivery_address }),
        ...(data.is_paid && { is_paid: data.is_paid }),
        test_passed: data.test_passed,
        ...(data.track_number && { track_number: data.track_number }),
      }));

      if (data.diploma_scan) {
        const extractedFileName = data.diploma_scan.split('/').pop();
        setFileName(extractedFileName || null);
        setFileUrl(data.diploma_scan);
      }

      const currentCreatedDate = new Date(data.created_at);
      setCurrentCreatedDate(currentCreatedDate.toISOString().split('T')[0]);

      const calculateDays = (hours: number): number => Math.ceil(hours / 12); // 12 часов в день

      // Рассчитываем completionDate
      const daysToAdd = calculateDays(data.number_of_hours);
      const createdDate = new Date(data.created_at);
      createdDate.setDate(createdDate.getDate() + daysToAdd);
      const formattedCompletionDate = createdDate.toISOString().split('T')[0];
      setCompletionDate(formattedCompletionDate);

      // Рассчитываем plannedDocsDate (+5 дней от completionDate)
      const completionDateObj = new Date(createdDate);
      completionDateObj.setDate(completionDateObj.getDate() + 5);
      const formattedPlannedDocsDate = completionDateObj.toISOString().split('T')[0];
      setPlannedDocsDate(formattedPlannedDocsDate);

      // Рассчитываем plannedDocsDepositDate (+7 дней от completionDate)
      const plannedDocsDepositDateObj = new Date(createdDate);
      plannedDocsDepositDateObj.setDate(plannedDocsDepositDateObj.getDate() + 7);
      const formattedPlannedDocsDepositDate = plannedDocsDepositDateObj.toISOString().split('T')[0];
      setPlannedDocsDepositDate(formattedPlannedDocsDepositDate);

      const url2 = `${apiBaseUrl}/api/v1/courses/${data.course}`;

      try {
        const response = await fetch(url2, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dataDefault = await response.json();
        console.log(dataDefault);

        setTestId(dataDefault.test);
        setCurrentDefaultMaterialsLink(dataDefault.teaching_materials);

        setModules(dataDefault.syllabuses.find(option => option.course_hours === data.number_of_hours).modules);



      } catch (error) {
        console.error('Error fetching dataDefault:', error);
      }


    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


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

  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleDateChange = (date: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      date_of_birth: date ? date.toISOString().split('T')[0] : '', // Сохранение в формате YYYY-MM-DD
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Валидация значений
    validateField(name, value);
  };

  const validateField = (name, value) => {
    if (name === 'last_name' || name === 'first_name' || name === 'patronymic') {
      if (value.length > 0 && !validateCyrillicName(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${name === 'last_name' ? 'Фамилия' : name === 'first_name' ? 'Имя' : 'Отчество'} должно начинаться с заглавной кириллической буквы.`,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }
    if (name === 'phone_number') {
      if (value.length === 16 && !validatePhoneNumber(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone_number: 'Номер телефона должен соответствовать формату +7-xxx-xxx-xx-xx.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone_number: '',
        }));
      }
    }
    if (name === 'email') {
      if (value.length > 0 && !validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Введите корректный E-mail!',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: '',
        }));
      }
    }
    if (name === 'snils') {
      if (!validateSnils(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          snils: 'Снилс должен соответствовать формату xxx-xxx-xxx-xx',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          snils: '',
        }));
      }
    }
    if (name === 'graduation_date') {
      if (!validateGraduationDate(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          graduation_date: 'Год должен соответствовать формату xxxx',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          graduation_date: '',
        }));
      }
    }
  };


  // В useEffect:
  useEffect(() => {
    if (updateFlag) {
      return;
    }

    if (timeoutId) clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(() => {
      // Отправка данных на сервер
      const bodyToSend = {
        last_name: formData.last_name,
        first_name: formData.first_name,
        patronymic: formData.patronymic,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender,
        citizenship: formData.citizenship,
        education_degree: formData.education_degree,
        diploma_series: formData.diploma_series,
        diploma_number: formData.diploma_number,
        graduation_date: formData.graduation_date,
        qualification: formData.qualification,
        position: formData.position,
        snils: formData.snils,
        delivery_address: formData.delivery_address,
      };

      fetch(`${apiBaseUrl}/api/v1/cab/courses/update/${currentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyToSend),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }, 500); // задержка 500мс перед отправкой запроса

    setTimeoutId(newTimeoutId);
  }, [formData]); // эффект срабатывает при изменении formData


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

        setFormData({
          number_of_coupons: data.number_of_coupons || '',
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
          diploma_scan: null as File | null,
          graduation_date: data.graduation_date || '',
          qualification: data.qualification || '',
          delivery_country: data.delivery_country || '',
          delivery_region: data.delivery_region || '',
          delivery_city: data.delivery_city || '',
          delivery_street: data.delivery_street || '',
          delivery_house: data.delivery_house || '',
          delivery_flat: data.delivery_flat || '',
          post_index: data.post_index || '',
          delivery_address: '',
          is_paid: false,
          test_passed: false,
          track_number: '',
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCourseChange = (e) => {
    e.preventDefault();

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

    if (!isLastNameValid || !isFirstNameValid || !isPatronymicValid ||
      !isPhoneNumberValid || !isEmailValid || !isSnilsValid ||
      !isGraduationDateValid) {
      return;
    }

    setErrors({
      last_name: '',
      first_name: '',
      patronymic: '',
      email: '',
      phone_number: '',
      snils: '',
      graduation_date: '',
    });

    const bodyToSend = {
      last_name: formData.last_name,
      first_name: formData.first_name,
      patronymic: formData.patronymic,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      citizenship: formData.citizenship,
      education_degree: formData.education_degree,
      diploma_series: formData.diploma_series,
      diploma_number: formData.diploma_number,
      graduation_date: formData.graduation_date,
      qualification: formData.qualification,
      position: formData.position,
      snils: formData.snils,
      delivery_address: formData.delivery_address,
    }

    fetch(`${apiBaseUrl}/api/v1/cab/courses/update/${currentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyToSend),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Данные успешно изменены!');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleFileSend = () => {
    const formDataToSend = new FormData();

    if (!formData.diploma_scan) {
      alert('Выберите файл!');
      return;
    }

    formDataToSend.append('diploma_scan', formData.diploma_scan);

    fetch(`${apiBaseUrl}/api/v1/cab/courses/update/${currentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formDataToSend,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Файл успешно прикреплен!');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      delivery_address: value, // обновляем поле адреса при каждом вводе
    }));

    if (value.length > 3) {  // Начнем поиск, когда длина строки больше 3 символов
      try {
        const response = await axios.post(
          'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
          { query: value },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Token d1f465ca334d76248722c0d6d82c09a6efc1e1ae',
            },
          }
        );
        setSuggestions(
          response.data.suggestions.map((suggestion: any) =>
            `${suggestion.data.postal_code ? suggestion.data.postal_code : '—'}, ${suggestion.value}`
          )
        );
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };


  const handleSuggestionClick = (suggestion: string) => {
    // Парсим подсказку для извлечения postal_code и city
    const [postalCode, cityAndAddress] = suggestion.split(', ');
    const city = cityAndAddress?.split(',')[0] || ''; // Если city перед запятой

    localStorage.setItem('currentPostalCode', postalCode);
    localStorage.setItem('currentCity', city);

    // Обновляем поле delivery_address
    setFormData((prevFormData) => ({
      ...prevFormData,
      delivery_address: suggestion, // обновляем только поле delivery_address
    }));

    // Очищаем подсказки после выбора
    setSuggestions([]);
  };


  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const [yookassaChecked, setYookassaChecked] = useState(true);
  const [balanceChecked, setBalanceChecked] = useState(false);
  const [payFromBalance, setPayFromBalance] = useState(false);

  const [currentPromo, setCurrentPromo] = useState('');
  const [promo, setPromo] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const handleCheckPromo = (e) => {
    e.preventDefault();

    if (promo.length === 0) {
      alert('Вы не ввели промокод!');
      setDiscountPercentage(0);
      setCurrentPromo('');
      return;
    }

    // Отправка GET-запроса на сервер
    fetch(`${apiBaseUrl}/api/v1/cab/promotional_codes/${promo}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status === 404) {
          alert('Введенный промокод не найден!'); // Показываем alert сразу при 404
          setDiscountPercentage(0);
          setCurrentPromo('');
          return;
        }
        return response.json(); // Преобразование ответа в JSON в случае успеха
      })
      .then(data => {
        if (data) {
          console.log(data);
          // Сохраняем скидку в состояние, если она есть
          setDiscountPercentage(data.discount_percentage || 0);
          setCurrentPromo(data.code || '');
        }
      })
      .catch((error) => {
        console.error('Error:', error); // Общая обработка ошибок
      });
  };


  const handleCoursePurchase = () => {
    const body = {
      additions: selectedAdditions,
      from_balance: payFromBalance,
      user_course: currentId,
      ...(currentPromo.length > 0 && { promotional_code: currentPromo })
    };

    if (currentPromo.length > 0) {
      body.promotional_code = currentPromo;
    }

    // Отправка обновленных данных на сервер
    fetch(`${apiBaseUrl}/api/v1/cab/courses/purchase`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            // Determine the error message based on the response structure
            const errorMessage = errorData.error
              ? 'Недостаточно средств, пополните баланс'
              : errorData.user_course
                ? errorData.user_course.join(", ")
                : 'Произошла ошибка';

            alert(errorMessage);
            throw new Error(errorMessage); // Stop further processing
          });
        }
        // If response is OK, convert it to JSON
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);

        if (data.confirmation) {
          window.open(data.confirmation.confirmation_url, '_blank');
          alert('Завершите оплату через ЮKassa!');
        } else {
          alert('Курс оплачен!');
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });



  };

  const totalAdditionsPrice = selectedAdditions.reduce((sum, additionId) => {
    const addition = coursesAdditions.find(addition => addition.id === additionId);
    return sum + (addition ? parseFloat(addition.price) : 0);
  }, 0);

  const totalPriceWithSale =
    ((currentCoursePrice * (1 - currentCourseDiscount / 100)) +
      totalAdditionsPrice) *
    (1 - discountPercentage / 100) -
    (+formData.number_of_coupons > 0 ? currentCourseCoupon : 0);


  const totalPrice =
    (currentCoursePrice + totalAdditionsPrice) *
    (1 - discountPercentage / 100) -
    (+formData.number_of_coupons > 0 ? currentCourseCoupon : 0);


  const [deadlineDate, setDeadlineDate] = useState<string>('');

  useEffect(() => {
    const updateDeadline = () => {
      const currentDate = new Date();
      const nextDeadline = new Date(currentDate.setDate(currentDate.getDate() + 3)); // Add 3 days
      setDeadlineDate(
        nextDeadline.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
        })
      ); // Format the date to "DD.MM" without year
    };

    updateDeadline(); // Set initial deadline

    // Set an interval to update the deadline every 3 days
    const interval = setInterval(updateDeadline, 3 * 24 * 60 * 60 * 1000); // 3 days in milliseconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);

  const requiredFields = [
    'last_name',
    'first_name',
    'patronymic',
    'date_of_birth',
    'gender',
    'citizenship',
    'education_degree',
    'diploma_series',
    'diploma_number',
    'graduation_date',
    'qualification',
    'position',
    'snils',
    'delivery_address',
  ];

  const isFormDataComplete = (formData: Record<string, any>) => {
    return requiredFields.every(field => formData[field] !== '' && formData[field] !== null && formData[field] !== undefined);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDownloadCertificatePDF = async () => {
    // Создаем контейнер для рендера HTML-контента
    const container = document.createElement('div');
    container.className = styles.certificate;

    // Наполняем контейнер нужным HTML-контентом
    container.innerHTML = `
      <div class="${styles.certificate__promo}">
        <img src="${Logo}" alt="" width="145" />
        <div class="${styles.certificate__promo_bold}">
          ООО Институт повышения квалификации и переподготовки «Современное образование»
        </div>
        <div>
          660075, г. Красноярск, <br />
          ул. Маерчака, д. 38, помещ. 520
        </div>
        <div class="${styles.certificate__promo_underline}">sovobrazhelp@gmail.com</div>
        <div class="${styles.certificate__promo_separator}"></div>
        <div class="${styles.certificate__promo_bold}">${formatDate(currentCreatedDate)}</div>
      </div>
      <div class="${styles.certificate__content}">
        <div class="${styles.certificate__content_title}">СПРАВКА</div>
        <div class="${styles.certificate__content_text_indent}">
          Настоящим подтверждаем, что ${formatDate(currentCreatedDate)} ${formData.first_name && formData.last_name && formData.patronymic ? `${formData.first_name} ${formData.last_name} ${formData.patronymic}` : '—'} зачислен(а) в ООО Институт повышения квалификации и переподготовки «Современное образование» для обучения по программе профессионального повышения квалификации «${currentTitle}»
        </div>
        <div class="${styles.certificate__content_author}">
          <img src="${CabCoursesCertificate}" alt="" width="180" />
          <span>Генеральный директор ООО Институт повышения квалификации и переподготовки «Современное образование»</span>
          <span>Лигаев С.О.</span>
        </div>
      </div>
    `;

    document.body.appendChild(container); // Временно добавляем элемент в DOM для захвата

    try {
      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pageWidth = 210; // A4 ширина в мм
      const pageHeight = 297; // A4 высота в мм
      const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const imgScaledWidth = imgWidth * scale;
      const imgScaledHeight = imgHeight * scale;

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      doc.addImage(imgData, 'PNG', 0, 0, imgScaledWidth, imgScaledHeight);
      doc.save('certificate.pdf');
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
    } finally {
      document.body.removeChild(container); // Удаляем временный элемент из DOM
    }
  };

  const variation1El = useRef<HTMLDivElement | null>(null);
  const variation2El = useRef<HTMLDivElement | null>(null);
  const variation2ElApp = useRef<HTMLDivElement | null>(null);

  const handleDownloadVariationPDF = async (el, title) => {
    const container = el.current;

    if (!container) {
      alert('Содержимое не найдено.');
      return;
    }

    try {
      const canvas = await html2canvas(container, {
        scale: 10,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pageWidth = 297; // A4 ширина в мм
      const pageHeight = 384; // A4 высота в мм
      const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const imgScaledWidth = imgWidth * scale;
      const imgScaledHeight = imgHeight * scale;

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      doc.addImage(imgData, 'PNG', 0, 0, imgScaledWidth, imgScaledHeight);
      doc.save(title);
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
    } finally {
      document.body.removeChild(container); // Удаляем временный элемент из DOM
    }
  };

  const [isDocVariation2Scale, setIsDocVariation2Scale] = useState(false);

  const handleOutsideClick = (event) => {
    if (!(event.target instanceof HTMLImageElement)) {
      setIsDocVariation2Scale(false);
    }
  };

  const formatFinalDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  const renderContent = () => {
    return (
      <>

        {currentContent === 1 &&
          <form onSubmit={handleCourseChange}>
            <h3 className={styles.cab_courses__content_title}>Укажите данные обучающегося</h3>
            <div className={styles.cab_courses__content_inf}>
              Перечень данных определен "Перечнем сведений, вносимых в ФИС ФРДО", приложение к Постановлению Правительства РФ от 26 августа 2013 г. N 729 "О федеральной информационной системе "Федеральный реестр сведений о документах об образовании и (или) о квалификации, документах об обучении")
            </div>

            <div className={`${profileStyles.cab_profile__block_text_inputs} ${styles.cab_courses__block_text_inputs}`}>
              <label className={profileStyles.cab_profile__block_text_label}>
                <input className={globalStyles.cab_input}
                  type="text"
                  name="last_name"
                  placeholder="Фамилия"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
                {errors.last_name && <p className={profileStyles.error_message}>{errors.last_name}</p>}
              </label>

              <label className={profileStyles.cab_profile__block_text_label}>
                <input className={globalStyles.cab_input}
                  type="text"
                  name="first_name"
                  placeholder="Имя"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
                {errors.first_name && <p className={profileStyles.error_message}>{errors.first_name}</p>}
              </label>

              <label className={profileStyles.cab_profile__block_text_label}>
                <input className={globalStyles.cab_input}
                  type="text"
                  name="patronymic"
                  placeholder="Отчество"
                  value={formData.patronymic}
                  onChange={handleChange}
                  required
                />
                {errors.patronymic && <p className={profileStyles.error_message}>{errors.patronymic}</p>}
              </label>

              <label className={profileStyles.cab_profile__block_text_label_date}>
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
                required
              />

              <Select
                options={citizenshipOptions}
                styles={customStyles}
                placeholder='Гражданство'
                isSearchable={false}
                onChange={handleCitizenshipChange}
                value={citizenship}
                required
              />

              <Select
                options={educationOptions}
                styles={customStyles}
                placeholder='Образование'
                isSearchable={false}
                onChange={handleEducationChange}
                value={education}
                required
              />

              <input className={globalStyles.cab_input} type="text" name="diploma_series" placeholder="Серия диплома" value={formData.diploma_series} onChange={handleChange}
                required />
              <input className={globalStyles.cab_input} type="text" name="diploma_number" placeholder="Номер диплома" value={formData.diploma_number} onChange={handleChange}
                required />

              <label className={profileStyles.cab_profile__block_text_label_year}>
                <span>Год получ. диплома:</span>
                <InputMask
                  mask="9999"
                  value={formData.graduation_date}
                  onChange={handleChange}
                >
                  {() => (
                    <input className={globalStyles.cab_input} type="text" name="graduation_date" placeholder="____" value={formData.graduation_date} onChange={handleChange} required />
                  )}
                </InputMask>
                {errors.graduation_date && <p className={profileStyles.error_message}>{errors.graduation_date}</p>}
              </label>

              <input className={globalStyles.cab_input} type="text" name="qualification" placeholder="Квалификация в соответствии с документом об образовании" value={formData.qualification} onChange={handleChange} required />
              <input className={globalStyles.cab_input} type="text" name="position" placeholder="Должность" value={formData.position} onChange={handleChange} required />

              <label className={profileStyles.cab_profile__block_text_label}>
                <InputMask
                  mask="999-999-999-99"
                  value={formData.snils}
                  onChange={handleChange}

                >
                  {() => (
                    <input className={globalStyles.cab_input} type="text" name="snils" placeholder="СНИЛС" value={formData.snils} onChange={handleChange} required />
                  )}
                </InputMask>
                {errors.snils && <p className={profileStyles.error_message}>{errors.snils}</p>}
              </label>
              <div className={globalStyles.addressInputContainer}>
                <input
                  className={`${globalStyles.cab_input} ${styles.cab_courses__input_column}`}
                  type="text"
                  name="address"
                  placeholder="Адрес и индекс для доставки удостоверения почтой России"
                  value={formData.delivery_address}
                  onChange={handleInputChange}
                  required
                />
                {suggestions.length > 0 && (
                  <ul className={`${globalStyles.list_reset} ${globalStyles.suggestionsList}`}>
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={globalStyles.suggestionItem}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className={`${styles.cab_courses__btns} ${styles.cab_courses__btns_adaptive}`}>
              <button className={`${globalStyles.btn_reset} ${styles.cab_courses__main_btn}`}>Сохранить данные</button>
              <button className={`${globalStyles.btn_reset} ${styles.cab_courses__main_btn} ${styles.cab_courses__main_btn_red}`}
                onClick={handleCourseDelete}
              >Удалить курс</button>
            </div>
          </form>
        }
        {currentContent === 2 &&
          <div>
            <h3 className={styles.cab_courses__content_title}>Загрузите скан или фото документов</h3>
            <div className={styles.cab_courses__file_text}>Только скан или фотография диплома об образовании (без приложения)</div>
            <div
              className={`${walletStyles.cab_wallet__bonus_review_file} ${styles.cab_courses__file} ${isDragOver ? walletStyles.drag_over : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <img src={CabWalletBonusFile} alt="" width={48} height={48} />
              <div className={walletStyles.cab_wallet__bonus_file_content}>
                <div className={walletStyles.cab_wallet__bonus_file_text}>
                  {file ? (
                    <p>{file.name}</p>
                  ) : fileName ? (
                    <p>{fileName}</p>
                  ) : (
                    <>
                      Перетащите файл сюда
                      <span> или </span>
                    </>
                  )}
                </div>
                <label htmlFor="file-upload" className={`${globalStyles.btn_reset} ${walletStyles.cab_wallet__bonus_btn}`}>
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

            <div className={`${styles.cab_courses__btns} ${styles.cab_courses__btns_adaptive}`}>
              <button
                className={`${globalStyles.btn_reset} ${styles.cab_courses__main_btn}`}
                onClick={handleFileSend}
              >Сохранить данные</button>
              <button className={`${globalStyles.btn_reset} ${styles.cab_courses__main_btn} ${styles.cab_courses__main_btn_red}`}
                onClick={handleCourseDelete}
              >Удалить курс</button>
            </div>

          </div>
        }
        {currentContent === 3 &&
          <div>
            <h3 className={styles.cab_courses__content_title}>Перед началом обучения ознакомьтесь с информацией</h3>

            <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_descr}`}>
              <div className={`${styles.cab_courses__inf_block_text} ${styles.cab_courses__inf_block_text_center}`}>К обучению допускаются лица, имеющие или получающие среднее профессиональное и (или) высшее образование.</div>
            </div>

            <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_list}`}>
              <div className={`${styles.cab_courses__inf_block_text} ${styles.cab_courses__inf_block_text_list}`}>Для начала обучения:</div>
              <ul>
                <li>Ознакомьтесь с <span className={`${styles.cab_courses__underline} ${styles.cab_courses__pointer}`}
                  onClick={() => handleLinkClick('/public-offer')}
                >договором-офертой</span></li>
                <li>Заполните данные об обучающемся в первом шаге "1. Заполните данные"</li>
                <li>Загрузите скан или фото документа об образовании на вкладке "2. Загрузить документы"</li>
                <li>Ознакомьтесь с уставом ООО "Центром повышения квалификации и переподготовки "Луч знаний"</li>
                <li>Ознакомьтесь с <span className={`${styles.cab_courses__underline} ${styles.cab_courses__pointer}`}
                  onClick={() => handleLinkClick('/policy')}
                >политикой конфиденциальности</span></li>
              </ul>

              <div className={styles.cab_courses__inf_text}>После прохождения итогового тестирования Вам будет доступны документы в электронном виде. Также мы отправим ваше удостоверение Почтой России. Доставка диплома и приложения уже включена в стоимость курса.</div>

            </div>

            <div className={styles.cab_courses__details}>
              <div className={styles.cab_courses__details_item}>
                Название курса:
                <span>{currentTitle}</span>
              </div>
              <div className={styles.cab_courses__details_item}>
                Заказчик:
                <span>{formData.first_name.length > 0 && formData.last_name.length > 0 && formData.patronymic.length > 0 ? `${formData.first_name} ${formData.last_name} ${formData.patronymic}` : '—'}</span>
              </div>
              <div className={styles.cab_courses__details_item}>
                Стоимость курса:
                <span>{currentCoursePrice} ₽</span>
              </div>
              <div className={`${styles.cab_courses__details_item} ${styles.cab_courses__details_item_bold}`}>
                <span>Предпросмотр документа:</span>

                {currentVariationId === 1 &&
                  <div className={styles.cab_courses__doc_variation_download_wrapper}>
                    <div
                      ref={(el) => {
                        variation1El.current = el;
                      }}
                      className={`${styles.cab_courses__doc_variation_wrapper} ${isDocVariation2Scale ? globalStyles.activeImgScale : ''}`}
                      onClick={() => setIsDocVariation2Scale(!isDocVariation2Scale)}
                    >
                      <img src={CabCoursesDocVariation1} alt="" width={454} />

                      <div className={`${styles.cab_courses__doc_variation_text} ${styles.cab_courses__doc_variation_text_code} ${styles.cab_courses__doc_variation_text_code_1}`}>{121000 + currentId}</div>
                      <div className={`${styles.cab_courses__doc_variation_text} ${styles.cab_courses__doc_variation_text_city} ${styles.cab_courses__doc_variation_text_city_1}`}>Красноярск</div>
                      <div className={`${styles.cab_courses__doc_variation_text} ${styles.cab_courses__doc_variation_text_date} ${styles.cab_courses__doc_variation_text_date_1}`}>{formatDate(completionDate)}</div>

                      <div className={styles.cab_courses__doc_variation_main_text}>
                        {formData.first_name.length > 0 && formData.last_name.length > 0 && formData.patronymic.length > 0 ? `${formData.first_name} ${formData.last_name} ${formData.patronymic}` : '—'} <br /><br />
                        в период <br />
                        с {formatDate(currentCreatedDate)} по {formatDate(completionDate)} <br /><br />
                        прошел (а) повышение квалификации в (на) <br /><br />
                        ООО "Институт повышения квалификации и переподготовки «Современное
                        образование»" <br /><br /><br />
                        по дополнительной профессиональной программе <br /><br />
                        "{currentTitleVariation}"<br /><br /><br />
                        в объеме {currentTitleVariationHours}
                      </div>

                      <div className={`${styles.cab_courses__doc_variation_authors} ${styles.cab_courses__doc_variation_authors_1}`}>
                        <span>{certificateLeader}</span>
                        <span>{certificateSecretary}</span>
                      </div>
                    </div>
                    <button className={`${globalStyles.btn_reset} ${styles.cab_courses__diploma_img_download}`}
                      onClick={() => handleDownloadVariationPDF(variation1El, 'diplom-advanced-training.pdf')}

                    ></button>
                  </div>
                }

                {currentVariationId === 2 &&
                  <div className={styles.cab_courses__doc_variation_download_wrapper}>
                    <div
                      ref={(el) => {
                        variation2El.current = el;
                      }}
                      className={`${styles.cab_courses__doc_variation_wrapper} ${isDocVariation2Scale ? globalStyles.activeImgScale : ''}`}
                      onClick={() => setIsDocVariation2Scale(!isDocVariation2Scale)}
                    >
                      <img src={CabCoursesDocVariation2} alt="" width={454} />

                      <div className={`${styles.cab_courses__doc_variation_text} ${styles.cab_courses__doc_variation_text_code}`}>{131000 + currentId}</div>
                      <div className={`${styles.cab_courses__doc_variation_text} ${styles.cab_courses__doc_variation_text_city} ${styles.cab_courses__doc_variation_text_city_2}`}>Красноярск</div>
                      <div className={`${styles.cab_courses__doc_variation_text} ${styles.cab_courses__doc_variation_text_date} ${styles.cab_courses__doc_variation_text_date_2}`}>{formatDate(completionDate)}</div>

                      <div className={styles.cab_courses__doc_variation_main_text}>
                        {formData.first_name.length > 0 && formData.last_name.length > 0 && formData.patronymic.length > 0 ? `${formData.first_name} ${formData.last_name} ${formData.patronymic}` : '—'} <br /><br />
                        с {formatDate(currentCreatedDate)} по {formatDate(completionDate)} прошел(а) профессиональную переподготовку в (на) <br /><br />
                        ООО "Институт повышения квалификации и переподготовки «Современное
                        образование»" <br /><br />
                        Решением от <br />
                        {formatDate(completionDate)} <br />
                        диплом предоставляет право <br />
                        на ведение профессиональной деятельности в сфере <br /><br />
                        образования
                        и подтверждает присвоение квалификации
                        "{currentTitleVariation}"
                      </div>

                      <div className={`${styles.cab_courses__doc_variation_authors} ${styles.cab_courses__doc_variation_authors_2}`}>
                        <span>{diplomChairPerson}</span>
                        <span>{diplomLeader}</span>
                        <span>{diplomSecretary}</span>
                      </div>
                    </div>
                    <button className={`${globalStyles.btn_reset} ${styles.cab_courses__diploma_img_download}`}
                      onClick={() => handleDownloadVariationPDF(variation2El, 'diplom-professional-retraining.pdf')}

                    ></button>
                  </div>
                }

              </div>
            </div>

            <div className={styles.cab_courses__progress_wrapper}>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                {isFormDataComplete(formData) ? (
                  <>
                    Заполнена информация об обучающемся
                    <img src={CabCoursesChecked} alt="Success" width={25} height={25} />
                  </>
                ) : (
                  <>
                    Заполнена информация об обучающемся
                    <img src={CabCoursesErr} alt="Error" width={25} height={25} />
                  </>
                )}
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                {fileUrl ? (
                  <>
                    Загружен скан диплома об образовании
                    <img src={CabCoursesChecked} alt="Success" width={25} height={25} />
                  </>
                ) : (
                  <>
                    Загружен скан диплома об образовании
                    <img src={CabCoursesErr} alt="Error" width={25} height={25} />
                  </>
                )}
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                {formData.is_paid ? (
                  <>
                    Оплата курса
                    <img src={CabCoursesChecked} alt="Success" width={25} height={25} />
                  </>
                ) : (
                  <>
                    Оплата курса
                    <img src={CabCoursesErr} alt="Error" width={25} height={25} />
                  </>
                )}
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                {formData.test_passed ? (
                  <>
                    Пройдено итоговое тестирование
                    <img src={CabCoursesChecked} alt="Success" width={25} height={25} />
                  </>
                ) : (
                  <>
                    Пройдено итоговое тестирование
                    <img src={CabCoursesErr} alt="Error" width={25} height={25} />
                  </>
                )}
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                Планируемая дата завершения обучения
                <span>{formatFinalDate(completionDate)}</span>
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                Планируемая дата отправки документов
                <span>{formatFinalDate(plannedDocsDate)}</span>
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                Планируемая дата внесения данных о документе в ФИС ФРДО Рособрнадзора
                <span>{formatFinalDate(plannedDocsDepositDate)}</span>
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                {formData.test_passed ? (
                  <>
                    Удостоверение о повышении квалификации в электронном виде

                    {currentVariationId === 1 &&
                      <button className={`${globalStyles.btn_reset}`}
                        onClick={() => handleDownloadVariationPDF(variation1El, 'diplom-advanced-training.pdf')}
                        title={'Удостоверение о повышении квалификации'}
                      >
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g filter="url(#filter0_d_662_26135)">
                            <path d="M3.34961 6.49462C3.34961 4.57572 4.90518 3.02014 6.82408 3.02014H25.2296C27.1485 3.02014 28.7041 4.57572 28.7041 6.49461V24.9002C28.7041 26.8191 27.1485 28.3746 25.2296 28.3746H6.82408C4.90519 28.3746 3.34961 26.8191 3.34961 24.9002V6.49462Z" fill="#4F75FE" shape-rendering="crispEdges" />
                            <path d="M6.82408 2.62398C4.68639 2.62398 2.95345 4.35692 2.95345 6.49462V24.9002C2.95345 27.0379 4.68639 28.7708 6.82408 28.7708H25.2296C27.3673 28.7708 29.1003 27.0379 29.1003 24.9002V6.49461C29.1003 4.35692 27.3673 2.62398 25.2296 2.62398H6.82408Z" stroke="#7D8592" stroke-width="0.792328" shape-rendering="crispEdges" />
                            <path d="M16.0274 10.6687V20.7262M16.0274 20.7262L19.799 16.9546M16.0274 20.7262L12.2559 16.9546" stroke="#FBF9F5" stroke-width="0.950794" stroke-linecap="round" stroke-linejoin="round" />
                          </g>
                          <defs>
                            <filter id="filter0_d_662_26135" x="0.556641" y="0.227783" width="30.9395" height="30.9392" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                              <feOffset />
                              <feGaussianBlur stdDeviation="1" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix type="matrix" values="0 0 0 0 0.607843 0 0 0 0 0.12549 0 0 0 0 0.184314 0 0 0 0.1 0" />
                              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_662_26135" />
                              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_662_26135" result="shape" />
                            </filter>
                          </defs>
                        </svg>
                      </button>
                    }

                    {currentVariationId === 2 &&
                      <div className={styles.cab_courses__inf_block_download_btns}>
                        <button className={`${globalStyles.btn_reset}`}
                          onClick={() => handleDownloadVariationPDF(variation2El, 'diplom-professional-retraining.pdf')}
                          title={'Диплом о профессиональной переподготовке'}
                        >
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_662_26135)">
                              <path d="M3.34961 6.49462C3.34961 4.57572 4.90518 3.02014 6.82408 3.02014H25.2296C27.1485 3.02014 28.7041 4.57572 28.7041 6.49461V24.9002C28.7041 26.8191 27.1485 28.3746 25.2296 28.3746H6.82408C4.90519 28.3746 3.34961 26.8191 3.34961 24.9002V6.49462Z" fill="#4F75FE" shape-rendering="crispEdges" />
                              <path d="M6.82408 2.62398C4.68639 2.62398 2.95345 4.35692 2.95345 6.49462V24.9002C2.95345 27.0379 4.68639 28.7708 6.82408 28.7708H25.2296C27.3673 28.7708 29.1003 27.0379 29.1003 24.9002V6.49461C29.1003 4.35692 27.3673 2.62398 25.2296 2.62398H6.82408Z" stroke="#7D8592" stroke-width="0.792328" shape-rendering="crispEdges" />
                              <path d="M16.0274 10.6687V20.7262M16.0274 20.7262L19.799 16.9546M16.0274 20.7262L12.2559 16.9546" stroke="#FBF9F5" stroke-width="0.950794" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                              <filter id="filter0_d_662_26135" x="0.556641" y="0.227783" width="30.9395" height="30.9392" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset />
                                <feGaussianBlur stdDeviation="1" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.607843 0 0 0 0 0.12549 0 0 0 0 0.184314 0 0 0 0.1 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_662_26135" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_662_26135" result="shape" />
                              </filter>
                            </defs>
                          </svg>
                        </button>
                        <button className={`${globalStyles.btn_reset}`}
                          onClick={() => handleDownloadVariationPDF(variation2ElApp, 'diplom-professional-retraining-app.pdf')}
                          title={'Приложение к диплому о профессиональной переподготовке'}
                        >
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_662_26135)">
                              <path d="M3.34961 6.49462C3.34961 4.57572 4.90518 3.02014 6.82408 3.02014H25.2296C27.1485 3.02014 28.7041 4.57572 28.7041 6.49461V24.9002C28.7041 26.8191 27.1485 28.3746 25.2296 28.3746H6.82408C4.90519 28.3746 3.34961 26.8191 3.34961 24.9002V6.49462Z" fill="#4F75FE" shape-rendering="crispEdges" />
                              <path d="M6.82408 2.62398C4.68639 2.62398 2.95345 4.35692 2.95345 6.49462V24.9002C2.95345 27.0379 4.68639 28.7708 6.82408 28.7708H25.2296C27.3673 28.7708 29.1003 27.0379 29.1003 24.9002V6.49461C29.1003 4.35692 27.3673 2.62398 25.2296 2.62398H6.82408Z" stroke="#7D8592" stroke-width="0.792328" shape-rendering="crispEdges" />
                              <path d="M16.0274 10.6687V20.7262M16.0274 20.7262L19.799 16.9546M16.0274 20.7262L12.2559 16.9546" stroke="#FBF9F5" stroke-width="0.950794" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                              <filter id="filter0_d_662_26135" x="0.556641" y="0.227783" width="30.9395" height="30.9392" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset />
                                <feGaussianBlur stdDeviation="1" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.607843 0 0 0 0 0.12549 0 0 0 0 0.184314 0 0 0 0.1 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_662_26135" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_662_26135" result="shape" />
                              </filter>
                            </defs>
                          </svg>
                        </button>
                      </div>
                    }
                  </>
                ) : (
                  <>
                    Удостоверение о повышении квалификации в электронном виде
                    <img src={CabCoursesErr} alt="Error" width={25} height={25} />
                  </>
                )}
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                РПО (трек-номер для отслеживания письма на сайте почты России)
                {formData.track_number ? (
                  <>
                    <span>{formData.track_number}</span>
                  </>
                ) : (
                  <>
                    <img src={CabCoursesErr} alt="Error" width={25} height={25} />
                  </>
                )}
              </div>
            </div>


            <div className={`${styles.cab_courses__btns} ${styles.cab_courses__btns_justify_end}`}>
              <button className={`${globalStyles.btn_reset} ${styles.cab_courses__main_btn} ${styles.cab_courses__main_btn_red}`}
                onClick={handleCourseDelete}
              >Удалить курс</button>
            </div>

          </div>
        }
        {currentContent === 4 &&
          <div>

            <div className={styles.cab_courses__payment}>
              <div className={styles.cab_courses__payment_content}>
                <h3 className={styles.cab_courses__payment_title}>Для начала обучения</h3>
                <div className={styles.cab_courses__payment_inf}>
                  <ul className={styles.cab_courses__payment_inf_list}>
                    <li className={styles.cab_courses__payment_inf_item}>
                      Ознакомьтесь с <span
                        onClick={() => handleLinkClick('/public-offer')}
                      >договором-офертой</span>
                    </li>
                    <li className={styles.cab_courses__payment_inf_item}>Загрузите документы об образовании и заполните ваши данные для ФИС ФРДО</li>
                    <li className={styles.cab_courses__payment_inf_item}>Оплатите выбранный курс</li>
                    <li className={styles.cab_courses__payment_inf_item}>Приступайте к обучению</li>
                  </ul>
                </div>
                <h4 className={documentsStyles.cab_documents__promo_title}>Есть промокод?</h4>
                <div className={documentsStyles.cab_documents__promo}>
                  <input className={documentsStyles.cab_documents__promo_input} type="text" placeholder='Введите промокод'
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                  />
                  <button className={`${globalStyles.btn_reset} ${documentsStyles.cab_documents__promo_btn}`} type='button'
                    onClick={handleCheckPromo}
                  >
                    Применить
                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.35572 2.94189L12.7499 8.09091M12.7499 8.09091L7.35572 13.2399M12.7499 8.09091L2.25 8.09091" stroke="white" stroke-width="1.40625" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className={styles.cab_courses__payment_content}>
                <h3 className={styles.cab_courses__payment_title}>Выберите полезные дополнения</h3>
                <div className={styles.cab_courses__additions}>

                  {coursesAdditions.map((addition, i) => (
                    <div className={styles.cab_courses__additions_block} key={i}>
                      <div className={styles.cab_courses__additions_block_text}>
                        <div>{addition.title}</div>
                        <div>{Math.floor(+addition.price)} ₽</div>
                        <span
                          onClick={() => {
                            if (i === 0) {
                              setIsFirstModalOpen(true);
                            } else if (i === 1) {
                              setIsSecondModalOpen(true);
                            } else if (i === 2) {
                              setIsThirdModalOpen(true);
                            }
                          }}
                        >
                          Подробнее
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.53867 3.96973C4.44347 4.14799 4.51081 4.36966 4.68906 4.46486C4.86732 4.56005 5.089 4.49272 5.18419 4.31446L4.53867 3.96973ZM7.32663 6.65549L7.49265 6.98156L7.49272 6.98153L7.32663 6.65549ZM6.12409 7.72398C6.12409 7.92606 6.28791 8.08988 6.48999 8.08988C6.69207 8.08988 6.8559 7.92606 6.8559 7.72398H6.12409ZM6.8559 9.3521C6.8559 9.15002 6.69207 8.9862 6.48999 8.9862C6.28791 8.9862 6.12409 9.15002 6.12409 9.3521H6.8559ZM6.12409 9.46065C6.12409 9.66273 6.28791 9.82655 6.48999 9.82655C6.69207 9.82655 6.8559 9.66273 6.8559 9.46065H6.12409ZM5.18419 4.31446C5.2936 4.10959 5.44971 3.93336 5.63988 3.80003L5.21978 3.20082C4.93553 3.4001 4.7022 3.66351 4.53867 3.96973L5.18419 4.31446ZM5.63988 3.80003C5.83005 3.66671 6.04894 3.58003 6.27884 3.54702L6.17483 2.82264C5.83121 2.87198 5.50403 3.00154 5.21978 3.20082L5.63988 3.80003ZM6.27884 3.54702C6.50873 3.51401 6.74317 3.5356 6.96317 3.61003L7.1977 2.91682C6.86886 2.80557 6.51845 2.7733 6.17483 2.82264L6.27884 3.54702ZM6.96317 3.61003C7.18318 3.68446 7.38256 3.80965 7.54519 3.97546L8.06764 3.46302C7.82456 3.21519 7.52654 3.02807 7.1977 2.91682L6.96317 3.61003ZM7.54519 3.97546C7.70782 4.14127 7.82913 4.34304 7.89929 4.56444L8.5969 4.34338C8.49204 4.01245 8.31072 3.71086 8.06764 3.46302L7.54519 3.97546ZM7.89929 4.56444C7.96944 4.78584 7.98649 5.02065 7.94903 5.24987L8.67126 5.36788C8.72724 5.02528 8.70177 4.6743 8.5969 4.34338L7.89929 4.56444ZM7.94903 5.24987C7.91158 5.47908 7.82068 5.69625 7.6837 5.88381L8.27467 6.31543C8.47942 6.03509 8.61528 5.71048 8.67126 5.36788L7.94903 5.24987ZM7.6837 5.88381C7.54672 6.07137 7.3675 6.22403 7.16055 6.32945L7.49272 6.98153C7.80204 6.82396 8.06992 6.59577 8.27467 6.31543L7.6837 5.88381ZM7.16061 6.32942C6.70484 6.56147 6.12409 7.02589 6.12409 7.72398H6.8559C6.8559 7.46255 7.09398 7.18454 7.49265 6.98156L7.16061 6.32942ZM6.12409 9.3521V9.46065H6.8559V9.3521H6.12409ZM11.8731 6.31337C11.8731 9.22673 9.5114 11.5885 6.59804 11.5885V12.3203C9.91557 12.3203 12.605 9.6309 12.605 6.31337H11.8731ZM6.59804 11.5885C3.68468 11.5885 1.32293 9.22673 1.32293 6.31337H0.591128C0.591128 9.6309 3.28051 12.3203 6.59804 12.3203V11.5885ZM1.32293 6.31337C1.32293 3.40001 3.68468 1.03827 6.59804 1.03827V0.30646C3.28051 0.30646 0.591128 2.99585 0.591128 6.31337H1.32293ZM6.59804 1.03827C9.5114 1.03827 11.8731 3.40001 11.8731 6.31337H12.605C12.605 2.99585 9.91557 0.30646 6.59804 0.30646V1.03827Z" fill="#FBF9F5" />
                          </svg>
                        </span>
                      </div>
                      <label className={`${cabIssueStyles.cab_issue__diplomas_label_wrapper} ${cabIssueStyles.cab_issue__diplomas_label_wrapper_docs}`}>
                        <div className={`${cabIssueStyles.cab_issue__diplomas_checkbox} ${selectedAdditions.includes(addition.id) ? cabIssueStyles.cab_issue__diplomas_checkbox_active : ''}`}>
                          <input
                            type="checkbox"
                            checked={selectedAdditions.includes(addition.id)}
                            onChange={() => handleCheckboxChange(addition.id)}
                          />
                        </div>
                        <span>Добавить</span>
                      </label>
                    </div>
                  ))}

                </div>
              </div>
            </div>

            <div className={styles.cab_courses__price}>
              <div className={styles.cab_courses__price_text}>
                Стоимость курса:
                <span>{currentCoursePrice} ₽</span>
              </div>
              {selectedAdditions.length > 0 && (
                <div className={styles.cab_courses__price_text}>
                  Дополнительные услуги:
                  <span>{totalAdditionsPrice} ₽</span>
                </div>
              )}
              {discountPercentage > 0 && (
                <div className={styles.cab_courses__price_text}>
                  <div>Скидка по промокоду <span className={styles.cab_courses__underline}>{currentPromo}</span>:</div>
                  <span>-{discountPercentage} %</span>
                </div>
              )}
              {+formData.number_of_coupons > 0 && (
                <div className={styles.cab_courses__price_text}>
                  Скидка по купону:
                  <span>-{currentCourseCoupon} ₽</span>
                </div>
              )}
              <div className={`${styles.cab_courses__price_text} ${styles.cab_courses__price_text_red}`}>
                Стоимость при оплате до {deadlineDate}:
                <span><span className={styles.cab_courses__line_through}>{totalPrice}</span> {totalPriceWithSale} ₽</span>
              </div>
              <div className={`${styles.cab_courses__price_text} ${styles.cab_courses__price_text_blue}`}>
                Скидка:
                <span>-{totalPrice - totalPriceWithSale} ₽</span>
              </div>

              <div className={`${styles.cab_courses__price_text} ${styles.cab_courses__price_text_bold}`}>
                К оплате:
                <span>{totalPrice} ₽</span>
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

            <div className={styles.cab_courses__btns}>
              <button className={`${globalStyles.btn_reset} ${styles.cab_courses__main_btn}`}
                onClick={handleCoursePurchase}
              >{yookassaChecked ? 'Оплатить через ЮKassa' : 'Оплатить с кошелька'}</button>
            </div>

            <div className={walletStyles.cab_wallet__balance_links}>
              <span className={walletStyles.cab_wallet__balance_link}
                onClick={() => handleLinkClick('/payment-delivery')}
              >Ознакомиться с правилами оплаты онлайн</span>
              <span className={walletStyles.cab_wallet__balance_link}
                onClick={() => handleLinkClick('/public-offer')}
              >Скачать договор оферты</span>
            </div>

          </div>
        }
      </>
    );
  };

  const renderContentPaid = () => {
    return (
      <>
        {currentContent === 1 &&
          <form onSubmit={handleCourseChange}>
            <h3 className={styles.cab_courses__content_title}>Укажите данные обучающегося</h3>
            <div className={styles.cab_courses__content_inf}>
              Перечень данных определен "Перечнем сведений, вносимых в ФИС ФРДО", приложение к Постановлению Правительства РФ от 26 августа 2013 г. N 729 "О федеральной информационной системе "Федеральный реестр сведений о документах об образовании и (или) о квалификации, документах об обучении")
            </div>

            <div className={`${profileStyles.cab_profile__block_text_inputs} ${styles.cab_courses__block_text_inputs}`}>
              <label className={profileStyles.cab_profile__block_text_label}>
                <input className={globalStyles.cab_input}
                  type="text"
                  name="last_name"
                  placeholder="Фамилия"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  readOnly
                />
                {errors.last_name && <p className={profileStyles.error_message}>{errors.last_name}</p>}
              </label>

              <label className={profileStyles.cab_profile__block_text_label}>
                <input className={globalStyles.cab_input}
                  type="text"
                  name="first_name"
                  placeholder="Имя"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  readOnly
                />
                {errors.first_name && <p className={profileStyles.error_message}>{errors.first_name}</p>}
              </label>

              <label className={profileStyles.cab_profile__block_text_label}>
                <input className={globalStyles.cab_input}
                  type="text"
                  name="patronymic"
                  placeholder="Отчество"
                  value={formData.patronymic}
                  onChange={handleChange}
                  required
                  readOnly
                />
                {errors.patronymic && <p className={profileStyles.error_message}>{errors.patronymic}</p>}
              </label>

              <label className={profileStyles.cab_profile__block_text_label_date}>
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
                  }} readOnly />} // Настройка font-size для placeholder и value
                  readOnly
                />
              </label>

              <Select
                options={genderOptions}
                styles={customStyles}
                placeholder='Ваш пол'
                isSearchable={false}
                onChange={handleGenderChange}
                value={gender}
                required
              />

              <Select
                options={citizenshipOptions}
                styles={customStyles}
                placeholder='Гражданство'
                isSearchable={false}
                onChange={handleCitizenshipChange}
                value={citizenship}
                required
              />

              <Select
                options={educationOptions}
                styles={customStyles}
                placeholder='Образование'
                isSearchable={false}
                onChange={handleEducationChange}
                value={education}
                required
              />

              <input className={globalStyles.cab_input} type="text" name="diploma_series" placeholder="Серия диплома" value={formData.diploma_series} onChange={handleChange}
                required />
              <input className={globalStyles.cab_input} type="text" name="diploma_number" placeholder="Номер диплома" value={formData.diploma_number} onChange={handleChange}
                required />

              <label className={profileStyles.cab_profile__block_text_label_year}>
                <span>Год получ. диплома:</span>
                <InputMask
                  mask="9999"
                  value={formData.graduation_date}
                  onChange={handleChange}
                >
                  {() => (
                    <input className={globalStyles.cab_input} type="text" name="graduation_date" placeholder="____" value={formData.graduation_date} onChange={handleChange} required />
                  )}
                </InputMask>
                {errors.graduation_date && <p className={profileStyles.error_message}>{errors.graduation_date}</p>}
              </label>

              <input className={globalStyles.cab_input} type="text" name="qualification" placeholder="Квалификация в соответствии с документом об образовании" value={formData.qualification} onChange={handleChange} required />
              <input className={globalStyles.cab_input} type="text" name="position" placeholder="Должность" value={formData.position} onChange={handleChange} required />

              <label className={profileStyles.cab_profile__block_text_label}>
                <InputMask
                  mask="999-999-999-99"
                  value={formData.snils}
                  onChange={handleChange}

                >
                  {() => (
                    <input className={globalStyles.cab_input} type="text" name="snils" placeholder="СНИЛС" value={formData.snils} onChange={handleChange} required />
                  )}
                </InputMask>
                {errors.snils && <p className={profileStyles.error_message}>{errors.snils}</p>}
              </label>
              <div className={globalStyles.addressInputContainer}>
                <input
                  className={`${globalStyles.cab_input} ${styles.cab_courses__input_column}`}
                  type="text"
                  name="address"
                  placeholder="Адрес и индекс для доставки удостоверения почтой России"
                  value={formData.delivery_address}
                  onChange={handleInputChange}
                  required
                />
                {suggestions.length > 0 && (
                  <ul className={`${globalStyles.list_reset} ${globalStyles.suggestionsList}`}>
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={globalStyles.suggestionItem}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </form>
        }
        {currentContent === 2 &&
          <div>
            <h3 className={styles.cab_courses__content_title}>Загрузите скан или фото документов</h3>
            <div className={styles.cab_courses__file_text}>Только скан или фотография диплома об образовании (без приложения)</div>
            <div
              className={`${walletStyles.cab_wallet__bonus_review_file} ${styles.cab_courses__file} ${isDragOver ? walletStyles.drag_over : ''}`}
            >
              <img src={CabWalletBonusFile} alt="" width={48} height={48} />
              <div className={walletStyles.cab_wallet__bonus_file_content}>
                <div className={walletStyles.cab_wallet__bonus_file_text}>
                  {file ? (
                    <p>{file.name}</p>
                  ) : fileName ? (
                    <p>{fileName}</p>
                  ) : ('')}
                </div>
              </div>
            </div>


          </div>
        }
        {currentContent === 3 &&
          <div>
            <h3 className={styles.cab_courses__content_title}>Перед началом обучения ознакомьтесь с информацией</h3>

            <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_descr}`}>
              <div className={`${styles.cab_courses__inf_block_text} ${styles.cab_courses__inf_block_text_center}`}>К обучению допускаются лица, имеющие или получающие среднее профессиональное и (или) высшее образование.</div>
            </div>

            <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_list}`}>
              <div className={`${styles.cab_courses__inf_block_text} ${styles.cab_courses__inf_block_text_list}`}>Для начала обучения:</div>
              <ul>
                <li>Ознакомьтесь с <span className={`${styles.cab_courses__underline} ${styles.cab_courses__pointer}`}
                  onClick={() => handleLinkClick('/public-offer')}
                >договором-офертой</span></li>
                <li>Заполните данные об обучающемся в первом шаге "1. Заполните данные"</li>
                <li>Загрузите скан или фото документа об образовании на вкладке "2. Загрузить документы"</li>
                <li>Ознакомьтесь с уставом ООО "Центром повышения квалификации и переподготовки "Луч знаний"</li>
                <li>Ознакомьтесь с <span className={`${styles.cab_courses__underline} ${styles.cab_courses__pointer}`}
                  onClick={() => handleLinkClick('/policy')}
                >политикой конфиденциальности</span></li>
              </ul>

              <div className={styles.cab_courses__inf_text}>После прохождения итогового тестирования Вам будет доступны документы в электронном виде. Также мы отправим ваше удостоверение Почтой России. Доставка диплома и приложения уже включена в стоимость курса.</div>

            </div>

            <div className={styles.cab_courses__details}>
              <div className={styles.cab_courses__details_item}>
                Название курса:
                <span>{currentTitle}</span>
              </div>
              <div className={styles.cab_courses__details_item}>
                Заказчик:
                <span>{formData.first_name.length > 0 && formData.last_name.length > 0 && formData.patronymic.length > 0 ? `${formData.first_name} ${formData.last_name} ${formData.patronymic}` : '—'}</span>
              </div>
              <div className={styles.cab_courses__details_item}>
                Стоимость курса:
                <span>{currentCoursePrice} ₽</span>
              </div>
              <div className={`${styles.cab_courses__details_item} ${styles.cab_courses__details_item_bold}`}>
                <span>Предпросмотр документа:</span>

                <div
                  className={styles.cab_courses__doc_variation_wrapper}
                  ref={(el) => {
                    variation2ElApp.current = el;
                  }}
                  style={{
                    position: 'absolute',
                    left: '-9999px'
                  }}
                >
                  <img src={CabCoursesDocVariation2App} alt="" width={454} />

                  <div
                    className={`${styles.cab_courses__app_text} ${styles.cab_courses__app_text_fio}`}
                  >
                    {formData.first_name && formData.last_name && formData.patronymic
                      ? `${formData.first_name} ${formData.last_name} ${formData.patronymic}`
                      : "—"}
                  </div>

                  <div
                    className={`${styles.cab_courses__app_text} ${styles.cab_courses__app_text_education}`}
                  >
                    Высшем
                  </div>
                  <div
                    className={`${styles.cab_courses__app_text} ${styles.cab_courses__app_text_date}`}
                  >
                    <span>{formatDate(currentCreatedDate).slice(0, -3)}</span>
                    <span>{formatDate(completionDate).slice(0, -3)}</span>
                  </div>
                  <div
                    className={`${styles.cab_courses__app_text} ${styles.cab_courses__app_text_place}`}
                  >
                    ООО "Институт повышения квалификации и переподготовки «Современное образование»"
                  </div>
                  <div
                    className={`${styles.cab_courses__app_text} ${styles.cab_courses__app_text_theme}`}
                  >
                    {currentTitle}
                  </div>
                  <div
                    className={`${styles.cab_courses__app_text} ${styles.cab_courses__app_text_prob}`}
                  >
                    стажировка не предусмотрена
                  </div>
                  <div
                    className={`${styles.cab_courses__app_text} ${styles.cab_courses__app_text_theme_2}`}
                  >
                    {currentTitle}
                  </div>

                  <div className={styles.cab_courses__app_modules}>
                    {modules.map((currentModule) => (
                      <div key={currentModule.module_order} className={styles.cab_courses__app_module}>
                        <span className={styles.cab_courses__app_module_order}>
                          {currentModule.module_order}
                        </span>
                        <span className={styles.cab_courses__app_module_title}>
                          {currentModule.title}
                        </span>
                        <span className={styles.cab_courses__app_module_hours}>
                          {currentModule.number_of_hours}
                        </span>
                        <span className={styles.cab_courses__app_module_mark}>отлично</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.cab_courses__app_modules_total}>
                    {currentTitleVariationHours.slice(0, -3)} (часов)
                  </div>

                  <div className={styles.cab_courses__app_modules_authors}>
                    <span>{diplomAppLeader}</span>
                    <span>{diplomAppSecretary}</span>
                  </div>
                </div>

                {currentVariationId === 1 &&
                  <div className={styles.cab_courses__doc_variation_download_wrapper}>
                    <div
                      ref={(el) => {
                        variation1El.current = el;
                      }}
                      className={`${styles.cab_courses__doc_variation_wrapper} ${isDocVariation2Scale ? globalStyles.activeImgScale : ''}`}
                      onClick={() => setIsDocVariation2Scale(!isDocVariation2Scale)}
                    >
                      <img src={CabCoursesDocVariation1} alt="" width={454} />

                      <div className={`${styles.cab_courses__doc_variation_text} ${styles.cab_courses__doc_variation_text_code} ${styles.cab_courses__doc_variation_text_code_1}`}>{121000 + currentId}</div>
                      <div className={`${styles.cab_courses__doc_variation_text} ${styles.cab_courses__doc_variation_text_city} ${styles.cab_courses__doc_variation_text_city_1}`}>Красноярск</div>
                      <div className={`${styles.cab_courses__doc_variation_text} ${styles.cab_courses__doc_variation_text_date} ${styles.cab_courses__doc_variation_text_date_1}`}>{formatDate(completionDate)}</div>

                      <div className={styles.cab_courses__doc_variation_main_text}>
                        {formData.first_name.length > 0 && formData.last_name.length > 0 && formData.patronymic.length > 0 ? `${formData.first_name} ${formData.last_name} ${formData.patronymic}` : '—'} <br /><br />
                        в период <br />
                        с {formatDate(currentCreatedDate)} по {formatDate(completionDate)} <br /><br />
                        прошел (а) повышение квалификации в (на) <br /><br />
                        ООО "Институт повышения квалификации и переподготовки «Современное
                        образование»" <br /><br /><br />
                        по дополнительной профессиональной программе <br /><br />
                        "{currentTitleVariation}"<br /><br /><br />
                        в объеме {currentTitleVariationHours}
                      </div>

                      <div className={`${styles.cab_courses__doc_variation_authors} ${styles.cab_courses__doc_variation_authors_1}`}>
                        <span>{certificateLeader}</span>
                        <span>{certificateSecretary}</span>
                      </div>
                    </div>
                    <button className={`${globalStyles.btn_reset} ${styles.cab_courses__diploma_img_download}`}
                      onClick={() => handleDownloadVariationPDF(variation1El, 'diplom-advanced-training.pdf')}

                    ></button>
                  </div>
                }
                {currentVariationId === 2 &&
                  <div className={styles.cab_courses__doc_variation_download_wrapper}>
                    <div
                      ref={(el) => {
                        variation2El.current = el;
                      }}
                      className={`${styles.cab_courses__doc_variation_wrapper} ${isDocVariation2Scale ? globalStyles.activeImgScale : ''}`}
                      onClick={() => setIsDocVariation2Scale(!isDocVariation2Scale)}
                    >
                      <img src={CabCoursesDocVariation2} alt="" width={454} />

                      <div className={`${styles.cab_courses__doc_variation_text} ${styles.cab_courses__doc_variation_text_code}`}>{131000 + currentId}</div>
                      <div className={`${styles.cab_courses__doc_variation_text} ${styles.cab_courses__doc_variation_text_city} ${styles.cab_courses__doc_variation_text_city_2}`}>Красноярск</div>
                      <div className={`${styles.cab_courses__doc_variation_text} ${styles.cab_courses__doc_variation_text_date} ${styles.cab_courses__doc_variation_text_date_2}`}>{formatDate(completionDate)}</div>

                      <div className={styles.cab_courses__doc_variation_main_text}>
                        {formData.first_name.length > 0 && formData.last_name.length > 0 && formData.patronymic.length > 0 ? `${formData.first_name} ${formData.last_name} ${formData.patronymic}` : '—'} <br /><br />
                        с {formatDate(currentCreatedDate)} по {formatDate(completionDate)} прошел(а) профессиональную переподготовку в (на) <br /><br />
                        ООО "Институт повышения квалификации и переподготовки «Современное
                        образование»" <br /><br />
                        Решением от <br />
                        {formatDate(completionDate)} <br />
                        диплом предоставляет право <br />
                        на ведение профессиональной деятельности в сфере <br /><br />
                        образования
                        и подтверждает присвоение квалификации
                        "{currentTitleVariation}"
                      </div>

                      <div className={`${styles.cab_courses__doc_variation_authors} ${styles.cab_courses__doc_variation_authors_2}`}>
                        <span>{diplomChairPerson}</span>
                        <span>{diplomLeader}</span>
                        <span>{diplomSecretary}</span>
                      </div>
                    </div>
                    <button className={`${globalStyles.btn_reset} ${styles.cab_courses__diploma_img_download}`}
                      onClick={() => handleDownloadVariationPDF(variation2El, 'diplom-professional-retraining.pdf')}

                    ></button>
                  </div>
                }
              </div>
              <div className={styles.cab_courses__certificate}>
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.98242 1.19727H17.0169M10.4995 6.1628V19.1973M10.4995 19.1973L5.22384 13.6111M10.4995 19.1973L15.7756 13.6111" stroke="#2D2323" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <button
                  className={globalStyles.btn_reset}
                  onClick={() => handleDownloadCertificatePDF()}
                >Справка о зачислении на курсы</button>
              </div>
            </div>

            <div className={styles.cab_courses__progress_wrapper}>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                {isFormDataComplete(formData) ? (
                  <>
                    Заполнена информация об обучающемся
                    <img src={CabCoursesChecked} alt="Success" width={25} height={25} />
                  </>
                ) : (
                  <>
                    Заполнена информация об обучающемся
                    <img src={CabCoursesErr} alt="Error" width={25} height={25} />
                  </>
                )}
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                {fileUrl ? (
                  <>
                    Загружен скан диплома об образовании
                    <img src={CabCoursesChecked} alt="Success" width={25} height={25} />
                  </>
                ) : (
                  <>
                    Загружен скан диплома об образовании
                    <img src={CabCoursesErr} alt="Error" width={25} height={25} />
                  </>
                )}
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                {formData.is_paid ? (
                  <>
                    Оплата курса
                    <img src={CabCoursesChecked} alt="Success" width={25} height={25} />
                  </>
                ) : (
                  <>
                    Оплата курса
                    <img src={CabCoursesErr} alt="Error" width={25} height={25} />
                  </>
                )}
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                {formData.test_passed ? (
                  <>
                    Пройдено итоговое тестирование
                    <img src={CabCoursesChecked} alt="Success" width={25} height={25} />
                  </>
                ) : (
                  <>
                    Пройдено итоговое тестирование
                    <img src={CabCoursesErr} alt="Error" width={25} height={25} />
                  </>
                )}
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                Планируемая дата завершения обучения
                <span>{formatFinalDate(completionDate)}</span>
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                Планируемая дата отправки документов
                <span>{formatFinalDate(plannedDocsDate)}</span>
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                Планируемая дата внесения данных о документе в ФИС ФРДО Рособрнадзора
                <span>{formatFinalDate(plannedDocsDepositDate)}</span>
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                {formData.test_passed ? (
                  <>
                    Удостоверение о повышении квалификации в электронном виде

                    {currentVariationId === 1 &&
                      <button className={`${globalStyles.btn_reset}`}
                        onClick={() => handleDownloadVariationPDF(variation1El, 'diplom-advanced-training.pdf')}
                        title={'Удостоверение о повышении квалификации'}
                      >
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g filter="url(#filter0_d_662_26135)">
                            <path d="M3.34961 6.49462C3.34961 4.57572 4.90518 3.02014 6.82408 3.02014H25.2296C27.1485 3.02014 28.7041 4.57572 28.7041 6.49461V24.9002C28.7041 26.8191 27.1485 28.3746 25.2296 28.3746H6.82408C4.90519 28.3746 3.34961 26.8191 3.34961 24.9002V6.49462Z" fill="#4F75FE" shape-rendering="crispEdges" />
                            <path d="M6.82408 2.62398C4.68639 2.62398 2.95345 4.35692 2.95345 6.49462V24.9002C2.95345 27.0379 4.68639 28.7708 6.82408 28.7708H25.2296C27.3673 28.7708 29.1003 27.0379 29.1003 24.9002V6.49461C29.1003 4.35692 27.3673 2.62398 25.2296 2.62398H6.82408Z" stroke="#7D8592" stroke-width="0.792328" shape-rendering="crispEdges" />
                            <path d="M16.0274 10.6687V20.7262M16.0274 20.7262L19.799 16.9546M16.0274 20.7262L12.2559 16.9546" stroke="#FBF9F5" stroke-width="0.950794" stroke-linecap="round" stroke-linejoin="round" />
                          </g>
                          <defs>
                            <filter id="filter0_d_662_26135" x="0.556641" y="0.227783" width="30.9395" height="30.9392" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                              <feOffset />
                              <feGaussianBlur stdDeviation="1" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix type="matrix" values="0 0 0 0 0.607843 0 0 0 0 0.12549 0 0 0 0 0.184314 0 0 0 0.1 0" />
                              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_662_26135" />
                              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_662_26135" result="shape" />
                            </filter>
                          </defs>
                        </svg>
                      </button>
                    }

                    {currentVariationId === 2 &&
                      <div className={styles.cab_courses__inf_block_download_btns}>
                        <button className={`${globalStyles.btn_reset}`}
                          onClick={() => handleDownloadVariationPDF(variation2El, 'diplom-professional-retraining.pdf')}
                          title={'Диплом о профессиональной переподготовке'}
                        >
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_662_26135)">
                              <path d="M3.34961 6.49462C3.34961 4.57572 4.90518 3.02014 6.82408 3.02014H25.2296C27.1485 3.02014 28.7041 4.57572 28.7041 6.49461V24.9002C28.7041 26.8191 27.1485 28.3746 25.2296 28.3746H6.82408C4.90519 28.3746 3.34961 26.8191 3.34961 24.9002V6.49462Z" fill="#4F75FE" shape-rendering="crispEdges" />
                              <path d="M6.82408 2.62398C4.68639 2.62398 2.95345 4.35692 2.95345 6.49462V24.9002C2.95345 27.0379 4.68639 28.7708 6.82408 28.7708H25.2296C27.3673 28.7708 29.1003 27.0379 29.1003 24.9002V6.49461C29.1003 4.35692 27.3673 2.62398 25.2296 2.62398H6.82408Z" stroke="#7D8592" stroke-width="0.792328" shape-rendering="crispEdges" />
                              <path d="M16.0274 10.6687V20.7262M16.0274 20.7262L19.799 16.9546M16.0274 20.7262L12.2559 16.9546" stroke="#FBF9F5" stroke-width="0.950794" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                              <filter id="filter0_d_662_26135" x="0.556641" y="0.227783" width="30.9395" height="30.9392" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset />
                                <feGaussianBlur stdDeviation="1" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.607843 0 0 0 0 0.12549 0 0 0 0 0.184314 0 0 0 0.1 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_662_26135" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_662_26135" result="shape" />
                              </filter>
                            </defs>
                          </svg>
                        </button>
                        <button className={`${globalStyles.btn_reset}`}
                          onClick={() => handleDownloadVariationPDF(variation2ElApp, 'diplom-professional-retraining-app.pdf')}
                          title={'Приложение к диплому о профессиональной переподготовке'}
                        >
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_662_26135)">
                              <path d="M3.34961 6.49462C3.34961 4.57572 4.90518 3.02014 6.82408 3.02014H25.2296C27.1485 3.02014 28.7041 4.57572 28.7041 6.49461V24.9002C28.7041 26.8191 27.1485 28.3746 25.2296 28.3746H6.82408C4.90519 28.3746 3.34961 26.8191 3.34961 24.9002V6.49462Z" fill="#4F75FE" shape-rendering="crispEdges" />
                              <path d="M6.82408 2.62398C4.68639 2.62398 2.95345 4.35692 2.95345 6.49462V24.9002C2.95345 27.0379 4.68639 28.7708 6.82408 28.7708H25.2296C27.3673 28.7708 29.1003 27.0379 29.1003 24.9002V6.49461C29.1003 4.35692 27.3673 2.62398 25.2296 2.62398H6.82408Z" stroke="#7D8592" stroke-width="0.792328" shape-rendering="crispEdges" />
                              <path d="M16.0274 10.6687V20.7262M16.0274 20.7262L19.799 16.9546M16.0274 20.7262L12.2559 16.9546" stroke="#FBF9F5" stroke-width="0.950794" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                              <filter id="filter0_d_662_26135" x="0.556641" y="0.227783" width="30.9395" height="30.9392" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset />
                                <feGaussianBlur stdDeviation="1" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.607843 0 0 0 0 0.12549 0 0 0 0 0.184314 0 0 0 0.1 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_662_26135" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_662_26135" result="shape" />
                              </filter>
                            </defs>
                          </svg>
                        </button>
                      </div>
                    }
                  </>
                ) : (
                  <>
                    Удостоверение о повышении квалификации в электронном виде
                    <img src={CabCoursesErr} alt="Error" width={25} height={25} />
                  </>
                )}
              </div>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress}`}>
                РПО (трек-номер для отслеживания письма на сайте почты России)
                {formData.track_number ? (
                  <>
                    <span>{formData.track_number}</span>
                  </>
                ) : (
                  <>
                    <img src={CabCoursesErr} alt="Error" width={25} height={25} />
                  </>
                )}
              </div>
            </div>

          </div>
        }
        {currentContent === 4 &&
          <div>
            <h3 className={styles.cab_courses__payment_title}>Курс оплачен!</h3>

          </div>
        }
        {currentContent === 5 &&
          <div>
            <h3 className={styles.cab_courses__payment_title}>Спасибо, что выбрали нас!</h3>

            <div className={styles.cab_courses__thanks_text}>
              Вы успешно оплатили обучение по курсу повышения квалификации. Новые модули будут открываться по мере успешной сдачи тестирования. <br />
              Приступайте к обучению прямо сейчас! <br />
              Вы имеете бессрочный доступ к данном курсу и методическим материалам. Материалы для изучения курса Вы можете скачать по этой ссылке:
            </div>

            <div className={styles.cab_courses__progress_wrapper}>
              <div className={`${styles.cab_courses__inf_block} ${styles.cab_courses__inf_block_progress} ${styles.cab_courses__inf_block_thanks}`}>
                Скачать методический материал!
                <a className={`${globalStyles.btn_reset}`} href={currentDefaultMaterialsLink} download target='_blank'>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_731_50602)">
                      <path d="M3.74805 6.79723C3.74805 4.87833 5.30362 3.32275 7.22252 3.32275H25.6281C27.547 3.32275 29.1025 4.87833 29.1025 6.79723V25.2028C29.1025 27.1217 27.547 28.6772 25.6281 28.6772H7.22252C5.30362 28.6772 3.74805 27.1217 3.74805 25.2028V6.79723Z" fill="#4F75FE" shape-rendering="crispEdges" />
                      <path d="M7.22252 2.92659C5.08483 2.92659 3.35188 4.65953 3.35188 6.79723V25.2028C3.35188 27.3405 5.08483 29.0734 7.22252 29.0734H25.6281C27.7658 29.0734 29.4987 27.3405 29.4987 25.2028V6.79723C29.4987 4.65953 27.7658 2.92659 25.6281 2.92659H7.22252Z" stroke="#7D8592" stroke-width="0.792328" shape-rendering="crispEdges" />
                      <path d="M16.4259 10.9713V21.0288M16.4259 21.0288L20.1974 17.2572M16.4259 21.0288L12.6543 17.2572" stroke="#FBF9F5" stroke-width="0.950794" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <defs>
                      <filter id="filter0_d_731_50602" x="0.956055" y="0.530396" width="30.9385" height="30.9392" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset />
                        <feGaussianBlur stdDeviation="1" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.607843 0 0 0 0 0.12549 0 0 0 0 0.184314 0 0 0 0.1 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_731_50602" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_731_50602" result="shape" />
                      </filter>
                    </defs>
                  </svg>
                </a>

              </div>
            </div>

            <div className={styles.cab_courses__thanks_text}>
              После изучения материалов курса приступайте к прохождению тестирования. Мы не ограничиваем Вас в количестве попыток для прохождения тестирования. После успешного прохождения итогового тестирования по курсу повышения квалификации Вы получите удостоверение государственного образца! Доставка удостоверения Почтой России уже включена в стоимость курса.
            </div>

            <h3 className={styles.cab_courses__payment_title}>Содержание курса:</h3>

            <div className={styles.cab_courses__thanks_text}>
              {modules.map((currentModule) => (
                <span>
                  Модуль №{currentModule.module_order}:  <br />
                  {currentModule.title}
                </span>
              ))}
            </div>

            <button
              className={`${globalStyles.btn_reset} ${styles.cab_courses__thanks_btn}`}
              onClick={() => openModal(testId)}
            >Начать тест</button>

          </div>
        }
      </>
    );
  };

  return (
    <section className={`${globalStyles.section_padding} ${styles.cab_profile}`}
      onClick={handleOutsideClick}
    >
      <div className={globalStyles.container}>
        <div className={globalStyles.cab_container}>
          <CabAside />
          <div className={globalStyles.cab_content}>
            <h2 className={globalStyles.cab_title}>Мои курсы</h2>
            <div className={`${globalStyles.cab_blocks} ${styles.cab_courses__blocks}`}>
              <div className={`${globalStyles.cab_block} ${styles.cab_courses__aside}`}>
                <div className={styles.cab_courses__aside_title_wrapper}>
                  <Select
                    options={coursesOptions}
                    styles={coursesTypeStyles}
                    isSearchable={false}
                    onChange={handleCoursesTypeChange}
                    value={coursesType}
                    required
                  />

                </div>
                <div className={styles.cab_courses__aside_content}>

                  {courses
                    .filter(course => coursesType && coursesType.value === '1' ? !course.is_paid : course.is_paid) // Исключаем оплаченные курсы
                    .map((course, i) => {
                      const variation = coursesVariations.find(variation => variation.id === course.course_variation);



                      return (
                        <button
                          className={`${globalStyles.btn_reset} ${styles.cab_courses__aside_content_block} ${selectedIndex === i ? styles.cab_courses__aside_content_block_active : ''}`}
                          key={i}
                          onClick={() => {
                            setCurrentId(course.id);
                            setCurrentVariationId(variation ? variation.id : 0);
                            setCurrentVariation(variation ? variation.display_name : '');
                            setCurrentTitle(`${course.course_title} ${course.number_of_hours} ч.`);
                            setCurrentTitleVariation(course.course_title);
                            setCurrentTitleVariationHours(`${course.number_of_hours} ч.`);
                            setCurrentContent(1);
                            setSelectedIndex(i);

                            handleCourseChoice(course.id);

                            setTabsType(tabsOptions[0]);

                            const basePrice = parseFloat(variation?.base_price ?? "0"); // Convert to number
                            const discountPercentage = parseFloat(variation?.discount_percentage ?? "0"); // Convert to number
                            const couponPercentage = parseFloat(variation?.coupon_discount ?? "0"); // Convert to number
                            const hours = parseFloat(variation?.hour_coefficients.find(hours => hours.number_of_hours === course.number_of_hours)?.price_coefficient ?? "0"); // Convert to number

                            const coursePrice = basePrice * hours;

                            setCurrentCoursePrice(coursePrice);
                            setCurrentCourseDiscount(discountPercentage);
                            setCurrentCourseCoupon(couponPercentage);

                            setFile(null);

                          }}
                        >
                          {variation ? variation.display_name : ''}
                          <span>{course.course_title} {course.number_of_hours} ч.</span>
                        </button>
                      );
                    })}



                </div>
              </div>

              <div className={`${globalStyles.cab_block} ${styles.cab_courses__main_block}`}>
                <div className={styles.cab_courses__text}>{currentVariation}</div>
                <h3 className={styles.cab_courses__title}>{currentTitle}</h3>
                <div className={`${globalStyles.cab_tabs_btns} ${styles.cab_courses__tabs_btns}`}>
                  <button
                    className={`${globalStyles.btn_reset} ${globalStyles.cab_tabs_btn} ${currentContent === 1 ? globalStyles.cab_tabs_btn_active : ''}`}
                    onClick={() => {
                      if (currentId !== 0) {
                        setCurrentContent(1);
                      }
                    }}
                  >
                    1. Заполните данные
                  </button>
                  <button
                    className={`${globalStyles.btn_reset} ${globalStyles.cab_tabs_btn} ${currentContent === 2 ? globalStyles.cab_tabs_btn_active : ''}`}
                    onClick={() => {
                      if (currentId !== 0) {
                        setCurrentContent(2);
                      }
                    }}
                  >
                    2. Загрузить документы
                  </button>
                  <button
                    className={`${globalStyles.btn_reset} ${globalStyles.cab_tabs_btn} ${currentContent === 3 ? globalStyles.cab_tabs_btn_active : ''}`}
                    onClick={() => {
                      if (currentId !== 0) {
                        setCurrentContent(3);
                      }
                    }}
                  >
                    3. Информация
                  </button>
                  <button
                    className={`${globalStyles.btn_reset} ${globalStyles.cab_tabs_btn} ${currentContent === 4 ? globalStyles.cab_tabs_btn_active : ''}`}
                    onClick={() => {
                      if (currentId !== 0) {
                        setCurrentContent(4);
                      }
                    }}
                  >
                    4. Оплатить
                  </button>
                  <button
                    className={`${globalStyles.btn_reset} ${globalStyles.cab_tabs_btn} ${currentContent === 5 ? globalStyles.cab_tabs_btn_active : ''}`}
                    onClick={() => {
                      if (currentId !== 0 && (coursesType && coursesType.value === '2')) {
                        setCurrentContent(5);
                      } else if (currentId !== 0 && (coursesType && coursesType.value === '1')) {
                        alert('Сначала оплатите курс!');
                      }
                    }}
                  >
                    5. Приступить к обучению
                  </button>
                </div>

                <div className={styles.cab_courses__tabs_btns_adaptive}>
                  <Select
                    options={tabsOptions}
                    styles={tabsTypeStyles}
                    isSearchable={false}
                    onChange={handleTabsTypeChange}
                    value={tabsType}
                    required
                  />
                </div>

                {coursesType && coursesType.value === '1' ? renderContent() : renderContentPaid()}

              </div>

            </div>
          </div>
        </div>
        <Feedback />

      </div>

      <ModalComponent
        isOpen={isFirstModalOpen}
        onRequestClose={() => setIsFirstModalOpen(false)}
        content={
          <div className={`${globalStyles.modal_content} ${globalStyles.modal_addition__wrapper}`}>
            <img src={CabCoursesAddition1} alt="" width={229} height={246} />
            <div className={globalStyles.modal_addition__text}>
              <h2 className={globalStyles.modal_addition__title}>Ускоренное обучение</h2>
              <p className={globalStyles.modal_addition__descr}>
                Обучение от 1 дня, получение электронного документа сразу после тестирования
              </p>
              <div className={globalStyles.modal_addition__price}>500 ₽</div>
              <button
                className={`${globalStyles.btn_reset} ${globalStyles.modal_addition__btn}`}
                onClick={() => handleCheckboxChange(1)}
              >
                {isAdditionSelected(1) ? 'Убрать' : 'Добавить'}
              </button>
            </div>
          </div>
        }
        customClassName={globalStyles.modal_addition_content}
      />


      <ModalComponent
        isOpen={isSecondModalOpen}
        onRequestClose={() => setIsSecondModalOpen(false)}
        content={
          <div className={`${globalStyles.modal_content} ${globalStyles.modal_addition__wrapper}`}>
            <img src={CabCoursesAddition2} alt="" width={229} height={246} />
            <div className={globalStyles.modal_addition__text}>
              <h2 className={globalStyles.modal_addition__title}>Твердая обложка</h2>
              <p className={globalStyles.modal_addition__descr}>
                Ваши документы будут выглядеть презентабельно! Закажите твердую обложку
              </p>
              <div className={globalStyles.modal_addition__price}>300 ₽</div>
              <button
                className={`${globalStyles.btn_reset} ${globalStyles.modal_addition__btn}`}
                onClick={() => handleCheckboxChange(2)}
              >
                {isAdditionSelected(2) ? 'Убрать' : 'Добавить'}
              </button>
            </div>
          </div>
        }
        customClassName={globalStyles.modal_addition_content}
      />

      <ModalComponent
        isOpen={isThirdModalOpen}
        onRequestClose={() => setIsThirdModalOpen(false)}
        content={
          <div className={`${globalStyles.modal_content} ${globalStyles.modal_addition__wrapper}`}>
            <img src={CabCoursesAddition3} alt="" width={229} height={246} />
            <div className={globalStyles.modal_addition__text}>
              <h2 className={globalStyles.modal_addition__title}>Экспресс доставка</h2>
              <p className={globalStyles.modal_addition__descr}>
                Самая быстрая доставка оригиналов документов авиапочтой
              </p>
              <div className={globalStyles.modal_addition__price}>300 ₽</div>
              <button
                className={`${globalStyles.btn_reset} ${globalStyles.modal_addition__btn}`}
                onClick={() => handleCheckboxChange(3)}
              >
                {isAdditionSelected(3) ? 'Убрать' : 'Добавить'}
              </button>
            </div>
          </div>
        }
        customClassName={globalStyles.modal_addition_content}
      />

      <ModalComponent
        isOpen={isTestModalOpen}
        onRequestClose={closeModal}
        content={
          modalContent && (
            <div className={olympiadsStyles.modal_olympiad}>
              <h2 className={olympiadsStyles.modal_olympiad__title}>{modalContent.title}</h2>
              {isTestCompleted ? (
                <div>
                  <p className={`${olympiadsStyles.modal_olympiad__results_descr} ${olympiadsStyles.modal_olympiad__results_descr_margin}`}>Правильных ответов: {getResults().correctAnswersCount} из {getResults().totalQuestions}</p>
                  <p className={`${olympiadsStyles.modal_olympiad__results_descr} ${olympiadsStyles.modal_olympiad__results_descr_bold} ${olympiadsStyles.modal_olympiad__results_descr_margin}`}>Время прохождения теста: {getResults().timeSpent}</p>
                  <div className={olympiadsStyles.modal_olympiad__results_title}>Вы набрали {getResults().correctAnswersCount} из {getResults().totalQuestions} баллов ({getResults().percentage.toFixed(2)}%)</div>
                  <p className={`${olympiadsStyles.modal_olympiad__results_descr} ${olympiadsStyles.modal_olympiad__results_descr_margin} ${olympiadsStyles.modal_olympiad__results_descr_center}`}>Поздравляем с прохождением олимпиады, Вы можете заказать изготовление персонального диплома участника олимпиады!</p>
                </div>
              ) : (
                <>
                  <ul className={`${globalStyles.list_reset} ${olympiadsStyles.modal_olympiad__questions}`}>
                    {modalContent.questions.map((_, index) => (
                      <li
                        key={index}
                        className={`${olympiadsStyles.modal_olympiad__question} ${questionsStatus[index] === true
                          ? olympiadsStyles.modal_olympiad__question_green
                          : questionsStatus[index] === false
                            ? olympiadsStyles.modal_olympiad__question_red
                            : ''
                          }`}
                      >
                        {index + 1}
                      </li>
                    ))}
                  </ul>
                  <div className={olympiadsStyles.modal_olympiad__text}>
                    <div className={olympiadsStyles.modal_olympiad__question_num}>Вопрос {currentQuestionIndex + 1}</div>
                    <div className={olympiadsStyles.modal_olympiad__question_text}>{modalContent.questions[currentQuestionIndex].question}</div>
                    <div className={olympiadsStyles.modal_olympiad__question_choice}>Выберите вариант ответа</div>
                    <ul className={`${globalStyles.list_reset} ${olympiadsStyles.modal_olympiad__questions_list}`}>
                      {modalContent.questions[currentQuestionIndex].answers.map((answer, index) => (
                        <li
                          key={index}
                          className={`${olympiadsStyles.modal_olympiad__questions_item} ${checkedAnswers[currentQuestionIndex]?.includes(answer.title)
                            ? answer.is_correct
                              ? olympiadsStyles.modal_olympiad__questions_item_green
                              : olympiadsStyles.modal_olympiad__questions_item_red
                            : isAnswerChecked && answer.is_correct
                              ? olympiadsStyles.modal_olympiad__questions_item_green
                              : ''
                            }`}
                        >
                          <label className={olympiadsStyles.modal_olympiad__question_label}>
                            <input
                              type="checkbox"
                              value={answer.title}
                              onChange={handleAnswerChange}
                              checked={selectedAnswers.includes(answer.title)}
                              disabled={isAnswerChecked}
                            />
                            {answer.title}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>



                  <div className={olympiadsStyles.modal_olympiad__btns}>
                    {skippedFlag ? (
                      <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${olympiadsStyles.modal_olympiad__btn_skip}`} onClick={skipQuestion}>Пропустить вопрос</button>
                    ) : ('')}
                    {isAnswerChecked ? (
                      <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${olympiadsStyles.modal_olympiad__btn}`} onClick={nextQuestion}>Следующий вопрос</button>
                    ) : (
                      <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${olympiadsStyles.modal_olympiad__btn}`} onClick={checkAnswer}>Проверить ответ</button>
                    )}
                  </div>

                </>
              )}
            </div>
          )
        }
        customClassName={modalStyles.modalContent_olympiad}
      />

    </section>
  );
};

export default CabCourses;
