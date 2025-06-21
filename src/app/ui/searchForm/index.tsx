'use client'
import { useState } from "react";
import styles from "./index.module.scss";
import  HintList from "@/app/ui/hintSearchFormList";
import { useQueryClient } from "@tanstack/react-query";
export default function SearchForm(){
    const [query, setQuery] = useState("");
    const queryClient = useQueryClient();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Search query:", query);
      queryClient.setQueryData(["searchQuery"], query);
      setQuery("");
    }; 

    return <div className={styles.search}>
    <h1 className={styles.search__title}>Find Car</h1>
    <form className={styles.search__form} onSubmit={handleSubmit}>
      <input
        className={styles.search__input}
        type="text"
        name="search"
        value={query}
        onChange={handleChange}
        placeholder="Пошук"
        autoComplete="off"  // Вимикає автозаповнення
        spellCheck={false}  // Вимикає перевірку орфографії
        autoCorrect="off"   // Вимикає автоматичні виправлення
      />
      <button className={styles.search__button} type="submit">
        Шукати
      </button>
    </form>
<HintList query={query} resetQuery={setQuery}/>
  </div>
}