import { renderHook, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useModels } from '../../../app/customHooks/useModels';
import { IcarModel } from '../../../app/lib/types';

jest.mock('@tanstack/react-query');
jest.mock('axios');

const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useModels hook', () => {
  const mockModels: IcarModel[] = [
    { id: '1', name: 'Corolla', brandId: '1' },
    { id: '2', name: 'Camry', brandId: '1' },
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
      refetch: jest.fn().mockResolvedValue({ data: mockModels }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should disable query when id is empty', () => {
    const { result } = renderHook(() => useModels(''));
    
    expect(mockedUseQuery).toHaveBeenCalledWith(expect.objectContaining({
      enabled: false
    }));
    expect(result.current).toEqual({
      dataModels: undefined,
      isLoadingModels: false,
      isSuccessModels: false,
      isErrorModels: false,
    });
  });

  it('should enable query and use correct key when id is provided', () => {
    renderHook(() => useModels(testId));
    
    expect(mockedUseQuery).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: ['brands', testId],
      enabled: true,
      gcTime: 0
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

    const { result } = renderHook(() => useModels(testId));
    
    expect(result.current).toEqual({
      dataModels: undefined,
      isLoadingModels: true,
      isSuccessModels: false,
      isErrorModels: false,
    });
  });

  it('should return data correctly on success', () => {
    mockedUseQuery.mockReturnValue({
      data: mockModels,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useModels(testId));
    
    expect(result.current).toEqual({
      dataModels: mockModels,
      isLoadingModels: false,
      isSuccessModels: true,
      isErrorModels: false,
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

    const { result } = renderHook(() => useModels(testId));
    
    expect(result.current).toEqual({
      dataModels: undefined,
      isLoadingModels: false,
      isSuccessModels: false,
      isErrorModels: true,
    });
    expect(console.log).toHaveBeenCalledWith('Error fetched data');
  });

  it('should transform data correctly using select', () => {
    const axiosResponse = { data: mockModels };
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

    const { result } = renderHook(() => useModels(testId));
    
    expect(selectFn(axiosResponse)).toEqual(mockModels);
    expect(result.current.dataModels).toEqual(mockModels);
  });
});