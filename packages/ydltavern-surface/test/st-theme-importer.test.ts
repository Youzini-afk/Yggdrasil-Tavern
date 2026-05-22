import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { importSTTheme, exportSTTheme } from '../src/components/product/themes/st-theme-importer.ts';
import { ST_DARK_V1, ST_AZURE, ST_CELESTIAL_MACARON, BUILT_IN_THEMES, DARK_THEME } from '../src/components/product/themes/built-in-themes.ts';

/**
 * The reference ST Dark V 1.0 JSON values (from SillyTavern/default/content/themes/Dark V 1.0.json)
 */
const DARK_V1_JSON = {
  name: 'Dark V 1.0',
  blur_strength: 13,
  main_text_color: 'rgba(207, 207, 197, 1)',
  italics_text_color: 'rgba(145, 145, 145, 1)',
  underline_text_color: 'rgba(145, 145, 145, 1)',
  quote_text_color: 'rgba(198, 193, 151, 1)',
  blur_tint_color: 'rgba(29, 33, 40, 0.9)',
  chat_tint_color: 'rgba(29, 33, 40, 0.9)',
  user_mes_blur_tint_color: 'rgba(29, 33, 40, 0.9)',
  bot_mes_blur_tint_color: 'rgba(29, 33, 40, 0.9)',
  shadow_color: 'rgba(0, 0, 0, 0.9)',
  shadow_width: 2,
  border_color: 'rgba(0, 0, 0, 1)',
  font_scale: 1,
  fast_ui_mode: false,
  waifuMode: false,
  avatar_style: 0,
  chat_display: 0,
  noShadows: false,
  chat_width: 55,
  timer_enabled: false,
};

describe('importSTTheme', () => {
  it('converts ST Dark V 1.0 fields correctly', () => {
    const theme = importSTTheme(DARK_V1_JSON);

    // Name should be slugified
    assert.equal(theme.name, 'dark-v-1-0');
    assert.equal(theme.label, 'Dark V 1.0');
    assert.equal(theme.classic, true);

    // Core token mapping
    assert.equal(theme.tokens.fgPrimary, 'rgba(207, 207, 197, 1)');
    assert.equal(theme.tokens.bodyColor, 'rgba(207, 207, 197, 1)');
    assert.equal(theme.tokens.emColor, 'rgba(145, 145, 145, 1)');
    assert.equal(theme.tokens.underlineColor, 'rgba(145, 145, 145, 1)');
    assert.equal(theme.tokens.quoteColor, 'rgba(198, 193, 151, 1)');
    assert.equal(theme.tokens.blurTint, 'rgba(29, 33, 40, 0.9)');
    assert.equal(theme.tokens.chatTint, 'rgba(29, 33, 40, 0.9)');
    assert.equal(theme.tokens.userMesTint, 'rgba(29, 33, 40, 0.9)');
    assert.equal(theme.tokens.botMesTint, 'rgba(29, 33, 40, 0.9)');

    // Numeric tokens
    assert.equal(theme.tokens.blurStrength, 13);
    assert.equal(theme.tokens.fontScale, 1);

    // Flags
    assert.equal(theme.flags?.fastUiMode, false);
    assert.equal(theme.flags?.waifuMode, false);
    assert.equal(theme.flags?.noShadows, false);
    assert.equal(theme.flags?.avatarStyle, 0);
    assert.equal(theme.flags?.chatDisplay, 0);
    assert.equal(theme.flags?.chatWidth, 55);
    assert.equal(theme.flags?.timerEnabled, false);
  });

  it('uses defaults when ST fields are missing', () => {
    const minTheme = importSTTheme({ name: 'Minimal' });

    assert.equal(minTheme.tokens.blurStrength, 10);
    assert.equal(minTheme.tokens.fontScale, 1);
    assert.equal(minTheme.tokens.bodyColor, 'rgb(220, 220, 210)');
    assert.equal(minTheme.tokens.emColor, 'rgb(145, 145, 145)');
    assert.equal(minTheme.tokens.underlineColor, 'rgb(188, 231, 207)');
    assert.equal(minTheme.tokens.quoteColor, 'rgb(225, 138, 36)');
    assert.equal(minTheme.tokens.blurTint, 'rgba(23, 23, 23, 1)');
    assert.equal(minTheme.tokens.chatTint, 'rgba(23, 23, 23, 1)');
    assert.equal(minTheme.tokens.userMesTint, 'rgba(0, 0, 0, 0.3)');
    assert.equal(minTheme.tokens.botMesTint, 'rgba(60, 60, 60, 0.3)');
    assert.equal(minTheme.flags?.fastUiMode, false);
    assert.equal(minTheme.flags?.chatWidth, 50);
  });

  it('handles edge-case field values', () => {
    const edgeTheme = importSTTheme({
      name: 'Edge',
      blur_strength: 0,
      font_scale: 0.5,
      noShadows: true,
      fast_ui_mode: true,
      timer_enabled: true,
    });

    assert.equal(edgeTheme.tokens.blurStrength, 0);
    assert.equal(edgeTheme.tokens.fontScale, 0.5);
    assert.equal(edgeTheme.flags?.noShadows, true);
    assert.equal(edgeTheme.flags?.fastUiMode, true);
    assert.equal(edgeTheme.flags?.timerEnabled, true);
  });
});

