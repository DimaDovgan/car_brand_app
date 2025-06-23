import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
type SqlParam = string | number | boolean | null;
import { RowDataPacket } from 'mysql2';

interface Row extends RowDataPacket {
  specification_id: number;
}

const characteristicMap: Record<string, string> = {
  brand_name: 'Brand',
  model_name: 'Model',
  body: 'Body type',
  year_from: 'Start of production',
  year_to: 'End of production',
  fuel: 'Fuel Type',
  drive: 'Drive wheel',
  gearbox: 'Number of gears and type of gearbox',
  engine_from: 'Engine displacement',
  engine_to: 'Engine displacement',
  power_from: 'Power',
   power_to: 'Power',
};

const fuelTypesGrouped: Record<string, string[]> = {
  Petrol: ['Petrol (Gasoline)', 'Synthetic gasoline'],
  Diesel: ['Diesel'],
  Electric: ['Electricity'],
  LPG: ['LPG', 'Petrol / LPG', 'Petrol / CNG'],
  CNG: ['Petrol / CNG'],
  Hydrogen: ['Hydrogen', 'Hydrogen / electricity'],
  Ethanol: ['Petrol / Ethanol - E85', 'Petrol / Ethanol - E85 / electricity', 'Ethanol - E85'],
  Hybrid: ['Petrol / electricity', 'Diesel / electricity'],
  'Other / Mixed': ['Mixture of two stroke engine'],
};

const bodyStylesGrouped: Record<string, string[]> = {
  Sedan: ['Sedan', 'Sedan, Fastback', 'Fastback', 'Liftback', 'Coupe, Liftback', 'Crossover, Fastback', 'Coupe, Fastback', 'Hatchback, Fastback', 'Coupe, SUV, Fastback'],
  Hatchback: ['Hatchback', 'Coupe, Hatchback', 'Cabriolet, Hatchback'],
  Wagon: ['Station wagon (estate)', 'Station wagon (estate), Crossover', 'Station wagon (estate), MPV'],
  Coupe: ['Coupe', 'Coupe, SUV', 'Coupe, Crossover', 'Coupe, CUV', 'Coupe, Cabriolet', 'Coupe - Cabriolet', 'Coupe - Cabriolet, Roadster'],
  'Cabriolet / Roadster / Targa': ['Cabriolet', 'Cabriolet, Roadster', 'Cabriolet, SUV', 'Off-road vehicle, Cabriolet', 'Targa', 'SUV, Targa', 'Pick-up, Targa', 'Roadster'],
  'SUV / Crossover': ['SUV', 'Crossover', 'SUV, Crossover', 'Off-road vehicle', 'Coupe, SUV', 'Off-road vehicle, SUV', 'SUV, MPV', 'Coupe, SUV, Crossover', 'Off-road vehicle, Cabriolet, SUV', 'Off-road vehicle, Coupe', 'Off-road vehicle, Pick-up', 'CUV'],
  'Minivan / MPV': ['MPV', 'Minivan', 'Minivan, MPV', 'Minivan, Crossover', 'Мікровен'],
  Pickup: ['Pick-up', 'Pick-up, Targa', 'Pick-up, SUV', 'Off-road vehicle, Pick-up'],
  'Limousine / Grand Tourer': ['Лімузин', 'Grand Tourer'],
  'Quad / Utility': ['Quadricycle', 'Van']
};

