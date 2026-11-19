import { Module } from '@nestjs/common';

import { PromptsService } from './services/prompts.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PromptsService],
  exports: [PromptsService],
})
export class PromptsModule {}
