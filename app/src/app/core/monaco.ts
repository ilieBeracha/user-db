import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';
import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';
import { IVSCodeTheme, convertTheme } from '@estruyf/vscode-theme-converter';

import './style.css';

/**
 * DBML example
 *
 * @source https://dbml.dbdiagram.io/docs/
 */
const code = `// Use DBML to define your database structure

Table follows {
  following_user_id integer
  followed_user_id integer
  created_at timestamp 
}

Table users {
  id integer [primary key]
  username varchar
  role varchar
  created_at timestamp
}

Table posts {
  id integer [primary key]
  title varchar
  body text [note: 'Content of the post']
  user_id integer
  status varchar
  created_at timestamp
}

Ref: posts.user_id > users.id // many-to-one

Ref: users.id < follows.following_user_id

Ref: users.id < follows.followed_user_id
`;

/**
 * Thanks to commenters
 *
 * Read all discussion https://github.com/zikaari/monaco-editor-textmate/issues/14
 */

(async function () {
  console.log('monaco');
  await import('monaco-editor');
  console.log('monaco-editor');
  console.log(monaco);
  const editorElement = document.getElementById('editorContainer');
  const theme = 'vs-light';
  console.log('editorElement', editorElement);
  console.log('theme', theme);

  // #region Themes

  const themes = [
    {
      displayName: 'Material Theme Ocean',
      name: 'material-theme-ocean',
    },
    {
      displayName: 'Poimandres',
      name: 'poimandres',
    },
    {
      displayName: 'Monokai',
      name: 'monokai',
    },
    {
      displayName: 'One Light',
      name: 'one-light',
    },
  ];

  async function loadTheme(theme: any) {
    await fetch(`/assets/vsc-themes/${theme.name}.json`).then(
      async (response: Response) => {
        console.log('response', response.status);
        if (response.status === 200) {
          const myExportedTheme = await response.json(),
            convertedTheme: editor.IStandaloneThemeData = convertTheme(
              myExportedTheme as IVSCodeTheme
            );

          monaco.editor.defineTheme(theme.name, convertedTheme);
          editorElement?.setAttribute('theme', theme.name);
          console.log(
            'editorElement',
            editorElement?.getAttribute('theme')
          );
          monaco.editor.setTheme(theme.name);
          console.log(
            'monaco.editor.getTheme()',
            monaco.Uri.from({
              scheme: 'file',
              path: 'editorContainer' + theme.name,
            }).toString()
          );
          console.log(
            'monaco.editor.getTheme()',
            monaco.Uri.from({
              scheme: 'file',
              path: 'editorElement' + theme.name,
            }).toString()
          );

          // monaco.editor.setTheme(theme.name);

          console.log('convertedTheme', convertedTheme);
          console.log('theme.name', theme.name);

          // clear warning message
          document.querySelector('mark')?.remove();
        }
      }
    );
  }

  // #endregion

  // #region Load WASM

  const onigasmResponse = await fetch(
    'https://cdn.jsdelivr.net/npm/onigasm@latest/lib/onigasm.wasm' // use for web (to prevent CORS etc.)
    // 'onigasm/lib/onigasm.wasm' // use while working on local or custom loaders (webpack, vite, etc.)
  );

  if (
    onigasmResponse.status !== 200 ||
    onigasmResponse.headers.get('content-type') !== 'application/wasm'
  ) {
    return null;
  }

  const wasmContent = await onigasmResponse.arrayBuffer();

  if (wasmContent) {
    await loadWASM(wasmContent);
  }

  // #endregion

  // #region Register Grammars

  const registry = new Registry({
    getGrammarDefinition: async (scopeName: string): Promise<any> => {
      console.log('scopeName', scopeName);

      const res: any = {
        format: 'json',
        content: await (
          await fetch('/assets/monaco-editor/grammars/dbml.json')
        ).text(),
      };

      console.log('grammarContent', res);

      return res;
    },
  });

  const grammars = new Map();

  monaco.languages.register({ id: 'dbml' });

  grammars.set('dbml', 'source.dbml');

  console.log(grammars);

  // #endregion

  // #region Init Editor

  const editor = monaco.editor.create(editorElement!, {
    inDiffEditor: false,
    value: code,
    language: 'dbml',
    dragAndDrop: false,

    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: 'smart',

    theme: theme,
    minimap: {
      enabled: false,
    },
  });

  // #endregion

  // #region Wire Grammars

  await wireTmGrammars(monaco, registry, grammars, editor);

  // #endregion

  // #region Add Custom Command Actions

  themes.forEach((theme) => {
    const action = <editor.IActionDescriptor>{
      id: `theme_${theme.name}`,
      label: `Select Theme ${theme.displayName}`,
      run: () => loadTheme(theme),
    };

    editor.addAction(action);
  });

  // #endregion

  loadTheme(themes[0]);
})();