async function filterBy(
  matchingIds: number[] | null,
  query: string,
  params: (string | number | boolean | null)[]
): Promise<number[]> {
  if (matchingIds !== null && matchingIds.length > 0) {
    query += ` AND specification_id IN (${matchingIds.map(() => '?').join(',')})`;
    params.push(...matchingIds);
  }
  
  const [rows] = await pool.query<Row[]>(query, params);
  return rows.map(r => r.specification_id);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  try {
    let matchingIds: number[] | null = null;

    for (const [key, val] of searchParams.entries()) {
      if (key === 'page' || !val) continue;
      
      const group = characteristicMap[key];
      if (!group) {
        console.warn(`Unknown filter key: ${key}`);
        continue;
      }

      if (key === 'gearbox') {

  const gearboxValues = val.split(',').map(v => v.trim().toLowerCase());

  const gearboxConditions: string[] = [];
  const gearboxParams: string[] = [];

  // Завжди перевіряємо characteristic
  const baseCondition = `characteristic = 'Number of gears and type of gearbox'`;

  if (gearboxValues.includes('manual')) {
    gearboxConditions.push(`(${baseCondition} AND LOWER(value) LIKE ?)`);
    gearboxParams.push('%manual%');
  }

  if (gearboxValues.includes('cvt')) {
    gearboxConditions.push(`(${baseCondition} AND (LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR LOWER(value) LIKE ?))`);
    gearboxParams.push('%cvt%', '%xtronic%', '%ivt%', '%ecvt%');
  }

  if (gearboxValues.includes('semi-automatic')) {
    gearboxConditions.push(`(${baseCondition} AND (
      LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR
      LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR
      LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR
      LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR
      LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR
      LOWER(value) LIKE ? OR LOWER(value) LIKE ? 

    ))`);
    gearboxParams.push('%semi%','%dct%', '%easytronic%', '%selespeed%','%tct%', '%robot%', '%amt%', '%ags%','%smg%','%etg%','%s-tronic%', '%dsg%', '%DSG%', '%pdk%','%dual clutch%','%dualogic%','%powershift%');
  }

  if (gearboxValues.includes('automatic')) {
    gearboxConditions.push(`(${baseCondition} AND (
      LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR
      LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR LOWER(value) LIKE ? OR
      LOWER(value) LIKE ? OR LOWER(value) LIKE ?
    ))`);
    gearboxParams.push(
      '%automatic%', '%tiptronic%', '%tronic%',
      '%selectshift%', '%powershift%', '%hydra%','%aut%',
  '%auto%'
    );
  }

  const gearboxWhereClause = gearboxConditions.length > 0
    ? `(${gearboxConditions.join(' OR ')})`
    : '1=0'; 

  matchingIds = await filterBy(
    matchingIds,
    `SELECT specification_id FROM characteristics WHERE ${gearboxWhereClause}`,
    gearboxParams
  );
}

      // Обробка палива з групами
      else if (key === 'fuel') {
        const fuelValues = val.split(',').filter(Boolean);
  let allVariants: string[] = [];

  for (const fuelType of fuelValues) {
    const variants = fuelTypesGrouped[fuelType];
    if (variants) {
      allVariants = allVariants.concat(variants);
    }
  }
  if (allVariants.length === 0) continue;
  allVariants = Array.from(new Set(allVariants));

  matchingIds = await filterBy(
    matchingIds,
    `SELECT specification_id FROM characteristics 
     WHERE characteristic = ? AND value IN (${allVariants.map(() => '?').join(',')})`,
    [group, ...allVariants]
  );

      }
      else if (key === 'drive') {
  const driveValues = val.split(',').filter(Boolean);
  if (driveValues.length === 0) continue;

  matchingIds = await filterBy(
    matchingIds,
    `SELECT specification_id FROM characteristics WHERE characteristic = ? AND value IN (${driveValues.map(() => '?').join(',')})`,
    [group, ...driveValues]
  );
}
      // Обробка типу кузова з групами
      else if (key === 'body') {
        const variants = bodyStylesGrouped[val];
        if (!variants) continue;
        
        matchingIds = await filterBy(
          matchingIds,
          `SELECT specification_id FROM characteristics 
           WHERE characteristic = ? AND value IN (${variants.map(() => '?').join(',')})`,
          [group, ...variants]
        );
      }
      // Фільтри "від/до" для числових значень
      else if (key.endsWith('_from') || key.endsWith('_to')) {
        const operator = key.endsWith('_from') ? '>=' : '<=';

        if (key === 'year_from' || key === 'year_to') {
  const yearFrom = parseInt(searchParams.get('year_from') || '0');
  const yearTo = parseInt(searchParams.get('year_to') || '9999');

  if (!searchParams.get('year_checked')) {
    searchParams.set('year_checked', '1');

    const baseQuery = `
      SELECT start_c.specification_id
      FROM characteristics AS start_c
      JOIN characteristics AS end_c
        ON start_c.specification_id = end_c.specification_id
      WHERE start_c.characteristic = 'Start of production'
        AND end_c.characteristic = 'End of production'
        AND CAST(REGEXP_SUBSTR(start_c.value, '[0-9]{4}') AS DECIMAL) <= ?
        AND CAST(REGEXP_SUBSTR(end_c.value, '[0-9]{4}') AS DECIMAL) >= ?
    `;

    let finalQuery = baseQuery;
    const params: SqlParam[] = [yearTo, yearFrom];

    if (matchingIds && matchingIds.length > 0) {
      finalQuery += ` AND start_c.specification_id IN (${matchingIds.map(() => '?').join(',')})`;
      params.push(...matchingIds);
    }

    // console.log('Executing query:', finalQuery, params);

    const [rows] = await pool.query<Row[]>(finalQuery, params) 
    matchingIds = rows.map(r => r.specification_id);
  }

  continue;
}
        // Спеціальна обробка для об'єму двигуна
        else if (key === 'engine_from' || key === 'engine_to') {

           matchingIds = await filterBy(
    matchingIds,
    `SELECT specification_id FROM characteristics 
     WHERE characteristic = 'Engine displacement'
       AND CAST(SUBSTRING_INDEX(value, ' ', 1) AS UNSIGNED) / 1000 ${operator} ?`,
    [val]
  );

        }
        // Спеціальна обробка для потужності
        else if (key === 'power_from' || key === 'power_to') {
          matchingIds = await filterBy(
            matchingIds,
            `SELECT specification_id FROM characteristics 
             WHERE characteristic = ? AND CAST(SUBSTRING_INDEX(value, ' ', 1) AS DECIMAL) ${operator} ?`,
            [group, val]
          );
        }
        else {
          matchingIds = await filterBy(
            matchingIds,
            `SELECT specification_id FROM characteristics 
             WHERE characteristic = ? AND CAST(value AS DECIMAL) ${operator} ?`,
            [group, val]
          );
        }
      }
      // Точний збіг для інших характеристик
      else {
        // console.log(`Exact match for ${key}=${val}`);
        matchingIds = await filterBy(
          matchingIds,
          `SELECT specification_id FROM characteristics WHERE characteristic = ? AND value = ?`,
          [group, val]
        );
      }

      // Якщо після фільтрації немає результатів - припиняємо
      if (!matchingIds || matchingIds.length === 0) {
        console.log(`No matches after filter ${key}=${val}`);
        break;
      }
    }

    let cars;
let total;

if (matchingIds === null) {
  // 👉 Фільтри не застосовані — повертаємо випадкові машини
  const [randomCars] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM specifications ORDER BY RAND() LIMIT ? OFFSET ?`,
    [pageSize, offset]
  );

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as count FROM specifications`
  );

  const count = countRows[0]?.count ?? 0;

  cars = randomCars;
  total = count;
} else if (matchingIds.length === 0) {
  // 👉 Фільтри застосовані, але нічого не знайдено
  // return NextResponse.json({ page, pageSize, total: 0, data: [] });
  const emptyResponse = NextResponse.json({ page, pageSize, total: 0, data: [] });
      emptyResponse.headers.set('Access-Control-Allow-Origin', '*');
      emptyResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      emptyResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return emptyResponse;
} else {
  // 👉 Є знайдені ID, фільтри застосовано
  total = matchingIds.length;
  const limitedIds = matchingIds.slice(offset, offset + pageSize);

  const [filteredCars] = await pool.query(
    `SELECT * FROM specifications WHERE id IN (${limitedIds.map(() => '?').join(',')})`,
    [...limitedIds]
  );

  cars = filteredCars;
}

const successResponse = NextResponse.json({
      page,
      pageSize,
      total,
      data: cars,
    });

    successResponse.headers.set('Access-Control-Allow-Origin', '*');
    successResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    successResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return successResponse;

    // return NextResponse.json({
    //   page,
    //   pageSize,
    //   total,
    //   data: cars,
    // });

  } catch (error: unknown) {
    const err = error as Error;
  console.error('Filter error:', err)
  const errorResponse = NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
    
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return errorResponse;
    // return NextResponse.json(
    //   { error: 'Internal server error', details: err.message },
    //   { status: 500 }
    // );
  }
}

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);

