---
title: "Guia de Upgrade do React 19"
author: Ricky Hanlon
date: 2024/04/25
description: As melhorias adicionadas ao React 19 exigem algumas mudanças radicais, mas trabalhamos para tornar o upgrade o mais tranquilo possível e não esperamos que as mudanças afetem a maioria dos apps. Neste post, vamos guiá-lo pelas etapas para atualizar apps e bibliotecas para o React 19.
---

25 de abril de 2024 por [Ricky Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

As melhorias adicionadas ao React 19 exigem algumas mudanças radicais, mas trabalhamos para tornar o upgrade o mais tranquilo possível e não esperamos que as mudanças afetem a maioria dos apps.

</Intro>

<Note>

#### React 18.3 também foi publicado {/*react-18-3*/}

Para ajudar a facilitar o upgrade para o React 19, publicamos uma versão `react@18.3` que é idêntica à 18.2, mas adiciona avisos para APIs descontinuadas e outras mudanças que são necessárias para o React 19.

Recomendamos que você atualize para o React 18.3 primeiro para ajudar a identificar quaisquer problemas antes de atualizar para o React 19.

Para obter uma lista de alterações no 18.3, consulte as [Notas da versão](https://github.com/facebook/react/blob/main/CHANGELOG.md).

</Note>

Neste post, vamos guiá-lo pelas etapas para o upgrade para o React 19:

- [Instalação](#installing)
- [Codemods](#codemods)
- [Breaking changes](#breaking-changes)
- [Novas descontinuações](#new-deprecations)
- [Mudanças notáveis](#notable-changes)
- [Mudanças no TypeScript](#typescript-changes)
- [Changelog](#changelog)

Se você quiser nos ajudar a testar o React 19, siga as etapas neste guia de upgrade e [relate quaisquer problemas](https://github.com/facebook/react/issues/new?assignees=&labels=React+19&projects=&template=19.md&title=%5BReact+19%5D) que encontrar. Para obter uma lista de novos recursos adicionados ao React 19, consulte o [post de lançamento do React 19](/blog/2024/12/05/react-19).

---
## Instalação {/*installing*/}

<Note>

#### A nova Transformação JSX agora é obrigatória {/*new-jsx-transform-is-now-required*/}

Apresentamos uma [nova transformação JSX](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) em 2020 para melhorar o tamanho do bundle e usar o JSX sem importar o React. No React 19, estamos adicionando melhorias adicionais, como usar ref como uma prop e melhorias de velocidade do JSX que exigem a nova transformação.

Se a nova transformação não estiver habilitada, você verá este aviso:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Seu app (ou uma de suas dependências) está usando uma transformação JSX desatualizada. Atualize para a transformação JSX moderna para obter desempenho mais rápido: https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>

Esperamos que a maioria dos apps não seja afetada, pois a transformação já está habilitada na maioria dos ambientes. Para obter instruções manuais sobre como atualizar, consulte o [post de anúncio](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

</Note>

Para instalar a versão mais recente do React e React DOM:

```bash
npm install --save-exact react@^19.0.0 react-dom@^19.0.0
```

Ou, se você estiver usando Yarn:

```bash
yarn add --exact react@^19.0.0 react-dom@^19.0.0
```

Se você estiver usando TypeScript, também precisará atualizar os types.
```bash
npm install --save-exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

Ou, se você estiver usando Yarn:
```bash
yarn add --exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

Também estamos incluindo um codemod para as substituições mais comuns. Consulte [Mudanças no TypeScript](#typescript-changes) abaixo.

## Codemods {/*codemods*/}

Para ajudar com o upgrade, trabalhamos com a equipe do [codemod.com](https://codemod.com) para publicar codemods que atualizarão automaticamente seu código para muitas das novas APIs e padrões no React 19.

Todos os codemods estão disponíveis no repositório [`react-codemod`](https://github.com/reactjs/react-codemod) e a equipe do Codemod se juntou para ajudar a manter os codemods. Para executar esses codemods, recomendamos usar o comando `codemod` em vez de  `react-codemod` porque ele é executado mais rápido, lida com migrações de código mais complexas e oferece melhor suporte para TypeScript.

<Note>

#### Execute todos os codemods do React 19 {/*run-all-react-19-codemods*/}

Execute todos os codemods listados neste guia com a receita `codemod` do React 19:

```bash
npx codemod@latest react/19/migration-recipe
```

Isso executará os seguintes codemods de `react-codemod`:
- [`replace-reactdom-render`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-reactdom-render) 
- [`replace-string-ref`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-string-ref)
- [`replace-act-import`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-act-import)
- [`replace-use-form-state`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-use-form-state) 
- [`prop-types-typescript`](https://codemod.com/registry/react-prop-types-typescript)

Isso não inclui as mudanças do TypeScript. Consulte [Mudanças no TypeScript](#typescript-changes) abaixo.

</Note>

As mudanças que incluem um codemod incluem o comando abaixo.

Para obter uma lista de todos os codemods disponíveis, consulte o repositório [`react-codemod`](https://github.com/reactjs/react-codemod).

## Breaking changes {/*breaking-changes*/}

### Erros em render não são lançados novamente {/*errors-in-render-are-not-re-thrown*/}

Em versões anteriores do React, os erros lançados durante o render eram capturados e lançados novamente. Em DEV, também registraríamos no `console.error`, resultando em logs de erros duplicados.

No React 19, [melhoramos a forma como os erros são tratados](/blog/2024/04/25/react-19#error-handling) para reduzir a duplicação, não lançando novamente:

- **Erros não detectados**: Os erros que não são detectados por limites de erro são relatados para `window.reportError`.
- **Erros detectados: Os erros que são detectados por limites de erro são relatados para `console.error`.

Esta mudança não deve afetar a maioria dos apps, mas se seu relatório de erros de produção depender de erros sendo lançados novamente, você pode precisar atualizar o tratamento de erros. Para dar suporte a isso, adicionamos novos métodos a `createRoot` e `hydrateRoot` para tratamento de erros personalizado:

```js [[1, 2, "onUncaughtError"], [2, 5, "onCaughtError"]]
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // ... log error report
  },
  onCaughtError: (error, errorInfo) => {
    // ... log error report
  }
});
```

Para obter mais informações, consulte a documentação para [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) e [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot).

### APIs React descontinuadas removidas {/*removed-deprecated-react-apis*/}

#### Removido: `propTypes` e `defaultProps` para funções {/*removed-proptypes-and-defaultprops*/}
`PropTypes` foram descontinuados em [Abril de 2017 (v15.5.0)](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings).

No React 19, estamos removendo as verificações `propType` do pacote React, e seu uso será silenciosamente ignorado. Se você estiver usando `propTypes`, recomendamos migrar para TypeScript ou outra solução de verificação de tipo.

Também estamos removendo `defaultProps` de componentes de função em vez de parâmetros padrão ES6. Componentes de classe continuarão a dar suporte a `defaultProps` , pois não há alternativa ES6.

```js
// Antes
import PropTypes from 'prop-types';

function Heading({text}) {
  return <h1>{text}</h1>;
}
Heading.propTypes = {
  text: PropTypes.string,
};
Heading.defaultProps = {
  text: 'Hello, world!',
};
```
```ts
// Depois
interface Props {
  text?: string;
}
function Heading({text = 'Hello, world!'}: Props) {
  return <h1>{text}</h1>;
}
```

<Note>

Codemod `propTypes` para TypeScript com:

```bash
npx codemod@latest react/prop-types-typescript
```

</Note>

#### Removido: Contexto Legado usando `contextTypes` e `getChildContext` {/*removed-removing-legacy-context*/}

O Contexto Legado foi descontinuado em [Outubro de 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html).

O Contexto Legado só estava disponível em componentes de classe usando as APIs `contextTypes` e `getChildContext`, e foi substituído por `contextType` devido a bugs sutis que eram fáceis de ignorar. No React 19, estamos removendo o Contexto Legado para tornar o React um pouco menor e mais rápido.

Se você ainda estiver usando o Contexto Legado em componentes de classe, precisará migrar para a nova API `contextType`:

```js {5-11,19-21}
// Antes
import PropTypes from 'prop-types';

class Parent extends React.Component {
  static childContextTypes = {
    foo: PropTypes.string.isRequired,
  };

  getChildContext() {
    return { foo: 'bar' };
  }

  render() {
    return <Child />;
  }
}

class Child extends React.Component {
  static contextTypes = {
    foo: PropTypes.string.isRequired,
  };

  render() {
    return <div>{this.context.foo}</div>;
  }
}
```

```js {2,7,9,15}
// Depois
const FooContext = React.createContext();

class Parent extends React.Component {
  render() {
    return (
      <FooContext value='bar'>
        <Child />
      </FooContext>
    );
  }
}

class Child extends React.Component {
  static contextType = FooContext;

  render() {
    return <div>{this.context}</div>;
  }
}
```

#### Removido: refs de string {/*removed-string-refs*/}

Refs de string foram descontinuados em [Março de 2018 (v16.3.0)](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html).

Componentes de classe suportavam refs de string antes de serem substituídos por ref callbacks devido a [múltiplas desvantagens](https://github.com/facebook/react/issues/1373). No React 19, estamos removendo refs de string para tornar o React mais simples e fácil de entender.

Se você ainda estiver usando refs de string em componentes de classe, precisará migrar para ref callbacks:

```js {4,8}
// Antes
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.input.focus();
  }

  render() {
    return <input ref='input' />;
  }
}
```

```js {4,8}
// Depois
class MyComponent extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    return <input ref={input => this.input = input} />;
  }
}
```

<Note>

Codemod refs de string com `ref` callbacks:

```bash
npx codemod@latest react/19/replace-string-ref
```

</Note>

#### Removido: factories de padrão de módulo {/*removed-module-pattern-factories*/}

Factories de padrão de módulo foram descontinuadas em [Agosto de 2019 (v16.9.0)](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories).

Este padrão raramente era usado e dar suporte a ele faz com que o React seja ligeiramente maior e mais lento do que o necessário. No React 19, estamos removendo o suporte para factories de padrão  de módulo, e você precisará migrar para funções regulares:

```js
// Antes
function FactoryComponent() {
  return { render() { return <div />; } }
}
```

```js
// Depois
function FactoryComponent() {
  return <div />;
}
```

#### Removido: `React.createFactory` {/*removed-createfactory*/}

`createFactory` foi descontinuado em [Fevereiro de 2020 (v16.13.0)](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory).

Usar `createFactory` era comum antes do suporte amplo para JSX, mas é raramente usado hoje em dia e pode ser substituído por JSX. No React 19, estamos removendo `createFactory`, e você precisará migrar para JSX:

```js
// Antes
import { createFactory } from 'react';

const button = createFactory('button');
```

```js
// Depois
const button = <button />;
```

#### Removido: `react-test-renderer/shallow` {/*removed-react-test-renderer-shallow*/}

No React 18, atualizamos `react-test-renderer/shallow` para reexportar [react-shallow-renderer](https://github.com/enzymejs/react-shallow-renderer). No React 19, estamos removendo `react-test-render/shallow` para preferir a instalação direta do pacote:

```bash
npm install react-shallow-renderer --save-dev
```
```diff
- import ShallowRenderer from 'react-test-renderer/shallow';
+ import ShallowRenderer from 'react-shallow-renderer';
```

<Note>

##### Por favor, reconsidere o renderização raso {/*please-reconsider-shallow-rendering*/}

A renderização rasa depende dos detalhes internos do React e pode impedi-lo de upgrades futuros. Recomendamos migrar seus testes para  [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) ou [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro).

</Note>

### APIs React DOM descontinuadas removidas {/*removed-deprecated-react-dom-apis*/}

#### Removido: `react-dom/test-utils` {/*removed-react-dom-test-utils*/}

Movemos `act` de `react-dom/test-utils` para o pacote `react`:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

`ReactDOMTestUtils.act` foi descontinuado em favor de `React.act`. Importe `act` de `react` em vez de `react-dom/test-utils`. Consulte https://react.dev/warnings/react-dom-test-utils para obter mais informações.

</ConsoleLogLine>

</ConsoleBlockMulti>

Para corrigir este aviso, você pode importar `act` de `react`:

```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

Todas as outras funções `test-utils` foram removidas. Essas utilidades eram incomuns e tornavam muito fácil depender de detalhes de implementação de baixo nível de seus componentes e do React. No React 19, essas funções darão erro quando chamadas e suas exportações serão removidas em uma versão futura.

Consulte a [página de aviso](https://react.dev/warnings/react-dom-test-utils) para obter alternativas.

<Note>

Codemod de `ReactDOMTestUtils.act` para `React.act`:

```bash
npx codemod@latest react/19/replace-act-import
```

</Note>

#### Removido: `ReactDOM.render` {/*removed-reactdom-render*/}

`ReactDOM.render` foi descontinuado em [Março de 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). No React 19, estamos removendo `ReactDOM.render`, e você precisará migrar para usar [`ReactDOM.createRoot`](https://react.dev/reference/react-dom/client/createRoot):

```js
// Antes
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// Depois
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

<Note>

Codemod de `ReactDOM.render` para `ReactDOMClient.createRoot`:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Removido: `ReactDOM.hydrate` {/*removed-reactdom-hydrate*/}

`ReactDOM.hydrate` foi descontinuado em [Março de 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). No React 19, estamos removendo `ReactDOM.hydrate`, e você precisará migrar para usar [`ReactDOM.hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot),

```js
// Antes
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// Depois
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

<Note>

Codemod de `ReactDOM.hydrate` para `ReactDOMClient.hydrateRoot`:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Removido: `unmountComponentAtNode` {/*removed-unmountcomponentatnode*/}

`ReactDOM.unmountComponentAtNode` foi descontinuado em [Março de 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). No React 19, você precisará migrar para usar `root.unmount()`.

```js
// Antes
unmountComponentAtNode(document.getElementById('root'));

// Depois
root.unmount();
``````
For more see `root.unmount()` for [`createRoot`](https://react.dev/reference/react-dom/client/createRoot#root-unmount) and [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot#root-unmount).

<Note>

Codemod `unmountComponentAtNode` to `root.unmount`:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Removido: `ReactDOM.findDOMNode` {/*removed-reactdom-finddomnode*/}

`ReactDOM.findDOMNode` foi [descontinuado em Outubro de 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode).

Estamos removendo `findDOMNode` porque era uma exceção legada que era lenta para executar, frágil para refatorar, só retornava o primeiro filho e quebrava os níveis de abstração (veja mais [aqui](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)). Você pode substituir `ReactDOM.findDOMNode` com [refs do DOM](/learn/manipulating-the-dom-with-refs):

```js
// Antes
import {findDOMNode} from 'react-dom';

function AutoselectingInput() {
  useEffect(() => {
    const input = findDOMNode(this);
    input.select()
  }, []);

  return <input defaultValue="Hello" />;
}
```

```js
// Depois
function AutoselectingInput() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.select();
  }, []);

  return <input ref={ref} defaultValue="Hello" />
}
```

## Novas descontinuações {/*new-deprecations*/}

### Descontinuado: `element.ref` {/*deprecated-element-ref*/}

React 19 suporta [`ref` como uma prop](/blog/2024/04/25/react-19#ref-as-a-prop), então estamos descontinuando o `element.ref` em favor de `element.props.ref`.

Acessar `element.ref` irá avisar:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Acessar element.ref não é mais suportado. ref agora é uma prop normal. Ele será removido do tipo Elemento JSX em uma versão futura.

</ConsoleLogLine>

</ConsoleBlockMulti>

### Descontinuado: `react-test-renderer` {/*deprecated-react-test-renderer*/}

Estamos descontinuando `react-test-renderer` pois ele implementa seu próprio ambiente de renderização que não corresponde ao ambiente que os usuários usam, promove detalhes de implementação de teste e depende da introspecção dos detalhes internos do React.

O renderizador de teste foi criado antes que houvesse estratégias de teste mais viáveis ​​disponíveis, como [React Testing Library](https://testing-library.com), e agora recomendamos o uso de uma biblioteca de teste moderna em vez disso.

No React 19, `react-test-renderer` registra um aviso de descontinuação e mudou para renderização concorrente. Recomendamos migrar seus testes para [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) ou [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro) para uma experiência de teste moderna e bem suportada.

## Mudanças notáveis {/*notable-changes*/}

### Mudanças no StrictMode {/*strict-mode-improvements*/}

React 19 inclui várias correções e melhorias no Strict Mode.

Ao renderizar duas vezes no Strict Mode em desenvolvimento, `useMemo` e `useCallback` reutilizarão os resultados memorizados da primeira renderização durante a segunda renderização. Componentes que já são compatíveis com o Strict Mode não devem notar uma diferença no comportamento.

Como acontece com todos os comportamentos do Strict Mode, esses recursos são projetados para revelar proativamente erros em seus componentes durante o desenvolvimento para que você possa corrigi-los antes de serem enviados para produção. Por exemplo, durante o desenvolvimento, o Strict Mode irá invocar duas vezes as funções de callback de ref na montagem inicial, para simular o que acontece quando um componente montado é substituído por um fallback de Suspense.

### Melhorias no Suspense {/*improvements-to-suspense*/}

No React 19, quando um componente suspende, o React irá commitar imediatamente o fallback do limite de Suspense mais próximo sem esperar que toda a árvore de irmãos seja renderizada. Depois que o fallback fizer o commit, o React agenda outra renderização para os irmãos suspensos para "pré-aquecer" as requisições lazy no resto da árvore:

<Diagram name="prerender" height={162} width={1270} alt="Diagrama mostrando uma árvore de três componentes, um pai rotulado de Accordion (Acordeão) e dois filhos rotulados de Panel (Painel). Ambos os componentes Panel contêm isActive com valor false." >

Anteriormente, quando um componente suspendia, os irmãos suspensos eram renderizados e então o fallback era commited.

</Diagram>

<Diagram name="prewarm" height={162} width={1270} alt="O mesmo diagrama do anterior, com o isActive do primeiro componente filho Panel evidenciado, indicando um clique com o valor isActive definido como true. O segundo componente Panel ainda contém o valor false." >

No React 19, quando um componente suspende, o fallback é commited e então os irmãos suspensos são renderizados.

</Diagram>

Essa mudança significa que os fallbacks do Suspense exibem mais rapidamente, enquanto ainda aquecem as requisições lazy na árvore suspensa.

### Builds UMD removidos {/*umd-builds-removed*/}

UMD foi amplamente utilizado no passado como uma maneira conveniente de carregar o React sem uma etapa de build. Agora, existem alternativas modernas para carregar módulos como scripts em documentos HTML. Começando com o React 19, o React não produzirá mais builds UMD para reduzir a complexidade de seu processo de teste e lançamento.

Para carregar o React 19 com uma tag de script, recomendamos o uso de um CDN baseado em ESM, como [esm.sh](https://esm.sh/).

```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  ...
</script>
```

### Bibliotecas que dependem de internos do React podem bloquear atualizações {/*libraries-depending-on-react-internals-may-block-upgrades*/}

Esta versão inclui alterações nos internos do React que podem impactar bibliotecas que ignoram nossos apelos para não usar internos como `SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`. Essas mudanças são necessárias para obter melhorias no React 19 e não quebrarão bibliotecas que seguem nossas diretrizes.

Com base em nossa [Política de Versionamento](https://react.dev/community/versioning-policy#what-counts-as-a-breaking-change), essas atualizações não estão listadas como breaking changes e não estamos incluindo documentos sobre como atualizá-las. A recomendação é remover qualquer código que dependa de internos.

Para refletir o impacto do uso de internos, renomeamos o sufixo `SECRET_INTERNALS`:

`_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`

No futuro, bloquearemos com mais agressividade o acesso aos internos do React para desencorajar o uso e garantir que os usuários não sejam impedidos de fazer o upgrade.

## Mudanças no TypeScript {/*typescript-changes*/}

### Tipos TypeScript descontinuados removidos {/*removed-deprecated-typescript-types*/}

Limpeza dos tipos TypeScript com base nas APIs removidas no React 19. Alguns dos removidos tiveram os tipos movidos para pacotes mais relevantes, e outros não são mais necessários para descrever o comportamento do React.

<Note>
Publicamos [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/) para migrar a maioria das alterações de quebra relacionadas a tipos:

```bash
npx types-react-codemod@latest preset-19 ./path-to-app
```

Se você tiver muitos acessos não seguros a `element.props`, pode executar este codemod adicional:

```bash
npx types-react-codemod@latest react-element-default-any-props ./path-to-your-react-ts-files
```

</Note>

Confira [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/) para uma lista de substituições suportadas. Se você achar que um codemod está faltando, ele pode ser rastreado na [lista de codemods ausentes do React 19](https://github.com/eps1lon/types-react-codemod/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22React+19%22+label%3Aenhancement).

### Limpezas de `ref` necessárias {/*ref-cleanup-required*/}

_Essa mudança está incluída no preset de codemod `react-19` como [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)._

Devido à introdução de funções de limpeza de ref, retornar qualquer outra coisa de um callback de ref agora será rejeitado pelo TypeScript. A correção geralmente é parar de usar retornos implícitos:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

O código original retornou a instância do `HTMLDivElement` e o TypeScript não saberia se isso deveria ser uma função de limpeza ou não.

### `useRef` requer um argumento {/*useref-requires-argument*/}

_Essa mudança está incluída no preset de codemod `react-19` como [`refobject-defaults`](https://github.com/eps1lon/types-react-codemod/#refobject-defaults)._

Uma reclamação de longa data de como TypeScript e React funcionam tem sido `useRef`. Alteramos os tipos para que `useRef` agora exija um argumento. Isso simplifica significativamente sua assinatura de tipo. Ele agora se comportará mais como `createContext`.

```ts
// @ts-expect-error: Esperava-se 1 argumento, mas nenhum foi visto
useRef();
// Passa
useRef(undefined);
// @ts-expect-error: Esperava-se 1 argumento, mas nenhum foi visto
createContext();
// Passa
createContext(undefined);
```

Isso agora também significa que todas as refs são mutáveis. Você não atingirá mais o problema em que não pode mutar uma ref porque a inicializou com `null`:

```ts
const ref = useRef<number>(null);

// Não é possível atribuir a 'current' porque é uma propriedade somente leitura
ref.current = 1;
```

`MutableRef` agora está descontinuado em favor de um único tipo `RefObject` que `useRef` sempre retornará:

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef` ainda tem uma sobrecarga de conveniência para `useRef<T>(null)` que retorna automaticamente `RefObject<T | null>`. Para facilitar a migração devido ao argumento necessário para `useRef`, uma sobrecarga de conveniência para `useRef(undefined)` foi adicionada que retorna automaticamente `RefObject<T | undefined>`.

Confira [[RFC] Make all refs mutable](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772) para discussões anteriores sobre essa mudança.

### Mudanças no tipo TypeScript `ReactElement` {/*changes-to-the-reactelement-typescript-type*/}

_Essa mudança está incluída no codemod [`react-element-default-any-props`](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props)._

As `props` dos elementos React agora são padronizadas para `unknown` em vez de `any` se o elemento for tipado como `ReactElement`. Isso não o afeta se você passar um argumento de tipo para `ReactElement`:

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

Mas se você confiava no padrão, agora precisa lidar com `unknown`:

```ts
type Example = ReactElement["props"];
//   ^? Antes, era 'any', agora 'unknown'
```

Você só deve precisar disso se tiver muito código legado dependendo de acessos não seguros às props do elemento. A introspecção de elemento só existe como uma exceção e você deve deixar explícito que o acesso às suas props é insustentável por meio de um `any` explícito.

### O namespace JSX no TypeScript {/*the-jsx-namespace-in-typescript*/}

Essa alteração está incluída no preset `react-19` codemod como [`scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx)

Um pedido de longa data é remover o namespace global `JSX` de nossos tipos em favor de `React.JSX`. Isso ajuda a evitar a poluição de tipos globais, o que impede conflitos entre diferentes bibliotecas de UI que alavancam JSX.

Agora você precisará encapsular a ampliação do módulo do namespace JSX em `declare module "....":

```diff
// global.d.ts
+ declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "my-element": {
          myElementProps: string;
        };
      }
    }
+ }
```

O especificador de módulo exato depende do tempo de execução JSX que você especificou nas `compilerOptions` do seu `tsconfig.json`:

- Para `"jsx": "react-jsx"` seria `react/jsx-runtime`.
- Para `"jsx": "react-jsxdev"` seria `react/jsx-dev-runtime`.
- Para `"jsx": "react"` e `"jsx": "preserve"` seria `react`.

### Melhores tipagens `useReducer` {/*better-usereducer-typings*/}

`useReducer` agora tem melhor inferência de tipos, graças a [@mfp22](https://github.com/mfp22).

No entanto, isso exigiu uma alteração de quebra onde `useReducer` não aceita o tipo de redutor completo como um parâmetro de tipo, mas em vez disso, precisa de nenhum (e depender da tipagem contextual) ou precisa tanto do estado quanto do tipo de ação.

A nova melhor prática é _não_ passar argumentos de tipo para `useReducer`.
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer(reducer)
```
Isso pode não funcionar em casos extremos em que você pode digitar explicitamente o estado e a ação, passando o `Action` em uma tupla:
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer<State, [Action]>(reducer)
```
Se você definir o redutor embutido, incentivamos a anotar os parâmetros da função:
```diff
- useReducer<React.Reducer<State, Action>>((state, action) => state)
+ useReducer((state: State, action: Action) => state)
```
Isso também é o que você também teria que fazer se mover o redutor para fora da chamada `useReducer`:

```ts
const reducer = (state: State, action: Action) => state;
```

## Changelog {/*changelog*/}

### Outras mudanças que quebram {/*other-breaking-changes*/}

- **react-dom**: Error for javascript URLs in `src` and `href` [#26507](https://github.com/facebook/react/pull/26507)
- **react-dom**: Remove `errorInfo.digest` from `onRecoverableError` [#28222](https://github.com/facebook/react/pull/28222)
- **react-dom**: Remove `unstable_flushControlled` [#26397](https://github.com/facebook/react/pull/26397)
- **react-dom**: Remove `unstable_createEventHandle` [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: Remove `unstable_renderSubtreeIntoContainer` [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: Remove `unstable_runWithPriority` [#28271](https://github.com/facebook/react/pull/28271)
- **react-is**: Remove deprecated methods from `react-is` [28224](https://github.com/facebook/react/pull/28224)

### Outras mudanças notáveis {/*other-notable-changes*/}

- **react**: Batch sync, default and continuous lanes [#25700](https://github.com/facebook/react/pull/25700)
- **react**: Don't prerender siblings of suspended component [#26380](https://github.com/facebook/react/pull/26380)
- **react**: Detect infinite update loops caused by render phase updates [#26625](https://github.com/facebook/react/pull/26625)
- **react-dom**: Transitions in popstate are now synchronous [#26025](https://github.com/facebook/react/pull/26025)
- **react-dom**: Remove layout effect warning during SSR [#26395](https://github.com/facebook/react/pull/26395)
- **react-dom**: Warn and don’t set empty string for src/href (except anchor tags) [#28124](https://github.com/facebook/react/pull/28124)

Para uma lista completa de mudanças, consulte o [Changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md#1900-december-5-2024).

---

Agradecimentos a [Andrew Clark](https://twitter.com/acdlite), [Eli White](https://twitter.com/Eli_White), [Jack Pope](https://github.com/jackpope), [Jan Kassens](https://github.com/kassens), [Josh Story](https://twitter.com/joshcstory), [Matt Carroll](https://twitter.com/mattcarrollcode), [Noah Lemen](https://twitter.com/noahlemen), [Sophie Alpert](https://twitter.com/sophiebits), e [Sebastian Silbermann](https://twitter.com/sebsilbermann) por revisar e editar este post.