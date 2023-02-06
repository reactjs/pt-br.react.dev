---
id: strict-mode
title: Modo Estrito (Strict Mode)
permalink: docs/strict-mode.html
---

<<<<<<< HEAD
O modo estrito (`Strict Mode`) é uma ferramenta para sinalizar potenciais problemas em uma aplicação. Assim como o `Fragment`, o `StrictMode` não renderiza nenhum elemento visível na interface. Ele ativa, no entanto, verificações e avisos adicionais para os seus descendentes.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [`StrictMode`](https://beta.reactjs.org/reference/react/StrictMode)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


`StrictMode` is a tool for highlighting potential problems in an application. Like `Fragment`, `StrictMode` does not render any visible UI. It activates additional checks and warnings for its descendants.
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

> Nota:
>
> Verificações do modo estrito são executadas somente em modo de desenvolvimento; _elas não impactam na build de produção_.

Você pode habilitar o modo estrito para qualquer parte da sua aplicação, por exemplo:
`embed:strict-mode/enabling-strict-mode.js`

No exemplo acima, as verificações do modo estrito *não* serão executadas nos componentes `Header` e `Footer`. No entanto, `ComponentOne` e `ComponentTwo`, assim como todos os seus componentes descendentes, serão verificados.

`StrictMode` atualmente ajuda com:
* [Identificando componentes com ciclos de vida inseguros](#identifying-unsafe-lifecycles)
* [Aviso sobre o uso da API de referência de string legada](#warning-about-legacy-string-ref-api-usage)
* [Aviso sobre uso obsoleto de findDOMNode](#warning-about-deprecated-finddomnode-usage)
* [Detectando efeitos colaterais inesperados](#detecting-unexpected-side-effects)
* [Detecting legacy context API](#detecting-legacy-context-api)
* [Garantindo o estado reutilizável](#garantindo-reusable-state)

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

A fase de _commit_ é geralmente muito rápida, mas a renderização pode ser devagar. Por essa razão, o futuro `modo concorrente` (que ainda não é habilitado por padrão) quebra a renderização em pedaços, pausando e resumindo o trabalho para evitar bloquear o navegador. Isso significa que o React pode invocar ciclos de vida da fase de renderização mais de uma vez antes de _commitar_, ou pode ainda invocá-los sem nem _commitar_ (dado um eventual erro ou uma interrupção de maior prioridade).

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

> Nota:
>
> No React 17, o React modifica automaticamente os métodos do console como `console.log()` para silenciar os logs na segunda chamada para funções de ciclo de vida. No entanto, pode causar um comportamento indesejado em certos casos em que [uma solução alternativa pode ser usada](https://github.com/facebook/react/issues/20090#issuecomment-715927125).
>
> A partir do React 18, o React não suprime nenhum log. No entanto, se você tiver o React DevTools instalado, os logs da segunda chamada aparecerão ligeiramente esmaecidos. O React DevTools também oferece uma configuração (desativada por padrão) para suprimi-los completamente.

### Detectar o uso da antiga API de contexto (Context API) {#detecting-legacy-context-api}

A antiga API de contexto era propensa a erros, e será removida em uma futura versão principal (_major version_). Ela ainda funciona para todas versões `16.x`, mas mostrará uma mensagem de aviso no modo estrito: 

![](../images/blog/warn-legacy-context-in-strict-mode.png)

Leia a [nova documentação da API de contexto](/docs/context.html) para ajudar a migrar para a nova versão.


### Garantindo o estado reutilizável {#ensuring-reusable-state}

No futuro, gostaríamos de adicionar um recurso que permita ao React adicionar e remover seções da interface do usuário enquanto preserva o estado. Por exemplo, quando um usuário sai de uma tela e volta, o React deve ser capaz de mostrar imediatamente a tela anterior. Para fazer isso, o React oferecerá suporte à remontagem de árvores usando o mesmo estado de componente usado antes da desmontagem.

Esse recurso dará ao React um melhor desempenho pronto para uso, mas requer que os componentes sejam resistentes a efeitos sendo montados e destruídos várias vezes. A maioria dos efeitos funcionará sem nenhuma alteração, mas alguns efeitos não limpam adequadamente as assinaturas no callback de destruição ou assumem implicitamente que são montados ou destruídos apenas uma vez.

Para ajudar a resolver esses problemas, o React 18 apresenta uma nova verificação somente de desenvolvimento para o Strict Mode. Essa nova verificação desmontará e remontará automaticamente cada componente, sempre que um componente for montado pela primeira vez, restaurando o estado anterior na segunda montagem.

Para demonstrar o comportamento de desenvolvimento que você verá no Strict Mode com esse recurso, considere o que acontece quando o React monta um novo componente. Sem essa alteração, quando um componente é montado, o React cria os efeitos:

```
* React monta o componente.
  * Efeitos de layout são criados.
  * Efeitos são criados.
```

Com o Strict Mode começando no React 18, sempre que um componente é montado em desenvolvimento, o React simulará imediatamente a desmontagem e remontagem do componente:

```
* React monta o componente.
    * Efeitos de layout são criados.
    * Efeitos são criados.
* React simula efeitos sendo destruídos em um componente montado.
    * Efeitos de layout são destruídos.
    * Os efeitos são destruídos.
* React simula efeitos sendo recriados em um componente montado.
    * Efeitos de layout são criados
    * O código de configuração do efeito é executado
```

Na segunda montagem, o React restaurará o estado da primeira montagem. Esse recurso simula o comportamento do usuário, como um usuário saindo de uma tela e voltando, garantindo que o código lidará adequadamente com a restauração do estado.

Quando o componente desmonta, os efeitos são destruídos normalmente:

```
* React desmonta o componente.
  * Efeitos de layout são destruídos.
  * Os efeitos são destruídos.
```

A desmontagem e remontagem incluem:

- `componentDidMount`
- `componentWillUnmount`
- `useEffect`
- `useLayoutEffect`
- `useInsertionEffect`

> Nota:
>
> Isso só se aplica ao modo de desenvolvimento, _comportamento de produção inalterado_.

Para obter ajuda com problemas comuns, consulte:
  - [Como oferecer suporte ao estado reutilizável em efeitos](https://github.com/reactwg/react-18/discussions/18)
