---
id: context
title: Context
permalink: docs/context.html
---

Contexto (context) disponibiliza uma forma de passar dados entre a árvore de componentes sem precisar passar props manualmente em cada nível.

Em uma aplicação típica do React, os dados são passados de cima para baixo (de pai para filho) via props. Mas isso pode dar um pouco de trabalho em certos tipos de props (como preferências locais ou tema de UI), que são utilizadas por muitos componentes dentro da aplicação. Contexto (context) fornece a forma de compartilhar dados como esses, entre todos componentes da mesma árvore de componentes, sem precisar passar explicitamente props entre cada nível.

- [Quando Usar Contexto](#when-to-use-context)
- [Antes de você usar Contexto](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
  - [Context.displayName](#contextdisplayname)
- [Exemplos](#examples)
  - [Contexto Dinâmico](#dynamic-context)
  - [Atualizando o Contexto de um componente aninhado](#updating-context-from-a-nested-component)
  - [Consumindo vários Contextos](#consuming-multiple-contexts)
- [Ressalvas](#caveats)
- [API Legada](#legacy-api)

## Quando Usar Contexto {#when-to-use-context}

Contexto (context) é indicado para compartilhar dados que podem ser considerados "globais" para a árvore de componentes do React. Usuário autenticado ou o idioma preferido, são alguns casos comuns. No exemplo do código a seguir, nós passamos um tema para a fim de estilizar o componente Button.

`embed:context/motivation-problem.js`

Usando contexto, nós podemos evitar passar prop através de elementos intermediários.

`embed:context/motivation-solution.js`

## Antes de você usar Contexto {#before-you-use-context}

Contexto (context) é usado principalmente quando algum dado precisa ser acessado por *muitos* componentes em diferentes níveis. Use contexto moderadamente uma vez que isto pode dificultar a reutilização de componentes.

**Se você apenas quer evitar passar algumas props por muitos níveis, [composição de componente](/docs/composition-vs-inheritance.html) geralmente é uma solução mais simples que Contexto (context).**

Considere por exemplo o componente `Page` que passa as props `user` e `avatarSize` por vários níveis abaixo de modo que os componentes `Link` e `Avatar` profundamente aninhados, podem ler essas props.

```js
<Page user={user} avatarSize={avatarSize} />
// ... que renderiza ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... que renderiza ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... que renderiza ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

Pode parecer redundante passar para baixo as props `user` e `avatarSize` através de vários níveis se no final apenas o componente `Avatar` realmente precisa usa-las. Além disso, é incômodo sempre que o componente `Avatar` precisar de mais props do topo, você também precisar adicionar todas elas por todos os níveis intermediários.

Uma forma de resolver este problema **sem contexto** é [atribuir o próprio componente Avatar a uma prop do componente Page](/docs/composition-vs-inheritance.html#containment), assim os componentes intermediários não precisam saber sobre a prop `user` ou o `avatarSize`:

```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// Agora temos:
<Page user={user} avatarSize={avatarSize} />
// ... que renderiza ...
<PageLayout userLink={...} />
// ... que renderiza ...
<NavigationBar userLink={...} />
// ... que renderiza ...
{props.userLink}
```

Com esta mudança, apenas o componente `Page` do topo precisa saber sobre os componentes `Link` e `Avatar` e das props `user` e `avatarSize`.

Esta *inversão de controle* pode fazer seu código mais limpo em vários casos, reduzindo a quantidade de props que você precisa passar através da sua aplicação e dando mais controle para os componentes raíz. No entanto, esta não é a melhor escolha em todos casos. Mover mais complexibilidade para o topo da árvore, faz com que estes componentes fiquem mais complicados e forçando os componentes dos níveis mais abaixo ficarem mais flexíveis do que você gostaria.

Você não está limitado a um único filho por componente, Você pode passar vários componentes filhos ou até mesmo ter vários *slots* de componentes filhos [como documentado aqui](/docs/composition-vs-inheritance.html#containment):

```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

Este padrão é suficiente para vários casos onde você precisa separar um componente filho de seu pai imediato. Você pode ainda ir mais longe com [render props](/docs/render-props.html) se o filho precisa se comunicar com o pai antes de ser renderizado.

Contudo, às vezes o mesmo dado precisa ser acessado por vários componentes na árvore e em diferentes níveis de aninhamento. Contexto (context) deixa você "transmitir" este dado e mudanças do mesmo para todos componentes abaixo. Exemplos comuns onde usar contexto pode ser mais simples que as alternativas incluem o gerenciamento de localização atual, tema, ou um dado em cache.

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Cria um objeto Contexto (context). Quando o React renderiza um componente que assina este objeto Contexto (context), este vai ler o valor atual do `Provider` superior na árvore que estiver mais próximo.

O argumento `defaultValue` (valor padrão) é usado *apenas* quando o componente não corresponder com um `Provider` acima dele na árvore. Isso pode ser útil para testar componentes isolados sem envolve-los com outro componente. Observação: passando `undefined` como um valor de Provider não faz com que os componentes consumidores do Provider usem `defaultValue`.

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* some value */}>
```

Cada objeto Contexto (context) vem com um componente Provider que permite componentes consumidores a assinarem mudanças no contexto.

Aceita uma prop `value` que pode ser passada para ser consumida por componentes que são descendentes deste Provider. Um Provider pode ser conectado a vários consumidores. Providers podem ser aninhados para substituir valores mais ao fundo da árvore.

Todos consumidores que são descendentes de um Provider serão renderizados novamente sempre que a prop `value` do Provider for alterada. A propagação do Provider aos seus descendentes (incluido [`.contextType`](#classcontexttype) e [`useContext`](/docs/hooks-reference.html#usecontext)), não está condicionada ao método `shouldComponenteUpdate`, logo, o consumidor é atualizado mesmo quando um componente antepassado ignora uma atualização.

Mudanças são determinadas comparando os valores novos com os anteriores usando o mesmo algoritimo de [`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).

> Nota
>
> A forma como as mudanças são determinadas, podem causar alguns problemas quando se atribui objetos como `value`: veja [Ressalvas](#caveats)

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* faz um side-effect na montagem utilizando o valor de MyContext */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* renderiza algo com base no valor de MyContext */
  }
}
MyClass.contextType = MyContext;
```

A propriedade `contextType` pode ser atribuída a um objeto Contexto (Context) criado por [`React.createContext()`](#reactcreatecontext). Isso permite você consumir o valor atual mais próximo deste tipo de contexto usando `this.context`. Você pode referencia-lo em qualquer momento nos métodos de ciclo-de-vida, incluindo a função `render`.

> Nota:
>
> Você pode assinar apenas um contexto usando esta API. Se você precisa ler mais de um contexto, veja [Consumindo vários Contextos](#consuming-multiple-contexts).
>
> Se você está usando o recurso experimental [public class fields syntax](https://babeljs.io/docs/plugins/transform-class-properties/), você pode usar um campo **estático** da classe para inicializar o seu `contextType`.



```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* renderiza algo baseado no valor */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* renderiza algo baseado no valor do context */}
</MyContext.Consumer>
```

Um componente React que assina mudanças de contexto. Este permite você assinar a um contexto por um [function component](/docs/components-and-props.html#function-and-class-components).

Requer uma [*function as a child*](/docs/render-props.html#using-props-other-than-render). A função recebe o valor atual do contexto e retorna um nó React. O argumento `value` passado para a função será igual ao `value` da prop do Provider do contexto mais próximo acíma na árvore. Se não houver um Provider para este contexto acima, o argumento `value` será igual a `defaultValue` que foi passado ao criar o contexto com `createContext()`.

> Nota
>
> Para mais informações sobre o padrão *"function as a child"* veja, [render props](/docs/render-props.html).

### `Context.displayName` {#contextdisplayname}

O objeto Context aceita uma propriedade string `displayName`. React DevTools usa essa string para determinar o que exibir para o contexto.

Por exemplo, o seguinte componente aparecerá como MyDisplayName no DevTools:

```js{2}
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" in DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
```

## Exemplos {#examples}

### Contexto Dinâmico {#dynamic-context}

Um exemplo mais complexo com valores dinâmicos para o tema:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### Atualizando o Contexto de um componente aninhado {#updating-context-from-a-nested-component}

Geralmente é necessário atualizar o contexto de um componente que está aninhado em algum lugar da árvore de componentes. Neste caso, você pode passar uma função para o contexto, permitindo assim que consumidores possam atualizar o contexto.

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### Consumindo vários Contextos {#consuming-multiple-contexts}

Para que o contexto possa continuar renderizando rapidamente, o React precisa manter cada consumidor de contexto separado em um nó da árvore.

`embed:context/multiple-contexts.js`

Se dois ou mais valores de contexto são utilizados juntos com frequência, você pode considerar criar o seu próprio _render prop_.

> Nota
>
> Para mais informações sobre render prop, veja [render props](/docs/render-props.html).

## Ressalvas {#caveats}

Contexto (context) usa referência de identidade para determinar quando renderizar novamente, por este motivo, existem alguns casos que podem desencadear renderizações não intencionais em consumidores quando algum componente que antecede um Provider é renderizados. Por exemplo, o código abaixo vai re-renderizar todos consumidores toda vez que o Provider re-renderizar porque um novo objeto é sempre criado para `value`:

`embed:context/reference-caveats-problem.js`

Para contornar isso, mova a prop `value` para o state do nível antecessor.

`embed:context/reference-caveats-solution.js`

## API Legada {#legacy-api}

> Nota
>
> Versões anteriores do React foram disponibilizadas com uma versão experimental do context API. Esta versão antiga da API será suportada em todas versões 16.x lançadas mas, aplicações utilizando esta API, devem migrar para a nova versão. [Leia aqui em API Legada](/docs/legacy-context.html).
