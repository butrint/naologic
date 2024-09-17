import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CsvService } from '../products/csv.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private csvService: CsvService) {}

  @Cron('7 16 * * *')
  async handleCron() {
    try {
      this.logger.log('started!');
      this.csvService.readLargeCsv();
      this.logger.debug('Called when the current second is 45');
    } catch (e) {
      this.logger.error(e);
    }
  }
}
