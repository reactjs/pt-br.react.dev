/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {SandpackProvider} from '@codesandbox/sandpack-react';
<<<<<<< HEAD
import {CustomPreset} from './CustomPreset';
import {createFileMap} from './utils';
=======
import {SandpackLogLevel} from '@codesandbox/sandpack-client';
import {CustomPreset} from './CustomPreset';
import {createFileMap} from './createFileMap';
>>>>>>> 37cf98d075de3133b5ae69fe80fbecb6a742530a

import type {SandpackSetup} from '@codesandbox/sandpack-react';

type SandpackProps = {
<<<<<<< HEAD
  children: React.ReactChildren;
=======
  children: React.ReactNode;
>>>>>>> 37cf98d075de3133b5ae69fe80fbecb6a742530a
  autorun?: boolean;
  setup?: SandpackSetup;
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

ul {
  padding-left: 20px;
}
`.trim();

function SandpackRoot(props: SandpackProps) {
  let {children, setup, autorun = true, showDevTools = false} = props;
  const [devToolsLoaded, setDevToolsLoaded] = React.useState(false);
  let codeSnippets = React.Children.toArray(children) as React.ReactElement[];
  let isSingleFile = true;

  const files = createFileMap(codeSnippets);

  files['/styles.css'] = {
    code: [sandboxStyle, files['/styles.css']?.code ?? ''].join('\n\n'),
    hidden: true,
  };

  return (
    <div className="sandpack-container my-8" translate="no">
      <SandpackProvider
        template="react"
        customSetup={{...setup, files: files}}
        autorun={autorun}
        initMode="user-visible"
<<<<<<< HEAD
        initModeObserverOptions={{rootMargin: '1400px 0px'}}>
=======
        initModeObserverOptions={{rootMargin: '1400px 0px'}}
        bundlerURL="https://6b760a26.sandpack-bundler.pages.dev"
        logLevel={SandpackLogLevel.None}>
>>>>>>> 37cf98d075de3133b5ae69fe80fbecb6a742530a
        <CustomPreset
          isSingleFile={isSingleFile}
          showDevTools={showDevTools}
          onDevToolsLoad={() => setDevToolsLoaded(true)}
          devToolsLoaded={devToolsLoaded}
        />
      </SandpackProvider>
    </div>
  );
}

SandpackRoot.displayName = 'Sandpack';

export default SandpackRoot;
