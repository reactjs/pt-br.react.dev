---
title: "Tratamento de Erro no React 16"
author: [gaearon]
---

Como a versão 16 do React está próxima, nós gostaríamos de anunciar algumas pequenas mudanças de como o React lida com os erros JavaScript dentro dos componentes. Estas mudanças foram incluidas na versão beta do React 16 e fará parte do React 16.  

**A propósito, [nós acabamos de lançar a primeira versão beta do React 16 para você testar!](https://github.com/facebook/react/issues/10294)**

## Funcionamento no React 15 e Antecessor {#behavior-in-react-15-and-earlier}

Anteriormente, os erros JavaScript dentro dos componentes costumavam corromper o estado interno do React e fazer com que ele [emita](https://github.com/facebook/react/issues/4026) [erros](https://github.com/facebook/react/issues/8579) [difíceis de entender](https://github.com/facebook/react/issues/6895) nos próximos renderizadores. Estes erros foram sempre causados por erros antecessores no código da aplicação, mas o React não providenciava uma forma de manipulá-los de um modo elegante nos componentes, e não poderia se recuperar a partir deles.

## Introduzindo as Limitações de Erros {#introducing-error-boundaries}

Um erro JavaScript na parte da UI não deve parar toda a aplicação. Para resolver estes problemas para os usuário do React, o React 16 introduz um novo conceito de "limitação de erro"  

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

Observe que **limitadores de erros, apenas conseguem capturar erros nos componentes abaixo deles na árvore**. Um limitador de erro não consegue capturar um erro dentro de sí próprio. Se um limitador de erro falhar ao tentar renderizar a mensagem de erro, o erro irá propagar até o limitador de erro máis próximo, localizado acima dele. Este também é de modo similar, como o block `catch {}` funciona no JavaScript.

## Demonstração Ao Vivo {#live-demo}

Confira [este exemplo de declaração e uso do limitador de erro](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) com o [React 16 beta](https://github.com/facebook/react/issues/10294).

## Onde Posicionar os Limitadores de Erros  {#where-to-place-error-boundaries}

Os pequenos detalhes dos limitadores de erros depende de você. Você pode envolver componentes de rota (superior aos outros componentes) para mostrar uma mensagem, como "Algo deu errado" para o usuário, semelhante aos frameworks de lado do servidor, que geralmente lidam com os conflitos. Você também pode envolver widgets individualmente em um limitador de erro, para os proteger de colidirem com o resto da aplicação.

## Novo Comportamento para Erros Não Capturados {#new-behavior-for-uncaught-errors}

Esta mudança tem uma consequência importante. A partir do React 16, os erros que não forem capturados pelos limitadores de erros, resultará no desmontamento completo da àrvore do componente React. 

Nós discutimos esta decisão, mas pela nossa experiência é pior deixar a UI corrompida ao invés de removê-la completamente. Por exemplo, em um produto como Messenger, deixar uma UI corrompida visível pode levar alguém a enviar uma mensagem para uma pessoa errada. De forma similar, é pior para um app de pagamento mostrar uma quantia errada do que renderizar nada.  

Esta mudança significa que à medida que você migra para o React 16, você provavelmente descobrirá falhas existentes na sua aplicação que não foram percebidas anteriormente. Adicionar limitadores de erros permite você prover uma melhor experiência de usuário quando algo dá errado.

Por exemplo, o Facebook Messenger envolve o conteúdo da barra lateral, o painel de informações, o log de conversação e o campo de entrada da mensagem dentro de limitadores de erros separados. Se algum componente de uma dessas áreas da UI falharem, o resto deles permanecem interativo.

Nós também incentivamos você a usar serviços de relatórios de erros JS (ou construir o seu próprio), de modo que você possa aprender sobre exceções não tratadas conforme elas acontecem em produção e corrigi-las.

## Rastros da Pilha do Componente {#component-stack-traces}

O React 16 exibe todos os erros que ocorreram durante a renderização de desenvolvimento no console, mesmo se a aplicação acidentalmente tenha os aceitado. Além da mensagen de erro e da pilha JavaScript, também é fornecido os rastros da pilha do componente. Agora você pode ver exatamente onde na àrvode do componente a falha ocorreu:

<img src="../images/docs/error-boundaries-stack-trace.png" alt="Rastros da pilha do componente em uma mensagem de erro" style="width: 100%;">

Você também consegue ver os nomes dos arquivos e os números das linhas no rastro da pilha do componente. Isto funciona por padrão nos projetos [Create React App](https://github.com/facebookincubator/create-react-app):

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" alt="Rastro da pilha do componente com número de linhas em uma mensagem de erro" style="width: 100%;">

Se você não usa o Create React App, você pode adicionar [este plugin](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) manualmente as configurações do seu Babel. Observe que isto destina-se apenas para desenvolvimento e **deve ser desativado em produção**.

## Por que não usar `try` / `catch`? {#why-not-use-try--catch}

`try` / `catch` é ótimo, mas funciona apenas para código imperativo:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

Porém, componentes React são declarativos e especificam *o que* deve ser renderizado:

```js
<Button />
```

Limitadores de erros preservam a natureza declarativa do React, e se comportam como você esperaria. Por exemplo, mesmo se um erro ocorresse no método `componentDidUpdate`, causado por um `setState` em algum lugar profundo da árvore, ainda assim irá propagar corretamente para o limitador de erro mais próximo.

## Mudanças de Nomenclatura do React 15 {#naming-changes-from-react-15}

O React 15 incluiu um suporte muito restrito aos limitadores de erros utilizando um nome de método diferente: `unstable_handleError`. Este método não funciona mais, e você precisará trocar em seu código para `componentDidCatch` a partir da primeira versão beta 16.  

Para esta mudança, nós fornecemos uma [ferramenta de refatoração](https://github.com/reactjs/react-codemod#error-boundaries) para migrar seu código automaticamente.
