import { useNavigate } from 'react-router-dom';

interface BreadcrumbLink {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  links: BreadcrumbLink[];
}

import globalStyles from '../../App.module.sass';
import styles from './Breadcrumbs.module.sass';

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ links }) => {
  const navigate = useNavigate();

  const handleClick = (href: string) => {
    navigate(href);
  };

  return (
    <nav className={styles.breadcrumb_nav} aria-label="breadcrumb">
      <ol className={`${globalStyles.list_reset} ${styles.breadcrumb}`}>
        {links.map((link, index) => (
          <li
            key={index}
            className={`${styles.breadcrumb__item} ${index === links.length - 1 ? styles.breadcrumb__item_active : ''}`}
            aria-current={index === links.length - 1 ? 'page' : undefined}
          >
            {index !== links.length - 1 ? (
              <button className={`${globalStyles.btn_reset} ${styles.breadcrumb__btn}`} type="button" onClick={() => handleClick(link.href)}>
                {link.name}
              </button>
            ) : (
              link.name
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
