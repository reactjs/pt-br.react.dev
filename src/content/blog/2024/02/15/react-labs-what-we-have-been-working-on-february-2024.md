---
title: "React Labs: No que Estamos Trabalhando – Fevereiro de 2024"
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

React Conf 2024 está agendada para os dias 15 e 16 de maio em Henderson, Nevada! Se você estiver interessado em participar do React Conf pessoalmente, pode [se inscrever na loteria de ingressos](https://forms.reform.app/bLaLeE/react-conf-2024-ticket-lottery/1aRQLK) até 28 de fevereiro. 

Para mais informações sobre ingressos, transmissão gratuita, patrocínios e mais, veja [o site do React Conf](https://conf.react.dev).

</Note>

---

## React Compiler {/*react-compiler*/}

O React Compiler não é mais um projeto de pesquisa: o compilador agora alimenta instagram.com em produção, e estamos trabalhando para disponibilizar o compilador em outras superfícies dentro da Meta e preparar o primeiro lançamento de código aberto.

Como discutido em nosso [post anterior](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler), o React *às vezes* re-renderiza demais quando o estado muda. Desde os primeiros dias do React, nossa solução para tais casos tem sido a memorização manual. Em nossas APIs atuais, isso significa aplicar as APIs [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback) e [`memo`](/reference/react/memo) para ajustar manualmente quanto o React re-renderiza nas mudanças de estado. Mas a memorização manual é um compromisso. Ela polui nosso código, é fácil de errar e requer trabalho extra para se manter atualizada.

A memorização manual é um compromisso razoável, mas não ficamos satisfeitos. Nossa visão é que o React *automaticamente* re-renderize apenas as partes certas da UI quando o estado muda, *sem comprometer o modelo mental central do React*. Acreditamos que a abordagem do React — UI como uma simples função do estado, com valores e idioms JavaScript padrão — é uma parte chave do motivo pelo qual o React tem sido acessível para tantos desenvolvedores. É por isso que investimos na construção de um compilador otimizador para o React.

JavaScript é uma linguagem notoriamente desafiadora para otimização, graças às suas regras soltas e natureza dinâmica. O React Compiler é capaz de compilar código de forma segura modelando tanto as regras do JavaScript *quanto* as “regras do React”. Por exemplo, componentes do React devem ser idempotentes — retornando o mesmo valor dado os mesmos insumos — e não podem modificar props ou valores de estado. Essas regras limitam o que os desenvolvedores podem fazer e ajudam a esculpir um espaço seguro para o compilador otimizar.

Claro, entendemos que os desenvolvedores às vezes flexibilizam um pouco as regras, e nosso objetivo é fazer com que o React Compiler funcione sem precisar de ajustes em o maior número possível de códigos. O compilador tenta detectar quando o código não segue estritamente as regras do React e irá compilar o código onde for seguro ou pular a compilação se não for seguro. Estamos testando contra a grande e variada base de código da Meta para ajudar a validar essa abordagem.

Para os desenvolvedores que estão curiosos sobre como garantir que seu código siga as regras do React, recomendamos [ativar o Modo Estrito](/reference/react/StrictMode) e [configurar o plugin ESLint do React](/learn/editor-setup#linting). Essas ferramentas podem ajudar a capturar bugs sutis em seu código React, melhorando a qualidade de suas aplicações hoje e preparando suas aplicações para recursos futuros, como o React Compiler. Também estamos trabalhando em uma documentação consolidada das regras do React e atualizações para nosso plugin ESLint para ajudar as equipes a entender e aplicar essas regras para criar apps mais robustos.

Para ver o compilador em ação, você pode conferir nossa [palestra do outono passado](https://www.youtube.com/watch?v=qOQClO3g8-Y). Na época da palestra, tínhamos dados experimentais iniciais de tentar o React Compiler em uma página de instagram.com. Desde então, lançamos o compilador em produção em instagram.com. Também expandimos nossa equipe para acelerar o lançamento em outras superfícies dentro da Meta e para o código aberto. Estamos empolgados com o caminho à frente e teremos mais a compartilhar nos próximos meses.

## Ações {/*actions*/}

Nós [compartilhamos anteriormente](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) que estávamos explorando soluções para enviar dados do cliente para o servidor com Ações do Servidor, para que você possa executar mutações de banco de dados e implementar formulários. Durante o desenvolvimento das Ações do Servidor, estendemos essas APIs para suportar o manuseio de dados em aplicações apenas do cliente também.

Nos referimos a essa coleção mais ampla de recursos simplesmente como "Ações". Ações permitem que você passe uma função para elementos DOM, como [`<form/>`](/reference/react-dom/components/form):

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Pesquisar</button>
</form>
```

A função `action` pode operar de forma síncrona ou assíncrona. Você pode defini-las no lado do cliente usando JavaScript padrão ou no servidor com a diretiva [`'use server'`](/reference/rsc/use-server). Ao usar uma ação, o React gerenciará o ciclo de vida da submissão de dados para você, fornecendo hooks como [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) e [`useActionState`](/reference/react/useActionState) para acessar o estado atual e a resposta da ação do formulário.

Por padrão, as Ações são submetidas dentro de uma [transição](/reference/react/useTransition), mantendo a página atual interativa enquanto a ação está sendo processada. Como as Ações suportam funções assíncronas, também adicionamos a capacidade de usar `async/await` em transições. Isso permite que você mostre uma UI pendente com o estado `isPending` de uma transição quando uma requisição assíncrona, como `fetch`, começa, e mostre a UI pendente durante toda a atualização sendo aplicada.

Junto com as Ações, estamos introduzindo um recurso chamado [`useOptimistic`](/reference/react/useOptimistic) para gerenciar atualizações de estado otimistas. Com esse hook, você pode aplicar atualizações temporárias que são revertidas automaticamente assim que o estado final é confirmado. Para Ações, isso permite que você defina otimisticamente o estado final dos dados no cliente, assumindo que a submissão seja bem-sucedida, e reverta para o valor dos dados recebidos do servidor. Funciona usando `async`/`await` regular, então funciona da mesma forma, esteja você usando `fetch` no cliente ou uma Ação do Servidor do servidor.

Autores de bibliotecas podem implementar props personalizadas `action={fn}` em seus próprios componentes com `useTransition`. Nossa intenção é que as bibliotecas adotem o padrão de Ações ao projetar suas APIs de componentes, para fornecer uma experiência consistente para os desenvolvedores React. Por exemplo, se sua biblioteca fornecer um componente `<Calendar onSelect={eventHandler}>`, considere também expor uma API `<Calendar selectAction={action}>`.

Embora inicialmente tenhamos focado nas Ações do Servidor para transferência de dados cliente-servidor, nossa filosofia para o React é fornecer o mesmo modelo de programação em todas as plataformas e ambientes. Quando possível, se introduzirmos um recurso no cliente, buscamos fazê-lo também funcionar no servidor, e vice-versa. Essa filosofia nos permite criar um único conjunto de APIs que funcionam não importa onde seu aplicativo seja executado, facilitando a atualização para diferentes ambientes mais tarde. 

As Ações já estão disponíveis no canal Canary e serão lançadas na próxima versão do React.

## Novos Recursos no React Canary {/*new-features-in-react-canary*/}

Introduzimos [React Canaries](/blog/2023/05/03/react-canaries) como uma opção para adotar novos recursos estáveis individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável semver. 

Os Canaries são uma mudança na forma como desenvolvemos o React. Anteriormente, recursos eram pesquisados e construídos em privado dentro da Meta, então os usuários só viam o produto final polido quando era lançado como Estável. Com os Canaries, estamos construindo em público com a ajuda da comunidade para finalizar recursos que compartilhamos na série de blogs do React Labs. Isso significa que você ouve sobre novos recursos mais cedo, à medida que estão sendo finalizados em vez de depois de estarem completos.

Componentes do Servidor React, Carregamento de Ativos, Metadados de Documento e Ações já estão disponíveis no React Canary, e adicionamos documentação para esses recursos em react.dev:

- **Diretivas**: [`"use client"`](/reference/rsc/use-client) e [`"use server"`](/reference/rsc/use-server) são recursos do bundler projetados para frameworks React de pilha completa. Eles marcam os "pontos de divisão" entre os dois ambientes: `"use client"` instrui o bundler a gerar uma tag `<script>` (como [Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island)), enquanto `"use server"` diz ao bundler para gerar um endpoint POST (como [tRPC Mutations](https://trpc.io/docs/concepts)). Juntas, elas permitem que você escreva componentes reutilizáveis que compõem a interatividade do lado do cliente com a lógica correspondente do lado do servidor.

- **Metadados de Documento**: adicionamos suporte embutido para renderizar [`<title>`](/reference/react-dom/components/title), [`<meta>`](/reference/react-dom/components/meta) e tags de metadados [`<link>`](/reference/react-dom/components/link) em qualquer lugar na árvore de componentes. Esses funcionam da mesma forma em todos os ambientes, incluindo código totalmente do lado do cliente, SSR e RSC. Isso fornece suporte embutido para recursos pioneiros por bibliotecas como [React Helmet](https://github.com/nfl/react-helmet).

- **Carregamento de Ativos**: integramos Suspense com o ciclo de vida de recursos como folhas de estilos, fontes e scripts para que o React leve isso em conta ao determinar se o conteúdo em elementos como [`<style>`](/reference/react-dom/components/style), [`<link>`](/reference/react-dom/components/link) e [`<script>`](/reference/react-dom/components/script) está pronto para ser exibido. Também adicionamos novas [APIs de Carregamento de Recursos](/reference/react-dom#resource-preloading-apis) como `preload` e `preinit` para fornecer maior controle sobre quando um recurso deve ser carregado e inicializado.

- **Ações**: Como compartilhado acima, adicionamos Ações para gerenciar o envio de dados do cliente para o servidor. Você pode adicionar `action` a elementos como [`<form/>`](/reference/react-dom/components/form), acessar o status com [`useFormStatus`](/reference/react-dom/hooks/useFormStatus), lidar com o resultado com [`useActionState`](/reference/react/useActionState) e atualizar otimisticamente a UI com [`useOptimistic`](/reference/react/useOptimistic).

Como todos esses recursos funcionam juntos, é difícil lançá-los individualmente no canal Estável. Lançar Ações sem os hooks complementares para acessar estados de formulários limitaria a usabilidade prática das Ações. Introduzir componentes do servidor React sem integrar Ações do Servidor complicaria a modificação de dados no servidor. 

Antes que possamos lançar um conjunto de recursos no canal Estável, precisamos garantir que eles funcionem de forma coesa e que os desenvolvedores tenham tudo o que precisam para usá-los em produção. Os React Canaries nos permitem desenvolver esses recursos individualmente e lançar as APIs estáveis de forma incremental até que todo o conjunto de recursos esteja completo.

O conjunto atual de recursos no React Canary está completo e pronto para ser lançado.

## A Próxima Versão Principal do React {/*the-next-major-version-of-react*/}

Após alguns anos de iteração, `react@canary` agora está pronto para ser enviado para `react@latest`. Os novos recursos mencionados acima são compatíveis com qualquer ambiente em que seu aplicativo esteja em execução, fornecendo tudo o que é necessário para uso em produção. Como o Carregamento de Ativos e Metadados de Documento podem ser uma mudança significativa para alguns aplicativos, a próxima versão do React será uma versão principal: **React 19**.

Ainda há mais a ser feito para nos preparar para o lançamento. No React 19, também estamos adicionando melhorias muito solicitadas que requerem mudanças significativas, como suporte a Web Components. Nosso foco agora é concluir essas mudanças, preparar o lançamento, finalizar a documentação para novos recursos e publicar anúncios sobre o que está incluído.

Compartilharemos mais informações sobre tudo que o React 19 inclui, como adotar os novos recursos do cliente e como construir suporte para Componentes do Servidor React nos próximos meses.

## Offscreen (renomeado para Activity). {/*offscreen-renamed-to-activity*/}

Desde nossa última atualização, renomeamos uma capacidade que estamos pesquisando de “Offscreen” para “Activity”. O nome “Offscreen” implicava que se aplicava apenas a partes do aplicativo que não estavam visíveis, mas enquanto pesquisávamos o recurso percebemos que é possível que partes do aplicativo estejam visíveis e inativas, como conteúdo atrás de um modal. O novo nome reflete mais de perto o comportamento de marcar certas partes do aplicativo como “ativas” ou “inativas”.

Activity ainda está em pesquisa e nosso trabalho restante é finalizar os princípios que são expostos aos desenvolvedores de bibliotecas. Nós repriorizamos essa área enquanto focamos em enviar recursos que estão mais completos.

* * *

Além desta atualização, nossa equipe se apresentou em conferências e participou de podcasts para falar mais sobre nosso trabalho e responder perguntas.

- [Sathya Gunasekaran](/community/team#sathya-gunasekaran) falou sobre o React Compiler na conferência [React India](https://www.youtube.com/watch?v=kjOacmVsLSE)

- [Dan Abramov](/community/team#dan-abramov) deu uma palestra na [RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s) intitulada “React de Outra Dimensão”, que explora uma história alternativa de como Componentes do Servidor React e Ações poderiam ter sido criados

- [Dan Abramov](/community/team#dan-abramov) foi entrevistado no podcast [JS Party do Changelog](https://changelog.com/jsparty/311) sobre Componentes do Servidor React

- [Matt Carroll](/community/team#matt-carroll) foi entrevistado no podcast [Front-End Fire](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll), onde discutiu [Os Dois Reacts](https://overreacted.io/the-two-reacts/)

Obrigado a [Lauren Tan](https://twitter.com/potetotes), [Sophie Alpert](https://twitter.com/sophiebits), [Jason Bonta](https://threads.net/someextent), [Eli White](https://twitter.com/Eli_White) e [Sathya Gunasekaran](https://twitter.com/_gsathya) por revisar este post.

Obrigado por ler, e [vejo você no React Conf](https://conf.react.dev/)!