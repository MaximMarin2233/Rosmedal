import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import globalStyles from '../../App.module.sass';
import styles from './News.module.sass';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Feedback from '../../components/Feedback/Feedback';

import FormatDate from '../../components/FormatDate/FormatDate';
import { Link, Element } from 'react-scroll';

import NewsImgLogo from '../../assets/news/news-logo.svg';

interface INews {
  total_pages: string;
  results: INewsInf[];
}

interface INewsInf {
  id: number;
  title: string;
  date_created: string;
  reading_time: number;
  image: string;
  total_pages: string;
}

const News = () => {

  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Новости', href: '/news' },
  ];

  const [currentPaginationPage, setCurrentPaginationPage] = useState(0);

  const navigate = useNavigate();

  const [news, setNews] = useState<INews | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const params = new URLSearchParams();

        if (searchQuery) {
          params.append('title', searchQuery);
        }

        params.append('page', `${currentPaginationPage + 1}`);

        const response = await fetch(`${apiBaseUrl}/api/v1/news/?${params.toString()}`);
        const data: INews = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [searchQuery, currentPaginationPage]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetPagination();
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    resetPagination();
    event.preventDefault();
    setSearchQuery(searchQuery);
  };

  const handleLinkClick = (id: number) => {
    navigate(`/news-details/${id}`);
  };

  const handlePaginationClick = (index: number) => {
    setCurrentPaginationPage(index);
  };

  const resetPagination = () => {
    setCurrentPaginationPage(0);
  };

  return (
    <section className={`${globalStyles.section_padding} ${styles.news}`}>
      <div className={globalStyles.container}>
        <Breadcrumbs links={breadcrumbLinks} />

        <div className={styles.news__title_wrapper}>
          <h2 className={globalStyles.title}>Новости</h2>

          <form className={`${globalStyles.search} ${globalStyles.products_choice__search} ${styles.news__search_form}`} onSubmit={handleSearchSubmit}>
            <input className={globalStyles.search__input} type="text" placeholder="Поиск" value={searchQuery} onChange={handleSearchInputChange} />
            <button className={`${globalStyles.btn_reset} ${globalStyles.search__btn} ${styles.news__search_btn}`}></button>
          </form>
        </div>

        <Element name="newsChoice">
          {news?.results && news.results.length > 0 && (
            <article className={styles.news__article} style={{
              backgroundImage: `url("${news.results[0].image ? news.results[0].image : NewsImgLogo}")`,
              backgroundSize: `${news.results[0].image ? 'cover' : 'contain'}`,
              border: `${news.results[0].image ? 'none' : '2px solid #fff'}`
            }} onClick={() => handleLinkClick(news.results[0].id)}>
              <h3 className={styles.news__article_title}>{news.results[0].title}</h3>
              <div className={styles.news__article_text}>Время чтения {news.results[0].reading_time} мин</div>
            </article>
          )}
        </Element>

        <ul className={`${globalStyles.list_reset} ${styles.news__list}`}>
          {news?.results && news.results.map((newsItem, index) => (
            <li className={styles.news__item} key={index} onClick={() => handleLinkClick(newsItem.id)}>
              <img
                className={styles.news__item_img}
                src={newsItem.image ? newsItem.image : NewsImgLogo}
                alt=""
                width={446}
                height={242}
              />
              <div className={styles.news__item_wrapper}>
                <div className={styles.news__item_text}>Время чтения {newsItem.reading_time} мин</div>
                <span className={styles.news__item_separator}></span>
                <div className={styles.news__item_text}>{<FormatDate isoDate={newsItem.date_created} />}</div>
              </div>
              <h4 className={styles.news__item_title}>{newsItem.title}</h4>
            </li>
          ))}
        </ul>

        {news?.total_pages && +news?.total_pages > 1 ? (
          <div className={globalStyles.products_choice__tests_pagination}>
            {Array.from({ length: +news?.total_pages }, (_, index) => (
              <Link
                to="newsChoice"
                spy={true}
                smooth={true}
                duration={500}
                key={index}
              >
                <span
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

export default News;