//   const pageParam = searchParams.get('page');
//   const page = pageParam ? Math.max(parseInt(pageParam), 1) : 1;
//   const pageSize = 20;
//   const offset = (page - 1) * pageSize;
//   console.log(searchParams, "searchParams");

//   let matchingIds: number[] | null = null;

//   for (const [key, val] of searchParams.entries()) {
//     if (key === 'page') continue;
//     console.log(key,"key", val, "val");

//     const group = characteristicMap[key];
//     if (!group) continue;

//     let currentIds: number[] = [];

//     if (key === 'gearbox') {
//   // val - це тип трансмісії з фронтенда: 'Manual', 'CVT', 'Semi-automatic', 'Automatic'
//   const [rows] = await pool.query(
//     `SELECT specification_id FROM v_transmission_categories WHERE transmission_type = ?`,
//     [val]
//   );
//   console.log(rows, "rows");
//   currentIds = rows.map((r: any) => r.specification_id);
// }

//     // 1️⃣ Груповані значення для FUEL
//     if (key === 'fuel') {
//       const variants = fuelTypesGrouped[val];
//       if (!variants) continue;

//       const [rows] = await pool.query(
//         `SELECT specification_id FROM characteristics WHERE characteristic = ? AND value IN (${variants.map(() => '?').join(',')})`,
//         [group, ...variants]
//       );
//       currentIds = rows.map((r: any) => r.specification_id);
//     }

