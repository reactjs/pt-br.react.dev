---
id: strict-mode
title: Modo Estrito (Strict Mode)
permalink: docs/strict-mode.html
---

O modo estrito (`Strict Mode`) é uma ferramenta para sinalizar potenciais problemas em uma aplicação. Assim como o `Fragment`, o `StrictMode` não renderiza nenhum elemento visível na interface. Ele ativa, no entanto, verificações e avisos adicionais para os seus descendentes.

> Nota:
>
> Verificações do modo estrito são executadas somente em modo de desenvolvimento; _elas não impactam na build de produção_.

Você pode habilitar o modo estrito para qualquer parte da sua aplicação, por exemplo:
`embed:strict-mode/enabling-strict-mode.js`

No exemplo acima, as verificações do modo estrito *não* serão executadas nos componentes `Header` e `Footer`. No entanto, `ComponentOne` e `ComponentTwo`, assim como todos os seus componentes descendentes, serão verificados.

O modo estrito ajuda atualmente com:
* [Identificação de métodos de ciclo de vida (lifecycles) inseguros](#identifying-unsafe-lifecycles)
* [Avisos em relação ao uso da antiga string ref API](#warning-about-legacy-string-ref-api-usage)
* [Avisos em relação ao uso do depreciado findDOMNode](#warning-about-deprecated-finddomnode-usage)
* [Detecção de efeitos colaterais (side effects) inesperados](#detecting-unexpected-side-effects)
* [Detecção de uso da antiga API de contexto (Context API)](#detecting-legacy-context-api)

Funcionalidades adicionais serão adicionadas em versões futuras do React.

### Identificar métodos de ciclo de vida (lifecycles) inseguros {#identifying-unsafe-lifecycles}

Como explicado [neste post](/blog/2018/03/27/update-on-async-rendering.html), alguns antigos métodos de ciclo de vida (lifecycles) são inseguros de serem usados em aplicações assíncronas do React. Contudo, se a sua aplicação usa bibliotecas customizadas, pode ser difícil de verificar que esses métodos de ciclo de vida não estão sendo usados. Felizmente, o modo estrito pode ajudar nisso!

Quando o modo estrito está ativado, o React compila uma lista de todos os componentes classe que usam ciclos de vida inseguros e imprime no console uma mensagem de aviso com informações relativas a estes componentes, como:

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Resolver os problemas identificados pelo modo estrito _agora_, facilitará a utilização da renderização concorrente em versões futuras do React.

### Aviso em relação ao uso da antiga string ref API {#warning-about-legacy-string-ref-api-usage}

Anteriormente, o React fornecia duas maneiras de gerenciar refs: a antiga string ref API e a callback API. Embora a string ref API fosse a mais conveniente das duas, ela apresentava [várias desvantagens](https://github.com/facebook/react/issues/1373) e, portanto, nossa recomendação oficial era [usar o formulário de callback](/docs/refs-and-the-dom.html#legacy-api-string-refs).

O React 16.3 adicionou uma terceira opção que oferece a conveniência da string ref sem qualquer desvantagem:
`embed:16-3-release-blog-post/create-ref-example.js`

Como refs de objetos foram adicionadas como substitutos para as string refs, o modo estrito agora avisa em relação ao uso da antiga string ref API.

> **Nota:**
>
> Callback refs continuarão a ter suporte juntamente com a nova `createRef` API (introduzida no React 16.3).
>
> Você não precisa substituir callback refs em seus componentes. Elas são um pouco mais flexíveis, então continuam a ser um recurso avançado.

[Saiba mais sobre a nova `createRef` API aqui.](/docs/refs-and-the-dom.html)

### Aviso em relação ao uso do depreciado findDOMNode {#warning-about-deprecated-finddomnode-usage}

O React costumava suportar `findDOMNode` para procurar na árvore por um elemento DOM dada uma instância de classe. Normalmente, você não precisa disso, já que você pode [anexar uma ref diretamente em um elemento DOM](/docs/refs-and-the-dom.html#creating-refs).

`findDOMNode` também pode ser usado em componentes de classe, mas isso estava quebrando níveis de abstração ao permitir que um componente pai demandasse que certos componentes filhos fossem renderizados. Ele cria um risco de refatoração em que você não pode alterar os detalhes de implementação de um componente por que um componente pai pode estar alcançando o seu elemento DOM. `findDOMNode` somente retorna o primeiro filho, mas com o uso de fragmentos, é possível que um componente renderize múltiplos elementos DOM. `findDOMNode` é uma API de única leitura. Só enviava resposta quando você chamava. Se um componente filho renderiza um elemento diferente, não há como lidar com essa mudança. Portando, `findDOMNode` só funcionava se os componentes sempre retornassem um único elemento DOM que nunca muda.

Você pode deixar isso explícito se passar uma ref para o seu componente customizado, passando-a através do DOM usando [`encaminhamento de ref`](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Você também pode adicionar um elemento DOM que envolve o seu componente e anexar uma ref diretamente a ele.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  render() {
    return <div ref={this.wrapper}>{this.props.children}</div>;
  }
}
```

> Nota:
>
> Em CSS, o atributo [`display: contents`](https://developer.mozilla.org/en-US/docs/Web/CSS/display#display_contents) pode ser usado se você não quer que o elemento faça parte do _layout_.

### Detectar efeitos colaterais (side effects) inesperados {#detecting-unexpected-side-effects}

Conceptualmente, o React funciona em duas fases:
* A **fase de renderização** determina quais mudanças precisam ser feitas para, por exemplo, o DOM. Durante essa fase, o React chama `render` e compara o resultado com a renderização anterior.
* A **fase de _commit_** é quando o React aplica qualquer mudança. (No caso do React DOM, isso é quando o React insere, atualiza ou remove nós do DOM.) O React também chama métodos de ciclo de vida como `componentDidMount` e `componentDidUpdate` durante essa fase.

A fase de _commit_ é geralmente muito rápida, mas a renderização pode ser devagar. Por essa razão, o futuro `modo concorrente` (que ainda não é habilitado por padrão) quebra a renderização em pedaços, pauzando e resumindo o trabalho para evitar bloquear o navegador. Isso significa que o React pode invocar ciclos de vida da fase de renderização mais de uma vez antes de _commitar_, ou pode ainda invocá-los sem nem _commitar_ (dado um eventual erro ou uma interrupção de maior prioridade).

Os ciclos de vida da fase da renderização incluem os seguintes métodos do componente classe:
* `constructor`
* `componentWillMount` (ou `UNSAFE_componentWillMount`)
* `componentWillReceiveProps` (ou `UNSAFE_componentWillReceiveProps`)
* `componentWillUpdate` (ou `UNSAFE_componentWillUpdate`)
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* `setState` funções atualizadoras (o primeiro argumento)

Já que os métodos acima podem ser chamados mais de uma vez, é importante que eles não contenham efeitos colaterais. Ignorar essa regra pode levar a uma variedade de problemas, incluindo vazamento de memória e estado inválido da aplicação. Infelizmente, pode ser difícil detectar esses problemas, já que eles podem ser [não determinísticos](https://en.wikipedia.org/wiki/Deterministic_algorithm).

O modo estrito não pode detectar automaticamente efeitos colaterais para você, mas pode ajudá-lo a achá-los ao torná-los um pouco mais determinísticos. Isso é feito ao invocar duas vezes seguidas as seguintes funções:

* Os métodos `constructor`, `render` e `shouldComponentUpdate` de componentes classe
* O método estático `getDerivedStateFromProps` de componentes classe
* Corpo de componentes de função
* Funções do atualizador de estado (o primeiro argumento para `setState`)
* Funções passadas para `useState`, `useMemo` ou `useReducer`

> Nota:
>
> Isso só se aplica em modo de desenvolvimento. _Ciclos de vida não serão invocados duas vezes em produção._

Por exemplo, considere o seguinte código:
`embed:strict-mode/side-effects-in-constructor.js`

À primeira vista, este código pode não parecer problemático. Mas se `SharedApplicationState.recordEvent` não for [idempotente](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning), então instanciar este componente múltiplas vezes pode levar a um estado da aplicação inválido. Este tipo de erro pequeno e sutil pode não se manifestar durante o desenvolvimento, ou pode fazê-lo de forma inconsistente e, portanto, ser ignorado.

Ao intencionalmente invocar os métodos de ciclo de vida duas vezes, como o construtor do componente, o modo estrito pode tornar padrões como este mais fácil de localizar.

### Detectar o uso da antiga API de contexto (Context API) {#detecting-legacy-context-api}

A antiga API de contexto era propensa a erros, e será removida em uma futura versão principal (_major version_). Ela ainda funciona para todas versões `16.x`, mas mostrará uma mensagem de aviso no modo estrito: 

![](../images/blog/warn-legacy-context-in-strict-mode.png)

Leia a [documentação da nova API de contexto](/docs/context.html) para ajudá-lo a migrar para a nova versão.
