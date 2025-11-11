export class siswaDto {
  id: number;
  user_id: number;
  nama_lengkap: string;
  nisn: string;
  tempat_lahir: string;
  tanggal_lahir: Date;
  alamat: string;
  no_telepon: string;
  created_at: string;
  updated_at: string;
}

export class UpsertSiswaDto {
  nama_lengkap: string;
  nisn: string;
  tempat_lahir: string;
  tanggal_lahir: Date;
  alamat: string;
  no_telepon: string;
}
