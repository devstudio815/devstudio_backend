import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';
import { UpsertSiswaDto } from '../dtos/siswa.dto';

@Injectable()
export class SiswaService {
  constructor(private readonly db: DatabaseService) {}

  async findByUserId(user_id: number) {
    const query = await this.db.executeQuery(
      ` SELECT 
            id, 
            user_id, 
            nama_lengkap, 
            nisn, 
            tempat_lahir, 
            tanggal_lahir, 
            alamat, 
            no_telepon, 
            created_at, 
            updated_at
        FROM siswa
        WHERE user_id = $1`,
      [user_id],
    );
    if (query.rowCount === 0) {
      throw new Error('Siswa not found');
    }
    return query.rows[0];
  }

  async createSiswa(user_id: number, siswaData: UpsertSiswaDto) {
    const query = await this.db.executeQuery(
      `INSERT INTO siswa
        (
            user_id, 
            nama_lengkap, 
            nisn, 
            tempat_lahir, 
            tanggal_lahir,
            alamat, 
            no_telepon, 
            created_at, 
            updated_at
        )
            VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now())

            RETURNING 
            id, 
            user_id, 
            nama_lengkap, 
            nisn, 
            tempat_lahir, 
            tanggal_lahir, 
            alamat, 
            no_telepon, 
            created_at, 
            updated_at`,
      [
        user_id,
        siswaData.nama_lengkap,
        siswaData.nisn,
        siswaData.tempat_lahir,
        siswaData.tanggal_lahir,
        siswaData.alamat,
        siswaData.no_telepon,
      ],
    );

    if (!query) {
      throw new Error('Siswa creation failed');
    }
    return query.rows[0];
  }

  async updateSiswa(user_id: number, siswaData: UpsertSiswaDto) {
    const query = await this.db.executeQuery(
      `UPDATE siswa
        SET 
            nama_lengkap = $1, 
            nisn = $2, 
            tempat_lahir = $3, 
            tanggal_lahir = $4, 
            alamat = $5, 
            no_telepon = $6, 
            updated_at = now()
        WHERE user_id = $7
        RETURNING 
            id, 
            user_id, 
            nama_lengkap, 
            nisn, 
            tempat_lahir, 
            tanggal_lahir, 
            alamat, 
            no_telepon, 
            created_at, 
            updated_at`,
      [
        siswaData.nama_lengkap,
        siswaData.nisn,
        siswaData.tempat_lahir,
        siswaData.tanggal_lahir,
        siswaData.alamat,
        siswaData.no_telepon,
        user_id,
      ],
    );

    if (query.rowCount === 0) {
      throw new Error('Siswa update failed');
    }
    return query.rows[0];
  }

  async deleteSiswa(user_id: number) {
    const query = await this.db.executeQuery(
      `DELETE FROM siswa
        WHERE user_id = $1
        RETURNING id`,
      [user_id],
    );

    if (query.rowCount === 0) {
      throw new Error('Siswa deletion failed');
    }
    return true;
  }

  async deleteAllSiswa() {
    await this.db.executeQuery(`DELETE FROM siswa`, []);
    return true;
  }
}
