/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import openaiConfig from 'src/config/openai.config';
import { ProductAIReqDTO } from 'src/dtos/ProductAIReq.dto';

@Injectable()
export class OpenAIService {
  private readonly apiKey: string;
  private readonly organizationKey: string;
  private chatGPT: ChatOpenAI;

  constructor(
    @Inject(openaiConfig.KEY)
    private openAIConfig: ConfigType<typeof openaiConfig>,
  ) {
    this.apiKey = this.openAIConfig.organization!;
    this.organizationKey = this.openAIConfig.organization!;
    this.chatGPT = new ChatOpenAI(
      {
        model: 'gpt-3.5-turbo',
      },
      {
        apiKey: this.apiKey,
        organization: this.organizationKey,
      },
    );
  }

  async get(productAIReq: ProductAIReqDTO): Promise<string> {
    const systemMessage = new SystemMessage({
      content: `You are an expert in medical sales.
          Your specialty is medical consumables used by hospitals on a daily basis.
          Your task to enhance the description of a product based on the information provided.`,
    });
    const userMessage = new HumanMessage({
      content: `
        Product name: ${productAIReq.name}
        Product description: $${productAIReq.description}
        Category: $${productAIReq.category}`,
    });

    const chunkMessage = await this.chatGPT.invoke([
      systemMessage,
      userMessage,
    ]);

    return chunkMessage.content.toString();
  }
}
