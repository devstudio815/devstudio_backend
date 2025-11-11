import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';
import {
  CreateMataPelajaranDto,
  UpdateMataPelajaranDto,
  MataPelajaranDto,
} from './mata-pelajaran.dto';

@Injectable()
export class MataPelajaranService {
  constructor(private db: DatabaseService) {}

  // CREATE
  async create(req: CreateMataPelajaranDto): Promise<MataPelajaranDto> {
    try {
      const query = `
        INSERT INTO mata_pelajaran
        (kode_mapel, nama_mapel, deskripsi, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING *
      `;
      const result = await this.db.executeQuery(query, [
        req.kode,
        req.nama,
        req.deskripsi,
      ]);

      return this.mapToDto(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation
        throw new ConflictException(
          `Kode mata pelajaran ${req.kode} sudah digunakan`,
        );
      }
      throw error;
    }
  }

  // READ ALL
  async findAll(): Promise<MataPelajaranDto[]> {
    const query = `
      SELECT * FROM mata_pelajaran
      ORDER BY nama_mapel ASC
    `;
    const result = await this.db.findMany(query);
    return result.map((row) => this.mapToDto(row));
  }

  // READ ONE
  async findOne(kode: string): Promise<MataPelajaranDto> {
    const query = `
      SELECT * FROM mata_pelajaran
      WHERE kode_mapel = $1
    `;
    const result = await this.db.executeQuery(query, [kode]);

    if (result.rows.length === 0) {
      throw new NotFoundException(
        `Mata pelajaran dengan kode ${kode} tidak ditemukan`,
      );
    }

    return this.mapToDto(result.rows[0]);
  }

  // UPDATE
  async update(
    kode: string,
    req: UpdateMataPelajaranDto,
  ): Promise<MataPelajaranDto> {
    // Cek dulu apakah mata pelajaran ada
    await this.findOne(kode);

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (req.kode !== undefined) {
      fields.push(`kode_mapel = $${paramIndex++}`);
      values.push(req.kode);
    }
    if (req.nama !== undefined) {
      fields.push(`nama_mapel = $${paramIndex++}`);
      values.push(req.nama);
    }
    if (req.deskripsi !== undefined) {
      fields.push(`deskripsi = $${paramIndex++}`);
      values.push(req.deskripsi);
    }

    if (fields.length === 0) {
      throw new ConflictException('Tidak ada data yang diupdate');
    }

    fields.push(`updated_at = NOW()`);
    values.push(kode);

    try {
      const query = `
        UPDATE mata_pelajaran
        SET ${fields.join(', ')}
        WHERE kode_mapel = $${paramIndex}
        RETURNING *
      `;

      const result = await this.db.executeQuery(query, values);
      return this.mapToDto(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Kode mata pelajaran ${req.kode} sudah digunakan`,
        );
      }
      throw error;
    }
  }

  // DELETE
  async delete(kode: string): Promise<string> {
    // Cek dulu apakah mata pelajaran ada
    await this.findOne(kode);

    const query = `
      DELETE FROM mata_pelajaran
      WHERE kode_mapel = $1
    `;

    await this.db.executeQuery(query, [kode]);

    return `Mata pelajaran dengan kode ${kode} berhasil dihapus`;
  }

  // SEARCH BY NAME
  async search(keyword: string): Promise<MataPelajaranDto[]> {
    const query = `
      SELECT * FROM mata_pelajaran
      WHERE nama_mapel ILIKE $1 OR kode_mapel ILIKE $1
      ORDER BY nama_mapel ASC
    `;
    const result = await this.db.executeQuery(query, [`%${keyword}%`]);
    return result.rows.map((row) => this.mapToDto(row));
  }

  // Helper method untuk mapping database row ke DTO
  private mapToDto(row: any): MataPelajaranDto {
    return {
      kode: row.kode_mapel,
      nama: row.nama_mapel,
      deskripsi: row.deskripsi,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
