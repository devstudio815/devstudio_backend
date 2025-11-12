export class  PaginationDto {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    constructor(page: number, limit: number, totalItems: number) {
        this.page = page;
        this.limit = limit;
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(totalItems / limit);
    }
}

export class PaginatedResponseDto<T> {
  data: T[];
  pagination: PaginationDto;

  constructor(data: T[], pagination: PaginationDto) {
    this.data = data;
    this.pagination = pagination;
  }
}
