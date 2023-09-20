import { IKeymap } from '../../../services/hid/Hid';
import LayerPagination from '../../common/layer/LayerPagination';
import React from 'react';

type LayerProps = {
  layerCount: number;
  selectedLayer: number;
  remaps: { [pos: string]: IKeymap }[];
  // eslint-disable-next-line no-unused-vars
  onClickLayer: (layer: number) => void;
};

export function Layer(props: LayerProps) {
  const layers = [...Array(props.layerCount)].map((_, i) => i);
  const invisiblePages = layers.map((layer) => {
    return (
      props.remaps![layer] == undefined ||
      0 == Object.values(props.remaps![layer]).length
    );
  });
  return (
    <div className="layer-wrapper">
      <LayerPagination
        orientation="vertical"
        count={props.layerCount}
        page={props.selectedLayer + 1}
        invisiblePages={invisiblePages}
        onClickPage={(page) => {
          props.onClickLayer(page - 1);
        }}
      />
    </div>
  );
}
