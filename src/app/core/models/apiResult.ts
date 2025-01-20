export class ApiResult<T> {
  public isSuccess: boolean = false;
  public data: T | null = null;
  public error: {
    message: string | null;
    details: string[] | null;
  } | null = null;
}

export class PaginationResult<T> extends ApiResult<T> {
  public page: number = 1;
  public limit: number = 10;
  public total: number = 0;
  public totalPages: number = 0;
  public hasNext: boolean = false;
  public hasPrevious: boolean = false;
}
