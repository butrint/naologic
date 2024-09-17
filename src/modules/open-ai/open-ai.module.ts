import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAIService } from './open-ai.service';
import openAIConfig from '../../config/openai.config';

@Module({
  imports: [ConfigModule.forFeature(openAIConfig)],
  controllers: [],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
