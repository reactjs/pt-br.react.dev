/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

<<<<<<< HEAD
import * as React from 'react';
import {SandpackProvider} from '@codesandbox/sandpack-react';
import {CustomPreset} from './CustomPreset';
import {createFileMap} from './utils';

import type {SandpackSetup} from '@codesandbox/sandpack-react';

type SandpackProps = {
  children: React.ReactChildren;
  autorun?: boolean;
  setup?: SandpackSetup;
=======
import {Children, useState} from 'react';
import * as React from 'react';
import {SandpackProvider} from '@codesandbox/sandpack-react';
import {SandpackLogLevel} from '@codesandbox/sandpack-client';
import {CustomPreset} from './CustomPreset';
import {createFileMap} from './createFileMap';
import {CustomTheme} from './Themes';

type SandpackProps = {
  children: React.ReactNode;
  autorun?: boolean;
>>>>>>> 3ff6fe871c6212118991ffafa5503358194489a0
  showDevTools?: boolean;
};

const sandboxStyle = `
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

<<<<<<< HEAD
=======
code {
  font-size: 1.2em;
}

>>>>>>> 3ff6fe871c6212118991ffafa5503358194489a0
ul {
  padding-left: 20px;
}
`.trim();

function SandpackRoot(props: SandpackProps) {
<<<<<<< HEAD
  let {children, setup, autorun = true, showDevTools = false} = props;
  const [devToolsLoaded, setDevToolsLoaded] = React.useState(false);
  let codeSnippets = React.Children.toArray(children) as React.ReactElement[];
  let isSingleFile = true;

=======
  let {children, autorun = true, showDevTools = false} = props;
  const [devToolsLoaded, setDevToolsLoaded] = useState(false);
  const codeSnippets = Children.toArray(children) as React.ReactElement[];
>>>>>>> 3ff6fe871c6212118991ffafa5503358194489a0
  const files = createFileMap(codeSnippets);

  files['/styles.css'] = {
    code: [sandboxStyle, files['/styles.css']?.code ?? ''].join('\n\n'),
<<<<<<< HEAD
    hidden: true,
  };

  return (
    <div className="sandpack-container my-8" translate="no">
      <SandpackProvider
        template="react"
        customSetup={{...setup, files: files}}
        autorun={autorun}
        initMode="user-visible"
        initModeObserverOptions={{rootMargin: '1400px 0px'}}>
        <CustomPreset
          isSingleFile={isSingleFile}
          showDevTools={showDevTools}
          onDevToolsLoad={() => setDevToolsLoaded(true)}
          devToolsLoaded={devToolsLoaded}
=======
    hidden: !files['/styles.css']?.visible,
  };

  return (
    <div className="sandpack sandpack--playground my-8">
      <SandpackProvider
        template="react"
        files={files}
        theme={CustomTheme}
        options={{
          autorun,
          initMode: 'user-visible',
          initModeObserverOptions: {rootMargin: '1400px 0px'},
          bundlerURL: 'https://dad0ba0e.sandpack-bundler-4bw.pages.dev',
          logLevel: SandpackLogLevel.None,
        }}>
        <CustomPreset
          showDevTools={showDevTools}
          onDevToolsLoad={() => setDevToolsLoaded(true)}
          devToolsLoaded={devToolsLoaded}
          providedFiles={Object.keys(files)}
>>>>>>> 3ff6fe871c6212118991ffafa5503358194489a0
        />
      </SandpackProvider>
    </div>
  );
}

<<<<<<< HEAD
SandpackRoot.displayName = 'Sandpack';

=======
>>>>>>> 3ff6fe871c6212118991ffafa5503358194489a0
export default SandpackRoot;
