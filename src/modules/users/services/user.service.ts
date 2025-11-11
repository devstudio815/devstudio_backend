import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';
import { RegisterDto } from '../dtos/auth.dto';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async create(registerDto: RegisterDto) {
    const query = await this.db.executeQuery(
      `INSERT INTO users (username, email, password, role,created_at, updated_at)    
            VALUES ($1, $2, $3, $4,now(), now())
            RETURNING id, username, email, role, created_at, updated_at`,
      [
        registerDto.username,
        registerDto.email,
        registerDto.password,
        registerDto.role,
      ],
    );

    if (!query) {
      throw new Error('User creation failed');
    }
    return query.rows[0];
  }
  async findById(id: number) {
    const query = await this.db.executeQuery(
      `SELECT id, username, email, role, created_at, updated_at
             FROM users
             WHERE id = $1`,
      [id],
    );
    if (query.rowCount === 0) {
      throw new Error('User not found');
    }
    return query.rows[0];
  }
  async findByUsername(username: string) {
    const query = await this.db.executeQuery(
      `SELECT id, username, email, password, role, created_at, updated_at
             FROM users
             WHERE username = $1`,
      [username],
    );
    if (query.rowCount === 0) {
      throw new Error('User not found');
    }
    return query.rows[0];
  }
  async findByEmail(email: string) {
    const query = await this.db.executeQuery(
      `SELECT id, username, email, role, created_at, updated_at
             FROM users
             WHERE email = $1`,
      [email],
    );
    if (query.rowCount === 0) {
      throw new Error('User not found');
    }
    return query.rows[0];
  }
}
