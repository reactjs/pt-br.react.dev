---
title: "APIs React Integradas"
---

<Intro>

<<<<<<< HEAD
Em adição aos [Hooks](/reference/react) e [Componentes](/reference/react/components), o pacote `react` exporta algumas outras APIs que são úteis para definir componentes. Essa página lista todas as APIs modernas restantes do React.
=======
In addition to [Hooks](/reference/react/hooks) and [Components](/reference/react/components), the `react` package exports a few other APIs that are useful for defining components. This page lists all the remaining modern React APIs.
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0

</Intro>

---

* [`createContext`](/reference/react/createContext) permite que você defina e forneça contexto para os componentes filhos. Usado com [`useContext`](/reference/react/useContext).
* [`lazy`](/reference/react/lazy) permite adiar o carregamento do código de um componente até que ele seja renderizado pela primeira vez.
* [`memo`](/reference/react/memo) permite que seu componente pule re-renderizações com as mesmas props. Usado com [`useMemo`](/reference/react/useMemo) e [`useCallback`](/reference/react/useCallback).
* [`startTransition`](/reference/react/startTransition) permite que você marque uma atualização de estado como não urgente. Semelhante a [`useTransition`](/reference/react/useTransition).
* [`act`](/reference/react/act) permite que você envolva renderizações e interações em testes para garantir que as atualizações tenham sido processadas antes de fazer asserções.

---

## Resource APIs {/*resource-apis*/}

*Resources* podem ser acessados por um componente sem tê-los como parte de seu estado. Por exemplo, um componente pode ler uma mensagem de uma Promise ou ler informações de estilo de um context.

Para ler um valor de um recurso, use esta API:

* [`use`](/reference/react/use) permite que você leia o valor de um recurso como um [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou [context](/learn/passing-data-deeply-with-context).
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
