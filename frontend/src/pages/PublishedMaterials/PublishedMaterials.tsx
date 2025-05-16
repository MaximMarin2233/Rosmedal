import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link, Element } from 'react-scroll';

import parse from 'html-react-parser';

import globalStyles from '../../App.module.sass';
import styles from './PublishedMaterials.module.sass';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Feedback from '../../components/Feedback/Feedback';

interface IMaterials {
  total_pages: string;
  results: IMaterialsDetail[];
}

interface IMaterialsDetail {
  id: number;
  topic: string;
  short_description: string;
}

const PublishedMaterials = () => {
  const navigate = useNavigate();

  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Публикации', href: '/publications' },
    { name: 'Опубликованные материалы', href: '/published_materials' },
  ];

  const [materials, setMaterials] = useState<IMaterials | null>(null);

  const [currentPaginationPage, setCurrentPaginationPage] = useState(0);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const params = new URLSearchParams();

        params.append('page', `${currentPaginationPage + 1}`);

        const response = await fetch(`${apiBaseUrl}/api/v1/publications/?${params.toString()}`);
        const data: IMaterials = await response.json();
        setMaterials(data);
      } catch (error) {
        console.error('Error fetching publications:', error);
      }
    };

    fetchPublications();
  }, [currentPaginationPage]);

  const handleLinkClick = (id: number) => {
    navigate(`/publication-details/${id}`);
  };

  const handlePaginationClick = (index: number) => {
    setCurrentPaginationPage(index);
  };

  return (
    <section className={`${globalStyles.section_padding} ${styles.published_materials}`}>
      <div className={globalStyles.container}>
        <Breadcrumbs links={breadcrumbLinks} />


        <Element name="publishedMaterials">
          <h2 className={`${globalStyles.title} ${styles.published_materials__title}`}>Материалы для учителей</h2>
        </Element>

        <ul className={`${globalStyles.list_reset} ${styles.published_materials__list}`}>

          {materials?.results.map(material => (
            <li className={styles.published_materials__item} key={material.id}>
              <h3 className={styles.published_materials__item_title}>{material.topic}</h3>
              <p className={styles.published_materials__item_descr}>
                {material.short_description ? parse(material.short_description.replace(/<[^>]+>/g, '')) : ''}
              </p>
              <button className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.published_materials__item_btn}`} onClick={() => handleLinkClick(material.id)}>Подробнее</button>
            </li>
          ))}

        </ul>

        {materials?.total_pages && +materials?.total_pages > 1 ? (
          <div className={globalStyles.products_choice__tests_pagination}>

            {Array.from({ length: +materials?.total_pages }, (_, index) => (

              <Link
                to="publishedMaterials"
                spy={true}
                smooth={true}
                duration={500}
                offset={-150}
              >
                <span
                  key={index}
                  className={index === currentPaginationPage ? globalStyles.products_choice__tests_pagination_active : ''}
                  onClick={() => handlePaginationClick(index)}
                >
                  {index + 1}
                </span>
              </Link>
            ))}

          </div>
        ) : ('')}

        <Feedback />
      </div>
    </section>
  );
};

export default PublishedMaterials;
