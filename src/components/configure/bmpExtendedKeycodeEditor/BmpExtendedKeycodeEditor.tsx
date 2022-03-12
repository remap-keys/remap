/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import './BmpExtendedKeycodeEditor.scss';
import { Button, Select, MenuItem, Input } from '@mui/material';
import {
  BmpExtendedKeycodeEditorActionsType,
  BmpExtendedKeycodeEditorStateType,
} from './BmpExtendedKeycodeEditor.container';
import {
  BmpExtendedKeycodeLte,
  BmpExtendedKeycodeTlt,
  BmpExtendedKeycodeTdh,
  BmpExtendedKeycodeTdd,
  ExtendedKind,
  IBmpExtendedKeycode,
} from '../../../services/hid/bmp/BmpExtendedKeycode';
import lodash from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { IKeymap } from '../../../services/hid/Hid';
import { genKey, Key } from '../keycodekey/KeyGen';
import { RootState } from '../../../store/state';
import { KeyboardLabelLang } from '../../../services/labellang/KeyLabelLangs';
import CustomKey, { PopoverPosition } from '../customkey/CustomKey';

type BmpExtendedKeycodeEditorOwnProps = {};
type BmpExtendedKeycodeEditorOwnState = {};

type BmpExtendedKeycodeEditorProps = BmpExtendedKeycodeEditorOwnProps &
  Partial<BmpExtendedKeycodeEditorStateType> &
  Partial<BmpExtendedKeycodeEditorActionsType>;

export default class BmpExtendedKeycodeEditor extends React.Component<
  BmpExtendedKeycodeEditorProps,
  BmpExtendedKeycodeEditorOwnState
> {
  constructor(
    props:
      | BmpExtendedKeycodeEditorProps
      | Readonly<BmpExtendedKeycodeEditorProps>
  ) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="bmp-extended-keycode-editor-wrapper">
        <div className="bmp-extended-keycode-editor-content">
          <div className="bmp-extended-keycode-editor-content-title">
            Bmp Extended Keycode Editor (ID:{this.props.extendedKeyId})
          </div>
          <div className="bmp-extended-keycode-editor-content-keys">
            <div>
              <ExtendedKindSelect
                extendedKeycode={this.props.extendedKeycode!}
                onChange={(value) => {
                  this.props.updateBmpExtendedKeycode!(
                    this.props.extendedKeyId!,
                    value
                  );
                }}
              ></ExtendedKindSelect>

              <div>
                <ExtendedKey
                  extendedKeycode={this.props.extendedKeycode!}
                  labelLang={this.props.labelLang!}
                  onChange={(key) =>
                    this.props.updateBmpExtendedKeycode!(
                      this.props.extendedKeyId!,
                      key
                    )
                  }
                ></ExtendedKey>
              </div>
            </div>
          </div>
          <div className="bmp-extended-keycode-editor-content-footer">
            <Button
              size="small"
              variant="text"
              color="primary"
              disableElevation
              onClick={this.props.closeBmpExtendedKeycodeEditor!.bind(this)}
            >
              BACK
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

function ExtendedKindSelect(props: {
  extendedKeycode: IBmpExtendedKeycode;
  onChange: (value: IBmpExtendedKeycode) => void;
}) {
  return (
    <Select
      variant="standard"
      value={props.extendedKeycode.getKind()}
      onChange={(e) => {
        const extendedKeycode = lodash.cloneDeep(props.extendedKeycode);
        extendedKeycode.changeKind(e.target.value as ExtendedKind);
        props.onChange(extendedKeycode);
      }}
    >
      {Object.keys(ExtendedKind)
        .filter((v) => isNaN(Number(v)))
        .map((key) => {
          return (
            <MenuItem
              key={`${key}`}
              value={ExtendedKind[key as keyof typeof ExtendedKind]}
            >
              {key}
            </MenuItem>
          );
        })}
    </Select>
  );
}
interface BmpExtendedKeyProp {
  extendedKeycode: IBmpExtendedKeycode;
  labelLang: KeyboardLabelLang;
  onChange: (update: IBmpExtendedKeycode) => void;
}

function ExtendedKey(props: BmpExtendedKeyProp) {
  switch (props.extendedKeycode.getKind()) {
    case ExtendedKind.TLT:
      return TltExtend(props);
    case ExtendedKind.LTE:
      return LteExtend(props);
    case ExtendedKind.TDD:
      return TddExtend(props);
    case ExtendedKind.TDH:
      return TdhExtend(props);
    default:
      return <div>None</div>;
  }
}

function ExtendedKeyElement(props: {
  keymap: IKeymap;
  labelLang: KeyboardLabelLang;
  onChange: (key: Key) => void;
}) {
  const [onDragOver, setOnDragOver] = useState(false);
  const [openCustomKey, setOpenCustomKey] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
    left: 0,
    top: 0,
    side: 'right',
  });
  const draggingKey = useSelector((state: RootState) => {
    return state.configure.keycodeKey.draggingKey;
  });

  return (
    <div>
      <div
        className={['keycodekey', onDragOver && 'drag-over'].join(' ')}
        onDragOver={(event) => {
          event.preventDefault();
          setOnDragOver(true);
        }}
        onDragLeave={() => {
          setOnDragOver(false);
        }}
        onDrop={() => {
          if (draggingKey) props.onChange(draggingKey);
          setOnDragOver(false);
        }}
        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
          setPopoverPosition({
            left: e.clientX,
            top: e.clientY,
            side: 'right',
          });
          setOpenCustomKey(true);
        }}
      >
        {props.keymap.keycodeInfo.label}
      </div>
      <CustomKey
        id="customkey-popover"
        open={openCustomKey}
        position={popoverPosition}
        value={genKey(props.keymap)}
        layerCount={0}
        labelLang={props.labelLang}
        bleMicroPro={true}
        onClose={() => {
          setOpenCustomKey(false);
        }}
        onChange={(key: Key) => {
          props.onChange(key);
        }}
      ></CustomKey>
    </div>
  );
}

