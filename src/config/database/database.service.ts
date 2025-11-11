// src/config/database/database.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { DATABASE_POOL } from './database.config';

@Injectable()
export class DatabaseService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async executeQuery(query: string, params: any[]): Promise<QueryResult> {
    return await this.pool.query(query, params);
  }

  async findOne<T = any>(query: string, ...params: any[]): Promise<T | null> {
    const result = await this.pool.query(query, params);
    return result.rows[0] || null;
  }

  async findMany<T = any>(query: string, ...params: any[]): Promise<T[]> {
    const result = await this.pool.query(query, params);
    return result.rows;
  }
}