"use client";
import { useSpecifications } from "@/app/customHooks/useSpecifications";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState,useEffect  } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CarModelSkeleton from "@/app/ui/Skeleton";

interface Specs {
  speed?: string;
  acceleration?: string;
  zeroToSixty?: string;
  fuel?: string;
}

const SpecificationsPage = () => {
  const params = useParams();
  const [id, setId] = useState<string | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (params?.id && params?.option) {
      setId(params.id as string);
      setOption(params.option as string);
      console.log(params,"params");
      queryClient.setQueryData(["navSpecificationsPage"], `/specifications/${params.id}/${params.option}`);
    }
  }, [params]);

  const {dataSpecifications,isLoadingSpecifications,isErrorSpecifications} = useSpecifications(id || "");
  
  const isCarStillProduced=(years:string):boolean=> {
    const parts = years.split('-').map(s => s.trim());
    return parts.length === 2 && parts[1] === "";
    }
  
  if (isErrorSpecifications) return <div>Error loading models</div>;

  return ( 
    <div className={styles.specification}>
      <h2 className={styles.specification__title}>{option} specifications</h2>
      {isLoadingSpecifications || !id ? (
        <CarModelSkeleton count={30} />
      ) : (<>
      {dataSpecifications?.length ? (
        <div className={styles.specification__list}>
          <div>
            <Image
              src={dataSpecifications[0].image}
              alt={dataSpecifications[0].name}
              width={130}
              height={100}
              className={styles.models__image}
            />
          </div>
          {dataSpecifications.map((specifications) => {
            const isActualNaw = isCarStillProduced(specifications.years);
            
            const specs: Specs = {};
        
            const maxSpeedMatch = specifications.value.match(/Maximum speed: ([\d.]+ km\/h \| [\d.]+ mph)/);
            const accelerationMatch = specifications.value.match(/0-100 km\/h: ([\d.]+ sec), 0-60 mph: ([\d.]+ sec)/);
            const fuelMatch = specifications.value.match(/Fuel consumption: (.+)/);
          
            if (maxSpeedMatch) specs.speed = `Max speed: ${maxSpeedMatch[1]}`;
            if (accelerationMatch) specs.acceleration = `0-100 km/h — ${accelerationMatch[1]}, 0-60 mph — ${accelerationMatch[2]}`;
            if (fuelMatch) specs.fuel = `Fuel Cons.: ${fuelMatch[1].trim()}`;
          
            return (
              <div key={specifications.name} className={`${styles.specification__item} ${isActualNaw ? styles.green_sty : styles.red_sty}`}>
                <Link
                  href={`/characteristics/${specifications.id}/${specifications.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}
                  className={styles.specification__link} data-testid={`specification-${specifications.name}`}
                >
                  <div className={styles.specification__content}>
                      <p className={styles.specification__name}>{specifications.name}</p>
                      <p className={`${styles.specification__name} ${isActualNaw ? styles.green_col : styles.red_col}`}>{specifications.years}</p>
                      <div className={styles.specification__item_inf_comp}>
                      {Object.values(specs).map((line, index) => (
                        <p key={index} className={styles.specification__bodytype}>{line}</p>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No Specifications found</p>
      )}</>
      )}
    </div>
  );

};

export default SpecificationsPage ;