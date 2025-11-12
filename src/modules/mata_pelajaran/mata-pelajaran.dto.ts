export class MataPelajaranDto {
  id : number
  nama: string;
  kode: string;
  kode_kelas : string
  deskripsi?: string;
  created_at: string;
  updated_at: string;
}
export class CreateMataPelajaranDto {
  nama: string;
  kode: string;
  kode_kelas : string
  deskripsi?: string;
}
export class UpdateMataPelajaranDto {
  id : number
  nama?: string;
  kode?: string;
  kode_kelas : string
  deskripsi?: string;
}

export class QueryPaginationDto {
  page?: number = 1;
  limit?: number = 10;
  search?: string;
}