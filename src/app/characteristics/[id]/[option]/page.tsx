"use client";
import { useCharacteristics} from "@/app/customHooks/useCharacteristics";
import styles from "./page.module.scss";
// import { IcarGeneration } from "@/app/lib/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState,useEffect  } from "react";
import {Icarcharacteristics} from "@/app/lib/types";
import defaultCarImage from '@/../public/images/default_car.jpg';
import { useQueryClient } from "@tanstack/react-query";
import CarModelSkeleton from "@/app/ui/Skeleton";


const isImageValue = (value: string | null): boolean => {
  return !!value && /\.(jpg|jpeg|png|gif|webp)$/i.test(value);
};

const CharacteristicsPage = () => {
  const params = useParams<{ id?: string; option?: string }>();
  const [id, setId] = useState<string | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(defaultCarImage.src);
  const [groupedCharacteristics, setGroupedCharacteristics] = useState<{ [key: string]: Icarcharacteristics[] }>({});
  const queryClient = useQueryClient();
  const {
    dataCharacteristics,
    isLoadingCharacteristics,
    isSuccessCharacteristics,
    isErrorCharacteristics
  } = useCharacteristics(id || "");

  useEffect(() => {
    if (params?.id && params?.option) {
      setId(params.id);
      setOption(params.option);
      console.log(params,"params",option,"option");
      queryClient.setQueryData(["navCharacteristicsPage"], `/characteristics/${params.id}/${params.option}`);
    }
  }, [params]);

  useEffect(() => {
    if (dataCharacteristics) {
      const imageProperty = dataCharacteristics.find(
        property => property && typeof property.characteristic === 'string' && isImageValue(property.value)
      );
      if (imageProperty?.value) {
        setImageUrl(imageProperty.value);
      }
  
      const grouped = groupProperties(dataCharacteristics);
      const filteredGrouped = Object.entries(grouped)
        .filter(([_, items]: [string, Icarcharacteristics[]]) => items.length > 0)
        .reduce((acc, [key, val]) => {
          acc[key] = val;
          return acc;
        }, {} as { [key: string]: Icarcharacteristics[] });
  
      setGroupedCharacteristics(filteredGrouped);
    }
  }, [dataCharacteristics]);

  const groupProperties = (arr: (Icarcharacteristics | null | undefined)[]) => {
    const obj: { [key: string]: Icarcharacteristics[] } = {
      'Basic Information': [],
      'Engine': [],
      'Power and Performance': [],
      'Fuel Consumption': [],
      'Dimensions and Weight': [],
      'Chassis': [],
      'Electric Components': [],
      'Additional Parameters': [],
    };
  
    arr.forEach((property) => {
      if (property && typeof property.characteristic === 'string') {
        if (isImageValue(property.value)) return;
        const group = typeof property.group === 'string' && property.group.trim()
          ? property.group
          : 'Ungrouped'; 
        
        if (!obj[group]) {
          obj[group] = [];
        }
        obj[group].push({
          ...property,
          value: property.value ?? "",
        });
      }
    });
    return obj;
  };

  if (isErrorCharacteristics) {
    return <div>Error loading characteristics</div>;
  }
  const characteristicsForShotChar = ["Body type",
    "Maximum speed",
    "Acceleration 0 - 100 km/h",
    "Acceleration 0 - 60 mph (Calculated by Auto-Data.net)",
    "Power",
    "Torque",
    "Engine displacement",
    "Number of cylinders",
    "Drive wheel",
    "Length",
    "Width",
    "Kerb Weight",
    "Max. weight",
    "Trunk (boot) space - minimum",
    "Number of gears and type of gearbox"];



  return (
    <> {isLoadingCharacteristics || !id ? (
        <CarModelSkeleton count={30} />
      ) : ( <>
    
    {isSuccessCharacteristics &&  Object.keys(groupedCharacteristics).length  ? <div>
      <h2 className={styles.characteristics__title}>{groupedCharacteristics['Basic Information'].find(item => item.characteristic === "Brand")?.value} {groupedCharacteristics['Basic Information'].find(item => item.characteristic === "Generation")?.value} 
      {groupedCharacteristics['Basic Information'].find(item => item.characteristic === "Modification (Engine)")?.value} {groupedCharacteristics['Basic Information'].find(item => item.characteristic === "Start of production")?.value || "-"} &mdash; {groupedCharacteristics['Basic Information'].find(item => item.characteristic === "End of production")?.value || "-"}
        </h2>

</div>:<p>Не знайдено інформації</p>}
    <div className={styles.characteristics}>
      <div className={styles.characteristics__imageContainer}>
      {isSuccessCharacteristics &&  Object.keys(groupedCharacteristics).length  ? (
        <div>
           <Image
          src={imageUrl} 
          alt="Характеристика товару" 
          width={130}
          height={100}
          className={styles.characteristics__mainImage}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultCarImage.src;
          }}
        />
        <table className={styles.characteristics__table}>
  <tbody>
    {Object.entries(groupedCharacteristics)
      .flatMap(([_, items]) => items)
      .filter(item => characteristicsForShotChar.includes(item.characteristic))
      .map(item => (
        <tr key={item.id} className={styles.characteristics__row}>
          <td className={styles.characteristics__cell}>
            <strong>{item.characteristic}:</strong>
          </td>
          <td className={styles.characteristics__cell}>
            {item.value}
          </td>
        </tr>
      ))}
  </tbody>
</table>
</div>
) : (
        <p className={styles.characteristics__noData}>Немає даних для відображення</p>
      )}
       
      </div>

      {isSuccessCharacteristics &&  Object.keys(groupedCharacteristics).length  ? (
        <div>
          {Object.entries(groupedCharacteristics).map(([groupName, items]: [string, Icarcharacteristics[]]) => (
              <div key={`group-${groupName}`} className={styles.characteristics__group}>
                <h3 className={styles.characteristics__groupTitle}>{groupName}</h3>  
                <table className={styles.characteristics__table}>
  <tbody>
    {items.filter(item => item.value && !isImageValue(item.value))
      .map(item => (
        <tr key={item.id} className={styles.characteristics__row}>
          <td className={styles.characteristics__cell}>
            <strong>{item.characteristic}:</strong>
          </td>
          <td className={styles.characteristics__cell}>
            {item.value}
          </td>
        </tr>
      ))}
  </tbody>
</table>
              </div>
            ))}
        </div>
      ) : (
        <p className={styles.characteristics__noData}>Немає даних для відображення</p>
      )}
    </div></>)}</>
  );
};

export default CharacteristicsPage;