//     // 2️⃣ Груповані значення для BODY
//     else if (key === 'body') {
//       const variants = bodyStylesGrouped[val];
//       if (!variants) continue;

//       const [rows] = await pool.query(
//         `SELECT specification_id FROM characteristics WHERE characteristic = ? AND value IN (${variants.map(() => '?').join(',')})`,
//         [group, ...variants]
//       );
//       console.log(rows, "rows");
//       currentIds = rows.map((r: any) => r.specification_id);
//     }

//     // 3️⃣ FROM / TO числові фільтри

//     else if (key === 'year_from' || key === 'year_to') {
//   const operator = key === 'year_from' ? '>=' : '<=';
//   const [rows] = await pool.query(
//     `SELECT specification_id 
//      FROM characteristics 
//      WHERE characteristic = ? 
//      AND CAST(SUBSTRING_INDEX(value, ' ', 1) AS DECIMAL) ${operator} ?`,
//     [group, val]
//   );
//   currentIds = rows.map((r: any) => r.specification_id);
// }
// else if (key === 'engine_from' || key === 'engine_to') {
//   const operator = key === 'engine_from' ? '>=' : '<=';
//   const [allRows] = await pool.query(
//     `SELECT specification_id, value 
//      FROM characteristics 
//      WHERE characteristic = ?`,
//     [group]
//   );

//   currentIds = allRows.filter(row => {
//     // Витягуємо перше число з рядка (1998 з "1998 cm3" або 1.8 з "1.8L")
//     const numMatch = row.value.match(/[0-9]+(?:\.[0-9]+)?/);
//     if (!numMatch) return false;
    
//     const num = parseFloat(numMatch[0]);
//     // Якщо число > 100 (сміттєві значення), конвертуємо в літри
//     const liters = num > 100 ? num / 1000 : num;
    
//     return operator === '>=' ? liters >= parseFloat(val) : liters <= parseFloat(val);
//   }).map(row => row.specification_id);
// }
// // else if (key === 'engine_from' || key === 'engine_to') {
// //   const operator = key === 'engine_from' ? '>=' : '<=';
// //   const [rows] = await pool.query(
// //     `SELECT specification_id 
// //      FROM characteristics 
// //      WHERE characteristic = ? 
// //      AND CAST(SUBSTRING_INDEX(REPLACE(value, ' cm3', ''), ' ', 1) AS DECIMAL) ${operator} ?`,
// //     [group, val]
// //   );
// //   currentIds = rows.map((r: any) => r.specification_id);
// // }
// else if (key === 'power_from' || key === 'power_to') {
//   const operator = key === 'power_from' ? '>=' : '<=';
//   const [rows] = await pool.query(
//     `SELECT specification_id 
//      FROM characteristics 
//      WHERE characteristic = ? 
//      AND CAST(SUBSTRING_INDEX(value, ' ', 1) AS DECIMAL) ${operator} ?`,
//     [group, val]
//   );
//   currentIds = rows.map((r: any) => r.specification_id);
// }
//     // else if (key.endsWith('_to')) {
//     //   const [rows] = await pool.query(
//     //     `SELECT specification_id FROM characteristics WHERE characteristic = ? AND CAST(value AS DECIMAL) <= ?`,
//     //     [group, val]
//     //   );
//     //   currentIds = rows.map((r: any) => r.specification_id);
//     // }

