import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";

import AuthService from '../../services/AuthService';

import globalStyles from '../../App.module.sass';
import styles from './CabIssue.module.sass';

import Feedback from '../../components/Feedback/Feedback';
import CabAside from '../../components/CabAside/CabAside';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import QRCodeComponent from '../../components/QRCodeComponent/QRCodeComponent';

import CabIssueDiplomBigger from '../../assets/cab-issue/cab-issue-diplom-bigger.png';
import CabIssueThanksBigger from '../../assets/cab-issue/cab-issue-thanks-bigger.png';
import CabIssuePublicationBigger from '../../assets/cab-issue/cab-issue-publication-bigger.png';

interface IDocsVariations {
  id: number;
  tag: string;
  templates: IDocsVariationsTemplates[];
}

interface IDocsVariationsTemplates {
  id: number;
  preview: string;
}

interface IDocument {
  count: number;
  total_pages: number;
  results: IDocumentInf[];
}

interface IDocumentInf {
  id: number;
  variation: number;
  template: number;
  is_paid: boolean;
  question?: string;
  full_name: string;
  participation_date: string;
  institution_name: string;
  locality: string;
  project_name: string;
  published_by: string;
  for_whom: string;
  place: number;
  level: string;
  leader: string;
  nomination: string;
}

const CabIssue = () => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = AuthService.getAccessToken();

  const qrUrl = `${apiBaseUrl}/cab-issue`;

  const [currentContent, setCurrentContent] = useState(1);
  const [documentVariationId, setDocumentVariationId] = useState(1);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);

  useEffect(() => {
    if (documentVariationId === 1) {
      setFormDataCompetition(prevState =>
        prevState.map(diploma => ({ ...diploma, variation: documentVariationId }))
      );
    } else if (documentVariationId === 4) {
      setFormDataOlympiads(prevState =>
        prevState.map(diploma => ({ ...diploma, variation: documentVariationId }))
      );
    } else if (documentVariationId === 2) {
      setFormDataThanks(prevState =>
        prevState.map(diploma => ({ ...diploma, variation: documentVariationId }))
      );
    } else if (documentVariationId === 3) {
      setFormDataPublication(prevState =>
        prevState.map(diploma => ({ ...diploma, variation: documentVariationId }))
      );
    }
  }, [documentVariationId]);

  const today = new Date().toISOString().split('T')[0]; // Форматируем в YYYY-MM-DD

  const [formDataCompetition, setFormDataCompetition] = useState([
    {
      full_name: '',
      full_name_participant: '',
      institution_name: '',
      locality: '',
      leader: '',
      place: '1',
      level: 'INTNAT',
      participation_date: today,
      nomination: '',
      project_name: '',
      for_whom: 'PARTICIPANT',
      variation: documentVariationId,
      template: null as number | null,
    },
  ]);

  const [formDataOlympiads, setFormDataOlympiads] = useState([
    {
      full_name: '',
      full_name_participant: '',
      institution_name: '',
      locality: '',
      level: 'INTNAT',
      place: '1',
      leader: '',
      nomination: '',
      participation_date: today,
      for_whom: 'PARTICIPANT',
      variation: documentVariationId,
      template: null as number | null,
    },
  ]);

  const [formDataThanks, setFormDataThanks] = useState([
    {
      full_name: '',
      full_name_participant: '',
      institution_name: '',
      locality: '',
      nomination: '',
      participation_date: today,
      variation: documentVariationId,
      template: null as number | null,
    },
  ]);

  const [formDataPublication, setFormDataPublication] = useState([
    {
      participation_date: today,
      full_name: '',
      full_name_participant: '',
      institution_name: '',
      locality: '',
      project_name: '',
      variation: documentVariationId,
      published_by: 'Опубликовал',
      template: null as number | null,
    },
  ]);

  const [docsVariations, setDocsVariations] = useState<IDocsVariations[]>([]);
  const [docsVariationsTemplates, setDocsVariationsTemplates] = useState<IDocsVariationsTemplates[]>([]);
  const [docsVariationsIndex, setDocsVariationsIndex] = useState(1);

  useEffect(() => {
    const fetchDocsVariations = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/docs/variations`);
        const data = await response.json();

        setDocsVariations(data.results);

      } catch (error) {
        console.error('Error fetching docs:', error);
      }
    };

    fetchDocsVariations();
  }, []);

  useEffect(() => {
    if (docsVariations.length > 0) {
      setFormDataCompetition(prevFormData => prevFormData.map(item => ({
        ...item,
        template: docsVariations.find(obj => obj.id === documentVariationId)?.templates[0].id || null
      })));
    }
  }, [docsVariations, documentVariationId]);

  useEffect(() => {
    if (docsVariations.length > 0) {
      setFormDataOlympiads(prevFormData => prevFormData.map(item => ({
        ...item,
        template: docsVariations.find(obj => obj.id === documentVariationId)?.templates[0].id || null
      })));
    }
  }, [docsVariations, documentVariationId]);

  useEffect(() => {
    if (docsVariations.length > 0) {
      setFormDataThanks(prevFormData => prevFormData.map(item => ({
        ...item,
        template: docsVariations.find(obj => obj.id === documentVariationId)?.templates[0].id || null
      })));
    }
  }, [docsVariations, documentVariationId]);

  useEffect(() => {
    if (docsVariations.length > 0) {
      setFormDataPublication(prevFormData => prevFormData.map(item => ({
        ...item,
        template: docsVariations.find(obj => obj.id === documentVariationId)?.templates[0].id || null
      })));
    }
  }, [docsVariations, documentVariationId]);

  const handleAddDiplomaCompetition = (e) => {
    e.preventDefault();

    setFormDataCompetition([
      ...formDataCompetition,
      {
        full_name: '',
        full_name_participant: '',
        institution_name: '',
        locality: '',
        leader: '',
        place: '1',
        level: 'INTNAT',
        participation_date: today,
        nomination: '',
        project_name: '',
        for_whom: 'PARTICIPANT',
        variation: documentVariationId,
        template: docsVariations.find(obj => obj.id === documentVariationId)?.templates[0].id || null,
      },
    ]);
  };

  const handleAddDiploma = (e) => {
    e.preventDefault();

    setFormDataOlympiads([
      ...formDataOlympiads,
      {
        full_name: '',
        full_name_participant: '',
        institution_name: '',
        locality: '',
        level: 'INTNAT',
        place: '1',
        leader: '',
        nomination: '',
        participation_date: today,
        for_whom: 'PARTICIPANT',
        variation: documentVariationId,
        template: docsVariations.find(obj => obj.id === documentVariationId)?.templates[0].id || null,
      },
    ]);
  };

  const handleAddDiplomaThanks = (e) => {
    e.preventDefault();

    setFormDataThanks([
      ...formDataThanks,
      {
        full_name: '',
        full_name_participant: '',
        institution_name: '',
        locality: '',
        nomination: '',
        participation_date: today,
        variation: documentVariationId,
        template: docsVariations.find(obj => obj.id === documentVariationId)?.templates[0].id || null,
      },
    ]);
  };

  const handleAddDiplomaPublication = (e) => {
    e.preventDefault();

    setFormDataPublication([
      ...formDataPublication,
      {
        participation_date: today,
        full_name: '',
        full_name_participant: '',
        institution_name: '',
        locality: '',
        project_name: '',
        variation: documentVariationId,
        published_by: 'Опубликовал',
        template: docsVariations.find(obj => obj.id === documentVariationId)?.templates[0].id || null
      },
    ]);
  };

  const handleRemoveDiplomaCompetition = (e, index) => {
    e.preventDefault();

    if (formDataCompetition.length >= 2) {
      const updatedDiplomas = formDataCompetition.filter((_, idx) => idx !== index);
      setFormDataCompetition(updatedDiplomas);
    } else {
      setCurrentCompetitionPreviews({});
      setCurrentContent(1);
    }
  };

  const handleRemoveDiploma = (e, index) => {
    e.preventDefault();

    if (formDataOlympiads.length >= 2) {
      const updatedDiplomas = formDataOlympiads.filter((_, idx) => idx !== index);
      setFormDataOlympiads(updatedDiplomas);
    } else {
      setCurrentCompetitionPreviews({});
      setCurrentContent(1);
    }
  };

  const handleRemoveDiplomaThanks = (e, index) => {
    e.preventDefault();

    if (formDataThanks.length >= 2) {
      const updatedDiplomas = formDataThanks.filter((_, idx) => idx !== index);
      setFormDataThanks(updatedDiplomas);
    } else {
      setCurrentCompetitionPreviews({});
      setCurrentContent(1);
    }
  };

  const handleRemoveDiplomaPublication = (e, index) => {
    e.preventDefault();

    if (formDataPublication.length >= 2) {
      const updatedDiplomas = formDataPublication.filter((_, idx) => idx !== index);
      setFormDataPublication(updatedDiplomas);
    } else {
      setCurrentCompetitionPreviews({});
      setCurrentContent(1);
    }
  };

  const handleInputChangeCompetition = (index, field, value) => {
    const updatedDiplomas = [...formDataCompetition];
    updatedDiplomas[index][field] = value;
    setFormDataCompetition(updatedDiplomas);
  };

  const handleInputChange = (index, field, value) => {
    const updatedDiplomas = [...formDataOlympiads];
    updatedDiplomas[index][field] = value;
    setFormDataOlympiads(updatedDiplomas);
  };

  const handleInputChangeThanks = (index, field, value) => {
    const updatedDiplomas = [...formDataThanks];
    updatedDiplomas[index][field] = value;
    setFormDataThanks(updatedDiplomas);
  };

  const handleInputChangePublication = (index, field, value) => {
    const updatedDiplomas = [...formDataPublication];
    updatedDiplomas[index][field] = value;
    setFormDataPublication(updatedDiplomas);
  };

  const handleSelectChangeCompetition = (index, field, selectedOption) => {
    const updatedDiplomas = [...formDataCompetition];
    updatedDiplomas[index][field] = selectedOption.value;
    setFormDataCompetition(updatedDiplomas);
  };

  const handleSelectChange = (index, field, selectedOption) => {
    const updatedDiplomas = [...formDataOlympiads];
    updatedDiplomas[index][field] = selectedOption.value;
    setFormDataOlympiads(updatedDiplomas);
  };

  const handlePublishedChange = (index, field, selectedOption) => {
    const updatedDiplomas = [...formDataPublication];
    updatedDiplomas[index][field] = selectedOption.label;
    setFormDataPublication(updatedDiplomas);
  };

  const handlePreviewChangeCompetition = (index, field, val) => {
    const updatedDiplomas = [...formDataCompetition];
    updatedDiplomas[index][field] = val;
    setFormDataCompetition(updatedDiplomas);
  };

  const handlePreviewChangeOlympiads = (index, field, val) => {
    const updatedDiplomas = [...formDataOlympiads];
    updatedDiplomas[index][field] = val;
    setFormDataOlympiads(updatedDiplomas);
  };

  const handlePreviewChangeThanks = (index, field, val) => {
    const updatedDiplomas = [...formDataThanks];
    updatedDiplomas[index][field] = val;
    setFormDataThanks(updatedDiplomas);
  };

  const handlePreviewChangePublication = (index, field, val) => {
    const updatedDiplomas = [...formDataPublication];
    updatedDiplomas[index][field] = val;
    setFormDataPublication(updatedDiplomas);
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

  const lvlOptions = [
    {
      value: 'INTNAT',
      label: 'Международный',
      genitive: 'Международного',
    },
    {
      value: 'ALRUSS',
      label: 'Всероссийский',
      genitive: 'Всероссийского',
    },
    {
      value: 'INTREG',
      label: 'Региональный',
      genitive: 'Регионального',
    },
  ];

  const lvlOptionsOlympiad = [
    {
      value: 'INTNAT',
      label: 'Международная',
      genitive: 'Международной',
    },
    {
      value: 'ALRUSS',
      label: 'Всероссийская',
      genitive: 'Всероссийской',
    },
    {
      value: 'INTREG',
      label: 'Региональная',
      genitive: 'Региональной',
    },
  ];

  const getGenitiveLabel = (options, level) => {
    const option = options.find(opt => opt.value === level);
    return option ? option.genitive : '';
  };

  const nominationOptions = [
    {
      value: 'за активное участие в интернет-олимпиадах на портале “Росмедаль” и достижения в профессиональном мастерстве',
      label: 'за активное участие в интернет-олимпиадах на портале “Росмедаль” и достижения в профессиональном мастерстве',
    },
    {
      value: 'за высокий уровень подготовки участников Международного творческого конкурса, проводимого на портале “Росмедаль”',
      label: 'за высокий уровень подготовки участников Международного творческого конкурса, проводимого на портале “Росмедаль”',
    },
    {
      value: 'за активную публикацию статей и методических материалов на портале “Росмедаль”',
      label: 'за активную публикацию статей и методических материалов на портале “Росмедаль”',
    },
    {
      value: 'за активную помощь в наполнении Международного образовательного портала “Росмедаль”',
      label: 'за активную помощь в наполнении Международного образовательного портала “Росмедаль”',
    },
    {
      value: 'за активное участие в творческих конкурсах, конкурсах профессионального мастерства и подготовку участников-лауреатов олимпиад на портале “Росмедаль”',
      label: 'за активное участие в творческих конкурсах, конкурсах профессионального мастерства и подготовку участников-лауреатов олимпиад на портале “Росмедаль”',
    },
    {
      value: 'за плодотворное сотрудничество и подготовку участников олимпиад и конференций на портале “Росмедаль”',
      label: 'за плодотворное сотрудничество и подготовку участников олимпиад и конференций на портале “Росмедаль”',
    },
    {
      value: 'за особые достижения в профессиональной деятельности',
      label: 'за особые достижения в профессиональной деятельности',
    },
    {
      value: 'за успешное внедрение современных технологий',
      label: 'за успешное внедрение современных технологий',
    },
    {
      value: 'за личный вклад во внедрение новых методик обучения',
      label: 'за личный вклад во внедрение новых методик обучения',
    },
    {
      value: 'за постоянное повышение профессиональной компетентности и ответственности с пожеланием успехов в ответственной работе, новых творческих идей и замыслов, осуществления запланированных дел',
      label: 'за постоянное повышение профессиональной компетентности и ответственности с пожеланием успехов в ответственной работе, новых творческих идей и замыслов, осуществления запланированных дел',
    },
    {
      value: 'за выдающиеся профессиональные качества',
      label: 'за выдающиеся профессиональные качества',
    },
    {
      value: 'за высокий профессионализм, творческий поиск и упорный труд',
      label: 'за высокий профессионализм, творческий поиск и упорный труд',
    },
    {
      value: 'за активное участие и подготовку участников-лауреатов олимпиад на портале “Росмедаль”',
      label: 'за активное участие и подготовку участников-лауреатов олимпиад на портале “Росмедаль”',
    },
  ];

  const placeOptions = [
    {
      value: 1,
      label: '1 место',
    },
    {
      value: 2,
      label: '2 место',
    },
    {
      value: 3,
      label: '3 место',
    },
    {
      value: 4,
      label: 'Участник',
    },
  ];

  const publicationOptions = [
    {
      value: '1',
      label: 'Опубликовал',
    },
    {
      value: '2',
      label: 'Опубликовала',
    },
    {
      value: '3',
      label: 'Опубликовали',
    },
  ];

  const navigate = useNavigate();

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  const handleSubmit = (e, body) => {
    e.preventDefault();

    // Отправка обновленных данных на сервер
    fetch(`${apiBaseUrl}/api/v1/cab/documents/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
      .then(data => {
        console.log('Success:', data);
        alert('Данные успешно отправлены!');
        handleRedirect('/cab-documents');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const [formDataProfile, setFormDataProfile] = useState({
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

        setFormDataProfile({
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

        console.log(formDataProfile);


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();


  }, []);

  const [useProfileDataCompetition, setUseProfileDataOlyuseProfileDataCompetition] = useState<boolean[]>([]);
  const [useProfileDataOlympiads, setUseProfileDataOlyuseProfileDataOlympiads] = useState<boolean[]>([]);
  const [useProfileDataThanks, setUseProfileDataOlyuseProfileDataThanks] = useState<boolean[]>([]);
  const [useProfileDataPublication, setUseProfileDataOlyuseProfileDataPublication] = useState<boolean[]>([]);

  const handleProfileCheckboxChangeCompetition = (index: number) => {
    const updatedProfileDataUsage = [...useProfileDataCompetition];

    // Если чекбокс активен - заполняем данные из formDataProfile, иначе - очищаем поля
    if (!useProfileDataCompetition[index]) {
      updatedProfileDataUsage[index] = true;
      setFormDataCompetition((prev) => {
        const updatedDiplomas = [...prev];
        updatedDiplomas[index] = {
          ...updatedDiplomas[index],
          full_name: formDataProfile.last_name + ' ' + formDataProfile.first_name + ' ' + formDataProfile.patronymic,
          institution_name: formDataProfile.job,
          locality: formDataProfile.city,
        };
        return updatedDiplomas;
      });
    } else {
      updatedProfileDataUsage[index] = false;
      setFormDataCompetition((prev) => {
        const updatedDiplomas = [...prev];
        updatedDiplomas[index] = {
          ...updatedDiplomas[index],
          full_name: '',
          institution_name: '',
          locality: '',
        };
        return updatedDiplomas;
      });
    }

    setUseProfileDataOlyuseProfileDataCompetition(updatedProfileDataUsage);
  };

  const handleProfileCheckboxChange = (index: number) => {
    const updatedProfileDataUsage = [...useProfileDataOlympiads];

    // Если чекбокс активен - заполняем данные из formDataProfile, иначе - очищаем поля
    if (!useProfileDataOlympiads[index]) {
      updatedProfileDataUsage[index] = true;
      setFormDataOlympiads((prev) => {
        const updatedDiplomas = [...prev];
        updatedDiplomas[index] = {
          ...updatedDiplomas[index],
          full_name: formDataProfile.last_name + ' ' + formDataProfile.first_name + ' ' + formDataProfile.patronymic,
          institution_name: formDataProfile.job,
          locality: formDataProfile.city,
        };
        return updatedDiplomas;
      });
    } else {
      updatedProfileDataUsage[index] = false;
      setFormDataOlympiads((prev) => {
        const updatedDiplomas = [...prev];
        updatedDiplomas[index] = {
          ...updatedDiplomas[index],
          full_name: '',
          institution_name: '',
          locality: '',
        };
        return updatedDiplomas;
      });
    }

    setUseProfileDataOlyuseProfileDataOlympiads(updatedProfileDataUsage);
  };

  const handleProfileCheckboxChangeThanks = (index: number) => {
    const updatedProfileDataUsage = [...useProfileDataThanks];

    // Если чекбокс активен - заполняем данные из formDataProfile, иначе - очищаем поля
    if (!useProfileDataThanks[index]) {
      updatedProfileDataUsage[index] = true;
      setFormDataThanks((prev) => {
        const updatedDiplomas = [...prev];
        updatedDiplomas[index] = {
          ...updatedDiplomas[index],
          full_name: formDataProfile.last_name + ' ' + formDataProfile.first_name + ' ' + formDataProfile.patronymic,
          institution_name: formDataProfile.job,
          locality: formDataProfile.city,
        };
        return updatedDiplomas;
      });
    } else {
      updatedProfileDataUsage[index] = false;
      setFormDataThanks((prev) => {
        const updatedDiplomas = [...prev];
        updatedDiplomas[index] = {
          ...updatedDiplomas[index],
          full_name: '',
          institution_name: '',
          locality: '',
        };
        return updatedDiplomas;
      });
    }

    setUseProfileDataOlyuseProfileDataThanks(updatedProfileDataUsage);
  };

  const handleProfileCheckboxChangePublication = (index: number) => {
    const updatedProfileDataUsage = [...useProfileDataPublication];

    // Если чекбокс активен - заполняем данные из formDataProfile, иначе - очищаем поля
    if (!useProfileDataPublication[index]) {
      updatedProfileDataUsage[index] = true;
      setFormDataPublication((prev) => {
        const updatedDiplomas = [...prev];
        updatedDiplomas[index] = {
          ...updatedDiplomas[index],
          full_name: formDataProfile.last_name + ' ' + formDataProfile.first_name + ' ' + formDataProfile.patronymic,
          institution_name: formDataProfile.job,
          locality: formDataProfile.city,
        };
        return updatedDiplomas;
      });
    } else {
      updatedProfileDataUsage[index] = false;
      setFormDataPublication((prev) => {
        const updatedDiplomas = [...prev];
        updatedDiplomas[index] = {
          ...updatedDiplomas[index],
          full_name: '',
          institution_name: '',
          locality: '',
        };
        return updatedDiplomas;
      });
    }

    setUseProfileDataOlyuseProfileDataPublication(updatedProfileDataUsage);
  };

  const [currentCompetitionPreviews, setCurrentCompetitionPreviews] = useState({});

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    const foundObject = docsVariations.find(obj => obj.id === documentVariationId);
    if (foundObject) {
      setDocsVariationsTemplates(foundObject.templates);
    }
  }, [documentVariationId]); // Следим за изменением documentVariationId

  const [documents, setDocuments] = useState<IDocument | null>(null);

  const [currentTagOfDoc, setCurrentTagOfDoc] = useState('');
  const [currentNumberOfDoc, setCurrentNumberOfDoc] = useState(0);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Первый запрос
        const initialResponse = await fetch(`${apiBaseUrl}/api/v1/cab/documents?page=1`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const initialData: IDocument = await initialResponse.json();

        const { count, total_pages, results: initialResults } = initialData;

        let allResults = initialResults;

        // Последовательно запрашиваем остальные страницы
        for (let page = 2; page <= total_pages; page++) {
          const response = await fetch(`${apiBaseUrl}/api/v1/cab/documents?page=${page}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const pageData: IDocument = await response.json();
          allResults = allResults.concat(pageData.results);
        }

        // Устанавливаем собранные данные в setDocuments
        setDocuments({
          count,
          total_pages,
          results: allResults,
        });
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocs();
  }, [token]);

  useEffect(() => {
    const foundObject = docsVariations.find(obj => obj.id === documentVariationId);


    setCurrentTagOfDoc('');
    setCurrentNumberOfDoc(0);
    if (foundObject) {
      setCurrentTagOfDoc(foundObject.tag);
      if (documents && documents.results.length > 0) {
        setCurrentNumberOfDoc(Number(documents?.results[documents?.results.length - 1].id));
      }
    }

  }, [docsVariationsTemplates]);

  const renderContent = () => {
    return (
      <>
        {currentContent === 1 &&
          <div className={styles.cab_issue__content}>
            <h3 className={styles.cab_issue__content_title}>Во вкладке «Выбрать документ» выберите необходимый документ</h3>

            <ul className={`${globalStyles.list_reset} ${styles.cab_issue__list}`}>
              <li className={styles.cab_issue__item}>
                <div className={styles.cab_issue__item_text}>
                  <h4 className={styles.cab_issue__item_title}>Творческие конкурсы</h4>
                  <div className={styles.cab_issue__item_text}>Диплом победителя (участника) творческого конкурса</div>
                  <p className={styles.cab_issue__item_descr}>
                    Получите официальный диплом победителя или участника творческого конкурса! Вы можете оформить документ за 2 минуты. К диплому прилагается выписка из приказа о награждении.
                  </p>
                  <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__item_btn}`}
                    onClick={() => {
                      setDocumentVariationId(1);
                      setCurrentContent(2);

                      const foundObject = docsVariations.find(obj => obj.id === documentVariationId);

                      if (foundObject) {
                        setDocsVariationsTemplates(foundObject.templates);
                      }

                    }
                    }>Получить диплом</button>
                </div>
                <img src={CabIssueDiplomBigger} alt="" width={167} height={237} />
              </li>
              <li className={styles.cab_issue__item}>
                <div className={styles.cab_issue__item_text}>
                  <h4 className={styles.cab_issue__item_title}>Олимпиады</h4>
                  <div className={styles.cab_issue__item_text}>Диплом победителя (участника) олимпиады</div>
                  <p className={styles.cab_issue__item_descr}>
                    Получите официальный диплом победителя или участника всероссийской олимпиады! Вы можете оформить документ за 2 минуты. К диплому прилагается выписка из приказа о награждении.
                  </p>
                  <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__item_btn}`}
                    onClick={() => {
                      setDocumentVariationId(4);
                      setCurrentContent(3);

                      const foundObject = docsVariations.find(obj => obj.id === documentVariationId);

                      if (foundObject) {
                        setDocsVariationsTemplates(foundObject.templates);
                      }
                    }
                    }>Получить диплом</button>
                </div>
                <img src={CabIssueDiplomBigger} alt="" width={167} height={237} />
              </li>
              <li className={styles.cab_issue__item}>
                <div className={styles.cab_issue__item_text}>
                  <h4 className={styles.cab_issue__item_title}>Благодарственные письма</h4>
                  <div className={styles.cab_issue__item_text}>Благодарственное письмо</div>
                  <p className={styles.cab_issue__item_descr}>
                    Вы можете получить благодарственное письмо за высокий уровень подготовки участников олимпиад и конкурсов, за плодотворное сотрудничество, а также за активное участие в олимпиадах и конкурсах на портале «Солнечный свет»
                  </p>
                  <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__item_btn}`}
                    onClick={() => {
                      setDocumentVariationId(2);
                      setCurrentContent(4);

                      const foundObject = docsVariations.find(obj => obj.id === documentVariationId);

                      if (foundObject) {
                        setDocsVariationsTemplates(foundObject.templates);
                      }
                    }
                    }>Получить благодарственное письмо</button>
                </div>
                <img src={CabIssueThanksBigger} alt="" width={167} height={237} />
              </li>
              <li className={`${styles.cab_issue__item} ${styles.cab_issue__item_adaptive}`}>
                <div className={styles.cab_issue__item_text}>
                  <h4 className={styles.cab_issue__item_title}>Публикации на сайте</h4>
                  <div className={styles.cab_issue__item_text}>Свидетельство о публикации</div>
                  <p className={styles.cab_issue__item_descr}>
                    Портал «ычвмвым» зарегистрирован как СМИ (регистрация СМИ ЭЛ ФС 77-65391). Подтвердите размещение вашей публикации в СМИ официальным свидетельством! К свидетельству о публикации прилагается выписка из приказа о выдаче документов.
                  </p>
                  <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__item_btn}`}
                    onClick={() => {
                      setDocumentVariationId(3);
                      setCurrentContent(5);

                      const foundObject = docsVariations.find(obj => obj.id === documentVariationId);

                      if (foundObject) {
                        setDocsVariationsTemplates(foundObject.templates);
                      }
                    }
                    }>Получить свидетельство</button>
                </div>
                <img src={CabIssuePublicationBigger} alt="" width={167} height={237} />
              </li>
            </ul>
          </div>
        }
        {currentContent === 2 &&
          <form className={styles.cab_issue__content} onSubmit={(e) => { handleSubmit(e, formDataCompetition) }}>
            <h3 className={styles.cab_issue__content_title}>Впишите в поля ввода необходимые личные данные об участнике</h3>

            {formDataCompetition.map((diploma, index) => (
              <div className={styles.cab_issue__diplomas} key={index}>
                <div className={styles.cab_issue__diplomas_previews}>

                  {docsVariationsTemplates.map((variation, variationIndex) => (
                    <img
                      className={styles.cab_issue__img_preview}
                      src={variation.preview}
                      width={65}
                      height={91}
                      alt=""
                      key={variationIndex}
                      onClick={() => {
                        setCurrentCompetitionPreviews(prev => ({
                          ...prev,
                          [index]: variation.preview  // Обновляем превью только для текущего элемента formDataCompetition
                        }));

                        handlePreviewChangeCompetition(index, 'template', variation.id);
                      }}
                    />
                  ))}

                  <button className={`${globalStyles.btn_reset} ${styles.cab_issue__diplomas_previews_btn}`} type="button"
                    onClick={() => {
                      setDocsVariationsIndex(index);
                      setIsFirstModalOpen(true);
                    }}
                  >Показать все</button>


                </div>

                <div className={styles.cab_issue__diplomas_preview_wrapper}>
                  <img
                    src={
                      currentCompetitionPreviews[index] // Проверяем, есть ли превью для текущего элемента formDataCompetition
                        ? currentCompetitionPreviews[index]
                        : docsVariationsTemplates.length > 0
                          ? docsVariationsTemplates[0].preview
                          : ''
                    }
                    alt=""
                    width={334}
                    height={472}
                  />


                  {docsVariationsTemplates.length > 0 && (

                    formDataCompetition[index].for_whom === 'PARTICIPANT' ? (
                      <div className={styles.cab_issue__diplomas_preview_text}>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          Награждается
                          <span>{diploma.full_name.length === 0 ? 'Фамилия Имя Отчество' : diploma.full_name}</span>
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.institution_name.length === 0 ? 'Название учреждения' : diploma.institution_name}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.locality.length === 0 ? 'Населенный пункт' : diploma.locality}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.place == '4' ? (
                            <span>Участник</span>
                          ) : (
                            <span>Победитель ({diploma.place} место)</span>
                          )}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {getGenitiveLabel(lvlOptions, diploma.level)} конкурса
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          Номинация: {diploma.nomination}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          <span>Работа: {diploma.project_name}</span>
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.leader.length === 0 ? '' : diploma.leader}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          Номер документа: {currentTagOfDoc}{Number(currentNumberOfDoc) + index + 1}
                        </div>
                      </div>
                    ) : (
                      <div className={styles.cab_issue__diplomas_preview_text}>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          Награждается
                          <span>{diploma.full_name.length === 0 ? 'Фамилия Имя Отчество руководителя' : diploma.full_name}</span>
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.institution_name.length === 0 ? 'Название учреждения' : diploma.institution_name}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.locality.length === 0 ? 'Населенный пункт' : diploma.locality}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          за подготовку
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          <span>{diploma.leader.length === 0 ? 'Фамилия Имя Отчество участника' : diploma.leader}</span>
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.place == '4' ? (
                            <span>Участник</span>
                          ) : (
                            <span>Победитель ({diploma.place} место)</span>
                          )}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {getGenitiveLabel(lvlOptions, diploma.level)} конкурса
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          Номинация: {diploma.nomination}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          <span>Работа: {diploma.project_name}</span>
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          Номер документа: {currentTagOfDoc}{Number(currentNumberOfDoc) + index}
                        </div>
                      </div>
                    )


                  )}

                  <div className={styles.cab_issue__diplomas_preview_date}>
                    <div className={styles.cab_issue__diplomas_preview_title}>
                      {formatDate(diploma.participation_date)}
                    </div>
                  </div>
                  <div className={styles.cab_issue__diplomas_preview_watermark}></div>
                  <div className={styles.cab_issue__diplomas_preview_qr}>
                    <QRCodeComponent url={qrUrl} />
                  </div>
                </div>

                <div className={styles.cab_issue__diplomas_content}>
                  <div className={styles.cab_issue__diplomas_checkboxes}>
                    <label className={styles.cab_issue__diplomas_label_wrapper}>
                      <div className={`${styles.cab_issue__diplomas_checkbox} ${formDataCompetition[index].for_whom === 'PARTICIPANT' ? styles.cab_issue__diplomas_checkbox_active : ''}`}>
                        <input
                          type="radio"
                          name={`for_whom_${index}`}
                          checked={formDataCompetition[index].for_whom === 'PARTICIPANT'}
                          onChange={() => handleInputChangeCompetition(index, 'for_whom', 'PARTICIPANT')}
                        />
                      </div>
                      <span>Участнику</span>
                    </label>
                    <label className={styles.cab_issue__diplomas_label_wrapper}>
                      <div className={`${styles.cab_issue__diplomas_checkbox} ${formDataCompetition[index].for_whom === 'LEADER' ? styles.cab_issue__diplomas_checkbox_active : ''}`}>
                        <input
                          type="radio"
                          name={`for_whom_${index}`}
                          checked={formDataCompetition[index].for_whom === 'LEADER'}
                          onChange={() => {
                            handleInputChangeCompetition(index, 'for_whom', 'LEADER');
                            handleInputChangeCompetition(index, 'leader', '');
                          }}
                        />
                      </div>
                      <span>Руководителю</span>
                    </label>
                  </div>
                  <label className={styles.cab_issue__diplomas_profile_checkbox}>
                    <input
                      type="checkbox"
                      checked={useProfileDataCompetition[index] || false}
                      onChange={() => handleProfileCheckboxChangeCompetition(index)}
                    />
                    Использовать данные из личного профиля
                  </label>



                  {formDataCompetition[index].for_whom === 'PARTICIPANT' ? (

                    <div className={styles.cab_issue__diplomas_inputs}>
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="ФИО участника"
                        value={diploma.full_name}
                        onChange={(e) => {
                          handleInputChangeCompetition(index, 'full_name', e.target.value);
                        }}
                        required
                      />
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="Название учреждения"
                        value={diploma.institution_name}
                        onChange={(e) => handleInputChangeCompetition(index, 'institution_name', e.target.value)}
                        required

                      />
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="Населенный пункт"
                        value={diploma.locality}
                        onChange={(e) => handleInputChangeCompetition(index, 'locality', e.target.value)}
                        required

                      />

                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="Руководитель"
                        value={diploma.leader}
                        onFocus={(e) => {
                          if (e.target.value === "") {
                            handleInputChangeCompetition(index, 'leader', "Руководитель: ");
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "Руководитель: ") {
                            handleInputChangeCompetition(index, 'leader', "");
                          }
                        }}
                        onChange={(e) => handleInputChangeCompetition(index, 'leader', e.target.value)}
                      />

                      <div className={styles.cab_issue__diplomas_inputs_wrapper}>
                        <Select
                          options={placeOptions}
                          styles={customStyles}
                          placeholder="Место"
                          isSearchable={false}
                          onChange={(selectedOption) => handleSelectChangeCompetition(index, 'place', selectedOption)}
                          value={placeOptions.find(option => `${option.value}` === diploma.place)}
                          required

                        />
                        <Select
                          options={lvlOptions}
                          styles={customStyles}
                          placeholder="Тип конкурса"
                          isSearchable={false}
                          onChange={(selectedOption) => handleSelectChangeCompetition(index, 'level', selectedOption)}
                          value={lvlOptions.find(option => option.value === diploma.level)}
                        />
                        <label className={styles.cab_issue__diplomas_date_label}>
                          <span>Дата участия:</span>
                          <input
                            className={globalStyles.cab_input}
                            type="date"
                            name="date_of_participation"
                            placeholder="Дата участия"
                            value={diploma.participation_date}
                            onChange={(e) => handleInputChangeCompetition(index, 'participation_date', e.target.value)}
                          />
                        </label>
                      </div>

                      <input
                        className={globalStyles.cab_input}
                        type="text"
                        placeholder="Номинация (напр. Рисунок)"
                        value={diploma.nomination}
                        onChange={(e) => handleInputChangeCompetition(index, 'nomination', e.target.value)}
                      />

                      <input
                        className={globalStyles.cab_input}
                        type="text"
                        placeholder="Название работы"
                        value={diploma.project_name}
                        onChange={(e) => handleInputChangeCompetition(index, 'project_name', e.target.value)}
                      />

                    </div>


                  ) : (
                    <div className={styles.cab_issue__diplomas_inputs}>
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="ФИО руководителя"
                        value={diploma.full_name}
                        onChange={(e) => {
                          handleInputChangeCompetition(index, 'full_name', e.target.value);
                        }}
                        required
                      />
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="Название учреждения"
                        value={diploma.institution_name}
                        onChange={(e) => handleInputChangeCompetition(index, 'institution_name', e.target.value)}
                        required

                      />
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="Населенный пункт"
                        value={diploma.locality}
                        onChange={(e) => handleInputChangeCompetition(index, 'locality', e.target.value)}
                        required

                      />

                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="ФИО участника"
                        value={diploma.leader}
                        onChange={(e) => handleInputChangeCompetition(index, 'leader', e.target.value)}
                        required

                      />

                      <div className={styles.cab_issue__diplomas_inputs_wrapper}>
                        <Select
                          options={placeOptions}
                          styles={customStyles}
                          placeholder="Место"
                          isSearchable={false}
                          onChange={(selectedOption) => handleSelectChangeCompetition(index, 'place', selectedOption)}
                          value={placeOptions.find(option => `${option.value}` === diploma.place)}
                          required

                        />
                        <Select
                          options={lvlOptions}
                          styles={customStyles}
                          placeholder="Тип конкурса"
                          isSearchable={false}
                          onChange={(selectedOption) => handleSelectChangeCompetition(index, 'level', selectedOption)}
                          value={lvlOptions.find(option => option.value === diploma.level)}
                        />
                        <label className={styles.cab_issue__diplomas_date_label}>
                          <span>Дата участия:</span>
                          <input
                            className={globalStyles.cab_input}
                            type="date"
                            name="date_of_participation"
                            placeholder="Дата участия"
                            value={diploma.participation_date}
                            onChange={(e) => handleInputChangeCompetition(index, 'participation_date', e.target.value)}
                          />
                        </label>
                      </div>

                      <input
                        className={globalStyles.cab_input}
                        type="text"
                        placeholder="Номинация (напр. Рисунок)"
                        value={diploma.nomination}
                        onChange={(e) => handleInputChangeCompetition(index, 'nomination', e.target.value)}
                      />

                      <input
                        className={globalStyles.cab_input}
                        type="text"
                        placeholder="Название работы"
                        value={diploma.project_name}
                        onChange={(e) => handleInputChangeCompetition(index, 'project_name', e.target.value)}
                      />

                    </div>
                  )}



                  <div className={styles.cab_issue__diplomas_btns}>
                    <button
                      className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__diplomas_btn} ${styles.cab_issue__diplomas_btn_red}`}
                      onClick={(e) => handleRemoveDiplomaCompetition(e, index)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.cab_issue__diplomas_btns}>
              <button
                className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__diplomas_btn}`}
              >Получить диплом</button>
              <button
                className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__diplomas_btn} ${styles.cab_issue__diplomas_btn_add}`}
                onClick={handleAddDiplomaCompetition}
              >
                Добавить еще один диплом
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.7019 0.79248L9.7019 17.3887" stroke="#2D2323" strokeWidth="1.47522" strokeLinecap="round" />
                  <path d="M1.40381 9.09058L18 9.09058" stroke="#2D2323" strokeWidth="1.47522" strokeLinecap="round" />
                </svg>
              </button>
            </div>


          </form>
        }
        {currentContent === 3 &&
          <form className={styles.cab_issue__content} onSubmit={(e) => { handleSubmit(e, formDataOlympiads) }}>
            <h3 className={styles.cab_issue__content_title}>Впишите в поля ввода необходимые личные данные об участнике</h3>

            {formDataOlympiads.map((diploma, index) => (
              <div className={styles.cab_issue__diplomas} key={index}>
                <div className={styles.cab_issue__diplomas_previews}>
                  {docsVariationsTemplates.map((variation, variationIndex) => (
                    <img
                      className={styles.cab_issue__img_preview}
                      src={variation.preview}
                      width={65}
                      height={91}
                      alt=""
                      key={variationIndex}
                      onClick={() => {
                        setCurrentCompetitionPreviews(prev => ({
                          ...prev,
                          [index]: variation.preview  // Обновляем превью только для текущего элемента formDataCompetition
                        }));

                        handlePreviewChangeOlympiads(index, 'template', variation.id);
                      }}
                    />
                  ))}

                  <button className={`${globalStyles.btn_reset} ${styles.cab_issue__diplomas_previews_btn}`} type="button"
                    onClick={() => {
                      setDocsVariationsIndex(index);
                      setIsFirstModalOpen(true);
                    }}
                  >Показать все</button>
                </div>

                <div className={styles.cab_issue__diplomas_preview_wrapper}>
                  <img
                    src={
                      currentCompetitionPreviews[index] // Проверяем, есть ли превью для текущего элемента formDataCompetition
                        ? currentCompetitionPreviews[index]
                        : docsVariationsTemplates.length > 0
                          ? docsVariationsTemplates[0].preview
                          : ''
                    }
                    alt=""
                    width={334}
                    height={472}
                  />


                  {docsVariationsTemplates.length > 0 && (

                    formDataOlympiads[index].for_whom === 'PARTICIPANT' ? (
                      <div className={styles.cab_issue__diplomas_preview_text}>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          Награждается
                          <span>{diploma.full_name.length === 0 ? 'Фамилия Имя Отчество' : diploma.full_name}</span>
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.institution_name.length === 0 ? 'Название учреждения' : diploma.institution_name}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.locality.length === 0 ? 'Населенный пункт' : diploma.locality}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.place == '4' ? (
                            <span>Участник</span>
                          ) : (
                            <span>Победитель ({diploma.place} место)</span>
                          )}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {getGenitiveLabel(lvlOptionsOlympiad, diploma.level)} интернет-олимпиады "Росмедаль"
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          Название олимпиады: {diploma.nomination}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.leader.length === 0 ? '' : diploma.leader}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          Номер документа: {currentTagOfDoc}{Number(currentNumberOfDoc) + index}
                        </div>
                      </div>
                    ) : (
                      <div className={styles.cab_issue__diplomas_preview_text}>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          Награждается
                          <span>{diploma.full_name.length === 0 ? 'Фамилия Имя Отчество руководителя' : diploma.full_name}</span>
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.institution_name.length === 0 ? 'Название учреждения' : diploma.institution_name}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.locality.length === 0 ? 'Населенный пункт' : diploma.locality}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          за подготовку
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          <span>{diploma.leader.length === 0 ? 'Фамилия Имя Отчество участника' : diploma.leader}</span>
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {diploma.place == '4' ? (
                            <span>Участник</span>
                          ) : (
                            <span>Победитель ({diploma.place} место)</span>
                          )}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          {getGenitiveLabel(lvlOptionsOlympiad, diploma.level)} интернет-олимпиады "Росмедаль"
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          Название олимпиады: {diploma.nomination}
                        </div>
                        <div className={styles.cab_issue__diplomas_preview_title}>
                          Номер документа: {currentTagOfDoc}{Number(currentNumberOfDoc) + index}
                        </div>
                      </div>
                    )


                  )}

                  <div className={styles.cab_issue__diplomas_preview_date}>
                    <div className={styles.cab_issue__diplomas_preview_title}>
                      {formatDate(diploma.participation_date)}
                    </div>
                  </div>
                  <div className={styles.cab_issue__diplomas_preview_watermark}></div>
                  <div className={styles.cab_issue__diplomas_preview_qr}>
                    <QRCodeComponent url={qrUrl} />
                  </div>
                </div>

                <div className={styles.cab_issue__diplomas_content}>
                  <div className={styles.cab_issue__diplomas_checkboxes}>
                    <label className={styles.cab_issue__diplomas_label_wrapper}>
                      <div className={`${styles.cab_issue__diplomas_checkbox} ${formDataOlympiads[index].for_whom === 'PARTICIPANT' ? styles.cab_issue__diplomas_checkbox_active : ''}`}>
                        <input
                          type="radio"
                          name={`for_whom_${index}`}
                          checked={formDataOlympiads[index].for_whom === 'PARTICIPANT'}
                          onChange={() => handleInputChange(index, 'for_whom', 'PARTICIPANT')}
                        />
                      </div>
                      <span>Участнику</span>
                    </label>
                    <label className={styles.cab_issue__diplomas_label_wrapper}>
                      <div className={`${styles.cab_issue__diplomas_checkbox} ${formDataOlympiads[index].for_whom === 'LEADER' ? styles.cab_issue__diplomas_checkbox_active : ''}`}>
                        <input
                          type="radio"
                          name={`for_whom_${index}`}
                          checked={formDataOlympiads[index].for_whom === 'LEADER'}
                          onChange={() => {
                            handleInputChange(index, 'for_whom', 'LEADER');
                            handleInputChange(index, 'leader', '');
                          }
                          }
                        />
                      </div>
                      <span>Руководителю</span>
                    </label>
                  </div>
                  <label className={styles.cab_issue__diplomas_profile_checkbox}>
                    <input
                      type="checkbox"
                      checked={useProfileDataOlympiads[index] || false} // Используем значение из массива для конкретного индекса
                      onChange={() => handleProfileCheckboxChange(index)} // Обработка изменения для конкретного индекса
                    />
                    Использовать данные из личного профиля
                  </label>


                  {formDataOlympiads[index].for_whom === 'PARTICIPANT' ? (
                    <div className={styles.cab_issue__diplomas_inputs}>
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="ФИО участника"
                        value={diploma.full_name}
                        onChange={(e) => {
                          handleInputChange(index, 'full_name', e.target.value);
                        }}
                        required

                      />
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="Название учреждения"
                        value={diploma.institution_name}
                        onChange={(e) => handleInputChange(index, 'institution_name', e.target.value)}
                        required

                      />
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="Населенный пункт"
                        value={diploma.locality}
                        onChange={(e) => handleInputChange(index, 'locality', e.target.value)}
                        required

                      />
                      <Select
                        options={lvlOptionsOlympiad}
                        styles={customStyles}
                        placeholder="Уровень мероприятия"
                        isSearchable={false}
                        onChange={(selectedOption) => handleSelectChange(index, 'level', selectedOption)}
                        value={lvlOptionsOlympiad.find(option => option.value === diploma.level)}
                      />
                      <Select
                        options={placeOptions}
                        styles={customStyles}
                        placeholder="Место"
                        isSearchable={false}
                        onChange={(selectedOption) => handleSelectChange(index, 'place', selectedOption)}
                        value={placeOptions.find(option => `${option.value}` === diploma.place)}
                        required

                      />

                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="Руководитель"
                        value={diploma.leader}
                        onFocus={(e) => {
                          if (e.target.value === "") {
                            handleInputChange(index, 'leader', "Руководитель: ");
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "Руководитель: ") {
                            handleInputChange(index, 'leader', "");
                          }
                        }}
                        onChange={(e) => handleInputChange(index, 'leader', e.target.value)}
                      />


                      <input
                        className={`${globalStyles.cab_input}`}
                        type="text"
                        placeholder="Название олимпиады"
                        value={diploma.nomination}
                        onChange={(e) => handleInputChange(index, 'nomination', e.target.value)}
                        required

                      />

                      <label className={styles.cab_issue__diplomas_date_label}>
                        <span>Дата участия:</span>
                        <input
                          className={globalStyles.cab_input}
                          type="date"
                          name="date_of_participation"
                          placeholder="Дата участия"
                          value={diploma.participation_date}
                          onChange={(e) => handleInputChange(index, 'participation_date', e.target.value)}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className={styles.cab_issue__diplomas_inputs}>
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="ФИО руководителя"
                        value={diploma.full_name}
                        onChange={(e) => {
                          handleInputChange(index, 'full_name', e.target.value);
                        }}
                        required

                      />
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="Название учреждения"
                        value={diploma.institution_name}
                        onChange={(e) => handleInputChange(index, 'institution_name', e.target.value)}
                        required

                      />
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="Населенный пункт"
                        value={diploma.locality}
                        onChange={(e) => handleInputChange(index, 'locality', e.target.value)}
                        required

                      />
                      <input
                        className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                        type="text"
                        placeholder="ФИО участника"
                        value={diploma.leader}
                        onChange={(e) => handleInputChange(index, 'leader', e.target.value)}
                        required

                      />
                      <Select
                        options={lvlOptionsOlympiad}
                        styles={customStyles}
                        placeholder="Уровень мероприятия"
                        isSearchable={false}
                        onChange={(selectedOption) => handleSelectChange(index, 'level', selectedOption)}
                        value={lvlOptionsOlympiad.find(option => option.value === diploma.level)}
                      />
                      <Select
                        options={placeOptions}
                        styles={customStyles}
                        placeholder="Место"
                        isSearchable={false}
                        onChange={(selectedOption) => handleSelectChange(index, 'place', selectedOption)}
                        value={placeOptions.find(option => `${option.value}` === diploma.place)}
                        required

                      />

                      <input
                        className={`${globalStyles.cab_input}`}
                        type="text"
                        placeholder="Название олимпиады"
                        value={diploma.nomination}
                        onChange={(e) => handleInputChange(index, 'nomination', e.target.value)}
                        required

                      />

                      <label className={styles.cab_issue__diplomas_date_label}>
                        <span>Дата участия:</span>
                        <input
                          className={globalStyles.cab_input}
                          type="date"
                          name="date_of_participation"
                          placeholder="Дата участия"
                          value={diploma.participation_date}
                          onChange={(e) => handleInputChange(index, 'participation_date', e.target.value)}
                        />
                      </label>
                    </div>
                  )}



                  <div className={styles.cab_issue__diplomas_btns}>
                    <button
                      className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__diplomas_btn} ${styles.cab_issue__diplomas_btn_red}`}
                      onClick={(e) => handleRemoveDiploma(e, index)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.cab_issue__diplomas_btns}>
              <button
                className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__diplomas_btn}`}
              >Получить диплом</button>
              <button
                className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__diplomas_btn} ${styles.cab_issue__diplomas_btn_add}`}
                onClick={handleAddDiploma}
              >
                Добавить еще один диплом
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.7019 0.79248L9.7019 17.3887" stroke="#2D2323" strokeWidth="1.47522" strokeLinecap="round" />
                  <path d="M1.40381 9.09058L18 9.09058" stroke="#2D2323" strokeWidth="1.47522" strokeLinecap="round" />
                </svg>
              </button>
            </div>


          </form>
        }
        {currentContent === 4 &&
          <form className={styles.cab_issue__content} onSubmit={(e) => { handleSubmit(e, formDataThanks) }}>
            <h3 className={styles.cab_issue__content_title}>Впишите в поля ввода необходимые личные данные об участнике</h3>

            {formDataThanks.map((diploma, index) => (
              <div className={styles.cab_issue__diplomas} key={index}>
                <div className={styles.cab_issue__diplomas_previews}>
                  {docsVariationsTemplates.map((variation, variationIndex) => (
                    <img
                      className={styles.cab_issue__img_preview}
                      src={variation.preview}
                      width={65}
                      height={91}
                      alt=""
                      key={variationIndex}
                      onClick={() => {
                        setCurrentCompetitionPreviews(prev => ({
                          ...prev,
                          [index]: variation.preview  // Обновляем превью только для текущего элемента formDataCompetition
                        }));

                        handlePreviewChangeThanks(index, 'template', variation.id);
                      }}
                    />
                  ))}

                  <button className={`${globalStyles.btn_reset} ${styles.cab_issue__diplomas_previews_btn}`} type="button"
                    onClick={() => {
                      setDocsVariationsIndex(index);
                      setIsFirstModalOpen(true);
                    }}
                  >Показать все</button>
                </div>

                <div className={styles.cab_issue__diplomas_preview_wrapper}>
                  <img
                    src={
                      currentCompetitionPreviews[index] // Проверяем, есть ли превью для текущего элемента formDataCompetition
                        ? currentCompetitionPreviews[index]
                        : docsVariationsTemplates.length > 0
                          ? docsVariationsTemplates[0].preview
                          : ''
                    }
                    alt=""
                    width={334}
                    height={472}
                  />


                  {docsVariationsTemplates.length > 0 && (
                    <div className={`${styles.cab_issue__diplomas_preview_text} ${styles.cab_issue__diplomas_preview_text_thanks}`}>
                      <div className={styles.cab_issue__diplomas_preview_title}>
                        Награждается
                        <span>{diploma.full_name.length === 0 ? 'Фамилия Имя Отчество' : diploma.full_name}</span>
                      </div>
                      <div className={styles.cab_issue__diplomas_preview_title}>
                        {diploma.institution_name.length === 0 ? 'Название организации' : diploma.institution_name}
                      </div>
                      <div className={styles.cab_issue__diplomas_preview_title}>
                        {diploma.locality.length === 0 ? 'Населенный пункт' : diploma.locality}
                      </div>
                      <div className={styles.cab_issue__diplomas_preview_title}>
                        <span>{diploma.nomination.length === 0 ? 'Номинация' : diploma.nomination}</span>
                      </div>

                      <div className={styles.cab_issue__diplomas_preview_title}>
                        Номер благодарственного письма: {currentTagOfDoc}{Number(currentNumberOfDoc) + index}
                      </div>
                    </div>
                  )}

                  <div className={styles.cab_issue__diplomas_preview_date}>
                    <div className={styles.cab_issue__diplomas_preview_title}>
                      {formatDate(diploma.participation_date)}
                    </div>
                  </div>
                  <div className={styles.cab_issue__diplomas_preview_watermark}></div>
                  <div className={styles.cab_issue__diplomas_preview_qr}>
                    <QRCodeComponent url={qrUrl} />
                  </div>
                </div>

                <div className={styles.cab_issue__diplomas_content}>
                  <label className={styles.cab_issue__diplomas_profile_checkbox}>
                    <input
                      type="checkbox"
                      checked={useProfileDataThanks[index] || false} // Используем значение из массива для конкретного индекса
                      onChange={() => handleProfileCheckboxChangeThanks(index)} // Обработка изменения для конкретного индекса
                    />
                    Использовать данные из личного профиля
                  </label>

                  <div className={styles.cab_issue__diplomas_inputs}>
                    <input
                      className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                      type="text"
                      placeholder="ФИО"
                      value={diploma.full_name}
                      onChange={(e) => {
                        handleInputChangeThanks(index, 'full_name', e.target.value);
                      }}
                      required

                    />
                    <input
                      className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                      type="text"
                      placeholder="Название организации"
                      value={diploma.institution_name}
                      onChange={(e) => handleInputChangeThanks(index, 'institution_name', e.target.value)}
                      required

                    />
                    <input
                      className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                      type="text"
                      placeholder="Населенный пункт"
                      value={diploma.locality}
                      onChange={(e) => handleInputChangeThanks(index, 'locality', e.target.value)}
                      required

                    />

                    <Select
                      options={nominationOptions}
                      styles={customStyles}
                      placeholder="Номинации"
                      isSearchable={false}
                      onChange={(selectedOption) => handleInputChangeThanks(index, 'nomination', selectedOption ? selectedOption.value : '')}  // Если selectedOption null, сохраняем пустую строку
                      value={nominationOptions.find(option => option.value === diploma.nomination)}
                    />



                    <label className={styles.cab_issue__diplomas_date_label}>
                      <span>Дата участия:</span>
                      <input
                        className={globalStyles.cab_input}
                        type="date"
                        name="date_of_participation"
                        placeholder="Дата участия"
                        value={diploma.participation_date}
                        onChange={(e) => handleInputChangeThanks(index, 'participation_date', e.target.value)}
                      />
                    </label>
                  </div>
                  <div className={styles.cab_issue__diplomas_btns}>
                    <button
                      className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__diplomas_btn} ${styles.cab_issue__diplomas_btn_red}`}
                      onClick={(e) => handleRemoveDiplomaThanks(e, index)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.cab_issue__diplomas_btns}>
              <button
                className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__diplomas_btn}`}
              >Получить благодарственное письмо</button>
              <button
                className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__diplomas_btn} ${styles.cab_issue__diplomas_btn_add}`}
                onClick={handleAddDiplomaThanks}
              >
                Добавить еще одно благодарственное письмо
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.7019 0.79248L9.7019 17.3887" stroke="#2D2323" strokeWidth="1.47522" strokeLinecap="round" />
                  <path d="M1.40381 9.09058L18 9.09058" stroke="#2D2323" strokeWidth="1.47522" strokeLinecap="round" />
                </svg>
              </button>
            </div>


          </form>
        }
        {currentContent === 5 &&
          <form className={styles.cab_issue__content} onSubmit={(e) => { handleSubmit(e, formDataPublication) }}>
            <h3 className={styles.cab_issue__content_title}>Впишите в поля ввода необходимые личные данные об участнике</h3>

            {formDataPublication.map((diploma, index) => (
              <div className={styles.cab_issue__diplomas} key={index}>
                <div className={styles.cab_issue__diplomas_previews}>
                  {docsVariationsTemplates.map((variation, variationIndex) => (
                    <img
                      className={styles.cab_issue__img_preview}
                      src={variation.preview}
                      width={65}
                      height={91}
                      alt=""
                      key={variationIndex}
                      onClick={() => {
                        setCurrentCompetitionPreviews(prev => ({
                          ...prev,
                          [index]: variation.preview  // Обновляем превью только для текущего элемента formDataCompetition
                        }));

                        handlePreviewChangePublication(index, 'template', variation.id);
                      }}
                    />
                  ))}

                  <button className={`${globalStyles.btn_reset} ${styles.cab_issue__diplomas_previews_btn}`} type="button"
                    onClick={() => {
                      setDocsVariationsIndex(index);
                      setIsFirstModalOpen(true);
                    }}
                  >Показать все</button>
                </div>

                <div className={styles.cab_issue__diplomas_preview_wrapper}>
                  <img
                    src={
                      currentCompetitionPreviews[index] // Проверяем, есть ли превью для текущего элемента formDataCompetition
                        ? currentCompetitionPreviews[index]
                        : docsVariationsTemplates.length > 0
                          ? docsVariationsTemplates[0].preview
                          : ''
                    }
                    alt=""
                    width={334}
                    height={472}
                  />


                  {docsVariationsTemplates.length > 0 && (
                    <div className={`${styles.cab_issue__diplomas_preview_text} ${styles.cab_issue__diplomas_preview_text_media}`}>
                      <div className={styles.cab_issue__diplomas_preview_title}>
                        <span>{diploma.full_name.length === 0 ? 'Фамилия Имя Отчество' : diploma.full_name}</span>
                      </div>
                      <div className={styles.cab_issue__diplomas_preview_title}>
                        {diploma.institution_name.length === 0 ? 'Название учреждения' : diploma.institution_name}
                      </div>
                      <div className={styles.cab_issue__diplomas_preview_title}>
                        {diploma.locality.length === 0 ? 'Населенный пункт' : diploma.locality}
                      </div>
                      <div className={styles.cab_issue__diplomas_preview_title}>
                        {diploma.published_by} в Международном сетевом издании "Росмедаль" статью: {diploma.project_name.length === 0 ? '' : diploma.project_name}
                      </div>
                      <div className={styles.cab_issue__diplomas_preview_title}>
                        Номер свидетельства: {currentTagOfDoc}{Number(currentNumberOfDoc) + index}
                      </div>
                    </div>
                  )}

                  <div className={`${styles.cab_issue__diplomas_preview_date} ${styles.cab_issue__diplomas_preview_date_media}`}>
                    <div className={styles.cab_issue__diplomas_preview_title}>
                      {formatDate(diploma.participation_date)}
                    </div>
                  </div>
                  <div className={styles.cab_issue__diplomas_preview_watermark}></div>
                </div>

                <div className={styles.cab_issue__diplomas_content}>
                  <label className={styles.cab_issue__diplomas_profile_checkbox}>
                    <input
                      type="checkbox"
                      checked={useProfileDataPublication[index] || false} // Используем значение из массива для конкретного индекса
                      onChange={() => handleProfileCheckboxChangePublication(index)} // Обработка изменения для конкретного индекса
                    />
                    Использовать данные из личного профиля
                  </label>

                  <div className={styles.cab_issue__diplomas_inputs}>
                    <Select
                      options={publicationOptions}
                      styles={customStyles}
                      placeholder="Опубликовал"
                      isSearchable={false}
                      value={publicationOptions.find(option => option.value === diploma.published_by)}
                      onChange={(selectedOption) => {
                        console.log(selectedOption ? selectedOption.label.length : '');

                        handlePublishedChange(index, 'published_by', selectedOption ? selectedOption : '');

                      }}
                    />

                    <label className={`${styles.cab_issue__diplomas_date_label} ${styles.cab_issue__diplomas_date_label_publication}`}>
                      <span>Дата публикации:</span>
                      <input
                        className={globalStyles.cab_input}
                        type="date"
                        name="date_of_participation"
                        placeholder="Дата публикации статьи"
                        value={diploma.participation_date}
                        onChange={(e) => handleInputChangePublication(index, 'participation_date', e.target.value)}
                      />
                    </label>
                    <input
                      className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                      type="text"
                      placeholder="ФИО участника"
                      value={diploma.full_name}
                      onChange={(e) => handleInputChangePublication(index, 'full_name', e.target.value)}
                      required

                    />
                    <input
                      className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input} ${styles.cab_issue__diplomas_input_default}`}
                      type="text"
                      placeholder="Название учреждения"
                      value={diploma.institution_name}
                      onChange={(e) => handleInputChangePublication(index, 'institution_name', e.target.value)}
                      required

                    />
                    <input
                      className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input} ${styles.cab_issue__diplomas_input_default}`}
                      type="text"
                      placeholder="Населенный пункт"
                      value={diploma.locality}
                      onChange={(e) => handleInputChangePublication(index, 'locality', e.target.value)}
                      required

                    />
                    <input
                      className={`${globalStyles.cab_input} ${styles.cab_issue__diplomas_input}`}
                      type="text"
                      placeholder="Название работы"
                      value={diploma.project_name}
                      onChange={(e) => handleInputChangePublication(index, 'project_name', e.target.value)}
                      required

                    />

                  </div>
                  <div className={styles.cab_issue__diplomas_btns}>
                    <button
                      className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__diplomas_btn} ${styles.cab_issue__diplomas_btn_red}`}
                      onClick={(e) => handleRemoveDiplomaPublication(e, index)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.cab_issue__diplomas_btns}>
              <button
                className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__diplomas_btn}`}
              >Получить свидетельство</button>
              <button
                className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_issue__diplomas_btn} ${styles.cab_issue__diplomas_btn_add}`}
                onClick={handleAddDiplomaPublication}
              >
                Добавить еще одно свидетельство
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.7019 0.79248L9.7019 17.3887" stroke="#2D2323" strokeWidth="1.47522" strokeLinecap="round" />
                  <path d="M1.40381 9.09058L18 9.09058" stroke="#2D2323" strokeWidth="1.47522" strokeLinecap="round" />
                </svg>
              </button>
            </div>


          </form>
        }
      </>
    );
  };

  return (
    <section className={`${globalStyles.section_padding} ${styles.cab_issue}`}>
      <div className={globalStyles.container}>

        <div className={globalStyles.cab_container}>
          <CabAside />

          <div className={globalStyles.cab_content}>
            <h2 className={globalStyles.cab_title}>Оформить документ</h2>

            <div className={`${globalStyles.cab_block} ${styles.cab_issue__block}`}>
              <div className={globalStyles.cab_tabs_btns}>
                <div
                  className={`${globalStyles.cab_tabs_btn} ${currentContent === 1 ? globalStyles.cab_tabs_btn_active : ''} `}
                >1. Выберите тип документа</div>
                <div
                  className={`${globalStyles.cab_tabs_btn} ${currentContent !== 1 ? globalStyles.cab_tabs_btn_active : ''} `}
                >2. Заполните данные документа</div>
              </div>

              {renderContent()}
            </div>
          </div>
        </div>


        <Feedback />
      </div>

      <ModalComponent
        isOpen={isFirstModalOpen}
        onRequestClose={() => setIsFirstModalOpen(false)}
        content={
          <div className={styles.cab_issue__modal_previews}>
            {docsVariationsTemplates.map((variation, variationIndex) => (
              <img
                className={styles.cab_issue__img_preview}
                src={variation.preview}
                width={65}
                height={91}
                alt=""
                key={variationIndex}
                onClick={() => {
                  setCurrentCompetitionPreviews(prev => ({
                    ...prev,
                    [docsVariationsIndex]: variation.preview  // Обновляем превью только для текущего элемента formDataCompetition
                  }));
                }}
              />
            ))}
          </div>
        }
        customClassName=''
      />

    </section>
  );
};

export default CabIssue;
