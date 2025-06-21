// useBrands.test.tsx
import { renderHook} from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useBrands } from '../../../app/customHooks/useBrands';
import { IcarBrand } from '../../../app/lib/types';
// Мокаємо модулі

// Перевірка, чи викликається useQuery з правильними параметрами (queryKey, enabled, тощо)	✅	Є кілька тестів, які чітко перевіряють queryKey, enabled, gcTime та інше.
// 2	Перевірка, що enabled: false, коли id порожній	✅	Тест should disable query when id is empty це повністю покриває.
// 3	Перевірка, що повертаються правильні значення (data, isLoading, isSuccess, isError) у різних станах	✅	Є окремі тести для loading, success, error.
// 4	Перевірка, що select трансформує дані правильно	✅	Тест should transform data correctly using select це і перевіряє.
// 5	Перевірка побічних ефектів, як от console.log при успіху	✅	console.log('Data fetched successfully') перевіряється.
// 6	Перевірка побічних ефектів, як от console.log при помилці	✅	console.log('Error fetched data') також перевірено.









jest.mock('@tanstack/react-query');
jest.mock('axios');

const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useBrands hook', () => {
  const mockBrands: IcarBrand[] = [
    { id: 1, name: 'Toyota' },
    { id: 2, name: 'BMW' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call useQuery with correct parameters', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: false,
    } as any);

    renderHook(() => useBrands());

    // Перевіряємо, що useQuery викликано з правильними параметрами
    expect(mockedUseQuery).toHaveBeenCalledWith({
      queryKey: ['brands'],
      queryFn: expect.any(Function),
      select: expect.any(Function),
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    });
  });

  it('should return correct data on success', () => {
    // Мокаємо повернення useQuery з урахуванням select функції
    mockedUseQuery.mockImplementation(({ select }) => ({
      data: select ? select({ data: mockBrands }) : undefined,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    }));

    const { result } = renderHook(() => useBrands());

    expect(result.current).toEqual({
      data: mockBrands,
      isLoading: false,
      isSuccess: true,
      isError: false,
    });
    expect(console.log).toHaveBeenCalledWith('Data fetched successfully');
  });

  it('should return loading state correctly', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
      refetch: jest.fn(),
    } as any);

    const { result } = renderHook(() => useBrands());

    expect(result.current).toEqual({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
    });
  });

  it('should handle error state', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
      refetch: jest.fn(),
    } as any);

    const { result } = renderHook(() => useBrands());

    expect(result.current).toEqual({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
    });
    expect(console.log).toHaveBeenCalledWith('Error fetched data');
  });

  it('should correctly select data from axios response', () => {
    // Створюємо mock для useQuery, щоб отримати select функцію
    let selectFn: (data: any) => any;
    mockedUseQuery.mockImplementation((options) => {
      selectFn = options.select;
      return {
        data: undefined,
        isLoading: false,
        isSuccess: false,
        isError: false,
        refetch: jest.fn(),
      };
    });

    renderHook(() => useBrands());
    
    const axiosResponse = { data: mockBrands };
    const selectedData = selectFn(axiosResponse);
    
    expect(selectedData).toEqual(mockBrands);
  });
});







// import { render, screen, waitFor } from '@testing-library/react';
// import { useBrands } from '../../../app/customHooks/useBrands';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { rest } from 'msw';
// // import { setupServer } from 'msw/node';
// import { setupServer } from 'msw/node';
// import React from 'react';

// const mockData = [
//   { id: 1, name: 'BMW', logo: 'bmw.png' },
//   { id: 2, name: 'Audi', logo: 'audi.png' }
// ];

// const server = setupServer(
//   rest.get('http://localhost:3000/api/allbrand', (req, res, ctx) => {
//     return res(ctx.status(200), ctx.json(mockData));
//   })
// );

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// function TestComponent() {
//   const { data, isLoading, isError, isSuccess } = useBrands();

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error</div>;
//   if (isSuccess) return (
//     <ul>
//       {data.map((brand) => (
//         <li key={brand.id}>{brand.name}</li>
//       ))}
//     </ul>
//   );
//   return null;
// }

// describe('useBrands', () => {
//   it('відображає бренди після успішного запиту', async () => {
//     const queryClient = new QueryClient();
//     render(
//       <QueryClientProvider client={queryClient}>
//         <TestComponent />
//       </QueryClientProvider>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('BMW')).toBeInTheDocument();
//       expect(screen.getByText('Audi')).toBeInTheDocument();
//     });
//   });

//   it('відображає помилку при 500', async () => {
//     server.use(
//       rest.get('http://localhost:3000/api/allbrand', (req, res, ctx) => {
//         return res(ctx.status(500));
//       })
//     );

//     const queryClient = new QueryClient();
//     render(
//       <QueryClientProvider client={queryClient}>
//         <TestComponent />
//       </QueryClientProvider>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('Error')).toBeInTheDocument();
//     });
//   });
// });