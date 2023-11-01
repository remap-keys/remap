import {
  IBuildableFirmwareCodeParameter,
  IBuildableFirmwareCodeParameterType,
} from '../../store/state';

const isBuildableFirmwareCodeParameterType = (
  value: string
): value is IBuildableFirmwareCodeParameterType => {
  return ['select', 'text', 'number'].includes(value);
};

export const extractBuildableFirmwareCodeParameters = (
  source: string
): IBuildableFirmwareCodeParameter[] => {
  const parameters: IBuildableFirmwareCodeParameter[] = [];

  const regex =
    /<remap\s+(?:name="([^"]+)"\s+)?(?:type="([^"]+)"\s+)?(?:options="([^"]+)"\s+)?(?:default="([^"]+)"\s+)?\/>/g;

  let match;
  while ((match = regex.exec(source))) {
    const attributes = match[0].match(/(\w+)="([^"]+)"/g) || [];
    const attributeMap: { [key: string]: string } = {};
    attributes.forEach((attribute) => {
      const [key, value] = attribute.split('=').map((v) => v.replace(/"/g, ''));
      attributeMap[key] = value;
    });

    if (attributeMap.name === undefined) {
      // Skip the parameter which has no name.
      continue;
    }
    if (attributeMap.default === undefined) {
      // Skip the parameter which has no default value.
      continue;
    }
    if (attributeMap.type === undefined) {
      // Skip the parameter which has no type.
      continue;
    }

    const typ = attributeMap.type;
    if (!isBuildableFirmwareCodeParameterType(typ)) {
      // Skip the parameter which has unknown type.
      continue;
    }

    const options = attributeMap.options
      ? attributeMap.options.split(',').map((x) => x.trim())
      : [];

    if (typ === 'select' && options.length === 0) {
      // Skip the parameter which has no options.
      continue;
    }

    parameters.push({
      name: attributeMap.name,
      type: typ,
      options: options,
      default: attributeMap.default,
      startPosition: match.index,
      endPosition: match.index + match[0].length,
    });
  }

  return parameters;
};
