"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react";
import axios from "axios";
// import { IcarBrand } from "../lib/types";


const getData=async ()=>{
    const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
    : 'http://localhost:3000';
    return axios.get(`${baseUrl}/api/test`)
}

export function useTest(){
    const {data,isLoading,isSuccess,isError}=useQuery({
        queryKey:['test'],
        queryFn: getData,
        select:data=>data,
        staleTime: Infinity,  // Дані ніколи не вважаються застарілими
        refetchOnWindowFocus: false, // Вимикає оновлення при фокусі на вікні
        refetchOnReconnect: false,   // Вимикає оновлення при повторному підключенні
        refetchInterval: false,      // Вимикає періодичні оновлення
        
    })
    useEffect(()=>{
        if(isSuccess) console.log('Data fetched successfully');
    },[isSuccess,data])

    useEffect(()=>{
        if(isError) console.log('Error fetched data');
    },[isError])

return {dataTest:data,isLoadingTest:isLoading,isSuccessTest:isSuccess,isErrorTest: isError};
}