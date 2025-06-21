"use client";

import { useBrands } from "@/app/customHooks/useBrands";
import { useModels } from "@/app/customHooks/useModels";
import Image from "next/image";
import styles from "./index.module.scss";
import { useRef } from "react";

interface FilterState {
  selectedFuel: string[];
  selectedDrive: string[];
  selectedGearbox: string[];
  yearsRange: { from: string; to: string };
  fuelConsumption: { from: string; to: string; mode: string };
  powerRange: { from: string; to: string };
  engineCapacityRange: { from: string; to: string };
  bodyType: string[];
  brand: string;
  model: string;
  brandId: string;
  modelId: string; 
}

interface HintListProps {
  query: string;
  resetQuery: (filter: FilterState) => void;
  filter: FilterState;
  setShowDropdowns: React.Dispatch<React.SetStateAction<{
    bodyType: boolean;
    yearFrom: boolean;
    yearTo: boolean;
    brandList: boolean;
    modelList: boolean;
  }>>;
  isVisible: boolean;
  type: "brand" | "model"; // <=== визначає, який тип підказки показувати
}

interface Item {
  id: number | string;
  name: string;
  image?: string;
  brand_id?: number | string;

}

export default function HintList({
  query,
  resetQuery,
  filter,
  setShowDropdowns,
  isVisible,
  type
}: HintListProps) {
const { data: brandsData, isLoading: isLoadingB, isError: isErrorB } = useBrands();
  const {
  dataModels,
  isLoadingModels,
  isErrorModels
} = useModels(filter.brandId);
  let data: Item[] | undefined = [];
  let isLoading = false;
  let isError = false;

  if (type === "brand") {

     data = brandsData;
  isLoading = isLoadingB;
  isError = isErrorB;
  } else if (type === "model" ) {
    data = dataModels;
  isLoading = isLoadingModels;
  isError = isErrorModels;
  }
  console.log(data,"DATA",type,isVisible);


  const hintListRef = useRef<HTMLDivElement>(null);
  
  if (!isVisible ) return null;

  const filteredItems = data?.filter((item: Item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

if (!isVisible || !filteredItems || filteredItems.length === 0) return null;
  if (isLoading) return <div className={styles.hintList}>Loading...</div>;
  if (isError) return <div className={styles.hintList}>Error loading {type}s</div>;
  if (!data) return null;

  


  const handleSelect = (item: Item) => {
    resetQuery({
      ...filter,
      [type]: item.name,
      [`${type}Id`]: item.id,
    });
    setShowDropdowns(prev => ({
      ...prev,
      [type === "brand" ? "brandList" : "modelList"]: false
    }));
  };

  

  return (
    <>
    {filteredItems.length > 0  && (
      <div className={styles.hintList} ref={hintListRef}>
      <ul>
        {filteredItems.map((item: Item) => (
          <li
            key={item.id}
            className={styles.brands__item}
            onClick={() => handleSelect(item)}
          >
            <div className={styles.brands__content}>
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
                  className={styles.brands__image}
                />
              )}
              <p className={styles.brands__name}>{item.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>)}
    </>
    
  );
}