import { PaginationDto } from '../dto/pagination.dto';
import { ResponseDto } from '../dto/response.dto';

export class TransformInterceptor<T> {
  intercept(
    data: T,
    succes: boolean,
    statusCode?: number,
    message = 'Request successful',
  ) {
    return new ResponseDto<T>(data, succes, statusCode ?? 200, message);
  }
  interceptError(message = 'Internal Server Error', statusCode = 500) {
    return new ResponseDto<null>(null, false, statusCode, message);
  }

  interceptPagination(page: number, limit: number, totalItems: number){
    return new PaginationDto(page,limit,totalItems)
  }
}
