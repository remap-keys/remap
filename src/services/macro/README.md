# When opening a keyboard

Fetch information about macros from MCU.

- state.entities.macro.buffer: Uint8Array // All buffer bytes
- state.entities.macro.maxBufferSize: number // Max buffer size
- state.entities.macro.maxCount: number // Max macro count

# When starting a macro edition (at clicking one of M0 to M15 by a user)

Generate an array of MacroKey for the target of editing the buffer.

```typescript
const macroIndex = ...;

import {IMacroBuffer, MacroBuffer} from "./Macro";

const buffer = state.entities.macro.buffer;
const maxBufferSize = state.entities.macro.maxBufferSize;
const maxMacroCount = state.entities.macro.maxCount;

const labelLang = state.app.labelLang;

const macroBuffer: IMacroBuffer = new MacroBuffer(buffer, maxBufferSize, maxMacroCount);
state.configure.macroEditor.macroBuffer = macroBuffer;
const macros = macroBuffer.generateMacros();
const macro = macros[macroIndex];
state.configure.macroEditor.macro = macro;
const macroKeysResult = macro.generateMacroKeys(labelLang);
if (macroKeysResult.success) {
  const macroKeys = macroKeysResult.macroKeys;
  state.configure.macroEditor.macroKeys = macroKeys;
  // do something on UI.
} else {
  const error = macroKeysResult.error;
  // do something for the error.
}
```

# When modified the MacroKey array from UI (at the content of MacroKey[] was changed)

Update the byte array in the MacroBuffer object with the latest MacroKey[] content.

```typescript
const macroKeys = state.configure.macroEditor.macroKeys;

const macro = state.configure.macroEditor.macro;
macro.updateMacroKeys(macroKeys);

const usedMacroBufferSize = state.configure.macroEditor.macroBuffer.getBuffer()
  .length;
const maxBufferSize = state.entities.macro.maxBufferSize;
const remainingMacroBufferSize = maxBufferSize - usedMacroBufferSize;
// do something.
```

# When clicking the SAVE button on UI

Flash the buffer content to the MCU.

```typescript
const macroBuffer = state.configure.macroEditor.maxMacroBuffer;
const bytes = macroBuffer.getBytes();

// WebHid#updateMacroBuffer(bytes)

state.entities.macro.buffer = bytes;
```
