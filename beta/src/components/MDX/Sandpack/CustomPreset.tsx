/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
import {memo, useRef, useState} from 'react';
import {flushSync} from 'react-dom';
import {
  useSandpack,
  useActiveCode,
  SandpackCodeEditor,
<<<<<<< HEAD
  SandpackThemeProvider,
  SandpackReactDevTools,
=======
  // SandpackReactDevTools,
  SandpackLayout,
>>>>>>> d483aebbac6d3c8f059b52abf21240bc91d0b96e
} from '@codesandbox/sandpack-react';
import cn from 'classnames';

import cn from 'classnames';

import {IconChevron} from 'components/Icon/IconChevron';
import {NavigationBar} from './NavigationBar';
import {Preview} from './Preview';

<<<<<<< HEAD
export function CustomPreset({
  isSingleFile,
  showDevTools,
  onDevToolsLoad,
  devToolsLoaded,
}: {
  isSingleFile: boolean;
  showDevTools: boolean;
  devToolsLoaded: boolean;
  onDevToolsLoad: () => void;
=======
import {useSandpackLint} from './useSandpackLint';

export const CustomPreset = memo(function CustomPreset({
  showDevTools,
  onDevToolsLoad,
  devToolsLoaded,
  providedFiles,
}: {
  showDevTools: boolean;
  devToolsLoaded: boolean;
  onDevToolsLoad: () => void;
  providedFiles: Array<string>;
>>>>>>> d483aebbac6d3c8f059b52abf21240bc91d0b96e
}) {
  const {lintErrors, lintExtensions} = useSandpackLint();
  const {sandpack} = useSandpack();
  const {code} = useActiveCode();
  const {activeFile} = sandpack;
  const lineCountRef = useRef<{[key: string]: number}>({});
  if (!lineCountRef.current[activeFile]) {
    lineCountRef.current[activeFile] = code.split('\n').length;
  }
<<<<<<< HEAD
  const lineCount = lineCountRef.current[activePath];
  const isExpandable = lineCount > 16 || isExpanded;
=======
  const lineCount = lineCountRef.current[activeFile];
  const isExpandable = lineCount > 16;
  return (
    <SandboxShell
      showDevTools={showDevTools}
      onDevToolsLoad={onDevToolsLoad}
      devToolsLoaded={devToolsLoaded}
      providedFiles={providedFiles}
      lintErrors={lintErrors}
      lintExtensions={lintExtensions}
      isExpandable={isExpandable}
    />
  );
});
>>>>>>> d483aebbac6d3c8f059b52abf21240bc91d0b96e

const SandboxShell = memo(function SandboxShell({
  showDevTools,
  onDevToolsLoad,
  devToolsLoaded,
  providedFiles,
  lintErrors,
  lintExtensions,
  isExpandable,
}: {
  showDevTools: boolean;
  devToolsLoaded: boolean;
  onDevToolsLoad: () => void;
  providedFiles: Array<string>;
  lintErrors: Array<any>;
  lintExtensions: Array<any>;
  isExpandable: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <div
        className="shadow-lg dark:shadow-lg-dark rounded-lg"
        ref={containerRef}>
<<<<<<< HEAD
        <NavigationBar showDownload={isSingleFile} />
        <SandpackThemeProvider theme={CustomTheme}>
          <div
            ref={sandpack.lazyAnchorRef}
            className={cn(
              'sp-layout sp-custom-layout',
              showDevTools && devToolsLoaded && 'sp-layout-devtools',
              isExpanded && 'sp-layout-expanded'
            )}>
            <SandpackCodeEditor
              showLineNumbers
              showInlineErrors
              showTabs={false}
              showRunButton={false}
            />
            <Preview
              className="order-last xl:order-2"
              isExpanded={isExpanded}
            />
            {isExpandable && (
              <button
                translate="yes"
                className="flex text-base justify-between dark:border-card-dark bg-wash dark:bg-card-dark items-center z-10 rounded-t-none p-1 w-full order-2 xl:order-last border-b-1 relative top-0"
                onClick={() => {
                  const nextIsExpanded = !isExpanded;
                  flushSync(() => {
                    setIsExpanded(nextIsExpanded);
                  });
                  if (!nextIsExpanded && containerRef.current !== null) {
                    scrollIntoView(containerRef.current, {
                      scrollMode: 'if-needed',
=======
        <NavigationBar providedFiles={providedFiles} />
        <SandpackLayout
          className={cn(
            showDevTools && devToolsLoaded && 'sp-layout-devtools',
            !(isExpandable || isExpanded) && 'rounded-b-lg overflow-hidden',
            isExpanded && 'sp-layout-expanded'
          )}>
          <Editor lintExtensions={lintExtensions} />
          <Preview
            className="order-last xl:order-2"
            isExpanded={isExpanded}
            lintErrors={lintErrors}
          />
          {(isExpandable || isExpanded) && (
            <button
              translate="yes"
              className="sandpack-expand flex text-base justify-between dark:border-card-dark bg-wash dark:bg-card-dark items-center z-10 p-1 w-full order-2 xl:order-last border-b-1 relative top-0"
              onClick={() => {
                const nextIsExpanded = !isExpanded;
                flushSync(() => {
                  setIsExpanded(nextIsExpanded);
                });
                if (!nextIsExpanded && containerRef.current !== null) {
                  // @ts-ignore
                  if (containerRef.current.scrollIntoViewIfNeeded) {
                    // @ts-ignore
                    containerRef.current.scrollIntoViewIfNeeded();
                  } else {
                    containerRef.current.scrollIntoView({
>>>>>>> d483aebbac6d3c8f059b52abf21240bc91d0b96e
                      block: 'nearest',
                      inline: 'nearest',
                    });
                  }
<<<<<<< HEAD
                }}>
                <span className="flex p-2 focus:outline-none text-primary dark:text-primary-dark">
                  <IconChevron
                    className="inline mr-1.5 text-xl"
                    displayDirection={isExpanded ? 'up' : 'down'}
                  />
                  {isExpanded ? 'Show less' : 'Show more'}
                </span>
              </button>
            )}
          </div>

          {showDevTools && (
            <SandpackReactDevTools onLoadModule={onDevToolsLoad} />
          )}
        </SandpackThemeProvider>
=======
                }
              }}>
              <span className="flex p-2 focus:outline-none text-primary dark:text-primary-dark leading-[20px]">
                <IconChevron
                  className="inline mr-1.5 text-xl"
                  displayDirection={isExpanded ? 'up' : 'down'}
                />
                {isExpanded ? 'Show less' : 'Show more'}
              </span>
            </button>
          )}
        </SandpackLayout>

        {/* {showDevTools && (
          // @ts-ignore TODO(@danilowoz): support devtools
          <SandpackReactDevTools onLoadModule={onDevToolsLoad} />
        )} */}
>>>>>>> d483aebbac6d3c8f059b52abf21240bc91d0b96e
      </div>
    </>
  );
});

const Editor = memo(function Editor({
  lintExtensions,
}: {
  lintExtensions: Array<any>;
}) {
  return (
    <SandpackCodeEditor
      showLineNumbers
      showInlineErrors
      showTabs={false}
      showRunButton={false}
      extensions={lintExtensions}
    />
  );
});
