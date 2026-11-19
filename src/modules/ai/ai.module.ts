import OpenAI from 'openai';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AIService } from '@modules/ai/services/ai.service';
import { AIController } from '@modules/ai/ai.controller';
import { PromptsModule } from '@modules/prompts/prompts.module';

@Module({
  imports: [PromptsModule],
  controllers: [AIController],
  providers: [
    AIService,
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        return new OpenAI({
          apiKey: configService.get<string>('OPENAI_API_KEY'),
          baseURL: configService.get<string>('OPENAI_API_URL'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [AIService],
})
export class AIModule {}
