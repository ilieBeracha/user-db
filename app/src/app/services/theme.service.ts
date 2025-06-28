import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';
import Dracula from './themes/Tomorrow-Night.json';

export interface ThemeInfo {
  id: string;
  name: string;
  category: 'dark' | 'light';
  base?: string;
  inherit?: boolean;
  rules?: monaco.editor.IStandaloneThemeData['rules'];
  colors?: monaco.editor.IStandaloneThemeData['colors'];
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themes: ThemeInfo[] = [
    // Dark themes
    {
      id: 'vs-dark',
      name: 'VS Dark',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'active4d',
      name: 'Active4D',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'all-hallows-eve',
      name: 'All Hallows Eve',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'amy',
      name: 'Amy',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'birds-of-paradise',
      name: 'Birds of Paradise',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'blackboard',
      name: 'Blackboard',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'brilliance-black',
      name: 'Brilliance Black',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'brilliance-dull',
      name: 'Brilliance Dull',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'chrome-devtools',
      name: 'Chrome DevTools',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'clouds-midnight',
      name: 'Clouds Midnight',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'cobalt',
      name: 'Cobalt',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'cobalt2',
      name: 'Cobalt2',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'dracula',
      name: 'Dracula',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.foreground': '#f8f8f2',
        'editor.background': '#282a36',
        'editor.selectionBackground': '#44475a',
        'editor.lineHighlightBackground': '#44475a',
        'editorCursor.foreground': '#f8f8f0',
        'editorWhitespace.foreground': '#3B3A32',
        'editorIndentGuide.activeBackground': '#9D550FB0',
        'editor.selectionHighlightBorder': '#222218',
      },
    },
    {
      id: 'espresso-libre',
      name: 'Espresso Libre',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'github-dark',
      name: 'GitHub Dark',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'idle',
      name: 'IDLE',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'katzenmilch',
      name: 'Katzenmilch',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'lazy',
      name: 'LAZY',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'magicwb--amiga-',
      name: 'MagicWB (Amiga)',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'merbivore-soft',
      name: 'Merbivore Soft',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'merbivore',
      name: 'Merbivore',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'monokai-bright',
      name: 'Monokai Bright',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'night-owl',
      name: 'Night Owl',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'nord',
      name: 'Nord',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'oceanic-next',
      name: 'Oceanic Next',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'pastels-on-dark',
      name: 'Pastels on Dark',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'slush-and-poppies',
      name: 'Slush and Poppies',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'solarized-dark',
      name: 'Solarized Dark',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'spacecadet',
      name: 'SpaceCadet',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'sunburst',
      name: 'Sunburst',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'tomorrow-night-blue',
      name: 'Tomorrow Night Blue',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'tomorrow-night-bright',
      name: 'Tomorrow Night Bright',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'tomorrow-night-eighties',
      name: 'Tomorrow Night Eighties',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'tomorrow-night',
      name: 'Tomorrow Night',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'twilight',
      name: 'Twilight',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'upstream-sunburst',
      name: 'Upstream Sunburst',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'vibrant-ink',
      name: 'Vibrant Ink',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'zenburnesque',
      name: 'Zenburnesque',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'idlefingers',
      name: 'idleFingers',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'krtheme',
      name: 'krTheme',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'monoindustrial',
      name: 'monoindustrial',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'spotify',
      name: 'Spotify',
      category: 'dark',
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '#535353', fontStyle: 'italic' },
        { token: 'keyword', foreground: '#1db954', fontStyle: 'bold' },
        { token: 'operator', foreground: '#1db954' },
        { token: 'string', foreground: '#1ed760' },
        { token: 'number', foreground: '#ff6b35' },
        { token: 'identifier', foreground: '#ffffff' },
        { token: 'type', foreground: '#1db954' },
        { token: 'function', foreground: '#1ed760' },
        { token: 'variable', foreground: '#b3b3b3' },
        { token: 'constant', foreground: '#ff6b35' },
        { token: 'delimiter', foreground: '#535353' },
        { token: 'tag', foreground: '#1db954' },
        { token: 'attribute.name', foreground: '#1ed760' },
        { token: 'attribute.value', foreground: '#ffffff' },
      ],
      colors: {
        'editor.background': '#121212',
        'editor.foreground': '#ffffff',
        'editor.lineHighlightBackground': '#1a1a1a',
        'editor.selectionBackground': '#1db95450',
        'editor.selectionHighlightBackground': '#1db95430',
        'editor.findMatchBackground': '#1db95450',
        'editor.findMatchHighlightBackground': '#1db95430',
        'editorCursor.foreground': '#1ed760',
        'editorLineNumber.foreground': '#535353',
        'editorLineNumber.activeForeground': '#1db954',
        'editorIndentGuide.background': '#282828',
        'editorIndentGuide.activeBackground': '#1db954',
        'editorWhitespace.foreground': '#282828',
        'editorCodeLens.foreground': '#535353',
        'editorBracketMatch.background': '#1db95430',
        'editorBracketMatch.border': '#1db954',
        'editor.foldBackground': '#1a1a1a',
        'editorGutter.background': '#121212',
        'editorGutter.modifiedBackground': '#1db954',
        'editorGutter.addedBackground': '#1ed760',
        'editorGutter.deletedBackground': '#ff6b35',
        'editorOverviewRuler.border': '#282828',
        'editorOverviewRuler.findMatchForeground': '#1db954',
        'editorOverviewRuler.modifiedForeground': '#1db954',
        'editorOverviewRuler.addedForeground': '#1ed760',
        'editorOverviewRuler.deletedForeground': '#ff6b35',
        'editorError.foreground': '#ff6b35',
        'editorWarning.foreground': '#ffb347',
        'editorInfo.foreground': '#1db954',
        'editorHint.foreground': '#1ed760',
      },
    },

    // Light themes
    {
      id: 'vs',
      name: 'VS Light',
      category: 'light',
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'clouds',
      name: 'Clouds',
      category: 'light',
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'eiffel',
      name: 'Eiffel',
      category: 'light',
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'github-light',
      name: 'GitHub Light',
      category: 'light',
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'github',
      name: 'GitHub',
      category: 'light',
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'kuroir-theme',
      name: 'Kuroir Theme',
      category: 'light',
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'solarized-light',
      name: 'Solarized Light',
      category: 'light',
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'textmate--mac-classic-',
      name: 'Textmate (Mac Classic)',
      category: 'light',
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'tomorrow',
      name: 'Tomorrow',
      category: 'light',
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'xcode-default',
      name: 'Xcode Default',
      category: 'light',
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {},
    },
    {
      id: 'iplastic',
      name: 'iPlastic',
      category: 'light',
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {},
    },
  ];

  private loadedThemes = new Set<string>();

  getThemes(): ThemeInfo[] {
    return this.themes;
  }

  getDarkThemes(): ThemeInfo[] {
    return this.themes.filter((theme) => theme.category === 'dark');
  }

  getLightThemes(): ThemeInfo[] {
    return this.themes.filter((theme) => theme.category === 'light');
  }

  async loadTheme(themeId: string): Promise<void> {
    if (
      this.loadedThemes.has(themeId) ||
      themeId === 'vs' ||
      themeId === 'vs-dark'
    ) {
      return;
    }

    try {
      // Check if theme is defined in our service
      const themeInfo = this.themes.find((t) => t.id === themeId);

      if (
        themeInfo &&
        (themeInfo.rules?.length || Object.keys(themeInfo.colors || {}).length)
      ) {
        // Theme has inline definition, use it
        monaco.editor.defineTheme(themeId, {
          base: themeInfo.base || ('vs-dark' as any),
          inherit: themeInfo.inherit ?? true,
          rules: themeInfo.rules || [],
          colors: themeInfo.colors || {},
        });
        document
          .getElementById('editorContainer')
          ?.setAttribute('theme', themeId);
      } else {
        // Load from file
        const fileName = this.getThemeFileName(themeId);

        // const themeData = Dracula as any;
        monaco.editor.defineTheme(themeId, {
          base: themeInfo?.base || ('vs-light' as any),
          inherit: themeInfo?.inherit ?? true,
          rules: themeInfo?.rules || [],
          colors: themeInfo?.colors || {},
        });
        document
          .getElementById('editorContainer')
          ?.setAttribute('theme', themeId);
      }

      this.loadedThemes.add(themeId);
    } catch (error) {
      console.error(`Failed to load theme ${themeId}:`, error);
      // Fallback to vs-dark if theme loading fails
      monaco.editor.setTheme('vs-dark');
    }
  }

  async setTheme(themeId: string): Promise<void> {
    await this.loadTheme(themeId);
    monaco.editor.setTheme(themeId);
  }

  private getThemeFileName(themeId: string): string {
    const themeFileMap: Record<string, string> = {
      active4d: 'Active4D.json',
      'all-hallows-eve': 'All Hallows Eve.json',
      amy: 'Amy.json',
      'birds-of-paradise': 'Birds of Paradise.json',
      blackboard: 'Blackboard.json',
      'brilliance-black': 'Brilliance Black.json',
      'brilliance-dull': 'Brilliance Dull.json',
      'chrome-devtools': 'Chrome DevTools.json',
      'clouds-midnight': 'Clouds Midnight.json',
      clouds: 'Clouds.json',
      cobalt: 'Cobalt.json',
      cobalt2: 'Cobalt2.json',
      dawn: 'Dawn.json',
      dracula: 'Dracula.json',
      dreamweaver: 'Dreamweaver.json',
      eiffel: 'Eiffel.json',
      'espresso-libre': 'Espresso Libre.json',
      'github-dark': 'GitHub Dark.json',
      'github-light': 'GitHub Light.json',
      github: 'GitHub.json',
      idle: 'IDLE.json',
      katzenmilch: 'Katzenmilch.json',
      'kuroir-theme': 'Kuroir Theme.json',
      lazy: 'LAZY.json',
      'magicwb--amiga-': 'MagicWB (Amiga).json',
      'merbivore-soft': 'Merbivore Soft.json',
      merbivore: 'Merbivore.json',
      'monokai-bright': 'Monokai Bright.json',
      monokai: 'Monokai.json',
      'night-owl': 'Night Owl.json',
      nord: 'Nord.json',
      'oceanic-next': 'Oceanic Next.json',
      'pastels-on-dark': 'Pastels on Dark.json',
      'slush-and-poppies': 'Slush and Poppies.json',
      'solarized-dark': 'Solarized-dark.json',
      'solarized-light': 'Solarized-light.json',
      spacecadet: 'SpaceCadet.json',
      sunburst: 'Sunburst.json',
      'textmate--mac-classic-': 'Textmate (Mac Classic).json',
      'tomorrow-night-blue': 'Tomorrow-Night-Blue.json',
      'tomorrow-night-bright': 'Tomorrow-Night-Bright.json',
      'tomorrow-night-eighties': 'Tomorrow-Night-Eighties.json',
      'tomorrow-night': 'Tomorrow-Night.json',
      tomorrow: 'Tomorrow.json',
      twilight: 'Twilight.json',
      'upstream-sunburst': 'Upstream Sunburst.json',
      'vibrant-ink': 'Vibrant Ink.json',
      'xcode-default': 'Xcode_default.json',
      zenburnesque: 'Zenburnesque.json',
      iplastic: 'iPlastic.json',
      idlefingers: 'idleFingers.json',
      krtheme: 'krTheme.json',
      monoindustrial: 'monoindustrial.json',
    };

    return themeFileMap[themeId] || `${themeId}.json`;
  }
}
