import Ajv from 'ajv';
import schema from './assets/keyboard-definition-schema.json';

export interface IValidateKeyboardDefinitionResult {
  valid: boolean;
  errorMessage?: string;
}

export const validateKeyboardDefinition = (
  source: string
): IValidateKeyboardDefinitionResult => {
  let root;
  try {
    root = JSON.parse(source);
  } catch (error) {
    return {
      valid: false,
      errorMessage: `JSON parse error: ${error}`,
    };
  }

  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(root);
  if (valid) {
    return { valid: true };
  } else {
    validate.errors!.map((error) => console.log(error));
    const errorMessage = validate
      .errors!.map(
        (error) =>
          `Invalid JSON file: [${error.keyword}] ${error.schemaPath} ${error.message}`
      )
      .join('\n');
    return {
      valid: false,
      errorMessage,
    };
  }
};

export type SchemaValidateError = {
  keyword: string;
  dataPath: string;
  schemaPath: string;
  params: any;
  message: string;
};
export type ValidateKeyboardDefinitionSchemaResult = {
  valid: boolean;
  errors?: SchemaValidateError[];
};
export const validateKeyboardDefinitionSchema = (
  json: Object,
  jsonSchema: Object
): ValidateKeyboardDefinitionSchemaResult => {
  const ajv = new Ajv();
  const validate = ajv.compile(jsonSchema);
  const valid = validate(json);
  if (valid) {
    return { valid: true };
  } else {
    return {
      valid: false,
      errors: validate.errors! as SchemaValidateError[],
    };
  }
};
