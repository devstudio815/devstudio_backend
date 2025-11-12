import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';
import { FilterkelasDto, KelasDto, UpsertKelasDto } from './kelas.dto';
import {
  PaginatedResponseDto,
  PaginationDto,
} from 'src/common/dto/pagination.dto';

@Injectable()
export class KelasService {
  constructor(private readonly db: DatabaseService) {}

  async Create(req: UpsertKelasDto): Promise<string> {
    const query = ` 
            insert into kelas 
            (
                kode,
                wali_kelas,
                created_at,
                updated_at
            ) VALUES 
            ($1,$2,now(),now())
       `;
    const create = this.db.executeQuery(query, [req.kode, req.wali_kelas]);

    if (!create) {
      throw new Error('failed to create');
    }

    return 'create kelas successfully';
  }
  async GetAll(req: FilterkelasDto) {
    const { limit, page, search } = req;
    const offset = ((page ?? 1) - 1) * (limit ?? 10);

    let query = `
        SELECT 
          kode_kelas,
          wali_kelas,
          created_at,
          updated_at 
        FROM kelas
      `;

    let countQuery = 'SELECT COUNT(*) as total FROM kelas';
    const queryParams: any[] = [];
    const countParams: string[] = [];

    if (search && search.trim() !== '') {
      const searchCondition = ` WHERE kode_kelas ILIKE $1 OR wali_kelas ILIKE $1`;
      query += searchCondition;
      countQuery += searchCondition;

      queryParams.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    const limitParam = queryParams.length + 1;
    const offsetParam = queryParams.length + 2;

    query += ` ORDER BY kode_kelas ASC LIMIT $${limitParam} OFFSET $${offsetParam}`;
    queryParams.push(limit, offset);

    const [dataResult, countResult] = await Promise.all([
      this.db.findMany(query, ...queryParams),
      this.db.findOne(countQuery, ...countParams),
    ]);

    const totalItems = parseInt(countResult.total);
    const data = dataResult.map((row) => this.mapToDto(row));
    const pagination = new PaginationDto(
      page as number,
      limit as number,
      totalItems,
    );

    return new PaginatedResponseDto(data, pagination);
  }
  private mapToDto(row: any): KelasDto {
    return {
      kode: row.kode_kelas,
      wali_kelas: row.wali_kelas,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
