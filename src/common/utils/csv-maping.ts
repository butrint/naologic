import { nanoid } from 'nanoid';
import { CSVResponseDTO } from 'src/dtos/CSVResponse.dto';
import { Product } from 'src/schemas/product.schema';
import { PRODUCT_TYPE } from '../enums/product-type.enum';
import { STORE_FRONT_PRICEVISIBILITY } from '../enums/store-front-price-visibility.enum';
import { DOC_STATUS, DOC_TYPE } from '../enums/doc.enum';
import { Variant } from 'src/schemas/variant.schema';
import { Option } from 'src/schemas/option.schema';
import { OPTION_VARIANT } from '../enums/option-variant.enum';

export const getMappedCSVToProduct = (
  csvRow: CSVResponseDTO,
): Partial<Product> => {
  const options: Option[] = getMappedCSVToOptions(csvRow);
  const variant: Variant = getMappedCSVToVariant(csvRow, options);

  const product: Partial<Product> = {
    docId: nanoid(),
    productId: csvRow.ProductID,
    data: {
      name: csvRow.ProductName,
      availability: csvRow.Availability,
      description: csvRow.ProductDescription,
      vendorId: nanoid(),
      type: PRODUCT_TYPE.non_inventory,
      categoryId: csvRow.CategoryID,
      categoryPath: `${csvRow.PrimaryCategoryName}, ${csvRow.SecondaryCategoryName}, ${csvRow.CategoryName}`,
      images: {
        alt: '',
        cdnLink: csvRow.ItemImageURL,
        fileName: csvRow.ImageFileName,
        i: 0,
      },
      isFragile: true,
      isTaxable: true,
      manufacturerId: csvRow.ManufacturerID,
      published: '',
      storefrontPriceVisibility: STORE_FRONT_PRICEVISIBILITY.members,
      variants: [variant],
      options,
    },
    categoryId: csvRow.CategoryID,
    companyId: '',
    deploymentId: '',
    docType: DOC_TYPE.item,
    immutable: false,
    status: DOC_STATUS.active,
    namespace: 'items',
    info: {
      createdAt: new Date(),
      createdBy: 'me',
      updatedAt: new Date(),
      updatedBy: '12',
    },
  };

  return product;
};

export const getMappedCSVToVariant = (
  csvRow: CSVResponseDTO,
  options: Option[],
): Variant => {
  const cost = /^\d+\.?\d*$/.test(csvRow.UnitPrice || '')
    ? parseFloat(csvRow.UnitPrice || '')
    : 0;
  const tax = 11.2;
  const price = cost + tax;

  const packagingOption = options[0];
  const descriptionOption = options[1];

  const optionsPath = `${packagingOption?.id}.${descriptionOption?.id}`;
  const optionItemsPath =
    descriptionOption?.values?.length && packagingOption?.values?.length
      ? `${packagingOption?.values[0]?.id}.${descriptionOption?.values[0]?.id}`
      : null;

  return {
    available: true,
    attributes: {
      packaging: csvRow.PKG,
      description: csvRow.ItemDescription,
    },
    cost,
    currency: 'USD',
    depth: null,
    description: csvRow.ItemDescription,
    dimensionUom: null,
    height: null,
    width: null,
    manufacturerItemCode: csvRow.ManufacturerItemCode,
    manufacturerItemId: csvRow.ItemID,
    packaging: csvRow.PKG,
    price,
    volume: null,
    volumeUom: null,
    weight: null,
    weightUom: null,
    optionName: `${csvRow.PKG}, ${csvRow.ItemDescription}`,
    optionsPath,
    optionItemsPath,
    sku: '',
    active: true,
    images: [
      {
        fileName: '',
        cdnLink: '',
        i: 0,
        alt: null,
      },
    ],
    itemCode: csvRow.ItemID,
  };
};

export const getMappedCSVToOptions = (csvRow: CSVResponseDTO): Option[] => {
  const packagingOption: Option = {
    id: nanoid(),
    name: OPTION_VARIANT.packaging,
    values: [
      {
        id: nanoid(),
        name: csvRow.PKG,
        value: csvRow.PKG,
      },
    ],
  };

  const descriptionOption: Option = {
    id: nanoid(),
    name: OPTION_VARIANT.description,
    values: [
      {
        id: nanoid(),
        name: csvRow.ItemDescription,
        value: csvRow.ItemDescription,
      },
    ],
  };

  return [packagingOption, descriptionOption];
};