//     //  else if (key.endsWith('_from')) {

//     //   const [rows] = await pool.query(
//     //     `SELECT specification_id FROM characteristics WHERE characteristic = ? AND CAST(value AS DECIMAL) >= ?`,
//     //     [group, val]
//     //     // ['Start of production','2000']
//     //   );
//     //   console.log(rows, "rows");
//     //   currentIds = rows.map((r: any) => r.specification_id);
//     // }

//     // 4️⃣ Exact match (інші)
//     else {
//       const [rows] = await pool.query(
//         `SELECT specification_id FROM characteristics WHERE characteristic = ? AND value = ?`,
//         [group, val]
//       );
//       console.log(rows, "rows");
//       currentIds = rows.map((r: any) => r.specification_id);
//     }

//     // 🔁 Перехрещення
//     if (matchingIds === null) {
//       matchingIds = currentIds;
//     } else {
//       matchingIds = matchingIds.filter(id => currentIds.includes(id));
//     }

//     if (matchingIds.length === 0) break;
//   }

//   if (!matchingIds || matchingIds.length === 0) {
//     return NextResponse.json({ page, pageSize, total: 0, data: [] });
//   }

//   const total = matchingIds.length;
//   const limitedIds = matchingIds.slice(offset, offset + pageSize);

//   const [cars] = await pool.query(
//     `SELECT * FROM specifications WHERE id IN (${limitedIds.map(() => '?').join(',')})`,
//     [...limitedIds]
//   );

//   return NextResponse.json({
//     page,
//     pageSize,
//     total,
//     data: cars,
//   });
// }

// function getGroupedValues(group: Record<string, string[]>, key: string): string[] {
//   return group[key] || [];
// }

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);

//   // Параметри пагінації
//   const pageParam = searchParams.get('page');
//   const page = pageParam ? Math.max(parseInt(pageParam), 1) : 1;
//   const pageSize = 20;
//   const offset = (page - 1) * pageSize;

//   let matchingIds: number[] | null = null;

//   for (const [key, val] of searchParams.entries()) {
//     if (key === 'page') continue;
//     const group = characteristicMap[key];
//     if (!group) continue;

//     // Пошук по діапазону значень (рік від / до)
//     if (key.endsWith('_from')) {
//       const [rows] = await pool.query(
//         `SELECT specification_id FROM characteristics WHERE characteristic = ? AND CAST(value AS DECIMAL) >= ?`,
//         [group, val]
//       );
//       const currentIds = rows.map((r: any) => r.specification_id);
//       matchingIds = matchingIds === null ? currentIds : matchingIds.filter(id => currentIds.includes(id));
//       if (matchingIds.length === 0) break;
//       continue;
//     }

//     if (key.endsWith('_to')) {
//       const [rows] = await pool.query(
//         `SELECT specification_id FROM characteristics WHERE characteristic = ? AND CAST(value AS DECIMAL) <= ?`,
//         [group, val]
//       );
//       const currentIds = rows.map((r: any) => r.specification_id);
//       matchingIds = matchingIds === null ? currentIds : matchingIds.filter(id => currentIds.includes(id));
//       if (matchingIds.length === 0) break;
//       continue;
//     }

//     // Пошук по exact match
//     const [rows] = await pool.query(
//       `SELECT specification_id FROM characteristics WHERE characteristic = ? AND value = ?`,
//       [group, val]
//     );
//     const currentIds = rows.map((r: any) => r.specification_id);
//     matchingIds = matchingIds === null ? currentIds : matchingIds.filter(id => currentIds.includes(id));
//     if (matchingIds.length === 0) break;
//   }

//   // Якщо немає збігів
//   if (!matchingIds || matchingIds.length === 0) {
//     return NextResponse.json({ page, pageSize, total: 0, data: [] });
//   }

//   // Загальна кількість результатів
//   const total = matchingIds.length;

//   // Фінальний запит по ID
//   const limitedIds = matchingIds.slice(offset, offset + pageSize);
//   const [cars] = await pool.query(
//     `SELECT * FROM specifications WHERE id IN (${limitedIds.map(() => '?').join(',')})`,
//     [...limitedIds]
//   );

//   return NextResponse.json({
//     page,
//     pageSize,
//     total,
//     data: cars,
//   });
// }

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
// let matchingIds: number[] | null = null;

