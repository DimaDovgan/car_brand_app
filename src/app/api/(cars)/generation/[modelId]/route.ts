import { NextRequest,NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(request:NextRequest,{params}:{params:{modelId:string}}){
    
    try {
        const modelId = params.modelId;
        const [generations]=await pool.query('SELECT id, model_id,name,image,years,bodyType,power FROM generations WHERE model_id = ?',[modelId])
        return NextResponse.json(generations,{status:200});
    } catch (error) {
        console.error("Помилка отримання брендів: ", error);
    return NextResponse.json({error:'Помилка сервера'},{status:500});
    }
}