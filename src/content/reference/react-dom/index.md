---
title: React DOM APIs
---

<Intro>

O pacote `react-dom` contém métodos que são suportados apenas para aplicações web (que são executadas no ambiente DOM do navegador). Eles não são suportados para o React Native.

</Intro>

---

## APIs {/*apis*/}

Essas APIs podem ser importadas em seus componentes. Elas são raramente usadas:

* [`createPortal`](/reference/react-dom/createPortal) permite renderizar componentes filhos em uma parte diferente da árvore DOM.
* [`flushSync`](/reference/react-dom/flushSync) permite forçar o React a atualizar o estado e atualizar o DOM sincronamente.

## Resource Preloading APIs {/*resource-preloading-apis*/}

These APIs can be used to make apps faster by pre-loading resources such as scripts, stylesheets, and fonts as soon as you know you need them, for example before navigating to another page where the resources will be used.

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework's documentation for details.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) lets you prefetch the IP address of a DNS domain name that you expect to connect to.
* [`preconnect`](/reference/react-dom/preconnect) lets you connect to a server you expect to request resources from, even if you don't know what resources you'll need yet.
* [`preload`](/reference/react-dom/preload) lets you fetch a stylesheet, font, image, or external script that you expect to use.
* [`preloadModule`](/reference/react-dom/preloadModule) lets you fetch an ESM module that you expect to use.
* [`preinit`](/reference/react-dom/preinit) lets you fetch and evaluate an external script or fetch and insert a stylesheet.
* [`preinitModule`](/reference/react-dom/preinitModule) lets you fetch and evaluate an ESM module.

---

## Entry points {/*entry-points*/}

O pacote `react-dom` fornece dois pontos de entrada adicionais:

* [`react-dom/client`](/reference/react-dom/client) contém APIs para renderizar componentes do React no cliente (no navegador).
* [`react-dom/server`](/reference/react-dom/server) contém APIs para renderizar componentes do React no servidor.

---

<<<<<<< HEAD
## APIs Descontinuadas {/*deprecated-apis*/}

<Deprecated>

Essas APIs serão removidas em uma versão principal futura do React.

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode) encontra o nó DOM mais próximo correspondente a uma instância de componente de classe.
* [`hydrate`](/reference/react-dom/hydrate) monta uma árvore no DOM criada a partir do HTML do servidor. Obsoleta em favor de [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](/reference/react-dom/render) monta uma árvore no DOM. Obsoleta em favor de [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) desmonta uma árvore do DOM. Obsoleta em favor de [`root.unmount()`.](/reference/react-dom/client/createRoot#root-unmount).
=======
## Removed APIs {/*removed-apis*/}

These APIs were removed in React 19:

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): see [alternatives](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): use [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) instead.
* [`render`](https://18.react.dev/reference/react-dom/render): use [`createRoot`](/reference/react-dom/client/createRoot) instead.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): use [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) instead.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc
