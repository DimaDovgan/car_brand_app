"use client";
import { useModels } from "@/app/customHooks/useModels";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState,useEffect  } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CarModelSkeleton from "@/app/ui/Skeleton";

const Models = () => {
  const params = useParams();
  const [id, setId] = useState<string | null>(null);
  const [brandName, setBrandName] = useState<string | null>(null);
  const [navModels, setNavModels] = useState<string[]>([]);
  const queryClient = useQueryClient();
 
  useEffect(() => {
    if (params?.id && params?.brand) {
      setId(params.id as string);
      setBrandName(params.brand as string);
      console.log(params,"params");
      queryClient.setQueryData(["navModels"], `/models/${params.id}/${params.brand}`);
    }
  }, [params]);

  const { dataModels, isLoadingModels, isErrorModels } = useModels(id || "");
  useEffect(() => {
    if (dataModels?.length) {
      const uniqueLetters = new Set<string>();
      dataModels.forEach((model) => uniqueLetters.add(model.name[0].toUpperCase()));
      setNavModels(Array.from(uniqueLetters));
    }
  }, [dataModels]);

  const handleScroll = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isErrorModels) return <div>Error loading models</div>;

  return (
    <div className={styles.models}>
      <h2 className={styles.models__title}>{brandName} models</h2>
      {isLoadingModels || !id ? (
        <CarModelSkeleton count={30} />
      ) : (<>
      {navModels.length > 0 && (
        <div className={styles.models__nav_list}>
          {navModels.map((letter) => (
            <button key={letter} onClick={() => handleScroll(letter)} className={styles.letterButton}>
              {letter}
            </button>
          ))}
        </div>
      )}

      {dataModels?.length ? (
        <div className={styles.models__list}>
          {dataModels.map((model, index) => {
            const firstLetter = model.name[0].toUpperCase();
            const showLetter = index === 0 || firstLetter !== dataModels[index - 1].name[0].toUpperCase();

            return (
              <div key={model.name} className={`${styles.model__div} ${showLetter ? styles.newRow : ""}`}>
                {showLetter && (
                  <div id={`letter-${firstLetter}`} className={styles.model__letter}>
                    {firstLetter}
                    <div className={styles.fullWidthElement}></div>
                  </div>
                )}
                <div key={model.id} className={styles.models__item}>
                  <Link href={`/generation/${model.id}/${brandName}-${model.name}`} className={styles.models__link} data-testid={`model-${model.name}`}>
                    <div className={styles.models__content}>
                      <Image
                        src={model.image}
                        alt={model.name}
                        width={130}
                        height={100}
                        className={styles.models__image}
                      />
                      <p className={styles.models__name}>{model.name}</p>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No models found</p>
      )}
      </>)}
    </div>
  );
};

export default Models;