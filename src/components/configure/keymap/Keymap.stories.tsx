import React from 'react';
import './Keymap.scss';
import CssBaseline from '@mui/material/CssBaseline';
import KeyboardModel from '../../../models/KeyboardModel';
import KeyModel from '../../../models/KeyModel';
import Keycap from '../keycap/Keycap';
import { IKeymap } from '../../../services/hid/Hid';
import { KeyOp } from '../../../gen/types/KeyboardDefinition';
import { LunakeyMiniKeymap } from '../../../assets/keymaps/LunakeyMiniKeymap';
import { SilverBullet44KaiKeymap } from '../../../assets/keymaps/SilverBullet44KaiKeymap';
import { Iso105Keymap } from '../../../assets/keymaps/Iso105Keymap';
import { ErgoDoxKeymap } from '../../../assets/keymaps/ErgoDoxKeymap';
import { CorneliusKeymap } from '../../../assets/keymaps/CorneliusKeymap';
import { ZincKeymap } from '../../../assets/keymaps/ZincKeymap';
import { Kbd7sKeymap } from '../../../assets/keymaps/Kbd7sKeymap';
import { Aleth42Keymap } from '../../../assets/keymaps/Aleth42Keymap';
import { Attack25Keymap } from '../../../assets/keymaps/Attack25Keymap';
import { OptionChoiceKeymap } from '../../../assets/keymaps/OptionChoiceKeymap';
import { OptionChoice2Keymap } from '../../../assets/keymaps/OptionChoice2Keymap';
import { CrkbdKeymap } from '../../../assets/keymaps/CrkbdKeymap';
import { Jisplit89Keymap } from '../../../assets/keymaps/Jisplit89Keymap';
import { Naked64SFKeymap } from '../../../assets/keymaps/Naked64SFKeymap';
import { HotdoxKeymap } from '../../../assets/keymaps/HotdoxKeymap';
import { BigAssEnterKeymap } from '../../../assets/keymaps/BigAssEnterKeymap';
import { VerticalSplitKeymap } from '../../../assets/keymaps/VerticalSplit';
import { KeyopsSuccessionKeymap } from '../../../assets/keymaps/KeyopsSuccession';
import { LayoutOption } from './Keymap';
import { GK6Keymap } from '../../../assets/keymaps/GK6Keymap';
import { CtMacropadKeymap } from '../../../assets/keymaps/CtMacropadKeymap';
import { CtMacropadWithoutDefaultOptionKeymap } from '../../../assets/keymaps/CtMacropadWithoutDefaultOptionKeymap';
import { GiabalanaiKeymap } from '../../../assets/keymaps/GiabalanaiKeymap';
import { MOD_LEFT } from '../../../services/hid/Constraints';
import { FrogNpKeymap } from '../../../assets/keymaps/FrogNpKeymap';

export default {
  title: 'Keyboards',
};
type KeycapData = {
  model: KeyModel;
  keymap: IKeymap | null;
  remap: IKeymap | null;
  cwKeymap: IKeymap | null;
  cwRemap: IKeymap | null;
  ccwKeymap: IKeymap | null;
  ccwRemap: IKeymap | null;
};
type KeymapType = ((string | KeyOp)[] | { name: string })[];

