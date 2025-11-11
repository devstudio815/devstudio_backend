import { DatabaseService } from 'src/config/database/database.service';
import { UpsertWaliSiswaDto } from '../dtos/wali-siswa.dto';

export class WaliSiswaService {
  constructor(private readonly db: DatabaseService) {}

  async findByUserId(user_id: number) {
    const query = await this.db.executeQuery(
      ` SELECT 
            id, 
            user_id, 
            nama_lengkap, 
            hubungan,
            no_telepon, 
            created_at, 
            updated_at
        FROM wali_siswa
        WHERE user_id = $1`,
      [user_id],
    );
    if (query.rowCount === 0) {
      throw new Error('Wali Siswa not found');
    }
    return query.rows[0];
  }

  async createWaliSiswa(user_id: number, waliSiswaData: UpsertWaliSiswaDto) {
    const query = await this.db.executeQuery(
      `INSERT INTO wali_siswa
        (
            user_id, 
            nama_lengkap, 
            hubungan, 
            no_telepon, 
            created_at, 
            updated_at
        )
            VALUES ($1, $2, $3, $4, now(), now())
            RETURNING 
            id, 
            user_id, 
            nama_lengkap, 
            hubungan,
            no_telepon, 
            created_at, 
            updated_at`,
      [
        user_id,
        waliSiswaData.nama_lengkap,
        waliSiswaData.hubungan,
        waliSiswaData.no_telepon,
      ],
    );
    if (!query) {
      throw new Error('Wali Siswa creation failed');
    }
    return query.rows[0];
  }

  async deleteByUserId(user_id: number) {
    const query = await this.db.executeQuery(
      `DELETE FROM wali_siswa
        WHERE user_id = $1`,
      [user_id],
    );
    return query.rowCount > 0;
  }

  async deleteById(id: number) {
    const query = await this.db.executeQuery(
      `DELETE FROM wali_siswa
        WHERE id = $1`,
      [id],
    );
    return query.rowCount > 0;
  }

  async updateWaliSiswa(id: number, waliSiswaData: UpsertWaliSiswaDto) {
    const query = await this.db.executeQuery(
      `UPDATE wali_siswa
        SET 
            nama_lengkap = $1,
            hubungan = $2,
            no_telepon = $3,
            updated_at = now()
        WHERE id = $4
        RETURNING 
            id, 
            user_id, 
            nama_lengkap, 
            hubungan,
            no_telepon, 
            created_at, 
            updated_at`,
      [
        waliSiswaData.nama_lengkap,
        waliSiswaData.hubungan,
        waliSiswaData.no_telepon,
        id,
      ],
    );
    if (query.rowCount === 0) {
      throw new Error('Wali Siswa update failed');
    }
    return query.rows[0];
  }
}
