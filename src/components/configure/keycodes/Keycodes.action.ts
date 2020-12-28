export const ACTION_KEYCODES_CATEGORY_INDEX = 'KEYCODES/CATEGORY_INDEX';

const KeycodesActions = {
  selectCategoryIndex(value: number) {
    return {
      type: ACTION_KEYCODES_CATEGORY_INDEX,
      value,
    };
  },
};

export default KeycodesActions;
