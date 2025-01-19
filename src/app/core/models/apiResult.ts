export interface ApiResult<T> {
  isSuccess: boolean;
  data: T;
  error: {
    message: string;
    details: string;
  };
}
