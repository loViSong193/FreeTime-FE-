export interface Car {
  _id: string;
  brand: string;
  model: string;
  color: string;
  status: boolean;
  price: number;
}

export interface CarRespond {
  items: Car[];
  page: number;
  pageSize: number;
  total: number;
}

export interface Paging {
  page: number;
  pageSize: number;
  total?: number;
}
