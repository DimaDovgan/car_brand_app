import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET( request:NextRequest,{params}:{params:{brandId:string}}){
    
    try {
//          const url = new URL(request.url);
//   const pathSegments = url.pathname.split('/');
//   const brandId = pathSegments[pathSegments.length - 1];
         const brandId = params.brandId;
        const [models]=await pool.query('SELECT id, brand_id,name,image FROM models WHERE brand_id = ?',[brandId])
        return NextResponse.json(models,{status:200});
    } catch (error) {
        console.error("Помилка отримання брендів: ", error);
    return NextResponse.json({error:'Помилка сервера'},{status:500});
    }
}