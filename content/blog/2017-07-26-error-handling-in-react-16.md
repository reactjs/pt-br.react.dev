---
title: "Tratamento de Erro no React 16"
author: [gaearon]
---

Como a versão 16 do React está próxima, nós gostaríamos de anunciar algumas pequenas mudanças de como o React lida com os erros JavaScript dentro dos componentes. Estas mudanças foram incluidas na versão beta do React 16 e fará parte do React 16.  

**A propósito, [nós acabamos de lançar a primeira versão beta do React 16 para você testar!](https://github.com/facebook/react/issues/10294)**

## Funcionamento no React 15 e Antecessor {#behavior-in-react-15-and-earlier}

Anteriormente, os erros JavaScript dentro dos componentes constumanvam corromper o estato interno do React e fazer com que ele [emita](https://github.com/facebook/react/issues/4026) [erros](https://github.com/facebook/react/issues/8579) [difíceis de entender](https://github.com/facebook/react/issues/6895) nos próximos renderizadores. Estes erros foram sempre causados por erros antecessores no código da aplicação, mas o React não providenciava uma forma de manipulá-los de um modo elegante nos componentes, e não poderia se recuperar a partir deles.

## Introduzindo as Limitações de Erros {#introducing-error-boundaries}
<!-- ## Introducing Error Boundaries {#introducing-error-boundaries} -->

Um erro JavaScript na parte da UI não deve parar todo a aplicação. Para resolver estes problemas para os usuário do React, o React 16 introduz um novo conceito de "limitação de erro"  

Limitações de erros são componentes React, que **capturam os erros JavaScript em qualquer lugar referente à arvore de seus componentes filhos, registra os erros e mostra uma alterantiva de UI** ao invés da árvore do componente que foi danificada. As limitações de erros capturam os erros durante a renderização, nos métodos de ciclo de vida e nos construtores de toda a árvore abaixo dele.

Um componente de classe torna-se um limitador de erro, se ele definir um novo método do ciclo de vida, chamado `componentDidCatch(error, info)`:

```js{7-12,15-18}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Mostra uma UI alternativa
    this.setState({ hasError: true });
    // Você também pode registrar o erro em um serviço de relatório de erros
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer alternativa de UI
      return <h1>Algo deu errado.</h1>;
    }
    return this.props.children;
  }
}
```

Então você pode usar ele como um componente comum:

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

O método `componentDidCatch()` funciona como o block `catch {}` do JavaScript, porém, para componentes. Apenas componentes de classe podem ser limitadores de erros. Na prática, na maioria das vezes, você vai querer declarar um componente limitador de error apenas uma vez e usá-lo ao longo da sua aplicação. 

Observe que **limitadores de erros, apenas conseguem capturar erros nos componentes abaixo deles na árvore**. Um limitador de erro não consegue capturar um erro dentro de sí próprio. Se um limitador de erro falhar ao tentar renderizar a mensagem de erro, o erro irá propagar até o limitador de erro máis próximo, localizado acima dele. Este também é de modo similar, a como o block `catch {}` funciona no JavaScript.

## Demonstração Ao Vivo {#live-demo}

Confira [este exemplo de declaração e uso do limitador de erro](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) com o [React 16 beta](https://github.com/facebook/react/issues/10294).

## Onde Posicionar os Limitadores de Erros  {#where-to-place-error-boundaries}

Os pequenos detalhes dos limitadores de erros depende de você. Você pode envolver componentes de rota (superior aos outros componentes) para mostrar uma mensagem, como "Algo deu errado" para o usuário, semelhante aos frameworks de lado do servidor, que geralmente lidam com os conflitos. Você também pode envolver widgets individualmente em um limitador de erro, para os proteger de colidirem com o resto da aplicação.

## New Behavior for Uncaught Errors {#new-behavior-for-uncaught-errors}

This change has an important implication. **As of React 16, errors that were not caught by any error boundary will result in unmounting of the whole React component tree.**

We debated this decision, but in our experience it is worse to leave corrupted UI in place than to completely remove it. For example, in a product like Messenger leaving the broken UI visible could lead to somebody sending a message to the wrong person. Similarly, it is worse for a payments app to display a wrong amount than to render nothing.

This change means that as you migrate to React 16, you will likely uncover existing crashes in your application that have been unnoticed before. Adding error boundaries lets you provide better user experience when something goes wrong.

For example, Facebook Messenger wraps content of the sidebar, the info panel, the conversation log, and the message input into separate error boundaries. If some component in one of these UI areas crashes, the rest of them remain interactive.

We also encourage you to use JS error reporting services (or build your own) so that you can learn about unhandled exceptions as they happen in production, and fix them.

## Component Stack Traces {#component-stack-traces}

React 16 prints all errors that occurred during rendering to the console in development, even if the application accidentally swallows them. In addition to the error message and the JavaScript stack, it also provides component stack traces. Now you can see where exactly in the component tree the failure has happened:

<img src="../images/docs/error-boundaries-stack-trace.png" alt="Component stack traces in error message" style="width: 100%;">

You can also see the filenames and line numbers in the component stack trace. This works by default in [Create React App](https://github.com/facebookincubator/create-react-app) projects:

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" alt="Component stack traces with line numbers in error message" style="width: 100%;">

If you don’t use Create React App, you can add [this plugin](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) manually to your Babel configuration. Note that it’s intended only for development and **must be disabled in production**.

## Why Not Use `try` / `catch`? {#why-not-use-try--catch}

`try` / `catch` is great but it only works for imperative code:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

However, React components are declarative and specify *what* should be rendered:

```js
<Button />
```

Error boundaries preserve the declarative nature of React, and behave as you would expect. For example, even if an error occurs in a `componentDidUpdate` method caused by a `setState` somewhere deep in the tree, it will still correctly propagate to the closest error boundary.

## Naming Changes from React 15 {#naming-changes-from-react-15}

React 15 included a very limited support for error boundaries under a different method name: `unstable_handleError`. This method no longer works, and you will need to change it to `componentDidCatch` in your code starting from the first 16 beta release.

For this change, we’ve provided [a codemod](https://github.com/reactjs/react-codemod#error-boundaries) to automatically migrate your code.
