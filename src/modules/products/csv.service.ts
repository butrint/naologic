import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { join } from 'path';
import { ProductsService } from './products.service';
import { CSVResponseDTO } from 'src/dtos/CSVResponse.dto';

@Injectable()
export class CsvService {
  private readonly logger = new Logger(CsvService.name);
  private filePath = join(process.cwd()) + '/src/samples/images40.txt';

  constructor(private productsService: ProductsService) {}

  async readLargeCsv(): Promise<void> {
    const batchSize = 1000;
    let batch: CSVResponseDTO[] = [];

    const readStream = fs
      .createReadStream(this.filePath)
      .pipe(csv({ separator: '\t' }));

    readStream.on('data', async (row) => {
      batch.push(row);

      try {
        if (batch.length >= batchSize) {
          readStream.pause();
          await this.saveProducts(batch);
          batch = [];
        }
      } catch (error) {
        console.error('Error processing row:', error);
      }

      readStream.resume();
    });

    readStream.on('end', async () => {
      if (batch.length > 0) {
        await this.saveProducts(batch);
        console.log('Processing last batch:', batch);
      }

      this.logger.log('Processing last batch:', batch);
    });

    readStream.on('error', (error) => {
      this.logger.log('An error occured :', error);
    });
  }

  async saveProducts(csvData: CSVResponseDTO[]) {
    await this.productsService.bulkCreateFromCSV(csvData);
  }
}
