"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react";
import axios from "axios";
import { CarModelsResponse} from "../lib/types";

const getData=async (filter:string)=>{
    const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
    : 'http://localhost:3000';
    return axios.get<CarModelsResponse>(`${baseUrl}/api/advancedsearch/filter?${filter}`)
}

export function useFilter(filter:string){
    const {data,isLoading,isSuccess,isError}=useQuery({
        queryKey:['filter',filter],
        queryFn: ()=>getData(filter),
        select:data=>data.data,
        enabled: !!filter, // ❗ Запит виконується тільки якщо id НЕ пустий
        gcTime: 0, // Видаляє кеш одразу після того, як він стає неактивним
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false
        
    })
    // console.log('useFilter',data);
    useEffect(()=>{
        if(isSuccess) console.log('Data fetched successfully');
    },[isSuccess,data])

    useEffect(()=>{
        if(isError) console.log('Error fetched data');
    },[isError])

return {dataFilter:data,isLoadingFilter:isLoading,isSuccessFilter:isSuccess,isErrorFilter:isError};
}