describe('exportSTTheme', () => {
  it('round-trips an imported theme', () => {
    const imported = importSTTheme(DARK_V1_JSON);
    const exported = exportSTTheme(imported);

    // Name round-trips via label
    assert.equal(exported.name, 'Dark V 1.0');

    // Core fields
    assert.equal(exported.main_text_color, 'rgba(207, 207, 197, 1)');
    assert.equal(exported.italics_text_color, 'rgba(145, 145, 145, 1)');
    assert.equal(exported.underline_text_color, 'rgba(145, 145, 145, 1)');
    assert.equal(exported.quote_text_color, 'rgba(198, 193, 151, 1)');
    assert.equal(exported.blur_tint_color, 'rgba(29, 33, 40, 0.9)');
    assert.equal(exported.chat_tint_color, 'rgba(29, 33, 40, 0.9)');
    assert.equal(exported.shadow_color, 'rgba(0, 0, 0, 0.9)');
    assert.equal(exported.border_color, 'rgba(0, 0, 0, 1)');
    assert.equal(exported.blur_strength, 13);
    assert.equal(exported.font_scale, 1);

    // Flags
    assert.equal(exported.fast_ui_mode, false);
    assert.equal(exported.waifuMode, false);
    assert.equal(exported.noShadows, false);
    assert.equal(exported.avatar_style, 0);
    assert.equal(exported.chat_display, 0);
    assert.equal(exported.chat_width, 55);
    assert.equal(exported.timer_enabled, false);
  });

  it('round-trips a non-ST native theme gracefully', () => {
    const exported = exportSTTheme(DARK_THEME);

    assert.equal(exported.name, 'dark');
    assert.equal(exported.main_text_color, DARK_THEME.tokens.fgPrimary);
    assert.equal(exported.shadow_color, DARK_THEME.tokens.shadow);
    assert.equal(exported.border_color, DARK_THEME.tokens.border);
  });
});

describe('ST classic presets', () => {
  it('BUILT_IN_THEMES includes 6 themes (3 YdlTavern + 3 ST classic)', () => {
    assert.equal(BUILT_IN_THEMES.length, 6);
  });

  it('ST_DARK_V1 has the correct slugified name and label', () => {
    assert.equal(ST_DARK_V1.name, 'dark-v-1-0');
    assert.equal(ST_DARK_V1.label, 'Dark V 1.0');
    assert.equal(ST_DARK_V1.classic, true);
  });

  it('ST_DARK_V1 uses actual ST ship values', () => {
    assert.equal(ST_DARK_V1.tokens.bodyColor, 'rgba(207, 207, 197, 1)');
    assert.equal(ST_DARK_V1.tokens.quoteColor, 'rgba(198, 193, 151, 1)');
    assert.equal(ST_DARK_V1.tokens.blurStrength, 13);
    assert.equal(ST_DARK_V1.tokens.blurTint, 'rgba(29, 33, 40, 0.9)');
  });

  it('ST_AZURE uses actual ST ship values', () => {
    assert.equal(ST_AZURE.label, 'Azure');
    assert.equal(ST_AZURE.tokens.bodyColor, 'rgba(171, 198, 223, 1)');
    assert.equal(ST_AZURE.tokens.emColor, 'rgba(255, 255, 255, 1)');
    assert.equal(ST_AZURE.tokens.underlineColor, 'rgba(188, 231, 207, 1)');
    assert.equal(ST_AZURE.tokens.quoteColor, 'rgba(111, 133, 253, 1)');
    assert.equal(ST_AZURE.tokens.blurStrength, 11);
    assert.equal(ST_AZURE.tokens.userMesTint, 'rgba(0, 28, 174, 0.2)');
    assert.equal(ST_AZURE.tokens.botMesTint, 'rgba(0, 13, 57, 0.22)');
    assert.equal(ST_AZURE.flags?.avatarStyle, 1);
    assert.equal(ST_AZURE.flags?.chatDisplay, 1);
    assert.equal(ST_AZURE.flags?.timerEnabled, true);
  });

  it('ST_CELESTIAL_MACARON uses actual ST ship values', () => {
    assert.equal(ST_CELESTIAL_MACARON.label, 'Celestial Macaron');
    assert.equal(ST_CELESTIAL_MACARON.tokens.bodyColor, 'rgba(229, 175, 162, 1)');
    assert.equal(ST_CELESTIAL_MACARON.tokens.emColor, 'rgba(146, 147, 161, 1)');
    assert.equal(ST_CELESTIAL_MACARON.tokens.underlineColor, 'rgba(157, 215, 198, 1)');
    assert.equal(ST_CELESTIAL_MACARON.tokens.quoteColor, 'rgba(197, 202, 206, 1)');
    assert.equal(ST_CELESTIAL_MACARON.tokens.blurStrength, 10);
    assert.equal(ST_CELESTIAL_MACARON.tokens.chatTint, 'rgba(18, 26, 40, 0.9)');
    assert.equal(ST_CELESTIAL_MACARON.tokens.userMesTint, 'rgba(51, 67, 90, 0.7)');
    assert.equal(ST_CELESTIAL_MACARON.tokens.botMesTint, 'rgba(23, 36, 55, 0.75)');
    assert.equal(ST_CELESTIAL_MACARON.flags?.noShadows, true);
    assert.equal(ST_CELESTIAL_MACARON.flags?.chatWidth, 58);
  });

  it('all ST classic themes have the classic flag set', () => {
    const stThemes = BUILT_IN_THEMES.filter(
      (t) => t.name.startsWith('dark-v-1-') || t.name === 'azure' || t.name.startsWith('celestial-'),
    );
    for (const theme of stThemes) {
      assert.equal(theme.classic, true, `${theme.name} should be classic`);
    }
  });

  it('original YdlTavern themes are NOT marked classic', () => {
    // First 3 entries are the original YdlTavern themes
    assert.equal(BUILT_IN_THEMES[0]!.classic, undefined);
    assert.equal(BUILT_IN_THEMES[1]!.classic, undefined);
    assert.equal(BUILT_IN_THEMES[2]!.classic, undefined);
  });
});
