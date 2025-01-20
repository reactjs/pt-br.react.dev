---
title: "React Labs: O que Estamos Trabalhando – Fevereiro de 2024"
author: Joseph Savona, Ricky Hanlon, Andrew Clark, Matt Carroll e Dan Abramov
date: 2024/02/15
description: Em postagens do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa última atualização e gostaríamos de compartilhar nosso progresso.
---

15 de fevereiro de 2024 por [Joseph Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode) e [Dan Abramov](https://twitter.com/dan_abramov).

---

<Intro>

Em postagens do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa [última atualização](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023) e gostaríamos de compartilhar nosso progresso.

</Intro>

<Note>

React Conf 2024 está agendada para os dias 15 e 16 de maio em Henderson, Nevada! Se você está interessado em participar do React Conf pessoalmente, pode [se inscrever na loteria de ingressos](https://forms.reform.app/bLaLeE/react-conf-2024-ticket-lottery/1aRQLK) até 28 de fevereiro. 

Para mais informações sobre ingressos, streaming gratuito, patrocínio e mais, veja [o site do React Conf](https://conf.react.dev).

</Note>

---

## Compilador do React {/*react-compiler*/}

O Compilador do React não é mais um projeto de pesquisa: o compilador agora alimenta instagram.com em produção e estamos trabalhando para implementar o compilador em superfícies adicionais na Meta e para preparar o primeiro lançamento de código aberto.

Como discutido em nosso [post anterior](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler), o React pode *às vezes* re-renderizar demais quando o estado muda. Desde os primeiros dias do React, nossa solução para tais casos tem sido a memoização manual. Em nossas APIs atuais, isso significa aplicar as APIs [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback) e [`memo`](/reference/react/memo) para ajustar manualmente o quanto o React re-renderiza nas mudanças de estado. Mas a memoização manual é um compromisso. Ela polui nosso código, é fácil de errar e requer trabalho extra para manter atualizada.

A memoização manual é um compromisso razoável, mas não estávamos satisfeitos. Nossa visão é que o React re-renderize *automaticamente* apenas as partes certas da UI quando o estado muda, *sem comprometer o modelo mental central do React*. Acreditamos que a abordagem do React — UI como uma função simples do estado, com valores e expressões JavaScript padrão — é uma parte fundamental do motivo pelo qual o React tem sido acessível para tantos desenvolvedores. É por isso que investimos na construção de um compilador otimizador para o React.

JavaScript é uma linguagem notoriamente desafiadora para otimizar, graças às suas regras flexíveis e natureza dinâmica. O Compilador do React é capaz de compilar código com segurança modelando tanto as regras do JavaScript *quanto* as "regras do React". Por exemplo, componentes do React devem ser idempotentes — retornando o mesmo valor dados os mesmos inputs — e não podem mutar props ou valores de estado. Essas regras limitam o que os desenvolvedores podem fazer e ajudam a criar um espaço seguro para o compilador otimizar.

Claro, entendemos que os desenvolvedores às vezes dobram um pouco as regras, e nosso objetivo é fazer o Compilador do React funcionar fora da caixa na maior parte do código possível. O compilador tenta detectar quando o código não segue estritamente as regras do React e, geralmente, compilará o código onde for seguro ou pulará a compilação se não for seguro. Estamos testando contra a ampla e variada base de código da Meta para ajudar a validar esta abordagem.

Para desenvolvedores que estão curiosos sobre como garantir que seu código siga as regras do React, recomendamos [habilitar o Modo Estrito](/reference/react/StrictMode) e [configurar o plugin ESLint do React](/learn/editor-setup#linting). Essas ferramentas podem ajudar a capturar erros sutis em seu código React, melhorando a qualidade de suas aplicações hoje e preparando suas aplicações para recursos futuros, como o Compilador do React. Também estamos trabalhando em documentação consolidada sobre as regras do React e atualizações para nosso plugin ESLint para ajudar as equipes a entender e aplicar essas regras para criar aplicações mais robustas.

Para ver o compilador em ação, você pode conferir nossa [palestra do outono passado](https://www.youtube.com/watch?v=qOQClO3g8-Y). Na época da palestra, tínhamos dados experimentais iniciais de como o Compilador do React funcionou em uma página do instagram.com. Desde então, implementamos o compilador em produção em instagram.com. Também expandimos nossa equipe para acelerar a implementação em superfícies adicionais na Meta e para código aberto. Estamos empolgados com o caminho à frente e teremos mais novidades para compartilhar nos próximos meses.

## Ações {/*actions*/}

Nós [compartilhamos anteriormente](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) que estávamos explorando soluções para enviar dados do cliente para o servidor com Ações do Servidor, para que você possa executar mutações de banco de dados e implementar formulários. Durante o desenvolvimento das Ações do Servidor, estendemos essas APIs para suportar manuseio de dados em aplicações apenas do cliente também.

Nos referimos a esta coleção mais ampla de recursos simplesmente como "Ações". Ações permitem que você passe uma função para elementos DOM, como [`<form/>`](/reference/react-dom/components/form):

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Pesquisar</button>
</form>
```

A função `action` pode operar de forma síncrona ou assíncrona. Você pode defini-las no lado do cliente usando JavaScript padrão ou no servidor com a diretiva [`'use server'`](/reference/rsc/use-server). Ao usar uma ação, o React gerenciará o ciclo de vida da submissão de dados para você, fornecendo hooks como [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) e [`useActionState`](/reference/react/useActionState) para acessar o estado atual e a resposta da ação do formulário.

Por padrão, as Ações são enviadas dentro de uma [transição](/reference/react/useTransition), mantendo a página atual interativa enquanto a ação está sendo processada. Como as Ações suportam funções assíncronas, também adicionamos a capacidade de usar `async/await` em transições. Isso permite que você mostre a UI pendente com o estado `isPending` de uma transição quando uma solicitação assíncrona, como `fetch`, começa, e mostre a UI pendente durante toda a atualização sendo aplicada.

Junto com as Ações, estamos introduzindo um recurso chamado [`useOptimistic`](/reference/react/useOptimistic) para gerenciar atualizações de estado otimista. Com este hook, você pode aplicar atualizações temporárias que são revertidas automaticamente assim que o estado final é confirmado. Para as Ações, isso permite que você defina otimisticamente o estado final dos dados no cliente, assumindo que a submissão seja bem-sucedida, e reverta para o valor dos dados recebidos do servidor. Funciona usando `async`/`await` regular, então funciona da mesma forma se você estiver usando `fetch` no cliente ou uma Ação do Servidor no servidor.

Autores de bibliotecas podem implementar props customizados `action={fn}` em seus próprios componentes com `useTransition`. Nossa intenção é que as bibliotecas adotem o padrão de Ações ao projetar suas APIs de componente, para fornecer uma experiência consistente para desenvolvedores React. Por exemplo, se sua biblioteca fornece um componente `<Calendar onSelect={eventHandler}>`, considere também expor uma API `<Calendar selectAction={action}>`.

Embora inicialmente tenhamos nos concentrado nas Ações do Servidor para a transferência de dados entre cliente e servidor, nossa filosofia para o React é fornecer o mesmo modelo de programação em todas as plataformas e ambientes. Quando possível, se introduzirmos um recurso no cliente, nosso objetivo é fazê-lo funcionar também no servidor, e vice-versa. Essa filosofia nos permite criar um único conjunto de APIs que funcionam não importa onde seu aplicativo é executado, facilitando a atualização para diferentes ambientes mais tarde.

As Ações já estão disponíveis no canal Canary e serão lançadas na próxima versão do React.

## Novos Recursos no React Canary {/*new-features-in-react-canary*/}

Introduzimos [React Canaries](/blog/2023/05/03/react-canaries) como uma opção para adotar novos recursos estáveis individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável semver. 

Os Canaries representam uma mudança na maneira como desenvolvemos o React. Anteriormente, os recursos eram pesquisados e construídos privativamente dentro da Meta, então os usuários só veriam o produto final polido quando lançado para Estável. Com os Canaries, estamos construindo em público com a ajuda da comunidade para finalizar recursos que compartilhamos na série de blogs do React Labs. Isso significa que você ouve sobre novos recursos mais cedo, enquanto estão sendo finalizados, ao invés de depois de estarem completos.

Componentes do Servidor React, Carregamento de Ativos, Metadados de Documentos e Ações já aterrissaram no React Canary, e adicionamos documentação para esses recursos em react.dev:

- **Diretivas**: [`"use client"`](/reference/rsc/use-client) e [`"use server"`](/reference/rsc/use-server) são recursos do bundler projetados para frameworks full-stack do React. Eles marcam os "pontos de divisão" entre os dois ambientes: `"use client"` instrui o bundler a gerar uma tag `<script>` (como [Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island)), enquanto `"use server"` diz ao bundler para gerar um endpoint POST (como [tRPC Mutations](https://trpc.io/docs/concepts)). Juntas, elas permitem que você escreva componentes reutilizáveis que combinam interatividade do lado do cliente com a lógica correspondente do lado do servidor.

- **Metadados de Documentos**: adicionamos suporte embutido para renderizar [`<title>`](/reference/react-dom/components/title), [`<meta>`](/reference/react-dom/components/meta) e tags de metadados [`<link>`](/reference/react-dom/components/link) em qualquer lugar da sua árvore de componentes. Esses funcionam da mesma maneira em todos os ambientes, incluindo código totalmente do lado do cliente, SSR e RSC. Isso fornece suporte embutido para recursos pioneiros por bibliotecas como [React Helmet](https://github.com/nfl/react-helmet).

- **Carregamento de Ativos**: integramos o Suspense com o ciclo de vida de carregamento de recursos, como folhas de estilo, fontes e scripts, de modo que o React os considere ao determinar se o conteúdo em elementos como [`<style>`](/reference/react-dom/components/style), [`<link>`](/reference/react-dom/components/link) e [`<script>`](/reference/react-dom/components/script) está pronto para ser exibido. Também adicionamos novas [APIs de Carregamento de Recursos](/reference/react-dom#resource-preloading-apis) como `preload` e `preinit` para fornecer maior controle sobre quando um recurso deve ser carregado e inicializado.

- **Ações**: Como mencionado acima, adicionamos Ações para gerenciar o envio de dados do cliente para o servidor. Você pode adicionar `action` a elementos como [`<form/>`](/reference/react-dom/components/form), acessar o status com [`useFormStatus`](/reference/react-dom/hooks/useFormStatus), lidar com o resultado com [`useActionState`](/reference/react/useActionState) e atualizar a UI de maneira otimista com [`useOptimistic`](/reference/react/useOptimistic).

Como todos esses recursos funcionam juntos, é difícil lançá-los no canal Estável individualmente. Lançar Ações sem os hooks complementares para acessar estados de formulários limitariam a usabilidade prática das Ações. Introduzir Componentes do Servidor React sem integrar Ações do Servidor complicaria a modificação de dados no servidor. 

Antes que possamos lançar um conjunto de recursos no canal Estável, precisamos garantir que eles funcionem de forma coesa e que os desenvolvedores tenham tudo o que precisam para usá-los em produção. Os Canaries do React nos permitem desenvolver esses recursos individualmente e lançar as APIs estáveis de forma incremental até que o conjunto completo de recursos esteja completo.

O conjunto atual de recursos no React Canary está completo e pronto para lançamento.

## A Próxima Versão Principal do React {/*the-next-major-version-of-react*/}

Após alguns anos de iteração, `react@canary` agora está pronto para ser lançado em `react@latest`. Os novos recursos mencionados acima são compatíveis com qualquer ambiente em que seu aplicativo funcione, fornecendo tudo o que é necessário para uso em produção. Como Carregamento de Ativos e Metadados de Documentos podem ser uma mudança significativa para alguns aplicativos, a próxima versão do React será uma versão principal: **React 19**.

Ainda há mais a ser feito para se preparar para o lançamento. No React 19, também estamos adicionando melhorias há muito solicitadas que exigem mudanças significativas, como suporte a Web Components. Nosso foco agora é implementar essas mudanças, preparar para o lançamento, finalizar a documentação dos novos recursos e publicar anúncios sobre o que está incluído.

Compartilharemos mais informações sobre tudo o que o React 19 inclui, como adotar os novos recursos do cliente e como construir suporte para Componentes do Servidor React nos próximos meses.

## Offscreen (renomeado para Activity). {/*offscreen-renamed-to-activity*/}

Desde nossa última atualização, renomeamos uma funcionalidade que estamos pesquisando de “Offscreen” para “Activity”. O nome “Offscreen” implicava que se aplicava apenas a partes do aplicativo que não eram visíveis, mas, enquanto pesquisávamos o recurso, percebemos que é possível que partes do aplicativo estejam visíveis e inativas, como conteúdo atrás de um modal. O novo nome reflete mais de perto o comportamento de marcar certas partes do aplicativo como “ativas” ou “inativas”.

A Activity ainda está em pesquisa e nosso trabalho remanescente é finalizar os primitivas que são expostos para desenvolvedores de bibliotecas. Repriorizamos essa área enquanto focamos em lançar recursos que estão mais completos.

* * *

Além desta atualização, nossa equipe tem se apresentado em conferências e feito aparições em podcasts para falar mais sobre nosso trabalho e responder perguntas.

- [Sathya Gunasekaran](/community/team#sathya-gunasekaran) falou sobre o Compilador do React na conferência [React India](https://www.youtube.com/watch?v=kjOacmVsLSE)

- [Dan Abramov](/community/team#dan-abramov) deu uma palestra na [RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s) intitulada “React from Another Dimension”, que explora uma história alternativa de como os Componentes do Servidor React e as Ações poderiam ter sido criados

- [Dan Abramov](/community/team#dan-abramov) foi entrevistado no [podcast JS Party do Changelog](https://changelog.com/jsparty/311) sobre Componentes do Servidor React

- [Matt Carroll](/community/team#matt-carroll) foi entrevistado no [podcast Front-End Fire](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll) onde discutiu [The Two Reacts](https://overreacted.io/the-two-reacts/)

Agradecemos a [Lauren Tan](https://twitter.com/potetotes), [Sophie Alpert](https://twitter.com/sophiebits), [Jason Bonta](https://threads.net/someextent), [Eli White](https://twitter.com/Eli_White) e [Sathya Gunasekaran](https://twitter.com/_gsathya) por revisarem este post.

Obrigado por ler e [veja você no React Conf](https://conf.react.dev/)!