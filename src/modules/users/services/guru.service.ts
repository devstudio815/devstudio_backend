import { DatabaseService } from 'src/config/database/database.service';
import { UpsertGuruDto } from '../dtos/guru.dto';

export class GuruService {
  constructor(private readonly db: DatabaseService) {}
  async findByUserId(user_id: number) {
    const query = await this.db.executeQuery(
      ` SELECT 
            id, 
            user_id, 
            nama_lengkap, 
            nip, 
            no_telepon,
            tempat_lahir,
            tanggal_lahir,
            alamat,
            mata_pelajaran, 
            created_at, 
            updated_at
        FROM guru
        WHERE user_id = $1`,
      [user_id],
    );
    if (query.rowCount === 0) {
      throw new Error('Guru not found');
    }
    return query.rows[0];
  }
  async deleteByUserId(user_id: number) {
    const query = await this.db.executeQuery(
      `DELETE FROM guru
        WHERE user_id = $1`,
      [user_id],
    );
    if (query.rowCount === 0) {
      throw new Error('Guru deletion failed');
    }
    return true;
  }

  async createGuru(user_id: number, guruData: UpsertGuruDto) {
    const query = await this.db.executeQuery(
      `INSERT INTO guru
        (
            user_id, 
            nama_lengkap, 
            nip, 
            mata_pelajaran,
            tannggal_lahir,
            tempat_lahir,
            no_telepon,
            alamat,
            created_at, 
            updated_at
        )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now(), now())
            RETURNING 
            id, 
            user_id, 
            nama_lengkap, 
            nip, 
            mata_pelajaran,
            created_at, 
            updated_at
        )`,
      [user_id, guruData.nama_lengkap, guruData.nip, guruData.mata_pelajaran],
    );
    if (!query) {
      throw new Error('Guru creation failed');
    }
    return query.rows[0];
  }

  async updateGuru(user_id: number, guruData: UpsertGuruDto) {
    const query = await this.db.executeQuery(
      `UPDATE guru
        SET 
            nama_lengkap = $1, 
            no_telepon = $2, 
            alamat = $3,
            tempat_lahir = $4,
            tanggal_lahir = $5,
            nip = $6,
            mata_pelajaran = $7,
            updated_at = now()
        WHERE user_id = $8

        RETURNING 
            id, 
            user_id, 
            nama_lengkap, 
            nip, 
            mata_pelajaran, 
            created_at, 
            updated_at`,
      [guruData.nama_lengkap, guruData.nip, guruData.mata_pelajaran, user_id],
    );
    if (query.rowCount === 0) {
      throw new Error('Guru update failed');
    }
    return query.rows[0];
  }
}