//   try {
    
//     // const filters: string[] = [];
//     // const values: any[] = [];
//     console.log(searchParams, "searchParams");
    
//  for (const [key, value] of searchParams.entries()) {
//   if (key === 'page') continue;

//   const groupName = characteristicMap[key];
//   if (!groupName) continue;

//   // Отримати всі specification_id, які відповідають поточному фільтру
//   const [rows] = await pool.query(
//     `SELECT specification_id FROM characteristics WHERE characteristic = ? AND value = ?`,
//     [groupName, value]
//   );

//   const currentIds = rows.map((row: any) => row.specification_id);

//   // Якщо це перший фільтр — просто зберігаємо його список
//   if (matchingIds === null) {
//     matchingIds = currentIds;
//   } else {
//     // На кожному кроці залишаємо тільки ті, що були в попередніх
//     matchingIds = matchingIds.filter(id => currentIds.includes(id));
//   }

//   // Якщо вже немає збігів — перериваємо
//   if (matchingIds.length === 0) break;
// }


//     // ...existing code...
// // for (const [key, value] of searchParams.entries()) {
// //   if (key === 'page') {
// //      const pageParam = searchParams.get('page');
// //     const page = pageParam ? Math.max(parseInt(pageParam), 1) : 1;
// //     const pageSize = 20;
// //     const offset = (page - 1) * pageSize;
// // continue;
// //   }
// //   console.log(characteristicMap[key], value, "key,value");
// //   const [characteristics] = await pool.query(
// //     'SELECT * FROM characteristics WHERE characteristic = ? AND value = ?',
// //     [characteristicMap[key], value]
// //   );
// //   console.log(characteristics, "characteristics");
// // }

// // const promises = [];
// // for (const [key, value] of searchParams.entries()) {
// //   if (key === 'page') continue;
// //   promises.push(
// //     pool.query('SELECT * FROM characteristics WHERE specification_id = ?', [specificationId])
// //   );
// // }
// // const results = await Promise.all(promises);
// // // ...existing code...

// //     searchParams.forEach((value, key) => {
// //        if(key === 'page') {
// //          const pageParam = searchParams.get('page');
// //     const page = pageParam ? Math.max(parseInt(pageParam), 1) : 1;
// //     const pageSize = 20;
// //     const offset = (page - 1) * pageSize;
// //     return
// //        }; // Пропустимо параметр page
// // const [characteristics] = await pool.query(
// //         'SELECT * FROM characteristics WHERE specification_id = ?',
// //         [specificationId]
// //       );
// //       console.log(`Параметр: ${characteristicMap[key]} = ${value}`);
      
      
// //     });





// //     // Отримаємо page (за замовчуванням 1)
// //     const pageParam = searchParams.get('page');
// //     const page = pageParam ? Math.max(parseInt(pageParam), 1) : 1;
// //     const pageSize = 20;
// //     const offset = (page - 1) * pageSize;

// //     // Приберемо page з параметрів (щоб не плутався в фільтрації)
// //     searchParams.delete('page');

// //     for (const [key, val] of searchParams.entries()) {
// //       if (!characteristicMap[key]) continue;

// //       const columnName = characteristicMap[key];

// //       if (key === 'fuel') {
// //   const variants = getGroupedValues(fuelTypesGrouped, val);
// //   if (variants.length) {
// //     filters.push(`(\`group\` = ? AND value IN (${variants.map(() => '?').join(',')}))`);
// //     values.push(columnName, ...variants);
// //   }
// // } else if (key === 'body') {
// //   const variants = getGroupedValues(bodyStylesGrouped, val);
// //   if (variants.length) {
// //     filters.push(`(\`group\` = ? AND value IN (${variants.map(() => '?').join(',')}))`);
// //     values.push(columnName, ...variants);
// //   }
// // } else if (key.endsWith('_from')) {
// //   filters.push(`(\`group\` = ? AND CAST(value AS DECIMAL) >= ?)`);
// //   values.push(columnName, val);
// // } else if (key.endsWith('_to')) {
// //   filters.push(`(\`group\` = ? AND CAST(value AS DECIMAL) <= ?)`);
// //   values.push(columnName, val);
// // } else {
// //   filters.push(`(\`group\` = ? AND value = ?)`);
// //   values.push(columnName, val);
// // }
// //     }

