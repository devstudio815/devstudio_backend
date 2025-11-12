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
import { PaginatedResponseDto, PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MataPelajaranService {
  constructor(private db: DatabaseService) {}

  // CREATE
  async create(req: CreateMataPelajaranDto): Promise<MataPelajaranDto> {
    try {
      const query = `
        INSERT INTO mata_pelajaran
        (kode_mapel, nama_mapel,kode_kelas, deskripsi, created_at, updated_at)
        VALUES ($1, $2, $3,$4, NOW(), NOW())
        RETURNING *
      `;
      const result = await this.db.executeQuery(query, [
        req.kode,
        req.nama,
        req.kode_kelas,
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
async findAll(
  limit: number,
  page: number,
  search?: string
): Promise<PaginatedResponseDto<MataPelajaranDto>> {
  const offset = (page - 1) * limit;

  // Build query with search
  let query = `
    SELECT 
      id,
      kode_mapel,
      nama_mapel,
      kode_kelas,
      deskripsi,
      created_at,
      updated_at 
    FROM mata_pelajaran
  `;

  let countQuery = 'SELECT COUNT(*) as total FROM mata_pelajaran';
  const queryParams:  any[] = [];
  const countParams: string[] = [];

  // Add search filter
  if (search && search.trim() !== '') {
    const searchCondition = ` WHERE nama_mapel ILIKE $1 OR kode_mapel ILIKE $1`;
    query += searchCondition;
    countQuery += searchCondition;
    
    queryParams.push(`%${search}%`);
    countParams.push(`%${search}%`);
  }


  const limitParam = queryParams.length + 1;
  const offsetParam = queryParams.length + 2;
  
  query += ` ORDER BY kode_mapel ASC LIMIT $${limitParam} OFFSET $${offsetParam}`;
  queryParams.push(limit, offset);

  const [dataResult, countResult] = await Promise.all([
    this.db.findMany(query, ...queryParams),
    this.db.findOne(countQuery, ...countParams),
  ]);

  const totalItems = parseInt(countResult.total);
  const data = dataResult.map((row) => this.mapToDto(row));
  const pagination = new PaginationDto(page, limit, totalItems);

  return new PaginatedResponseDto(data, pagination);
}
  // READ ONE
  async findOne(id: number): Promise<MataPelajaranDto> {
    const query = `
      SELECT * FROM mata_pelajaran
      WHERE id = $1
    `;
    const result = await this.db.executeQuery(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException(
        `Mata pelajaran dengan id ${id} tidak ditemukan`,
      );
    }

    return this.mapToDto(result.rows[0]);
  }

  // UPDATE
  async update(
    id: number,
    req: UpdateMataPelajaranDto,
  ): Promise<MataPelajaranDto> {
    await this.findOne(id);

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;


    if (req.nama !== undefined) {
      fields.push(`nama_mapel = $${paramIndex++}`);
      values.push(req.nama);
    }
    if (req.kode !== undefined) {
      fields.push(`kode_mapel = $${paramIndex++}`);
      values.push(req.kode);
    }
    if (req.deskripsi !== undefined) {
      fields.push(`deskripsi = $${paramIndex++}`);
      values.push(req.deskripsi);
    }
    if (req.kode_kelas !== undefined) {
      fields.push(`kode_kelas = $${paramIndex++}`);
      values.push(req.kode_kelas);
    }

    if (fields.length === 0) {
      throw new ConflictException('Tidak ada data yang diupdate');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    try {
      const query = `
        UPDATE mata_pelajaran
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
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

  async delete(id : number): Promise<string> {
    await this.findOne(id);

    const query = `
      DELETE FROM mata_pelajaran
      WHERE id = $1
    `;

    await this.db.executeQuery(query, [id]);

    return `Mata pelajaran dengan id ${id} berhasil dihapus`;
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
      id : row.id,
      kode: row.kode_mapel,
      nama: row.nama_mapel,
      kode_kelas : row.kode_kelas,
      deskripsi: row.deskripsi,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
