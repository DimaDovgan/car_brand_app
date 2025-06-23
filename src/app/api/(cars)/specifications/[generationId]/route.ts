import {NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(request:NextRequest){
    
    try {
        const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  const generationId = pathSegments[pathSegments.length - 1];
        //  const generationId = params.generationId
        const [specifications]=await pool.query('SELECT id, generation_id,name,image,years ,value  FROM specifications WHERE generation_id = ?',[generationId])
        // return NextResponse.json(specifications,{status:200});
         const response = NextResponse.json(specifications, {status: 200});
    
    // Додаємо необхідні CORS-заголовки
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
    } catch (error) {
        console.error("Помилка отримання брендів: ", error);
    return NextResponse.json({error:'Помилка сервера'},{status:500});
    }
}