---
title: "Guia de Atualização do React 19 Beta"
author: Ricky Hanlon
date: 2024/04/25
description: As melhorias adicionadas ao React 19 requerem algumas alterações que quebram a compatibilidade, mas trabalhamos para tornar a atualização o mais suave possível e não esperamos que as mudanças impactem a maioria dos aplicativos. Neste post, vamos guiá-lo pelos passos para atualizar bibliotecas para o React 19 beta.
---

25 de abril de 2024 por [Ricky Hanlon](https://twitter.com/rickhanlonii)

---

<Note>

Esta versão beta é para bibliotecas se prepararem para o React 19. Os desenvolvedores de aplicativos devem atualizar para a versão 18.3.0 e aguardar a versão estável do React 19 enquanto trabalhamos com as bibliotecas e fazemos alterações com base no feedback.

</Note>


<Intro>

As melhorias adicionadas ao React 19 requerem algumas alterações que quebram a compatibilidade, mas trabalhamos para tornar a atualização o mais suave possível e não esperamos que as mudanças impactem a maioria dos aplicativos.

Para ajudar a tornar a atualização mais fácil, hoje também estamos publicando o React 18.3.

</Intro>

<Note>

#### O React 18.3 também foi publicado {/*react-18-3*/}

Para ajudar a tornar a atualização para o React 19 mais fácil, publicamos uma versão `react@18.3` que é idêntica à 18.2, mas adiciona avisos para APIs obsoletas e outras mudanças que são necessárias para o React 19.

Recomendamos atualizar para o React 18.3 primeiro para ajudar a identificar quaisquer problemas antes de atualizar para o React 19.

Para uma lista de mudanças na 18.3, consulte as [Notas de Lançamento](https://github.com/facebook/react/blob/main/CHANGELOG.md).

</Note>

Neste post, vamos guiá-lo pelos passos para atualizar bibliotecas para o React 19 beta:

- [Instalação](#installing)
- [Alterações quebradoras](#breaking-changes)
- [Novas desativações](#new-deprecations)
- [Mudanças notáveis](#notable-changes)
- [Mudanças no TypeScript](#typescript-changes)
- [Changelog](#changelog)

Se você gostaria de nos ajudar a testar o React 19, siga os passos neste guia de atualização e [relate quaisquer problemas](https://github.com/facebook/react/issues/new?assignees=&labels=React+19&projects=&template=19.md&title=%5BReact+19%5D) que você encontrar. Para uma lista de novos recursos adicionados ao React 19 beta, consulte o [post de lançamento do React 19](/blog/2024/04/25/react-19).

---
## Instalação {/*installing*/}

<Note>

#### Novo JSX Transform agora é necessário {/*new-jsx-transform-is-now-required*/}

Introduzimos um [novo JSX transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) em 2020 para melhorar o tamanho do pacote e usar JSX sem importar o React. No React 19, estamos adicionando melhorias adicionais, como usar ref como uma prop e melhorias na velocidade do JSX que exigem o novo transform.

Se o novo transform não estiver habilitado, você verá este aviso:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Seu aplicativo (ou uma de suas dependências) está usando um transform JSX desatualizado. Atualize para o transform JSX moderno para um desempenho mais rápido: https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>


Esperamos que a maioria dos aplicativos não seja afetada, pois o transform já está habilitado na maioria dos ambientes. Para instruções manuais sobre como atualizar, consulte o [post de anúncio](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

</Note>


Para instalar a versão mais recente do React e do React DOM:

```bash
npm install react@beta react-dom@beta
```

Se você estiver usando TypeScript, você também precisa atualizar os tipos. Uma vez que o React 19 seja lançado como estável, você pode instalar os tipos normalmente de `@types/react` e `@types/react-dom`. Durante o período beta, os tipos estão disponíveis em pacotes diferentes que precisam ser impostos no seu `package.json`:

```json
{
  "dependencies": {
    "@types/react": "npm:types-react@beta",
    "@types/react-dom": "npm:types-react-dom@beta"
  },
  "overrides": {
    "@types/react": "npm:types-react@beta",
    "@types/react-dom": "npm:types-react-dom@beta"
  }
}
```

Também estamos incluindo um codemod para as substituições mais comuns. Consulte [Mudanças no TypeScript](#typescript-changes) abaixo.


## Alterações quebradoras {/*breaking-changes*/}

### Erros durante a renderização não são mais relançados {/*errors-in-render-are-not-re-thrown*/}

Nas versões anteriores do React, os erros lançados durante a renderização eram capturados e relançados. No modo DEV, nós também registraríamos no `console.error`, resultando em logs de erro duplicados.

No React 19, [melhoramos como os erros são tratados](/blog/2024/04/25/react-19#error-handling) para reduzir a duplicação ao não relançar:

- **Erros não capturados**: Erros que não são capturados por um Error Boundary são relatados para `window.reportError`.
- **Erros capturados**: Erros que são capturados por um Error Boundary são relatados para `console.error`.

Essa mudança não deve impactar a maioria dos aplicativos, mas se o seu relatório de erros em produção depender do relançamento de erros, pode ser necessário atualizar seu tratamento de erros. Para suportar isso, adicionamos novos métodos a `createRoot` e `hydrateRoot` para tratamento de erros personalizado:

```js [[1, 2, "onUncaughtError"], [2, 5, "onCaughtError"]]
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // ... registrar relatório de erro
  },
  onCaughtError: (error, errorInfo) => {
    // ... registrar relatório de erro
  }
});
```

Para mais informações, consulte a documentação de [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) e [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot).


### APIs do React obsoletas removidas {/*removed-deprecated-react-apis*/}

#### Removido: `propTypes` e `defaultProps` para funções {/*removed-proptypes-and-defaultprops*/}
`PropTypes` foram descontinuados em [abril de 2017 (v15.5.0)](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings). 

No React 19, estamos removendo as verificações `propType` do pacote React e usá-las será silenciosamente ignorado. Se você estiver usando `propTypes`, recomendamos migrar para TypeScript ou outra solução de verificação de tipos.

Também estamos removendo `defaultProps` de componentes de função em favor de parâmetros padrão do ES6. Componentes de classe continuarão a suportar `defaultProps`, uma vez que não há alternativa do ES6.

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

#### Removido: Contexto Legado usando `contextTypes` e `getChildContext` {/*removed-removing-legacy-context*/}

O Contexto Legado foi descontinuado em [outubro de 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html).

O Contexto Legado estava disponível apenas em componentes de classe usando as APIs `contextTypes` e `getChildContext`, e foi substituído por `contextType` devido a bugs sutis que eram fáceis de perder. No React 19, estamos removendo o Contexto Legado para tornar o React um pouco menor e mais rápido.

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

#### Removido: referências de string {/*removed-string-refs*/}
Referências de string foram descontinuadas em [março de 2018 (v16.3.0)](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html).

Componentes de classe suportavam referências de string antes de serem substituídas por callbacks de ref devido a [múltiplas desvantagens](https://github.com/facebook/react/issues/1373). No React 19, estamos removendo referências de string para tornar o React mais simples e fácil de entender.

Se você ainda estiver usando referências de string em componentes de classe, precisará migrar para callbacks de ref:

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

Para ajudar na migração, estaremos publicando um [react-codemod](https://github.com/reactjs/react-codemod/#string-refs) para substituir automaticamente referências de string por callbacks de `ref`. Siga [este PR](https://github.com/reactjs/react-codemod/pull/309) para atualizações e para experimentá-lo.

</Note>

#### Removido: fábricas de padrão de módulo {/*removed-module-pattern-factories*/}
Fábricas de padrão de módulo foram descontinuadas em [agosto de 2019 (v16.9.0)](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories).

Esse padrão era raramente utilizado e seu suporte faz com que o React seja ligeiramente maior e mais lento do que o necessário. No React 19, estamos removendo o suporte para fábricas de padrão de módulo, e você precisará migrar para funções regulares:

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
`createFactory` foi descontinuado em [fevereiro de 2020 (v16.13.0)](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory).

O uso de `createFactory` era comum antes do amplo suporte ao JSX, mas é raramente utilizado hoje e pode ser substituído por JSX. No React 19, estamos removendo `createFactory` e você precisará migrar para JSX:

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

No React 18, atualizamos `react-test-renderer/shallow` para re-exportar [react-shallow-renderer](https://github.com/enzymejs/react-shallow-renderer). No React 19, estamos removendo `react-test-render/shallow` para preferir a instalação do pacote diretamente:

```bash
npm install react-shallow-renderer --save-dev
```
```diff
- import ShallowRenderer from 'react-test-renderer/shallow';
+ import ShallowRenderer from 'react-shallow-renderer';
```

<Note>

##### Por favor, reconsidere a renderização superficial {/*please-reconsider-shallow-rendering*/}

A renderização superficial depende dos internos do React e pode bloqueá-lo de futuras atualizações. Recomendamos migrar seus testes para [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) ou [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started).

</Note>

### APIs do React DOM obsoletas removidas {/*removed-deprecated-react-dom-apis*/}

#### Removido: `react-dom/test-utils` {/*removed-react-dom-test-utils*/}

Mudamos `act` de `react-dom/test-utils` para o pacote `react`:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

`ReactDOMTestUtils.act` está obsoleta em favor de `React.act`. Importar `act` do `react` em vez de `react-dom/test-utils`. Veja https://react.dev/warnings/react-dom-test-utils para mais informações.

</ConsoleLogLine>

</ConsoleBlockMulti>

Para corrigir esse aviso, você pode importar `act` do `react`:

```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

Todas as outras funções de `test-utils` foram removidas. Essas utilidades eram incomuns e tornavam muito fácil depender de detalhes de implementação de baixo nível de seus componentes e do React. No React 19, essas funções gerarão um erro quando chamadas e suas exportações serão removidas em uma versão futura.

Consulte a [página de avisos](https://react.dev/warnings/react-dom-test-utils) para alternativas.

#### Removido: `ReactDOM.render` {/*removed-reactdom-render*/}

`ReactDOM.render` foi descontinuado em [março de 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). No React 19, estamos removendo `ReactDOM.render` e você precisará migrar para o uso de [`ReactDOM.createRoot`](https://react.dev/reference/react-dom/client/createRoot):

```js
// Antes
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// Depois
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

#### Removido: `ReactDOM.hydrate` {/*removed-reactdom-hydrate*/}

`ReactDOM.hydrate` foi descontinuado em [março de 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). No React 19, estamos removendo `ReactDOM.hydrate` e você precisará migrar para o uso de [`ReactDOM.hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot),

```js
// Antes
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// Depois
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```


#### Removido: `unmountComponentAtNode` {/*removed-unmountcomponentatnode*/}

`ReactDOM.unmountComponentAtNode` foi descontinuado em [março de 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). No React 19, você precisará migrar para o uso de `root.unmount()`.


```js
// Antes
unmountComponentAtNode(document.getElementById('root'));

// Depois
root.unmount();
```

Para mais informações, consulte `root.unmount()` para [`createRoot`](https://react.dev/reference/react-dom/client/createRoot#root-unmount) e [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot#root-unmount).


#### Removido: `ReactDOM.findDOMNode` {/*removed-reactdom-finddomnode*/}
`ReactDOM.findDOMNode` foi [descontinuado em outubro de 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode).

Estamos removendo `findDOMNode` porque era uma válvula de escape legada que era lenta para executar, frágil para refatoração, retornava apenas o primeiro filho e quebrava níveis de abstração (veja mais [aqui](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)). Você pode substituir `ReactDOM.findDOMNode` por [refs do DOM](/learn/manipulating-the-dom-with-refs):

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

## Novas desativações {/*new-deprecations*/}

### Obsoleto: `element.ref` {/*deprecated-element-ref*/}

O React 19 suporta [`ref` como uma prop](/blog/2024/04/25/react-19#ref-as-a-prop), então estamos descontinuando o `element.ref` em favor de `element.props.ref`.

Acessar `element.ref` gerará um aviso:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Acessar element.ref não é mais suportado. ref agora é uma prop regular. Será removido do tipo JSX Element em uma versão futura.

</ConsoleLogLine>

</ConsoleBlockMulti>

### Obsoleto: `react-test-renderer` {/*deprecated-react-test-renderer*/}

Estamos descontinuando `react-test-renderer` porque implementa seu próprio ambiente de renderização que não corresponde ao ambiente usado pelos usuários, promove o teste de detalhes de implementação e depende da introspecção dos internos do React.

O test renderer foi criado antes que houvesse estratégias de teste mais viáveis disponíveis, como [React Testing Library](https://testing-library.com), e agora recomendamos o uso de uma biblioteca de teste moderna em vez disso.

No React 19, `react-test-renderer` registra um aviso de descontinuação e mudou para renderização concorrente. Recomendamos migrar seus testes para [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) ou [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started) para uma experiência de teste moderna e bem suportada.

## Mudanças notáveis {/*notable-changes*/}

### Mudanças no StrictMode {/*strict-mode-improvements*/}

O React 19 inclui várias correções e melhorias no Strict Mode.

Ao renderizar duas vezes no Strict Mode em desenvolvimento, `useMemo` e `useCallback` reutilizarão os resultados memorizados da primeira renderização durante a segunda renderização. Componentes que já são compatíveis com o Strict Mode não devem notar nenhuma diferença no comportamento.

Como em todos os comportamentos do Strict Mode, esses recursos são projetados para ativar proativamente bugs em seus componentes durante o desenvolvimento, para que você possa corrigi-los antes que sejam enviados para produção. Por exemplo, durante o desenvolvimento, o Strict Mode chamará duas vezes as funções de callback de ref na montagem inicial, para simular o que acontece quando um componente montado é substituído por um fallback de Suspense.

### Construções UMD removidas {/*umd-builds-removed*/}

UMD foi amplamente utilizado no passado como uma maneira conveniente de carregar o React sem um passo de construção. Agora, existem alternativas modernas para carregar módulos como scripts em documentos HTML. A partir do React 19, o React não produzirá mais construções UMD para reduzir a complexidade de seu processo de teste e lançamento.

Para carregar o React 19 com uma tag de script, recomendamos o uso de uma CDN baseada em ESM, como [esm.sh](https://esm.sh/).

```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  ...
</script>
```

### Bibliotecas que dependem dos internos do React podem bloquear atualizações {/*libraries-depending-on-react-internals-may-block-upgrades*/}

Este lançamento inclui mudanças nos internos do React que podem impactar bibliotecas que ignoram nossos pedidos para não usar internos como `SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`. Essas mudanças são necessárias para implementar melhorias no React 19 e não quebrarão bibliotecas que seguem nossas diretrizes.

Com base na nossa [Política de Versionamento](https://react.dev/community/versioning-policy#what-counts-as-a-breaking-change), essas atualizações não estão listadas como mudanças quebradoras e não estamos incluindo documentação sobre como atualizá-las. A recomendação é remover qualquer código que dependa de internos.

Para refletir o impacto de usar internos, renomeamos o sufixo `SECRET_INTERNALS` para:

`_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`

No futuro, bloquearemos mais agressivamente o acesso aos internos do React para desencorajar o uso e garantir que os usuários não fiquem bloqueados nas atualizações.

## Mudanças no TypeScript {/*typescript-changes*/}

### Tipos TypeScript obsoletos removidos {/*removed-deprecated-typescript-types*/}

Limparamos os tipos do TypeScript com base nas APIs removidas no React 19. Alguns dos tipos removidos foram movidos para pacotes mais relevantes, e outros não são mais necessários para descrever o comportamento do React.

<Note>
Publicamos [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/) para migrar a maioria das mudanças quebradoras relacionadas a tipos:

```bash
npx types-react-codemod@latest preset-19 ./path-to-app
```

Se você tiver muito acesso inseguro a `element.props`, pode executar este codemod adicional:

```bash
npx types-react-codemod@latest react-element-default-any-props ./path-to-your-react-ts-files
```

</Note>

Confira [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/) para uma lista de substituições suportadas. Se você sentir que um codemod está faltando, isso pode ser rastreado na [lista de codemods do React 19 que estão faltando](https://github.com/eps1lon/types-react-codemod/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22React+19%22+label%3Aenhancement).


### Limpezas de `ref` necessárias {/*ref-cleanup-required*/}

_Esta mudança está incluída no preset codemod `react-19` como [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)._

Devido à introdução de funções de limpeza de ref, retornar qualquer outra coisa de uma callback de ref agora será rejeitado pelo TypeScript. A correção geralmente é parar de usar retornos implícitos:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

O código original retornava a instância do `HTMLDivElement` e o TypeScript não saberia se isso deveria ser uma função de limpeza ou não.

### `useRef` requer um argumento {/*useref-requires-argument*/}

_Esta mudança está incluída no preset codemod `react-19` como [`refobject-defaults`](https://github.com/eps1lon/types-react-codemod/#refobject-defaults)._

Uma longa reclamação sobre como o TypeScript e o React funcionam tem sido o `useRef`. Mudamos os tipos para que `useRef` agora exija um argumento. Isso simplifica significativamente sua assinatura de tipo. Agora se comportará mais como `createContext`.

```ts
// @ts-expect-error: Esperado 1 argumento mas nenhum foi visto
useRef();
// Passa
useRef(undefined);
// @ts-expect-error: Esperado 1 argumento mas nenhum foi visto
createContext();
// Passa
createContext(undefined);
```

Isso agora também significa que todas as refs são mutáveis. Você não terá mais o problema em que não pode mutar uma ref porque a inicializou com `null`:

```ts
const ref = useRef<number>(null);

// Não é possível atribuir a 'current' porque é uma propriedade somente leitura
ref.current = 1;
```

`MutableRef` agora está obsoleto em favor de um único tipo `RefObject` que `useRef` sempre retornará:

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef` ainda tem uma sobrecarga de conveniência para `useRef<T>(null)` que automaticamente retorna `RefObject<T | null>`. Para facilitar a migração devido ao argumento requerido para `useRef`, uma sobrecarga de conveniência para `useRef(undefined)` foi adicionada que automaticamente retorna `RefObject<T | undefined>`.

Confira [[RFC] Fazer todas as refs mutáveis](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772) para discussões anteriores sobre essa mudança.

### Mudanças no tipo TypeScript `ReactElement` {/*changes-to-the-reactelement-typescript-type*/}

_Esta mudança está incluída no codemod [`react-element-default-any-props`](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props)._

As `props` dos elementos React agora padrão para `unknown` em vez de `any` se o elemento for tipado como `ReactElement`. Isso não afeta você se você passar um argumento de tipo para `ReactElement`:

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

Mas se você contava com o padrão, agora precisa lidar com `unknown`:

```ts
type Example = ReactElement["props"];
//   ^? Antes, era 'any', agora 'unknown'
```

Você só deve precisar disso se tiver muito código legado dependendo do acesso inseguro às `props` do elemento. A introspecção do elemento existe apenas como uma válvula de escape, e você deve deixar explícito que seu acesso às `props` é inseguro via `any` explícito.

### O namespace JSX no TypeScript {/*the-jsx-namespace-in-typescript*/}
Esta mudança está incluída no preset codemod `react-19` como [`scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx)

Um pedido antigo é remover o namespace global `JSX` de nossos tipos em favor de `React.JSX`. Isso ajuda a prevenir a poluição de tipos globais, que previne conflitos entre diferentes bibliotecas de UI que utilizam JSX.

Agora você precisará encapsular a ampliação do módulo do namespace JSX em `declare module "....`:

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

O especificador exato do módulo depende do runtime JSX que você especificou nas `compilerOptions` do seu `tsconfig.json`:

- Para `"jsx": "react-jsx"` seria `react/jsx-runtime`.
- Para `"jsx": "react-jsxdev"` seria `react/jsx-dev-runtime`.
- Para `"jsx": "react"` e `"jsx": "preserve"` seria `react`.

### Melhores typings para `useReducer` {/*better-usereducer-typings*/}

`useReducer` agora tem uma inferência de tipo melhorada graças a [@mfp22](https://github.com/mfp22).

No entanto, isso exigiu uma mudança quebradora onde `useReducer` não aceita o tipo completo do reduzidor como um parâmetro de tipo, mas precisa de nenhum (e confiar na tipagem contextual) ou precisa de ambos os tipos de estado e ação.

A nova melhor prática é _não_ passar argumentos de tipo para `useReducer`.
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer(reducer)
```
Isso pode não funcionar em casos extremos onde você pode tipar explicitamente o estado e a ação, passando o `Action` em uma tupla:
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer<State, [Action]>(reducer)
```
Se você definir o reduzidor inline, recomendamos anotar os parâmetros da função em vez disso:
```diff
- useReducer<React.Reducer<State, Action>>((state, action) => state)
+ useReducer((state: State, action: Action) => state)
```
Isso também é o que você também teria que fazer se mover o reduzidor para fora da chamada `useReducer`:

```ts
const reducer = (state: State, action: Action) => state;
```

## Changelog {/*changelog*/}

### Outras mudanças quebradoras {/*other-breaking-changes*/}

- **react-dom**: Erro para URLs javascript em src/href [#26507](https://github.com/facebook/react/pull/26507)
- **react-dom**: Remover `errorInfo.digest` do `onRecoverableError` [#28222](https://github.com/facebook/react/pull/28222)
- **react-dom**: Remover `unstable_flushControlled` [#26397](https://github.com/facebook/react/pull/26397)
- **react-dom**: Remover `unstable_createEventHandle` [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: Remover `unstable_renderSubtreeIntoContainer` [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: Remover `unstable_runWithPrioirty` [#28271](https://github.com/facebook/react/pull/28271)
- **react-is**: Remover métodos obsoletos de `react-is` [28224](https://github.com/facebook/react/pull/28224)

### Outras mudanças notáveis {/*other-notable-changes*/}

- **react**: Lotes síncronos, lanes padrão e contínuas [#25700](https://github.com/facebook/react/pull/25700)
- **react**: Não pré-renderizar irmãos do componente suspenso [#26380](https://github.com/facebook/react/pull/26380)
- **react**: Detectar loops de atualização infinitos causados por atualizações na fase de renderização [#26625](https://github.com/facebook/react/pull/26625)
- **react-dom**: Transições em popstate agora são síncronas [#26025](https://github.com/facebook/react/pull/26025)
- **react-dom**: Remover aviso de efeito de layout durante SSR [#26395](https://github.com/facebook/react/pull/26395)
- **react-dom**: Avisar e não definir string vazia para src/href (exceto tags âncora) [#28124](https://github.com/facebook/react/pull/28124)

Publicaremos o changelog completo com o lançamento estável do React 19.

---

Agradecimentos a [Andrew Clark](https://twitter.com/acdlite), [Eli White](https://twitter.com/Eli_White), [Jack Pope](https://github.com/jackpope), [Jan Kassens](https://github.com/kassens), [Josh Story](https://twitter.com/joshcstory), [Matt Carroll](https://twitter.com/mattcarrollcode), [Noah Lemen](https://twitter.com/noahlemen), [Sophie Alpert](https://twitter.com/sophiebits) e [Sebastian Silbermann](https://twitter.com/sebsilbermann) pela revisão e edição deste post.