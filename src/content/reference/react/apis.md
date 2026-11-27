---
title: "APIs React Integradas"
---

<Intro>

Em adição aos [Hooks](/reference/react/hooks) e [Componentes](/reference/react/components), o pacote `react` exporta algumas outras APIs que são úteis para definir componentes. Essa página lista todas as APIs modernas restantes do React.

</Intro>

---

* [`createContext`](/reference/react/createContext) permite que você defina e forneça contexto para os componentes filhos. Usado com [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) permite adiar o carregamento do código de um componente até que ele seja renderizado pela primeira vez.
* [`memo`](/reference/react/memo) permite que seu componente pule re-renderizações com as mesmas props. Usado com [`useMemo`](/reference/react/useMemo) e [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) permite que você marque uma atualização de estado como não urgente. Semelhante a [`useTransition`.](/reference/react/useTransition)
* [`addTransitionType`](/reference/react/addTransitionType) permite que você especifique a causa de uma Transition. Usado com [`startTransition`](/reference/react/startTransition) e [`<ViewTransition>`.](/reference/react/ViewTransition)
* [`act`](/reference/react/act) permite que você envolva renderizações e interações em testes para garantir que as atualizações tenham sido processadas antes de fazer asserções.
* [`cache`](/reference/react/cache) permite que você armazene em cache o resultado de uma busca de dados ou de um cálculo.
* [`cacheSignal`](/reference/react/cacheSignal) permite que você saiba quando o tempo de vida do `cache()` terminou.
* [`captureOwnerStack`](/reference/react/captureOwnerStack) lê a Owner Stack atual em desenvolvimento e a retorna como uma string, se disponível.

---

## Resource APIs {/*resource-apis*/}

*Resources* podem ser acessados por um componente sem tê-los como parte de seu estado. Por exemplo, um componente pode ler uma mensagem de uma Promise ou ler informações de estilo de um context.

Você pode passar estes tipos de recursos para [`use`](/reference/react/use):

* Uma [Promise](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise) para ler seu valor resolvido.
* Um [context](/learn/passing-data-deeply-with-context) para ler seu valor.
* O valor retornado por [`browser`](/reference/react-dom/browser) para marcar um componente como exclusivo do navegador durante a renderização no servidor.

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  use(browser());
  // ...
}
```
