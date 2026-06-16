---
title: "React 19 Upgrade Guide"
author: Ricky Hanlon
date: 2024/04/25
description: As melhorias adicionadas ao React 19 exigem algumas alterações que quebram a compatibilidade, mas trabalhamos para tornar a atualização o mais tranquila possível e não esperamos que as mudanças afetem a maioria dos aplicativos. Neste post, vamos guiá-lo através dos passos para atualizar aplicativos e bibliotecas para o React 19.
---

25 de abril de 2024 por[Ricky Hanlon](https://twitter.com/rickhanlonii)

---


<Intro>

As melhorias adicionadas ao React 19 exigem algumas alterações que quebram a compatibilidade, mas trabalhamos para tornar a atualização o mais tranquila possível e não esperamos que as mudanças afetem a maioria dos aplicativos.

</Intro>

<Note>

#### React 18.3 também foi publicado{/*react-18-3*/}

Para ajudar a facilitar a atualização para o React 19, publicamos uma`react@18.3`versão que é idêntica à 18.2, mas adiciona avisos para APIs descontinuadas e outras mudanças necessárias para o React 19.

Recomendamos atualizar para o React 18.3 primeiro para ajudar a identificar quaisquer problemas antes de atualizar para o React 19.

Para uma lista de mudanças na 18.3, veja as[Notas de Lançamento](https://github.com/facebook/react/blob/main/CHANGELOG.md#1830-april-25-2024).

</Note>

Nesta postagem, vamos guiá-lo através dos passos para atualizar para o React 19:

- [Instalação](#installing)
- [Codemods](#codemods)
- [Alterações que quebram a compatibilidade](#breaking-changes)
- [Novas descontinuações](#new-deprecations)
- [Mudanças notáveis](#notable-changes)
- [Mudanças no TypeScript](#typescript-changes)
- [Changelog](#changelog)

Se você gostaria de nos ajudar a testar o React 19, siga os passos deste guia de atualização e[relate quaisquer problemas](https://github.com/facebook/react/issues/new?assignees=&labels=React+19&projects=&template=19.md&title=%5BReact+19%5D)que encontrar. Para uma lista de novas funcionalidades adicionadas ao React 19, veja o[post de lançamento do React 19](/blog/2024/12/05/react-19).

---
## Instalação{/*installing*/}

<Note>

#### O Novo Transform JSX agora é obrigatório{/*new-jsx-transform-is-now-required*/}

Introduzimos um[novo transform JSX](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)em 2020 para melhorar o tamanho do bundle e usar JSX sem importar o React. No React 19, estamos adicionando melhorias adicionais como o uso de `ref` como prop e melhorias de velocidade do JSX que exigem o novo transform.

Se o novo transform não estiver habilitado, você verá este aviso:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Seu aplicativo (ou uma de suas dependências) está usando um transform JSX desatualizado. Atualize para o transform JSX moderno para um desempenho mais rápido:https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>


Esperamos que a maioria dos aplicativos não seja afetada, já que o transform está habilitado na maioria dos ambientes. Para instruções manuais sobre como atualizar, por favor, veja o[post de anúncio](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

</Note>


Para instalar a versão mais recente do React e React DOM:

```bash
npm install --save-exact react@^19.0.0 react-dom@^19.0.0
```

Ou, se você estiver usando Yarn:

```bash
yarn add --exact react@^19.0.0 react-dom@^19.0.0
```

Se você estiver usando TypeScript, também precisará atualizar os tipos.
```bash
npm install --save-exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

Ou, se você estiver usando Yarn:
```bash
yarn add --exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

Também estamos incluindo um codemod para as substituições mais comuns. Veja[Mudanças no TypeScript](#typescript-changes)abaixo.

## Codemods{/*codemods*/}

Para ajudar na atualização, trabalhamos com a equipe da[codemod.com](https://codemod.com)para publicar codemods que atualizarão automaticamente seu código para muitas das novas APIs e padrões no React 19.

Todos os codemods estão disponíveis no[`react-codemod`repo](https://github.com/reactjs/react-codemod)e a equipe Codemod se juntou para ajudar na manutenção dos codemods. Para executar esses codemods, recomendamos usar o`codemod`comando em vez do`react-codemod`porque ele executa mais rápido, lida com migrações de código mais complexas e oferece melhor suporte para TypeScript.


<Note>

#### Executar todos os codemods do React 19{/*run-all-react-19-codemods*/}

Execute todos os codemods listados neste guia com a`codemod`receita do React 19:

```bash
npx codemod@latest react/19/migration-recipe
```

Isso executará os seguintes codemods de`react-codemod`:
- [`replace-reactdom-render`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-reactdom-render)
- [`replace-string-ref`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-string-ref)
- [`replace-act-import`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-act-import)
- [`replace-use-form-state`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-use-form-state)
- [`prop-types-typescript`](https://github.com/reactjs/react-codemod#react-proptypes-to-prop-types)

Isso não inclui as alterações do TypeScript. Veja[Alterações do TypeScript](#typescript-changes)abaixo.

</Note>

As alterações que incluem um codemod incluem o comando abaixo.

Para uma lista de todos os codemods disponíveis, veja o[`react-codemod`repo](https://github.com/reactjs/react-codemod).

## Alterações que causam quebra{/*breaking-changes*/}

### Erros durante a renderização não são relançados{/*errors-in-render-are-not-re-thrown*/}

Em versões anteriores do React, erros lançados durante a renderização eram capturados e relançados. Em modo DEV, também registrávamos no`console.error`, resultando em logs de erro duplicados.

No React 19, nós[melhoramos como os erros são tratados](/blog/2024/04/25/react-19#error-handling)para reduzir a duplicação, não relançando-os:

- **Erros não capturados**: Erros que não são capturados por um Error Boundary são reportados para`window.reportError`.
- **Erros Capturados**: Erros que são capturados por um Error Boundary são reportados para`console.error`.

Essa alteração não deve impactar a maioria dos apps, mas se o seu sistema de report de erros em produção depende do relançamento de erros, você pode precisar atualizar seu tratamento de erros. Para dar suporte a isso, adicionamos novos métodos em`createRoot`e`hydrateRoot`para tratamento de erros customizado:

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

Para mais informações, veja a documentação de[`createRoot`](https://react.dev/reference/react-dom/client/createRoot)e[`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot).


### APIs descontinuadas do React removidas{/*removed-deprecated-react-apis*/}

#### Removido:`propTypes`e`defaultProps`para funções{/*removed-proptypes-and-defaultprops*/}
`PropTypes`foram descontinuados em[abril de 2017 (v15.5.0)](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings).

No React 19, estamos removendo as verificações de`propType`do pacote React, e usá-las será ignorado silenciosamente. Se você está usando`propTypes`, recomendamos migrar para TypeScript ou outra solução de verificação de tipos.

Também estamos removendo`defaultProps`de componentes de função em favor de parâmetros padrão ES6. Componentes de classe continuarão a suportar`defaultProps`já que não há alternativa ES6.

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

Codemod`propTypes`para TypeScript com:

```bash
npx codemod@latest react/prop-types-typescript
```

</Note>

#### Removido: Contexto Legado usando`contextTypes`e`getChildContext` {/*removed-removing-legacy-context*/}

Contexto Legado foi descontinuado em[outubro de 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html).

Contexto Legado estava disponível apenas em componentes de classe usando as APIs`contextTypes`e`getChildContext`, e foi substituído por`contextType`devido a bugs sutis que eram fáceis de não perceber. No React 19, estamos removendo o Contexto Legado para tornar o React um pouco menor e mais rápido.

Se você ainda está usando Contexto Legado em componentes de classe, você precisará migrar para a nova API`contextType`.

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

#### Removido: refs de string{/*removed-string-refs*/}
Refs de string foram descontinuadas em[março de 2018 (v16.3.0)](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html).

Componentes de classe suportavam refs de string antes de serem substituídos por callbacks de ref devido a[várias desvantagens](https://github.com/facebook/react/issues/1373). No React 19, estamos removendo as refs de string para tornar o React mais simples e fácil de entender.

Se você ainda estiver usando refs de string em componentes de classe, precisará migrar para callbacks de ref:

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

Codemod de refs de string com`ref`callbacks:

```bash
npx codemod@latest react/19/replace-string-ref
```

</Note>

#### Removido: fábricas de padrões de módulo{/*removed-module-pattern-factories*/}
Fábricas de padrões de módulo foram descontinuadas em[agosto de 2019 (v16.9.0)](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories).

Este padrão era raramente usado e dar suporte a ele torna o React um pouco maior e mais lento do que o necessário. No React 19, estamos removendo o suporte para fábricas de padrões de módulo, e você precisará migrar para funções regulares:

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

#### Removido:`React.createFactory` {/*removed-createfactory*/}
`createFactory`foi descontinuado em[fevereiro de 2020 (v16.13.0)](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory).

Usar`createFactory`era comum antes do suporte amplo a JSX, mas é raramente usado hoje e pode ser substituído por JSX. No React 19, estamos removendo`createFactory`e você precisará migrar para JSX:

```js
// Antes
import { createFactory } from 'react';

const button = createFactory('button');
```

```js
// Depois
const button = <button />;
```

#### Removido:`react-test-renderer/shallow` {/*removed-react-test-renderer-shallow*/}

No React 18, atualizamos`react-test-renderer/shallow`para reexportar[react-shallow-renderer](https://github.com/enzymejs/react-shallow-renderer). No React 19, estamos removendo`react-test-render/shallow`para preferir instalar o pacote diretamente:

```bash
npm install react-shallow-renderer --save-dev
```
```diff
- import ShallowRenderer from 'react-test-renderer/shallow';
+ import ShallowRenderer from 'react-shallow-renderer';
```

<Note>

##### Por favor, reconsidere a renderização superficial{/*please-reconsider-shallow-rendering*/}

A renderização superficial depende de detalhes internos do React e pode impedir futuras atualizações. Recomendamos migrar seus testes para[@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)ou[@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro).

</Note>

### APIs descontinuadas do React DOM removidas{/*removed-deprecated-react-dom-apis*/}

#### Removido:`react-dom/test-utils` {/*removed-react-dom-test-utils*/}

Movemos`act`de`react-dom/test-utils`para o pacote`react`package:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

`ReactDOMTestUtils.act`está descontinuado em favor de`React.act`. Importe`act`de`react`em vez de`react-dom/test-utils`. Vejahttps://react.dev/warnings/react-dom-test-utilspara mais informações.

</ConsoleLogLine>

</ConsoleBlockMulti>

Para corrigir este aviso, você pode importar`act`de`react`:

```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

Todas as outras`test-utils`funções foram removidas. Essas utilidades eram incomuns e facilitavam demais a dependência de detalhes de implementação de baixo nível dos seus componentes e do React. No React 19, essas funções gerarão um erro quando chamadas e suas exportações serão removidas em uma versão futura.

Veja a[página de avisos](https://react.dev/warnings/react-dom-test-utils)para alternativas.

<Note>

Codemod`ReactDOMTestUtils.act`para`React.act`:

```bash
npx codemod@latest react/19/replace-act-import
```

</Note>

#### Removido:`ReactDOM.render` {/*removed-reactdom-render*/}

`ReactDOM.render`foi descontinuado em[março de 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). No React 19, estamos removendo`ReactDOM.render`e você precisará migrar para usar[`ReactDOM.createRoot`](https://react.dev/reference/react-dom/client/createRoot):

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

Codemod`ReactDOM.render`para`ReactDOMClient.createRoot`:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Removido:`ReactDOM.hydrate` {/*removed-reactdom-hydrate*/}

`ReactDOM.hydrate`foi descontinuado em[março de 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). No React 19, estamos removendo`ReactDOM.hydrate`você precisará migrar para usar[`ReactDOM.hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot),

```js
// Antes
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// Depois
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

<Note>

Codemod`ReactDOM.hydrate`para`ReactDOMClient.hydrateRoot`:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Removido:`unmountComponentAtNode` {/*removed-unmountcomponentatnode*/}

`ReactDOM.unmountComponentAtNode`foi descontinuado em[março de 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). No React 19, você precisará migrar para usar`root.unmount()`.


```js
// Antes
unmountComponentAtNode(document.getElementById('root'));

// Depois
root.unmount();
```

Para mais informações, veja`root.unmount()`para[`createRoot`](https://react.dev/reference/react-dom/client/createRoot#root-unmount)e[`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot#root-unmount).

<Note>

Codemod`unmountComponentAtNode`para`root.unmount`:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Removido:`ReactDOM.findDOMNode` {/*removed-reactdom-finddomnode*/}

`ReactDOM.findDOMNode`foi[descontinuado em outubro de 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode).

Estamos removendo`findDOMNode`porque era uma saída de emergência legada que era lenta para executar, frágil a refatorações, retornava apenas o primeiro filho e quebrava níveis de abstração (veja mais[aqui](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)).`ReactDOM.findDOMNode`com[refs DOM](/learn/manipulating-the-dom-with-refs)

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

## Novas descontinuações{/*new-deprecations*/}

### Descontinuado:`element.ref` {/*deprecated-element-ref*/}

O React 19 suporta[`ref`como uma prop](/blog/2024/04/25/react-19#ref-as-a-prop), então estamos descontinuando a`element.ref`em vez de`element.props.ref`.

Acessar`element.ref`exibirá um aviso:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Acessar element.ref não é mais suportado. ref agora é uma prop regular. Ela será removida do tipo JSX Element em uma futura versão.

</ConsoleLogLine>

</ConsoleBlockMulti>

### Descontinuado:`react-test-renderer` {/*deprecated-react-test-renderer*/}

Estamos descontinuando`react-test-renderer`porque ele implementa seu próprio ambiente de renderização que não corresponde ao ambiente que os usuários utilizam, promove o teste de detalhes de implementação e depende da introspecção dos internos do React.

O test renderer foi criado antes de existirem estratégias de teste mais viáveis disponíveis, como[React Testing Library](https://testing-library.com), e agora recomendamos o uso de uma biblioteca de testes moderna em vez disso.

No React 19,`react-test-renderer`exibe um aviso de descontinuação e mudou para renderização concorrente. Recomendamos migrar seus testes para[@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)ou[@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro)para uma experiência de teste moderna e bem suportada.

## Mudanças notáveis{/*notable-changes*/}

### Mudanças no Strict Mode{/*strict-mode-improvements*/}

O React 19 inclui várias correções e melhorias no Strict Mode.

Ao renderizar duas vezes no Strict Mode em desenvolvimento,`useMemo`e`useCallback`reutilizarão os resultados memorizados da primeira renderização durante a segunda renderização. Componentes que já são compatíveis com o Strict Mode não devem notar uma diferença no comportamento.

Como em todos os comportamentos do Strict Mode, esses recursos são projetados para expor proativamente bugs em seus componentes durante o desenvolvimento, para que você possa corrigi-los antes que sejam enviados para produção. Por exemplo, durante o desenvolvimento, o Strict Mode invocará duas vezes as funções de callback de ref na montagem inicial, para simular o que acontece quando um componente montado é substituído por um fallback do Suspense.

### Melhorias no Suspense{/*improvements-to-suspense*/}

No React 19, quando um componente suspende, o React confirmará imediatamente o fallback do limite Suspense mais próximo sem esperar que toda a árvore de irmãos seja renderizada. Após a confirmação do fallback, o React agenda outra renderização para os irmãos suspensos para "aquecer" as requisições lentas no restante da árvore:

<Diagram name="prerender" height={162} width={1270} alt="Diagrama mostrando uma árvore de três componentes, um pai rotulado Accordion e dois filhos rotulados Panel. Ambos os componentes Panel contêm isActive com valor false.">

Anteriormente, quando um componente suspendia, os irmãos suspensos eram renderizados e então o fallback era confirmado.

</Diagram>

<Diagram name="prewarm" height={162} width={1270} alt="O mesmo diagrama do anterior, com o isActive do primeiro componente filho Panel destacado indicando um clique com o valor isActive definido como true. O segundo componente Panel ainda contém o valor false." >

No React 19, quando um componente suspende, o fallback é confirmado e então os irmãos suspensos são renderizados.

</Diagram>

Essa mudança significa que os fallbacks do Suspense são exibidos mais rapidamente, enquanto ainda aquecem as requisições lentas na árvore suspensa.

### Builds UMD removidos{/*umd-builds-removed*/}

O UMD era amplamente utilizado no passado como uma maneira conveniente de carregar o React sem um passo de build. Agora, existem alternativas modernas para carregar módulos como scripts em documentos HTML. A partir do React 19, o React não produzirá mais builds UMD para reduzir a complexidade de seu processo de teste e lançamento.

Para carregar o React 19 com uma tag de script, recomendamos o uso de um CDN baseado em ESM como[esm.sh](https://esm.sh/).

```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  ...
</script>
```

### Bibliotecas que dependem de internos do React podem bloquear atualizações{/*libraries-depending-on-react-internals-may-block-upgrades*/}

Esta versão inclui mudanças nos internos do React que podem impactar bibliotecas que ignoram nossos apelos para não usar internos como`SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`. Essas mudanças são necessárias para implementar melhorias no React 19 e não quebrarão bibliotecas que seguem nossas diretrizes.

Com base em nossa[Política de Versionamento](https://react.dev/community/versioning-policy#what-counts-as-a-breaking-change), essas atualizações não são listadas como alterações que quebram a compatibilidade (breaking changes), e não estamos incluindo documentação sobre como atualizá-las. A recomendação é remover qualquer código que dependa de internos.

Para refletir o impacto do uso de internos, renomeamos o sufixo`SECRET_INTERNALS`para:

`_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`

No futuro, bloquearemos de forma mais agressiva o acesso a internos do React para desencorajar o uso e garantir que os usuários não sejam impedidos de atualizar.

## Alterações no TypeScript{/*typescript-changes*/}

### Remoção de tipos descontinuados do TypeScript{/*removed-deprecated-typescript-types*/}

Limpamos os tipos do TypeScript com base nas APIs removidas no React 19. Alguns dos tipos removidos foram movidos para pacotes mais relevantes, e outros não são mais necessários para descrever o comportamento do React.

<Note>
Publicamos[`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/), para migrar a maioria das alterações que quebram a compatibilidade relacionadas a tipos:

```bash
npx types-react-codemod@latest preset-19 ./path-to-app
```

Se você tem muito acesso inseguro a`element.props`, você pode executar este codemod adicional:

```bash
npx types-react-codemod@latest react-element-default-any-props ./path-to-your-react-ts-files
```

</Note>

Confira[`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/), para uma lista de substituições suportadas. Se você acha que um codemod está faltando, ele pode ser rastreado na[lista de codemods ausentes para React 19](https://github.com/eps1lon/types-react-codemod/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22React+19%22+label%3Aenhancement).


### `ref`limpezas necessárias{/*ref-cleanup-required*/}

_Esta alteração está incluída no preset de codemods`react-19`como[`no-implicit-ref-callback-return
`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)._

Devido à introdução de funções de limpeza de ref, retornar qualquer outra coisa de um callback de ref agora será rejeitado pelo TypeScript. A correção geralmente é parar de usar retornos implícitos:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

O código original retornava a instância do`HTMLDivElement`, e o TypeScript não saberia se isso deveria ser uma função de limpeza ou não.

### `useRef`exige um argumento{/*useref-requires-argument*/}

_Esta alteração está incluída no preset de codemods`react-19`como[`refobject-defaults`](https://github.com/eps1lon/types-react-codemod/#refobject-defaults)._

Uma reclamação antiga sobre como o TypeScript e o React funcionam tem sido`useRef`. Mudamos os tipos para que`useRef`agora exija um argumento. Isso simplifica significativamente sua assinatura de tipo. Agora ele se comportará mais como`createContext`.

```ts
// @ts-expect-error: Esperado 1 argumento, mas nenhum foi visto
useRef();
// Passa
useRef(undefined);
// @ts-expect-error: Esperado 1 argumento, mas nenhum foi visto
createContext();
// Passa
createContext(undefined);
```

Isso agora também significa que todos os refs são mutáveis. Você não encontrará mais o problema onde não pode mutar um ref porque você o inicializou com`null`:

```ts
const ref = useRef<number>(null);

// Não é possível atribuir a 'current', pois é uma propriedade somente leitura
ref.current = 1;
```

`MutableRef`agora está descontinuado em favor de um único tipo`RefObject`, que`useRef`sempre retornará:

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef`ainda tem uma sobrecarga de conveniência para`useRef<T>(null)`, que retorna automaticamente`RefObject<T | null>`Para facilitar a migração devido ao argumento obrigatório para`useRef`, uma sobrecarga de conveniência para`useRef(undefined)`foi adicionada, que retorna automaticamente`RefObject<T | undefined>`.

Confira[[RFC] Tornar todos os refs mutáveis](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772)para discussões anteriores sobre essa mudança.

### Alterações no tipo`ReactElement`TypeScript{/*changes-to-the-reactelement-typescript-type*/}

_Esta alteração está incluída no codemod[`react-element-default-any-props`](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props)._

O`props`de elementos React agora tem como padrão`unknown`em vez de`any`se o elemento for tipado como`ReactElement`. Isso não afeta você se você passar um argumento de tipo para`ReactElement`:

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

Mas se você dependia do padrão, agora você tem que lidar com`unknown`:

```ts
type Example = ReactElement["props"];
//   ^? Antes, era 'any', agora 'unknown'
```

Você só deve precisar disso se tiver muito código legado dependendo de acesso não seguro às props do elemento. A introspecção de elementos existe apenas como uma saída de emergência, e você deve deixar explícito que seu acesso às props é inseguro através de um explícito`any`.

### O namespace JSX no TypeScript{/*the-jsx-namespace-in-typescript*/}
Esta alteração está incluída no preset de`react-19`codemod como[`scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx)

Um pedido antigo é remover o`JSX`global em favor de`React.JSX`. Isso ajuda a prevenir a poluição de tipos globais, o que evita conflitos entre diferentes bibliotecas de UI que utilizam JSX.

Agora você precisará envolver a ampliação de módulo do namespace JSX em `declare module "....":`

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

O especificador exato do módulo depende do runtime JSX que você especificou no`compilerOptions`do seu`tsconfig.json`:

- Para`"jsx": "react-jsx"`seria`react/jsx-runtime`.
- Para`"jsx": "react-jsxdev"`seria`react/jsx-dev-runtime`.
- Para`"jsx": "react"`e`"jsx": "preserve"`seria`react`.

### Melhor`useReducer`tipagem{/*better-usereducer-typings*/}

`useReducer`agora tem inferência de tipo aprimorada graças a[@mfp22](https://github.com/mfp22).

No entanto, isso exigiu uma alteração que quebra a compatibilidade, onde`useReducer`não aceita o tipo completo do reducer como parâmetro de tipo, mas em vez disso, ou não precisa de nenhum (e confia na tipagem contextual) ou precisa do tipo de estado e ação.

A nova melhor prática é_não_passar argumentos de tipo para`useReducer`.
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer(reducer)
```
Isso pode não funcionar em casos extremos onde você pode tipar explicitamente o estado e a ação, passando o`Action`em uma tupla:
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer<State, [Action]>(reducer)
```
Se você definir o reducer inline, nós encorajamos a anotar os parâmetros da função em vez disso:
```diff
- useReducer<React.Reducer<State, Action>>((state, action) => state)
+ useReducer((state: State, action: Action) => state)
```
Isso também é o que você teria que fazer se mover o reducer para fora da chamada`useReducer`de:

```ts
const reducer = (state: State, action: Action) => state;
```

## Changelog{/*changelog*/}

### Outras alterações que quebram a compatibilidade{/*other-breaking-changes*/}

- **react-dom**: Erro para URLs javascript em`src`e`href` [#26507](https://github.com/facebook/react/pull/26507)
- **react-dom**: Remover`errorInfo.digest`de`onRecoverableError` [#28222](https://github.com/facebook/react/pull/28222)
- **react-dom**: Remover`unstable_flushControlled` [#26397](https://github.com/facebook/react/pull/26397)
- **react-dom**: Remover`unstable_createEventHandle` [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: Remover`unstable_renderSubtreeIntoContainer` [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: Remover`unstable_runWithPriority` [#28271](https://github.com/facebook/react/pull/28271)
- **react-is**: Remover métodos descontinuados de`react-is` [28224](https://github.com/facebook/react/pull/28224)

### Outras mudanças notáveis{/*other-notable-changes*/}

- **react**: Filas síncronas em lote, padrão e contínuas[#25700](https://github.com/facebook/react/pull/25700)
- **react**: Não pré-renderizar irmãos de componentes suspensos[#26380](https://github.com/facebook/react/pull/26380)
- **react**: Detectar loops de atualização infinita causados por atualizações na fase de renderização[#26625](https://github.com/facebook/react/pull/26625)
- **react-dom**: Transições em popstate agora são síncronas[#26025](https://github.com/facebook/react/pull/26025)
- **react-dom**: Remover aviso de layout effect durante SSR[#26395](https://github.com/facebook/react/pull/26395)
- **react-dom**: Avisar e não definir string vazia para src/href (exceto tags de âncora)[#28124](https://github.com/facebook/react/pull/28124)

Para uma lista completa de alterações, por favor, veja o[Changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md#1900-december-5-2024).

---

Agradecimentos a[Andrew Clark](https://twitter.com/acdlite),[Eli White](https://twitter.com/Eli_White),[Jack Pope](https://github.com/jackpope),[Jan Kassens](https://github.com/kassens),[Josh Story](https://twitter.com/joshcstory),[Matt Carroll](https://twitter.com/mattcarrollcode),[Noah Lemen](https://twitter.com/noahlemen),[Sophie Alpert](https://twitter.com/sophiebits), e[Sebastian Silbermann](https://twitter.com/sebsilbermann)por revisar e editar esta postagem.