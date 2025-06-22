"use client";
import { useBrands } from "./customHooks/useBrands";
import { useTest } from "./customHooks/useTest";
import { IcarBrand } from "./lib/types";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState ,useMemo} from "react";
import { useQueryClient } from "@tanstack/react-query";
import CarModelSkeleton from "@/app/ui/Skeleton";

export default function Home() {
  const { data, isLoading, isError } = useBrands();
  const { dataTest, isLoadingTest, isErrorTest } = useTest();
  const [letters, setLetters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Локальний state
  const queryClient = useQueryClient();
  console.log("Data from useTest:", dataTest,isLoadingTest,isErrorTest);
  

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = queryClient.getQueryData<string>(["searchQuery"]) || "";
    setSearchQuery(query);
  }, []); 
  
  useEffect(() => {
    if (typeof window === "undefined") return; 
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      const query = queryClient.getQueryData<string>(["searchQuery"]) || "";
      setSearchQuery(query);
    });

    return () => unsubscribe();
  }, [queryClient]);

  const handleScroll = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  // Використовуємо useMemo для фільтрації
  const filteredBrands = useMemo(() => {
    if (typeof window === "undefined") return;
    return data?.filter((brand: IcarBrand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [data, searchQuery]);

  // Оновлюємо унікальні літери при зміні `filteredBrands`
  useEffect(() => {
    if (typeof window === "undefined") return;
    else if (filteredBrands?.length) {
      const uniqueLetters = Array.from(new Set(filteredBrands.map((brand) => brand.name[0].toUpperCase())));
      setLetters(uniqueLetters);
    }
  }, [filteredBrands]);

  // if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading brands</div>;

  return (
    <div className={styles.brands}>
      <h2 className={styles.brands__title}>Brands</h2>
      {isLoading  ? (
        <CarModelSkeleton count={30} />
      ) : (<>
      <div className={styles.lettersNavWrapper}>
        <div className={styles.lettersNav}>
          {letters.map((letter) => (
            <button key={letter} onClick={() => handleScroll(letter)} className={styles.letterButton}>
              {letter}
            </button>
          ))}
        </div>
      </div>
      {filteredBrands?.length ? (
        <div className={styles.brands__grid}>
          {filteredBrands.map((brand, index) => {
            const firstLetter = brand.name[0].toUpperCase();
            const showLetter = index === 0 || firstLetter !== filteredBrands[index - 1].name[0].toUpperCase();

            return (
              <div key={brand.name} className={`${styles.brands__div} ${showLetter ? styles.newRow : ''}`}>
                {showLetter && (
                  <div id={`letter-${firstLetter}`} className={styles.brands__letter}>
                    {firstLetter}
                    <div className={styles.fullWidthElement}></div>
                  </div>
                )}
                <div className={styles.brands__item}>
                  <Link href={`/models/${brand.id}/${brand.name}`} className={styles.brands__link} data-testid={`brand-${brand.name}`}>
                    <div className={styles.brands__content}>
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        width={50}
                        height={50}
                        className={styles.brands__image}
                      />
                      <p className={styles.brands__name}>{brand.name}</p>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No brands found</p>
      )}
      </>)}
    </div>
  );
}