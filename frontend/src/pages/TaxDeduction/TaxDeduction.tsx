import globalStyles from '../../App.module.sass';
import styles from './TaxDeduction.module.sass';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Feedback from '../../components/Feedback/Feedback';

import TaxDeductionDiplom from '../../assets/tax-deduction/tax-deduction-diplom.svg';

import TaxDeductionMethodsImg1 from '../../assets/tax-deduction/tax-deduction-methods-img-1.png';
import TaxDeductionMethodsImg2 from '../../assets/tax-deduction/tax-deduction-methods-img-2.png';

const TaxDeduction = () => {

  const breadcrumbLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Налоговый вычет', href: '/tax-deduction' },
  ];


  return (
    <section className={`${globalStyles.section_padding} ${styles.tax_deduction}`}>
      <div className={globalStyles.container}>
        <Breadcrumbs links={breadcrumbLinks} />

        <div className={styles.tax_deduction__content}>
          <div className={`${globalStyles.bg_blue} ${styles.tax_deduction__text}`}>
            <h2 className={`${globalStyles.title} ${styles.tax_deduction__content_title}`}>Налоговый вычет</h2>
            <p className={styles.tax_deduction__content_descr}>
              У нас имеется лицензия на осуществление образовательной деятельности, которая дает возможность получить компенсацию от государства за обучение
              <br /><br />
              Лицензия на осуществление образовательной деятельности №9757-л (проверить лицензию)
            </p>
          </div>
          <div className={`${globalStyles.bg_red} ${styles.tax_deduction__diplom}`}>
            <img src={TaxDeductionDiplom} alt="Диплом" width={296} />
          </div>
        </div>

        <h2 className={`${globalStyles.title} ${styles.tax_deduction__title}`}>Как получить налоговый вычет?</h2>
        <p className={styles.tax_deduction__descr}>
          Есть 2 способа получить налоговый вычет:
        </p>

        <ul className={`${globalStyles.list_reset} ${styles.tax_deduction__methods}`}>
          <li className={styles.tax_deduction__methods_item}>
            <div className={`${globalStyles.bg_green} ${styles.tax_deduction__methods_item_text}`}>
              <h3 className={styles.tax_deduction__methods_item_title}>Способ №1</h3>
              <div className={styles.tax_deduction__methods_item_subtitle}>Через работодателя</div>
              <p className={styles.tax_deduction__methods_item_descr}>
                Это самый простой способ: бухгалтер просто перестанет удерживать с Вас НДФЛ, пока Вы не получите сумму положенного вычета. Вычет будет приходить частями каждый месяц.
                <br /><br /><br />
                Для этого Вам необходимо предоставить в бухгалтерию следующий пакет документов:
                <br /><br />
                <ul>
                  <li>Копия договора с учебным учреждением с указанными в нем реквизитами лицензии (иногда нужна и копия лицензии);</li>
                  <li>Чеки, подтвержадающие оплату обучения</li>
                </ul>
              </p>
            </div>
            <img className={styles.tax_deduction__methods_img} src={TaxDeductionMethodsImg1} alt="" height={564} />
          </li>
          <li className={styles.tax_deduction__methods_item}>
            <div className={`${globalStyles.bg_green} ${styles.tax_deduction__methods_item_text}`}>
              <h3 className={styles.tax_deduction__methods_item_title}>Способ №2</h3>
              <div className={styles.tax_deduction__methods_item_subtitle}>Через налоговую</div>
              <p className={styles.tax_deduction__methods_item_descr}>
                Если Вам не подходит первый способ получения налогового вычета, то Вы можете оформить его самостоятельно в ФНС (через личный кабинет на сайте ФНС, также можно отправить документы почтой или отнести в отделение налоговой службы лично)
                <br /><br />
                Для этого Вам необходим следующий пакет документов:
                <br /><br />
                <ul>
                  <li>Заполненная декларация 3-НДФЛ (можно на сайте ФНС);</li>
                  <li>Справка 2-НДФЛ о начисленных налогах;</li>
                  <li>Копия договора с учебным учреждением с указанными в нем реквизитами лицензии (иногда нужна и копия лицензии);</li>
                  <li>Чеки, подтвержадающие оплату обучения;</li>
                  <li>Заявление на возврат НДФЛ в связи с расходами на обучение</li>
                </ul>

              </p>
            </div>
            <img className={styles.tax_deduction__methods_img} src={TaxDeductionMethodsImg2} alt="" />
          </li>
          <li className={styles.tax_deduction__methods_item}>
            <div className={`${globalStyles.bg_red} ${styles.tax_deduction__methods_item_text} ${styles.tax_deduction__methods_item_text_center}`}>
              <h3 className={`${styles.tax_deduction__methods_item_title} ${styles.tax_deduction__methods_item_title_margin}`}>Какую сумму Вы <br /> получите?</h3>
              <p className={`${styles.tax_deduction__methods_item_descr} ${styles.tax_deduction__methods_item_descr_margin}`}>
                Вы можете получить до 13% от стоимости курсов. Подробнее о расчетах и другую информацию Вы можете почитать на сайте ФНС
              </p>
              <a className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.tax_deduction__methods_btn}`} href='https://www.nalog.gov.ru/rn77/taxation/taxes/ndfl/nalog_vichet/soc_nv/soc_nv_ob/' target='_blank'>Подробнее</a>
            </div>
            <div className={`${globalStyles.bg_purple} ${styles.tax_deduction__methods_item_text} ${styles.tax_deduction__methods_item_text_center}`}>
              <h3 className={`${styles.tax_deduction__methods_item_title} ${styles.tax_deduction__methods_item_title_margin}`}>Документы для получения налогового вычета</h3>
              <p className={`${styles.tax_deduction__methods_item_descr} ${styles.tax_deduction__methods_item_descr_margin}`}>
                Скачайте необходимые документы и подайте заявку на получение налогового вычета
              </p>
              <a className={`${globalStyles.btn_reset} ${globalStyles.button} ${styles.tax_deduction__methods_btn} ${styles.tax_deduction__methods_btn_link}`} href='download.docx' download>Скачать</a>
            </div>
          </li>
        </ul>



        <Feedback />
      </div>
    </section>
  );
};

export default TaxDeduction;
