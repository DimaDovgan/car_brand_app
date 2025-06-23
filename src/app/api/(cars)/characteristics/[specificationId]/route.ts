import {NextRequest,NextResponse } from 'next/server';
import pool from '@/app/lib/db';
export async function GET(request:NextRequest) {
    try {
       const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  const specificationId = pathSegments[pathSegments.length - 1];
      //  const specificationId = params.specificationId;
      const [characteristics] = await pool.query(
        'SELECT * FROM characteristics WHERE specification_id = ?',
        [specificationId]
      );
      // return NextResponse.json(characteristics, { status: 200 });
      const response = NextResponse.json(characteristics, {status: 200});
    
    // Додаємо необхідні CORS-заголовки
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
    } catch (error) {
      console.error("Помилка отримання характеристик: ", error);
      return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
    }
  }