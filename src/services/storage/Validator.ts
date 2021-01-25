/* eslint-disable no-undef */
import Ajv from 'ajv';
import { KeyboardDefinitionSchema } from '../../gen/types/KeyboardDefinition';
import schema from './assets/keyboard-definition-schema.json';

export interface IValidateKeyboardDefinitionResult {
  valid: boolean;
  errors?: SchemaValidateError[];
}

export type SchemaValidateError = {
  keyword: string;
  dataPath: string;
  schemaPath?: string;
  params?: any;
  message: string;
};

export type ValidateKeyboardDefinitionSchemaResult = {
  valid: boolean;
  errors?: SchemaValidateError[];
};

export const isJsonFile = (file: File): boolean => {
  return file.type.endsWith('/json');
};

export const validateIds = (
  keyboardDefinition: KeyboardDefinitionSchema,
  deviceVendorId: number,
  deviceProductId: number
): string | null => {
  const getNumber = (source: string): number => {
    if (!source) {
      return NaN;
    } else if (source.startsWith('0x')) {
      const target = source.substring(2);
      return Number.parseInt(target, 16);
    } else {
      return Number.parseInt(source);
    }
  };
  const vendorId = getNumber(keyboardDefinition.vendorId);
  const productId = getNumber(keyboardDefinition.productId);
  if (vendorId !== deviceVendorId) {
    return `Invalid the vendor ID: ${vendorId}`;
  }
  if (productId !== deviceProductId) {
    return `Invalid the product ID: ${productId}`;
  }
  return null;
};

export const validateKeyboardDefinitionSchema = (
  json: Object,
  schemaObject: Object = schema
): ValidateKeyboardDefinitionSchemaResult => {
  const ajv = new Ajv();
  const validate = ajv.compile(schemaObject);
  const valid = validate(json);
  if (valid) {
    return { valid: true };
  } else {
    return {
      valid: false,
      errors: (validate.errors! as SchemaValidateError[]).map((err) =>
        buildError(err, json)
      ),
    };
  }
};

export const buildError = (
  error: SchemaValidateError,
  json: Object
): SchemaValidateError => {
  let msg = error.message;
  if (error.keyword == 'pattern') {
    msg = `<strong>${getValue(
      error.dataPath,
      json
    )}</strong> should match pattern /${error.params!.pattern.replace(
      /\n/g,
      '\\n'
    )}/`;
  } else if (error.keyword == 'type') {
    msg = `<strong>${getValue(error.dataPath, json)}</strong> ${error.message}`;
  } else if (error.keyword == 'required') {
    msg = `<strong>${error.params!.missingProperty}</strong> is required`;
  }
  return {
    ...error,
    dataPath: error.dataPath || '/',
    message: msg,
  };
};

const getValue = (path: string, json: any): any => {
  const paths = path.split('/');
  paths.shift();
  let obj = json;
  while (0 < paths.length) {
    const key = paths.shift() as string;
    obj = obj[key];
  }
  return JSON.stringify(obj);
};
