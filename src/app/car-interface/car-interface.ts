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
  pagingInfo: PagingInfo
}

export interface Paging {
  page: number;
  pageSize: number;
  total?: number;
}
interface PagingInfo {
  page: number;
  pageSize: number;
  totalItems: number;
}