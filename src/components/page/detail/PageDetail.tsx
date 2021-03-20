/* eslint-disable no-undef */
import React from 'react';
import './PageDetail.scss';
import { Logo } from '../../common/logo/Logo';
import { Avatar, CssBaseline, IconButton } from '@material-ui/core';
import { LunakeyMiniKeymap } from '../../../assets/keymaps/LunakeyMiniKeymap';
import { KeyOp } from '../../../gen/types/KeyboardDefinition';
import KeyboardModel from '../../../models/KeyboardModel';
import KeyModel from '../../../models/KeyModel';
import { IKeymap } from '../../../services/hid/Hid';
import { MOD_LEFT } from '../../../services/hid/Composition';
import Keycap from '../../configure/keycap/Keycap';

type OwnProps = {};

type OwnState = {};
export default class PageDetail extends React.Component<OwnProps, OwnState> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <header className="page-header">
          <div className="page-header-left">
            <a href="/" className="page-header-logo">
              <Logo width={100} />
            </a>
          </div>
          <div className="page-header-center">
            <h2>Lunakey Mini</h2>
          </div>
          <div className="page-header-right">
            <IconButton>
              <Avatar
                alt="adamrocker"
                src="https://avatars.githubusercontent.com/u/316463?v=4"
              />
            </IconButton>
          </div>
        </header>
        <main className="page-main">
          <div className="page-content">
            <div className="page-keybard-wrapper">
              <div className="page-keyboard-layer"></div>
              <div className="page-keyboard-view">
                <KeyboardView km={LunakeyMiniKeymap} />
              </div>
              <div className="page-keyboard-menu"></div>
            </div>
          </div>
        </main>
        <footer className="page-footer"></footer>
      </React.Fragment>
    );
  }
}

type KeymapType = ((string | KeyOp)[] | { name: string })[];
type OptionsType = { option: string; optionChoice: string }[];
type KeyboardViewProps = {
  km: KeymapType;
  options?: OptionsType;
};
function KeyboardView(props: KeyboardViewProps) {
  const kbd = new KeyboardModel(props.km);
  const { keymaps, width, height, left } = kbd.getKeymap(props.options);

  const marginLeft = left != 0 ? -left : 0;
  const keycaps: { model: KeyModel; keymap: IKeymap }[] = [];
  keymaps.forEach((model: KeyModel) => {
    const keymap: IKeymap = {
      isAny: true,
      code: 0,
      kinds: [],
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: { label: model.pos, code: 0, name: { long: '', short: '' } },
    };
    keycaps.push({ model, keymap });
  });
  return (
    <div className="keyboard-root">
      <div
        className="keyboard-frame"
        style={{
          width: width,
          height: height,
          left: marginLeft,
        }}
      >
        {keycaps.map((keycap) => {
          return keycap.model.isDecal ? (
            ''
          ) : (
            <Keycap
              key={keycap.model.pos}
              selectedLayer={0}
              onClickKeycap={() => {}}
              model={keycap.model}
              keymap={keycap.keymap}
              remap={null}
            />
          );
        })}
      </div>
    </div>
  );
}
