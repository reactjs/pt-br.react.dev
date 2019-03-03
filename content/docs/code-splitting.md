---
id: code-splitting
title: Dividindo o Código (Code-Splitting)
permalink: docs/code-splitting.html
---

## Empacotamento (Bundling) {#bundling}

A maioria das aplicações React serão "empacotados" usando ferramentas como
[Webpack](https://webpack.js.org/) ou [Browserify](http://browserify.org/).
Empacotamento (Bundling) é o processo onde vários arquivos importados são unidos
em um único arquivo: um "pacote" (bundle). Este pacote pode ser incluído em uma página web
para carregar uma aplicação toda de uma vez.

#### Exemplo {#example}

**App:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundle:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> Nota:
>
> Seu pacote provavelmente será bem diferente que o mostrado acima.

Se você estiver usando o [Create React App](https://github.com/facebookincubator/create-react-app), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/) ou alguma outra ferramenta semelhante, você terá uma configuração do Webpack pronta para empacotar a sua aplicação.

Se não estiver usando, precisará configurar o empacotamento manualmente. Por exemplo, veja os guias de
[Instalação](https://webpack.js.org/guides/installation/) e
[Introdução](https://webpack.js.org/guides/getting-started/) na documentação do Webpack.

## Dividindo o Código (Code Splitting) {#code-splitting}

Empacotamento é excelente, mas à medida que sua aplicação cresce, seu pacote crescerá também. Especialmente
se você estiver usando grandes bibliotecas de terceiros. Você precisa ficar de olho em todo código que está
incluindo no seu pacote, pois assim você evitará que o mesmo fique tão grande que faça sua aplicação levar
um tempo maior para carregar.

Para não terminar ficando com um pacote grande, é bom se antecipar ao problema e começar
a dividir seu pacote. [Divisão de Código (Code-Splitting)](https://webpack.js.org/guides/code-splitting/) é
um recurso suportado por empacotadores como Webpack e Browserify (através de [coeficiente de empacotamento (factor-bundle)](https://github.com/browserify/factor-bundle)) no qual pode-se criar múltiplos pacotes que podem ser carregados dinamicamente em tempo de execução.

Dividir o código de sua aplicação pode te ajudar a carregar somente o necessário ao usuário, o que pode melhorar dramaticamente o desempenho de sua aplicação. Embora você não tenha reduzido a quantidade total de código de sua aplicação, você evitou carregar código que o usuário talvez nunca precise e reduziu o código inicial necessário durante o carregamento.

## `import()` {#import}

A melhor forma de introduzir a divisão de código em sua aplicação é através da sintaxe dinâmica `import()`.

**Antes:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**Depois:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

> Nota:
>
> A sintaxe dinâmica `import()` é uma [proposta](https://github.com/tc39/proposal-dynamic-import)
> ECMAScript (JavaScript) que ainda não faz parte da linguagem.
> Espera-se que seja aceita em breve.

Quando o Webpack encontra esta esta sintaxe, automaticamente ele divide o código de sua aplicação.
Se você está usando o Create React App, isto já está configurado e você pode
[começar a usá-lo](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting) imediatamente. Também é suportado por padrão no [Next.js](https://github.com/zeit/next.js/#dynamic-import).

Se você está configurando o Webpack manualmente, provavelmente vai querer ler o
[guia de divisão de código](https://webpack.js.org/guides/code-splitting/) do Webpack. Sua configuração do Webpack deverá ser parecido [com isto](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Ao usar o [Babel](https://babeljs.io/), você precisa se certificar que o Babel consegue analizar a sintaxe de importação dinâmica mas não está a transformando. Para isso, você precisará do [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

> Nota:
>
> `React.lazy` e Suspense não estão disponíveis para renderização no lado servidor. Se você deseja fazer divisão de código em uma aplicação renderizada no servidor, nós recomendamos [Componentes Carregáveis](https://github.com/smooth-code/loadable-components). Ele possui um ótimo [guia para divisão de pacotes com renderização no servidor](https://github.com/smooth-code/loadable-components/blob/master/packages/server/README.md).

A função do `React.lazy` é permitir a você renderizar uma importação dinâmica como se fosse um componente comum.

**Antes:**

```js
import OtherComponent from './OtherComponent';

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

**Depois:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

Isto automaticamente carregará o pacote contendo o `OtherComponent` quando este componente for renderizado.

`React.lazy` recebe uma função que deve retornar um `import()`. Este último retorna uma `Promise` que é resolvida para um módulo com uma exportação `default` que contém um componente React.

### Suspense {#suspense}

If the module containing the `OtherComponent` is not yet loaded by the time `MyComponent` renders, we must show some fallback content while we're waiting for it to load - such as a loading indicator. This is done using the `Suspense` component.

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

The `fallback` prop accepts any React elements that you want to render while waiting for the component to load. You can place the `Suspense` component anywhere above the lazy component. You can even wrap multiple lazy components with a single `Suspense` component.

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### Error boundaries {#error-boundaries}

If the other module fails to load (for example, due to network failure), it will trigger an error. You can handle these errors to show a nice user experience and manage recovery with [Error Boundaries](/docs/error-boundaries.html). Once you've created your Error Boundary, you can use it anywhere above your lazy components to display an error state when there's a network error.

```js
import MyErrorBoundary from './MyErrorBoundary';
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## Route-based code splitting {#route-based-code-splitting}

Deciding where in your app to introduce code splitting can be a bit tricky. You
want to make sure you choose places that will split bundles evenly, but won't
disrupt the user experience.

A good place to start is with routes. Most people on the web are used to
page transitions taking some amount of time to load. You also tend to be
re-rendering the entire page at once so your users are unlikely to be
interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using
libraries like [React Router](https://reacttraining.com/react-router/) with `React.lazy`.

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

## Named Exports {#named-exports}

`React.lazy` currently only supports default exports. If the module you want to import uses named exports, you can create an intermediate module that reexports it as the default. This ensures that treeshaking keeps working and that you don't pull in unused components.

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
