---
title: "React Labs: O Que Temos Trabalhado – Fevereiro de 2024"
author: Joseph Savona, Ricky Hanlon, Andrew Clark, Matt Carroll e Dan Abramov
date: 2024/02/15
description: Nos posts do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa última atualização e gostaríamos de compartilhar nosso progresso.
---

15 de fevereiro de 2024 por [Joseph Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode) e [Dan Abramov](https://twitter.com/dan_abramov).

---

<Intro>

Nos posts do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa [última atualização](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023) e gostaríamos de compartilhar nosso progresso.

</Intro>

<Note>

React Conf 2024 está agendada para 15–16 de maio em Henderson, Nevada! Se você estiver interessado em participar da React Conf pessoalmente, pode [se inscrever para o sorteio de ingressos](https://forms.reform.app/bLaLeE/react-conf-2024-ticket-lottery/1aRQLK) até 28 de fevereiro. 

Para mais informações sobre ingressos, streaming gratuito, patrocínio e mais, veja [o site da React Conf](https://conf.react.dev).

</Note>

---

## React Compiler {/*react-compiler*/}

O React Compiler não é mais um projeto de pesquisa: o compilador agora alimenta instagram.com em produção, e estamos trabalhando para implementar o compilador em superfícies adicionais na Meta e preparar a primeira versão de código aberto.

Como discutido em nosso [post anterior](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler), o React pode *às vezes* re-renderizar demais quando o estado muda. Desde os primeiros dias do React, nossa solução para tais casos tem sido a memorização manual. Em nossas APIs atuais, isso significa aplicar as APIs [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback) e [`memo`](/reference/react/memo) para ajustar manualmente o quanto o React re-renderiza em mudanças de estado. Mas a memorização manual é um compromisso. Ela polui nosso código, é fácil de errar e requer trabalho extra para manter atualizada.

A memorização manual é um compromisso razoável, mas não estávamos satisfeitos. Nossa visão é que o React *automaticamente* re-renderize apenas as partes certas da UI quando o estado muda, *sem comprometer o núcleo do modelo mental do React*. Acreditamos que a abordagem do React — UI como uma simples função do estado, com valores e ideias padrão do JavaScript — é uma parte fundamental do porquê o React tem sido acessível para tantos desenvolvedores. É por isso que investimos na construção de um compilador otimizador para o React.

JavaScript é uma linguagem notoriamente desafiadora para otimizar, graças às suas regras flexíveis e natureza dinâmica. O React Compiler é capaz de compilar código de forma segura modelando tanto as regras do JavaScript *quanto* as "regras do React". Por exemplo, componentes do React devem ser idempotentes — retornando o mesmo valor dados os mesmos inputs — e não podem mutar props ou valores de estado. Essas regras limitam o que os desenvolvedores podem fazer e ajudam a criar um espaço seguro para o compilador otimizar.

Claro, entendemos que os desenvolvedores às vezes flexibilizam um pouco as regras, e nosso objetivo é fazer o React Compiler funcionar fora da caixa em o maior número possível de códigos. O compilador tenta detectar quando o código não segue estritamente as regras do React e irá compilar o código onde for seguro ou pular a compilação se não for seguro. Estamos testando contra a grande e variada base de código da Meta para ajudar a validar essa abordagem.

Para desenvolvedores que estão curiosos sobre como garantir que seu código siga as regras do React, recomendamos [ativar o Modo Estrito](/reference/react/StrictMode) e [configurar o plugin ESLint do React](/learn/editor-setup#linting). Essas ferramentas podem ajudar a capturar bugs sutis em seu código React, melhorando a qualidade de suas aplicações hoje e preparando suas aplicações para recursos futuros, como o React Compiler. Também estamos trabalhando em uma documentação consolidada das regras do React e atualizações para nosso plugin ESLint para ajudar as equipes a entender e aplicar essas regras para criar aplicações mais robustas.

Para ver o compilador em ação, você pode conferir nossa [apresentação do outono passado](https://www.youtube.com/watch?v=qOQClO3g8-Y). Na época da apresentação, tínhamos dados experimentais iniciais de tentar o React Compiler em uma página do instagram.com. Desde então, lançamos o compilador em produção em instagram.com. Também expandimos nossa equipe para acelerar a implementação em superfícies adicionais na Meta e em código aberto. Estamos empolgados com o caminho à frente e teremos mais a compartilhar nos próximos meses.

## Ações {/*actions*/}

Nós [compartilhamos anteriormente](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) que estávamos explorando soluções para enviar dados do cliente para o servidor com Ações do Servidor, para que você possa executar mutações de banco de dados e implementar formulários. Durante o desenvolvimento das Ações do Servidor, estendemos essas APIs para suportar o manuseio de dados em aplicações apenas do cliente também.

Nos referimos a essa coleção mais ampla de recursos como simplesmente "Ações". Ações permitem que você passe uma função para elementos do DOM, como [`<form/>`](/reference/react-dom/components/form):

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Buscar</button>
</form>
```

A função `action` pode operar de forma síncrona ou assíncrona. Você pode defini-las no lado do cliente usando JavaScript padrão ou no servidor com a diretiva [`'use server'`](/reference/rsc/use-server). Ao usar uma ação, o React gerenciará o ciclo de vida da submissão de dados para você, fornecendo hooks como [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) e [`useActionState`](/reference/react/useActionState) para acessar o estado atual e a resposta da ação do formulário.

Por padrão, as Ações são submetidas dentro de uma [transição](/reference/react/useTransition), mantendo a página atual interativa enquanto a ação está sendo processada. Como as Ações suportam funções assíncronas, também adicionamos a capacidade de usar `async/await` em transições. Isso permite que você mostre uma UI pendente com o estado `isPending` de uma transição quando uma solicitação assíncrona, como `fetch`, começa e mostre a UI pendente até que a atualização seja aplicada.

Junto com as Ações, estamos introduzindo um recurso chamado [`useOptimistic`](/reference/react/useOptimistic) para gerenciar atualizações de estado otimistas. Com esse hook, você pode aplicar atualizações temporárias que são revertidas automaticamente assim que o estado final é confirmado. Para as Ações, isso permite que você defina otimisticamente o estado final dos dados no cliente, assumindo que a submissão seja bem-sucedida, e reverta para o valor dos dados recebidos do servidor. Funciona usando o regular `async`/`await`, portanto funciona da mesma forma, seja utilizando `fetch` no cliente ou uma Ação do Servidor no servidor.

Autoras de bibliotecas podem implementar props customizados `action={fn}` em seus próprios componentes com `useTransition`. Nossa intenção é que bibliotecas adotem o padrão de Ações ao projetar suas APIs de componentes, para proporcionar uma experiência consistente para desenvolvedores React. Por exemplo, se sua biblioteca fornece um componente `<Calendar onSelect={eventHandler}>`, considere também expor uma API `<Calendar selectAction={action}>`.

Embora inicialmente tivéssemos focado nas Ações do Servidor para a transferência de dados entre cliente e servidor, nossa filosofia para o React é fornecer o mesmo modelo de programação em todas as plataformas e ambientes. Sempre que possível, se introduzirmos um recurso no cliente, nosso objetivo é fazê-lo funcionar também no servidor e vice-versa. Essa filosofia nos permite criar um único conjunto de APIs que funcionam em qualquer lugar em que seu aplicativo seja executado, facilitando a atualização para diferentes ambientes mais tarde.

As Ações já estão disponíveis no canal Canary e serão lançadas na próxima versão do React.

## Novos Recursos no React Canary {/*new-features-in-react-canary*/}

Introduzimos [React Canaries](/blog/2023/05/03/react-canaries) como uma opção para adotar recursos estáveis individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável semver. 

Os Canaries mudam a maneira como desenvolvemos o React. Anteriormente, os recursos eram pesquisados e construídos privadamente dentro da Meta, para que os usuários vissem apenas o produto final polido quando lançado para o Stable. Com os Canaries, estamos construindo em público com a ajuda da comunidade para finalizar os recursos que compartilhamos na série de blogs do React Labs. Isso significa que você ouve sobre novos recursos mais cedo, à medida que estão sendo finalizados em vez de depois que estão completos.

Os Componentes do Servidor React, Carregamento de Ativos, Metadados do Documento e Ações já foram implementados no React Canary, e adicionamos documentações para esses recursos em react.dev:

- **Diretivas**: [`"use client"`](/reference/rsc/use-client) e [`"use server"`](/reference/rsc/use-server) são recursos de empacotamento projetados para frameworks React de pilha completa. Eles marcam os "pontos de divisão" entre os dois ambientes: `"use client"` instrui o empacotador a gerar uma tag `<script>` (como [Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island)), enquanto `"use server"` diz ao empacotador para gerar um endpoint POST (como [tRPC Mutations](https://trpc.io/docs/concepts)). Juntas, elas permitem que você escreva componentes reutilizáveis que combinam interatividade do lado do cliente com a lógica do lado do servidor relacionada.

- **Metadados do Documento**: adicionamos suporte integrado para renderizar [`<title>`](/reference/react-dom/components/title), [`<meta>`](/reference/react-dom/components/meta) e tags de metadados [`<link>`](/reference/react-dom/components/link) em qualquer lugar da sua árvore de componentes. Esses funcionam da mesma forma em todos os ambientes, incluindo código totalmente do lado do cliente, SSR e RSC. Isso fornece suporte embutido para recursos pioneiros por bibliotecas como [React Helmet](https://github.com/nfl/react-helmet).

- **Carregamento de Ativos**: integramos o Suspense com o ciclo de vida de carregamento de recursos como folhas de estilo, fontes e scripts, de modo que o React os considere para determinar se o conteúdo em elementos como [`<style>`](/reference/react-dom/components/style), [`<link>`](/reference/react-dom/components/link) e [`<script>`](/reference/react-dom/components/script) está pronto para ser exibido. Também adicionamos novas [APIs de Carregamento de Recursos](/reference/react-dom#resource-preloading-apis) como `preload` e `preinit` para fornecer maior controle sobre quando um recurso deve carregar e inicializar.

- **Ações**: Como compartilhado acima, adicionamos Ações para gerenciar o envio de dados do cliente para o servidor. Você pode adicionar `action` a elementos como [`<form/>`](/reference/react-dom/components/form), acessar o status com [`useFormStatus`](/reference/react-dom/hooks/useFormStatus), lidar com o resultado com [`useActionState`](/reference/react/useActionState) e atualizar a UI otimisticamente com [`useOptimistic`](/reference/react/useOptimistic).

Como todos esses recursos funcionam juntos, é difícil lançá-los no canal Stable individualmente. Lançar Ações sem os hooks complementares para acessar os estados do formulário limitaria a usabilidade prática das Ações. Introduzir Componentes do Servidor React sem integrar Ações do Servidor complicaria a modificação de dados no servidor.

Antes de podermos lançar um conjunto de recursos no canal Stable, precisamos garantir que eles funcionem coesivamente e que os desenvolvedores tenham tudo que precisam para usá-los em produção. Os React Canaries nos permitem desenvolver esses recursos individualmente e lançar as APIs estáveis progressivamente até que todo o conjunto de recursos esteja completo.

O conjunto atual de recursos no React Canary está completo e pronto para lançamento.

## A Próxima Versão Principal do React {/*the-next-major-version-of-react*/}

Após alguns anos de iteração, `react@canary` agora está pronto para ser lançado como `react@latest`. Os novos recursos mencionados acima são compatíveis com qualquer ambiente em que seu aplicativo funcione, fornecendo tudo necessário para uso em produção. Como Carregamento de Ativos e Metadados do Documento podem ser uma mudança significativa para alguns aplicativos, a próxima versão do React será uma versão principal: **React 19**.

Ainda há mais a ser feito para se preparar para o lançamento. No React 19, também estamos adicionando melhorias há muito solicitadas que requerem mudanças significativas, como suporte a Web Components. Nosso foco agora é consolidar essas mudanças, preparar para o lançamento, finalizar a documentação para novos recursos e publicar anúncios sobre o que está incluído.

Compartilharemos mais informações sobre tudo que o React 19 inclui, como adotar os novos recursos do cliente e como construir suporte para Componentes do Servidor React nos próximos meses.

## Offscreen (renomeado para Activity). {/*offscreen-renamed-to-activity*/}

Desde nossa última atualização, renomeamos uma capacidade que estamos pesquisando de "Offscreen" para "Activity". O nome “Offscreen” implicava que se aplicava apenas às partes do aplicativo que não estavam visíveis, mas enquanto pesquisávamos o recurso percebemos que é possível que partes do aplicativo estejam visíveis e inativas, como conteúdo atrás de um modal. O novo nome reflete mais de perto o comportamento de marcar certas partes do aplicativo como "ativas" ou "inativas".

A atividade ainda está em pesquisa e nosso trabalho restante é finalizar os primitivos que são expostos aos desenvolvedores de bibliotecas. Depriorizamos essa área enquanto nos concentramos em lançar recursos que estão mais completos.

* * *

Além desta atualização, nossa equipe fez apresentações em conferências e participou de podcasts para falar mais sobre nosso trabalho e responder perguntas.

- [Sathya Gunasekaran](/community/team#sathya-gunasekaran) falou sobre o React Compiler na conferência [React India](https://www.youtube.com/watch?v=kjOacmVsLSE)

- [Dan Abramov](/community/team#dan-abramov) deu uma palestra na [RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s) intitulada “React from Another Dimension” que explora uma história alternativa de como os Componentes do Servidor React e Ações poderiam ter sido criados

- [Dan Abramov](/community/team#dan-abramov) foi entrevistado no [podcast JS Party do Changelog](https://changelog.com/jsparty/311) sobre os Componentes do Servidor React

- [Matt Carroll](/community/team#matt-carroll) foi entrevistado no [podcast Front-End Fire](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll) onde ele discutiu [Os Dois Reacts](https://overreacted.io/the-two-reacts/)

Obrigado [Lauren Tan](https://twitter.com/potetotes), [Sophie Alpert](https://twitter.com/sophiebits), [Jason Bonta](https://threads.net/someextent), [Eli White](https://twitter.com/Eli_White) e [Sathya Gunasekaran](https://twitter.com/_gsathya) por revisar este post.

Obrigado por ler, e [veja você na React Conf](https://conf.react.dev/)!