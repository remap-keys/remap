# Remap

The mission of this project is to help people who bought a self-made keyboard kit.

## For Developers

Developers can start a development of Remap locally by the following step:

1. Install NodeJS version 12 or higher.
2. Install `yarn` command with `npm install -g yarn`.
3. Install

## References

### WebHID

This software communicates with a keyboard with the WebHID API provided by a Web browser. The specification document of the WebHID API is: [WebHID API - Draft Community Group Report 23 October 2020](https://wicg.github.io/webhid/)

Currently, the status of the WebHID API on the Chrome Web browser is a Trial Origins. Therefore, developers need to issue a token to use the WebHID API by registering your Google Account as a tester of the API. The registration site is [here](https://developers.chrome.com/origintrials/#/trials/active).

### QMK Firmware

The target of this software is a keyboard with the QMK Firmware. The QMK Firmware provides some features for a VIA client application via the RawHID feature.

- [Raw HID](https://docs.qmk.fm/#/feature_rawhid)

Also, you can find the entry points of the features in the following code:

- [qmk_firmware/via.c at master · qmk/qmk_firmware](https://github.com/qmk/qmk_firmware/blob/master/quantum/via.c#L202)
