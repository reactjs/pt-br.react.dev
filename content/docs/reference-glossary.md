---
id: glossary
title: Glossário de Termos React
layout: docs
category: Reference
permalink: docs/glossary.html

---

## Aplicações Single-page {#single-page-application}

Uma aplicação single-page é uma aplicação que carrega uma única página HTML e todos os assets (como JavaScript e CSS) necessários para a aplicação ser executada. Quaisquer interações com a página ou páginas subsequentes não necessitam outras requisições para o servidor, o que significa que a página não é recarregada.

Embora você possa criar uma aplicação single-page com React, isso não é um requisito. React também pode ser usado para melhorar pequenas partes de websites existentes com interações adicionais. Código escrito em React pode coexistir pacificamente com markup renderizado no servidor por PHP, ou com outras bibliotecas client-side. Na verdade, é exatamente assim que o React está sendo usado no Facebook.

## ES6, ES2015, ES2016, etc {#es6-es2015-es2016-etc}

Todas essas siglas referem-se às versões mais recentes do padrão de especificação da linguagem ECMAScript, no qual a linguagem JavaScript é uma implementação. A versão ES6 (também conhecida como ES2015) inclui muitas adições às versões anteriores, tais como: arrow functions, classes, template literals, e declarações `let` e ` const`. Você pode aprender mais sobre versões específicas [aqui](https://en.wikipedia.org/wiki/ECMAScript#Versions).

## Compiladores {#compilers}

Um compilador JavaScript pega o código JavaScript, transforma-o e retorna o código JavaScript em um formato diferente. O caso de uso mais comum é pegar a sintaxe do ES6 e transformá-la na sintaxe que os navegadores mais antigos são capazes de interpretar. [Babel](https://babeljs.io/) é o compilador mais comumente usado com o React.

## Bundlers {#bundlers}

Bundlers usam o código CSS e JavaScript escrito como módulos separados (geralmente centenas deles) e os combinam em alguns arquivos melhor otimizados para os navegadores. Alguns empacotadores comumente usados em aplicativos React incluem [Webpack] (https://webpack.js.org/) e [Browserify] (http://browserify.org/).

## Gerenciadores de Pacotes {#package-managers}

Gerenciadores de pacotes são ferramentas que permitem gerenciar dependências em seu projeto. [npm] (https://www.npmjs.com/) e [Yarn] (https://yarnpkg.com/) são dois gerenciadores de pacotes comumente usados em aplicativos React. Ambos são clientes para o mesmo registro de pacotes npm.

## CDN {#cdn}

CDN significa Content Delivery Network. As CDNs fornecem conteúdo estático e em cache de uma rede de servidores em todo o mundo.

## JSX {#jsx}

JSX é uma extensão de sintaxe para JavaScript. É semelhante a uma linguagem de template, mas com todo o poder do JavaScript. JSX é compilado para chamadas `React.createElement ()` que retornam objetos JavaScript simples chamados "elementos React". Para ter uma introdução básica ao JSX [consulte os documentos aqui](/docs/introduction-jsx.html) e encontre um tutorial mais aprofundado sobre JSX [aqui](/docs/jsx-in-depth.html).

React DOM usa a convenção de nomenclatura de propriedades camelCase em vez dos nomes de atributos HTML. Por exemplo, `tabindex` torna-se `tabIndex` em JSX. O atributo `class` também é escrito como `className`, já que `class` é uma palavra reservada em JavaScript:

```js
const nome = 'Clementine';
ReactDOM.render(
  <h1 className="hello">Meu nome é {nome}!</h1>,
  document.getElementById('root')
);
```

## [Elementos](/docs/rendering-elements.html) {#elements}

Elementos React são os blocos de construção de aplicações React. Pode-se confundir elementos com um conceito mais amplamente conhecido como "componentes". Um elemento descreve o que você quer ver na tela. Elementos React são imutáveis.

```js
const elemento = <h1>Olá, mundo</h1>;
```

Tipicamente, elementos não são usados diretamente, mas são retornados dos componentes.

## [Componentes](/docs/components-and-props.html) {#components}

Componentes React são pequenas peças reusáveis de código que retornam um elemento React para ser renderizado na página. A versão mais simples de um componente React é uma simples função JavaScript que retorna um elemento React:

```js
function BemVindo(props) {
  return <h1>Olá, {props.nome}</h1>;
}
```

Componentes também podem ser ES6 classes:

```js
class BemVindo extends React.Component {
  render() {
    return <h1>Olá, {this.props.nome}</h1>;
  }
}
```

Componentes podem ser quebrados em peças distintas de funcionalidade e usados em outros componentes. Componentes podem retornar outros componentes, arrays, strings e números. Uma regra de ouro é que se parte da sua UI é usada várias vezes (Botão, Painel, Avatar), ou é complexa suficiente (App, FeedStory, Comment), é uma boa candidata para ser um componente reutilisável. Nomes de componentes devem também sempre começar com letra maiúscula (`<Wrapper/>` **ao invés de** `<wrapper/>`). Veja [esta documentação](/docs/components-and-props.html#rendering-a-component) para mais informações sobre renderização de componentes.

### [`props`](/docs/components-and-props.html) {#props}

`props` são entradas dos componentes React. Eles são dados passados por um componente pai para um componente filho.

Lembre que `props` são somente leitura. Eles não devem ser modificados desta forma:

```js
// Wrong!
props.numero = 42;
```

Se você precisar modificar algum valor em resposta a uma entrada do usuário ou a uma resposta da rede, use `state` em vez disso.

### `props.children` {#propschildren}

`props.children` está disponível em todos os componentes. Ele contém o conteúdo entre as tags de abertura e fechamento de um componente. Por exemplo:

```js
<BemVindo>Hello world!</BemVindo>
```

A string `Hello world!` está disponível em `props.children` no componente `BemVindo`:

```js
function BemVindo(props) {
  return <p>{props.children}</p>;
}
```

Para componentes definidos como classes, use `this.props.children`:

```js
class BemVindo extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) {#state}

Um componente precisa de `state` quando algum dado associado com este é alterado com o tempo. Por exemplo, um `Checkbox` componente pode precisar da propriedade `isChecked` no seu estado (_state_), e um componente `NewsFeed` pode querer observar a propriedade `fetchedPosts` do seu estado.

A diferença mais importante entre `state` e `props` é que `props` é passada de um componente pai, mas o `state` é gerenciado pelo próprio componente. Um componente não pode alterar suas `props`, mas pode alterar seu `state`.

Para cada parte específica de dados alterados, deve haver apenas um componente que o "possua" em seu estado. Não tente sincronizar estados de dois componentes diferentes. Em vez disso, [passe-o] (/ docs / lifting-state-up.html) para o seu ancestral compartilhado mais próximo e passe-o para baixo como props para ambos.

## [Métodos de Ciclo de Vida](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

Métodos de ciclo de vida são funcionalidades customizadas que são executadas durante as diferentes fases de um componente. Há métodos disponivéis quando o componente é criado e inserido no DOM ([mounting](/docs/react-component.html#mounting)), quando o componente é atualizado, e quando o componente é desmontado e removido do DOM.

 ## [Controlados](/docs/forms.html#controlled-components) vs. [Componentes Não Controlados](/docs/uncontrolled-components.html)

React tem duas abordagens diferentes para lidar com inputs de formulários.

Um elemento de input de formulário cujo valor é controlado pelo React é chamado de *componente controlado*. Quando o usuário insere dados em um componente controlado o evento que manipula essa alteração é disparado e o seu codigo decide se o input é válido (renderizado com o valor atualizado). Se você não re-renderizar o elemento de formulário permanecerá inalterado.

Um *componente não controlado* funciona como um elemento de formulário fora do React. Quando um usuário insere dados em um campo de formulário (um input box, dropbox, etc) a informação atualizada é refletida sem necessidade do React fazer nada. No entanto, isso também significa que você não pode forçar o campo a ter um certo valor.

Na maioria dos casos você deve usar componentes controlados.

## [Keys](/docs/lists-and-keys.html) {#keys}

Uma "key" (chave) é um atributo de string especial que você precisa incluir quando estiver criando arrays de elementos. Chaves ajudam o React a identificar quais items foram alterados, quais foram adicionados, ou quais foram removidos. Chaves devem ser dadas a elementos em um array para dar a estes elementos uma identidade estável.

As chaves precisam ser únicas entre os elementos de um mesmo array. Eles não precisam ser exclusivos em toda a aplicação ou até mesmo em um único componente.

Não passe algo como `Math.random()` para as chaves. É importante que as chaves tenham uma "identidade estável" em re-renderizações para que o React possa determinar quando os items são adicionados, removidos, ou re-ordenados. Idealmente, chaves devem corresponder a identificadores únicos e estáveis vindos dos seus dados, como `post.id`.

## [Refs](/docs/refs-and-the-dom.html) {#refs}

React suporta um atributo especial que você pode adicionar a qualquer componente. O atributo `ref` pode ser um objeto criado por [`React.createRef()` function](/docs/react-api.html#reactcreateref) ou uma função callback, ou uma string (em APIs legadas). Quando o atributo `ref` é uma função callback, a função recebe o elemento DOM subjacente ou uma instancia de classe (dependendo do tipo de elemento) como argumento. Isso permite você ter acesso direto ao elemento DOM ou a instância do componente.

Use refs com moderação. Se você se encontrar usando refs frequentemente para "fazer as coisas acontecerem" na sua aplicação, considere se familiarizar com [top-down data flow](/docs/lifting-state-up.html).

## [Eventos](/docs/handling-events.html) {#events}

Manipular eventos com elementos React tem algumas diferenças sintáticas:

* Manipuladores de eventos React usam camelCase, em vez de lowercase.
* Com JSX você passa uma função como manipulador de evento, em vez de uma string.

## [Reconciliação](/docs/reconciliation.html) {#reconciliation}

Quando as props ou state de um componente são alterados, o React decide quando uma atualização do DOM é necessária comparando o novo elemento retornado com o anterior renderizado. Quando eles não são iguais, React atualiza o DOM. Este processo é chamado de "reconciliação".
