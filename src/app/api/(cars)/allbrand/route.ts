import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
  try {
    
    const [brands]=await pool.query('SELECT id,name,image FROM brands');
    // return NextResponse.json(brands,{status:200});
    const response = NextResponse.json(brands, {status: 200});
    
    // Додаємо необхідні CORS-заголовки
    response.headers.set('Access-Control-Allow-Origin', 'https://car-brand-app-git-main-dmitrys-projects-95a88bf3.vercel.app/');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
    
  } catch (error) {
    console.error("Помилка отримання брендів: ", error);
    return NextResponse.json({error:'Помилка сервера'},{status:500});
    
  }
}
// import { NextResponse } from 'next/server';
// import pool from '@/app/lib/db';
// import { RowDataPacket } from 'mysql2';

// interface Brand {
//   id: number;
//   name: string;
//   image: string;
// }

// export async function GET() {
//   console.log('Запит до /api/brands отримано');

//   try {
//     console.log('Спроба підключення до БД...');
//     const connection = await pool.getConnection();
//     console.log('Підключення до БД успішне');
//     connection.release();

//     console.log('Виконується запит до БД...');
//     const [brands] = await pool.query<RowDataPacket[]>('SELECT id, name, image FROM brands');
    
//     // Type assertion that brands is an array
//     const brandsArray = brands as Brand[];
//     console.log('Запит до БД виконано успішно, знайдено брендів:', brandsArray.length);

//     return NextResponse.json(brandsArray, { status: 200 });
    
//   } catch (error: unknown) {
//     console.error("Помилка при роботі з БД: ", error);
    
//     // Type guard to check if error is an instance of Error
//     if (error instanceof Error) {
//       // Type guard for NodeJS.ErrnoException to access code property
//       const nodeError = error as NodeJS.ErrnoException;
      
//       if (nodeError.code === 'ECONNREFUSED') {
//         console.error('Помилка: Не вдалося підключитися до сервера БД');
//         return NextResponse.json(
//           { error: 'Не вдалося підключитися до бази даних' },
//           { status: 503 }
//         );
//       } else if (nodeError.code === 'ER_ACCESS_DENIED_ERROR') {
//         console.error('Помилка: Невірні дані для підключення до БД');
//         return NextResponse.json(
//           { error: 'Помилка автентифікації до бази даних' },
//           { status: 500 }
//         );
//       }
//     }

//     // Check for other specific error cases
//     if (typeof error === 'object' && error !== null && 'code' in error) {
//       const dbError = error as { code: string };
//       if (dbError.code === 'ER_NO_SUCH_TABLE') {
//         console.error('Помилка: Таблиця не існує');
//         return NextResponse.json(
//           { error: 'Таблиця брендів не знайдена' },
//           { status: 404 }
//         );
//       }
//     }

//     return NextResponse.json(
//       { error: 'Внутрішня помилка сервера' },
//       { status: 500 }
//     );
//   }
// }