import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useFilter } from '../../../app/customHooks/useFilter';
import { CarModelsResponse } from '../../../app/lib/types';

jest.mock('@tanstack/react-query');
jest.mock('axios');

const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useFilter hook', () => {
  const mockResponse: CarModelsResponse = {
    models: ['Toyota Corolla', 'Honda Civic'],
    total: 2,
  };

  const testFilter = 'brand=Toyota&year=2022';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});

    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: false,
      refetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should disable query when filter is empty', () => {
    const { result } = renderHook(() => useFilter(''));

    expect(mockedUseQuery).toHaveBeenCalledWith(expect.objectContaining({
      enabled: false,
    }));

    expect(result.current).toEqual({
      dataFilter: undefined,
      isLoadingFilter: false,
      isSuccessFilter: false,
      isErrorFilter: false,
    });
  });

  it('should enable query with correct key and config when filter is provided', () => {
    renderHook(() => useFilter(testFilter));

    expect(mockedUseQuery).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: ['filter', testFilter],
      enabled: true,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    }));
  });

  it('should return loading state', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useFilter(testFilter));

    expect(result.current).toEqual({
      dataFilter: undefined,
      isLoadingFilter: true,
      isSuccessFilter: false,
      isErrorFilter: false,
    });
  });

  it('should return data correctly on success', () => {
    mockedUseQuery.mockReturnValue({
      data: mockResponse,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useFilter(testFilter));

    expect(result.current).toEqual({
      dataFilter: mockResponse,
      isLoadingFilter: false,
      isSuccessFilter: true,
      isErrorFilter: false,
    });

    expect(console.log).toHaveBeenCalledWith('Data fetched successfully');
  });

  it('should handle error state correctly', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useFilter(testFilter));

    expect(result.current).toEqual({
      dataFilter: undefined,
      isLoadingFilter: false,
      isSuccessFilter: false,
      isErrorFilter: true,
    });

    expect(console.log).toHaveBeenCalledWith('Error fetched data');
  });

  it('should transform data correctly with select', () => {
    const axiosResponse = { data: mockResponse };
    let selectFn: (data: any) => any;

    mockedUseQuery.mockImplementation((options) => {
      selectFn = options.select;
      return {
        data: selectFn(axiosResponse),
        isLoading: false,
        isSuccess: true,
        isError: false,
        refetch: jest.fn(),
      };
    });

    const { result } = renderHook(() => useFilter(testFilter));

    expect(selectFn(axiosResponse)).toEqual(mockResponse);
    expect(result.current.dataFilter).toEqual(mockResponse);
  });
});