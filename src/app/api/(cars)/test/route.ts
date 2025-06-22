import {NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json("It is good deal ", {status: 200});
response.headers.set('Access-Control-Allow-Origin', 'https://car-brand-app-git-main-dmitrys-projects-95a88bf3.vercel.app/');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;

    
  } catch (error) {
    console.error("Помилка отримання брендів: ", error);
    return NextResponse.json({error:'Помилка сервера'},{status:500});
    
  }
}