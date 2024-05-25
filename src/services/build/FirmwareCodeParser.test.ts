import { describe, expect, test } from 'vitest';
import {
  extractBuildableFirmwareCodeParameters,
  replaceBuildableFirmwareCodeWithParameterDefaultValues,
} from './FirmwareCodeParser';
import { IBuildableFirmwareCodeParameter } from '../../store/state';

describe('FirmwareCodeParser', () => {
  describe('replaceBuildableFirmwareCodeWithParameterDefaultValues', () => {
    test('should replace with default values', () => {
      const input = `
        <remap name="foo" type="select" default="baz" options="bar,baz" />
        <remap name="bar" type="text" default="john" />
        <remap name="baz" type="number" default="20" />
        <remap name="john" type="toggle" default="doe" />
      `;
      const parameters: IBuildableFirmwareCodeParameter[] =
        extractBuildableFirmwareCodeParameters(input);

      const replaced = replaceBuildableFirmwareCodeWithParameterDefaultValues(
        input,
        parameters,
      );

      expect(replaced).toEqual(`
        baz
        john
        20
        doe
      `);
    });

    test('should replace with default values without the parameter which has no options', () => {
      const input = `
        <remap name="foo" type="select" default="baz" />
        <remap name="bar" type="text" default="john" />
        <remap name="baz" type="number" default="20" />
        <remap name="john" type="toggle" default="doe" />
      `;
      const parameters: IBuildableFirmwareCodeParameter[] =
        extractBuildableFirmwareCodeParameters(input);

      const replaced = replaceBuildableFirmwareCodeWithParameterDefaultValues(
        input,
        parameters,
      );

      expect(replaced).toEqual(`
        <remap name="foo" type="select" default="baz" />
        john
        20
        doe
      `);
    });
  });

  describe('extractBuildableFirmwareCodeParameters', () => {
    test('should extract parameters from source', () => {
      const source = `
        <remap name="foo" type="select" default="baz" options="bar,baz" />
        <remap name="bar" type="text" default="john" />
        <remap name="baz" type="number" default="20" />
        <remap name="john" type="toggle" default="doe" />
      `;

      const parameters = extractBuildableFirmwareCodeParameters(source);

      expect(parameters).toEqual([
        {
          name: 'foo',
          type: 'select',
          options: ['bar', 'baz'],
          default: 'baz',
          startPosition: 9,
          endPosition: 75,
        },
        {
          name: 'bar',
          type: 'text',
          options: [],
          default: 'john',
          startPosition: 84,
          endPosition: 131,
        },
        {
          name: 'baz',
          type: 'number',
          options: [],
          default: '20',
          startPosition: 140,
          endPosition: 187,
        },
        {
          name: 'john',
          type: 'toggle',
          options: [],
          default: 'doe',
          startPosition: 196,
          endPosition: 245,
        },
      ]);
    });

    test('should extract parameters from source without the parameter which has no options', () => {
      const source = `
        <remap name="foo" type="select" default="baz" />
        <remap name="bar" type="text" default="john" />
        <remap name="baz" type="number" default="20" />
        <remap name="john" type="toggle" default="doe" />
      `;

      const parameters = extractBuildableFirmwareCodeParameters(source);

      expect(parameters).toEqual([
        {
          name: 'bar',
          type: 'text',
          options: [],
          default: 'john',
          startPosition: 66,
          endPosition: 113,
        },
        {
          name: 'baz',
          type: 'number',
          options: [],
          default: '20',
          startPosition: 122,
          endPosition: 169,
        },
        {
          name: 'john',
          type: 'toggle',
          options: [],
          default: 'doe',
          startPosition: 178,
          endPosition: 227,
        },
      ]);
    });

    test('should extract parameters from source without the parameter which has unknown type', () => {
      const source = `
        <remap name="foo" type="select" options="bar,baz" default="baz" />
        <remap name="bar" type="unknown" default="john" />
        <remap name="baz" type="number" default="20" />
        <remap name="john" type="toggle" default="doe" />
      `;

      const parameters = extractBuildableFirmwareCodeParameters(source);

      expect(parameters).toEqual([
        {
          name: 'foo',
          type: 'select',
          options: ['bar', 'baz'],
          default: 'baz',
          startPosition: 9,
          endPosition: 75,
        },
        {
          name: 'baz',
          type: 'number',
          options: [],
          default: '20',
          startPosition: 143,
          endPosition: 190,
        },
        {
          name: 'john',
          type: 'toggle',
          options: [],
          default: 'doe',
          startPosition: 199,
          endPosition: 248,
        },
      ]);
    });

    test('should extract parameters from source with comment', () => {
      const source = `
        <remap name="foo" type="select" default="baz" options="bar,baz" comment="comment1" />
        <remap name="bar" type="text" default="john" comment="comment2" />
        <remap name="baz" type="number" default="20" comment="comment3 foobar" />
        <remap name="john" type="toggle" default="doe" comment="comment4 baz" />
      `;

      const parameters = extractBuildableFirmwareCodeParameters(source);

      expect(parameters).toEqual([
        {
          name: 'foo',
          type: 'select',
          options: ['bar', 'baz'],
          default: 'baz',
          comment: 'comment1',
          startPosition: 9,
          endPosition: 94,
        },
        {
          name: 'bar',
          type: 'text',
          options: [],
          default: 'john',
          comment: 'comment2',
          startPosition: 103,
          endPosition: 169,
        },
        {
          name: 'baz',
          type: 'number',
          options: [],
          default: '20',
          comment: 'comment3 foobar',
          startPosition: 178,
          endPosition: 251,
        },
        {
          name: 'john',
          type: 'toggle',
          options: [],
          default: 'doe',
          comment: 'comment4 baz',
          startPosition: 260,
          endPosition: 332,
        },
      ]);
    });
  });
});
