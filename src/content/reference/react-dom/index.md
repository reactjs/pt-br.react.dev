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

---

## Entry points {/*entry-points*/}

O pacote `react-dom` fornece dois pontos de entrada adicionais:

* [`react-dom/client`](/reference/react-dom/client) contém APIs para renderizar componentes do React no cliente (no navegador).
* [`react-dom/server`](/reference/react-dom/server) contém APIs para renderizar componentes do React no servidor.

---

## APIs Descontinuadas {/*deprecated-apis*/}

<Deprecated>

Essas APIs serão removidas em uma versão principal futura do React.

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode) encontra o nó DOM mais próximo correspondente a uma instância de componente de classe.
* [`hydrate`](/reference/react-dom/hydrate) monta uma árvore no DOM criada a partir do HTML do servidor. Obsoleta em favor de [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](/reference/react-dom/render) monta uma árvore no DOM. Obsoleta em favor de [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) desmonta uma árvore do DOM. Obsoleta em favor de [`root.unmount()`.](/reference/react-dom/client/createRoot#root-unmount)

