import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { OPPORTUNITIES } from './fixtures';

@Controller('api/v1/sources')
export class SourcesController {
  @Get(':sourceId')
  getOne(@Param('sourceId') sourceId: string) {
    const found = OPPORTUNITIES.map((o) => o.source).find((s) => s.id === sourceId);
    if (!found) {
      throw new NotFoundException(`Source ${sourceId} not found`);
    }
    return found;
  }
}
