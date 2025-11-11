export class GuruDto {
  id: number;
  user_id: number;
  nama_lengkap: string;
  nip: string;
  mata_pelajaran: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  no_telepon: string;
  created_at: string;
  updated_at: string;
}

export class UpsertGuruDto {
  nama_lengkap: string;
  nip: string;
  mata_pelajaran: string;
  alamat: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  no_telepon: string;
}
