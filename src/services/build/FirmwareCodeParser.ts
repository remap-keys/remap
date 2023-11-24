import {
  IBuildableFirmwareCodeParameter,
  IBuildableFirmwareCodeParameterType,
} from '../../store/state';

const extractAttribute = (
  tag: string,
  attributeName: string
): string | undefined => {
  const pattern = new RegExp(`${attributeName}="([^"]+)"`);
  const match = pattern.exec(tag);
  return match ? match[1] : undefined;
};

const isValidType = (
  type: string
): type is IBuildableFirmwareCodeParameterType => {
  return ['select', 'text', 'number'].includes(type);
};

export const replaceBuildableFirmwareCodeWithParameterDefaultValues = (
  input: string,
  parameters: IBuildableFirmwareCodeParameter[]
): string => {
  const sortedParameters = parameters.sort(
    (a, b) => b.startPosition - a.startPosition
  );
  return sortedParameters.reduce<string>((result, parameter): string => {
    return (
      result.substring(0, parameter.startPosition) +
      parameter.default +
      result.substring(parameter.endPosition)
    );
  }, input);
};

export const extractBuildableFirmwareCodeParameters = (
  input: string
): IBuildableFirmwareCodeParameter[] => {
  const remapTagPattern = /<remap\s+([^>]+?)\s*\/>/g;
  let match: RegExpExecArray | null;
  const parameters: IBuildableFirmwareCodeParameter[] = [];

  while ((match = remapTagPattern.exec(input)) !== null) {
    const startPosition = match.index;
    const endPosition = remapTagPattern.lastIndex;
    const tagContent = match[1];

    const name = extractAttribute(tagContent, 'name');
    const type = extractAttribute(tagContent, 'type');
    const options = extractAttribute(tagContent, 'options');
    const defaultValue = extractAttribute(tagContent, 'default');
    const comment = extractAttribute(tagContent, 'comment');

    if (
      !name ||
      !type ||
      !defaultValue ||
      !isValidType(type) ||
      (type === 'select' && !options)
    ) {
      continue;
    }

    const parameter: IBuildableFirmwareCodeParameter = {
      name,
      type: type as 'select' | 'text' | 'number',
      default: defaultValue,
      comment,
      options: [],
      startPosition,
      endPosition,
    };

    if (type === 'select') {
      parameter.options = options!.split(',');
    }

    parameters.push(parameter);
  }

  return parameters;
};
