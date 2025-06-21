import styles from "./index.module.scss";

interface BurgerMenuProps {
  toggleMenu: () => void; 
  isOpen: boolean; 
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ toggleMenu, isOpen }) => {
  return (
    <div className={styles.burgerMenu} onClick={toggleMenu}>
      <div className={`${styles.bar} ${isOpen ? styles.open1 : ""}`}></div>
      <div className={`${styles.bar} ${isOpen ? styles.open2 : ""}`}></div>
      <div className={`${styles.bar} ${isOpen ? styles.open3 : ""}`}></div>
    </div>
  );
};

export default BurgerMenu;