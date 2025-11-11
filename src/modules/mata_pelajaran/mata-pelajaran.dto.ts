export class MataPelajaranDto {
  nama: string;
  kode: string;
  deskripsi?: string;
  created_at: string;
  updated_at: string;
}
export class CreateMataPelajaranDto {
  nama: string;
  kode: string;
  deskripsi?: string;
}
export class UpdateMataPelajaranDto {
  nama?: string;
  kode?: string;
  deskripsi?: string;
}
