"use client";
import { useGeneration } from "@/app/customHooks/useGeneration";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState,useEffect  } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CarModelSkeleton from "@/app/ui/Skeleton";

const Generation = () => {
  const params = useParams();
  const [id, setId] = useState<string | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (params?.id && params?.option) {
      setId(params.id as string);
      setOption(params.option as string);
      console.log(params,"params");
      queryClient.setQueryData(["navGeneration"], `/generation/${params.id}/${params.option}`);
    }
  }, [params]);

  const {dataGeneration,isLoadingGeneration,isErrorGeneration} = useGeneration(id || "");
  
  const isCarStillProduced=(years:string):boolean=> {
    const parts = years.split('-').map(s => s.trim());
    return parts.length === 2 && parts[1] === "";
    }
  

  // if (!id) return <div>Error: Invalid parameters</div>;
  // if (isLoadingGeneration) return <div>Loading...</div>;
  if (isErrorGeneration) return <div>Error loading models</div>;

  return (
    <div className={styles.generation}>
      <h2 className={styles.generation__title}>{option} generations</h2>
      {isLoadingGeneration || !id ? (
        <CarModelSkeleton count={30} />
      ) : (<>
      {dataGeneration?.length ? (
        <div className={styles.generation__list}>
          {dataGeneration.map((generation) =>{const isActualNaw= isCarStillProduced(generation.years); return(
              <div key={generation.name} className={`${styles.generation__item} ${isActualNaw ? styles.green_sty : styles.red_sty}`}>
                  <Link href={`/specifications/${generation.id}/${generation.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`} className={styles.generation__link} data-testid={`generation-${generation.name}`}>
                    <div className={styles.generation__content}>
                      <Image
                        src={generation.image}
                        alt={generation.name}
                        width={130}
                        height={100}
                        className={styles.generation__image}
                      />
                      <div className={styles.generation__item_inf}>
                      <p className={styles.generation__name}>{generation.name}</p>
                      <div className={styles.generation__item_inf_comp}>
                        <p className={`${styles.generation__name} ${isActualNaw ? styles.green_col : styles.red_col}`}>{generation.years}</p>
                        <p className= {styles.generation__bodytype}>{generation.bodyType}</p>
                      </div>
                      <p className={styles.generation__power}>{generation.power}</p>

                      </div>
                      
                    </div>
                  </Link>
                </div>
            )}
          )}
        </div>
      ) : (
        <p>No generation found</p>
      )}</>)}
    </div>
  );

};

export default Generation;