// //     if (filters.length === 0) {
// //       return NextResponse.json({ error: 'Не задано жодного параметра фільтрації' }, { status: 400 });
// //     }

// //     const baseQuery = `
// //       SELECT specification_id
// //       FROM characteristics
// //       WHERE ${filters.join(' AND ')}
// //       GROUP BY specification_id
// //       HAVING COUNT(*) = ?
// //       LIMIT ?
// //       OFFSET ?
// //     `;

// //     const [rows] = await pool.query(baseQuery, [...values, filters.length, pageSize, offset]);

// //     return NextResponse.json({
// //       page,
// //       pageSize,
// //       results: rows,
// //     });

//   } catch (error) {
//     console.error('Помилка при фільтрації:', error);
//     return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
//   }
// }



// // import { NextResponse } from 'next/server';
// // import pool from '@/app/lib/db';

// // const fuelTypesGrouped: Record<string, string[]> = {
// //   Petrol: ['Petrol (Gasoline)', 'Synthetic gasoline'],
// //   Diesel: ['Diesel'],
// //   Electric: ['Electricity'],
// //   LPG: ['LPG', 'Petrol / LPG', 'Petrol / CNG'],
// //   CNG: ['Petrol / CNG'],
// //   Hydrogen: ['Hydrogen', 'Hydrogen / electricity'],
// //   Ethanol: ['Petrol / Ethanol - E85', 'Petrol / Ethanol - E85 / electricity', 'Ethanol - E85'],
// //   Hybrid: ['Petrol / electricity', 'Diesel / electricity'],
// //   'Other / Mixed': ['Mixture of two stroke engine'],
// // };

// // const bodyStylesGrouped: Record<string, string[]> = {
// //   'Sedan': ['Sedan', 'Sedan, Fastback', 'Fastback', 'Liftback', 'Coupe, Liftback', 'Crossover, Fastback', 'Coupe, Fastback', 'Hatchback, Fastback', 'Coupe, SUV, Fastback'],
// //   'Hatchback': ['Hatchback', 'Coupe, Hatchback', 'Cabriolet, Hatchback'],
// //   'Wagon': ['Station wagon (estate)', 'Station wagon (estate), Crossover', 'Station wagon (estate), MPV'],
// //   'Coupe': ['Coupe', 'Coupe, SUV', 'Coupe, Crossover', 'Coupe, CUV', 'Coupe, Cabriolet', 'Coupe - Cabriolet', 'Coupe - Cabriolet, Roadster'],
// //   'Cabriolet / Roadster / Targa': ['Cabriolet', 'Cabriolet, Roadster', 'Cabriolet, SUV', 'Off-road vehicle, Cabriolet', 'Targa', 'SUV, Targa', 'Pick-up, Targa', 'Roadster'],
// //   'SUV / Crossover': ['SUV', 'Crossover', 'SUV, Crossover', 'Off-road vehicle', 'Coupe, SUV', 'Off-road vehicle, SUV', 'SUV, MPV', 'Coupe, SUV, Crossover', 'Off-road vehicle, Cabriolet, SUV', 'Off-road vehicle, Coupe', 'Off-road vehicle, Pick-up', 'CUV'],
// //   'Minivan / MPV': ['MPV', 'Minivan', 'Minivan, MPV', 'Minivan, Crossover', 'Мікровен'],
// //   'Pickup': ['Pick-up', 'Pick-up, Targa', 'Pick-up, SUV', 'Off-road vehicle, Pick-up'],
// //   'Limousine / Grand Tourer': ['Лімузин', 'Grand Tourer'],
// //   'Quad / Utility': ['Quadricycle', 'Van']
// // };

// // export async function GET(req: Request) {
// //   const { searchParams } = new URL(req.url);
// //   const page = parseInt(searchParams.get('page') || '1');
// //   const limit = 20;
// //   const offset = (page - 1) * limit;
// //   console.log(searchParams,"serch");


// //   const whereClauses: string[] = [];
// //   const params: any[] = [];

// //   const addInClause = (charName: string, values: string[]) => {
// //     if (values.length > 0) {
// //       whereClauses.push(`
// //         specification_id IN (
// //           SELECT specification_id FROM characteristics 
// //           WHERE characteristic = ? AND value IN (${values.map(() => '?').join(', ')})
// //         )
// //       `);
// //       params.push(charName, ...values);
// //     }
// //   };

