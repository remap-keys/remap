import { describe, it, expect } from 'vitest';
import { FileGenerator } from './FileGenerator';
import { IFileGenerationConfig } from './types/FileGenerationTypes';

describe('FileGenerator Integration Tests', () => {
  describe('完全なファイル生成フロー', () => {
    it('ortho_4x4レイアウトで完全なファイル生成', () => {
      const config: IFileGenerationConfig = {
        manufacturerName: 'Acme Keyboards',
        maintainerName: 'john_doe',
        keyboardName: 'my_custom_keyboard',
        mcuType: 'integrated_mcu',
        mcu: 'RP2040',
        vendorId: 'ACME',
        productId: '1234',
        layout: 'ortho_4x4',
      };

      const result = FileGenerator.generateFiles(config);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        const files = result.value;
        
        // keyboard.jsonの検証
        const keyboardFile = files.find(f => f.fileType === 'keyboard');
        expect(keyboardFile).toBeDefined();
        const keyboardJson = JSON.parse(keyboardFile!.content);
        
        expect(keyboardJson.keyboard_name).toBe('my_custom_keyboard');
        expect(keyboardJson.manufacturer).toBe('Acme Keyboards');
        expect(keyboardJson.maintainer).toBe('john_doe');
        expect(keyboardJson.usb.vid).toBe('0xACME');
        expect(keyboardJson.usb.pid).toBe('0x1234');
        expect(keyboardJson.processor).toBe('RP2040');
        expect(keyboardJson.bootloader).toBe('rp2040');
        expect(keyboardJson.layouts.LAYOUT_ortho_4x4).toBeDefined();
        expect(keyboardJson.layouts.LAYOUT_ortho_4x4.layout).toHaveLength(16);
        
        // keymap.cの検証
        const keymapFile = files.find(f => f.fileType === 'keymap');
        expect(keymapFile).toBeDefined();
        expect(keymapFile!.content).toContain('4x4 Ortholinear Layout');
        expect(keymapFile!.content).toContain('LAYOUT_ortho_4x4(');
        expect(keymapFile!.content).toContain('KC_P7');
        expect(keymapFile!.content).toContain('KC_PPLS');
      }
    });

    it('development_boardタイプでのファイル生成', () => {
      const config: IFileGenerationConfig = {
        manufacturerName: 'DIY Electronics',
        maintainerName: 'maker_jane',
        keyboardName: 'prototyping_board',
        mcuType: 'development_board',
        mcu: 'promicro',
        vendorId: 'FEED',
        productId: 'BEEF',
        layout: '60_ansi',
      };

      const result = FileGenerator.generateFiles(config);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        const files = result.value;
        
        const keyboardFile = files.find(f => f.fileType === 'keyboard');
        const keyboardJson = JSON.parse(keyboardFile!.content);
        
        // development_boardの場合はprocessorとbootloaderが設定されない
        expect(keyboardJson.development_board).toBe('promicro');
        expect(keyboardJson.processor).toBeUndefined();
        expect(keyboardJson.bootloader).toBeUndefined();
        
        // 60%レイアウトの確認
        expect(keyboardJson.layouts.LAYOUT_60_ansi).toBeDefined();
        expect(keyboardJson.layouts.LAYOUT_60_ansi.layout).toHaveLength(75);
        
        const keymapFile = files.find(f => f.fileType === 'keymap');
        expect(keymapFile!.content).toContain('60% Keyboard Layout');
        expect(keymapFile!.content).toContain('LAYOUT_60_ansi(');
      }
    });

    it('numpadレイアウトでの特殊キーコード生成', () => {
      const config: IFileGenerationConfig = {
        manufacturerName: 'Number Pad Co.',
        maintainerName: 'calc_master',
        keyboardName: 'super_numpad',
        mcuType: 'integrated_mcu',
        mcu: 'atmega32u4',
        vendorId: 'NUM1',
        productId: 'PAD2',
        layout: 'numpad_5x4',
      };

      const result = FileGenerator.generateFiles(config);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        const files = result.value;
        
        const keyboardFile = files.find(f => f.fileType === 'keyboard');
        const keyboardJson = JSON.parse(keyboardFile!.content);
        
        expect(keyboardJson.bootloader).toBe('caterina');
        expect(keyboardJson.layouts.LAYOUT_numpad_5x4).toBeDefined();
        
        const keymapFile = files.find(f => f.fileType === 'keymap');
        expect(keymapFile!.content).toContain('Numpad Layout');
        expect(keymapFile!.content).toContain('KC_NLCK');
        expect(keymapFile!.content).toContain('KC_PSLS');
        expect(keymapFile!.content).toContain('KC_PENT');
      }
    });
  });
});