# Remap

The mission of this project is to help people who bought a self-made keyboard kit.

[Remap Production Site](https://remap-keys.app)

## For Developers

Developers can start a development of Remap locally by the following step:

1. Install NodeJS version 12 or higher.
2. Install `yarn` command with `npm install -g yarn`.
3. Run `yarn install`.
4. Run `yarn start`.
5. Open the `http://localhost:3000` in the Chrome or Edge Stable 89 or higher.

As a limitation, the launched Remap locally cannot access to Firebase backend server. Therefore, the developer needs to import a keyboard definition JSON file from local every times at opening a keyboard.

## References

### WebHID

This software communicates with a keyboard with the WebHID API provided by a Web browser. The specification document of the WebHID API is: [WebHID API - Draft Community Group Report 23 October 2020](https://wicg.github.io/webhid/)

The WebHID has already been available from Google Chrome and Microsoft Edge version 89 stable or higher.

### QMK Firmware

The target of this software is a keyboard with the QMK Firmware. The QMK Firmware provides some features for a VIA client application via the RawHID feature.

- [Raw HID](https://docs.qmk.fm/#/feature_rawhid)

Also, you can find the entry points of the features in the following code:

- [qmk_firmware/via.c at master · qmk/qmk_firmware](https://github.com/qmk/qmk_firmware/blob/master/quantum/via.c#L202)
