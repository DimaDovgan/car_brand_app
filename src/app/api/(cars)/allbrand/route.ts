import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
  try {
    
    const [brands]=await pool.query('SELECT id,name,image FROM brands');
    return NextResponse.json(brands,{status:200});
    
  } catch (error) {
    console.error("Помилка отримання брендів: ", error);
    return NextResponse.json({error:'Помилка сервера'},{status:500});
    
  }
}