---
title: "APIs React Integradas"
---

<Intro>

Em adição aos [Hooks](/reference/react) e [Componentes](/reference/react/components), o pacote `react` exporta algumas outras APIs que são úteis para definir componentes. Essa página lista todas as APIs modernas restantes do React.

</Intro>

---

* [`createContext`](/reference/react/createContext) permite que você defina e forneça contexto aos componentes filhos. Utilizado com [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) permite que seu componente exponha um nó do DOM como uma referência para o pai. Utilizado com [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) permite adiar o carregamento do código de um componente até que ele seja renderizado pela primeira vez.
* [`memo`](/reference/react/memo) permite que seu componente evite re-renderizações se as propriedades (`props`) forem as mesmas. Utilizado com [`useMemo`](/reference/react/useMemo) e [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) permite marcar uma atualização de estado como não urgente. Semelhante a [`useTransition`.](/reference/react/useTransition)

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
