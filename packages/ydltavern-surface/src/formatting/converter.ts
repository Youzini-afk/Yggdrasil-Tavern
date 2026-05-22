import showdown from 'showdown';

// ST showdown-underscore.js:1-37 — single _emphasis_ → <em>, skip inside <code>/<style>
function markdownUnderscoreExt(): showdown.ShowdownExtension[] {
  return [
    {
      type: 'lang',
      regex: /(?<![a-zA-Z0-9_])_(?!_)((?:[^_<>]|<[^>]*>)+?)_(?![a-zA-Z0-9_])/g,
      replace: (_match: string, p1: string) => `<em>${p1}</em>`,
    },
  ];
}

// ST showdown-exclusion.js — escape configured "non-markdown strings"
// For Y1 we ship a no-op exclusion extension; ST's exclusion list is user-configurable.
function markdownExclusionExt(): showdown.ShowdownExtension[] {
  return [
    {
      type: 'lang',
      filter: (text: string) => text,
    },
  ];
}

export function createConverter(): showdown.Converter {
  const converter = new showdown.Converter({
    emoji: true,
    literalMidWordUnderscores: true,
    parseImgDimensions: true,
    tables: true,
    underline: true,
    simpleLineBreaks: true,
    strikethrough: true,
    disableForced4SpacesIndentedSublists: true,
    extensions: [...markdownUnderscoreExt()],
  } as showdown.ConverterOptions);
  converter.addExtension(markdownExclusionExt(), 'exclusion');
  return converter;
}

// Singleton; ST also reuses one converter.
let _converter: showdown.Converter | null = null;

export function getConverter(): showdown.Converter {
  if (!_converter) _converter = createConverter();
  return _converter;
}
