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
import type {SandpackSetup} from '@codesandbox/sandpack-react';

type SandpackProps = {
  children: React.ReactNode;
  autorun?: boolean;
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
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

>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
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
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
  const files = createFileMap(codeSnippets);

  files['/styles.css'] = {
    code: [sandboxStyle, files['/styles.css']?.code ?? ''].join('\n\n'),
    hidden: true,
  };

<<<<<<< HEAD
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
  let setup: SandpackSetup | undefined;
  if (files['/package.json']) {
    setup = {
      dependencies: JSON.parse(files['/package.json'].code).dependencies,
    };
  }

  return (
    <div className="sandpack sandpack--playground sandbox my-8">
      <SandpackProvider
        template="react"
        files={files}
        customSetup={setup}
        theme={CustomTheme}
        options={{
          autorun,
          initMode: 'user-visible',
          initModeObserverOptions: {rootMargin: '1400px 0px'},
          bundlerURL: 'https://ac83f2d6.sandpack-bundler.pages.dev',
          logLevel: SandpackLogLevel.None,
        }}>
        <CustomPreset
          showDevTools={showDevTools}
          onDevToolsLoad={() => setDevToolsLoaded(true)}
          devToolsLoaded={devToolsLoaded}
          providedFiles={Object.keys(files)}
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
        />
      </SandpackProvider>
    </div>
  );
}

<<<<<<< HEAD
SandpackRoot.displayName = 'Sandpack';

=======
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
export default SandpackRoot;
