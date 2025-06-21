// "use client";
// import { useSpecifications } from "@/app/customHooks/useSpecifications";
import styles from "./index.module.scss";
import Link from "next/link";
import Image from "next/image";
import React from 'react';
import {CarModelsResponse} from "@/app/lib/types";


interface SpecificationsPageProps {
  carModelsResponse: CarModelsResponse;
  onPageChange: (newPage: number) => void;
}

interface Specs {
  speed?: string;
  acceleration?: string;
  fuel?: string;
}

const SpecificationsPage: React.FC<SpecificationsPageProps> = ({ carModelsResponse, onPageChange }) => {

  const isCarStillProduced = (years: string): boolean => {
    const parts = years.split('-').map(s => s.trim());
    return parts.length === 2 && parts[1] === "";
  }

  if (!carModelsResponse || !carModelsResponse.data.length) {
    return <p>No Specifications found</p>;
  }

  const totalPages = Math.ceil(carModelsResponse.total / carModelsResponse.pageSize);

  return (
    <div className={styles.specification}>
  <h2 >Specifications</h2>
  <div className={styles.specification__list}>
    {carModelsResponse.data.map((spec) => {
      const isActualNow = isCarStillProduced(spec.years);

      const specs: Specs = {};

      const maxSpeedMatch = spec.value.match(/Maximum speed: ([\d.]+ km\/h \| [\d.]+ mph)/);
      const accelerationMatch = spec.value.match(/0-100 km\/h: ([\d.]+ sec), 0-60 mph: ([\d.]+ sec)/);
      const fuelMatch = spec.value.match(/Fuel consumption: (.+)/);

      if (maxSpeedMatch) specs.speed = `Max speed: ${maxSpeedMatch[1]}`;
      if (accelerationMatch) specs.acceleration = `0-100 km/h — ${accelerationMatch[1]}, 0-60 mph — ${accelerationMatch[2]}`;
      if (fuelMatch) specs.fuel = `Fuel Cons.: ${fuelMatch[1].trim()}`;

      return (
        <div
          key={spec.id}
          className={`${styles.specification__item} ${isActualNow ? styles.green_sty : styles.red_sty}`}
        >
          <Link
            href={`/characteristics/${spec.id}/${spec.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}
            className={styles.specification__link}
          >
            <div className={styles.specification__content}>
              <div>
                <Image
                  src={spec.image}
                  alt={spec.name}
                  width={130}
                  height={100}
                  className={styles.models__image}
                />
              </div>
              <p className={styles.specification__name}>{spec.name}</p>
              <p className={`${styles.specification__years} ${isActualNow ? styles.green_col : styles.red_col}`}>
                {spec.years}
              </p>
              <div className={styles.specification__details}>
                {Object.values(specs).map((line, idx) => (
                  <p key={idx} className={styles.specification__detail_line}>{line}</p>
                ))}
              </div>
            </div>
          </Link>
        </div>
      );
    })}
  </div>

  <div className={styles.pagination}>
    <button
      disabled={carModelsResponse.page <= 1}
      onClick={() => onPageChange(carModelsResponse.page - 1)}
      className={styles.pagination__button}
    >
      Previous
    </button>

    <span className={styles.pagination__info}>
      Page {carModelsResponse.page} of {totalPages}
    </span>

    <button
      disabled={carModelsResponse.page >= totalPages}
      onClick={() => onPageChange(carModelsResponse.page + 1)}
      className={styles.pagination__button}
    >
      Next
    </button>
  </div>
</div>
  );
};

export default SpecificationsPage;