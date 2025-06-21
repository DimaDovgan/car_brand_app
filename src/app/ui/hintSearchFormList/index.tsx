"use client"
import { useBrands } from "@/app/customHooks/useBrands";
import Link from "next/link";
import Image from "next/image";
import styles from "./index.module.scss";
export default function HintList({ query, resetQuery }: { query: string; resetQuery: (val: string) => void }) {
    const { data } = useBrands();
    if (!data) return null; // Якщо немає даних, нічого не рендеримо

    const filteredBrands = data.filter((brand) =>
      brand.name.toLowerCase().includes(query.toLowerCase())
    );
  
    return (
      <>
        {filteredBrands.length > 0 && query !== "" && (
          <div className={styles.hintList}>
            <ul>
              {filteredBrands.map((brand) => (
                <Link key={brand.name} href={`/models/${brand.id}/${brand.name}`} onClick={()=>resetQuery("")}  className={styles.brands__link}>
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
              ))}
            </ul>
          </div>
        )}
      </>
    );
  }