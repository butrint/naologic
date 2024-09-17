import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CsvService } from '../products/csv.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private csvService: CsvService) {}

  @Cron('30 2 * * *')
  async handleCron() {
    try {
      this.logger.log('started!');
      this.csvService.readLargeCsv();
      this.logger.debug(
        'Job started reading CSV and creating/updating products!',
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
