import {
  KeyboardLabelLang,
  KeyLabelLangs,
} from '../../../services/labellang/KeyLabelLangs';
import { MenuItem, Select } from '@mui/material';
import React from 'react';

type LabelLangProps = {
  labelLang: KeyboardLabelLang;
  // eslint-disable-next-line no-unused-vars
  onChangeLangLabel: (labelLang: KeyboardLabelLang) => void;
};
export function LabelLang(props: LabelLangProps) {
  return (
    <Select
      variant="standard"
      value={props.labelLang!}
      onChange={(e) => {
        props.onChangeLangLabel!(e.target.value as KeyboardLabelLang);
      }}
    >
      {KeyLabelLangs.KeyLabelLangMenus.map((item, index) => {
        return (
          <MenuItem key={`${item.labelLang}${index}`} value={item.labelLang}>
            {item.menuLabel}
          </MenuItem>
        );
      })}
    </Select>
  );
}
