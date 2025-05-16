import { useRef, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import parse from 'html-react-parser';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import globalStyles from '../../App.module.sass';
import articlesPublicationStyles from '../ArticlesPublication/ArticlesPublication.module.sass';
import styles from './PublicationDetails.module.sass';

import Feedback from '../../components/Feedback/Feedback';

interface ICurrentMaterial {
  id: number;
  created_at: string;
  author_full_name: string;
  author_email: string;
  short_description: string;
  topic: string;
  text: string;
}

const ArticlesPublication = () => {
  const [currentMaterial, setCurrentMaterial] = useState<ICurrentMaterial | null>(null);

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const contentRef = useRef<HTMLDivElement>(null);

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchCurrentMaterial = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/publications/${id}`);
      const data = await response.json();
      setCurrentMaterial(data);
    } catch (error) {
      console.error('Error fetching current material:', error);
    }
  }, [apiBaseUrl, id]);

  useEffect(() => {
    fetchCurrentMaterial();
  }, [fetchCurrentMaterial]);

  useEffect(() => {
    if (contentRef.current && currentMaterial?.text) {
      contentRef.current.innerHTML = currentMaterial.text;
    }
  }, [currentMaterial?.text]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <section className={`${globalStyles.section_padding} ${articlesPublicationStyles.articles_publication}`}>
      <div className={globalStyles.container}>
        <div className={styles.publication_details__content}>

          <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.publication_details__btn}`} onClick={() => handleLinkClick("/published-materials")}>Назад к публикациям</button>

          <div className={styles.publication_details__text}>
            <div className={styles.publication_details__article_name}>Название статьи:</div>
            <h2 className={styles.publication_details__article_title}>{currentMaterial?.topic}</h2>
            <h2 className={styles.publication_details__article_title}>Работа №{currentMaterial?.id}.</h2>
            <p className={styles.publication_details__article_descr}>
              <span>Дата публикации:</span> {formatDate(`${currentMaterial?.created_at}`)} <br />
              <span>Автор:</span> {currentMaterial?.author_full_name} <br />
              <span>Описание:</span> <br />
              {currentMaterial?.short_description ? parse(currentMaterial.short_description.replace(/<[^>]+>/g, '')) : ''} <br />
            </p>
          </div>

          <div className={articlesPublicationStyles.editor}>
            <SimpleBar style={{ maxHeight: 400 }}>
              <div
                className={`${articlesPublicationStyles.editor__content} ${articlesPublicationStyles.editor__content_active}`}
                ref={contentRef}
                style={{ padding: '42px 41px', minHeight: '400px' }}
              ></div>
            </SimpleBar>
          </div>

        </div>

        <style>{`
              .simplebar-track.simplebar-vertical {
                width: 20px !important;
                background-color: #DADADA !important;
                border-radius: 10px !important;
              }
              .simplebar-scrollbar {
                left: -1px !important;
              }
              .simplebar-scrollbar::before {
                background-color: #FB998A !important;
                width: 20px !important;
                border-radius: 10px !important;
                opacity: 1 !important;
              }
  
        `}</style>


        <Feedback />

      </div>
    </section>
  );
};

export default ArticlesPublication;
