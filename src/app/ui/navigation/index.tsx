"use client"
import { usePathname } from "next/navigation";
import Link from "next/link";
import BurgerMenu from "../burgerbtn";
import styles from "./index.module.scss";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
export default function Nav(){

    const pathname = usePathname();
    const [isOpen,setIsOpen]=useState(false);
    // const { data: navModels } = useQuery<string>({ queryKey: ["navModels"],queryFn: async () => "", enabled: false, });
    const { data: navModels } = useQuery<string>({ queryKey: ["navModels"], queryFn: async () => "", enabled: false });
const { data: navGenerations } = useQuery<string>({ queryKey: ["navGeneration"], queryFn: async () => "", enabled: false });
const { data: navSpecifications } = useQuery<string>({ queryKey: ["navSpecificationsPage"], queryFn: async () => "", enabled: false });
const { data: navCharacteristics } = useQuery<string>({ queryKey: ["navCharacteristicsPage"], queryFn: async () => "", enabled: false });
const { data: navAdvancedSearch } = useQuery<string>({ queryKey: ["navAdvancedSearch"], queryFn: async () => "", enabled: false });
    
    const [navLinks, setNavLinks] = useState([
      { href: "/", label: "brands" },
      { href: "", label: "models" },
      { href: "", label: "generations" },
      { href: "", label: "specifications" },
      { href: "", label: "characteristics" },
      { href: "/advanced_search/filter", label: "advanced search" },
    ]);


    useEffect(() => {
      setNavLinks(prev =>
        prev.map(link => {
          switch (link.label) {
            case "models":
              return navModels ? { ...link, href: navModels } : link;
            case "generations":
              return navGenerations ? { ...link, href: navGenerations } : link;
            case "specifications":
              return navSpecifications ? { ...link, href: navSpecifications } : link;
            case "characteristics":
              return navCharacteristics ? { ...link, href: navCharacteristics } : link;
            case "advanced search":
              return navAdvancedSearch ? { ...link, href: navAdvancedSearch } : link;
            default:
              return link;
          }
        })
      );
    }, [navModels, navGenerations, navSpecifications, navCharacteristics, navAdvancedSearch]);


      
      const toggleModal=()=>{
        setIsOpen(!isOpen);
        console.log(isOpen,"isOpen")
      }
    
      return (
        <nav className={styles.nav}>
        <div className={styles.nav__headlines}>
      <BurgerMenu isOpen={isOpen} toggleMenu={toggleModal}/>
      <Link href="/advanced_search/filter" className={styles.nav__headlines__advancedSearch_button} >
        Advanced search
      </Link>
      </div>
      <div className={`${styles.nav__component} ${isOpen ? styles.open : ""}`}>
          <ul className={styles.nav__component_list}>
            {navLinks.map(({ href, label }) => (
              <li key={label} className={styles.nav__component_list_item}>
                <Link
                style={ href==="" ? { pointerEvents: "none", opacity: 0.6 } : {}}
                  href={href}
                  className={`${styles.nav__component_list_item_link} ${pathname === href ? styles.nav__component_list_item_active : styles.nav__component_list_item_hover}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          </div>
        </nav>
      );
}