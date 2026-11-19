import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import {
  ResponseInterceptor,
  RequestLoggingInterceptor,
} from '@common/interceptors';
import { AIModule } from './modules/ai/ai.module';
import { CommonModule } from '@common/common.module';
import { PromptsModule } from './modules/prompts/prompts.module';

@Module({
  imports: [AIModule, CommonModule, PromptsModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