function LayerInput(
  value: number,
  id: string,
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void
) {
  return (
    <Input
      className="bmp-extended-keycode-editor-layer-input"
      type="number"
      id={id}
      value={value}
      onInput={onInput}
    />
  );
}

function TltExtend(props: BmpExtendedKeyProp) {
  const newKeycode = lodash.cloneDeep(props.extendedKeycode);
  const tlt = new BmpExtendedKeycodeTlt(newKeycode);
  const handleDrop = (dropped: Key) => {
    tlt.setKey(dropped.keymap.code);
    props.onChange(newKeycode);
  };

  return (
    <div>
      <div>Tri-Layer-Tap</div>
      <label htmlFor="layer1">Layer1:</label>
      {LayerInput(tlt.getLayer1(), 'layer1', (e) => {
        tlt.setLayer1(Number(e.target.value));
        props.onChange(newKeycode);
      })}
      <label htmlFor="layer2">Layer2:</label>
      {LayerInput(tlt.getLayer2(), 'layer2', (e) => {
        tlt.setLayer2(Number(e.target.value));
        props.onChange(newKeycode);
      })}
      <label htmlFor="layer3">Layer3:</label>
      {LayerInput(tlt.getLayer3(), 'layer3', (e) => {
        tlt.setLayer3(Number(e.target.value));
        props.onChange(newKeycode);
      })}
      <ExtendedKeyElement
        keymap={tlt.getKey(props.labelLang)}
        labelLang={props.labelLang}
        onChange={handleDrop}
      />
    </div>
  );
}

function LteExtend(props: BmpExtendedKeyProp) {
  const newKeycode = lodash.cloneDeep(props.extendedKeycode);
  const lte = new BmpExtendedKeycodeLte(newKeycode);
  const handleDrop = (dropped: Key) => {
    lte.setKey(dropped.keymap.code);
    props.onChange(newKeycode);
  };

  return (
    <div>
      <div>Layer-Tap-Extend</div>
      <label htmlFor="layer1">Layer1:</label>
      {LayerInput(lte.getLayer(), 'layer1', (e) => {
        lte.setLayer(Number(e.target.value));
        props.onChange(newKeycode);
      })}
      <ExtendedKeyElement
        keymap={lte.getKey(props.labelLang)}
        labelLang={props.labelLang}
        onChange={handleDrop}
      />
    </div>
  );
}

function TddExtend(props: BmpExtendedKeyProp) {
  const newKeycode = lodash.cloneDeep(props.extendedKeycode);
  const tdd = new BmpExtendedKeycodeTdd(newKeycode);
  const handleDrop1 = (dropped: Key) => {
    tdd.setKey1(dropped.keymap.code);
    props.onChange(newKeycode);
  };
  const handleDrop2 = (dropped: Key) => {
    tdd.setKey2(dropped.keymap.code);
    props.onChange(newKeycode);
  };

  return (
    <div>
      <div>Tap-Dance-Double</div>
      <div className="bmp-extended-keycode-editor-key-area">
        <ExtendedKeyElement
          keymap={tdd.getKey1(props.labelLang)}
          labelLang={props.labelLang}
          onChange={handleDrop1}
        />
        <ExtendedKeyElement
          keymap={tdd.getKey2(props.labelLang)}
          labelLang={props.labelLang}
          onChange={handleDrop2}
        />
      </div>
    </div>
  );
}

function TdhExtend(props: BmpExtendedKeyProp) {
  const newKeycode = lodash.cloneDeep(props.extendedKeycode);
  const tdh = new BmpExtendedKeycodeTdh(newKeycode);
  const handleDrop1 = (dropped: Key) => {
    tdh.setKey1(dropped.keymap.code);
    props.onChange(newKeycode);
  };
  const handleDrop2 = (dropped: Key) => {
    tdh.setKey2(dropped.keymap.code);
    props.onChange(newKeycode);
  };

  return (
    <div>
      <div>Tap-Dance-Hold</div>
      <div className="bmp-extended-keycode-editor-key-area">
        <ExtendedKeyElement
          keymap={tdh.getKey1(props.labelLang)}
          labelLang={props.labelLang}
          onChange={handleDrop1}
        />
        <ExtendedKeyElement
          keymap={tdh.getKey2(props.labelLang)}
          labelLang={props.labelLang}
          onChange={handleDrop2}
        />
      </div>
    </div>
  );
}
