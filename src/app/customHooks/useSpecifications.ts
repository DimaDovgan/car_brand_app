"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react";
import axios from "axios";
import { IcarSpecifications} from "../lib/types";


const getData=async (id:string)=>{
    return axios.get<IcarSpecifications[]>(`http://localhost:3000/api/specifications/${id}`)
}

export function useSpecifications(id:string){
    const {data,isLoading,isSuccess,isError}=useQuery({
        queryKey:['specification',id],
        queryFn: ()=>getData(id),
        select:data=>data.data,
        enabled: !!id, // ❗ Запит виконується тільки якщо id НЕ пустий
        gcTime: 0, // Видаляє кеш одразу після того, як він стає неактивним
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false
        
    })
    useEffect(()=>{
        if(isSuccess) console.log('Data fetched successfully');
    },[isSuccess,data])

    useEffect(()=>{
        if(isError) console.log('Error fetched data');
    },[isError])

return {dataSpecifications:data,isLoadingSpecifications:isLoading,isSuccessSpecifications:isSuccess,isErrorSpecifications:isError};
}