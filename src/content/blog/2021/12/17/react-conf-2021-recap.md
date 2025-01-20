---
title: "Recapitulação da React Conf 2021"
author: Jesslyn Tannady e Rick Hanlon
date: 2021/12/17
description: Na semana passada, realizamos a nossa 6ª React Conf. Em anos anteriores, usamos o palco da React Conf para anunciar mudanças inovadoras na indústria, como o React Native e os React Hooks. Este ano, compartilhamos nossa visão multiplataforma para o React, começando com o lançamento do React 18 e a adoção gradual das funcionalidades concorrentes.
---

17 de dezembro de 2021 por [Jesslyn Tannady](https://twitter.com/jtannady) e [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

Na semana passada, realizamos a nossa 6ª React Conf. Em anos anteriores, usamos o palco da React Conf para anunciar mudanças inovadoras na indústria, como [_React Native_](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/) e [_React Hooks_](https://reactjs.org/docs/hooks-intro.html). Este ano, compartilhamos nossa visão multiplataforma para o React, começando com o lançamento do React 18 e a adoção gradual das funcionalidades concorrentes.

</Intro>

---

Esta foi a primeira vez que a React Conf foi realizada online, e foi transmitida gratuitamente, traduzida para 8 idiomas diferentes. Participantes de todo o mundo se juntaram ao nosso Discord da conferência e ao evento de replay para acessibilidade em todos os fusos horários. Mais de 50.000 pessoas se registraram, com mais de 60.000 visualizações de 19 palestras e 5.000 participantes no Discord durante os dois eventos.

Todas as palestras estão [disponíveis para transmissão online](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa).

Aqui está um resumo do que foi compartilhado no palco:

## React 18 e funcionalidades concorrentes {/*react-18-and-concurrent-features*/}

Na palestra principal, compartilhamos nossa visão para o futuro do React começando com o React 18.

O React 18 adiciona o tão aguardado renderizador concorrente e atualizações para o Suspense sem mudanças drásticas que quebrariam a compatibilidade. Aplicativos podem atualizar para o React 18 e começar a adotar gradualmente funcionalidades concorrentes com um esforço equivalente a qualquer outro lançamento importante.

**Isso significa que não há modo concorrente, apenas funcionalidades concorrentes.**

Na palestra principal, também compartilhamos nossa visão para o Suspense, Componentes do Servidor, novos grupos de trabalho do React e nossa visão de longo prazo multiplataforma para o React Native.

Assista à palestra completa de [Andrew Clark](https://twitter.com/acdlite), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes) e [Rick Hanlon](https://twitter.com/rickhanlonii) aqui:

<YouTubeIframe src="https://www.youtube.com/embed/FZ0cG47msEk" />

## React 18 para Desenvolvedores de Aplicação {/*react-18-for-application-developers*/}

Na palestra principal, também anunciamos que o React 18 RC está disponível para teste agora. Dependendo de mais feedback, esta é a versão exata do React que publicaremos como estável no início do próximo ano.

Para experimentar o React 18 RC, atualize suas dependências:

```bash
npm install react@rc react-dom@rc
```

e troque para a nova API `createRoot`:

```js
// antes
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// depois
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
```

Para uma demonstração da atualização para o React 18, veja a palestra de [Shruti Kapoor](https://twitter.com/shrutikapoor08) aqui:

<YouTubeIframe src="https://www.youtube.com/embed/ytudH8je5ko" />

## Renderização em Streaming no Servidor com Suspense {/*streaming-server-rendering-with-suspense*/}

O React 18 também inclui melhorias no desempenho da renderização do lado do servidor usando Suspense.

A renderização em streaming no servidor permite gerar HTML a partir de componentes React no servidor e transmitir esse HTML para seus usuários. No React 18, você pode usar `Suspense` para dividir seu aplicativo em unidades independentes menores que podem ser transmitidas independentemente umas das outras, sem bloquear o restante do aplicativo. Isso significa que os usuários verão seu conteúdo mais cedo e poderão começar a interagir com ele muito mais rápido.

Para uma análise mais profunda, veja a palestra de [Shaundai Person](https://twitter.com/shaundai) aqui:

<YouTubeIframe src="https://www.youtube.com/embed/pj5N-Khihgc" />

## O primeiro grupo de trabalho do React {/*the-first-react-working-group*/}

Para o React 18, criamos nosso primeiro Grupo de Trabalho para colaborar com um painel de especialistas, desenvolvedores, mantenedores de bibliotecas e educadores. Juntos, trabalhamos para criar nossa estratégia de adoção gradual e refinar novas APIs, como `useId`, `useSyncExternalStore` e `useInsertionEffect`.

Para uma visão geral desse trabalho, veja a palestra de [Aakansha' Doshi](https://twitter.com/aakansha1216):

<YouTubeIframe src="https://www.youtube.com/embed/qn7gRClrC9U" />

## Ferramentas para Desenvolvedor React {/*react-developer-tooling*/}

Para apoiar as novas funcionalidades neste lançamento, também anunciamos a recém-formada equipe do React DevTools e um novo Profiler de Linha do Tempo para ajudar desenvolvedores a depurar suas aplicações React.

Para mais informações e uma demonstração das novas funcionalidades do DevTools, veja a palestra de [Brian Vaughn](https://twitter.com/brian_d_vaughn):

<YouTubeIframe src="https://www.youtube.com/embed/oxDfrke8rZg" />

## React sem memo {/*react-without-memo*/}

Olhando mais para o futuro, [Xuan Huang (黄玄)](https://twitter.com/Huxpro) compartilhou uma atualização da nossa pesquisa do React Labs em um compilador de auto-memoização. Confira esta palestra para mais informações e uma demonstração do protótipo do compilador:

<YouTubeIframe src="https://www.youtube.com/embed/lGEMwh32soc" />

## Palestra principal sobre a documentação do React {/*react-docs-keynote*/}

[Rachel Nabors](https://twitter.com/rachelnabors) iniciou uma seção de palestras sobre aprender e projetar com React com uma palestra sobre nosso investimento na nova documentação do React ([agora lançada como react.dev](/blog/2023/03/16/introducing-react-dev)):

<YouTubeIframe src="https://www.youtube.com/embed/mneDaMYOKP8" />

## E mais... {/*and-more*/}

**Também ouvimos palestras sobre aprender e projetar com React:**

* Debbie O'Brien: [Coisas que aprendi com a nova documentação do React](https://youtu.be/-7odLW_hG7s).
* Sarah Rainsberger: [Aprendendo no Navegador](https://youtu.be/5X-WEQflCL0).
* Linton Ye: [O ROI de Projetar com React](https://youtu.be/7cPWmID5XAk).
* Delba de Oliveira: [Playgrounds interativos com React](https://youtu.be/zL8cz2W0z34).

**Palestras das equipes de Relay, React Native e PyTorch:**

* Robert Balicki: [Reapresentando o Relay](https://youtu.be/lhVGdErZuN4).
* Eric Rozell e Steven Moyes: [React Native Desktop](https://youtu.be/9L4FFrvwJwY).
* Roman Rädle: [Aprendizado de Máquina no Dispositivo para React Native](https://youtu.be/NLj73vrc2I8)

**E palestras da comunidade sobre acessibilidade, ferramentas e Componentes do Servidor:**

* Daishi Kato: [React 18 para Bibliotecas de Armazenamento Externo](https://youtu.be/oPfSC5bQPR8).
* Diego Haz: [Construindo Componentes Acessíveis em React 18](https://youtu.be/dcm8fjBfro8).
* Tafu Nakazaki: [Componentes de Formulário Acessíveis em Japonês com React](https://youtu.be/S4a0QlsH0pU).
* Lyle Troxell: [Ferramentas de UI para artistas](https://youtu.be/b3l4WxipFsE).
* Helen Lin: [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks).

## Obrigado {/*thank-you*/}

Este foi nosso primeiro ano planejando uma conferência nós mesmos, e temos muitas pessoas a agradecer.

Primeiro, agradecemos a todos os nossos palestrantes [Aakansha Doshi](https://twitter.com/aakansha1216), [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://twitter.com/brian_d_vaughn), [Daishi Kato](https://twitter.com/dai_shi), [Debbie O'Brien](https://twitter.com/debs_obrien), [Delba de Oliveira](https://twitter.com/delba_oliveira), [Diego Haz](https://twitter.com/diegohaz), [Eric Rozell](https://twitter.com/EricRozell), [Helen Lin](https://twitter.com/wizardlyhel), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), [Linton Ye](https://twitter.com/lintonye), [Lyle Troxell](https://twitter.com/lyle), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Balicki](https://twitter.com/StatisticsFTW), [Roman Rädle](https://twitter.com/raedle), [Sarah Rainsberger](https://twitter.com/sarah11918), [Shaundai Person](https://twitter.com/shaundai), [Shruti Kapoor](https://twitter.com/shrutikapoor08), [Steven Moyes](https://twitter.com/moyessa), [Tafu Nakazaki](https://twitter.com/hawaiiman0), e [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Agradecemos a todos que ajudaram a fornecer feedback sobre as palestras, incluindo [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Eli White](https://twitter.com/Eli_White), [Joe Savona](https://twitter.com/en_JS), [Lauren Tan](https://twitter.com/potetotes), [Rachel Nabors](https://twitter.com/rachelnabors), e [Tim Yung](https://twitter.com/yungsters).

Agradecemos a [Lauren Tan](https://twitter.com/potetotes) por configurar o Discord da conferência e servir como nossa administradora do Discord.

Agradecemos a [Seth Webster](https://twitter.com/sethwebster) pelo feedback sobre a direção geral e por garantir que estivéssemos focados em diversidade e inclusão.

Agradecemos a [Rachel Nabors](https://twitter.com/rachelnabors) por liderar nosso esforço de moderação e [Aisha Blake](https://twitter.com/AishaBlake) por criar nosso guia de moderação, liderar nossa equipe de moderação, treinar os tradutores e moderadores e ajudar a moderar ambos os eventos.

Agradecemos aos nossos moderadores [Jesslyn Tannady](https://twitter.com/jtannady), [Suzie Grange](https://twitter.com/missuze), [Becca Bailey](https://twitter.com/beccaliz), [Luna Wei](https://twitter.com/lunaleaps), [Joe Previte](https://twitter.com/jsjoeio), [Nicola Corti](https://twitter.com/Cortinico), [Gijs Weterings](https://twitter.com/gweterings), [Claudio Procida](https://twitter.com/claudiopro), Julia Neumann, Mengdi Chen, Jean Zhang, Ricky Li, e [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Agradecemos a [Manjula Dube](https://twitter.com/manjula_dube), [Sahil Mhapsekar](https://twitter.com/apheri0) e Vihang Patel da [React India](https://www.reactindia.io/), e [Jasmine Xie](https://twitter.com/jasmine_xby), [QiChang Li](https://twitter.com/QCL15), e [YanLun Li](https://twitter.com/anneincoding) da [React China](https://twitter.com/ReactChina) por ajudarem a moderar nosso evento de replay e mantê-lo envolvente para a comunidade.

Agradecemos à Vercel por publicar seu [Kit de Início para Eventos Virtuais](https://vercel.com/virtual-event-starter-kit), que foi a base do site da conferência, e a [Lee Robinson](https://twitter.com/leeerob) e [Delba de Oliveira](https://twitter.com/delba_oliveira) por compartilharem sua experiência organizando o Next.js Conf.

Agradecemos a [Leah Silber](https://twitter.com/wifelette) por compartilhar sua experiência organizando conferências, aprendizados sobre a realização da [RustConf](https://rustconf.com/) e por seu livro [Event Driven](https://leanpub.com/eventdriven/) e os conselhos que contém para conduzir conferências.

Agradecemos a [Kevin Lewis](https://twitter.com/_phzn) e [Rachel Nabors](https://twitter.com/rachelnabors) por compartilhar suas experiências organizando a Women of React Conf.

Agradecemos a [Aakansha Doshi](https://twitter.com/aakansha1216), [Laurie Barth](https://twitter.com/laurieontech), [Michael Chan](https://twitter.com/chantastic) e [Shaundai Person](https://twitter.com/shaundai) por seus conselhos e ideias ao longo do planejamento.

Agradecemos a [Dan Lebowitz](https://twitter.com/lebo) por ajudar a projetar e construir o site e ingressos da conferência.

Agradecemos a Laura Podolak Waddell, Desmond Osei-Acheampong, Mark Rossi, Josh Toberman e outros da equipe de Produções de Vídeo do Facebook por gravarem os vídeos para a Palestra Principal e as palestras dos funcionários da Meta.

Agradecemos ao nosso parceiro HitPlay por ajudar a organizar a conferência, editar todos os vídeos da transmissão, traduzir todas as palestras e moderar o Discord em vários idiomas.

Finalmente, agradecemos a todos os nossos participantes por tornar esta uma grande React Conf!