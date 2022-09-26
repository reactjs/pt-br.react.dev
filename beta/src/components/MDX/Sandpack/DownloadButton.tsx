/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useSyncExternalStore} from 'react';
import {useSandpack} from '@codesandbox/sandpack-react';
import {IconDownload} from '../../Icon/IconDownload';
export interface DownloadButtonProps {}

<<<<<<< HEAD
let initialIsSupported = false;

export const DownloadButton: React.FC<DownloadButtonProps> = () => {
  const {sandpack} = useSandpack();
  const [supported, setSupported] = React.useState(initialIsSupported);
  React.useEffect(() => {
    // This detection will work in Chrome 97+
    if (
      !supported &&
      (HTMLScriptElement as any).supports &&
      (HTMLScriptElement as any).supports('importmap')
    ) {
      setSupported(true);
      initialIsSupported = true;
    }
  }, [supported]);
=======
let supportsImportMap: boolean | void;
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

function useSupportsImportMap() {
  function subscribe() {
    // It never updates.
    return () => {};
  }
  function getCurrentValue() {
    if (supportsImportMap === undefined) {
      supportsImportMap =
        (HTMLScriptElement as any).supports &&
        (HTMLScriptElement as any).supports('importmap');
    }
    return supportsImportMap;
  }
  function getServerSnapshot() {
    return false;
  }

  return useSyncExternalStore(subscribe, getCurrentValue, getServerSnapshot);
}

const SUPPORTED_FILES = ['/App.js', '/styles.css'];

export function DownloadButton({
  providedFiles,
}: {
  providedFiles: Array<string>;
}) {
  const {sandpack} = useSandpack();
  const supported = useSupportsImportMap();
  if (!supported) {
    return null;
  }
  if (providedFiles.some((file) => !SUPPORTED_FILES.includes(file))) {
    return null;
  }

  const downloadHTML = () => {
    const css = sandpack.files['/styles.css']?.code ?? '';
    const code = sandpack.files['/App.js']?.code ?? '';
    const blob = new Blob([
      `<!DOCTYPE html>
<html>
<body>
  <div id="root"></div>
</body>
<!-- This setup is not suitable for production. -->
<!-- Only use it in development! -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react?dev",
    "react-dom/client": "https://esm.sh/react-dom/client?dev"
  }
}
</script>
<script type="text/babel" data-type="module">
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

${code.replace('export default ', 'let App = ')}

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
</script>
<style>
${css}
</style>
</html>`,
    ]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'sandbox.html';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
      onClick={downloadHTML}
      title="Download Sandbox"
      type="button">
      <IconDownload className="inline mr-1" /> Download
    </button>
  );
}
