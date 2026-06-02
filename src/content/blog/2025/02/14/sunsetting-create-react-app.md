---
title: "Sunsetting Create React App"
author: Matt Carroll and Ricky Hanlon
date: 2025/02/14
description: Hoje, estamos descontinuando o Create React App para novos aplicativos e incentivando os aplicativos existentes a migrar para um framework ou para uma ferramenta de build como Vite, Parcel ou RSBuild. Também estamos fornecendo documentação para quando um framework não é uma boa opção para o seu projeto, você deseja criar seu próprio framework ou apenas deseja aprender como o React funciona construindo um aplicativo React do zero.
---

14 de fevereiro de 2025 por [Matt Carroll](https://twitter.com/mattcarrollcode) e [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Intro>

Hoje, estamos descontinuando o [Create React App](https://create-react-app.dev/) para novos aplicativos, e encorajando os aplicativos existentes a migrarem para um [framework](#how-to-migrate-to-a-framework), ou para [migrarem para uma ferramenta de build](#how-to-migrate-to-a-build-tool) como Vite, Parcel ou RSBuild.

Estamos também fornecendo documentação para quando um framework não for adequado para o seu projeto, você quiser construir seu próprio framework, ou apenas quiser aprender como o React funciona [construindo um aplicativo React do zero](/learn/build-a-react-app-from-scratch).

</Intro>

-----

Quando lançamos o Create React App em 2016, não havia uma maneira clara de construir um novo aplicativo React.

Para criar um aplicativo React, você tinha que instalar um monte de ferramentas e configurá-las manualmente para suportar recursos básicos como JSX, linting e hot reloading. Isso era muito complicado de fazer corretamente, então a [comunidade](https://github.com/react-boilerplate/react-boilerplate) [criou](https://github.com/kriasoft/react-starter-kit) [starter kits](https://github.com/petehunt/react-boilerplate) para [configurações comuns](https://github.com/gaearon/react-hot-boilerplate) [e](https://github.com/erikras/react-redux-universal-hot-example). No entanto, os starter kits eram difíceis de atualizar e a fragmentação tornava difícil para o React lançar novos recursos.

O Create React App resolveu esses problemas combinando várias ferramentas em uma única configuração recomendada. Isso permitiu que os aplicativos tivessem uma maneira simples de atualizar para novos recursos de ferramentas e permitiu que a equipe do React implantasse mudanças de ferramentas não triviais (suporte ao Fast Refresh, regras de linting para React Hooks) para o público mais amplo possível.

Este modelo se tornou tão popular que existe uma categoria inteira de ferramentas funcionando dessa maneira hoje.

## Descontinuando o Create React App {/*deprecating-create-react-app*/}

Embora o Create React App facilite o início, [existem várias limitações](#limitations-of-build-tools) que dificultam a construção de aplicativos de produção de alta performance. Em princípio, poderíamos resolver esses problemas essencialmente evoluindo-o para um [framework](#why-we-recommend-frameworks).

No entanto, como o Create React App atualmente não tem mantenedores ativos, e já existem muitos frameworks que resolvem esses problemas, decidimos descontinuar o Create React App.

A partir de hoje, se você instalar um novo aplicativo, verá um aviso de descontinuação:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

create-react-app está descontinuado.
{'\n\n'}
Você pode encontrar uma lista de frameworks React atualizados em react.dev
Para mais informações, veja: react.dev/link/cra
{'\n\n'}
Esta mensagem de erro só será exibida uma vez por instalação.

</ConsoleLogLine>
</ConsoleBlockMulti>

Também adicionamos um aviso de descontinuação ao [site](https://create-react-app.dev/) e ao [repositório](https://github.com/facebook/create-react-app) do Create React App. O Create React App continuará funcionando em modo de manutenção, e publicamos uma nova versão do Create React App para funcionar com o React 19.

## Como Migrar para um Framework {/*how-to-migrate-to-a-framework*/}
Recomendamos [criar novos aplicativos React](/learn/creating-a-react-app) com um framework. Todos os frameworks que recomendamos suportam renderização do lado do cliente ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)) e aplicativos de página única ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)), e podem ser implantados em um CDN ou serviço de hospedagem estática sem um servidor.

Para aplicativos existentes, estes guias ajudarão você a migrar para uma SPA apenas do lado do cliente:

* [Guia de migração do Next.js do Create React App](https://nextjs.org/docs/app/building-your-application/upgrading/from-create-react-app)
* [Guia de adoção de framework do React Router](https://reactrouter.com/upgrading/component-routes).
* [Guia de migração do Expo webpack para Expo Router](https://docs.expo.dev/router/migrate/from-expo-webpack/)

## Como Migrar para uma Ferramenta de Build {/*how-to-migrate-to-a-build-tool*/}

Se seu aplicativo tiver restrições incomuns, ou você preferir resolver esses problemas construindo seu próprio framework, ou apenas quiser aprender como o React funciona do zero, você pode criar sua própria configuração personalizada com React usando Vite, Parcel ou Rsbuild.

Para aplicativos existentes, estes guias ajudarão você a migrar para uma ferramenta de build:

* [Guia de migração do Vite do Create React App](https://www.robinwieruch.de/vite-create-react-app/)
* [Guia de migração do Parcel do Create React App](https://parceljs.org/migration/cra/)
* [Guia de migração do Rsbuild do Create React App](https://rsbuild.dev/guide/migration/cra)

Para ajudar a começar com Vite, Parcel ou Rsbuild, adicionamos novas documentações para [Construindo um Aplicativo React do Zero](/learn/build-a-react-app-from-scratch).

<DeepDive>

#### Preciso de um framework? {/*do-i-need-a-framework*/}

A maioria dos aplicativos se beneficiaria de um framework, mas existem casos válidos para construir um aplicativo React do zero. Uma boa regra geral é que, se seu aplicativo precisa de roteamento, você provavelmente se beneficiará de um framework.

Assim como o Svelte tem o Sveltekit, o Vue tem o Nuxt, e o Solid tem o SolidStart, [o React recomenda o uso de um framework](#why-we-recommend-frameworks) que integre totalmente o roteamento em recursos como data-fetching e code-splitting prontos para uso. Isso evita o incômodo de ter que escrever suas próprias configurações complexas e, essencialmente, construir um framework para si mesmo.

No entanto, você sempre pode [construir um aplicativo React do zero](/learn/build-a-react-app-from-scratch) usando uma ferramenta de build como Vite, Parcel ou Rsbuild.

</DeepDive>

Continue lendo para saber mais sobre as [limitações das ferramentas de build](#limitations-of-build-tools) e [por que recomendamos frameworks](#why-we-recommend-frameworks).

## Limitações das Ferramentas de Build {/*limitations-of-build-tools*/}

O Create React App e ferramentas de build como ele facilitam o início da construção de um aplicativo React. Após executar `npx create-react-app my-app`, você obtém um aplicativo React totalmente configurado com um servidor de desenvolvimento, linting e um build de produção.

Por exemplo, se você estiver construindo uma ferramenta administrativa interna, pode começar com uma página inicial:

```js
export default function App() {
  return (
    <div>
      <h1>Bem-vindo à Ferramenta Administrativa!</h1>
    </div>
  )
}
```

Isso permite que você comece imediatamente a codificar em React com recursos como JSX, regras de linting padrão e um bundler para rodar tanto em desenvolvimento quanto em produção. No entanto, essa configuração não possui as ferramentas que você precisa para construir um aplicativo de produção real.

A maioria dos aplicativos de produção precisa de soluções para problemas como roteamento, data fetching e code splitting.

### Roteamento {/*routing*/}

O Create React App não inclui uma solução de roteamento específica. Se você está apenas começando, uma opção é usar `useState` para alternar entre rotas. Mas fazer isso significa que você não pode compartilhar links para seu aplicativo - cada link iria para a mesma página - e a estruturação do seu aplicativo se torna difícil ao longo do tempo:

```js
import {useState} from 'react';

import Home from './Home';
import Dashboard from './Dashboard';

export default function App() {
  // ❌ O roteamento no estado não cria URLs
  const [route, setRoute] = useState('home');
  return (
    <div>
      {route === 'home' && <Home />}
      {route === 'dashboard' && <Dashboard />}
    </div>
  )
}
```

É por isso que a maioria dos aplicativos que usam o Create React App resolvem adicionando roteamento com uma biblioteca de roteamento como [React Router](https://reactrouter.com/) ou [Tanstack Router](https://tanstack.com/router/latest). Com uma biblioteca de roteamento, você pode adicionar rotas adicionais ao aplicativo, o que fornece opiniões sobre a estrutura do seu aplicativo e permite que você comece a compartilhar links para rotas. Por exemplo, com o React Router você pode definir rotas:

```js
import {RouterProvider, createBrowserRouter} from 'react-router';

import Home from './Home';
import Dashboard from './Dashboard';

// ✅ Cada rota tem sua própria URL
const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/dashboard', element: <Dashboard />}
]);

export default function App() {
  return (
    <RouterProvider value={router} />
  )
}
```

Com essa mudança, você pode compartilhar um link para `/dashboard` e o aplicativo navegará para a página do dashboard. Uma vez que você tenha uma biblioteca de roteamento, você pode adicionar recursos adicionais como rotas aninhadas, guards de rota e transições de rota, que são difíceis de implementar sem uma biblioteca de roteamento.

Há um trade-off sendo feito aqui: a biblioteca de roteamento adiciona complexidade ao aplicativo, mas também adiciona recursos que são difíceis de implementar sem ela.

### Data Fetching {/*data-fetching*/}

Outro problema comum no Create React App é o data fetching. O Create React App não inclui uma solução específica de data fetching. Se você está apenas começando, uma opção comum é usar `fetch` em um effect para carregar dados.

Mas fazer isso significa que os dados são buscados após o componente ser renderizado, o que pode causar "network waterfalls". Network waterfalls são causadas por buscar dados quando seu aplicativo é renderizado em vez de em paralelo enquanto o código está sendo baixado:

```js
export default function Dashboard() {
  const [data, setData] = useState(null);

  // ❌ Buscar dados em um componente causa network waterfalls
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

Buscar em um effect significa que o usuário tem que esperar mais para ver o conteúdo, mesmo que os dados pudessem ter sido buscados mais cedo. Para resolver isso, você pode usar uma biblioteca de data fetching como [TanStack Query](https://tanstack.com/query/), [SWR](https://swr.vercel.app/), [Apollo](https://www.apollographql.com/docs/react) ou [Relay](https://relay.dev/) que fornecem opções para pré-buscar dados para que a requisição seja iniciada antes que o componente seja renderizado.

Essas bibliotecas funcionam melhor quando integradas ao seu padrão de "loader" de roteamento para especificar dependências de dados no nível da rota, o que permite que o roteador otimize suas buscas de dados:

```js
export async function loader() {
  const response = await fetch(`/api/data`);
  const data = await response.json();
  return data;
}

// ✅ Buscar dados em paralelo enquanto o código está sendo baixado
export default function Dashboard({loaderData}) {
  return (
    <div>
      {loaderData.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

Na carga inicial, o roteador pode buscar os dados imediatamente antes que a rota seja renderizada. Conforme o usuário navega pelo aplicativo, o roteador é capaz de buscar tanto os dados quanto a rota ao mesmo tempo, paralelizando as buscas. Isso reduz o tempo necessário para ver o conteúdo na tela e pode melhorar a experiência do usuário.

No entanto, isso requer a configuração correta dos loaders em seu aplicativo e troca complexidade por performance.

### Code Splitting {/*code-splitting*/}

Outro problema comum no Create React App é o [code splitting](https://www.patterns.dev/vanilla/bundle-splitting). O Create React App não inclui uma solução específica de code splitting. Se você está apenas começando, pode não considerar o code splitting.

Isso significa que seu aplicativo é enviado como um único bundle:

```txt
- bundle.js    75kb
```

Mas para performance ideal, você deve "dividir" seu código em bundles separados para que o usuário só precise baixar o que ele precisa. Isso diminui o tempo que o usuário precisa esperar para carregar seu aplicativo, baixando apenas o código que ele precisa para ver a página em que está.

```txt
- core.js      25kb
- home.js      25kb
- dashboard.js 25kb
```

Uma maneira de fazer code-splitting é com `React.lazy`. No entanto, isso significa que o código não é buscado até que o componente seja renderizado, o que pode causar network waterfalls. Uma solução mais otimizada é usar um recurso do roteador que busca o código em paralelo enquanto o código está sendo baixado. Por exemplo, o React Router fornece uma opção `lazy` para especificar que uma rota deve ser dividida em código e otimizar quando ela é carregada:

```js
import Home from './Home';
import Dashboard from './Dashboard';

// ✅ As rotas são baixadas antes da renderização
const router = createBrowserRouter([
  {path: '/', lazy: () => import('./Home')},
  {path: '/dashboard', lazy: () => import('Dashboard')}
]);
```

O code-splitting otimizado é complicado de acertar, e é fácil cometer erros que podem fazer com que o usuário baixe mais código do que precisa. Funciona melhor quando integrado com suas soluções de roteador e carregamento de dados para maximizar o cache, paralelizar buscas e suportar padrões de ["import on interaction"](https://www.patterns.dev/vanilla/import-on-interaction).

### E mais... {/*and-more*/}

Estes são apenas alguns exemplos das limitações do Create React App.

Depois de integrar roteamento, data fetching e code splitting, você agora também precisa considerar estados pendentes, interrupções de navegação, mensagens de erro para o usuário e revalidação dos dados. Existem categorias inteiras de problemas que os usuários precisam resolver, como:

<div style={{display: 'flex', width: '100%', justifyContent: 'space-around'}}>
  <ul>
    <li>Acessibilidade</li>
    <li>Carregamento de assets</li>
    <li>Autenticação</li>
    <li>Cache</li>
  </ul>
  <ul>
    <li>Tratamento de erros</li>
    <li>Mutação de dados</li>
    <li>Navegações</li>
    <li>Atualizações otimistas</li>
  </ul>
  <ul>
    <li>Melhoria progressiva</li>
    <li>Renderização do lado do servidor</li>
    <li>Geração de site estático</li>
    <li>Streaming</li>
  </ul>
</div>

Todos esses elementos trabalham juntos para criar a [sequência de carregamento](https://www.patterns.dev/vanilla/loading-sequence) mais otimizada.

Resolver cada um desses problemas individualmente no Create React App pode ser difícil, pois cada problema está interconectado com os outros e pode exigir profundo conhecimento em áreas problemáticas com as quais os usuários podem não estar familiarizados. Para resolver esses problemas, os usuários acabam construindo suas próprias soluções personalizadas sobre o Create React App, que era o problema que o Create React App originalmente tentava resolver.

## Por que Recomendamos Frameworks {/*why-we-recommend-frameworks*/}

Embora você possa resolver todas essas peças sozinho em uma ferramenta de build como Create React App, Vite ou Parcel, é difícil fazer isso bem. Assim como o Create React App integrou várias ferramentas de build, você precisa de uma ferramenta para integrar todos esses recursos para fornecer a melhor experiência aos usuários.

Esta categoria de ferramentas que integra ferramentas de build, renderização, roteamento, data fetching e code splitting são conhecidas como "frameworks" -- ou se você preferir chamar o próprio React de framework, você pode chamá-los de "metaframeworks".

Frameworks impõem algumas opiniões sobre a estruturação do seu aplicativo para fornecer uma experiência de usuário muito melhor, da mesma forma que as ferramentas de build impõem algumas opiniões para facilitar o uso das ferramentas. É por isso que começamos a recomendar frameworks como [Next.js](https://nextjs.org/), [React Router](https://reactrouter.com/) e [Expo](https://expo.dev/) para novos projetos.

Frameworks fornecem a mesma experiência de início que o Create React App, mas também fornecem soluções para problemas que os usuários precisam resolver de qualquer maneira em aplicativos de produção reais.

<DeepDive>

#### Renderização do servidor é opcional {/*server-rendering-is-optional*/}

Os frameworks que recomendamos oferecem a opção de criar um aplicativo de [renderização do lado do cliente (CSR)](https://developer.mozilla.org/en-US/docs/Glossary/CSR).

Em alguns casos, CSR é a escolha certa para uma página, mas muitas vezes não é. Mesmo que a maior parte do seu aplicativo seja do lado do cliente, muitas vezes existem páginas individuais que poderiam se beneficiar de recursos de renderização do lado do servidor, como [geração de site estático (SSG)](https://developer.mozilla.org/en-US/docs/Glossary/SSG) ou [renderização do lado do servidor (SSR)](https://developer.mozilla.org/en-US/docs/Glossary/SSR), por exemplo, uma página de Termos de Serviço ou documentação.

A renderização do lado do servidor geralmente envia menos JavaScript para o cliente, e um documento HTML completo que produz um [First Contentful Paint (FCP)](https://web.dev/articles/fcp) mais rápido, reduzindo o [Total Blocking Time (TBD)](https://web.dev/articles/tbt), o que também pode diminuir o [Interaction to Next Paint (INP)](https://web.dev/articles/inp). É por isso que a [equipe do Chrome tem incentivado](https://web.dev/articles/rendering-on-the-web) os desenvolvedores a considerar a renderização estática ou do lado do servidor em vez de uma abordagem totalmente do lado do cliente para alcançar o melhor desempenho possível.

Existem trade-offs no uso de um servidor, e nem sempre é a melhor opção para todas as páginas. Gerar páginas no servidor incorre em custos adicionais e leva tempo para gerar, o que pode aumentar o [Time to First Byte (TTFB)](https://web.dev/articles/ttfb). Os aplicativos com melhor desempenho são capazes de escolher a estratégia de renderização correta por página, com base nos trade-offs de cada estratégia.

Frameworks oferecem a opção de usar um servidor em qualquer página, se você quiser, mas não forçam você a usar um servidor. Isso permite que você escolha a estratégia de renderização correta para cada página em seu aplicativo.

#### E os Server Components? {/*server-components*/}

Os frameworks que recomendamos também incluem suporte para React Server Components.

Server Components ajudam a resolver esses problemas movendo o roteamento e o data fetching para o servidor, e permitindo que o code splitting seja feito para componentes do cliente com base nos dados que você renderiza, em vez de apenas na rota renderizada, e reduzindo a quantidade de JavaScript enviado para a melhor [sequência de carregamento](https://www.patterns.dev/vanilla/loading-sequence) possível.

Server Components não requerem um servidor. Eles podem ser executados no momento da compilação em seu servidor de CI para criar um aplicativo gerado estaticamente (SSG), ou em tempo de execução em um servidor web para um aplicativo renderizado no servidor (SSR).

Veja [Introdução aos React Server Components com tamanho zero de bundle](/blog/2020/12/21/data-fetching-with-react-server-components) e [a documentação](/reference/rsc/server-components) para mais informações.

</DeepDive>

<Note>

#### Renderização do servidor não é apenas para SEO {/*server-rendering-is-not-just-for-seo*/}

Um mal-entendido comum é que a renderização do lado do servidor é apenas para [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO).

Embora a renderização do lado do servidor possa melhorar o SEO, ela também melhora o desempenho ao reduzir a quantidade de JavaScript que o usuário precisa baixar e analisar antes que ele possa ver o conteúdo na tela.

É por isso que a [equipe do Chrome tem incentivado](https://web.dev/articles/rendering-on-the-web) os desenvolvedores a considerar a renderização estática ou do lado do servidor em vez de uma abordagem totalmente do lado do cliente para alcançar o melhor desempenho possível.

</Note>

---

_Agradecemos a [Dan Abramov](https://bsky.app/profile/danabra.mov) por criar o Create React App, e a [Joe Haddad](https://github.com/Timer), [Ian Schmitz](https://github.com/ianschmitz), [Brody McKee](https://github.com/mrmckeb), e [muitos outros](https://github.com/facebook/create-react-app/graphs/contributors) por manter o Create React App ao longo dos anos. Agradecemos a [Brooks Lybrand](https://bsky.app/profile/brookslybrand.bsky.social), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Devon Govett](https://bsky.app/profile/devongovett.bsky.social), [Eli White](https://x.com/Eli_White), [Jack Herrington](https://bsky.app/profile/jherr.dev), [Joe Savona](https://x.com/en_JS), [Lauren Tan](https://bsky.app/profile/no.lol), [Lee Robinson](https://x.com/leeerob), [Mark Erikson](https://bsky.app/profile/acemarke.dev), [Ryan Florence](https://x.com/ryanflorence), [Sophie Alpert](https://bsky.app/profile/sophiebits.com), [Tanner Linsley](https://bsky.app/profile/tannerlinsley.com), e [Theo Browne](https://x.com/theo) por revisar e fornecer feedback sobre esta postagem._