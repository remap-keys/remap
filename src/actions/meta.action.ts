export type IMetaData = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
};

export const META_ACTIONS = '@Meta';
export const META_UPDATE = `${META_ACTIONS}/Update`;
export const MetaActions = {
  update: (data: IMetaData) => {
    return {
      type: META_UPDATE,
      value: {
        title: data.title || 'Remap',
        description:
          data.description ||
          'Remap allows you to find, build, set up and customize your keyboard quickly and easily in Web Browser.',
        url: data.url || 'https://remap-keys.app/',
        image: data.image || 'https://remap-keys.app/ogp_image.png',
      },
    };
  },
  initialize: () => {
    return MetaActions.update({});
  },
};
