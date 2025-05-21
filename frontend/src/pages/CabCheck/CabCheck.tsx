import { useState, useEffect, useRef } from 'react';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import AuthService from '../../services/AuthService';

import globalStyles from '../../App.module.sass';
import cabIssueStyles from '../CabIssue/CabIssue.module.sass';
import modalComponentStyles from '../../components/ModalComponent/ModalComponent.module.sass';
import styles from './CabCheck.module.sass';

import Feedback from '../../components/Feedback/Feedback';
import CabAside from '../../components/CabAside/CabAside';
import QRCodeComponent from '../../components/QRCodeComponent/QRCodeComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';

interface IDocsCheck {
  count: number;
  total_pages: number;
  results: IDocsCheckInf[];
}

interface IDocsCheckInf {
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

interface IDocsVariations {
  id: number;
  tag: string;
  templates: IDocsVariationsTemplates[];
}

interface IDocsVariationsTemplates {
  id: number;
  preview: string;
}

const CabCheck = () => {
  const [docsCheck, setDocsCheck] = useState<IDocsCheck | null>(null);
  const [docsVariations, setDocsVariations] = useState<IDocsVariations[]>([]);
  const [diplomaNumber, setDiplomaNumber] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<IDocsCheckInf | null>(null);

  const contentRef = useRef<HTMLDivElement | null>(null);

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

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = AuthService.getAccessToken();

  useEffect(() => {
    const fetchDocsVariations = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/docs/variations`);
        const data = await response.json();

        // const foundObject = data.results.find(obj => obj.tag === "ТК");
        setDocsVariations(data.results);

      } catch (error) {
        console.error('Error fetching docs:', error);
      }
    };

    fetchDocsVariations();
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      // Действие при изменении содержимого
      console.log('Content updated in ref');
    }
  }, [selectedDoc]);

  // Component functions
  function handlePreviewClick(doc: IDocsCheckInf) {
    setSelectedDoc(doc);
    setIsModalOpen(true); // Открываем модальное окно
  };
  async function handleDiplomasSearch(event: React.FormEvent) {
    event.preventDefault(); // Останавливаем стандартное поведение формы

    if (!diplomaNumber && !participantName) {
      alert('Заполните данные!');
      return;
    }

    const params = new URLSearchParams();

    if (diplomaNumber) {
      params.append('pk', diplomaNumber);
    }

    if (participantName) {
      params.append('full_name', participantName);
    }

    const url = `${apiBaseUrl}/api/v1/docs/check?${params}`;

    try {
      // Первый запрос
      const initialResponse = await fetch(`${url}&page=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!initialResponse.ok) {
        throw new Error(`HTTP error! status: ${initialResponse.status}`);
      }

      const initialData = await initialResponse.json();

      const { count, total_pages, results: initialResults } = initialData;

      let allResults = initialResults;

      // Последовательно запрашиваем остальные страницы
      for (let page = 2; page <= total_pages; page++) {
        const response = await fetch(`${url}&page=${page}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const pageData = await response.json();
        allResults = allResults.concat(pageData.results);
      }

      // Устанавливаем собранные данные
      setDocsCheck({
        count,
        total_pages,
        results: allResults,
      });

      if (allResults.length === 0) {
        alert('По введеным даннымм ничего не найдено!');
      }

      console.log({ count, total_pages, results: allResults });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  function formatDate(dateString) {
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day.toString().padStart(2, '0')} ${month} ${year} г.`;
  };

  function getGenitiveLabel(options, level) {
    const option = options.find(opt => opt.value === level);
    return option ? option.genitive : '';
  };

  const formatParticipationDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  async function handleDownloadPDF(docId: number, docVariation: string) {
    if (!contentRef.current) {
      alert('Содержимое не найдено.');
      return;
    }

    const element = contentRef.current;

    if (element) {
      element.style.opacity = '';

      try {
        // Вызов вашей функции генерации PDF
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
        const imgScaledWidth = imgWidth * scale * 1.03;
        const imgScaledHeight = imgHeight * scale * 1.015;

        const scaleMedia = Math.min(pageWidthMedia / imgWidth, pageHeightMedia / imgHeight);
        const imgScaledWidthMedia = imgWidth * scaleMedia * 1.3;
        const imgScaledHeightMedia = imgHeight * scaleMedia * 1.42;

        // Создаем объект jsPDF
        let doc: jsPDF;

        if (docVariation === '3') {
          // Логика для альбомной ориентации
          doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [pageWidthMedia, pageHeightMedia],
          });
          doc.addImage(
            imgData,
            'PNG',
            0,
            0,
            imgScaledWidthMedia,
            imgScaledHeightMedia
          );
        } else {
          // Логика для портретной ориентации
          doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [pageWidth, pageHeight],
          });
          doc.addImage(imgData, 'PNG', 0, 0, imgScaledWidth, imgScaledHeight);
        }

        // Сохранение файла
        doc.save(`document_${docId}.pdf`);
      } finally {

      }
    }


  };

  return (
    <section className={`${globalStyles.section_padding}`}>
      <div className={globalStyles.container}>

        <div className={globalStyles.cab_container}>
          <CabAside />

          <div className={globalStyles.cab_content}>
            <h2 className={globalStyles.cab_title}>Проверка диплома</h2>

            <div className={globalStyles.cab_blocks}>
              <form className={`${globalStyles.cab_block} ${styles.cab_check__block}`} onSubmit={handleDiplomasSearch}>
                <h3 className={styles.cab_check__subtitle}>Введите данные для проверки диплома</h3>
                <div className={styles.cab_check__inputs}>
                  <input
                    className={globalStyles.cab_input}
                    type="text"
                    placeholder="Номер диплома"
                    value={diplomaNumber}
                    onChange={(e) => setDiplomaNumber(e.target.value)}
                  />
                  <input
                    className={globalStyles.cab_input}
                    type="text"
                    placeholder="ФИО участника"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                  />
                </div>
                <ul className={`${globalStyles.list_reset} ${styles.cab_check__list}`}>
                  {docsCheck?.results.map((doc, i) => {
                    const matchingVariation = docsVariations.find(variation => variation.id === doc.variation);

                    return (
                      <li className={styles.cab_check__item} key={i}>

                        <div
                          className={cabIssueStyles.cab_issue__diplomas_preview_wrapper}
                          style={{
                            width: '100%',
                            maxWidth: '224px',
                            margin: '0 auto',
                            cursor: 'pointer'
                          }}
                          onClick={() => handlePreviewClick(doc)}
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

                        <div className={styles.cab_check__item_content}>
                          Номер диплома:
                          <span>{matchingVariation ? matchingVariation.tag + doc.id : 'Тег не найден'}</span>
                        </div>
                        <div className={styles.cab_check__item_content}>
                          Дата:
                          <span>{formatDate(doc.participation_date)}</span>
                        </div>
                        <div className={styles.cab_check__item_content}>
                          ФИО:
                          <span>{doc.full_name}</span>
                        </div>
                        <div className={styles.cab_check__item_content}>
                          Руководитель:
                          <span>{doc.leader ? doc.leader : "Отсутствует"}</span>
                        </div>
                        <div className={styles.cab_check__item_content}>
                          Город:
                          <span>{doc.locality}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.cab_check__btn}`}>Поиск дипломов</button>
              </form>
            </div>
          </div>
        </div>


        <Feedback />
      </div>

      <ModalComponent
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        content={
          <div className={`${selectedDoc && selectedDoc.variation !== 3 ? styles.modal_content : styles.modal_content_media}`}>

            {selectedDoc && ( // Убедитесь, что объект выбран
              <div
                ref={contentRef}
                className={cabIssueStyles.cab_issue__diplomas_preview_wrapper}
                style={{
                  width: '100%',
                  maxWidth: '224px',
                  margin: '0 auto',
                  opacity: '0',
                  position: 'absolute',
                  left: '-9999px'
                }}
              >
                <img src={docsVariations.find(obj => obj.id === selectedDoc.variation)?.templates.find(obj => obj.id === selectedDoc.template)?.preview} alt="Diplom" width={224}
                />

                {selectedDoc.variation === 1 && (
                  // <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_media}`}>
                  //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  //     <span>{selectedDoc.full_name}</span>
                  //   </div>
                  //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  //     {selectedDoc.institution_name}
                  //   </div>
                  //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  //     {selectedDoc.locality}
                  //   </div>
                  //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  //     Статью: {selectedDoc.project_name}
                  //   </div>
                  //   {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  //                             Номер свидетельства: {currentNumberOfDoc}
                  //                           </div> */}
                  // </div>

                  selectedDoc.for_whom === 'PARTICIPANT' ? (
                    <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Награждается
                        <span>{selectedDoc.full_name}</span>
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.institution_name}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.locality}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.place === 4 ? (
                          <span>Участник</span>
                        ) : (
                          <span>Победитель ({selectedDoc.place} место)</span>
                        )}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {getGenitiveLabel(lvlOptions, selectedDoc.level)} конкурса
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Номинация: {selectedDoc.nomination}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        <span>Работа: {selectedDoc.project_name}</span>
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.leader.length === 0 ? '' : selectedDoc.leader}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Номер документа: {`${docsVariations.find(obj => obj.id === selectedDoc.variation)?.tag}${selectedDoc.id}`}
                      </div>
                    </div>
                  ) : (
                    <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Награждается
                        <span>{selectedDoc.full_name}</span>
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.institution_name}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.locality}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        за подготовку
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        <span>{selectedDoc.leader}</span>
                      </div>
                      {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          <span>{diploma.full_name_participant.length === 0 ? 'Фамилия Имя Отчество участника' : diploma.full_name_participant}</span>
                                        </div> */}
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.place === 4 ? (
                          <span>Участник</span>
                        ) : (
                          <span>Победитель ({selectedDoc.place} место)</span>
                        )}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {getGenitiveLabel(lvlOptions, selectedDoc.level)} конкурса
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Номинация: {selectedDoc.nomination}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        <span>Работа: {selectedDoc.project_name}</span>
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Номер документа: {`${docsVariations.find(obj => obj.id === selectedDoc.variation)?.tag}${selectedDoc.id}`}
                      </div>
                    </div>
                  )
                )}

                {selectedDoc.variation === 4 && (
                  selectedDoc.for_whom === 'PARTICIPANT' ? (
                    <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Награждается
                        <span>{selectedDoc.full_name}</span>
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.institution_name}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.locality}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.place === 4 ? (
                          <span>Участник</span>
                        ) : (
                          <span>Победитель ({selectedDoc.place} место)</span>
                        )}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {getGenitiveLabel(lvlOptionsOlympiad, selectedDoc.level)} интернет-олимпиады "Росмедаль"
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Название олимпиады: {selectedDoc.nomination}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.leader.length === 0 ? '' : selectedDoc.leader}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Номер документа: {`${docsVariations.find(obj => obj.id === selectedDoc.variation)?.tag}${selectedDoc.id}`}
                      </div>
                    </div>
                  ) : (
                    <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Награждается
                        <span>{selectedDoc.full_name}</span>
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.institution_name}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.locality}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        за подготовку
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        <span>{selectedDoc.leader}</span>
                      </div>
                      {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          <span>{diploma.full_name_participant.length === 0 ? 'Фамилия Имя Отчество участника' : diploma.full_name_participant}</span>
                                        </div> */}
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.place === 4 ? (
                          <span>Участник</span>
                        ) : (
                          <span>Победитель ({selectedDoc.place} место)</span>
                        )}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {getGenitiveLabel(lvlOptionsOlympiad, selectedDoc.level)} интернет-олимпиады "Росмедаль"
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Название олимпиады: {selectedDoc.nomination}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Номер документа: {`${docsVariations.find(obj => obj.id === selectedDoc.variation)?.tag}${selectedDoc.id}`}
                      </div>
                    </div>
                  )
                )}

                {selectedDoc.variation === 2 && (
                  <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_thanks}`}>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      Награждается
                      <span>{selectedDoc.full_name}</span>
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {selectedDoc.institution_name}
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {selectedDoc.locality}
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      <span>{selectedDoc.nomination}</span>
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      Номер благодарственного письма: {`${docsVariations.find(obj => obj.id === selectedDoc.variation)?.tag}${selectedDoc.id}`}
                    </div>
                  </div>
                )}

                {selectedDoc.variation === 3 && (
                  <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_media}`}>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      <span>{selectedDoc.full_name}</span>
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {selectedDoc.institution_name}
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {selectedDoc.locality}
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {selectedDoc.published_by} в Международном сетевом издании "Росмедаль" статью: {selectedDoc.project_name}
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      Номер свидетельства: {`${docsVariations.find(obj => obj.id === selectedDoc.variation)?.tag}${selectedDoc.id}`}
                    </div>
                  </div>
                )}




                {selectedDoc.variation === 3 ? (
                  <div className={`${cabIssueStyles.cab_issue__diplomas_preview_date} ${cabIssueStyles.cab_issue__diplomas_preview_date_docs_media}`}>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {formatParticipationDate(selectedDoc.participation_date)}
                    </div>
                  </div>
                ) : (
                  <div className={`${cabIssueStyles.cab_issue__diplomas_preview_date} ${cabIssueStyles.cab_issue__diplomas_preview_date_docs_competition}`}>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {formatParticipationDate(selectedDoc.participation_date)}
                    </div>
                  </div>
                )}

                {selectedDoc.variation !== 3 && (
                  <div className={`${cabIssueStyles.cab_issue__diplomas_preview_qr} ${cabIssueStyles.cab_issue__diplomas_preview_qr_docs} ${styles.modal_content__qr}`}>
                    <QRCodeComponent url={`${apiBaseUrl}/document-details/${selectedDoc.id}`} />
                  </div>
                )}

              </div>
            )}
            {selectedDoc && ( // Убедитесь, что объект выбран
              <div
                className={`${cabIssueStyles.cab_issue__diplomas_preview_wrapper} ${cabIssueStyles.cab_issue__diplomas_preview_wrapper_adaptive}`}
                style={{
                  width: '100%',
                  maxWidth: '224px',
                  margin: '0 auto',
                  transform: 'scale(2)'
                }}
              >
                <img src={docsVariations.find(obj => obj.id === selectedDoc.variation)?.templates.find(obj => obj.id === selectedDoc.template)?.preview} alt="Diplom" width={224}
                />

                {selectedDoc.variation === 1 && (
                  // <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_media}`}>
                  //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  //     <span>{selectedDoc.full_name}</span>
                  //   </div>
                  //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  //     {selectedDoc.institution_name}
                  //   </div>
                  //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  //     {selectedDoc.locality}
                  //   </div>
                  //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  //     Статью: {selectedDoc.project_name}
                  //   </div>
                  //   {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  //                             Номер свидетельства: {currentNumberOfDoc}
                  //                           </div> */}
                  // </div>

                  selectedDoc.for_whom === 'PARTICIPANT' ? (
                    <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Награждается
                        <span>{selectedDoc.full_name}</span>
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.institution_name}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.locality}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.place === 4 ? (
                          <span>Участник</span>
                        ) : (
                          <span>Победитель ({selectedDoc.place} место)</span>
                        )}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {getGenitiveLabel(lvlOptions, selectedDoc.level)} конкурса
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Номинация: {selectedDoc.nomination}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        <span>Работа: {selectedDoc.project_name}</span>
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.leader.length === 0 ? '' : selectedDoc.leader}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Номер документа: {`${docsVariations.find(obj => obj.id === selectedDoc.variation)?.tag}${selectedDoc.id}`}
                      </div>
                    </div>
                  ) : (
                    <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Награждается
                        <span>{selectedDoc.full_name}</span>
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.institution_name}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.locality}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        за подготовку
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        <span>{selectedDoc.leader}</span>
                      </div>
                      {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          <span>{diploma.full_name_participant.length === 0 ? 'Фамилия Имя Отчество участника' : diploma.full_name_participant}</span>
                                        </div> */}
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.place === 4 ? (
                          <span>Участник</span>
                        ) : (
                          <span>Победитель ({selectedDoc.place} место)</span>
                        )}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {getGenitiveLabel(lvlOptions, selectedDoc.level)} конкурса
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Номинация: {selectedDoc.nomination}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        <span>Работа: {selectedDoc.project_name}</span>
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Номер документа: {`${docsVariations.find(obj => obj.id === selectedDoc.variation)?.tag}${selectedDoc.id}`}
                      </div>
                    </div>
                  )
                )}

                {selectedDoc.variation === 4 && (
                  selectedDoc.for_whom === 'PARTICIPANT' ? (
                    <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Награждается
                        <span>{selectedDoc.full_name}</span>
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.institution_name}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.locality}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.place === 4 ? (
                          <span>Участник</span>
                        ) : (
                          <span>Победитель ({selectedDoc.place} место)</span>
                        )}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {getGenitiveLabel(lvlOptionsOlympiad, selectedDoc.level)} интернет-олимпиады "Росмедаль"
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Название олимпиады: {selectedDoc.nomination}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.leader.length === 0 ? '' : selectedDoc.leader}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Номер документа: {`${docsVariations.find(obj => obj.id === selectedDoc.variation)?.tag}${selectedDoc.id}`}
                      </div>
                    </div>
                  ) : (
                    <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition}`}>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Награждается
                        <span>{selectedDoc.full_name}</span>
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.institution_name}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.locality}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        за подготовку
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        <span>{selectedDoc.leader}</span>
                      </div>
                      {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                          <span>{diploma.full_name_participant.length === 0 ? 'Фамилия Имя Отчество участника' : diploma.full_name_participant}</span>
                                        </div> */}
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {selectedDoc.place === 4 ? (
                          <span>Участник</span>
                        ) : (
                          <span>Победитель ({selectedDoc.place} место)</span>
                        )}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        {getGenitiveLabel(lvlOptionsOlympiad, selectedDoc.level)} интернет-олимпиады "Росмедаль"
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Название олимпиады: {selectedDoc.nomination}
                      </div>
                      <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                        Номер документа: {`${docsVariations.find(obj => obj.id === selectedDoc.variation)?.tag}${selectedDoc.id}`}
                      </div>
                    </div>
                  )
                )}

                {selectedDoc.variation === 2 && (
                  <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_thanks}`}>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      Награждается
                      <span>{selectedDoc.full_name}</span>
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {selectedDoc.institution_name}
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {selectedDoc.locality}
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      <span>{selectedDoc.nomination}</span>
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      Номер благодарственного письма: {`${docsVariations.find(obj => obj.id === selectedDoc.variation)?.tag}${selectedDoc.id}`}
                    </div>
                  </div>
                )}

                {selectedDoc.variation === 3 && (
                  <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_media}`}>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      <span>{selectedDoc.full_name}</span>
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {selectedDoc.institution_name}
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {selectedDoc.locality}
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {selectedDoc.published_by} в Международном сетевом издании "Росмедаль" статью: {selectedDoc.project_name}
                    </div>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      Номер свидетельства: {`${docsVariations.find(obj => obj.id === selectedDoc.variation)?.tag}${selectedDoc.id}`}
                    </div>
                  </div>
                )}




                {selectedDoc.variation === 3 ? (
                  <div className={`${cabIssueStyles.cab_issue__diplomas_preview_date} ${cabIssueStyles.cab_issue__diplomas_preview_date_docs_media}`}>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {formatParticipationDate(selectedDoc.participation_date)}
                    </div>
                  </div>
                ) : (
                  <div className={`${cabIssueStyles.cab_issue__diplomas_preview_date} ${cabIssueStyles.cab_issue__diplomas_preview_date_docs_competition}`}>
                    <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                      {formatParticipationDate(selectedDoc.participation_date)}
                    </div>
                  </div>
                )}

                {selectedDoc.variation !== 3 && (
                  <div className={`${cabIssueStyles.cab_issue__diplomas_preview_qr} ${cabIssueStyles.cab_issue__diplomas_preview_qr_docs} ${styles.modal_content__qr}`}>
                    <QRCodeComponent url={`${apiBaseUrl}/document-details/${selectedDoc.id}`} />
                  </div>
                )}

              </div>
            )}

            <button className={`${globalStyles.btn_reset} ${styles.cab_check__download_pdf} ${selectedDoc && selectedDoc.variation === 3 ? styles.cab_check__download_pdf_media : ''}`}
              onClick={() => {
                if (selectedDoc) {
                  handleDownloadPDF(selectedDoc.id, `${selectedDoc.variation}`);
                }
              }}
            >Скачать диплом</button>

          </div>
        }
        customClassName={modalComponentStyles.modalContent_docs_check}
      />

    </section>
  );
};

export default CabCheck;
