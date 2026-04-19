export const IReportRepository = Symbol('IReportRepository');

export interface OrderVolumeDropFilters {
  previousFrom: Date;
  previousTo: Date;
  currentFrom: Date;
  currentTo: Date;
  minPreviousOrders?: number;
  minDropPercentage?: number;
  sortBy?: 'dropPercentage' | 'dropCount' | 'previousOrders' | 'currentOrders';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrderVolumeDropResult {
  captainId: string;
  captainName: string;
  previousOrders: number;
  currentOrders: number;
  dropCount: number;
  dropPercentage: number;
}

export interface IReportRepository {
  getCaptainOrderVolumeDrop(
    filters: OrderVolumeDropFilters,
  ): Promise<{ results: OrderVolumeDropResult[]; total: number }>;
}
