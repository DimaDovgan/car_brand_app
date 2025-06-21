import React from 'react';
import styles from './index.module.scss'; // Імпортуємо нові стилі

interface CarModelSkeletonProps {
  count?: number; // Кількість елементів скелетону для відображення
}

const CarModelSkeleton: React.FC<CarModelSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className={styles.skeletonGrid} data-testid="skeleton-loader">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeletonItem} data-testid="skeleton-item">
          <div className={styles.skeletonImage}></div>
          <div className={styles.skeletonText}></div>
        </div>
      ))}
    </div>
  );
};

export default CarModelSkeleton;