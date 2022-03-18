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
  BmpExtendedKeycodeTwoKeyCombination,
  BmpExtendedKeycodeCombo,
  ExtendedKind,
  IBmpExtendedKeycode,
  BmpExtendedKeycode,
} from '../../../services/hid/bmp/BmpExtendedKeycode';
import lodash from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { IKeymap } from '../../../services/hid/Hid';
import { genKey, Key } from '../keycodekey/KeyGen';
import { RootState } from '../../../store/state';
import { KeyboardLabelLang } from '../../../services/labellang/KeyLabelLangs';
import CustomKey, { PopoverPosition } from '../customkey/CustomKey';
import { KeyLabel } from '../keycap/Keycap';
import { buildHoldKeyLabel } from '../customkey/TabHoldTapKey';
import { buildModLabel } from '../customkey/Modifiers';

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
            BMP Extended Keycode Editor (ID:{this.props.extendedKeyId})
          </div>
          <div className="bmp-extended-keycode-editor-content-keys">
            <div>
              <ExtendedKindSelect
                extendedKeycode={this.props.extendedKeycode!}
                onChange={(value) => {
                  this.props.updateBmpExtendedKeycode!(value);
                }}
              ></ExtendedKindSelect>

              <div>
                <ExtendedKey
                  extendedKeycode={this.props.extendedKeycode!}
                  labelLang={this.props.labelLang!}
                  layerCount={this.props.layerCount!}
                  onChange={(key) => this.props.updateBmpExtendedKeycode!(key)}
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
            <Button
              size="small"
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => {
                this.props.applyBmpExtendedKeycodeUpdate!(
                  this.props.extendedKeyId!,
                  this.props.extendedKeycode!
                );
                this.props.closeBmpExtendedKeycodeEditor!();
              }}
            >
              APPPLY
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
        props.onChange(
          BmpExtendedKeycode.createExtendedKeycode(extendedKeycode.getBytes())
        );
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
  layerCount: number;
  onChange: (update: IBmpExtendedKeycode) => void;
}

function ExtendedKey(props: BmpExtendedKeyProp) {
  switch (props.extendedKeycode.getKind()) {
    case ExtendedKind.TRI_LAYER_TAP:
      return TltExtend(props);
    case ExtendedKind.LAYER_TAP_EXTENDED:
      return LteExtend(props);
    case ExtendedKind.TAP_DANCE_DOUBLE:
    case ExtendedKind.TAP_DANCE_HOLD:
      return TwoKeyCombinationExtend(props);
    case ExtendedKind.COMBO:
      return ComboExtend(props);
    default:
      return <div></div>;
  }
}

function ExtendedKeyElement(props: {
  keymap: IKeymap;
  labelLang: KeyboardLabelLang;
  layerCount: number;
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

  const key = genKey(props.keymap, props.labelLang);
  const holdLabel = buildHoldKeyLabel(props.keymap, props.keymap.isAny);
  let modifierLabel =
    holdLabel === ''
      ? buildModLabel(props.keymap.modifiers || null, props.keymap.direction!)
      : '';
  const modifierRightLabel = key.metaRight;
  const meta = key.meta;
  modifierLabel = meta ? meta : modifierLabel;

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
        <div className="keycap-base bmp-extended-keycode-editor-keycode-base">
          <div className="keyroof">
            <KeyLabel
              label={key.label}
              meta={key.meta}
              modifierLabel={modifierLabel}
              modifierRightLabel={modifierRightLabel}
              holdLabel={holdLabel}
              hasDiff={false}
            />
          </div>
        </div>
      </div>
      <CustomKey
        id="customkey-popover"
        open={openCustomKey}
        position={popoverPosition}
        value={genKey(props.keymap)}
        layerCount={props.layerCount}
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
  const tlt = new BmpExtendedKeycodeTlt(newKeycode.getBytes());
  const handleDrop = (dropped: Key) => {
    tlt.setKey(dropped.keymap.code);
    props.onChange(newKeycode);
  };

  return (
    <div>
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
        layerCount={props.layerCount}
        onChange={handleDrop}
      />
    </div>
  );
}

function LteExtend(props: BmpExtendedKeyProp) {
  const newKeycode = lodash.cloneDeep(props.extendedKeycode);
  const lte = new BmpExtendedKeycodeLte(newKeycode.getBytes());
  const handleDrop = (dropped: Key) => {
    lte.setKey(dropped.keymap.code);
    props.onChange(newKeycode);
  };

  return (
    <div>
      <label htmlFor="layer1">Layer1:</label>
      {LayerInput(lte.getLayer(), 'layer1', (e) => {
        lte.setLayer(Number(e.target.value));
        props.onChange(newKeycode);
      })}
      <ExtendedKeyElement
        keymap={lte.getKey(props.labelLang)}
        labelLang={props.labelLang}
        layerCount={props.layerCount}
        onChange={handleDrop}
      />
    </div>
  );
}

function TwoKeyCombinationExtend(props: BmpExtendedKeyProp) {
  const newKeycode = lodash.cloneDeep(props.extendedKeycode);
  const combination = new BmpExtendedKeycodeTwoKeyCombination(
    newKeycode.getBytes()
  );
  const handleDrop1 = (dropped: Key) => {
    combination.setKey1(dropped.keymap.code);
    props.onChange(newKeycode);
  };
  const handleDrop2 = (dropped: Key) => {
    combination.setKey2(dropped.keymap.code);
    props.onChange(newKeycode);
  };

  return (
    <div>
      <div className="bmp-extended-keycode-editor-key-area">
        <ExtendedKeyElement
          keymap={combination.getKey1(props.labelLang)}
          labelLang={props.labelLang}
          layerCount={props.layerCount}
          onChange={handleDrop1}
        />
        <ExtendedKeyElement
          keymap={combination.getKey2(props.labelLang)}
          labelLang={props.labelLang}
          layerCount={props.layerCount}
          onChange={handleDrop2}
        />
      </div>
    </div>
  );
}

function ComboExtend(props: BmpExtendedKeyProp) {
  const newKeycode = lodash.cloneDeep(props.extendedKeycode);
  const combo = new BmpExtendedKeycodeCombo(newKeycode.getBytes());
  const handleDrop1 = (dropped: Key) => {
    combo.setKey1(dropped.keymap.code);
    props.onChange(newKeycode);
  };
  const handleDrop2 = (dropped: Key) => {
    combo.setKey2(dropped.keymap.code);
    props.onChange(newKeycode);
  };
  const handleDrop3 = (dropped: Key) => {
    combo.setKey3(dropped.keymap.code);
    props.onChange(newKeycode);
  };

  return (
    <div>
      <div className="bmp-extended-keycode-editor-key-area">
        <ExtendedKeyElement
          keymap={combo.getKey1(props.labelLang)}
          labelLang={props.labelLang}
          layerCount={props.layerCount}
          onChange={handleDrop1}
        />
        <ExtendedKeyElement
          keymap={combo.getKey2(props.labelLang)}
          labelLang={props.labelLang}
          layerCount={props.layerCount}
          onChange={handleDrop2}
        />
        <ExtendedKeyElement
          keymap={combo.getKey3(props.labelLang)}
          labelLang={props.labelLang}
          layerCount={props.layerCount}
          onChange={handleDrop3}
        />
      </div>
    </div>
  );
}
