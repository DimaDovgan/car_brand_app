import PersonIcon from '@/../public/images/person-icon.svg';
import EmblemUa from '@/../public/images/emblemUa.svg';
import SearchForm from '../searchForm';
import  Nav from '../navigation';
import Image from "next/image";
import styles from './index.module.scss'
export default function Header(){

    return <div className={styles.header__bg}><div className={styles.header}>
    <div className={styles.header__top}>
      <div className={styles.header__logo}>
        <span className={styles.header__logo_text}>About cars  </span>
        <Image
          priority
          src={EmblemUa}
          alt="ua"
          width={25}
          height={25}
        />
      </div>
      <Image
        className={styles.header__icon}
        priority
        src={PersonIcon}
        alt="PersonIcon"
        width={35}
        height={35}
      />
    </div>
    <div className={styles.header__search}>
      <SearchForm />
    </div>
  </div>
  <Nav />
  </div>
}