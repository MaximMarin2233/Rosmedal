import { useEffect, useState, useCallback } from 'react';
import { useParams } from "react-router-dom";

import globalStyles from '../../App.module.sass';
import provisionsStyles from '../Provisions/Provisions.module.sass';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import FormatDate from '../../components/FormatDate/FormatDate';

interface ICurrentMaterial {
  id: number;
  date_created: string;
  image: string;
  reading_time: string;
  text: string;
  title: string;
}

const NewsDetails = () => {

  const [currentMaterial, setCurrentMaterial] = useState<ICurrentMaterial | null>(null);
  const { id } = useParams<{ id: string }>();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchCurrentMaterial = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/news/${id}`);
      const data = await response.json();
      setCurrentMaterial(data);
    } catch (error) {
      console.error('Error fetching current material:', error);
    }
  }, [apiBaseUrl, id]);

  useEffect(() => {
    fetchCurrentMaterial();
  }, [fetchCurrentMaterial]);

  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Новости', href: '/news' },
    { name: `${currentMaterial?.title}`, href: `/news-details/${id}` },
  ];

  return (
    <section className={`${globalStyles.section_padding} ${provisionsStyles.provision_competition}`}>
      <div className={globalStyles.container}>
        <Breadcrumbs links={breadcrumbLinks} />

        <h2 className={globalStyles.title} style={{ marginBottom: 50 }}>Новость {currentMaterial?.title}</h2>

        <div className={globalStyles.provisions_block}>
          <p className={provisionsStyles.provision_competition__block_descr} style={{ display: 'flex', gap: 5 }}>
            Время чтения {currentMaterial?.reading_time} мин
            <span>|</span>
            {currentMaterial && currentMaterial.date_created && (
              <> <FormatDate isoDate={currentMaterial.date_created} /></>
            )}
          </p>
          <img src={currentMaterial?.image} alt="" style={{ width: '100%', height: 300 }} />
          <h3 className={provisionsStyles.provision_competition__block_title}>{currentMaterial?.title}</h3>
          <p className={provisionsStyles.provision_competition__block_descr}>
            {currentMaterial?.text}
          </p>


        </div>

      </div>
    </section>
  );
};

export default NewsDetails;