// //   const addEqualsClause = (charName: string, value: string) => {
// //     whereClauses.push(`
// //       specification_id IN (
// //         SELECT specification_id FROM characteristics 
// //         WHERE characteristic = ? AND value = ?
// //       )
// //     `);
// //     params.push(charName, value);
// //   };

// //   const addRangeClause = (charName: string, from: string, to: string, numeric = true) => {
// //     if (from || to) {
// //       const f = from || '0';
// //       const t = to || '100000';
// //       whereClauses.push(`
// //         specification_id IN (
// //           SELECT specification_id FROM characteristics 
// //           WHERE characteristic = ?
// //           AND CAST(${numeric ? 'REPLACE(value, ",", ".")' : 'value'} AS ${numeric ? 'DECIMAL(10,2)' : 'UNSIGNED'}) BETWEEN ? AND ?
// //         )
// //       `);
// //       params.push(charName, f, t);
// //     }
// //   };

// //   // Fuel
// //   const fuel = searchParams.get('fuel');
// //   if (fuel && fuelTypesGrouped[fuel]) {
// //     addInClause('Fuel Type', fuelTypesGrouped[fuel]);
// //   }

// //   // Drive
// //   const drive = searchParams.get('drive');
// //   if (drive) {
// //     addEqualsClause('Drive', drive);
// //   }

// //   // Gearbox
// //   const gearbox = searchParams.get('gearbox');
// //   if (gearbox) {
// //     addEqualsClause('Gearbox type', gearbox);
// //   }

// //   // Body
// //   const body = searchParams.get('body');
// //   if (body && bodyStylesGrouped[body]) {
// //     addInClause('Body type', bodyStylesGrouped[body]);
// //   }

// //   // Brand & Model ID
// //   const brandId = searchParams.get('brand_id');
// //   if (brandId) {
// //     addEqualsClause('Brand ID', brandId);
// //   }

// //   const modelId = searchParams.get('model_id');
// //   if (modelId) {
// //     addEqualsClause('Model ID', modelId);
// //   }

// //   // Years
// //   const yearFrom = searchParams.get('year_from');
// //   const yearTo = searchParams.get('year_to') || '2100';
// //   if (yearFrom || yearTo) {
// //     addRangeClause('Year of manufacture', yearFrom || '1900', yearTo);
// //   }

// //   // Power
// //   const powerFrom = searchParams.get('power_from');
// //   const powerTo = searchParams.get('power_to') || '2000';
// //   if (powerFrom || powerTo) {
// //     addRangeClause('Maximum power (hp)', powerFrom || '0', powerTo);
// //   }

// //   // Engine
// //   const engineFrom = searchParams.get('engine_from');
// //   const engineTo = searchParams.get('engine_to') || '10000';
// //   if (engineFrom || engineTo) {
// //     addRangeClause('Engine displacement (cm3)', engineFrom || '0', engineTo);
// //   }

// //   // Consumption
// //   const consumptionFrom = searchParams.get('consumption_from') || '0';
// //   const consumptionTo = searchParams.get('consumption_to') || '99';
// //   const consumptionMode = searchParams.get('consumption_mode'); // e.g., "Highway"

// //   if (consumptionMode) {
// //     addRangeClause(`Fuel consumption (economy) - ${consumptionMode.toLowerCase()}`, consumptionFrom, consumptionTo);
// //   }

// //   // Build query
// //   const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
// //   const query = `
// //     SELECT DISTINCT specification_id 
// //     FROM characteristics 
// //     ${whereClause}
// //     LIMIT ? OFFSET ?
// //   `;
// //   params.push(limit, offset);

// //   try {
// //     console.log('Advanced search request received');
// //     const [ids] = await pool.query(query, params);
// //     const specificationIds = (ids as any[]).map((row) => row.specification_id);

// //     if (specificationIds.length === 0) {
// //       return NextResponse.json([], { status: 200 });
// //     }

// //     const [details] = await pool.query(
// //       `SELECT * FROM characteristics WHERE specification_id IN (${specificationIds.map(() => '?').join(',')})`,
// //       specificationIds
// //     );

// //     return NextResponse.json(details, { status: 200 });
// //   } catch (error) {
// //     console.error('Помилка отримання фільтрованих даних: ', error);
// //     return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
// //   }
// // }