/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CSVResponseDTO } from 'src/dtos/CSVResponse.dto';
import {
  getMappedCSVToOptions,
  getMappedCSVToProduct,
  getMappedCSVToVariant,
} from './csv-maping';
import { OPTION_VARIANT } from '../enums/option-variant.enum';

describe('Product Mapping Functions', () => {
  const sampleCsvRow: CSVResponseDTO = {
    SiteSource: 'AIM',
    ItemID: '10289480',
    ManufacturerID: '563',
    ManufacturerCode: '10000701',
    ManufacturerName: 'BSN Medical/Jobst',
    ProductID: '10033525',
    ProductName: 'BSN MEDICAL JOBST ULTRASHEER COMPRESSION STOCKINGS',
    ProductDescription:
      'Seamless circular knitted for a soft, silky look and comfortable feel. Reciprocated heel and toe for better fit and durability. Maternity styles provide a little "extra" for the mother-to-be. Assorted colors. Available in knee high, thigh high and pantyhose styles.',
    ManufacturerItemCode: '121529',
    ItemDescription:
      'Compression Stocking, Waist High, 20-30 mmHG, Closed Toe, Suntan, Small',
    ImageFileName: '',
    ItemImageURL: '',
    NDCItemCode: 'BSN 121529',
    PKG: 'pr',
    UnitPrice: '76.7',
    QuantityOnHand: '0',
    PriceDescription: '',
    Availability: '14-21 Days',
    PrimaryCategoryID: '12',
    PrimaryCategoryName: 'Orthopedic & Physical Therapy',
    SecondaryCategoryID: '115',
    SecondaryCategoryName: 'Soft Goods',
    CategoryID: '742',
    CategoryName: 'Compression',
    IsRX: 'N',
    IsTBD: 'N',
  };

  test('getMappedCSVToProduct should map CSV data to a Product object correctly', () => {
    const product = getMappedCSVToProduct(sampleCsvRow);

    expect(product).toBeDefined();
    expect(product.productId).toBe(sampleCsvRow.ProductID);
    expect(product.data!.name).toBe(sampleCsvRow.ProductName);
    expect(product.data!.categoryId).toBe(sampleCsvRow.CategoryID);
    expect(product.data!.variants).toHaveLength(1);
    expect(product.data!.variants[0].sku).toBe('');
  });

  test('should map CSV row to Variant object correctly', () => {
    const options = getMappedCSVToOptions(sampleCsvRow);
    const variant = getMappedCSVToVariant(sampleCsvRow, options);

    expect(variant).toBeDefined();
    expect(variant.cost).toBe(76.7);
    expect(variant.price).toBe(87.9);
    expect(variant.attributes!.packaging).toBe(sampleCsvRow.PKG);
    expect(variant.optionName).toBe(
      `${sampleCsvRow.PKG}, ${sampleCsvRow.ItemDescription}`,
    );
  });

  test('should map CSV row to Option objects correctly', () => {
    const [packagingOption, itemDescriptionOption] =
      getMappedCSVToOptions(sampleCsvRow);

    const valueOfDescriptionOption = itemDescriptionOption?.values![0];
    const valuePackagingOption = packagingOption?.values![0];

    expect(packagingOption).toBeDefined();
    expect(itemDescriptionOption).toBeDefined();
    expect(itemDescriptionOption.name).toBe(OPTION_VARIANT.description);
    expect(packagingOption.name).toBe(OPTION_VARIANT.packaging);
    expect(valueOfDescriptionOption!.value).toBe(sampleCsvRow.ItemDescription);
    expect(valuePackagingOption!.value).toBe(sampleCsvRow.PKG);
  });
});
