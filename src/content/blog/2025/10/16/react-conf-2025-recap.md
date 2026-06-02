---
title: "React Conf 2025 Recap"
author: Matt Carroll and Ricky Hanlon
date: 2025/10/16
description: Na semana passada, sediamos a React Conf 2025. Neste post, resumimos as palestras e anúncios do evento...
---

16 de Outubro de 2025 por [Matt Carroll](https://x.com/mattcarrollcode) e [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Intro>

Na semana passada, realizamos a React Conf 2025, onde anunciamos a [React Foundation](/blog/2025/10/07/introducing-the-react-foundation) e apresentamos novos recursos para React e React Native.

</Intro>

---

A React Conf 2025 foi realizada nos dias 7 e 8 de outubro de 2025, em Henderson, Nevada.

As transmissões completas do [dia 1](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s) e do [dia 2](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s) estão disponíveis online, e você pode ver fotos do evento [aqui](https://conf.react.dev/photos).

Nesta postagem, resumiremos as palestras e anúncios do evento.


## Keynote do Dia 1 {/*day-1-keynote*/}

_Assista à transmissão completa do dia 1 [aqui.](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s)_

No keynote do dia 1, Joe Savona compartilhou as atualizações da equipe e da comunidade desde a última React Conf e os destaques do React 19.0 e 19.1.

Mofei Zhang destacou os novos recursos do React 19.2, incluindo:
* [`<Activity />`](https://react.dev/reference/react/Activity) — um novo componente para gerenciar a visibilidade.
* [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent) para disparar eventos de Effects.
* [Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks) — uma nova ferramenta de profiling no DevTools.
* [Partial Pre-Rendering](https://react.dev/blog/2025/10/01/react-19-2#partial-pre-rendering) para pré-renderizar parte de um aplicativo com antecedência e retomar a renderização mais tarde.

Jack Pope anunciou novos recursos no Canary, incluindo:

* [`<ViewTransition />`](https://react.dev/reference/react/ViewTransition) — um novo componente para animar transições de página.
* [Fragment Refs](https://react.dev/reference/react/Fragment#fragmentinstance) — uma nova maneira de interagir com os nós do DOM encapsulados por um Fragment.

Lauren Tan anunciou o [React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1) e recomendou que todos os aplicativos usem o React Compiler para obter benefícios como:
* [Memoização automática](/learn/react-compiler/introduction#what-does-react-compiler-do) que entende o código React.
* [Novas regras de lint](/learn/react-compiler/installation#eslint-integration) alimentadas pelo React Compiler para ensinar as melhores práticas.
* [Suporte padrão](/learn/react-compiler/installation#basic-setup) para novos aplicativos em Vite, Next.js e Expo.
* [Guias de migração](/learn/react-compiler/incremental-adoption) para aplicativos existentes migrando para o React Compiler.

Finalmente, Seth Webster anunciou a [React Foundation](/blog/2025/10/07/introducing-the-react-foundation) para supervisionar o desenvolvimento e a comunidade de código aberto do React.

Assista ao dia 1 aqui:

<YouTubeIframe src="https://www.youtube.com/embed/zyVRg2QR6LA?si=z-8t_xCc12HwGJH_&t=1067s" />

## Keynote do Dia 2 {/*day-2-keynote*/}

_Assista à transmissão completa do dia 2 [aqui.](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s)_

Jorge Cohen e Nicola Corti iniciaram o dia 2 destacando o incrível crescimento do React Native com 4 milhões de downloads semanais (100% de crescimento YoY), e algumas migrações notáveis de aplicativos de Shopify, Zalando e HelloFresh, aplicativos premiados como RISE, RUNNA e Partyful, e aplicativos de IA de Mistral, Replit e v0.

Riccardo Cipolleschi compartilhou dois grandes anúncios para o React Native:
- [React Native 0.82 será apenas Nova Arquitetura](https://reactnative.dev/blog/2025/10/08/react-native-0.82#new-architecture-only)
- [Suporte experimental ao Hermes V1](https://reactnative.dev/blog/2025/10/08/react-native-0.82#experimental-hermes-v1)

Ruben Norte e Alex Hunt encerraram o keynote anunciando:
- [Novas APIs DOM alinhadas com a Web](https://reactnative.dev/blog/2025/10/08/react-native-0.82#dom-node-apis) para melhor compatibilidade com o React na Web.
- [Novas APIs de Performance](https://reactnative.dev/blog/2025/10/08/react-native-0.82#web-performance-apis-canary) com um novo painel de rede e aplicativo desktop.

Assista ao dia 2 aqui:

<YouTubeIframe src="https://www.youtube.com/embed/p9OcztRyDl0?si=qPTHftsUE07cjZpS&t=2299s" />


## Palestras da Equipe React {/*react-team-talks*/}

Durante a conferência, houve palestras da equipe React, incluindo:
* [Async React Parte I](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=10907s) e [Parte II](https://www.youtube.com/watch?v=p9OcztRyDl0&t=29073s) [(Ricky Hanlon)](https://x.com/rickhanlonii) mostrou o que é possível usando os últimos 10 anos de inovação.
* [Explorando a Performance do React](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=20274s) [(Joe Savona)](https://x.com/en_js) apresentou os resultados de nossa pesquisa de performance do React.
* [Reimaginando Listas no React Native](https://www.youtube.com/watch?v=p9OcztRyDl0&t=10382s) [(Luna Wei)](https://x.com/lunaleaps) introduziu o Virtual View, um novo primitivo para listas que gerencia a visibilidade com renderização baseada em modo (oculto/pré-renderizado/visível).
* [Profiling com React Performance Tracks](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=8276s) [(Ruslan Lesiutin)](https://x.com/ruslanlesiutin) mostrou como usar os novos React Performance Tracks para depurar problemas de performance e construir ótimos aplicativos.
* [React Strict DOM](https://www.youtube.com/watch?v=p9OcztRyDl0&t=9026s) [(Nicolas Gallagher)](https://nicolasgallagher.com/) falou sobre a abordagem da Meta para usar código web em aplicativos nativos.
* [View Transitions e Activity](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=4870s) [(Chance Strickland)](https://x.com/chancethedev) — Chance trabalhou com a equipe React para mostrar como usar `<Activity />` e `<ViewTransition />` para construir animações rápidas e com sensação nativa.
* [Caso você tenha perdido o comunicado](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=9525s) [(Cody Olsen)](https://bsky.app/profile/codey.bsky.social) - Cody trabalhou com a equipe React para adotar o Compiler no Sanity Studio e compartilhou como foi.
## Palestras de Frameworks React {/*react-framework-talks*/}

A segunda metade do dia 2 contou com uma série de palestras de equipes de Frameworks React, incluindo:

* [React Native, Amplificado](https://www.youtube.com/watch?v=p9OcztRyDl0&t=5737s) por [Giovanni Laquidara](https://x.com/giolaq) e [Eric Fahsl](https://x.com/efahsl).
* [React Everywhere: Trazendo React para Aplicativos Nativos](https://www.youtube.com/watch?v=p9OcztRyDl0&t=18213s) por [Mike Grabowski](https://x.com/grabbou).
* [Como o Parcel Empacota React Server Components](https://www.youtube.com/watch?v=p9OcztRyDl0&t=19538s) por [Devon Govett](https://x.com/devonovett).
* [Projetando Transições de Página](https://www.youtube.com/watch?v=p9OcztRyDl0&t=20640s) por [Delba de Oliveira](https://x.com/delba_oliveira).
* [Construa Rápido, Implante Mais Rápido — Expo em 2025](https://www.youtube.com/watch?v=p9OcztRyDl0&t=21350s) por [Evan Bacon](https://x.com/baconbrix).
* [A Abordagem do React Router para RSC](https://www.youtube.com/watch?v=p9OcztRyDl0&t=22367s) por [Kent C. Dodds](https://x.com/kentcdodds).
* [RedwoodSDK: Web Standards Encontram Full-Stack React](https://www.youtube.com/watch?v=p9OcztRyDl0&t=24992s) por [Peter Pistorius](https://x.com/appfactory) e [Aurora Scharff](https://x.com/aurorascharff).
* [TanStack Start](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26065s) por [Tanner Linsley](https://x.com/tannerlinsley).

## Perguntas e Respostas {/*q-and-a*/}
Houve três painéis de Perguntas e Respostas durante a conferência:

* [Q&A da Equipe React na Meta](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=26304s) apresentado por [Shruti Kapoor](https://x.com/shrutikapoor08)
* [Q&A de Frameworks React](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26812s) apresentado por [Jack Herrington](https://x.com/jherr)
* [Painel React e IA](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=18741s) apresentado por [Lee Robinson](https://x.com/leerob)

## E mais... {/*and-more*/}

Também ouvimos palestras da comunidade, incluindo:
* [Construindo um Servidor MCP](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24204s) por [James Swinton](https://x.com/JamesSwintonDev) ([AG Grid](https://www.ag-grid.com/?utm_source=react-conf&utm_medium=react-conf-homepage&utm_campaign=react-conf-sponsorship-2025))
* [E-mails Modernos usando React](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=25521s) por [Zeno Rocha](https://x.com/zenorocha) ([Resend](https://resend.com/))
* [Por que Aplicativos React Native Geram Todo o Dinheiro](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24917s) por [Perttu Lähteenlahti](https://x.com/plahteenlahti) ([RevenueCat](https://www.revenuecat.com/))
* [O Ofício Invisível de uma Ótima UX](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=23400s) por [Michał Dudak](https://x.com/michaldudak) ([MUI](https://mui.com/))

## Agradecimentos {/*thanks*/}

Agradecemos a toda a equipe, palestrantes e participantes que tornaram a React Conf 2025 possível. Há muitos para listar, mas queremos agradecer a alguns em particular.

Obrigado a [Matt Carroll](https://x.com/mattcarrollcode) por planejar todo o evento e construir o site da conferência.

Obrigado a [Michael Chan](https://x.com/chantastic) por apresentar a React Conf com incrível dedicação e energia, entregando introduções de palestrantes atenciosas, piadas divertidas e entusiasmo genuíno durante todo o evento. Obrigado a [Jorge Cohen](https://x.com/JorgeWritesCode) por hospedar a transmissão ao vivo, entrevistar cada palestrante e trazer a experiência presencial da React Conf para o online.

Obrigado a [Mateusz Kornacki](https://x.com/mat_kornacki), [Mike Grabowski](https://x.com/grabbou), [Kris Lis](https://www.linkedin.com/in/krzysztoflisakakris/) e à equipe da [Callstack](https://www.callstack.com/) por co-organizarem a React Conf e fornecerem suporte de design, engenharia e marketing. Obrigado à equipe da [ZeroSlope](https://zeroslopevents.com/contact-us/): Sunny Leggett, Tracey Harrison, Tara Larish, Whitney Pogue e Brianne Smythia por ajudarem a organizar o evento.

Obrigado a [Jorge Cabiedes Acosta](https://github.com/jorge-cab), [Gijs Weterings](https://x.com/gweterings), [Tim Yung](https://x.com/yungsters) e [Jason Bonta](https://x.com/someextent) por trazerem perguntas do Discord para a transmissão ao vivo. Obrigado a [Lynn Yu](https://github.com/lynnshaoyu) por liderar a moderação do Discord. Obrigado a [Seth Webster](https://x.com/sethwebster) por nos dar as boas-vindas todos os dias; e a [Christopher Chedeau](https://x.com/vjeux