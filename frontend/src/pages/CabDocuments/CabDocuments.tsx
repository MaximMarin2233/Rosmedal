import { useState, useEffect, useRef } from 'react';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import AuthService from '../../services/AuthService';
import globalStyles from '../../App.module.sass';
import cabIssueStyles from '../CabIssue/CabIssue.module.sass';
import styles from './CabDocuments.module.sass';
import Feedback from '../../components/Feedback/Feedback';
import CabAside from '../../components/CabAside/CabAside';
import QRCodeComponent from '../../components/QRCodeComponent/QRCodeComponent';

import CabIssueDiplom from '../../assets/cab-issue/cab-issue-diplom.png';
import CabIssuePublication from '../../assets/cab-issue/cab-issue-publication-bigger.png';
import CabIssueThanks from '../../assets/cab-issue/cab-issue-thanks-bigger.png';

interface IDocsVariations {
  id: number;
  price: string;
  tag: string;
  title: string;
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

interface FormData {
  balance: string;
  bonus_balance: string;
}

const CabDocuments = () => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = AuthService.getAccessToken();

  const [docsVariations, setDocsVariations] = useState<IDocsVariations[]>([]);
  const [documents, setDocuments] = useState<IDocument | null>(null);
  const [paidDocuments, setPaidDocuments] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [height, setHeight] = useState<number>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openIndex2, setOpenIndex2] = useState<number | null>(null);
  const [height2, setHeight2] = useState<number>(0);
  const contentRefs2 = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch documents and variations
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

    const fetchDocsVariations = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/docs/variations`);
        const data = await response.json();
        setDocsVariations(data.results);
      } catch (error) {
        console.error('Error fetching document variations:', error);
      }
    };

    fetchDocs();
    fetchDocsVariations();
  }, [token]);

  // Helper function to find the price for a document variation
  const getDocumentPrice = (variationId: number): string => {
    const variation = docsVariations.find(v => v.id === variationId);
    return variation ? variation.price : 'N/A';
  };

  // Filter documents based on paid/unpaid status
  const unpaidDocuments = documents?.results.filter(doc => !doc.is_paid) || [];
  const paidDocs = documents?.results.filter(doc => doc.is_paid) || [];

  // Define accordion items for unpaid documents
  const accordionItemsUnpaid = [
    {
      id: 1,
      question: 'Дипломы',
      documents: unpaidDocuments?.filter(doc => doc.variation === 1 || doc.variation === 4) || [], // Diplomas
    },
    {
      id: 2,
      question: 'Публикации',
      documents: unpaidDocuments?.filter(doc => doc.variation === 3) || [], // Publications
    },
    {
      id: 3,
      question: 'Благодарственные письма',
      documents: unpaidDocuments?.filter(doc => doc.variation === 2) || [], // Thank-you letters
    },
  ];

  const [flag, setFlag] = useState(true);
  const [flag2, setFlag2] = useState(true);
  const [flag3, setFlag3] = useState(true);

  const [flag4, setFlag4] = useState(true);
  const [flag5, setFlag5] = useState(true);
  const [flag6, setFlag6] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      openCurrentAccordion();
    }, 500)
  }, [unpaidDocuments]);

  useEffect(() => {
    if (flag || flag2 || flag3) {
      openCurrentAccordion();
    }
  }, [flag, flag2, flag3]);

  useEffect(() => {
    if (flag4 || flag5 || flag6) {
      openCurrentAccordion2();
    }
  }, [flag4, flag5, flag6]);

  const openCurrentAccordion = () => {
    if (unpaidDocuments?.some(doc => doc.variation === 2) && flag3) {
      handleAccordionClick(2);
      setFlag3(false);
    }
    if (unpaidDocuments?.some(doc => doc.variation === 3) && flag2) {
      handleAccordionClick(1);
      setFlag2(false);
    }
    if (unpaidDocuments?.some(doc => doc.variation === 1 || doc.variation === 4) && flag) {
      handleAccordionClick(0);
      setFlag(false);
    }
  };

  const openCurrentAccordion2 = () => {
    // Проверяем документы с variation === 2
    if (paidDocs?.some((doc) => doc.variation === 2) && flag6) {
      handleAccordionClick2(2);
      setFlag6(false); // Сбрасываем флаг
      return; // Прекращаем выполнение, чтобы другие условия не выполнялись
    }

    // Проверяем документы с variation === 3
    if (paidDocs?.some((doc) => doc.variation === 3) && flag5) {
      handleAccordionClick2(1);
      setFlag5(false); // Сбрасываем флаг
      return; // Прекращаем выполнение
    }

    // Проверяем документы с variation === 1 или variation === 4
    if (paidDocs?.some((doc) => doc.variation === 1 || doc.variation === 4) && flag4) {
      handleAccordionClick2(0);
      setFlag4(false); // Сбрасываем флаг
      return; // Прекращаем выполнение
    }
  };


  // Define accordion items for paid documents
  const accordionItemsPaid = [
    {
      id: 1,
      question: 'Дипломы',
      documents: paidDocs?.filter(doc => doc.variation === 1 || doc.variation === 4) || [], // Diplomas
      img: CabIssueDiplom
    },
    {
      id: 2,
      question: 'Публикации',
      documents: paidDocs?.filter(doc => doc.variation === 3) || [], // Publications
      img: CabIssuePublication
    },
    {
      id: 3,
      question: 'Благодарственные письма',
      documents: paidDocs?.filter(doc => doc.variation === 2) || [], // Thank-you letters
      img: CabIssueThanks
    },
  ];

  const handleAccordionClick = (index: number) => {
    if (window.innerWidth <= 575.98) {
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }

    if (openIndex === index) {
      setOpenIndex(null);
      setHeight(0);
    } else {
      setOpenIndex(index);
      if (contentRefs.current[index]) {
        setHeight(contentRefs.current[index]!.scrollHeight);
      }
    }
  };

  const handleAccordionClick2 = (index: number) => {
    if (window.innerWidth <= 575.98) {
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }

    if (openIndex2 === index) {
      setOpenIndex2(null);
      setHeight2(0);
    } else {
      setOpenIndex2(index);
      if (contentRefs2.current[index]) {
        setHeight2(contentRefs2.current[index]!.scrollHeight);
      }
    }
  };

  useEffect(() => {
    if (openIndex !== null && contentRefs.current[openIndex]) {
      setHeight(contentRefs.current[openIndex]!.scrollHeight);
    }
  }, [openIndex]);

  useEffect(() => {
    if (openIndex2 !== null && contentRefs2.current[openIndex2]) {
      setHeight2(contentRefs2.current[openIndex2]!.scrollHeight);
    }
  }, [openIndex2]);

  const [selectedDocs, setSelectedDocs] = useState<IDocumentInf[]>([]);

  const handleDocumentSelect = (doc: IDocumentInf, question: string) => {
    setSelectedDocs(prevSelectedDocs => {
      if (prevSelectedDocs?.find(selected => selected.id === doc.id)) {
        return prevSelectedDocs.filter(selected => selected.id !== doc.id);
      } else {
        return [...prevSelectedDocs, { ...doc, question }];
      }
    });
  };

  const [currentPromo, setCurrentPromo] = useState('');

  const [payFromBalance, setPayFromBalance] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      use_bonus: bonusChecked, // Always using bonus
      documents: selectedDocs.map(doc => doc.id), // Only sending document IDs
      from_balance: payFromBalance,
      ...(currentPromo.length > 0 && { promotional_code: currentPromo }),
    };

    // Отправка обновленных данных на сервер
    fetch(`${apiBaseUrl}/api/v1/cab/documents/purchase`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => {
        if (response.status === 400) {
          return response.json().then(error => {
            // Проверка на конкретные сообщения об ошибках
            if (error.message.error === 'insufficient funds') {
              alert('Недостаточно средств на балансе!');
            } else if (error.message === 'cost is zero') {
              alert('Выберите оплату через кошелек!');
            } else {
              alert('Ошибка: ' + error.message);
            }
            throw new Error(error.message.error || error.message); // Прерываем выполнение
          });
        }
        return response.json(); // Если не 400, преобразуем ответ в JSON
      })
      .then(data => {
        console.log('Success:', data);

        if (data.confirmation) {
          window.open(data.confirmation.confirmation_url, '_blank');
          alert('Завершите оплату через ЮKassa!');
        } else {
          alert('Документы оплачены!');
          window.location.reload();
        }
      })
      .catch((error: Error) => {
        // Обработка других ошибок
        console.error('Error:', error);
        if (!error.message.includes('insufficient funds') && !error.message.includes('cost is zero')) {
          alert('Произошла ошибка. Попробуйте еще раз.');
        }
      });
  };


  const [formData, setFormData] = useState<FormData>({
    balance: '',
    bonus_balance: '',
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

        setFormData({
          balance: data.balance !== null ? data.balance : '',
          bonus_balance: data.bonus_balance !== null ? data.bonus_balance : '',
        });


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    if (activeIndex === index) {
      // Если нажали на активный элемент, сбрасываем активность
      setActiveIndex(null);
    } else {
      // Назначаем активность на новый элемент
      setActiveIndex(index);
    }
  };

  const handleOutsideClick = (event) => {
    // Если кликнули вне элементов, сбрасываем активность
    if (activeIndex !== null && !event.target.classList.contains('item')) {
      setActiveIndex(null);
    }
  };

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

  const handleDeleteDoc = (e, id) => {
    e.preventDefault();

    const docDeleteCheck = confirm('Вы уверены, что хотите удалить документ?');

    if (!docDeleteCheck) {
      return;
    }

    // Отправка DELETE-запроса на сервер
    fetch(`${apiBaseUrl}/api/v1/cab/documents/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status === 404) {
          alert('Документ не найден!');
          return;
        } else if (response.status === 204) {
          // Если успешный ответ 204, обновляем страницу
          alert('Документ успешно удалён');
          window.location.reload();
          return;
        }
        return response.json(); // Преобразование ответа в JSON в других случаях
      })
      .then(data => {
        if (data) {
          console.log(data);
        }
      })
      .catch((error) => {
        console.error('Error:', error); // Общая обработка ошибок
      });
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

  const [yookassaChecked, setYookassaChecked] = useState(true);
  const [balanceChecked, setBalanceChecked] = useState(false);
  const [bonusChecked, setBonusChecked] = useState(false);

  // useEffect(() => {
  //   setOpenIndex(null);
  //   setHeight(0);
  // }, [paidDocuments]);

  const contentRefsDocs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const [selectedDocsPdf, setSelectedDocsPdf] = useState<Set<string>>(new Set());

  // Функция для скачивания PDF
  const handleDownloadPDF = async (docId: number, uniqueIndex: string, docVariation: string) => {
    const element = contentRefsDocs.current.get(uniqueIndex);

    if (!element) {
      alert('Содержимое не найдено.');
      return;
    }

    // Генерация PDF из содержимого
    const canvas = await html2canvas(element, {
      scale: 10,
      useCORS: true,
      logging: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pageWidth = 215; // A4 в мм
    const pageHeight = 302; // A4 в мм

    const pageWidthMedia = 297; // A4 в мм
    const pageHeightMedia = 384; // A4 в мм

    const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    const imgScaledWidth = imgWidth * scale;
    const imgScaledHeight = imgHeight * scale;

    const scaleMedia = Math.min(pageWidthMedia / imgWidth, pageHeightMedia / imgHeight);
    const imgScaledWidthMedia = imgWidth * scaleMedia;
    const imgScaledHeightMedia = imgHeight * scaleMedia;

    // Создаем объект jsPDF с параметрами конструктора
    let doc: jsPDF;

    if (docVariation === '3') {
      // Если требуется альбомная ориентация (landscape)
      doc = new jsPDF({
        orientation: "landscape", // Альбомная ориентация
        unit: "mm", // Единица измерения (миллиметры)
        format: 'a4', // Формат страницы A4
      });

      // Добавляем изображение с нужными размерами
      doc.addImage(imgData, 'PNG', 0, 0, imgScaledWidthMedia, imgScaledHeightMedia); // меняем местами размеры
    } else {
      // Если не требуется поворот (книжная ориентация)
      doc = new jsPDF({
        orientation: "portrait", // Книжная ориентация
        unit: "mm", // Единица измерения (миллиметры)
        format: 'a4', // Формат страницы A4
      });

      // Добавляем изображение с нужными размерами
      doc.addImage(imgData, 'PNG', 0, 0, imgScaledWidth, imgScaledHeight);
    }

    // Скачиваем PDF
    doc.save(`document_${docId}.pdf`);
  };
  const handleCheckboxChange = (docId: string) => {
    setSelectedDocsPdf(prev => {
      const newSelectedDocs = new Set(prev);
      if (newSelectedDocs.has(docId)) {
        newSelectedDocs.delete(docId); // Убираем из выбранных
      } else {
        newSelectedDocs.add(docId); // Добавляем в выбранные
      }
      return newSelectedDocs;
    });
  };

  // Функция для скачивания всех выбранных документов
  const handleDownloadSelected = async () => {
    if (selectedDocsPdf.size === 0) {
      alert('Пожалуйста, выберите хотя бы один документ.');
      return;
    }

    // Скачиваем каждый выбранный документ
    for (let docId of selectedDocsPdf) {
      // Нужно найти соответствующий документ по его ID и индексу
      for (let accordionIndex = 0; accordionIndex < accordionItemsPaid.length; accordionIndex++) {
        const item = accordionItemsPaid[accordionIndex];
        for (let docIndex = 0; docIndex < item.documents.length; docIndex++) {
          const doc = item.documents[docIndex];
          if (doc.id === Number(docId)) {
            const uniqueIndex = `${accordionIndex}_${docIndex}`;
            await handleDownloadPDF(Number(docId), uniqueIndex, `${doc.variation}`); // Скачиваем документ
          }
        }
      }
    }
  };

  const formatParticipationDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  return (
    <section className={`${globalStyles.section_padding} ${styles.cab_profile}`} onClick={handleOutsideClick}>
      <div className={globalStyles.container}>
        <div className={globalStyles.cab_container}>
          <CabAside />
          <div className={globalStyles.cab_content}>
            <h2 className={globalStyles.cab_title}>Мои документы</h2>
            <div className={globalStyles.cab_blocks}>
              <div className={`${globalStyles.cab_block} ${styles.cab_documents__block}`}>
                <div className={globalStyles.cab_tabs_btns}>
                  <button
                    className={`${globalStyles.btn_reset} ${globalStyles.cab_tabs_btn} ${!paidDocuments ? globalStyles.cab_tabs_btn_active : ''}`}
                    onClick={() => {
                      setPaidDocuments(false);

                      if (openIndex === null) {
                        setFlag(true);
                        setFlag2(true);
                        setFlag3(true);


                        setTimeout(() => {
                          openCurrentAccordion();
                        }, 300);
                      }
                    }}
                  >
                    Неоплаченные документы
                  </button>
                  <button
                    className={`${globalStyles.btn_reset} ${globalStyles.cab_tabs_btn} ${paidDocuments ? globalStyles.cab_tabs_btn_active : ''}`}
                    onClick={() => {
                      setPaidDocuments(true);

                      if (openIndex2 === null) {
                        setFlag4(true);
                        setFlag5(true);
                        setFlag6(true);

                        setTimeout(() => {
                          openCurrentAccordion2();
                        }, 300);
                      }
                    }}
                  >
                    Оплаченные документы
                  </button>
                </div>

                {paidDocuments ? (
                  <div>
                    <h3 className={styles.cab_documents__subtitle}>Ваши оплаченные документы</h3>
                    <ul className={`${globalStyles.list_reset} ${globalStyles.accordion__list} ${styles.cab_documents__accordion_list} ${styles.cab_documents__accordion_list_paid}`}>
                      {accordionItemsPaid.map((item, index) => (
                        <li key={index} className={openIndex2 === index ? 'open' : ''}>
                          <button
                            className={`${globalStyles.btn_reset} ${globalStyles.accordion__control} ${styles.cab_documents__accordion_control}`}
                            aria-expanded={openIndex2 === index}
                            onClick={() => handleAccordionClick2(index)}
                          >
                            <span className={`${globalStyles.accordion__title} ${styles.cab_documents__accordion_title}`}>
                              {item.question}
                            </span>
                          </button>
                          <div
                            className={`${globalStyles.accordion__content} ${styles.cab_documents__accordion_content}`}
                            aria-hidden={openIndex2 !== index}
                            ref={el => contentRefs2.current[index] = el}
                            style={{
                              maxHeight: openIndex2 === index ? height2 : 0,
                              opacity: openIndex2 === index ? 1 : 0,
                              padding: openIndex2 === index ? '30px 0 0' : '0',
                              transition: openIndex2 === index ? 'max-height 0.3s ease, opacity 0.3s ease' : 'max-height 0.3s ease',
                            }}
                          >
                            <div className={styles.cab_documents__accordion_inner}>
                              <div className={`${styles.cab_documents__accordion_inner_list} ${styles.cab_documents__accordion_inner_list_paid}`}>
                                {item.documents.map((doc, docIndex) => {
                                  const uniqueIndex = `${index}_${docIndex}`;
                                  const isChecked = selectedDocsPdf.has(`${doc.id}`);
                                  return (
                                    <div key={docIndex} className={styles.cab_documents__diplom_wrapper}>
                                      <div className={styles.cab_documents__diplom_check}>
                                        <input
                                          type="checkbox"
                                          checked={isChecked} // Отображаем, выбран ли чекбокс
                                          onChange={() => handleCheckboxChange(`${doc.id}`)} // Обработчик изменения
                                        />
                                        <button className={`${globalStyles.btn_reset} ${styles.cab_documents__delete_btn}`}
                                          onClick={(e) => handleDeleteDoc(e, doc.id)}
                                        ></button>
                                      </div>



                                      <div
                                        ref={(el) => contentRefsDocs.current.set(uniqueIndex, el)}
                                        className={`${cabIssueStyles.cab_issue__diplomas_preview_wrapper} ${activeIndex === docIndex ? globalStyles.activeImgScale : ''}`}
                                        onClick={(e) => {
                                          e.stopPropagation(); // Предотвращаем всплытие события
                                          handleClick(docIndex);
                                        }}
                                      >
                                        <img src={docsVariations.find(obj => obj.id === doc.variation)?.templates.find(obj => obj.id === doc.template)?.preview} alt="Diplom" width={224}
                                        />

                                        {doc.variation === 1 && (
                                          // <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_media}`}>
                                          //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          //     <span>{doc.full_name}</span>
                                          //   </div>
                                          //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          //     {doc.institution_name}
                                          //   </div>
                                          //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          //     {doc.locality}
                                          //   </div>
                                          //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          //     Статью: {doc.project_name}
                                          //   </div>
                                          //   {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          //                             Номер свидетельства: {currentNumberOfDoc}
                                          //                           </div> */}
                                          // </div>

                                          doc.for_whom === 'PARTICIPANT' ? (
                                            <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Награждается
                                                <span>{doc.full_name}</span>
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.institution_name}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.locality}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.place === 4 ? (
                                                  <span>Участник</span>
                                                ) : (
                                                  <span>Победитель ({doc.place} место)</span>
                                                )}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {getGenitiveLabel(lvlOptions, doc.level)} конкурса
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Номинация: {doc.nomination}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                <span>Работа: {doc.project_name}</span>
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.leader.length === 0 ? '' : doc.leader}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Номер документа: {`${docsVariations.find(obj => obj.id === doc.variation)?.tag}${doc.id}`}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Награждается
                                                <span>{doc.full_name}</span>
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.institution_name}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.locality}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                за подготовку
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                <span>{doc.leader}</span>
                                              </div>
                                              {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                <span>{diploma.full_name_participant.length === 0 ? 'Фамилия Имя Отчество участника' : diploma.full_name_participant}</span>
                                              </div> */}
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.place === 4 ? (
                                                  <span>Участник</span>
                                                ) : (
                                                  <span>Победитель ({doc.place} место)</span>
                                                )}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {getGenitiveLabel(lvlOptions, doc.level)} конкурса
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Номинация: {doc.nomination}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                <span>Работа: {doc.project_name}</span>
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Номер документа: {`${docsVariations.find(obj => obj.id === doc.variation)?.tag}${doc.id}`}
                                              </div>
                                            </div>
                                          )
                                        )}

                                        {doc.variation === 4 && (
                                          doc.for_whom === 'PARTICIPANT' ? (
                                            <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Награждается
                                                <span>{doc.full_name}</span>
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.institution_name}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.locality}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.place === 4 ? (
                                                  <span>Участник</span>
                                                ) : (
                                                  <span>Победитель ({doc.place} место)</span>
                                                )}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {getGenitiveLabel(lvlOptionsOlympiad, doc.level)} интернет-олимпиады "Росмедаль"
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Название олимпиады: {doc.nomination}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.leader.length === 0 ? '' : doc.leader}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Номер документа: {`${docsVariations.find(obj => obj.id === doc.variation)?.tag}${doc.id}`}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Награждается
                                                <span>{doc.full_name}</span>
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.institution_name}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.locality}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                за подготовку
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                <span>{doc.leader}</span>
                                              </div>
                                              {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                <span>{diploma.full_name_participant.length === 0 ? 'Фамилия Имя Отчество участника' : diploma.full_name_participant}</span>
                                              </div> */}
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.place === 4 ? (
                                                  <span>Участник</span>
                                                ) : (
                                                  <span>Победитель ({doc.place} место)</span>
                                                )}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {getGenitiveLabel(lvlOptionsOlympiad, doc.level)} интернет-олимпиады "Росмедаль"
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Название олимпиады: {doc.nomination}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Номер документа: {`${docsVariations.find(obj => obj.id === doc.variation)?.tag}${doc.id}`}
                                              </div>
                                            </div>
                                          )
                                        )}

                                        {doc.variation === 2 && (
                                          <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_thanks}`}>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              Награждается
                                              <span>{doc.full_name}</span>
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {doc.institution_name}
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {doc.locality}
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              <span>{doc.nomination}</span>
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              Номер благодарственного письма: {`${docsVariations.find(obj => obj.id === doc.variation)?.tag}${doc.id}`}
                                            </div>
                                          </div>
                                        )}

                                        {doc.variation === 3 && (
                                          <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_media}`}>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              <span>{doc.full_name}</span>
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {doc.institution_name}
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {doc.locality}
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {doc.published_by} в Международном сетевом издании "Росмедаль" статью: {doc.project_name}
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              Номер свидетельства: {`${docsVariations.find(obj => obj.id === doc.variation)?.tag}${doc.id}`}
                                            </div>
                                          </div>
                                        )}




                                        {doc.variation === 3 ? (
                                          <div className={`${cabIssueStyles.cab_issue__diplomas_preview_date} ${cabIssueStyles.cab_issue__diplomas_preview_date_docs_media}`}>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {formatParticipationDate(doc.participation_date)}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className={`${cabIssueStyles.cab_issue__diplomas_preview_date} ${cabIssueStyles.cab_issue__diplomas_preview_date_docs_competition}`}>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {formatParticipationDate(doc.participation_date)}
                                            </div>
                                          </div>
                                        )}

                                        {doc.variation !== 3 && (
                                          <div className={`${cabIssueStyles.cab_issue__diplomas_preview_qr} ${cabIssueStyles.cab_issue__diplomas_preview_qr_docs}`}>
                                            <QRCodeComponent url={`${apiBaseUrl}/document-details/${doc.id}`} />
                                          </div>
                                        )}

                                      </div>


                                      <button className={`${globalStyles.btn_reset} ${styles.cab_documents__download_btn}`}
                                        onClick={() => handleDownloadPDF(doc.id, uniqueIndex, `${doc.variation}`)}
                                      >
                                        Скачать
                                        <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <g filter="url(#filter0_d_633_4428)">
                                            <path d="M3.03418 5.95839C3.03418 4.29566 4.38209 2.94775 6.04482 2.94775H24.7569C26.4197 2.94775 27.7676 4.29566 27.7676 5.95839V24.6705C27.7676 26.3332 26.4197 27.6812 24.7569 27.6812H6.04482C4.38209 27.6812 3.03418 26.3332 3.03418 24.6705V5.95839Z" fill="#EEE9DF" shape-rendering="crispEdges" />
                                            <path d="M6.04482 2.56129C4.16865 2.56129 2.64772 4.08223 2.64772 5.95839V24.6705C2.64772 26.5467 4.16865 28.0676 6.04482 28.0676H24.7569C26.6331 28.0676 28.154 26.5467 28.154 24.6705V5.95839C28.154 4.08223 26.6331 2.56129 24.7569 2.56129H6.04482Z" stroke="#7D8592" stroke-width="0.772919" shape-rendering="crispEdges" />
                                            <path d="M15.4018 10.4087V20.2198M15.4018 20.2198L19.081 16.5406M15.4018 20.2198L11.7227 16.5406" stroke="#2D2323" stroke-width="0.927502" stroke-linecap="round" stroke-linejoin="round" />
                                          </g>
                                          <defs>
                                            <filter id="filter0_d_633_4428" x="0.261719" y="0.174805" width="30.2783" height="30.2793" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                              <feOffset />
                                              <feGaussianBlur stdDeviation="1" />
                                              <feComposite in2="hardAlpha" operator="out" />
                                              <feColorMatrix type="matrix" values="0 0 0 0 0.607843 0 0 0 0 0.12549 0 0 0 0 0.184314 0 0 0 0.1 0" />
                                              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_633_4428" />
                                              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_633_4428" result="shape" />
                                            </filter>
                                          </defs>
                                        </svg>
                                      </button>


                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`${globalStyles.btn_reset} ${styles.cab_documents__download_all_btn}`}
                      onClick={handleDownloadSelected} // Скачиваем все выбранные документы
                    >
                      Скачать все выбранные документы
                    </button>
                  </div>
                ) : (
                  <div className={styles.cab_documents__documents_wrapper}>
                    <div>
                      <h3 className={styles.cab_documents__subtitle}>Выберите документы к оплате</h3>
                      <ul className={`${globalStyles.list_reset} ${globalStyles.accordion__list} ${styles.cab_documents__accordion_list}`}>
                        {accordionItemsUnpaid.map((item, index) => (
                          <li key={index} className={openIndex === index ? 'open' : ''}>
                            <button
                              className={`${globalStyles.btn_reset} ${globalStyles.accordion__control} ${styles.cab_documents__accordion_control}`}
                              aria-expanded={openIndex === index}
                              onClick={() => handleAccordionClick(index)}
                            >
                              <span className={`${globalStyles.accordion__title} ${styles.cab_documents__accordion_title}`}>
                                {item.question}
                              </span>
                            </button>
                            <div
                              className={`${globalStyles.accordion__content} ${styles.cab_documents__accordion_content}`}
                              aria-hidden={openIndex !== index}
                              ref={el => contentRefs.current[index] = el}
                              style={{
                                maxHeight: openIndex === index ? height : 0,
                                opacity: openIndex === index ? 1 : 0,
                                padding: openIndex === index ? '30px 0 0' : '0',
                                transition: openIndex === index ? 'max-height 0.3s ease, opacity 0.3s ease' : 'max-height 0.3s ease',
                              }}
                            >
                              <div className={styles.cab_documents__accordion_inner}>
                                <div className={styles.cab_documents__accordion_inner_list}>
                                  {item.documents.map((doc, docIndex) => (
                                    <div key={docIndex} className={styles.cab_documents__diplom_wrapper}>
                                      <div className={styles.cab_documents__diplom_check}>
                                        <input
                                          type="checkbox"
                                          onChange={() => handleDocumentSelect(doc, item.question)}
                                          checked={selectedDocs.some(selected => selected.id === doc.id)}
                                        />
                                        <button className={`${globalStyles.btn_reset} ${styles.cab_documents__delete_btn}`}
                                          onClick={(e) => handleDeleteDoc(e, doc.id)}
                                        ></button>
                                      </div>




                                      <div className={`${cabIssueStyles.cab_issue__diplomas_preview_wrapper} ${activeIndex === docIndex ? globalStyles.activeImgScale : ''}`}
                                        onClick={(e) => {
                                          e.stopPropagation(); // Предотвращаем всплытие события
                                          handleClick(docIndex);
                                        }}
                                      >
                                        <img src={docsVariations.find(obj => obj.id === doc.variation)?.templates.find(obj => obj.id === doc.template)?.preview} alt="Diplom" width={224}
                                        />

                                        {doc.variation === 1 && (
                                          // <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_media}`}>
                                          //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          //     <span>{doc.full_name}</span>
                                          //   </div>
                                          //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          //     {doc.institution_name}
                                          //   </div>
                                          //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          //     {doc.locality}
                                          //   </div>
                                          //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          //     Статью: {doc.project_name}
                                          //   </div>
                                          //   {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          //                             Номер свидетельства: {currentNumberOfDoc}
                                          //                           </div> */}
                                          // </div>

                                          doc.for_whom === 'PARTICIPANT' ? (
                                            <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Награждается
                                                <span>{doc.full_name}</span>
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.institution_name}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.locality}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.place === 4 ? (
                                                  <span>Участник</span>
                                                ) : (
                                                  <span>Победитель ({doc.place} место)</span>
                                                )}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {getGenitiveLabel(lvlOptions, doc.level)} конкурса
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Номинация: {doc.nomination}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                <span>Работа: {doc.project_name}</span>
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.leader.length === 0 ? '' : doc.leader}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Номер документа: {`${docsVariations.find(obj => obj.id === doc.variation)?.tag}${doc.id}`}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Награждается
                                                <span>{doc.full_name}</span>
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.institution_name}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.locality}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                за подготовку
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                <span>{doc.leader}</span>
                                              </div>
                                              {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                <span>{diploma.full_name_participant.length === 0 ? 'Фамилия Имя Отчество участника' : diploma.full_name_participant}</span>
                                              </div> */}
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.place === 4 ? (
                                                  <span>Участник</span>
                                                ) : (
                                                  <span>Победитель ({doc.place} место)</span>
                                                )}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {getGenitiveLabel(lvlOptions, doc.level)} конкурса
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Номинация: {doc.nomination}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                <span>Работа: {doc.project_name}</span>
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Номер документа: {`${docsVariations.find(obj => obj.id === doc.variation)?.tag}${doc.id}`}
                                              </div>
                                            </div>
                                          )
                                        )}

                                        {doc.variation === 4 && (
                                          doc.for_whom === 'PARTICIPANT' ? (
                                            <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Награждается
                                                <span>{doc.full_name}</span>
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.institution_name}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.locality}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.place === 4 ? (
                                                  <span>Участник</span>
                                                ) : (
                                                  <span>Победитель ({doc.place} место)</span>
                                                )}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {getGenitiveLabel(lvlOptionsOlympiad, doc.level)} интернет-олимпиады "Росмедаль"
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Название олимпиады: {doc.nomination}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.leader.length === 0 ? '' : doc.leader}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Номер документа: {`${docsVariations.find(obj => obj.id === doc.variation)?.tag}${doc.id}`}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Награждается
                                                <span>{doc.full_name}</span>
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.institution_name}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.locality}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                за подготовку
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                <span>{doc.leader}</span>
                                              </div>
                                              {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                <span>{diploma.full_name_participant.length === 0 ? 'Фамилия Имя Отчество участника' : diploma.full_name_participant}</span>
                                              </div> */}
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {doc.place === 4 ? (
                                                  <span>Участник</span>
                                                ) : (
                                                  <span>Победитель ({doc.place} место)</span>
                                                )}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                {getGenitiveLabel(lvlOptionsOlympiad, doc.level)} интернет-олимпиады "Росмедаль"
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Название олимпиады: {doc.nomination}
                                              </div>
                                              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                Номер документа: {`${docsVariations.find(obj => obj.id === doc.variation)?.tag}${doc.id}`}
                                              </div>
                                            </div>
                                          )
                                        )}

                                        {doc.variation === 2 && (
                                          <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_thanks}`}>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              Награждается
                                              <span>{doc.full_name}</span>
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {doc.institution_name}
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {doc.locality}
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              <span>{doc.nomination}</span>
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              Номер благодарственного письма: {`${docsVariations.find(obj => obj.id === doc.variation)?.tag}${doc.id}`}
                                            </div>
                                          </div>
                                        )}

                                        {doc.variation === 3 && (
                                          <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_media}`}>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              <span>{doc.full_name}</span>
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {doc.institution_name}
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {doc.locality}
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {doc.published_by} в Международном сетевом издании "Росмедаль" статью: {doc.project_name}
                                            </div>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              Номер свидетельства: {`${docsVariations.find(obj => obj.id === doc.variation)?.tag}${doc.id}`}
                                            </div>
                                          </div>
                                        )}




                                        {doc.variation === 3 ? (
                                          <div className={`${cabIssueStyles.cab_issue__diplomas_preview_date} ${cabIssueStyles.cab_issue__diplomas_preview_date_docs_media}`}>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {formatParticipationDate(doc.participation_date)}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className={`${cabIssueStyles.cab_issue__diplomas_preview_date} ${cabIssueStyles.cab_issue__diplomas_preview_date_docs_competition}`}>
                                            <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                              {formatParticipationDate(doc.participation_date)}
                                            </div>
                                          </div>
                                        )}
                                        <div className={cabIssueStyles.cab_issue__diplomas_preview_watermark}></div>

                                        {doc.variation !== 3 && (
                                          <div className={`${cabIssueStyles.cab_issue__diplomas_preview_qr} ${cabIssueStyles.cab_issue__diplomas_preview_qr_docs}`}>
                                            <QRCodeComponent url={`${apiBaseUrl}/document-details/${doc.id}`} />
                                          </div>
                                        )}

                                      </div>




                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {selectedDocs.length > 0 && (
                      <form className={styles.cab_documents__documents_price} onSubmit={handleSubmit}>
                        <div className={styles.cab_documents__documents_price_content}>
                          <h3 className={`${styles.cab_documents__subtitle} ${styles.cab_documents__subtitle_promo}`}>У вас на балансе {Math.floor(+formData.balance)} руб.</h3>
                          <h4 className={styles.cab_documents__promo_title}>Есть промокод?</h4>
                          <div className={styles.cab_documents__promo}>
                            <input className={styles.cab_documents__promo_input} type="text" placeholder='Введите промокод'
                              value={promo}
                              onChange={(e) => setPromo(e.target.value)}
                            />
                            <button className={`${globalStyles.btn_reset} ${styles.cab_documents__promo_btn}`} type='button'
                              onClick={handleCheckPromo}
                            >
                              Применить
                              <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.35572 2.94189L12.7499 8.09091M12.7499 8.09091L7.35572 13.2399M12.7499 8.09091L2.25 8.09091" stroke="white" stroke-width="1.40625" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </button>
                          </div>

                          <div className={styles.cab_documents__documents_inf_wrapper}>
                            {bonusChecked ? (
                              (() => {
                                const freeDocsCount = Math.floor(Number(formData.bonus_balance) / 100); // Количество бесплатных дипломов
                                let remainingFreeDocs = freeDocsCount; // Остаток бесплатных дипломов

                                return (
                                  <>
                                    {/* Обрабатываем выбранные документы с учетом бесплатных */}
                                    {selectedDocs.map((doc, index) => {
                                      // Условие: использовать бесплатный диплом или применять правило "каждый третий бесплатно"
                                      let price;
                                      if (remainingFreeDocs > 0) {
                                        price = 0; // Используем бесплатный диплом
                                        remainingFreeDocs--;
                                      } else {
                                        price = (index - freeDocsCount + 1) % 3 === 0 ? '0 (акция)' : getDocumentPrice(doc.variation);
                                      }

                                      return (
                                        <div key={`doc_${index}`} className={styles.cab_documents__documents_inf}>
                                          {doc.question}
                                          <span>№ {doc.id}</span>
                                          <span>{price} ₽</span>
                                        </div>
                                      );
                                    })}

                                    {/* Итоговая сумма с учетом использования бесплатных дипломов */}
                                    <div className={styles.cab_documents__documents_total}>
                                      К оплате:
                                      <span>
                                        {selectedDocs.reduce((total, doc, index) => {
                                          // Условие: учитывать бесплатные дипломы
                                          let price;
                                          if (index < freeDocsCount) {
                                            price = 0; // Бесплатные дипломы
                                          } else {
                                            const adjustedIndex = index - freeDocsCount; // Корректируем индекс после использования бесплатных
                                            price = (adjustedIndex + 1) % 3 === 0 ? 0 : parseFloat(getDocumentPrice(doc.variation));
                                          }
                                          return total + price;
                                        }, 0).toFixed(2)} ₽
                                      </span>
                                    </div>

                                    {discountPercentage > 0 && (
                                      <div className={styles.cab_documents__documents_total}>
                                        После применения скидки:
                                        <span>
                                          {(
                                            selectedDocs.reduce((total, doc, index) => {
                                              let price;
                                              if (index < freeDocsCount) {
                                                price = 0;
                                              } else {
                                                const adjustedIndex = index - freeDocsCount;
                                                price = (adjustedIndex + 1) % 3 === 0 ? 0 : parseFloat(getDocumentPrice(doc.variation));
                                              }
                                              return total + price;
                                            }, 0) * (1 - discountPercentage / 100)
                                          ).toFixed(2)} ₽
                                        </span>
                                      </div>
                                    )}
                                  </>
                                );
                              })()
                            ) : (
                              <>
                                {/* Оригинальная логика */}
                                {selectedDocs.map((doc, index) => {
                                  const price = (index + 1) % 3 === 0 ? '0 (акция)' : getDocumentPrice(doc.variation);

                                  return (
                                    <div key={index} className={styles.cab_documents__documents_inf}>
                                      {doc.question}
                                      <span>№ {doc.id}</span>
                                      <span>{price} ₽</span>
                                    </div>
                                  );
                                })}

                                <div className={styles.cab_documents__documents_total}>
                                  К оплате:
                                  <span>
                                    {selectedDocs.reduce((total, doc, index) => {
                                      const price = (index + 1) % 3 === 0 ? 0 : parseFloat(getDocumentPrice(doc.variation));
                                      return total + price;
                                    }, 0).toFixed(2)} ₽
                                  </span>
                                </div>

                                {discountPercentage > 0 && (
                                  <div className={styles.cab_documents__documents_total}>
                                    После применения скидки:
                                    <span>
                                      {(
                                        selectedDocs.reduce((total, doc, index) => {
                                          const price = (index + 1) % 3 === 0 ? 0 : parseFloat(getDocumentPrice(doc.variation));
                                          return total + price;
                                        }, 0) * (1 - discountPercentage / 100)
                                      ).toFixed(2)} ₽
                                    </span>
                                  </div>
                                )}
                              </>
                            )}
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

                        {(Number(formData.bonus_balance) / 100) > 0 && (
                          <label className={`${cabIssueStyles.cab_issue__diplomas_label_wrapper} ${cabIssueStyles.cab_issue__diplomas_label_wrapper_docs}`}>
                            <div className={`${cabIssueStyles.cab_issue__diplomas_checkbox} ${bonusChecked ? cabIssueStyles.cab_issue__diplomas_checkbox_active : ''}`}>
                              <input
                                type="checkbox"
                                checked={bonusChecked}
                                onChange={() => {
                                  setBonusChecked(!bonusChecked);
                                }}
                              />
                            </div>
                            <span>Использовать бонусы</span>
                          </label>
                        )}

                        <button className={`${globalStyles.btn_reset} ${styles.cab_documents__documents_btn}`}>
                          {yookassaChecked ? 'Оплатить через ЮKassa' : 'Оплатить с кошелька'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Feedback />
      </div>
    </section>
  );
};

export default CabDocuments;
