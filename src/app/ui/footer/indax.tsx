import React from "react";
import styles from "./index.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <p className={styles.title}>Курсова робота</p>
          <p className={styles.text}>Дисципліна: Мережні інформаційні технології</p>
          <p className={styles.text}>
           Проєкт "About Cars" — це веб-додаток для пошуку технічних характеристик автомобілів.  
Він дозволяє переглядати моделі, покоління, модифікації та здійснювати фільтрацію за параметрами.  
Дані охоплюють десятки популярних автомобільних брендів світу.
          </p>
        </div>
        <div className={styles.section}>
          <p className={styles.text}>Виконав: Довгань Дмитро</p>
          <p className={styles.text}>Email: dovgand887@mail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;