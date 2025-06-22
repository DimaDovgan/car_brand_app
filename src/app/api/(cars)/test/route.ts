import {NextResponse } from 'next/server';

export async function GET() {
  try {

    return NextResponse.json("It is good deal ",{status:200});
    
  } catch (error) {
    console.error("Помилка отримання брендів: ", error);
    return NextResponse.json({error:'Помилка сервера'},{status:500});
    
  }
}