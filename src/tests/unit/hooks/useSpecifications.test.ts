import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSpecifications } from '../../../app/customHooks/useSpecifications';
import { IcarSpecifications } from '../../../app/lib/types';

jest.mock('@tanstack/react-query');
jest.mock('axios');

const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useSpecifications hook', () => {
  const mockSpecs: IcarSpecifications[] = [
    { id: '1', engine: '1.6L', horsepower: 120 },
    { id: '2', engine: '2.0L', horsepower: 150 },
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
    const { result } = renderHook(() => useSpecifications(''));

    expect(mockedUseQuery).toHaveBeenCalledWith(expect.objectContaining({
      enabled: false,
    }));
    expect(result.current).toEqual({
      dataSpecifications: undefined,
      isLoadingSpecifications: false,
      isSuccessSpecifications: false,
      isErrorSpecifications: false,
    });
  });

  it('should enable query with correct key and config when id is provided', () => {
    renderHook(() => useSpecifications(testId));

    expect(mockedUseQuery).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: ['specification', testId],
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

    const { result } = renderHook(() => useSpecifications(testId));

    expect(result.current).toEqual({
      dataSpecifications: undefined,
      isLoadingSpecifications: true,
      isSuccessSpecifications: false,
      isErrorSpecifications: false,
    });
  });

  it('should return data correctly on success', () => {
    mockedUseQuery.mockReturnValue({
      data: mockSpecs,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useSpecifications(testId));

    expect(result.current).toEqual({
      dataSpecifications: mockSpecs,
      isLoadingSpecifications: false,
      isSuccessSpecifications: true,
      isErrorSpecifications: false,
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

    const { result } = renderHook(() => useSpecifications(testId));

    expect(result.current).toEqual({
      dataSpecifications: undefined,
      isLoadingSpecifications: false,
      isSuccessSpecifications: false,
      isErrorSpecifications: true,
    });
    expect(console.log).toHaveBeenCalledWith('Error fetched data');
  });

  it('should transform data correctly with select', () => {
    const axiosResponse = { data: mockSpecs };
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

    const { result } = renderHook(() => useSpecifications(testId));

    expect(selectFn(axiosResponse)).toEqual(mockSpecs);
    expect(result.current.dataSpecifications).toEqual(mockSpecs);
  });
});