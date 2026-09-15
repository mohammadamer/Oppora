import { Module } from '@nestjs/common';
import { OpportunitiesController } from './opportunities.controller';
import { SourcesController } from './sources.controller';

@Module({
  controllers: [OpportunitiesController, SourcesController],
})
export class AppModule {}
