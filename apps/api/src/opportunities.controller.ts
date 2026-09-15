import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import type { OpportunityPage } from '@oppora/contracts';
import { OPPORTUNITIES, toSummary } from './fixtures';

@Controller('api/v1/opportunities')
export class OpportunitiesController {
  @Get()
  list(@Query('limit') limit?: string): OpportunityPage {
    const max = limit ? Math.min(100, Math.max(1, Number(limit))) : 20;
    const items = OPPORTUNITIES.slice(0, max).map(toSummary);
    return { items, nextCursor: null, hasMore: false };
  }

  @Get(':opportunityId')
  getOne(@Param('opportunityId') opportunityId: string) {
    const found = OPPORTUNITIES.find((o) => o.id === opportunityId);
    if (!found) {
      throw new NotFoundException(`Opportunity ${opportunityId} not found`);
    }
    return found;
  }
}
