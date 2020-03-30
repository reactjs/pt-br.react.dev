---
id: code-splitting
title: Dividindo o Código (Code-Splitting)
permalink: docs/code-splitting.html
---

## Empacotamento (Bundling) {#bundling}

A maioria das aplicações React serão "empacotadas" usando ferramentas como
[Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) ou 
[Browserify](http://browserify.org/).
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

Para evitar acabar com um pacote grande, é bom se antecipar ao problema e começar
a "dividir" seu pacote. A divisão de código é um recurso
suportado por empacotadores como [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) e Browserify (através de [coeficiente de empacotamento (factor-bundle)](https://github.com/browserify/factor-bundle)) no qual pode-se criar múltiplos pacotes que podem ser carregados dinamicamente em tempo de execução.

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

Quando o Webpack encontra esta sintaxe, automaticamente ele divide o código de sua aplicação.
Se você está usando o Create React App, isto já está configurado e você pode
[começar a usá-lo](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting) imediatamente. Também é suportado por padrão no [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

Se você está configurando o Webpack manualmente, provavelmente vai querer ler o
[guia de divisão de código](https://webpack.js.org/guides/code-splitting/) do Webpack. Sua configuração do Webpack deverá ser parecida [com isto](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Ao usar o [Babel](https://babeljs.io/), você precisa se certificar que o Babel consegue analizar a sintaxe de importação dinâmica mas não está a transformando. Para isso, você precisará do [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

> Nota:
>
> `React.lazy` e Suspense não estão disponíveis para renderização no lado servidor. Se você deseja fazer divisão de código em uma aplicação renderizada no servidor, nós recomendamos o pacote [Loadable Components](https://github.com/gregberge/loadable-components). Ele possui um ótimo [guia para divisão de pacotes com renderização no servidor](https://loadable-components.com/loadable-components/docs/server-side-rendering/).

A função do `React.lazy` é permitir a você renderizar uma importação dinâmica como se fosse um componente comum.

**Antes:**

```js
import OtherComponent from './OtherComponent';
```

**Depois:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

Isto automaticamente carregará o pacote contendo o `OtherComponent` quando este componente é renderizado pela primeira vez.

`React.lazy` recebe uma função que deve retornar um `import()`. Este último retorna uma `Promise` que é resolvida para um módulo com um `export default` que contém um componente React.

O componente lazy pode ser renderizado dentro de um componente `Suspense`, o que no permite mostrar algum conteúdo de fallback (como um indicador de carregamento) enquanto aguardamos o carregamento do componente lazy.

```js
import React, { Suspense } from 'react';

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

A prop `fallback` aceita qualquer elemento React que você deseja renderizar enquanto se espera o componente ser carregado. Você pode colocar o componente `Suspense` em qualquer lugar acima do componente dinâmico. Você pode até mesmo ter vários componentes dinâmicos envolvidos em um único componente `Suspense`.

```js
import React, { Suspense } from 'react';

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

Se algum outro módulo não for carregado (por exemplo, devido a uma falha na conexão), será disparado um erro. Você pode manusear estes erros para mostrar uma ótima experiência de usuário e gerenciar a recuperação através de [Error Boundaries](/docs/error-boundaries.html). Uma vez que tenha criado seu Error Boundary, você pode usá-lo em qualquer lugar acima de seus componentes dinâmicos para exibir uma mensagem de erro quando houver uma falha de conexão.

```js
import React, { Suspense } from 'react';
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

## Divisão de Código Baseada em Rotas {#route-based-code-splitting}

Decidir onde introduzir a divisão de código em sua aplicação pode ser um pouco complicado. Você
precisa ter certeza de escolher locais que dividirão os pacotes de forma uniforme, mas que não
interrompa a experiência do usuário.

Um bom lugar para começar é nas rotas. A maioria das pessoas na web estão acostumadas com
transições entre páginas que levam algum tempo para carregar. Você também tende a
re-renderizar toda a página de uma só vez para que seus usuários não interajam com outros elementos na página ao mesmo tempo.

Aqui está um exemplo de como configurar a divisão de código baseada em rotas na sua aplicação usando
bibliotecas como o [React Router](https://reacttraining.com/react-router/) com `React.lazy`.

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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

## Exportações Nomeadas {#named-exports}

`React.lazy` atualmente suporta apenas `export default`. Se o módulo que você deseja importar usa exportações nomeadas, você pode criar um módulo intermediário que usa `export default`. Isso garante que o `tree shaking` continue funcionando e que você não importe componentes não utilizados.

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