const genKeyboardView = (
  name: string,
  km: KeymapType,
  options?: LayoutOption[]
) => {
  const kbd = new KeyboardModel(km);
  const { keymaps, width, height, left, top } = kbd.getKeymap(options);

  const marginLeft = left != 0 ? -left : 0;
  const marginTop = -top;
  const keycaps: KeycapData[] = [];
  keymaps.forEach((model: KeyModel) => {
    const keymap: IKeymap = {
      isAny: true,
      code: 0,
      kinds: [],
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        label: model.pos,
        code: 0,
        name: { long: '', short: '' },
        keywords: [],
      },
    };
    const remap = null;
    // FIXME: Set keymaps for encoder!
    keycaps.push({
      model,
      keymap,
      remap,
      cwKeymap: null,
      cwRemap: null,
      ccwKeymap: null,
      ccwRemap: null,
    });
  });
  return (
    <React.Fragment>
      <CssBaseline />
      <div className="keyboards-wrapper">
        <div className="keyboards" style={{ margin: '0 auto' }}>
          <div
            className="keyboard-root"
            style={{
              width: width + 40,
              height: height + 40,
              padding: 20,
              borderWidth: 1,
              borderColor: 'gray',
              borderStyle: 'solid',
            }}
          >
            <div
              className="keyboard-frame"
              style={{
                width: width,
                height: height,
                left: marginLeft,
                top: marginTop,
              }}
            >
              {keycaps.map((keycap: KeycapData) => {
                return keycap.model.isDecal ? (
                  ''
                ) : (
                  <Keycap
                    debug={true}
                    key={keycap.model.pos}
                    selectedLayer={0}
                    onClickKeycap={() => {}}
                    {...keycap}
                    focus={false}
                    down={false}
                    isCustomKeyOpen={false}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: Math.max(1280, width),
          margin: '24px auto',
        }}
      >
        {options && (
          <div>
            <table
              style={{
                textAlign: 'center',
                borderCollapse: 'collapse',
                marginBottom: 8,
                backgroundColor: 'white',
              }}
            >
              <tr>
                {options.map((op, index) => (
                  <th
                    key={`option${index}`}
                    style={{
                      border: '1px solid rgba(0,0,0,0.2)',
                      padding: `0 4px`,
                    }}
                  >
                    option{op.option}
                  </th>
                ))}
              </tr>
              <tr>
                {options.map((op, index) => (
                  <td
                    key={`optionChoice${index}`}
                    style={{
                      border: '1px solid rgba(0,0,0,0.2)',
                      padding: '0 4px',
                    }}
                  >
                    {op.optionChoice}
                  </td>
                ))}
              </tr>
            </table>
          </div>
        )}

        <textarea
          style={{
            fontSize: 14,
            width: '100%',
            padding: 8,
            lineHeight: 1.6,
            border: '1px solid #ccc',
          }}
          rows={km.length}
          defaultValue={km
            .map((row) => format(JSON.stringify(row)))
            .join(',\n')}
        />
      </div>
    </React.Fragment>
  );
};

const format = (text: string): string => {
  text = text.replace(/"([a-z]{1,2}?2*)":/g, '$1: ');
  text = text.replace(/,"/g, ', "');
  text = text.replace(/,{/g, ', {');
  text = text.replace(/,([a-z])/g, ', $1');
  return text;
};

export const LunakeyMini = () =>
  genKeyboardView('Lunakey Mini', LunakeyMiniKeymap);
export const Crkbd = () => genKeyboardView('Crkbd', CrkbdKeymap);
export const FrogNp = () =>
  genKeyboardView('FrogNp', FrogNpKeymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 1 },
    { option: 3, optionChoice: 2 },
    { option: 4, optionChoice: 2 },
    { option: 5, optionChoice: 0 },
  ]);
export const Jisplit89 = () => genKeyboardView('Jisplit89', Jisplit89Keymap);
export const Naked64SF = () => genKeyboardView('Naked64SF', Naked64SFKeymap);
export const SilverBullet44Kai = () =>
  genKeyboardView('', SilverBullet44KaiKeymap);
export const Cornelius = () => genKeyboardView('Cornelius', CorneliusKeymap);
export const Aleth42 = () => genKeyboardView('Aleth42', Aleth42Keymap);
export const Hotdox = () => genKeyboardView('Hotdox', HotdoxKeymap);
export const GK6 = () => genKeyboardView('GK6', GK6Keymap);
export const CtMacropad00 = () =>
  genKeyboardView('CtMacropad00', CtMacropadKeymap, [
    { option: 0, optionChoice: 0 },
  ]);
export const CtMacropad01 = () =>
  genKeyboardView('CtMacropad01', CtMacropadKeymap, [
    { option: 0, optionChoice: 1 },
  ]);
export const CtMacropadWithoutDefaultOption00 = () =>
  genKeyboardView(
    'CtMacropadWithoutDefaultOption00',
    CtMacropadWithoutDefaultOptionKeymap,
    [{ option: 0, optionChoice: 0 }]
  );
export const CtMacropadWithoutDefaultOption01 = () =>
  genKeyboardView(
    'CtMacropadWithoutDefaultOption01',
    CtMacropadWithoutDefaultOptionKeymap,
    [{ option: 0, optionChoice: 1 }]
  );
export const Giabalanai00 = () =>
  genKeyboardView('Giabalanai00', GiabalanaiKeymap, [
    { option: 0, optionChoice: 0 },
  ]);
export const Giabalanai01 = () =>
  genKeyboardView('Giabalanai01', GiabalanaiKeymap, [
    { option: 0, optionChoice: 1 },
  ]);
export const Zinc = () =>
  genKeyboardView('Zinc0', ZincKeymap, [{ option: 0, optionChoice: 0 }]);
export const ZincSymmetrical = () =>
  genKeyboardView('Zinc1', ZincKeymap, [{ option: 0, optionChoice: 1 }]);
export const Kbd7s0 = () =>
  genKeyboardView('7sKbd0', Kbd7sKeymap, [{ option: 0, optionChoice: 0 }]);
export const Kbd7s1 = () =>
  genKeyboardView('7sKbd1', Kbd7sKeymap, [{ option: 0, optionChoice: 1 }]);
export const Attack25 = () =>
  genKeyboardView('Attack25.default', Attack25Keymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
    { option: 4, optionChoice: 0 },
    { option: 5, optionChoice: 0 },
  ]);
export const Attack25Opt4 = () =>
  genKeyboardView('Attack25.default', Attack25Keymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
    { option: 4, optionChoice: 1 },
    { option: 5, optionChoice: 0 },
  ]);
export const Attack25Opt5 = () =>
  genKeyboardView('Attack25.default', Attack25Keymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
    { option: 4, optionChoice: 0 },
    { option: 5, optionChoice: 1 },
  ]);
