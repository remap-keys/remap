import {
  Key,
  MacroKeycodeType,
} from '../components/configure/keycodes/Keycodes.container';

export type StateType = {
  entities: {
    device: {
      vendorId: number;
      productId: number;
      name: string | null;
    };
    macros: {
      [id in MacroKeycodeType]: string;
    };
  };
  keycodes: {
    categoryIndex: number;
  };
  keycodekey: {
    selectedKey: Key | null;
    hoverKey: Key | null;
  };
};

export const INIT_STATE: StateType = {
  entities: {
    device: {
      vendorId: NaN,
      productId: NaN,
      name: null,
    },
    macros: {
      M0: '',
      M1: '',
      M2: '',
      M3: '',
      M4: '',
      M5: '',
      M6: '',
      M7: '',
      M8: '',
      M9: '',
      M10: '',
      M11: '',
      M12: '',
      M13: '',
      M14: '',
      M15: '',
    },
  },
  keycodes: {
    categoryIndex: 0,
  },
  keycodekey: {
    selectedKey: null,
    hoverKey: null,
  },
};
