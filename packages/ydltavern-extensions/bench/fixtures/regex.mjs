export const tenPatterns = Array.from({ length: 10 }, (_, i) => ({
  id: `regex-${i}`,
  scriptName: `Regex ${i}`,
  findRegex: `/pat${i}\\d+/g`,
  replaceString: `<span class="match-${i}">$0</span>`,
  placement: [2],
}));

export const hundredPatterns = Array.from({ length: 100 }, (_, i) => ({
  id: `regex-${i}`,
  scriptName: `Regex ${i}`,
  findRegex: `/p${i}\\w+/g`,
  replaceString: `<span>r${i}</span>`,
  placement: [2],
}));
