import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useGeneration } from '../../../app/customHooks/useGeneration';
import { IcarGeneration } from '../../../app/lib/types';

jest.mock('@tanstack/react-query');
jest.mock('axios');

const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useGeneration hook', () => {
  const mockGenerations: IcarGeneration[] = [
    { id: '1', name: 'Generation A', modelId: '1' },
    { id: '2', name: 'Generation B', modelId: '1' },
  ];
  const testId = '1';

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

  it('should disable query when id is empty', () => {
    const { result } = renderHook(() => useGeneration(''));

    expect(mockedUseQuery).toHaveBeenCalledWith(expect.objectContaining({
      enabled: false
    }));
    expect(result.current).toEqual({
      dataGeneration: undefined,
      isLoadingGeneration: false,
      isSuccessGeneration: false,
      isErrorGeneration: false,
    });
  });

  it('should enable query and use correct key when id is provided', () => {
    renderHook(() => useGeneration(testId));

    expect(mockedUseQuery).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: ['generation', testId],
      enabled: true,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false
    }));
  });

  it('should return loading state correctly', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGeneration(testId));

    expect(result.current).toEqual({
      dataGeneration: undefined,
      isLoadingGeneration: true,
      isSuccessGeneration: false,
      isErrorGeneration: false,
    });
  });

  it('should return data correctly on success', () => {
    mockedUseQuery.mockReturnValue({
      data: mockGenerations,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGeneration(testId));

    expect(result.current).toEqual({
      dataGeneration: mockGenerations,
      isLoadingGeneration: false,
      isSuccessGeneration: true,
      isErrorGeneration: false,
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

    const { result } = renderHook(() => useGeneration(testId));

    expect(result.current).toEqual({
      dataGeneration: undefined,
      isLoadingGeneration: false,
      isSuccessGeneration: false,
      isErrorGeneration: true,
    });
    expect(console.log).toHaveBeenCalledWith('Error fetched data');
  });

  it('should transform data correctly using select', () => {
    const axiosResponse = { data: mockGenerations };
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

    const { result } = renderHook(() => useGeneration(testId));

    expect(selectFn(axiosResponse)).toEqual(mockGenerations);
    expect(result.current.dataGeneration).toEqual(mockGenerations);
  });
});