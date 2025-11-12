import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MataPelajaranService } from './mata-pelajaran.service';
import {
  CreateMataPelajaranDto,
  QueryPaginationDto,
  UpdateMataPelajaranDto,
} from './mata-pelajaran.dto';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptors';

@Controller('mata-pelajaran')
export class MataPelajaranController {
  constructor(private readonly mapelService: MataPelajaranService) {}
  @Post('')
  async create(@Body() req: CreateMataPelajaranDto) {
    return TransformInterceptor.prototype.intercept(
      this.mapelService.create(req),
      true,
      HttpStatus.CREATED,
      'Create Mata Pelajaran Successfully',
    );
  }

  @Get()
  async findAll(@Query() query: QueryPaginationDto) {
    const { limit, page, search } = query;
    return this.mapelService.findAll(limit || 10, page || 1, search);
  }
  @Put(':id')
  async put(@Param('id') id: string, @Body() req: UpdateMataPelajaranDto) {
    return TransformInterceptor.prototype.intercept(
      this.mapelService.update(parseInt(id), req),
      true,
      HttpStatus.OK,
      'Update Mata Pelajaran Successfully',
    );
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return TransformInterceptor.prototype.intercept(
      this.mapelService.delete(parseInt(id)),
      true,
      HttpStatus.OK,
      'Delete Mata Pelajaran Successfully',
    );
  }
}
