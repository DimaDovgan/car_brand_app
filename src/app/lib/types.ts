export interface IcarBrand {
    id: number;
    name: string;
    image: string;
  }

  export interface IcarModel{
    id:number;
    brand_id:number;
    name:string;
    image:string;
  }
  export interface IcarGeneration{
    id:number;
    model_id:number;
    name:string;
    image:string;
    years:string;
    bodyType:string;
    power:string;
    
  }
  export interface IcarSpecifications{
    id:number;
    model_id:number;
    name:string;
    image:string;
    years:string;
    value:string;
    power:string;
  }

  export interface Icarcharacteristics {
    id: string;
    characteristic: string;
    value: string | null;
    group?: string;
  }

  export interface CarModelsResponse {
  page: number;
  pageSize: number;
  total: number;
  data: IcarSpecifications[];
}