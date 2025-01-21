export class ApiResult<T> {
  public success: boolean = false;
  public data: T | null = null;
  public message: string | null = null;
  public error: {
    code: number | null;
    message: string | null;
    details: string[] | null;
  } | null = null;
}

export class PaginationApiResult<T> extends ApiResult<T> {
  public pagination: {
    page: number | null;
    pageSize: number | null;
    totalCount: number | null;
    totalPages: number | null;
    hasPrevious: boolean | null;
    hasNext: boolean | null;
  } | null = null;
}
