import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCharacteristics } from '../../../app/customHooks/useCharacteristics';
import { Icarcharacteristics } from '../../../app/lib/types';

jest.mock('@tanstack/react-query');
jest.mock('axios');

const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useCharacteristics hook', () => {
  const mockCharacteristics: Icarcharacteristics[] = [
    { id: '1', length: '4500mm', weight: '1500kg' },
    { id: '2', length: '4700mm', weight: '1700kg' },
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
    const { result } = renderHook(() => useCharacteristics(''));

    expect(mockedUseQuery).toHaveBeenCalledWith(expect.objectContaining({
      enabled: false,
    }));

    expect(result.current).toEqual({
      dataCharacteristics: undefined,
      isLoadingCharacteristics: false,
      isSuccessCharacteristics: false,
      isErrorCharacteristics: false,
    });
  });

  it('should enable query with correct key and config when id is provided', () => {
    renderHook(() => useCharacteristics(testId));

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

    const { result } = renderHook(() => useCharacteristics(testId));

    expect(result.current).toEqual({
      dataCharacteristics: undefined,
      isLoadingCharacteristics: true,
      isSuccessCharacteristics: false,
      isErrorCharacteristics: false,
    });
  });

  it('should return data correctly on success', () => {
    mockedUseQuery.mockReturnValue({
      data: mockCharacteristics,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useCharacteristics(testId));

    expect(result.current).toEqual({
      dataCharacteristics: mockCharacteristics,
      isLoadingCharacteristics: false,
      isSuccessCharacteristics: true,
      isErrorCharacteristics: false,
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

    const { result } = renderHook(() => useCharacteristics(testId));

    expect(result.current).toEqual({
      dataCharacteristics: undefined,
      isLoadingCharacteristics: false,
      isSuccessCharacteristics: false,
      isErrorCharacteristics: true,
    });

    expect(console.log).toHaveBeenCalledWith('Error fetched data');
  });

  it('should transform data correctly with select', () => {
    const axiosResponse = { data: mockCharacteristics };
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

    const { result } = renderHook(() => useCharacteristics(testId));

    expect(selectFn(axiosResponse)).toEqual(mockCharacteristics);
    expect(result.current.dataCharacteristics).toEqual(mockCharacteristics);
  });
});