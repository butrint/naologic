import { registerAs } from '@nestjs/config';

export default registerAs('openai', () => ({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.OPEN_API_KEY,
}));
