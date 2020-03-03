---
id: error-boundaries
title: Error Boundaries
permalink: docs/error-boundaries.html
---

No passado, erros de JavaScript dentro de componentes costumavam corromper o estado interno do React e fazê-lo [emitir](https://github.com/facebook/react/issues/4026) [erros](https://github.com/facebook/react/issues/6895) [incompreensíveis](https://github.com/facebook/react/issues/8579) nas próximas renderizações. Estes erros eram causados por um erro anterior no código da aplicação, mas o React não fornecia um meio para tratá-los de forma graciosa nos componentes e não conseguia se recuperar deles.


## Introduzindo Error Boundaries {#introducing-error-boundaries}

Um erro de JavaScript em uma parte da UI não deve quebrar toda a aplicação. Para resolver este problema para usuários do React, o React 16 introduziu um novo conceito de "error boundary".

Error boundaries são componentes React que **capturam erros de JavaScript em qualquer lugar na sua árvore de componentes filhos, registram esses erros e mostram uma UI alternativa** em vez da árvore de componentes que quebrou. Error boundaries capturam estes erros durante a renderização, em métodos do ciclo de vida, e em construtores de toda a árvore abaixo delas.

> Nota
>
> Error boundaries **não** capturam erros em:
>
> * Manipuladores de evento ([saiba mais](#how-about-event-handlers))
> * Código assíncrono (ex. callbacks de `setTimeout` ou `requestAnimationFrame`)
> * Renderização no servidor
> * Erros lançados na própria error boundary (ao invés de em seus filhos)

Um componente de classe se torna uma error boundary se ele definir um (ou ambos) dos métodos do ciclo de vida [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) ou [`componentDidCatch()`](/docs/react-component.html#componentdidcatch). Use `static getDerivedStateFromError()` para renderizar uma UI alternativa após o erro ter sido lançado. Use `componentDidCatch()` para registrar informações do erro.

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para que a próxima renderização mostre a UI alternativa.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatórios de erro
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI alternativa
      return <h1>Algo deu errado.</h1>;
    }

    return this.props.children; 
  }
}
```

E então você pode usá-la como um componente qualquer:

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

Error boundaries funcionam como o bloco `catch {}` do JavaScript, mas para componentes. Apenas componentes de classe podem ser error boundaries. Na prática, na maioria das vezes você irá declarar um componente error boundary uma vez e usá-lo em toda a aplicação.

Note que **as error boundaries apenas capturam erros nos componentes abaixo delas na árvore**. Uma error boundary não pode capturar um erro em si mesma. Se uma error boundary falhar ao tentar renderizar a mensagem de erro, o erro será propagado para a error boundary mais próxima acima dela. Isto também é parecido com a forma que o bloco catch {} funciona no JavaScript.

## Demonstração ao vivo {#live-demo}

Veja [este exemplo de como declarar e usar uma error boundary](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) com [React 16](/blog/2017/09/26/react-v16.0.html).


## Onde colocar error boundaries {#where-to-place-error-boundaries}

Você é quem decide a granularidade das errors boundaries. Você pode envolver componentes da rota superior para exibir uma mensagem como "Algo deu errado" para o usuário, da mesma forma que frameworks server-side costumam lidar com travamentos. Você também pode envolver widgets individuais em uma error boundary para protegê-los de quebrar o restante da aplicação.


## Novo comportamento para erros não tratados {#new-behavior-for-uncaught-errors}

Esta alteração tem uma implicação importante. **A partir do React 16, erros que não forem tratados por uma error boundary irão fazer com que toda a árvore de componentes React seja desmontada.**

Nós debatemos esta decisão, mas em nossa experiência é pior deixar uma UI corrompida ser exibida do que removê-la completamente. Por exemplo, em um produto como o Messenger, deixar a UI quebrada visível poderia fazer com que alguém envie uma mensagem para a pessoa errada. Do mesmo modo, é pior para um app de pagamentos exibir um valor errado do que não renderizar nada.

Esta alteração significa que quando você migrar para o React 16, você provavelmente irá descobrir alguns travamentos existentes em sua aplicação que antes passavam despercebidos. Adicionar errors boundaries permite que você forneça uma experiência de usuário melhor quando algo der errado.

Por exemplo, o Facebook Messenger envolve o conteúdo da barra lateral, do painel de informações, do histórico da conversa e do input de mensagem em error boundaries separadas. Se algum componente em uma destas áreas da UI quebrar, o restante continua funcionando.

Nós também encorajamos que você use serviços de relatório de erros JS (ou faça o seu próprio) para que você possa ficar sabendo sobre exceções não tratadas quando elas acontecerem em produção e consertá-las.


## Stack traces de componentes {#component-stack-traces}

O React 16 registra todos os erros ocorridos durante a renderização no console em desenvolvimento, mesmo que a aplicação absorva-os acidentalmente. Além da mensagem de erro e a stack do JavaScript, ele também fornece as stack traces do componente. Agora você pode ver onde exatamente na árvore de componentes a falha aconteceu:

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Erro capturada por um componente Error Boundary">

Você também pode ver os nomes dos arquivos e números das linhas na stack trace do componente. Isto funciona por padrão em projetos do [Create React App](https://github.com/facebookincubator/create-react-app):

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Erro capturado por componente Error Boundary com os números das linhas">

Se você não usar o Create React App, você pode adicionar [este plugin](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) manualmente na sua configuração do Babel. Note que isto é destinado apenas para desenvolvimento e **deve ser desativado em produção**.

> Nota
>
> Os nomes de componentes exibidos na stack trace dependem da propriedade [`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name). Se você der suporte a navegadores antigos e dispositivos que podem não fornecer isto nativamente (como o IE 11), considere a inclusão de um poyfill de `Function.name` no bundle da sua aplicação, como o [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name). Outra alternativa é definir a propriedade [`displayName`](/docs/react-component.html#displayname) explicitamente em todos os seus componentes.


## Que tal usar try/catch? {#how-about-trycatch}

`try` / `catch` é ótimo, mas só funciona para código imperativo:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

Contudo, componentes React são declarativos e especificam *o que* deve ser renderizado:

```js
<Button />
```

Error boundaries preservam a natureza declarativa do React e se comportam como você esperaria. Por exemplo, mesmo se um erro ocorrer em um método `componentDidUpdate` causado por um `setState` em algum lugar profundo da árvore, ele ainda vai propagar corretamente para a error boundary mais próxima.

## Como ficam os manipuladores de evento? {#how-about-event-handlers}

Error boundaries **não** tratam erros dentro de manipuladores de evento.

O React não precisa que as error boundaries se recuperem de erros em manipuladores de evento. Ao contrário do método de renderização e dos métodos do ciclo de vida, manipuladores de evento não acontecem durante a renderização. Então, se eles quebrarem, o React ainda sabe o que exibir na tela.

Se você precisar capturar um erro dentro de um manipulador de evento, use a declaração comum de `try` / `catch` do JavaScript:

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Faz alguma coisa que pode quebrar
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Capturei um erro.</h1>
    }
    return <button onClick={this.handleClick}>Clique em mim</button>
  }
}
```

Note que o exemplo acima está demonstrando um comportamento comum de JavaScript e não usa error boundaries.

## Alterações de nomes do React 15 {#naming-changes-from-react-15}

O React 15 incluía um suporte muito limitado para error boundaries sob um método de nome diferente: `unstable_handleError`. Este método não funciona mais e você precisará alterá-lo para `componentDidCatch` em seu código a partir do primeiro release beta da versão 16.

Para esta alteração, nós fornecemos um [codemod](https://github.com/reactjs/react-codemod#error-boundaries) para migrar o seu código automaticamente.
