export const themeStorageKey = 'vpap-theme';

export type ReadingTheme = 'light' | 'dark';

// Runs before paint so a returning reader's dark preference never flashes light.
// Paper remains the default, including when browser storage is unavailable.
export const themeInitializationScript = `
  try {
    document.documentElement.dataset.theme =
      localStorage.getItem(${JSON.stringify(themeStorageKey)}) === 'dark' ? 'dark' : 'light';
  } catch {}
`;
