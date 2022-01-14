import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import KeyboardDefinitionForm from './KeyboardDefinitionForm';
import {
  buildError,
  SchemaValidateError,
} from '../../../services/storage/Validator';
import { KeyboardDefinitionFormPart } from '../../common/keyboarddefformpart/KeyboardDefinitionFormPart';

export default {
  title: 'KeyboardDefinitionForm',
  component: KeyboardDefinitionForm,
  decorators: [
    (Story: any) => (
      <React.Fragment>
        <CssBaseline />
        <Story />
      </React.Fragment>
    ),
  ],
};

class KeyboardDefinitionFormStory extends React.Component<any, {}> {
  private form: KeyboardDefinitionForm;
  constructor(props: any) {
    super(props);
    this.form = new KeyboardDefinitionForm(props);
    this.form.state = {
      initializingKeyboard: props.initializingKeyboard,
    };
  }

  render() {
    return this.form.render();
  }
}

const keyboardInfo = {
  vendorId: 0,
  productId: 0,
  productName: 'Product Name',
};

type Props = {
  loading?: boolean;
  dragging?: boolean;
  errors?: SchemaValidateError[];
  keyboardInfo: any;
  messageHtml: string;
};
class KeyboardDefinitionFormPartStory extends React.Component<Props, {}> {
  private form: KeyboardDefinitionFormPart;
  constructor(props: any) {
    super(props);
    this.form = new KeyboardDefinitionFormPart(props);
    this.form.state = {
      loading: !!props.loading,
      dragging: !!props.dragging,
      errors: props.errors || null,
      invalidFileError: null,
    };
  }

  render() {
    return this.form.render();
  }
}

export const Default = () => (
  <KeyboardDefinitionFormStory
    keyboardInfo={keyboardInfo}
    initializingKeyboard={false}
  />
);

export const InitializingKeyboard = () => (
  <KeyboardDefinitionFormStory
    keyboardInfo={keyboardInfo}
    initializingKeyboard={true}
  />
);

export const Loading = () => (
  <KeyboardDefinitionFormPartStory
    messageHtml={
      'Please import your <strong>Product Name</strong> definition file(.json).'
    }
    keyboardInfo={keyboardInfo}
    loading={true}
    dragging={false}
  />
);

export const Dragging = () => (
  <KeyboardDefinitionFormPartStory
    messageHtml={
      'Please import your <strong>Product Name</strong> definition file(.json).'
    }
    keyboardInfo={keyboardInfo}
    loading={false}
    dragging={true}
  />
);

const json = {
  vendorId: '0xFF00F',
  matrix: {
    rows: '5',
    cols: 5,
  },
  layouts: {
    keymap: [['0.0\n\n\n1,0']],
  },
};
const errors = [
  {
    keyword: 'pattern',
    dataPath: '/layouts/keymap/0/0',
    schemaPath:
      '#/properties/layouts/properties/keymap/items/anyOf/0/items/anyOf/0/pattern',
    params: {
      pattern:
        '^([1-9][0-9]*|0),([1-9][0-9]*|0)((\n.*){2}?\n([1-9][0-9]*|0),([1-9][0-9]*|0)(\n.*){0,8}?|(\n.*){0,2}?)?$',
    },
    message:
      'should match pattern "^([1-9][0-9]*|0),([1-9][0-9]…9]*|0),([1-9][0-9]*|0)(\n.*){0,8}?|(\n.*){0,2}?)?$"',
  },
  {
    keyword: 'pattern',
    dataPath: '/vendorId',
    schemaPath: '#/properties/vendorId/pattern',
    params: { pattern: '^0x[0-9a-zA-Z]{1,4}$' },
    message: 'Invalid value "0xfeed0"',
  },
  {
    keyword: 'required',
    dataPath: '',
    schemaPath: '#/required',
    params: { missingProperty: 'vendorId' },
    message: "should have required property 'vendorId'",
  },
  {
    dataPath: '/layouts/keymap/0/0',
    keyword: 'type',
    message: 'should be object',
    params: {
      type: 'object',
    },
    schemaPath: '#/definitions/KeyOp/type',
  },
  {
    keyword: 'type',
    dataPath: '/matrix/rows',
    schemaPath: '#/properties/matrix/properties/rows/type',
    params: { type: 'integer' },
    message: 'should be integer',
  },
];
export const Errors = () => (
  <KeyboardDefinitionFormPartStory
    messageHtml={
      'Please import your <strong>Product Name</strong> definition file(.json).'
    }
    keyboardInfo={keyboardInfo}
    errors={errors.map((err) => buildError(err, json))}
  />
);
