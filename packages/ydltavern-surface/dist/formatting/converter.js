import showdown from 'showdown';
// ST showdown-underscore.js:1-37 — single _emphasis_ → <em>, skip inside <code>/<style>
function markdownUnderscoreExt() {
    return [
        {
            type: 'lang',
            regex: /(?<![a-zA-Z0-9_])_(?!_)((?:[^_<>]|<[^>]*>)+?)_(?![a-zA-Z0-9_])/g,
            replace: (_match, p1) => `<em>${p1}</em>`,
        },
    ];
}
// ST showdown-exclusion.js — escape configured "non-markdown strings"
// For Y1 we ship a no-op exclusion extension; ST's exclusion list is user-configurable.
function markdownExclusionExt() {
    return [
        {
            type: 'lang',
            filter: (text) => text,
        },
    ];
}
export function createConverter() {
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
    });
    converter.addExtension(markdownExclusionExt(), 'exclusion');
    return converter;
}
// Singleton; ST also reuses one converter.
let _converter = null;
export function getConverter() {
    if (!_converter)
        _converter = createConverter();
    return _converter;
}
//# sourceMappingURL=converter.js.map