import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import documentsStyles from '../CabDocuments/CabDocuments.module.sass';
import cabIssueStyles from '../CabIssue/CabIssue.module.sass';
import styles from './DocumentDetails.module.sass';

import QRCodeComponent from '../../components/QRCodeComponent/QRCodeComponent';

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

const DocumentDetails = () => {
  const { id } = useParams<{ id: string }>();

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const [docsVariations, setDocsVariations] = useState<IDocsVariations[]>([]);
  const [currentDoc, setCurrentDoc] = useState<IDocumentInf | null>(null);

  useEffect(() => {
    const fetchDocById = async () => {
      try {
        if (!id) {
          console.error('ID not provided');
          return;
        }

        // Запрос документа по id
        const response = await fetch(`${apiBaseUrl}/api/v1/cab/documents/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch document with id ${id}: ${response.statusText}`);
        }

        const data: IDocumentInf = await response.json();

        // Установка данных в состояние
        setCurrentDoc(data);

        console.log(data);
      } catch (error) {
        console.error('Error fetching document by id:', error);
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

    fetchDocById();
    fetchDocsVariations();
  }, []);

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

  const formatParticipationDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  return (
    <div>

      <div className={`${documentsStyles.cab_documents__diplom_wrapper} ${styles.document_details__diplom_wrapper}`}>

        {currentDoc && (
          <div className={`${cabIssueStyles.cab_issue__diplomas_preview_wrapper}`}

          >
            <img src={docsVariations.find(obj => obj.id === currentDoc.variation)?.templates.find(obj => obj.id === currentDoc.template)?.preview} alt="Diplom" width={400}
            />

            {currentDoc.variation === 1 && (
              // <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_media}`}>
              //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
              //     <span>{currentDoc.full_name}</span>
              //   </div>
              //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
              //     {currentDoc.institution_name}
              //   </div>
              //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
              //     {currentDoc.locality}
              //   </div>
              //   <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
              //     Статью: {currentDoc.project_name}
              //   </div>
              //   {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
              //                             Номер свидетельства: {currentNumberOfDoc}
              //                           </div> */}
              // </div>

              currentDoc.for_whom === 'PARTICIPANT' ? (
                <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition} ${styles.document_details__diplomas_preview_text}`}>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    Награждается
                    <span>{currentDoc.full_name}</span>
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.institution_name}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.locality}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.place === 4 ? (
                      <span>Участник</span>
                    ) : (
                      <span>Победитель ({currentDoc.place} место)</span>
                    )}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {getGenitiveLabel(lvlOptions, currentDoc.level)} конкурса
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    Номинация: {currentDoc.nomination}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    <span>Работа: {currentDoc.project_name}</span>
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.leader.length === 0 ? '' : currentDoc.leader}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    Номер документа: {`${docsVariations.find(obj => obj.id === currentDoc.variation)?.tag}${currentDoc.id}`}
                  </div>
                </div>
              ) : (
                <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition} ${styles.document_details__diplomas_preview_text}`}>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    Награждается
                    <span>{currentDoc.full_name}</span>
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.institution_name}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.locality}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    за подготовку
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    <span>{currentDoc.leader}</span>
                  </div>
                  {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                      <span>{diploma.full_name_participant.length === 0 ? 'Фамилия Имя Отчество участника' : diploma.full_name_participant}</span>
                                                    </div> */}
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.place === 4 ? (
                      <span>Участник</span>
                    ) : (
                      <span>Победитель ({currentDoc.place} место)</span>
                    )}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {getGenitiveLabel(lvlOptions, currentDoc.level)} конкурса
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    Номинация: {currentDoc.nomination}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    <span>Работа: {currentDoc.project_name}</span>
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    Номер документа: {`${docsVariations.find(obj => obj.id === currentDoc.variation)?.tag}${currentDoc.id}`}
                  </div>
                </div>
              )
            )}

            {currentDoc.variation === 4 && (
              currentDoc.for_whom === 'PARTICIPANT' ? (
                <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition} ${styles.document_details__diplomas_preview_text}`}>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    Награждается
                    <span>{currentDoc.full_name}</span>
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.institution_name}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.locality}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.place === 4 ? (
                      <span>Участник</span>
                    ) : (
                      <span>Победитель ({currentDoc.place} место)</span>
                    )}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {getGenitiveLabel(lvlOptionsOlympiad, currentDoc.level)} интернет-олимпиады "Росмедаль"
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    Название олимпиады: {currentDoc.nomination}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.leader.length === 0 ? '' : currentDoc.leader}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    Номер документа: {`${docsVariations.find(obj => obj.id === currentDoc.variation)?.tag}${currentDoc.id}`}
                  </div>
                </div>
              ) : (
                <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_competition} ${styles.document_details__diplomas_preview_text}`}>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    Награждается
                    <span>{currentDoc.full_name}</span>
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.institution_name}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.locality}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    за подготовку
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    <span>{currentDoc.leader}</span>
                  </div>
                  {/* <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                                                      <span>{diploma.full_name_participant.length === 0 ? 'Фамилия Имя Отчество участника' : diploma.full_name_participant}</span>
                                                    </div> */}
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {currentDoc.place === 4 ? (
                      <span>Участник</span>
                    ) : (
                      <span>Победитель ({currentDoc.place} место)</span>
                    )}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    {getGenitiveLabel(lvlOptionsOlympiad, currentDoc.level)} интернет-олимпиады "Росмедаль"
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    Название олимпиады: {currentDoc.nomination}
                  </div>
                  <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                    Номер документа: {`${docsVariations.find(obj => obj.id === currentDoc.variation)?.tag}${currentDoc.id}`}
                  </div>
                </div>
              )
            )}

            {currentDoc.variation === 2 && (
              <div className={`${cabIssueStyles.cab_issue__diplomas_preview_text} ${cabIssueStyles.cab_issue__diplomas_preview_text_docs_thanks} ${styles.document_details__diplomas_preview_text} ${styles.document_details__diplomas_preview_text_thanks}`}>
                <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  Награждается
                  <span>{currentDoc.full_name}</span>
                </div>
                <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  {currentDoc.institution_name}
                </div>
                <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  {currentDoc.locality}
                </div>
                <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  <span>{currentDoc.nomination}</span>
                </div>
                <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                  Номер благодарственного письма: {`${docsVariations.find(obj => obj.id === currentDoc.variation)?.tag}${currentDoc.id}`}
                </div>
              </div>
            )}

            {!currentDoc.is_paid && (
              <div className={cabIssueStyles.cab_issue__diplomas_preview_watermark}></div>
            )}

            <div className={`${cabIssueStyles.cab_issue__diplomas_preview_date} ${cabIssueStyles.cab_issue__diplomas_preview_date_docs_competition} ${cabIssueStyles.cab_issue__diplomas_preview_date_docs_competition_details}`}>
              <div className={cabIssueStyles.cab_issue__diplomas_preview_title}>
                {formatParticipationDate(currentDoc.participation_date)}
              </div>
            </div>

            <div className={`${cabIssueStyles.cab_issue__diplomas_preview_qr} ${cabIssueStyles.cab_issue__diplomas_preview_qr_docs} ${styles.document_details__diplomas_preview_qr_docs}`}>
              <QRCodeComponent url={`${apiBaseUrl}/document-details/${currentDoc.id}`} />
            </div>

          </div>

        )}



      </div>
    </div>
  );
};

export default DocumentDetails;