export const OptionChoice0 = () =>
  genKeyboardView('OptionChoice0', OptionChoiceKeymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
    { option: 4, optionChoice: 0 },
  ]);
export const OptionChoice1 = () =>
  genKeyboardView('OptionChoice1', OptionChoiceKeymap, [
    { option: 0, optionChoice: 1 },
    { option: 1, optionChoice: 1 },
    { option: 2, optionChoice: 1 },
    { option: 3, optionChoice: 1 },
    { option: 4, optionChoice: 1 },
  ]);
export const OptionChoice2 = () =>
  genKeyboardView('OptionChoice2', OptionChoiceKeymap, [
    { option: 0, optionChoice: 1 },
    { option: 1, optionChoice: 1 },
    { option: 2, optionChoice: 1 },
    { option: 3, optionChoice: 1 },
    { option: 4, optionChoice: 2 },
  ]);
export const OptionChoice3 = () =>
  genKeyboardView('OptionChoice3', OptionChoiceKeymap, [
    { option: 0, optionChoice: 1 },
    { option: 1, optionChoice: 1 },
    { option: 2, optionChoice: 1 },
    { option: 3, optionChoice: 1 },
    { option: 4, optionChoice: 3 },
  ]);
export const OptionChoice200000 = () =>
  genKeyboardView('OptionChoice200000', OptionChoice2Keymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
    { option: 4, optionChoice: 0 },
  ]);
export const OptionChoice200001 = () =>
  genKeyboardView('OptionChoice200001', OptionChoice2Keymap, [
    { option: 0, optionChoice: 1 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
    { option: 4, optionChoice: 0 },
  ]);
export const OptionChoice200002 = () =>
  genKeyboardView('OptionChoice200002', OptionChoice2Keymap, [
    { option: 0, optionChoice: 2 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
    { option: 4, optionChoice: 0 },
  ]);

export const OptionChoice200010 = () =>
  genKeyboardView('OptionChoice200010', OptionChoice2Keymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 1 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
    { option: 4, optionChoice: 0 },
  ]);
export const OptionChoice200020 = () =>
  genKeyboardView('OptionChoice200020', OptionChoice2Keymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 2 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
    { option: 4, optionChoice: 0 },
  ]);
export const OptionChoice200100 = () =>
  genKeyboardView('OptionChoice200100', OptionChoice2Keymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 1 },
    { option: 3, optionChoice: 0 },
    { option: 4, optionChoice: 0 },
  ]);
export const OptionChoice201000 = () =>
  genKeyboardView('OptionChoice201000', OptionChoice2Keymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 1 },
    { option: 4, optionChoice: 0 },
  ]);
export const OptionChoice202000 = () =>
  genKeyboardView('OptionChoice201000', OptionChoice2Keymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 2 },
    { option: 4, optionChoice: 0 },
  ]);
export const OptionChoice210000 = () =>
  genKeyboardView('OptionChoice210000', OptionChoice2Keymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
    { option: 4, optionChoice: 1 },
  ]);
export const OptionChoice202102 = () =>
  genKeyboardView('OptionChoice202102', OptionChoice2Keymap, [
    { option: 0, optionChoice: 2 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 1 },
    { option: 3, optionChoice: 2 },
    { option: 4, optionChoice: 0 },
  ]);
export const Iso105 = () => genKeyboardView('Iso105', Iso105Keymap);
export const ErgoDox = () => genKeyboardView('ErgoDox', ErgoDoxKeymap);
export const BigAssEnter = () =>
  genKeyboardView('BigAssEnter', BigAssEnterKeymap);
export const VerticalSplitNormal = () =>
  genKeyboardView('VerticalSplitNormal', VerticalSplitKeymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
  ]);
export const VerticalSplit2U = () =>
  genKeyboardView('VerticalSplit2U', VerticalSplitKeymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 1 },
    { option: 3, optionChoice: 0 },
  ]);
export const VerticalSplit2Uinner = () =>
  genKeyboardView('VerticalSplit2Uinner', VerticalSplitKeymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 1 },
  ]);
export const VerticalSplit3U = () =>
  genKeyboardView('VerticalSplit0', VerticalSplitKeymap, [
    { option: 0, optionChoice: 0 },
    { option: 1, optionChoice: 1 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
  ]);
export const VerticalSplit4U = () =>
  genKeyboardView('VerticalSplit0', VerticalSplitKeymap, [
    { option: 0, optionChoice: 1 },
    { option: 1, optionChoice: 0 },
    { option: 2, optionChoice: 0 },
    { option: 3, optionChoice: 0 },
  ]);
export const VerticalSplitAll = () =>
  genKeyboardView('VerticalSplit0', VerticalSplitKeymap, [
    { option: 0, optionChoice: 1 },
    { option: 1, optionChoice: 1 },
    { option: 2, optionChoice: 1 },
    { option: 3, optionChoice: 1 },
  ]);
export const KeyopsSuccession = () =>
  genKeyboardView('KeyopsSuccession', KeyopsSuccessionKeymap);
