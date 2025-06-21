import {NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(request:NextRequest,{params}:{params:{generationId:string}}){
    
    try {
         const generationId = params.generationId
        const [specifications]=await pool.query('SELECT id, generation_id,name,image,years ,value  FROM specifications WHERE generation_id = ?',[generationId])
        return NextResponse.json(specifications,{status:200});
    } catch (error) {
        console.error("Помилка отримання брендів: ", error);
    return NextResponse.json({error:'Помилка сервера'},{status:500});
    }
}