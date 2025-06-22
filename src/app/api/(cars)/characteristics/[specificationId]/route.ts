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
      return NextResponse.json(characteristics, { status: 200 });
    } catch (error) {
      console.error("Помилка отримання характеристик: ", error);
      return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
    }
  }