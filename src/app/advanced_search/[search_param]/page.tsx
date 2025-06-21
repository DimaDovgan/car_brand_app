"use client"
import React from 'react';
import { useFilter } from '@/app/customHooks/useFilter';
import {AdvancedSearchForm} from "@/app/ui/AdvancedSearchForm";
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { serializeFilters, deserializeFilters } from '@/app/lib/serializeFiltersURL';
import SpecificationsPage from '@/app/ui/advancedSearchList';
import CarModelSkeleton from "@/app/ui/Skeleton";



const AdvancedSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const initialPage = Number(searchParams?.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  // З десеріалізованим фільтром (окрім page, який відокремлений)
  const [filter, setFilter] = useState(() => {
    // Виключаємо 'page' з параметрів, щоб він не заважав в фільтрах
    const paramsWithoutPage = new URLSearchParams(searchParams?.toString());
    paramsWithoutPage.delete('page');
    return deserializeFilters(paramsWithoutPage);
  });

  // Оновлюємо currentPage якщо змінюється параметр page в URL (при навігації вперед/назад)
  useEffect(() => {
    const pageFromUrl = Number(searchParams?.get('page')) || 1;
    setCurrentPage(pageFromUrl);
  }, [searchParams]);
  const paramsForFilter = serializeFilters(filter);
  const fullParams = new URLSearchParams(paramsForFilter);
  fullParams.set('page', currentPage.toString());

  const { dataFilter, isLoadingFilter, isErrorFilter } = useFilter(fullParams.toString());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const paramsStr = serializeFilters(filter);
    const newParams = new URLSearchParams(paramsStr);
    newParams.set('page', '1');
    queryClient.setQueryData(["navAdvancedSearch"], `/advanced_search/filter?${newParams.toString()}`); 
    router.push(`?${newParams.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const paramsStr = serializeFilters(filter);
    const newParams = new URLSearchParams(paramsStr);
    newParams.set('page', newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div>
      <AdvancedSearchForm filter={filter} onFilterChange={setFilter} onSearch={handleSearch} />
      {isLoadingFilter && <CarModelSkeleton count={30} />}
      {isErrorFilter && <div className="error">Error loading data</div>}
      {dataFilter && <SpecificationsPage carModelsResponse={dataFilter} onPageChange={handlePageChange} />
    }
    </div>
  );
};

export default AdvancedSearch;

